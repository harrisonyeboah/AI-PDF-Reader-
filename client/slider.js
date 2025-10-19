
document.addEventListener('DOMContentLoaded', () => {
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
  
    if (speedSlider && speedValue) {
      speedSlider.addEventListener('input', () => {
        speedValue.textContent = speedSlider.value + 'x';
      });
    }
  });
  