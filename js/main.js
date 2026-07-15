/* ============================================================
   AMAR EXCELLENCY — Main JavaScript
   main.js — Navbar, mobile menu, smooth scroll, floating buttons
   ============================================================ */

'use strict';

/**
 * Utility: Debounce function
 * Limits the rate at which a function fires.
 */
function debounce(fn, delay = 100) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Utility: Throttle function
 * Ensures a function executes at most once every interval.
 */
function throttle(fn, interval = 100) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}


/* ============================================================
   LOADING SCREEN
   ============================================================ */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    // Add minimum display time for branding
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      // Remove loader from DOM after transition
      setTimeout(() => loader.remove(), 600);
    }, 1200);
  });

  // Prevent scrolling while loading
  document.body.style.overflow = 'hidden';
})();


/* ============================================================
   STICKY NAVBAR WITH FROSTED GLASS
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = throttle(() => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, 50);

  window.addEventListener('scroll', handleScroll, { passive: true });
})();


/* ============================================================
   MOBILE MENU TOGGLE
   ============================================================ */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link, .btn');

  function toggleMenu() {
    const isOpen = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMenu();
    }
  });
})();


/* ============================================================
   SMOOTH SCROLLING FOR ANCHOR LINKS
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();
      const navbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 80;

      window.scrollTo({
        top: targetElement.offsetTop - navbarHeight,
        behavior: 'smooth'
      });
    });
  });
})();


/* ============================================================
   ACTIVE NAVIGATION HIGHLIGHTING
   ============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link[data-section]');
  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === sectionId);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
})();


/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const handleScroll = throttle(() => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, 100);

  window.addEventListener('scroll', handleScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ============================================================
   FLOATING BUTTONS — Hide near footer
   ============================================================ */
(function initFloatingButtons() {
  const whatsappBtn = document.getElementById('floatingWhatsApp');
  const callBtn = document.getElementById('floatingCall');
  const footer = document.getElementById('footer');
  if (!footer) return;

  const buttons = [whatsappBtn, callBtn].filter(Boolean);
  if (!buttons.length) return;

  const handleScroll = throttle(() => {
    const footerRect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (footerRect.top < windowHeight) {
      buttons.forEach(btn => btn.classList.add('hidden'));
    } else {
      buttons.forEach(btn => btn.classList.remove('hidden'));
    }
  }, 100);

  window.addEventListener('scroll', handleScroll, { passive: true });
})();


/* ============================================================
   BUTTON RIPPLE EFFECT
   ============================================================ */
(function initRipple() {
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });
})();
