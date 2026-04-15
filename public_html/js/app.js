import './modules/security.js';
import { initCursor } from './modules/cursor.js';
import { initEasterEggs } from './modules/easterEggs.js';
import { initAnimations } from './modules/animations.js';
import { initFlashlight } from './modules/flashlight.js';
import { initCarousel } from './modules/carousel.js';
import { initI18n } from './modules/i18n.js';
import { initConsent } from './modules/consent.js';

document.addEventListener('DOMContentLoaded', () => {
  initI18n(); // Init translation securely (non-blocking)
  // Initialize modular components
  initCursor();
  initEasterEggs();
  initAnimations();
  initFlashlight();
  initCarousel();
  initConsent();
});
