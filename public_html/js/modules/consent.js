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
      /* ── Stars / warp streaks ── */
      @keyframes warpStreak {
        0%   { transform: translateX(-110%) scaleX(0.3); opacity:0; }
        10%  { opacity: 1; }
        70%  { opacity: 0.6; }
        100% { transform: translateX(110%) scaleX(1.5); opacity:0; }
      }
      @keyframes cSlideRight {
        from { opacity:0; transform: translateX(100%) skewX(-2deg); }
        to   { opacity:1; transform: translateX(0)    skewX(0deg); }
      }
      @keyframes warpGlow {
        0%,100% { box-shadow: -4px 0 0 rgba(99,102,241,0.4), 0 0 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07); }
        50%     { box-shadow: -6px 0 20px rgba(99,102,241,0.7), 0 0 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1); }
      }
      @keyframes trailPulse {
        0%,100% { opacity: 0.4; }
        50%     { opacity: 1; }
      }
      @keyframes dotBlink {
        0%,100% { opacity:1; }
        48%     { opacity:1; }
        50%     { opacity:0; }
        52%     { opacity:0; }
      }
      @keyframes scanH {
        0%   { left: -100%; }
        100% { left: 200%; }
      }

      /* ── Wrapper ── */
      .consent-banner {
        position: fixed;
        top: 72px;
        right: 0;
        z-index: 99998;
        opacity: 0;
        pointer-events: none;
        max-width: 400px;
        width: 100%;
      }
      .consent-banner.visible {
        animation: cSlideRight 0.7s cubic-bezier(0.16,1,0.3,1) forwards;
        pointer-events: auto;
      }

      /* ── Main panel ── */
      .consent-hud {
        position: relative;
        overflow: hidden;
        background: rgba(6, 8, 20, 0.82);
        backdrop-filter: blur(24px) saturate(160%);
        -webkit-backdrop-filter: blur(24px) saturate(160%);
        border-radius: 14px 0 0 14px;
        border: 1px solid rgba(99,102,241,0.25);
        border-right: none;
        animation: warpGlow 3s ease-in-out infinite;
        padding: 10px 16px 10px 0;
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      /* ── Warp streak canvas ── */
      .consent-streaks {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
      }
      .streak {
        position: absolute;
        height: 1px;
        width: 60%;
        border-radius: 2px;
        background: linear-gradient(to right, transparent, rgba(167,139,250,0.7), rgba(255,255,255,0.9), transparent);
        animation: warpStreak linear infinite;
      }
      .streak:nth-child(1)  { top:12%; width:45%; animation-duration:1.2s; animation-delay:-0.1s; }
      .streak:nth-child(2)  { top:22%; width:70%; animation-duration:0.9s; animation-delay:-0.5s; }
      .streak:nth-child(3)  { top:31%; width:55%; animation-duration:1.5s; animation-delay:-0.2s; }
      .streak:nth-child(4)  { top:42%; width:80%; animation-duration:1.0s; animation-delay:-0.7s; }
      .streak:nth-child(5)  { top:51%; width:50%; animation-duration:1.3s; animation-delay:-0.3s; }
      .streak:nth-child(6)  { top:60%; width:65%; animation-duration:0.8s; animation-delay:-0.9s; }
      .streak:nth-child(7)  { top:70%; width:40%; animation-duration:1.6s; animation-delay:-0.4s; }
      .streak:nth-child(8)  { top:80%; width:75%; animation-duration:1.1s; animation-delay:-0.6s; }
      .streak:nth-child(9)  { top:88%; width:35%; animation-duration:1.4s; animation-delay:-0.15s; }

      /* Horizontal scan shimmer */
      .consent-scan {
        position: absolute;
        top: 0; bottom: 0;
        width: 60px;
        background: linear-gradient(to right, transparent, rgba(167,139,250,0.05), transparent);
        animation: scanH 3.5s linear infinite;
        pointer-events: none;
      }

      /* Left warp engine visual */
      .consent-engine {
        position: absolute;
        left: 0; top: 0; bottom: 0;
        width: 38px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-right: 1px solid rgba(99,102,241,0.15);
        gap: 3px;
      }
      .engine-dot {
        width: 4px; height: 4px;
        border-radius: 50%;
        background: rgba(167,139,250,0.8);
        animation: trailPulse 1.2s ease-in-out infinite;
        box-shadow: 0 0 5px rgba(167,139,250,0.8);
      }
      .engine-dot:nth-child(2) { animation-delay: 0.2s; opacity: 0.6; width:3px; height:3px; }
      .engine-dot:nth-child(3) { animation-delay: 0.4s; opacity: 0.35; width:2px; height:2px; }
      .engine-dot:nth-child(4) { animation-delay: 0.6s; opacity: 0.2; width:2px; height:2px; }

      /* ── Content rows ── */
      .consent-top-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 0 5px 46px;
        position: relative; z-index: 2;
      }
      .consent-signal {
        font-size: 8px; letter-spacing: 2px;
        color: rgba(99,102,241,0.7);
        font-family: monospace; text-transform: uppercase;
        animation: dotBlink 1.8s step-end infinite;
      }
      .consent-title {
        font-size: 11px; font-weight: 700;
        color: rgba(255,255,255,0.85);
        font-family: 'Space Grotesk', sans-serif;
        letter-spacing: 0.5px;
        flex: 1;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }

      .consent-body-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding-left: 46px;
        position: relative; z-index:2;
      }
      .consent-sublabel {
        font-size: 10px;
        color: rgba(255,255,255,0.3);
        font-family: 'Plus Jakarta Sans', sans-serif;
        flex: 1;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        line-height: 1.3;
      }

      /* buttons inline */
      .consent-btns {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
      }
      .consent-btn {
        border: none; cursor: pointer;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 600;
        transition: all 0.2s ease;
        line-height: 1;
      }
      .btn-decline {
        background: transparent;
        color: rgba(255,255,255,0.18);
        font-size: 10px;
        padding: 4px 6px;
        border-radius: 4px;
        letter-spacing: 0.3px;
      }
      .btn-decline:hover { color: rgba(255,255,255,0.4); }

      .btn-accept {
        background: rgba(99,102,241,0.2);
        color: rgba(167,139,250,1);
        font-size: 11px;
        padding: 6px 14px;
        border-radius: 7px;
        border: 1px solid rgba(99,102,241,0.4) !important;
        letter-spacing: 0.4px;
        box-shadow: 0 0 12px rgba(99,102,241,0.2);
      }
      .btn-accept:hover {
        background: rgba(99,102,241,0.4);
        color: #fff;
        box-shadow: 0 0 20px rgba(99,102,241,0.5);
        transform: scale(1.04);
      }

      /* top-right status LED */
      .consent-led {
        position: absolute;
        top: 8px; right: 10px;
        width: 5px; height: 5px;
        border-radius: 50%;
        background: rgba(99,102,241,0.9);
        box-shadow: 0 0 6px rgba(99,102,241,0.9);
        animation: trailPulse 1.5s ease-in-out infinite;
        z-index: 3;
      }

      @media(max-width: 520px) {
        .consent-banner { max-width: 100%; }
        .consent-sublabel { display:none; }
      }
    `;
    document.head.appendChild(style);
  }

  const banner = document.createElement('div');
  banner.className  = 'consent-banner';
  banner.id = 'consentBanner';

  const title   = (typeof i18next !== 'undefined' && i18next.isInitialized) ? i18next.t('consent.title')   : 'Cookies & Confidentialité';
  const text    = (typeof i18next !== 'undefined' && i18next.isInitialized) ? i18next.t('consent.text')    : "Je promets de ne pas espionner vos recettes de crêpes 🥞";
  const decline = (typeof i18next !== 'undefined' && i18next.isInitialized) ? i18next.t('consent.decline') : 'Passer';
  const accept  = (typeof i18next !== 'undefined' && i18next.isInitialized) ? i18next.t('consent.accept')  : 'Accepter';

  banner.innerHTML = `
    <div class="consent-hud">

      <!-- Velocity streaks background -->
      <div class="consent-streaks">
        <div class="streak"></div><div class="streak"></div>
        <div class="streak"></div><div class="streak"></div>
        <div class="streak"></div><div class="streak"></div>
        <div class="streak"></div><div class="streak"></div>
        <div class="streak"></div>
      </div>
      <div class="consent-scan"></div>

      <!-- Left warp engine dots -->
      <div class="consent-engine">
        <div class="engine-dot"></div>
        <div class="engine-dot"></div>
        <div class="engine-dot"></div>
        <div class="engine-dot"></div>
      </div>

      <!-- Pulsing LED status -->
      <div class="consent-led"></div>

      <!-- Top row: signal + title -->
      <div class="consent-top-row">
        <span class="consent-signal">● SIG</span>
        <span class="consent-title" data-i18n="consent.title">${title}</span>
      </div>

      <!-- Bottom row: subtext + buttons -->
      <div class="consent-body-row">
        <span class="consent-sublabel" data-i18n="consent.text">${text}</span>
        <div class="consent-btns">
          <button class="consent-btn btn-decline" id="btnConsentDecline" data-i18n="consent.decline">${decline}</button>
          <button class="consent-btn btn-accept"  id="btnConsentAccept"  data-i18n="consent.accept">${accept}</button>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(banner);

  setTimeout(() => banner.classList.add('visible'), 800);

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
  banner.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  banner.style.opacity = '0';
  banner.style.transform = 'translateX(110%)';
  setTimeout(() => { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 350);
}
