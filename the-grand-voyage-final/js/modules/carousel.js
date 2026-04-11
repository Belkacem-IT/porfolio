/**
 * Infinite interactive carousel for the Projects section
 * Features: auto-play, arrows, dots, keyboard nav, swipe support, progress bar
 */
export function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');
  const counterEl = document.getElementById('counterCurrent');
  const progressBar = document.getElementById('carouselProgressBar');

  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoPlayTimer = null;
  const AUTO_PLAY_DELAY = 5000;

  // Go to specific slide
  function goToSlide(index, animate = true) {
    // Infinite wrap
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    currentIndex = index;

    // Move track
    if (!animate) track.style.transition = 'none';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    if (!animate) {
      // Force reflow then restore transition
      track.offsetHeight;
      track.style.transition = '';
    }

    // Update dots
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    // Update counter
    if (counterEl) {
      counterEl.textContent = String(currentIndex + 1).padStart(2, '0');
    }

    // Update progress bar
    if (progressBar) {
      const progressWidth = ((currentIndex + 1) / totalSlides) * 100;
      progressBar.style.width = progressWidth + '%';
    }

    // Animate slide content entrance
    const activeSlide = slides[currentIndex];
    const content = activeSlide.querySelector('.slide-content');
    if (content && typeof gsap !== 'undefined') {
      gsap.fromTo(content, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.2 }
      );
    }
  }

  // Navigation
  function nextSlide() { goToSlide(currentIndex + 1); }
  function prevSlide() { goToSlide(currentIndex - 1); }

  // Arrow buttons
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

  // Dot buttons
  if (dotsContainer) {
    dotsContainer.addEventListener('click', (e) => {
      const dot = e.target.closest('.carousel-dot');
      if (dot) {
        const slideIndex = parseInt(dot.dataset.slide);
        goToSlide(slideIndex);
        resetAutoPlay();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // Only respond if projects section is in view
    const section = document.getElementById('projects');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (e.key === 'ArrowLeft') { prevSlide(); resetAutoPlay(); }
    if (e.key === 'ArrowRight') { nextSlide(); resetAutoPlay(); }
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      resetAutoPlay();
    }
  }, { passive: true });

  // Auto-play
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextSlide, AUTO_PLAY_DELAY);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // Pause on hover
  const wrapper = document.getElementById('carouselWrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAutoPlay);
    wrapper.addEventListener('mouseleave', startAutoPlay);
  }

  // Initialize
  goToSlide(0, false);
  startAutoPlay();
}
