export function initI18n() {
  // Wait for i18next to load
  if (typeof i18next === 'undefined') {
    console.error("i18next library is not loaded yet.");
    return;
  }

  const supportedLngs = ['fr', 'en', 'ar'];
  const flags = { fr: '🇫🇷', en: '🇬🇧', ar: '🇸🇦' };

  i18next
    .use(i18nextHttpBackend)
    .use(i18nextBrowserLanguageDetector)
    .init({
      fallbackLng: 'fr',
      supportedLngs: supportedLngs,
      debug: false,
      backend: {
        loadPath: './locales/{{lng}}/{{ns}}.json'
      }
    })
    .then(() => {
      updateContent();
      updateOrbActive();

      // Toggle open/close on orb click
      document.querySelectorAll('.orb-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const orbit = trigger.closest('.lang-orbit');
          orbit.classList.toggle('open');
        });
      });

      // Language option click → change lang + close menu
      document.querySelectorAll('.lang-orb-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const lang = e.currentTarget.getAttribute('data-lang');

          // Close all menus immediately
          document.querySelectorAll('.lang-orbit').forEach(o => o.classList.remove('open'));

          i18next.changeLanguage(lang).then(() => {
            updateContent();
            updateOrbActive();
          });
        });
      });

      // Click outside → close menu
      document.addEventListener('click', () => {
        document.querySelectorAll('.lang-orbit').forEach(o => o.classList.remove('open'));
      });
    })
    .catch((err) => {
      console.error("i18n init error:", err);
    });

  function updateOrbActive() {
    const lang = i18next.language.substring(0, 2);
    // Update the center flag
    document.querySelectorAll('.orb-center-flag').forEach(el => {
      el.textContent = flags[lang] || flags.fr;
    });
    // Mark active
    document.querySelectorAll('.lang-orb-option').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }
}

function updateContent() {
  const lang = i18next.language.substring(0, 2);

  // Set global HTML attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

  // Translate all marked DOM elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');

    // Handle [attribute] prefix syntax: data-i18n="[placeholder]some.key"
    const attrMatch = key.match(/^\[(\w+)\](.+)$/);
    if (attrMatch) {
      const attr = attrMatch[1];
      const tKey = attrMatch[2];
      el.setAttribute(attr, i18next.t(tKey));
    } else {
      el.innerHTML = i18next.t(key);
    }
  });

  // Render Twemoji
  if (typeof twemoji !== 'undefined') {
    twemoji.parse(document.body, {
      folder: 'svg',
      ext: '.svg',
      base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/'
    });
  }
}
