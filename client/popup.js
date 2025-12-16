// popup.js
document.addEventListener('DOMContentLoaded', () => {
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const statusText = document.getElementById('status-text');
    const pageInput = document.getElementById('current-page-input');
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    const pageTotal = document.getElementById('pageTotal');

    const totalPages = 45;

    let isPlaying = false;

    playPauseBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "getTabInfo" }, async (res) => {
        if (!res?.isPdf) {
        statusText.textContent = res.url + " is not a PDF.";
        return;
        }
        
        statusText.textContent = " PDF Being Split...";

        const processRes = await fetch('http://localhost:8080/api/pdf/splitPDF', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pdfUrl: res.url })
        });

        if (!processRes.ok) {
            statusText.textContent = " Error splitting PDF.";
            return;
        }

        const processData = await processRes.json();
        
        document.getElementById("pageTotal").textContent = ` / ${processData.length}`;

        statusText.textContent = " Currently Fetching Audio...";

        const audioBatchRes = await fetch('http://localhost:8080/api/pdf/getAudioBatch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pdfUrls: processData })
        });

        if (!audioBatchRes.ok) {
            statusText.textContent = " Error fetching audio.";
            return;
        }

        statusText.textContent = " Audio Ready.";
        
        const audioBatchData = await audioBatchRes.json();

        const audioFiles = audioBatchData.pages.flatMap(page => page.audioFiles); // flatten all pages
        let currentIndex = 0;

        function playNext() {
        if (currentIndex >= audioFiles.length) return; // done
        statusText.textContent = audioFiles[currentIndex];
        const audio = new Audio(audioFiles[currentIndex]);
        audio.play();
        audio.onended = () => {
            currentIndex++;
            playNext(); // play the next file automatically
        };
        }

        playNext(); // start playing

        
        document.getElementById("pageTotal").textContent = ` / no bugs`;


        
        isPlaying = !isPlaying;

        playIcon.classList.toggle('hidden', isPlaying);
        pauseIcon.classList.toggle('hidden', !isPlaying);

        statusText.textContent = isPlaying
        ? 'Reading aloud...'
        : 'Paused. Click to continue.';
        });
        });
        speedSlider.addEventListener('input', (e) => {
            speedValue.textContent = `${e.target.value}x`;
        });

    pageInput.addEventListener('change', (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > totalPages) value = totalPages;
        e.target.value = value;
    });
});
