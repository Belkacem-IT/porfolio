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
    analytics_storage: status,
    ad_storage: status,
    ad_user_data: status,
    ad_personalization: status
  });
}

function buildBanner() {
  // Inject scoped CSS once
  if (!document.getElementById('consentStyle')) {
    const style = document.createElement('style');
    style.id = 'consentStyle';
    style.textContent = `
      .consent-banner {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 300px;
        z-index: 99999;
        opacity: 0;
        transform: translateY(16px) scale(0.97);
        transition: opacity 0.45s cubic-bezier(0.16,1,0.3,1),
                    transform 0.45s cubic-bezier(0.16,1,0.3,1);
        pointer-events: none;
      }
      .consent-banner.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      /* ── Liquid Glass shell ── */
      .consent-glass {
        position: relative;
        border-radius: 20px;
        padding: 20px 20px 16px;
        overflow: hidden;
        background: rgba(255,255,255,0.07);
        backdrop-filter: blur(32px) saturate(180%);
        -webkit-backdrop-filter: blur(32px) saturate(180%);
        border: 1px solid rgba(255,255,255,0.14);
        box-shadow:
          0 8px 32px rgba(0,0,0,0.45),
          0 1px 0 rgba(255,255,255,0.2) inset,
          0 -1px 0 rgba(0,0,0,0.3) inset;
      }

      /* specular top highlight */
      .consent-glass::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 20px;
        background: linear-gradient(
          160deg,
          rgba(255,255,255,0.18) 0%,
          rgba(255,255,255,0.04) 40%,
          transparent 70%
        );
        pointer-events: none;
      }

      /* subtle tinted glow */
      .consent-glass::after {
        content: '';
        position: absolute;
        top: -40%; left: -20%;
        width: 140%; height: 140%;
        background: radial-gradient(
          ellipse at 30% 20%,
          rgba(99,102,241,0.12) 0%,
          transparent 65%
        );
        pointer-events: none;
      }

      /* ── Icon row ── */
      .consent-icon-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
        position: relative;
        z-index: 1;
      }
      .consent-icon-wrap {
        flex-shrink: 0;
        width: 38px; height: 38px;
        border-radius: 12px;
        background: rgba(99,102,241,0.18);
        display: flex; align-items: center; justify-content: center;
        border: 1px solid rgba(99,102,241,0.25);
        box-shadow: 0 2px 10px rgba(99,102,241,0.2);
      }
      .consent-icon-wrap svg { display:block; }
      .consent-title {
        font-size: 14px;
        font-weight: 700;
        color: rgba(255,255,255,0.92);
        font-family: 'Space Grotesk', sans-serif;
        letter-spacing: 0.2px;
        line-height: 1.2;
      }
      .consent-subtitle {
        font-size: 10px;
        color: rgba(255,255,255,0.35);
        font-family: 'Space Grotesk', sans-serif;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-top: 1px;
      }

      /* ── Body text ── */
      .consent-body {
        position: relative; z-index: 1;
        font-size: 12.5px;
        color: rgba(255,255,255,0.55);
        line-height: 1.55;
        font-family: 'Plus Jakarta Sans', sans-serif;
        margin-bottom: 16px;
      }

      /* ── Divider ── */
      .consent-divider {
        height: 1px;
        background: linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent);
        margin-bottom: 14px;
        position: relative; z-index: 1;
      }

      /* ── Buttons ── */
      .consent-btns {
        display: flex;
        gap: 8px;
        position: relative; z-index: 1;
      }
      .consent-btn {
        flex: 1;
        padding: 9px 12px;
        border-radius: 11px;
        font-size: 12px;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.2s ease;
        letter-spacing: 0.3px;
      }
      .btn-decline {
        background: rgba(255,255,255,0.07);
        color: rgba(255,255,255,0.5);
        border: 1px solid rgba(255,255,255,0.09);
      }
      .btn-decline:hover {
        background: rgba(255,255,255,0.12);
        color: rgba(255,255,255,0.75);
      }
      .btn-accept {
        background: rgba(99,102,241,0.85);
        color: #fff;
        border: 1px solid rgba(129,140,248,0.4);
        box-shadow: 0 4px 14px rgba(99,102,241,0.35);
      }
      .btn-accept:hover {
        background: rgba(99,102,241,1);
        box-shadow: 0 6px 20px rgba(99,102,241,0.5);
        transform: translateY(-1px);
      }

      @media (max-width: 400px) {
        .consent-banner { right: 12px; left: 12px; width: auto; }
      }
    `;
    document.head.appendChild(style);
  }

  const banner = document.createElement('div');
  banner.className = 'consent-banner';
  banner.id = 'consentBanner';

  banner.innerHTML = `
    <div class="consent-glass">
      <div class="consent-icon-row">
        <div class="consent-icon-wrap">
          <!-- Liquid Chat icon with privacy dot -->
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
              stroke="rgba(129,140,248,0.9)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="8.5" cy="10" r="1" fill="rgba(129,140,248,0.9)"/>
            <circle cx="12" cy="10" r="1" fill="rgba(129,140,248,0.9)"/>
            <circle cx="15.5" cy="10" r="1" fill="rgba(129,140,248,0.9)"/>
          </svg>
        </div>
        <div>
          <div class="consent-title" data-i18n="consent.title">Mode de Consentement</div>
          <div class="consent-subtitle">RGPD · Analytics</div>
        </div>
      </div>

      <p class="consent-body" data-i18n="consent.text">
        Pour analyser le trafic et améliorer ce portfolio, j'utilise Google Analytics — votre accord est requis.
      </p>

      <div class="consent-divider"></div>

      <div class="consent-btns">
        <button class="consent-btn btn-decline" id="btnConsentDecline" data-i18n="consent.decline">Limiter</button>
        <button class="consent-btn btn-accept" id="btnConsentAccept" data-i18n="consent.accept">Accepter</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  // Translate if i18next is ready
  if (typeof i18next !== 'undefined' && i18next.isInitialized) {
    banner.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.innerHTML = i18next.t(key);
    });
  }

  setTimeout(() => banner.classList.add('visible'), 150);

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
  banner.style.opacity = '0';
  banner.style.transform = 'translateY(10px) scale(0.96)';
  setTimeout(() => {
    if (banner.parentNode) banner.parentNode.removeChild(banner);
  }, 400);
}
