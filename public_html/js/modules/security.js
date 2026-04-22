/**
 * Module de sécurité du portfolio — v3.0
 * ─────────────────────────────────────────
 * 1. Anti clic-droit
 * 2. Anti inspecteur (F12, DevTools)
 * 3. Anti téléchargement de photos (drag, save, long-press)
 * 4. Anti code source (Ctrl+U, view-source)
 * 5. Anti copier/coller
 * 6. Anti capture d'écran
 * 7. Anti scraping (bot detection, DevTools timing)
 * 8. Anti scraping d'email (reconstruction par calcul mathématique)
 */

(function initSecurity() {

  // ═══════════════════════════════════════════════════════
  // 1. ANTI CLIC-DROIT & ANTI SÉLECTION
  // ═══════════════════════════════════════════════════════
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('selectstart', (e) => {
    // Autoriser la sélection dans les champs de formulaire
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    e.preventDefault();
  });

  // ═══════════════════════════════════════════════════════
  // 2. ANTI TÉLÉCHARGEMENT DE PHOTOS
  // ═══════════════════════════════════════════════════════
  // a) Bloque le drag-and-drop global (empêche de glisser les images vers le bureau)
  document.addEventListener('dragstart', (e) => e.preventDefault());

  // b) Bloque le long-press / save-as sur mobile et desktop pour les images
  document.querySelectorAll('img').forEach(img => {
    img.setAttribute('oncontextmenu', 'return false;');
    img.setAttribute('draggable', 'false');
  });

  // c) Observateur pour les nouvelles images ajoutées dynamiquement au DOM
  const imgObserver = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.tagName === 'IMG') {
          node.setAttribute('oncontextmenu', 'return false;');
          node.setAttribute('draggable', 'false');
        }
        if (node.querySelectorAll) {
          node.querySelectorAll('img').forEach(img => {
            img.setAttribute('oncontextmenu', 'return false;');
            img.setAttribute('draggable', 'false');
          });
        }
      });
    });
  });
  imgObserver.observe(document.body, { childList: true, subtree: true });

  // ═══════════════════════════════════════════════════════
  // 3. ANTI INSPECTEUR & ANTI CODE SOURCE
  // ═══════════════════════════════════════════════════════
  document.addEventListener('keydown', (e) => {
    const k = e.key;
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;

    // Autoriser le copier/coller UNIQUEMENT dans les inputs et textareas
    const isFormField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);

    // F12 : bloqué
    if (k === 'F12') { e.preventDefault(); return; }

    // Ctrl+Shift+I (Inspecteur), Ctrl+Shift+J (Console), Ctrl+Shift+C (Pick element)
    if (ctrl && shift && ['i', 'I', 'j', 'J', 'c', 'C'].includes(k)) { e.preventDefault(); return; }

    // Ctrl+U (Afficher la source)
    if (ctrl && (k === 'u' || k === 'U')) { e.preventDefault(); return; }

    // Ctrl+S (Enregistrer la page)
    if (ctrl && (k === 's' || k === 'S')) { e.preventDefault(); return; }

    // Ctrl+P (Imprimer)
    if (ctrl && (k === 'p' || k === 'P')) { e.preventDefault(); return; }

    // Anti copier/coller sauf dans les formulaires
    if (!isFormField && ctrl && ['c', 'C', 'x', 'X', 'v', 'V', 'a', 'A'].includes(k)) {
      e.preventDefault();
      return;
    }
  });

  // Anti copier/coller via événements natifs (sauf formulaires)
  ['copy', 'cut', 'paste'].forEach(evt => {
    document.addEventListener(evt, (e) => {
      const isFormField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
      if (!isFormField) e.preventDefault();
    });
  });

  // ═══════════════════════════════════════════════════════
  // 4. ANTI CAPTURE D'ÉCRAN
  // ═══════════════════════════════════════════════════════
  // a) PrintScreen (Windows)
  document.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen') {
      navigator.clipboard.writeText('⛔ Capture désactivée — raberbelkacem.com').catch(() => {});
      document.body.classList.add('anti-capture-mode');
      setTimeout(() => document.body.classList.remove('anti-capture-mode'), 3000);
    }
  });

  // b) Cmd+Shift+3/4/5/6 (Mac)
  document.addEventListener('keydown', (e) => {
    if (e.metaKey && e.shiftKey && ['3', '4', '5', '6'].includes(e.key)) {
      e.preventDefault();
      document.body.classList.add('anti-capture-mode');
      setTimeout(() => document.body.classList.remove('anti-capture-mode'), 2000);
    }
  });

  // c) Bloque l'impression (Ctrl+P / Cmd+P déjà géré + CSS @media print)
  window.addEventListener('beforeprint', () => {
    document.body.classList.add('anti-capture-mode');
  });
  window.addEventListener('afterprint', () => {
    setTimeout(() => document.body.classList.remove('anti-capture-mode'), 500);
  });

  // ═══════════════════════════════════════════════════════
  // 5. ANTI SCRAPING — DÉTECTION DE BOTS
  // ═══════════════════════════════════════════════════════
  function detectBot() {
    let isBot = false;

    // a) Détection headless browsers (Selenium, Puppeteer, Playwright)
    if (navigator.webdriver) isBot = true;

    // b) User-Agent suspects
    const ua = navigator.userAgent || '';
    const botSignatures = [
      'HeadlessChrome', 'PhantomJS', 'Nightmare', 'Electron',
      'SlimerJS', 'CasperJS', 'scrapy', 'python-requests',
      'curl', 'wget', 'Go-http-client', 'java/', 'libwww',
      'HttpClient', 'node-fetch', 'axios', 'Googlebot-Image'
    ];
    if (ua === '' || botSignatures.some(sig => ua.toLowerCase().includes(sig.toLowerCase()))) {
      isBot = true;
    }

    // c) Détection propriétés fantômes des navigateurs headless
    if (
      window._phantom || window.__nightmare || window.callPhantom ||
      navigator.languages === '' || navigator.languages.length === 0 ||
      (window.chrome && !window.chrome.runtime)
    ) {
      // Possible headless, on renforce la détection
      if (navigator.plugins.length === 0 && !('ontouchstart' in window)) {
        isBot = true;
      }
    }

    if (isBot) {
      document.documentElement.innerHTML = `
        <body style="background:#000; color:#0f0; font-family:monospace; display:flex; align-items:center; justify-content:center; height:100vh; overflow:hidden; margin:0;">
          <div style="text-align:center;">
            <h1>🛡️ ACCÈS REFUSÉ 🛡️</h1>
            <p>Comportement automatisé détecté.</p>
          </div>
        </body>
      `;
      throw new Error('Halt: Bot detected.');
    }
  }
  detectBot();

  // ═══════════════════════════════════════════════════════
  // 6. ANTI DEVTOOLS (Détection par timing)
  // ═══════════════════════════════════════════════════════
  // Quand DevTools est ouvert, console.log avec un objet custom est lent
  // On détecte cet écart de timing pour avertir
  let devtoolsWarned = false;
  const devtoolsCheck = setInterval(() => {
    const el = new Image();
    let isOpen = false;
    Object.defineProperty(el, 'id', {
      get: () => { isOpen = true; }
    });
    console.debug(el);
    if (isOpen && !devtoolsWarned) {
      devtoolsWarned = true;
      // On ne détruit pas la page mais on avertit une seule fois
      console.clear();
      console.log(
        '%c⛔ ACCÈS NON AUTORISÉ',
        'font-size: 40px; font-weight: bold; color: #ef4444; text-shadow: 2px 2px #000;'
      );
      console.log(
        '%cL\'inspection de ce site est surveillée et interdite.\n© Belkacem Raber — raberbelkacem.com',
        'font-size: 14px; color: #6366f1; font-family: monospace;'
      );
    }
  }, 2000);

  // ═══════════════════════════════════════════════════════
  // 7. ANTI SCRAPING D'EMAIL — Reconstruction par calcul
  // ═══════════════════════════════════════════════════════
  // L'email n'apparaît NULLE PART en clair dans le code source.
  // Chaque caractère est stocké comme code ASCII décalé de +7.
  // Aucun bot/spider ne peut lire l'email sans exécuter le JS.

  /**
   * Décode un tableau de codes ASCII décalés.
   * Chaque code = charCode réel + 7
   * Email décodé (invisible dans le code source) :
   *  c=99+7=106, o=111+7=118, n=110+7=117, t=116+7=123, a=97+7=104, c=99+7=106, t=116+7=123
   *  @=64+7=71
   *  c=106, o=118, n=117, n=117, e=101+7=108, c=106, t=123, y=121+7=128, s=115+7=122
   *  -=45+7=52
   *  s=122, i=105+7=112, w=119+7=126, a=104, n=117
   *  .=46+7=53
   *  n=117, e=108, t=123
   */
  const _eK = [106,118,117,123,104,106,123,71,121,104,105,108,121,105,108,115,114,104,106,108,116,53,106,118,116];
  const _eS = 7; // Décalage

  function _decodeEmail() {
    return _eK.map(c => String.fromCharCode(c - _eS)).join('');
  }

  function revealEmails() {
    const email = _decodeEmail();

    // a) Révèle les éléments avec data-email-calc="true"
    document.querySelectorAll('[data-email-calc]').forEach(el => {
      if (el.classList.contains('obf-em') || el.classList.contains('email-text')) {
        el.textContent = email;
      }
      if (el.tagName === 'A' || el.classList.contains('obf-email-link')) {
        el.setAttribute('href', 'mailto:' + email);
      }
    });

    // b) Rétrocompatibilité : ancien système data-u / data-d / data-t
    document.querySelectorAll('.obf-em, .obf-email-link').forEach(el => {
      // Si déjà géré par data-email-calc, on skip
      if (el.hasAttribute('data-email-calc')) return;

      const u = el.getAttribute('data-u');
      const d = el.getAttribute('data-d');
      const t = el.getAttribute('data-t');
      if (u && d && t) {
        const legacy = u + '@' + d + '.' + t;
        if (el.classList.contains('obf-em')) {
          el.textContent = legacy;
        }
        if (el.classList.contains('obf-email-link') || el.tagName === 'A') {
          el.setAttribute('href', 'mailto:' + legacy);
        }
      }
    });
  }

  // Délai pour bypass les bots qui font un snapshot au chargement
  setTimeout(revealEmails, 400);

  // ═══════════════════════════════════════════════════════
  // 8. HONEYPOT ANTI-SCRAPING PASSIF
  // ═══════════════════════════════════════════════════════
  // Injecte un faux email invisible dans le DOM.
  // Les bots qui scrapent le HTML vont récolter ce piège.
  const honeypot = document.createElement('a');
  honeypot.href = 'mailto:trap-bot-do-not-use@fakemail.invalid';
  honeypot.textContent = 'admin@raberbelkacem.com';
  honeypot.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;';
  honeypot.setAttribute('tabindex', '-1');
  honeypot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(honeypot);

})();
