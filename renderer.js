// DOM-Elemente
const urlInput = document.getElementById('url-input');
const formatSelect = document.getElementById('format-select');
const qualitySelect = document.getElementById('quality-select');
const audioQualitySelect = document.getElementById('audio-quality-select');
const videoQualityCard = document.getElementById('video-quality-card');
const audioQualityCard = document.getElementById('audio-quality-card');
const downloadBtn = document.getElementById('download-btn');
const logOutput = document.getElementById('log-output');

// Format-Änderung überwachen
formatSelect.addEventListener('change', () => {
    if (formatSelect.value === 'video') {
        videoQualityCard.style.display = 'block';
        audioQualityCard.style.display = 'none';
    } else {
        videoQualityCard.style.display = 'none';
        audioQualityCard.style.display = 'block';
    }
});

// Log-Funktion
function log(message, type = 'info') {
    const logEntry = document.createElement('div');
    logEntry.className = type;
    logEntry.textContent = message;
    logOutput.appendChild(logEntry);
    logOutput.scrollTop = logOutput.scrollHeight;
}

// Log leeren
function clearLog() {
    logOutput.innerHTML = '';
}

// Download starten
downloadBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    
    if (!url) {
        log('❌ Bitte gib eine URL ein!', 'error');
        return;
    }
    
    // Button deaktivieren
    downloadBtn.disabled = true;
    downloadBtn.textContent = '⏳ Download läuft...';
    clearLog();
    
    log(`📥 Starte Download: ${url}`, 'info');
    
    try {
        // Progress-Listener einrichten
        window.electronAPI.onDownloadProgress((data) => {
            const text = data.trim();
            if (text) {
                // yt-dlp Progress-Parsing
                if (text.includes('[download]')) {
                    log(text, 'progress');
                } else if (text.includes('ERROR') || text.includes('error')) {
                    log(text, 'error');
                } else if (text.includes('WARNING') || text.includes('warning')) {
                    log(text, 'info');
                } else {
                    log(text, 'info');
                }
            }
        });
        
        // Download starten
        const result = await window.electronAPI.downloadVideo({
            url: url,
            format: formatSelect.value,
            quality: qualitySelect.value,
            audioQuality: audioQualitySelect.value,
        });
        
        if (result.success) {
            log('✅ Download erfolgreich abgeschlossen!', 'success');
        }
    } catch (error) {
        log(`❌ Fehler beim Download: ${error.error || error.message}`, 'error');
        if (error.code) {
            log(`Exit Code: ${error.code}`, 'error');
        }
    } finally {
        // Button wieder aktivieren
        downloadBtn.disabled = false;
        downloadBtn.textContent = '📥 Download starten';
        
        // Progress-Listener entfernen
        window.electronAPI.removeDownloadProgressListener();
    }
});

// Enter-Taste für Download
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !downloadBtn.disabled) {
        downloadBtn.click();
    }
});

// Initial: Log leeren
clearLog();

