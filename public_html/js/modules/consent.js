export function initConsent() {
  const HAS_CONSENT_KEY = 'gv_analytics_consent';
  const consentState = localStorage.getItem(HAS_CONSENT_KEY);

  if (consentState === 'granted') { updateGtagConsent('granted'); return; }
  if (consentState === 'denied')  { updateGtagConsent('denied');  return; }

  buildBanner();
}

function updateGtagConsent(status) {
  if (typeof gtag !== 'function') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){dataLayer.push(arguments);}
  }
  gtag('consent', 'update', {
    analytics_storage: status, ad_storage: status,
    ad_user_data: status, ad_personalization: status
  });
}

function buildBanner() {
  if (!document.getElementById('consentStyle')) {
    const style = document.createElement('style');
    style.id = 'consentStyle';
    style.textContent = `
      @keyframes glassFadeIn {
        from { opacity: 0; transform: translateY(20px) scale(0.95); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes signalWave {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 1; }
      }
      @keyframes subtlePulse {
        0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(167,139,250,0); }
        50% { transform: scale(1.02); box-shadow: 0 0 16px rgba(167,139,250,0.3); }
      }

      .consent-banner {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 310px;
        z-index: 99998;
        opacity: 0;
        pointer-events: none;
      }
      .consent-banner.visible {
        animation: glassFadeIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
        pointer-events: auto;
      }
      
      .consent-glass {
        position: relative;
        background: rgba(12, 14, 28, 0.75);
        backdrop-filter: blur(28px) saturate(180%);
        -webkit-backdrop-filter: blur(28px) saturate(180%);
        border-radius: 20px;
        padding: 24px 20px 20px;
        text-align: center;
        border: 1px solid rgba(167,139,250,0.25);
        box-shadow: 
          0 20px 40px rgba(0,0,0,0.5),
          0 0 40px rgba(167,139,250,0.1),
          inset 0 1px 0 rgba(255,255,255,0.1);
        overflow: hidden;
      }

      /* Subtle top specular highlight */
      .consent-glass::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
        opacity: 0.6;
      }

      /* Icon styling */
      .consent-icon {
        position: relative;
        width: 48px; height: 48px;
        margin: 0 auto 14px;
        display: flex; align-items: center; justify-content: center;
        background: radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%);
      }
      .consent-icon svg {
        color: rgba(167,139,250,0.9);
        width: 26px; height: 26px;
        display: block;
      }
      .consent-icon svg path:nth-child(1) { animation: signalWave 1.5s ease-in-out infinite alternate; animation-delay: 0s; }
      .consent-icon svg path:nth-child(2) { animation: signalWave 1.5s ease-in-out infinite alternate; animation-delay: 0.2s; }
      .consent-icon svg path:nth-child(3) { animation: signalWave 1.5s ease-in-out infinite alternate; animation-delay: 0.4s; }
      .consent-icon svg path:nth-child(4) { animation: signalWave 1.5s ease-in-out infinite alternate; animation-delay: 0.6s; }

      .consent-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 16px; font-weight: 700;
        color: #fff;
        margin-bottom: 8px;
        letter-spacing: 0.5px;
      }

      .consent-text {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 11px;
        color: rgba(255,255,255,0.55);
        line-height: 1.5;
        margin-bottom: 22px;
        padding: 0 10px;
      }

      /* Buttons */
      .consent-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }
      
      .consent-btn {
        flex: 1;
        padding: 10px 0;
        border-radius: 10px;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 12px; font-weight: 600;
        cursor: pointer;
        transition: all 0.25s ease;
      }

      .btn-decline {
        background: transparent;
        color: rgba(255,255,255,0.4);
        border: 1px solid rgba(255,255,255,0.1);
      }
      .btn-decline:hover {
        background: rgba(255,255,255,0.08);
        color: rgba(255,255,255,0.75);
        border-color: rgba(255,255,255,0.25);
      }

      .btn-accept {
        background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(167,139,250,0.2));
        color: #fff;
        border: 1px solid rgba(167,139,250,0.4);
        box-shadow: 0 0 15px rgba(167,139,250,0.15);
        animation: subtlePulse 3s ease-in-out infinite;
      }
      .btn-accept:hover {
        background: linear-gradient(135deg, rgba(99,102,241,0.4), rgba(167,139,250,0.4));
        box-shadow: 0 0 25px rgba(167,139,250,0.3);
        transform: translateY(-2px);
        animation: none;
      }

      @media(max-width: 480px) {
        .consent-banner { right: 16px; left: 16px; width: auto; bottom: 16px; }
      }
    `;
    document.head.appendChild(style);
  }

  const banner = document.createElement('div');
  banner.className = 'consent-banner';
  banner.id = 'consentBanner';

  const title   = (typeof i18next !== 'undefined' && i18next.isInitialized) ? i18next.t('consent.title')   : 'Cookies & Confidentialité';
  const text    = (typeof i18next !== 'undefined' && i18next.isInitialized) ? i18next.t('consent.text')    : "Je promets de ne pas espionner vos recettes de crêpes 🥞";
  const decline = (typeof i18next !== 'undefined' && i18next.isInitialized) ? i18next.t('consent.decline') : 'Passer';
  const accept  = (typeof i18next !== 'undefined' && i18next.isInitialized) ? i18next.t('consent.accept')  : 'Accepter';

  banner.innerHTML = `
    <div class="consent-glass">
      <div class="consent-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h.01"></path>
          <path d="M8.5 16.429a5 5 0 0 1 7 0"></path>
          <path d="M5 12.859a10 10 0 0 1 14 0"></path>
          <path d="M2 8.82a15 15 0 0 1 20 0"></path>
        </svg>
      </div>
      <div class="consent-title" data-i18n="consent.title">${title}</div>
      <div class="consent-text" data-i18n="consent.text">${text}</div>
      <div class="consent-actions">
        <button class="consent-btn btn-decline" id="btnConsentDecline" data-i18n="consent.decline">${decline}</button>
        <button class="consent-btn btn-accept" id="btnConsentAccept" data-i18n="consent.accept">${accept}</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  if (typeof i18next !== 'undefined' && i18next.isInitialized) {
    banner.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.innerHTML = i18next.t(key);
    });
  }

  setTimeout(() => banner.classList.add('visible'), 400);

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
  banner.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  banner.style.opacity = '0';
  banner.style.transform = 'translateY(20px) scale(0.95)';
  setTimeout(() => { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 450);
}
