import './modules/security.js';
import { initCursor } from './modules/cursor.js';
import { initEasterEggs } from './modules/easterEggs.js';
import { initAnimations } from './modules/animations.js';
import { initFlashlight } from './modules/flashlight.js';
import { initCarousel } from './modules/carousel.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize modular components
  initCursor();
  initEasterEggs();
  initAnimations();
  initFlashlight();
  initCarousel();
});
