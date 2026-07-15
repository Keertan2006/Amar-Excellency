/* ============================================================
   AMAR EXCELLENCY — Form Module
   form.js — Contact form validation & submission
   ============================================================ */

'use strict';

(function initContactForm() {
  const form = document.getElementById('contactForm');
  const formWrapper = document.getElementById('contactFormWrapper');
  const successMessage = document.getElementById('formSuccess');
  if (!form) return;

  // Validation rules
  const validators = {
    /**
     * Validate a non-empty field
     */
    required(value) {
      return value.trim().length > 0;
    },

    /**
     * Validate email format
     */
    email(value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value.trim());
    },

    /**
     * Validate phone number (Indian format)
     */
    phone(value) {
      const phoneRegex = /^[+]?[\d\s()-]{8,15}$/;
      return phoneRegex.test(value.trim());
    },

    /**
     * Validate date is in the future
     */
    futureDate(value) {
      if (!value) return false;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    },

    /**
     * Validate positive number
     */
    positiveNumber(value) {
      const num = parseInt(value, 10);
      return !isNaN(num) && num > 0;
    }
  };

  /**
   * Show error state on a form group
   * @param {string} fieldId - Input field ID
   * @param {string} message - Error message
   */
  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const group = field.closest('.form-group');
    const errorSpan = document.getElementById(fieldId + 'Error');

    if (group) group.classList.add('form-group--error');
    if (errorSpan && message) errorSpan.textContent = message;
  }

  /**
   * Clear error state on a form group
   * @param {string} fieldId - Input field ID
   */
  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const group = field.closest('.form-group');
    if (group) group.classList.remove('form-group--error');
  }

  /**
   * Validate the entire form
   * @returns {boolean} - Whether the form is valid
   */
  function validateForm() {
    let isValid = true;

    // Name
    if (!validators.required(form.name.value)) {
      showError('name', 'Please enter your full name');
      isValid = false;
    } else {
      clearError('name');
    }

    // Phone
    if (!validators.phone(form.phone.value)) {
      showError('phone', 'Please enter a valid phone number');
      isValid = false;
    } else {
      clearError('phone');
    }

    // Email
    if (!validators.email(form.email.value)) {
      showError('email', 'Please enter a valid email address');
      isValid = false;
    } else {
      clearError('email');
    }

    // Event Type
    if (!validators.required(form.eventType.value)) {
      showError('eventType', 'Please select an event type');
      isValid = false;
    } else {
      clearError('eventType');
    }

    // Guest Count
    if (!validators.positiveNumber(form.guests.value)) {
      showError('guests', 'Please enter a valid guest count');
      isValid = false;
    } else {
      clearError('guests');
    }

    // Date
    if (!validators.futureDate(form.date.value)) {
      showError('date', 'Please select a future date');
      isValid = false;
    } else {
      clearError('date');
    }

    return isValid;
  }

  // Real-time validation on blur
  const fieldsToValidate = ['name', 'phone', 'email', 'eventType', 'guests', 'date'];
  fieldsToValidate.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.addEventListener('blur', () => {
      switch (fieldId) {
        case 'name':
          validators.required(field.value) ? clearError(fieldId) : showError(fieldId, 'Please enter your full name');
          break;
        case 'phone':
          validators.phone(field.value) ? clearError(fieldId) : showError(fieldId, 'Please enter a valid phone number');
          break;
        case 'email':
          validators.email(field.value) ? clearError(fieldId) : showError(fieldId, 'Please enter a valid email address');
          break;
        case 'eventType':
          validators.required(field.value) ? clearError(fieldId) : showError(fieldId, 'Please select an event type');
          break;
        case 'guests':
          validators.positiveNumber(field.value) ? clearError(fieldId) : showError(fieldId, 'Please enter a valid guest count');
          break;
        case 'date':
          validators.futureDate(field.value) ? clearError(fieldId) : showError(fieldId, 'Please select a future date');
          break;
      }
    });

    // Clear error on input
    field.addEventListener('input', () => {
      clearError(fieldId);
    });
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Collect form data
      const formData = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        eventType: form.eventType.value,
        guests: form.guests.value,
        date: form.date.value,
        message: form.message.value.trim()
      };

      // Log data (in production, send to server)
      console.log('Form submitted:', formData);

      // Show success message
      form.style.display = 'none';
      if (successMessage) successMessage.classList.add('active');

      // Reset form after delay
      setTimeout(() => {
        form.reset();
        form.style.display = '';
        if (successMessage) successMessage.classList.remove('active');
      }, 5000);
    } else {
      // Scroll to first error
      const firstError = form.querySelector('.form-group--error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  // Set minimum date to today
  const dateField = document.getElementById('date');
  if (dateField) {
    const today = new Date().toISOString().split('T')[0];
    dateField.setAttribute('min', today);
  }
})();


/* ============================================================
   NEWSLETTER FORM
   ============================================================ */
(function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]');
    if (email && email.value.trim()) {
      // In production, send to server
      console.log('Newsletter subscription:', email.value.trim());
      email.value = '';
      // Show brief confirmation
      const btn = form.querySelector('.footer__newsletter-btn');
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Subscribed!';
        btn.style.background = '#5FAE32';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 2500);
      }
    }
  });
})();
