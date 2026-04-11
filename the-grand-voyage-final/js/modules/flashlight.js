/**
 * Flashlight Effect for the Souterrain section
 * Cursor becomes a flashlight that reveals hidden IT secrets
 */
export function initFlashlight() {
  const section = document.getElementById('souterrain');
  const overlay = document.getElementById('flashlightOverlay');
  const switchEl = document.getElementById('lightSwitch');

  if (!section || !overlay) return;

  let isLit = false;

  // Track mouse position within the souterrain section
  section.addEventListener('mousemove', (e) => {
    if (isLit) return; // Don't need flashlight when lights are on

    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // The flashlight points top-left, the beam goes from (x, y) to (x - 100, y - 100)
    // We adjust the overlay gradient position to be centered at the end of the beam:
    overlay.style.setProperty('--fx', (x - 80) + 'px');
    overlay.style.setProperty('--fy', (y - 80) + 'px');
  });

  // Hide normal cursor elements when in this section
  section.addEventListener('mouseenter', () => {
    if (!isLit) {
      const dot = document.getElementById('cursorDot');
      const ring = document.getElementById('cursorRing');
      const flash = document.getElementById('cursorFlashlight');
      if (dot) dot.style.opacity = '0';
      if (ring) ring.style.opacity = '0';
      if (flash) flash.style.opacity = '1';
    }
  });

  section.addEventListener('mouseleave', () => {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    const flash = document.getElementById('cursorFlashlight');
    if (dot) dot.style.opacity = '1';
    if (ring) ring.style.opacity = '1';
    if (flash) flash.style.opacity = '0';
  });

  // Light switch toggle
  window.toggleLight = function () {
    isLit = !isLit;
    section.classList.toggle('lit', isLit);
    if (switchEl) {
      switchEl.classList.toggle('on', isLit);
      const label = switchEl.querySelector('.switch-label');
      if (label) label.textContent = isLit ? 'Éteindre' : 'Allumer';
    }

    // Restore normal cursor when lights are on
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    const flash = document.getElementById('cursorFlashlight');
    if (isLit) {
      if (dot) dot.style.opacity = '1';
      if (ring) ring.style.opacity = '1';
      if (flash) flash.style.opacity = '0';
    } else {
      // Check if mouse is currently over the section
      if (section.matches(':hover')) {
        if (dot) dot.style.opacity = '0';
        if (ring) ring.style.opacity = '0';
        if (flash) flash.style.opacity = '1';
      }
    }
  };
}
