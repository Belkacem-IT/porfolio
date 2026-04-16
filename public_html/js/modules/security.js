/**
 * Module de sécurité du portfolio
 * Empêche logiciellement le clic-droit, le copier-coller et l'inspecteur.
 * Détecte les bots via l'empreinte webdriver (Honeypot).
 */

(function initSecurity() {
  // 1. Anti-Clic-Droit & Sélection
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('selectstart', (e) => e.preventDefault());
  document.addEventListener('dragstart', (e) => e.preventDefault()); // Anti drag-and-drop image

  // 2. Anti-Copier/Coller (clavier)
  document.addEventListener('keydown', (e) => {
    // Bloquer Ctrl+C / Cmd+C / Ctrl+X / Ctrl+V
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'v' || e.key === 'V')) {
      e.preventDefault();
    }
    
    // Bloquer DevTools (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
    if (
      e.key === 'F12' ||
      ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'i' || e.key === 'I' || e.key === 'j' || e.key === 'J' || e.key === 'c' || e.key === 'C')) ||
      ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U'))
    ) {
      e.preventDefault();
    }
  });

  // 3. Anti-Copier/Coller (événements natifs)
  ['copy', 'cut', 'paste'].forEach(evt => {
    document.addEventListener(evt, (e) => {
      e.preventDefault();
    });
  });

  // 4. Anti-Capture d'Écran — Stratégie Renforcée
  // a) Touche PrintScreen (Windows) : pollue le presse-papier + écran noir 3s
  document.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen') {
      navigator.clipboard.writeText('⛔ Capture désactivée — raberbelkacem.com').catch(() => {});
      document.body.classList.add('anti-capture-mode');
      setTimeout(() => document.body.classList.remove('anti-capture-mode'), 3000);
    }
  });

  // b) Raccourcis clavier capture Mac (Cmd+Shift+3 / Cmd+Shift+4 / Cmd+Shift+5)
  document.addEventListener('keydown', (e) => {
    if (e.metaKey && e.shiftKey && ['3','4','5','6'].includes(e.key)) {
      e.preventDefault();
      document.body.classList.add('anti-capture-mode');
      setTimeout(() => document.body.classList.remove('anti-capture-mode'), 2000);
    }
  });

  // c) CSS Watermark dynamique horodaté — toutes les captures contiennent l'heure et le domaine
  function injectWatermark() {
    const existing = document.getElementById('_wm');
    if (existing) existing.remove();
    const wm = document.createElement('div');
    wm.id = '_wm';
    const angle = Math.floor(Math.random() * 30) - 15;
    const ts = new Date().toLocaleTimeString('fr-FR');
    wm.style.cssText = `
      position:fixed; inset:0; z-index:2147483640; pointer-events:none;
      display:flex; align-items:center; justify-content:center;
      transform:rotate(${angle}deg);
      font-family:'Space Grotesk',monospace;
      font-size:clamp(12px,2vw,18px); font-weight:700;
      color:rgba(255,255,255,0.04); user-select:none;
      white-space:nowrap; letter-spacing:4px; text-transform:uppercase;
    `;
    wm.textContent = `raberbelkacem.com · ${ts} · CONFIDENTIEL`;
    document.body.appendChild(wm);
  }
  injectWatermark();
  setInterval(injectWatermark, 8000);

  // 5. Honeypot & Anti-Bot Basique
  function detectBot() {
    let isBot = false;

    // Détection de base: headless browsers via l'object navigator.webdriver (Selenium, Puppeteer)
    if (navigator.webdriver) {
      isBot = true;
    }

    // Détection des user-agents "vides" ou suspects très utilisés par des scrapers
    const ua = navigator.userAgent || '';
    if (ua === '' || ua.includes('HeadlessChrome') || ua.includes('PhantomJS')) {
      isBot = true;
    }

    // Réaction au bot
    if (isBot) {
      // Destruction immédiate du rendu HTML
      document.documentElement.innerHTML = `
        <body style="background:#000; color:#0f0; font-family:monospace; display:flex; align-items:center; justify-content:center; height:100vh; overflow:hidden; margin:0;">
          <div style="text-align:center;">
            <h1>🛡️ ACCÈS REFUSÉ 🛡️</h1>
            <p>Comportement automatisé détecté.</p>
          </div>
        </body>
      `;
      
      // Bloque l'exécution d'autres scripts potentiels
      throw new Error('Halt: Bot detected.');
    }
  }

  // Lancer la détection au chargement
  detectBot();
})();
