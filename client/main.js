// main.js
/*
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const statusText = document.getElementById('status-text');
    const voiceButtons = document.querySelectorAll('.voice-button');
    const pageInput = document.getElementById('current-page-input');
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    const totalPages = 45;

    // Audio playback variables
    let pageAudioFiles = [];
    let audioElements = [];
    let currentAudioIndex = 0;
    let isPlaying = false;

    const url = window.location.href.toLowerCase();

    // Quick URL check
    if (url.endsWith('.pdf')) {
        console.log("This page is a PDF based on URL!");
        return true;
    }


    // Play next audio sequentially
    function playNextAudio() {
        if (currentAudioIndex < audioElements.length) {
            const audio = audioElements[currentAudioIndex];
            audio.play().catch(err => console.warn("Autoplay blocked:", err));

            audio.onended = () => {
                currentAudioIndex++;
                playNextAudio();
            };
        } else {
            // Finished all audios
            currentAudioIndex = 0;
            isPlaying = false;
            playIcon?.classList.remove('hidden');
            pauseIcon?.classList.add('hidden');
            playPauseBtn?.classList.remove('bg-green-600');
            statusText.textContent = 'Finished reading.';
        }
    }

    // Play/Pause button
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;

            if (isPlaying) {
                playIcon?.classList.add('hidden');
                pauseIcon?.classList.remove('hidden');
                playPauseBtn.classList.add('bg-green-600');
                statusText.textContent = 'Reading aloud...';

                // Set playback speed
                audioElements.forEach(a => a.playbackRate = parseFloat(speedSlider.value || 1));

                // Start playback
                playNextAudio();
            } else {
                playIcon?.classList.remove('hidden');
                pauseIcon?.classList.add('hidden');
                playPauseBtn.classList.remove('bg-green-600');
                statusText.textContent = 'Paused. Click to continue.';

                // Pause all audios
                audioElements.forEach(a => a.pause());
            }
        });
    }

    // Speed slider
    if (speedSlider && speedValue) {
        speedSlider.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            speedValue.textContent = `${speed}x`;
            audioElements.forEach(a => a.playbackRate = speed);
        });
    }

    // Voice selection buttons
    if (voiceButtons.length > 0) {
        voiceButtons.forEach((btn) => {
            btn.addEventListener('click', (event) => {
                voiceButtons.forEach((b) => {
                    b.classList.remove('selected', 'bg-gray-500');
                    b.classList.add('bg-gray-700');
                });
                event.currentTarget.classList.add('selected', 'bg-gray-500');
                console.log(`Voice selected: ${event.currentTarget.textContent.trim()}`);
            });
        });
    }

    // Page input validation
    if (pageInput) {
        pageInput.addEventListener('change', (event) => {
            let value = parseInt(event.target.value);
            if (isNaN(value) || value < 1) event.target.value = 1;
            else if (value > totalPages) event.target.value = totalPages;
        });
    }
});
*/