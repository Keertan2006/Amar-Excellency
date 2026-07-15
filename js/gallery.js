/* ============================================================
   AMAR EXCELLENCY — Gallery Module
   gallery.js — Category filter, lightbox, lazy loading
   ============================================================ */

'use strict';

/* ============================================================
   CULINARY SHOWCASE — Category Filter
   ============================================================ */
(function initCulinaryFilter() {
  const filters = document.querySelectorAll('.culinary__filter');
  const grid = document.getElementById('culinaryGrid');
  if (!filters.length || !grid) return;

  const cards = grid.querySelectorAll('.culinary-card');

  filters.forEach(filter => {
    filter.addEventListener('click', function () {
      // Update active state
      filters.forEach(f => {
        f.classList.remove('active');
        f.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      const category = this.dataset.category;

      // Filter cards with smooth animation
      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
          // Re-trigger animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
})();


/* ============================================================
   LIGHTBOX
   ============================================================ */
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');
  if (!lightbox || !lightboxImage) return;

  const galleryItems = document.querySelectorAll('.gallery__item');
  let currentIndex = 0;
  let images = [];

  // Collect all gallery image sources
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      images.push({
        src: img.src,
        alt: img.alt
      });

      item.addEventListener('click', () => {
        openLightbox(index);
      });
    }
  });

  /**
   * Open lightbox at specific index
   * @param {number} index - Image index
   */
  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus trap
    lightboxClose.focus();
  }

  /**
   * Close lightbox
   */
  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /**
   * Update displayed image
   */
  function updateLightboxImage() {
    if (!images[currentIndex]) return;
    lightboxImage.src = images[currentIndex].src;
    lightboxImage.alt = images[currentIndex].alt;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
  }

  /**
   * Navigate to next image
   */
  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxImage();
  }

  /**
   * Navigate to previous image
   */
  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxImage();
  }

  // Event listeners
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

  // Close on overlay click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
    }
  });

  // Touch / Swipe support for lightbox
  let touchStartX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage();
      else prevImage();
    }
  }, { passive: true });
})();
