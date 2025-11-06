// This is mainly geared towards the dom. 
document.addEventListener('DOMContentLoaded', () => {
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const statusText = document.getElementById('status-text');
    const voiceButtons = document.querySelectorAll('.voice-button');
    const pageInput = document.getElementById('current-page-input');
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    const totalPages = 45;
    let isPlaying = false;
  
  /* This is my toggle button for when the button is playing. 
  Think when you click on the button the class button color will change. Other wise 
  the button color will not change.
  */
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                playIcon?.classList.add('hidden');
                pauseIcon?.classList.remove('hidden');
                playPauseBtn.classList.add('bg-green-600');
                statusText.textContent = 'Reading aloud...';
            } else {
                playIcon?.classList.remove('hidden');
                pauseIcon?.classList.add('hidden');
                playPauseBtn.classList.remove('bg-green-600');
                statusText.textContent = 'Paused. Click to continue.';
            }
        });
    }
  
  /* This updates the dom in the speed slider. basically. changeing the value from 1x to 2x   */
    if (speedSlider && speedValue) {
        speedSlider.addEventListener('input', (e) => {
            speedValue.textContent = `${e.target.value}x`;
        });
    }
  
  /* Get rid of  */
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
  
  /* This is for page dom basically. This will help the user choose the page number this is all basically for the front end.  */
    if (pageInput) {
        pageInput.addEventListener('change', (event) => {
            let value = parseInt(event.target.value);
            if (isNaN(value) || value < 1) event.target.value = 1;
            else if (value > totalPages) event.target.value = totalPages;
        });
    }
  });
  
  
  
  