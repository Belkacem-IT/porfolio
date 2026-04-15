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
      @keyframes cFloat {
        0%,100% { transform: translateY(0px) rotate(-2deg); }
        50%      { transform: translateY(-5px) rotate(2deg); }
      }
      @keyframes cPulse {
        0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.5), 0 8px 32px rgba(0,0,0,0.45); }
        50%      { box-shadow: 0 0 0 8px rgba(99,102,241,0), 0 8px 32px rgba(0,0,0,0.45); }
      }
      @keyframes cBounce {
        0%,100% { transform: scale(1); }
        40%      { transform: scale(1.12) rotate(-3deg); }
        60%      { transform: scale(0.95) rotate(2deg); }
      }
      @keyframes cWiggle {
        0%,100% { transform: rotate(0deg); }
        20%      { transform: rotate(-8deg); }
        40%      { transform: rotate(8deg); }
        60%      { transform: rotate(-4deg); }
        80%      { transform: rotate(4deg); }
      }
      @keyframes cSlideIn {
        from { opacity:0; transform: translateY(20px) scale(0.94); }
        to   { opacity:1; transform: translateY(0) scale(1); }
      }
      @keyframes cGlow {
        0%,100% { background: rgba(99,102,241,0.82); }
        50%      { background: rgba(129,140,248,0.98); }
      }

      .consent-banner {
        position: fixed;
        bottom: 24px; right: 24px;
        width: 296px;
        z-index: 99999;
        opacity: 0;
        pointer-events: none;
      }
      .consent-banner.visible {
        animation: cSlideIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
        pointer-events: auto;
      }

      /* Liquid Glass shell */
      .consent-glass {
        position: relative; border-radius: 22px;
        padding: 18px 18px 14px;
        overflow: hidden;
        background: rgba(255,255,255,0.065);
        backdrop-filter: blur(36px) saturate(190%);
        -webkit-backdrop-filter: blur(36px) saturate(190%);
        border: 1px solid rgba(255,255,255,0.15);
        box-shadow:
          0 8px 32px rgba(0,0,0,0.5),
          0 1px 0 rgba(255,255,255,0.22) inset,
          0 -1px 0 rgba(0,0,0,0.3) inset;
      }
      .consent-glass::before {
        content:''; position:absolute; inset:0; border-radius:22px; pointer-events:none;
        background: linear-gradient(145deg,rgba(255,255,255,0.16) 0%,rgba(255,255,255,0.03) 45%,transparent 70%);
      }
      .consent-glass::after {
        content:''; position:absolute; top:-50%; left:-20%;
        width:140%; height:150%; pointer-events:none;
        background: radial-gradient(ellipse at 35% 25%,rgba(99,102,241,0.13) 0%,transparent 60%);
      }

      /* Floating mascot icon */
      .consent-mascot {
        display:flex; justify-content:center; margin-bottom:12px;
        position:relative; z-index:1;
      }
      .consent-mascot-bubble {
        width:52px; height:52px; border-radius:18px;
        background: linear-gradient(135deg,rgba(99,102,241,0.25),rgba(139,92,246,0.2));
        border:1px solid rgba(129,140,248,0.3);
        display:flex; align-items:center; justify-content:center;
        animation: cFloat 3s ease-in-out infinite;
        box-shadow: 0 4px 16px rgba(99,102,241,0.25), 0 1px 0 rgba(255,255,255,0.15) inset;
        cursor:default;
      }
      .consent-mascot-bubble:hover {
        animation: cWiggle 0.5s ease-in-out;
      }

      /* Cute dots inside the speech bubble icon */
      .consent-mascot-bubble svg { display:block; }

      /* Text */
      .consent-title {
        font-size:13px; font-weight:700; color:rgba(255,255,255,0.92);
        font-family:'Space Grotesk',sans-serif; text-align:center;
        margin-bottom:7px; position:relative; z-index:1;
      }
      .consent-body {
        font-size:12px; color:rgba(255,255,255,0.5); line-height:1.55;
        font-family:'Plus Jakarta Sans',sans-serif; text-align:center;
        margin-bottom:14px; position:relative; z-index:1;
      }
      .consent-body strong { color:rgba(255,255,255,0.72); font-weight:600; }

      /* Divider */
      .consent-divider {
        height:1px; margin-bottom:12px; position:relative; z-index:1;
        background:linear-gradient(to right,transparent,rgba(255,255,255,0.08),transparent);
      }

      /* Buttons */
      .consent-btns { display:flex; gap:8px; position:relative; z-index:1; }
      .consent-btn {
        flex:1; padding:9px 12px; border-radius:12px;
        font-size:12px; font-family:'Space Grotesk',sans-serif;
        font-weight:600; cursor:pointer; border:none;
        transition:all 0.22s ease; letter-spacing:0.3px;
      }
      .btn-decline {
        background:rgba(255,255,255,0.06); color:rgba(255,255,255,0.42);
        border:1px solid rgba(255,255,255,0.08);
      }
      .btn-decline:hover { background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.65); }

      .btn-accept {
        background:rgba(99,102,241,0.88); color:#fff;
        border:1px solid rgba(129,140,248,0.4);
        animation: cPulse 2.2s ease-in-out infinite, cGlow 2.2s ease-in-out infinite;
        font-size:13px; letter-spacing:0.4px;
      }
      .btn-accept:hover {
        animation: none;
        background:rgba(99,102,241,1);
        box-shadow:0 6px 22px rgba(99,102,241,0.6);
        transform:translateY(-2px) scale(1.03);
      }
      .btn-accept:active { transform:translateY(0) scale(0.98); }

      /* Mini RGPD tag */
      .consent-tag {
        display:flex; justify-content:center; gap:6px;
        margin-top:10px; position:relative; z-index:1;
      }
      .consent-chip {
        font-size:9px; font-family:'Space Grotesk',sans-serif;
        font-weight:600; letter-spacing:1px; text-transform:uppercase;
        color:rgba(255,255,255,0.22); padding:2px 8px;
        border:1px solid rgba(255,255,255,0.07); border-radius:100px;
      }

      @media(max-width:400px){
        .consent-banner{ right:12px; left:12px; width:auto; }
      }
    `;
    document.head.appendChild(style);
  }

  const banner = document.createElement('div');
  banner.className = 'consent-banner';
  banner.id = 'consentBanner';

  banner.innerHTML = `
    <div class="consent-glass">

      <!-- Floating animated chat mascot -->
      <div class="consent-mascot">
        <div class="consent-mascot-bubble">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
              stroke="rgba(167,139,250,0.95)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
              fill="rgba(99,102,241,0.12)"/>
            <circle cx="8.5"  cy="10.5" r="1.1" fill="rgba(167,139,250,0.9)"/>
            <circle cx="12"   cy="10.5" r="1.1" fill="rgba(167,139,250,0.9)"/>
            <circle cx="15.5" cy="10.5" r="1.1" fill="rgba(167,139,250,0.9)"/>
          </svg>
        </div>
      </div>

      <div class="consent-title" data-i18n="consent.title">Cookies &amp; Confidentialité</div>

      <p class="consent-body" data-i18n="consent.text">
        Je promets de ne pas espionner vos recherches de recettes de crêpes 🥞 — juste les stats du site.
      </p>

      <div class="consent-divider"></div>

      <div class="consent-btns">
        <button class="consent-btn btn-decline" id="btnConsentDecline" data-i18n="consent.decline">Limiter</button>
        <button class="consent-btn btn-accept" id="btnConsentAccept" data-i18n="consent.accept">Accepter ✓</button>
      </div>

      <div class="consent-tag">
        <span class="consent-chip">RGPD</span>
        <span class="consent-chip">Analytics</span>
        <span class="consent-chip">No tracking</span>
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

  setTimeout(() => banner.classList.add('visible'), 200);

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
  banner.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
  banner.style.opacity = '0';
  banner.style.transform = 'translateY(12px) scale(0.95)';
  setTimeout(() => { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 380);
}
