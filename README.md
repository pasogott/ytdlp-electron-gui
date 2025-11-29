# yt-dlp GUI

Eine moderne GUI für das yt-dlp Command-Line-Tool.

## 📋 Voraussetzungen

Bevor du die App verwenden kannst, müssen folgende Tools installiert sein:

### 1. Node.js und npm

**macOS:**
```bash
# Mit Homebrew
brew install node

# Prüfen ob installiert:
node --version  # sollte v18 oder höher sein
npm --version
```

**Windows:**
- Lade Node.js von [nodejs.org](https://nodejs.org/) herunter und installiere es
- npm wird automatisch mit Node.js installiert

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Oder mit Homebrew
brew install node
```

### 2. yt-dlp

Die App benötigt `yt-dlp` als Command-Line-Tool im System-PATH.

**macOS:**
```bash
# Mit Homebrew (empfohlen)
brew install yt-dlp

# Oder mit pip
pip3 install yt-dlp
```

**Windows:**
```bash
# Mit pip
pip install yt-dlp

# Oder lade die .exe von https://github.com/yt-dlp/yt-dlp/releases
# und platziere sie in einem Ordner, der im PATH ist
```

**Linux:**
```bash
# Mit pip
pip3 install yt-dlp

# Oder mit apt (falls verfügbar)
sudo apt install yt-dlp
```

**Prüfen ob yt-dlp installiert ist:**
```bash
yt-dlp --version
```

### 3. FFmpeg (Optional, aber empfohlen)

FFmpeg wird für Audio-Extraktion und Video-Konvertierung benötigt.

**macOS:**
```bash
brew install ffmpeg
```

**Windows:**
- Lade FFmpeg von [ffmpeg.org](https://ffmpeg.org/download.html) herunter
- Füge den `bin`-Ordner zum System-PATH hinzu

**Linux:**
```bash
sudo apt install ffmpeg
```

**Prüfen ob FFmpeg installiert ist:**
```bash
ffmpeg -version
```

---

## 🚀 Installation und Verwendung

### 1. Dependencies installieren

```bash
npm install
```

### 2. App starten

```bash
npm start
```

Die App öffnet sich in einem neuen Fenster.

---

## 📦 Build für Distribution

### Build ausführen

**Wichtig:** Stelle sicher, dass `yt-dlp` im System-PATH verfügbar ist, bevor du baust!

```bash
# Für macOS
npm run build:mac

# Für Windows
npm run build:win

# Für Linux
npm run build:linux

# Für alle Plattformen
npm run build
```

Die kompilierten Apps findest du im `dist/` Ordner.

### Build-Formate

- **macOS:** `.dmg` und `.zip`
- **Windows:** `.exe` (NSIS Installer) und portable Version
- **Linux:** `.AppImage` und `.deb`

---

## ✨ Features

- ✨ Moderne Web-basierte Oberfläche
- 🎨 Schönes, responsives Design
- 📥 Einfache URL-Eingabe
- 🎬 Dropdown-Menüs für Audio- und Video-Optionen
- 📊 Live-Download-Fortschritt
- 📦 Einfacher Single-File-Export
- 🎯 Unterstützt alle Plattformen, die yt-dlp unterstützt

---

## 🐛 Fehlerbehebung

### "yt-dlp: command not found"

Stelle sicher, dass `yt-dlp` im PATH ist:
```bash
# Prüfen
which yt-dlp

# Falls nicht gefunden, PATH prüfen
echo $PATH
```

### "FFmpeg not found" (bei Audio-Downloads)

Installiere FFmpeg (siehe Voraussetzungen oben).

### Node.js/npm nicht gefunden

Stelle sicher, dass Node.js korrekt installiert ist:
```bash
node --version
npm --version
```

Falls nicht installiert, siehe Voraussetzungen oben.

