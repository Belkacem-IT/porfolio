export function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const flashlight = document.getElementById('cursorFlashlight');
  let mx = 0, my = 0, dx = 0, dy = 0;

  document.addEventListener('mousemove', (e) => { 
    mx = e.clientX; 
    my = e.clientY; 
  });

  function animCursor() {
    dx += (mx - dx) * 0.15; 
    dy += (my - dy) * 0.15;
    dot.style.left = mx + 'px'; 
    dot.style.top = my + 'px';
    ring.style.left = dx + 'px'; 
    ring.style.top = dy + 'px';
    if (flashlight) {
      flashlight.style.left = mx + 'px';
      flashlight.style.top = my + 'px';
    }
    requestAnimationFrame(animCursor);
  }
  animCursor();

  document.querySelectorAll('a, button, .light-switch, .project-card, .cyber-btn, .f-tab, .f-submit, .chk').forEach(el => {
    // Ne pas appliquer l'effet de gros curseur sur le dropdown de traduction
    if (el.closest('.lang-orbit')) return;
    
    el.addEventListener('mouseenter', () => ring.classList.add('hover-state'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover-state'));
  });
}
