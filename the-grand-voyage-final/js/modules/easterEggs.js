export function initEasterEggs() {
  // ── EASTER EGGS ──
  let clickCount = 0;
  const counter = document.getElementById('clickCounter');
  if (counter) {
    document.addEventListener('click', () => {
      clickCount++;
      counter.textContent = `CLICKS: ${clickCount}`;
      if (clickCount === 42) counter.classList.add('active');
    });
  }

  let konamiCode = [38,38,40,40,37,39,37,39,66,65];
  let konamiIndex = 0;
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        const toast = document.getElementById('konamiToast');
        if (toast) {
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 4000);
        }
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  // Attach global light switch logic for button (since module exports aren't global)
  window.toggleLight = function() {
    const section = document.getElementById('souterrain');
    const sw = document.getElementById('lightSwitch');
    const label = sw?.querySelector('.switch-label');
    if (section) section.classList.toggle('lit');
    if (sw) sw.classList.toggle('on');
    if (label) {
      if (section?.classList.contains('lit')) {
        label.setAttribute('data-i18n', 'souterrain.switch_off');
        label.textContent = window.i18next ? window.i18next.t('souterrain.switch_off') : 'Éteindre';
      } else {
        label.setAttribute('data-i18n', 'souterrain.switch');
        label.textContent = window.i18next ? window.i18next.t('souterrain.switch') : 'Allumer';
      }
    }
  }
}
