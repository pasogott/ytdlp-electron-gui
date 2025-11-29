const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'assets', 'icon.png'), // Optional: Icon hinzufügen
  });

  mainWindow.loadFile('index.html');

  // DevTools in Entwicklung öffnen
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handler für Downloads
ipcMain.handle('download-video', async (event, { url, format, quality, audioQuality }) => {
  return new Promise((resolve, reject) => {
    // yt-dlp Pfad finden (versuche zuerst im PATH, dann Standard-Pfade)
    let ytdlpCommand;
    if (process.platform === 'win32') {
      ytdlpCommand = 'yt-dlp.exe';
    } else {
      // Auf macOS/Linux: versuche Standard-Pfade
      const possiblePaths = [
        '/opt/homebrew/bin/yt-dlp',  // Homebrew auf Apple Silicon
        '/usr/local/bin/yt-dlp',      // Homebrew auf Intel
        '/usr/bin/yt-dlp',            // System
        'yt-dlp'                      // Im PATH
      ];
      ytdlpCommand = possiblePaths.find(p => {
        try {
          fs.accessSync(p, fs.constants.F_OK);
          return true;
        } catch {
          return false;
        }
      }) || 'yt-dlp'; // Fallback zu PATH
    }
    
    // Download-Pfad (Standard: Downloads-Ordner)
    const downloadPath = path.join(os.homedir(), 'Downloads');
    
    // yt-dlp Optionen aufbauen
    const args = [];
    
    // Output-Template (mit Anführungszeichen für Shell-Sicherheit, aber shell: false verwendet)
    args.push('-o', path.join(downloadPath, '%(title)s.%(ext)s'));
    
    // Format-Optionen
    if (format === 'audio') {
      if (audioQuality === 'best') {
        args.push('-f', 'bestaudio/best');
      } else if (audioQuality === 'worst') {
        args.push('-f', 'worstaudio/worst');
      } else {
        const bitrate = audioQuality.replace('k', '');
        args.push('-f', `bestaudio[abr<=${bitrate}]/best`);
      }
      // Audio als MP3 extrahieren
      args.push('--extract-audio', '--audio-format', 'mp3', '--audio-quality', '192K');
    } else {
      // Video
      if (quality === 'best') {
        args.push('-f', 'bestvideo+bestaudio/best');
      } else if (quality === 'worst') {
        args.push('-f', 'worstvideo+worstaudio/worst');
      } else {
        const height = quality.replace('p', '');
        args.push('-f', `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`);
      }
    }
    
    // Progress-Output
    args.push('--progress', '--newline');
    
    // URL hinzufügen
    args.push(url);
    
    // yt-dlp Prozess starten
    const ytdlp = spawn(ytdlpCommand, args, {
      shell: false,
    });
    
    let output = '';
    let errorOutput = '';
    
    ytdlp.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      // Progress-Events an Renderer senden
      event.sender.send('download-progress', text);
    });
    
    ytdlp.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      // Auch stderr kann Progress-Informationen enthalten
      event.sender.send('download-progress', text);
    });
    
    ytdlp.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, output });
      } else {
        reject({ success: false, error: errorOutput || output, code });
      }
    });
    
    ytdlp.on('error', (error) => {
      reject({ success: false, error: error.message });
    });
  });
});

// IPC Handler für Download-Pfad-Auswahl
ipcMain.handle('select-download-path', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

