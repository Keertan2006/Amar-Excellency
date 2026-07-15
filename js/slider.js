/* ============================================================
   AMAR EXCELLENCY — Slider Module
   slider.js — Hero image slider + Testimonial carousel
   ============================================================ */

'use strict';

/* ============================================================
   HERO SLIDER
   ============================================================ */
(function initHeroSlider() {
  const slider = document.getElementById('heroSlider');
  const dotsContainer = document.getElementById('heroDots');
  if (!slider || !dotsContainer) return;

  const slides = slider.querySelectorAll('.hero__slide');
  const dots = dotsContainer.querySelectorAll('.hero__dot');
  const totalSlides = slides.length;
  let currentSlide = 0;
  let autoplayInterval;
  let isPaused = false;

  /**
   * Go to a specific slide
   * @param {number} index - Slide index
   */
  function goToSlide(index) {
    // Remove active from current
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    // Update index
    currentSlide = (index + totalSlides) % totalSlides;

    // Activate new slide
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');

    // Reset Ken Burns animation on current slide image
    const img = slides[currentSlide].querySelector('.hero__slide-img');
    if (img) {
      img.style.animation = 'none';
      // Trigger reflow
      void img.offsetHeight;
      img.style.animation = '';
    }
  }

  /**
   * Advance to next slide
   */
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  /**
   * Start autoplay
   */
  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      if (!isPaused) nextSlide();
    }, 6000); // 6 second interval
  }

  /**
   * Stop autoplay
   */
  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      startAutoplay(); // Reset timer after manual navigation
    });
  });

  // Pause on hover (desktop)
  slider.addEventListener('mouseenter', () => { isPaused = true; });
  slider.addEventListener('mouseleave', () => { isPaused = false; });

  // Pause when tab is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  // Start
  startAutoplay();
})();


/* ============================================================
   TESTIMONIAL CAROUSEL
   ============================================================ */
(function initTestimonialSlider() {
  const slider = document.getElementById('testimonialSlider');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  if (!slider || !prevBtn || !nextBtn) return;

  const cards = slider.querySelectorAll('.testimonial-card');
  const totalCards = cards.length;
  let currentIndex = 0;

  /**
   * Move to a specific testimonial
   * @param {number} index - Card index
   */
  function goTo(index) {
    currentIndex = (index + totalCards) % totalCards;
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  // Event listeners
  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // Auto-advance testimonials every 8 seconds
  let testimonialAutoplay = setInterval(() => goTo(currentIndex + 1), 8000);

  // Pause autoplay on hover
  const wrapper = slider.closest('.testimonials__wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => clearInterval(testimonialAutoplay));
    wrapper.addEventListener('mouseleave', () => {
      testimonialAutoplay = setInterval(() => goTo(currentIndex + 1), 8000);
    });
  }

  // Keyboard navigation
  slider.closest('.testimonials__wrapper')?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
    if (e.key === 'ArrowRight') goTo(currentIndex + 1);
  });

  // Touch / Swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(currentIndex + 1); // Swipe left
      else goTo(currentIndex - 1); // Swipe right
    }
  }, { passive: true });
})();
