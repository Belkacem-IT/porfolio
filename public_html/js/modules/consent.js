export function initConsent() {
  const HAS_CONSENT_KEY = 'gv_analytics_consent';
  
  // Check if consent is already set
  const consentState = localStorage.getItem(HAS_CONSENT_KEY);
  
  if (consentState === 'granted') {
    updateGtagConsent('granted');
    return; // Already consented, do nothing
  } else if (consentState === 'denied') {
    updateGtagConsent('denied');
    return; // Already denied, do nothing
  }

  // Not set yet: create the banner
  buildBanner();
}

function updateGtagConsent(status) {
  if (typeof gtag !== 'function') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){dataLayer.push(arguments);}
  }
  
  gtag('consent', 'update', {
    'analytics_storage': status,
    'ad_storage': status,
    'ad_user_data': status,
    'ad_personalization': status
  });
}

function buildBanner() {
  const banner = document.createElement('div');
  banner.className = 'consent-banner';
  banner.id = 'consentBanner';
  
  banner.innerHTML = `
    <div class="consent-content">
      <h3 data-i18n="consent.title">🛡️ Mode de Consentement</h3>
      <p data-i18n="consent.text">Pour analyser le trafic et améliorer le portfolio, ce site utilise Google Analytics. J'ai besoin de votre accord (RGPD).</p>
      <div class="consent-buttons">
        <button class="consent-btn btn-decline" id="btnConsentDecline" data-i18n="consent.decline">Limiter</button>
        <button class="consent-btn btn-accept" id="btnConsentAccept" data-i18n="consent.accept">Accepter</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  // Translate banner if i18next is already loaded and ready
  if (typeof i18next !== 'undefined' && i18next.isInitialized) {
    banner.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.innerHTML = i18next.t(key);
    });
    // Parse twemoji specifically in the banner
    if (typeof twemoji !== 'undefined') {
      twemoji.parse(banner, { folder: 'svg', ext: '.svg', base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/' });
    }
  }

  // Add event listeners with slight delay for entrance animation
  setTimeout(() => banner.classList.add('visible'), 100);

  document.getElementById('btnConsentAccept').addEventListener('click', () => {
    updateGtagConsent('granted');
    localStorage.setItem('gv_analytics_consent', 'granted');
    closeBanner(banner);
  });

  document.getElementById('btnConsentDecline').addEventListener('click', () => {
    updateGtagConsent('denied');
    localStorage.setItem('gv_analytics_consent', 'denied');
    closeBanner(banner);
  });
}

function closeBanner(banner) {
  banner.classList.remove('visible');
  setTimeout(() => {
    if (banner.parentNode) {
      banner.parentNode.removeChild(banner);
    }
  }, 400); // Wait for transition
}
