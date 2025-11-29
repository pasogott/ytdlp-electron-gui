const { contextBridge, ipcRenderer } = require('electron');

// Sichere API für Renderer-Prozess
contextBridge.exposeInMainWorld('electronAPI', {
  downloadVideo: (options) => ipcRenderer.invoke('download-video', options),
  selectDownloadPath: () => ipcRenderer.invoke('select-download-path'),
  onDownloadProgress: (callback) => {
    ipcRenderer.on('download-progress', (event, data) => callback(data));
  },
  removeDownloadProgressListener: () => {
    ipcRenderer.removeAllListeners('download-progress');
  },
});

