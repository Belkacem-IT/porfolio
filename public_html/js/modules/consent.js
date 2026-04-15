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
      /* ── Warp speed lines ── */
      @keyframes warpLine {
        0%   { transform: scaleX(0) translateX(-100%); opacity: 0; }
        15%  { opacity: 0.7; }
        80%  { opacity: 0.3; }
        100% { transform: scaleX(1) translateX(0); opacity: 0; }
      }
      @keyframes cSlideUp {
        from { opacity:0; transform: translateY(100%); }
        to   { opacity:1; transform: translateY(0); }
      }
      @keyframes scanPulse {
        0%,100% { opacity: 0.3; }
        50%     { opacity: 0.7; }
      }
      @keyframes alienBlink {
        0%,90%,100% { opacity:1; }
        95%         { opacity:0.2; }
      }
      @keyframes orbitSpin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }

      .consent-banner {
        position: fixed;
        bottom: 0; left: 0; right: 0;
        z-index: 99999;
        opacity: 0;
        pointer-events: none;
        transform: translateY(100%);
      }
      .consent-banner.visible {
        animation: cSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
        pointer-events: auto;
      }

      /* ── Main HUD bar ── */
      .consent-hud {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0;
        height: 56px;
        overflow: hidden;
        background: rgba(8, 10, 20, 0.72);
        backdrop-filter: blur(28px) saturate(160%);
        -webkit-backdrop-filter: blur(28px) saturate(160%);
        border-top: 1px solid rgba(99,102,241,0.2);
        box-shadow: 0 -4px 30px rgba(0,0,0,0.5), 0 -1px 0 rgba(99,102,241,0.1) inset;
      }

      /* top edge glow line */
      .consent-hud::before {
        content:'';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 1px;
        background: linear-gradient(to right,
          transparent 0%,
          rgba(99,102,241,0.6) 20%,
          rgba(167,139,250,0.8) 50%,
          rgba(99,102,241,0.6) 80%,
          transparent 100%
        );
      }

      /* ── Warp speed section (decorative left) ── */
      .consent-warp {
        position: relative;
        width: 130px;
        flex-shrink: 0;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border-right: 1px solid rgba(99,102,241,0.1);
      }

      /* warp lines */
      .warp-line {
        position: absolute;
        height: 1px;
        left: 0; right: 0;
        background: linear-gradient(to right, transparent, rgba(167,139,250,0.6), rgba(255,255,255,0.3), transparent);
        transform-origin: left center;
        animation: warpLine 2.4s ease-in-out infinite;
      }
      .warp-line:nth-child(1) { top: 22%; animation-delay: 0s;    animation-duration: 2.1s; }
      .warp-line:nth-child(2) { top: 38%; animation-delay: 0.4s;  animation-duration: 2.6s; }
      .warp-line:nth-child(3) { top: 52%; animation-delay: 0.15s; animation-duration: 1.9s; }
      .warp-line:nth-child(4) { top: 66%; animation-delay: 0.65s; animation-duration: 2.3s; }
      .warp-line:nth-child(5) { top: 78%; animation-delay: 0.3s;  animation-duration: 2.8s; }

      /* alien/UFO icon */
      .consent-alien {
        position: relative; z-index: 2;
        display: flex; flex-direction: column;
        align-items: center; gap: 2px;
        animation: alienBlink 4s ease-in-out infinite;
      }
      .consent-alien svg { display: block; filter: drop-shadow(0 0 6px rgba(167,139,250,0.6)); }
      .alien-signal {
        font-size: 7px; letter-spacing: 2px;
        color: rgba(167,139,250,0.5);
        font-family: monospace;
        animation: scanPulse 1.8s ease-in-out infinite;
      }

      /* ── Text section ── */
      .consent-text {
        flex: 1;
        padding: 0 20px;
        min-width: 0;
      }
      .consent-label {
        font-size: 11px; font-weight: 700;
        color: rgba(255,255,255,0.85);
        font-family: 'Space Grotesk', sans-serif;
        letter-spacing: 0.5px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .consent-sublabel {
        font-size: 10px;
        color: rgba(255,255,255,0.3);
        font-family: 'Plus Jakarta Sans', sans-serif;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        margin-top: 1px;
      }

      /* ── Tags ── */
      .consent-chips {
        display: flex; gap: 5px;
        padding: 0 10px;
        flex-shrink: 0;
      }
      .consent-chip {
        font-size: 8px; font-family: monospace;
        color: rgba(99,102,241,0.5);
        border: 1px solid rgba(99,102,241,0.15);
        padding: 2px 6px; border-radius: 3px;
        letter-spacing: 1px; text-transform: uppercase;
      }

      /* ── Actions ── */
      .consent-actions {
        display: flex; align-items: center; gap: 6px;
        padding: 0 20px;
        flex-shrink: 0;
        border-left: 1px solid rgba(255,255,255,0.04);
      }
      .consent-btn {
        border: none; cursor: pointer;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 600; letter-spacing: 0.3px;
        transition: all 0.2s ease;
      }
      .btn-decline {
        background: transparent;
        color: rgba(255,255,255,0.2);
        font-size: 11px; padding: 6px 10px;
        border-radius: 6px;
      }
      .btn-decline:hover { color: rgba(255,255,255,0.45); }

      .btn-accept {
        background: rgba(99,102,241,0.15);
        color: rgba(167,139,250,0.9);
        font-size: 12px; padding: 7px 18px;
        border-radius: 8px;
        border: 1px solid rgba(99,102,241,0.35) !important;
        box-shadow: 0 0 14px rgba(99,102,241,0.15);
      }
      .btn-accept:hover {
        background: rgba(99,102,241,0.3);
        color: #fff;
        box-shadow: 0 0 22px rgba(99,102,241,0.35);
        transform: scale(1.03);
      }

      /* scanning line overlay */
      .consent-scan {
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 100%;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 3px,
          rgba(0,0,0,0.04) 3px,
          rgba(0,0,0,0.04) 4px
        );
        pointer-events: none;
      }

      @media(max-width: 600px) {
        .consent-chips { display: none; }
        .consent-warp  { width: 80px; }
        .consent-sublabel { display: none; }
        .btn-decline { display: none; }
        .consent-actions { padding: 0 12px; }
      }
    `;
    document.head.appendChild(style);
  }

  const banner = document.createElement('div');
  banner.className = 'consent-banner';
  banner.id = 'consentBanner';

  const title = (typeof i18next !== 'undefined' && i18next.isInitialized)
    ? i18next.t('consent.title') : 'Cookies & Confidentialité';
  const text = (typeof i18next !== 'undefined' && i18next.isInitialized)
    ? i18next.t('consent.text') : "Je promets de ne pas espionner vos recettes de crêpes — juste les stats du site.";
  const decline = (typeof i18next !== 'undefined' && i18next.isInitialized)
    ? i18next.t('consent.decline') : 'Passer';
  const accept = (typeof i18next !== 'undefined' && i18next.isInitialized)
    ? i18next.t('consent.accept') : 'Accepter';

  banner.innerHTML = `
    <div class="consent-hud">
      <div class="consent-scan"></div>

      <!-- Warp speed + alien left panel -->
      <div class="consent-warp">
        <div class="warp-line"></div>
        <div class="warp-line"></div>
        <div class="warp-line"></div>
        <div class="warp-line"></div>
        <div class="warp-line"></div>

        <!-- UFO / alien icon -->
        <div class="consent-alien">
          <svg width="24" height="18" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- saucer body -->
            <ellipse cx="18" cy="14" rx="16" ry="5" fill="rgba(99,102,241,0.15)" stroke="rgba(167,139,250,0.6)" stroke-width="1"/>
            <!-- dome -->
            <path d="M10 14 Q10 6 18 5 Q26 6 26 14" fill="rgba(99,102,241,0.1)" stroke="rgba(167,139,250,0.5)" stroke-width="1"/>
            <!-- light portholes -->
            <circle cx="12" cy="14.5" r="1.2" fill="rgba(167,139,250,0.7)"/>
            <circle cx="18" cy="15"   r="1.4" fill="rgba(200,180,255,0.9)"/>
            <circle cx="24" cy="14.5" r="1.2" fill="rgba(167,139,250,0.7)"/>
            <!-- beam -->
            <path d="M12 19 L10 24 M18 19.5 L18 24 M24 19 L26 24" stroke="rgba(167,139,250,0.25)" stroke-width="0.8" stroke-dasharray="2 2"/>
          </svg>
          <div class="alien-signal">SIGNAL</div>
        </div>
      </div>

      <!-- Text -->
      <div class="consent-text">
        <div class="consent-label" data-i18n="consent.title">${title}</div>
        <div class="consent-sublabel" data-i18n="consent.text">${text}</div>
      </div>

      <!-- Chips -->
      <div class="consent-chips">
        <span class="consent-chip">RGPD</span>
        <span class="consent-chip">GA4</span>
      </div>

      <!-- Actions -->
      <div class="consent-actions">
        <button class="consent-btn btn-decline" id="btnConsentDecline" data-i18n="consent.decline">${decline}</button>
        <button class="consent-btn btn-accept"  id="btnConsentAccept"  data-i18n="consent.accept">${accept}</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  setTimeout(() => banner.classList.add('visible'), 300);

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
  banner.style.transform = 'translateY(100%)';
  setTimeout(() => { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 320);
}
