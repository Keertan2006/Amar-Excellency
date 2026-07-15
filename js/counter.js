/* ============================================================
   AMAR EXCELLENCY — Counter Module
   counter.js — Animated number counters
   ============================================================ */

'use strict';

(function initCounters() {
  const counters = document.querySelectorAll('.stat__number[data-target]');
  if (!counters.length) return;

  /**
   * Animate a number from 0 to target
   * @param {HTMLElement} element - The counter element
   * @param {number} target - Target number
   * @param {string} suffix - Suffix to append (e.g., '+')
   * @param {number} duration - Animation duration in ms
   */
  function animateCounter(element, target, suffix = '', duration = 2000) {
    const startTime = performance.now();
    const startValue = 0;

    /**
     * Easing function — ease out cubic
     */
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    /**
     * Format number with commas
     */
    function formatNumber(num) {
      if (num >= 1000) {
        return num.toLocaleString('en-IN');
      }
      return num.toString();
    }

    /**
     * Animation frame update
     */
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

      element.textContent = formatNumber(currentValue) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Use Intersection Observer to trigger counters
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const target = parseInt(element.dataset.target, 10);
        const suffix = element.dataset.suffix || '';

        animateCounter(element, target, suffix);
        observer.unobserve(element); // Only animate once
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
})();
