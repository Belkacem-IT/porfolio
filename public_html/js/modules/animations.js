export function initAnimations() {
  // ── SMOOTH SCROLL (LENIS) ──
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.6, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true, wheelMultiplier: 0.9,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ── VANTA.JS BACKGROUNDS ──
  try {
    if (document.getElementById('vanta-net') && typeof VANTA !== 'undefined' && VANTA.NET) {
      VANTA.NET({
        el: '#vanta-net', mouseControls: true, touchControls: false,
        minHeight: 200, minWidth: 200, scale: 1,
        color: 0x6366f1, backgroundColor: 0x000000,
        points: 8, maxDistance: 22, spacing: 18, showDots: false,
      });
    }
  } catch (e) { console.warn('Vanta NET error:', e); }

  try {
    if (document.getElementById('vanta-clouds') && typeof VANTA !== 'undefined' && VANTA.FOG) {
      VANTA.FOG({
        el: '#vanta-clouds', mouseControls: false, touchControls: false,
        minHeight: 200, minWidth: 200,
        highlightColor: 0x14134e, midtoneColor: 0x0, lowlightColor: 0x111133,
        baseColor: 0x000000, blurFactor: 0.4, speed: 0.4, zoom: 1,
      });
    }
  } catch (e) { console.warn('Vanta FOG error:', e); }

  if (typeof gsap === 'undefined') return;

  // ── GSAP REVEAL ANIMATIONS ──
  gsap.utils.toArray('.gs-reveal').forEach(el => {
    gsap.from(el, {
      y: 60, opacity: 0, duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // ── BLACK HOLE PARALLAX ──
  const bh = document.getElementById('blackHole');
  if (bh) {
    gsap.to(bh, {
      yPercent: -30, scale: 0.6, opacity: 0,
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
    });
  }

  // ── PLANET PARALLAX ──
  gsap.utils.toArray('.gs-planet-left').forEach(el => {
    gsap.to(el, { y: -150, scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 2 } });
  });
  gsap.utils.toArray('.gs-planet-right').forEach(el => {
    gsap.to(el, { y: 100, scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 3 } });
  });
  gsap.utils.toArray('.gs-planet-fast').forEach(el => {
    gsap.to(el, { y: -200, scale: 0.7, scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 } });
  });

  // ── HERO → ABOUT TRANSITION (WARP EFFECT) ──
  const transEl = document.getElementById('hero-about-trans');
  if (transEl) {
    const warpLines = transEl.querySelectorAll('.warp-line');
    const nebulaGlow = transEl.querySelector('.transition-nebula-glow');

    ScrollTrigger.create({
      trigger: transEl,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        // Scale warp lines dynamically
        warpLines.forEach((line, i) => {
          const stagger = i * 0.08;
          const lineProgress = Math.max(0, Math.min(1, (progress - stagger) * 3));
          const width = lineProgress * 120;
          gsap.set(line, {
            width: width + '%',
            left: (50 - width / 2) + '%',
            opacity: Math.sin(lineProgress * Math.PI) * 0.7
          });
        });
        // Pulse nebula glow
        if (nebulaGlow) {
          gsap.set(nebulaGlow, {
            scale: 0.6 + progress * 1.2,
            opacity: Math.sin(progress * Math.PI) * 0.8
          });
        }
      }
    });
  }

  // ── SKY SECTION PARALLAX ──
  gsap.utils.toArray('.gs-c-fast').forEach(el => {
    gsap.to(el, { x: 200, scrollTrigger: { trigger: '#ciel', start: 'top bottom', end: 'bottom top', scrub: 2 } });
  });
  gsap.utils.toArray('.gs-c-slow').forEach(el => {
    gsap.to(el, { x: -150, scrollTrigger: { trigger: '#ciel', start: 'top bottom', end: 'bottom top', scrub: 3 } });
  });
  gsap.utils.toArray('.gs-plane-left').forEach(el => {
    gsap.fromTo(el, { x: '-100%' }, { x: '200vw', scrollTrigger: { trigger: '#ciel', start: 'top bottom', end: 'bottom top', scrub: 5 } });
  });
  gsap.utils.toArray('.gs-plane-right').forEach(el => {
    gsap.fromTo(el, { x: '100%' }, { x: '-200vw', scrollTrigger: { trigger: '#ciel', start: 'top bottom', end: 'bottom top', scrub: 4 } });
  });
  gsap.utils.toArray('.gs-birds-1').forEach(el => {
    gsap.fromTo(el, { x: '200%' }, { x: '-200%', scrollTrigger: { trigger: '#ciel', start: 'top bottom', end: 'bottom top', scrub: 6 } });
  });
  gsap.utils.toArray('.gs-birds-2').forEach(el => {
    gsap.fromTo(el, { x: '300%' }, { x: '-100%', scrollTrigger: { trigger: '#ciel', start: 'top bottom', end: 'bottom top', scrub: 8 } });
  });

  // ── BIOMES HORIZONTAL SCROLL (FIXED) ──
  const wrapper = document.getElementById('biomes-wrapper');
  const container = document.getElementById('biomes-container');
  if (wrapper && container) {
    const panels = container.querySelectorAll('.biome-panel');
    const totalPanels = panels.length;

    ScrollTrigger.matchMedia({
      "(min-width: 769px)": function() {
        ScrollTrigger.create({
          trigger: wrapper,
          pin: true,
          start: 'top top',
          end: () => '+=' + (window.innerWidth * (totalPanels - 1)),
          scrub: 1,
          snap: {
            snapTo: 1 / (totalPanels - 1),
            duration: { min: 0.3, max: 0.6 },
            ease: 'power1.inOut'
          },
          onUpdate: (self) => {
            const scrollWidth = container.scrollWidth;
            const viewportWidth = window.innerWidth;
            const maxScroll = scrollWidth - viewportWidth;
            gsap.set(container, {
              x: -(self.progress * maxScroll)
            });
          }
        });
      }
    });
  }

  // ── CLIP-PATH REVEAL ──
  const clipInner = document.getElementById('clip-inner');
  if (clipInner) {
    ScrollTrigger.create({
      trigger: '#clip-reveal',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      pin: clipInner,
      onUpdate: self => {
        const p = Math.min(self.progress * 1.3, 1);
        clipInner.style.clipPath = `circle(${p * 75}% at 50% 50%)`;
      }
    });

    gsap.utils.toArray('.gs-clip-text').forEach((el, i) => {
      gsap.from(el, {
        y: 80, opacity: 0,
        scrollTrigger: { trigger: '#clip-reveal', start: `${20 + i * 10}% center`, end: `${35 + i * 10}% center`, scrub: 1 }
      });
    });
  }

  // ── NAV ACTIVE STATE ──
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (navLinks.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 300) current = s.id;
      });
      navLinks.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) a.classList.add('active');
      });
    });
  }
}
