/* ============================================================
   AMAR EXCELLENCY — Animations Module
   animations.js — Scroll reveal, lazy loading, parallax
   ============================================================ */

'use strict';

/* ============================================================
   SCROLL REVEAL — Intersection Observer
   ============================================================ */
(function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-stagger');
  if (!revealElements.length) return;

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealElements.forEach(el => {
      el.classList.add('revealed');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
})();


/* ============================================================
   LAZY LOADING IMAGES
   ============================================================ */
(function initLazyLoading() {
  const lazyImages = document.querySelectorAll('.lazy');
  if (!lazyImages.length) return;

  // Use native lazy loading as primary, Intersection Observer as enhancement
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // If using data-src pattern
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px 0px', // Start loading slightly before viewport
      threshold: 0
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback: Load all images immediately
    lazyImages.forEach(img => {
      if (img.dataset.src) img.src = img.dataset.src;
      img.classList.add('loaded');
    });
  }
})();


/* ============================================================
   STAGGER ANIMATION DELAYS
   Adds progressive delays to children of grid containers
   ============================================================ */
(function initStaggerDelays() {
  const staggerContainers = document.querySelectorAll('.reveal-stagger');
  if (!staggerContainers.length) return;

  staggerContainers.forEach(container => {
    const children = container.children;
    Array.from(children).forEach((child, index) => {
      child.style.transitionDelay = `${index * 100}ms`;
    });
  });
})();


/* ============================================================
   PARALLAX-LIKE SUBTLE SCROLL EFFECT
   Applies slight parallax to elements with data-parallax
   ============================================================ */
(function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (!parallaxElements.length) return;

  // Skip for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function updateParallax() {
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const rect = el.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const offset = (rect.top + scrolled) * speed;
      el.style.transform = `translateY(${offset - scrolled * speed}px)`;
    });
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateParallax);
  }, { passive: true });
})();
