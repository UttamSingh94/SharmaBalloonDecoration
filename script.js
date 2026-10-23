/**
 * Sharma Balloon Decoration (शर्मा बैलून डेकोरेशन)
 * Main Frontend Script - Vanilla JavaScript
 * Mobile-First, Accessible, GitHub Pages Compatible
 */

(function () {
  'use strict';

  // Constants & Business Information
  const PHONE_NUMBER = '+91 92786 87000';
  const WHATSAPP_RAW_NUMBER = '919278687000';

  // --------------------------------------------------------------------------
  // 1. Dynamic Copyright Year
  // --------------------------------------------------------------------------
  function initCopyrightYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // --------------------------------------------------------------------------
  // 2. Sticky Header Scroll State
  // --------------------------------------------------------------------------
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Menu
  // --------------------------------------------------------------------------
  function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const navLinks = document.querySelectorAll('.nav-mobile-link, .nav-mobile-drawer a');

    if (!hamburgerBtn || !mobileDrawer || !mobileOverlay) return;

    function openMenu() {
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      hamburgerBtn.setAttribute('aria-label', 'Close navigation menu');
      mobileDrawer.classList.add('is-active');
      mobileOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      hamburgerBtn.setAttribute('aria-label', 'Open navigation menu');
      mobileDrawer.classList.remove('is-active');
      mobileOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileOverlay.addEventListener('click', closeMenu);

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-active')) {
        closeMenu();
        hamburgerBtn.focus();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Scroll Spy / Active Navigation Links
  // --------------------------------------------------------------------------
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  }

  // --------------------------------------------------------------------------
  // 5. Featured Gallery Filtering & Lightbox Modal
  // --------------------------------------------------------------------------
  function initGallery() {
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxEnquireBtn = document.getElementById('lightbox-enquire-btn');

    let currentIndex = 0;
    let visibleItems = Array.from(galleryItems);
    let lastActiveTrigger = null;

    // Gallery Filtering
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        galleryItems.forEach((item) => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });

        // Update list of currently visible items for lightbox navigation
        visibleItems = Array.from(galleryItems).filter((item) => item.style.display !== 'none');
      });
    });

    // Lightbox Controls
    function openLightbox(index, triggerEl) {
      if (!visibleItems.length || !lightbox) return;
      lastActiveTrigger = triggerEl || null;
      currentIndex = (index + visibleItems.length) % visibleItems.length;
      updateLightboxContent();
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
        lastActiveTrigger.focus();
      }
    }

    function updateLightboxContent() {
      const activeItem = visibleItems[currentIndex];
      if (!activeItem) return;

      const img = activeItem.querySelector('.gallery-img');
      const title = activeItem.getAttribute('data-title') || (img ? img.alt : 'Balloon Decoration');
      const category = activeItem.getAttribute('data-category-label') || 'Sharma Balloon Decoration';
      const imgSrc = img ? img.src : '';

      if (lightboxImg) {
        lightboxImg.src = imgSrc;
        lightboxImg.alt = title;
      }
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxCategory) lightboxCategory.textContent = category;

      // Update Lightbox WhatsApp Enquiry Link
      if (lightboxEnquireBtn) {
        const messageText = `Hi, I am interested in the "${title}" balloon decoration design seen in your gallery. Please share availability and pricing.`;
        lightboxEnquireBtn.href = `https://wa.me/${WHATSAPP_RAW_NUMBER}?text=${encodeURIComponent(messageText)}`;
      }
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      updateLightboxContent();
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % visibleItems.length;
      updateLightboxContent();
    }

    // Attach Click Events to Gallery Items
    galleryItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        const itemIndex = visibleItems.indexOf(item);
        if (itemIndex !== -1) {
          openLightbox(itemIndex, item);
        }
      });

      // Keyboard accessibility (Enter or Space to open)
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const itemIndex = visibleItems.indexOf(item);
          if (itemIndex !== -1) {
            openLightbox(itemIndex, item);
          }
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', showPrev);
    }
    if (lightboxNext) {
      lightboxNext.addEventListener('click', showNext);
    }

    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        // If clicking directly on the backdrop (outside content box)
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
    }

    // Keyboard navigation within lightbox
    document.addEventListener('keydown', (e) => {
      if (!lightbox || !lightbox.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      } else if (e.key === 'ArrowRight') {
        showNext();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Contact & WhatsApp Enquiry Form
  // --------------------------------------------------------------------------
  function initEnquiryForm() {
    const form = document.getElementById('enquiry-form');
    const dateInput = document.getElementById('event-date');

    // Prevent booking past dates
    if (dateInput) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    if (!form) return;

    const nameInput = document.getElementById('customer-name');
    const phoneInput = document.getElementById('customer-phone');
    const occasionSelect = document.getElementById('occasion-select');
    const locationInput = document.getElementById('event-location');
    const requirementsInput = document.getElementById('event-requirements');

    function showError(inputEl, message) {
      inputEl.classList.add('is-invalid');
      const errorEl = document.getElementById(`${inputEl.id}-error`);
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('is-visible');
      }
    }

    function clearError(inputEl) {
      inputEl.classList.remove('is-invalid');
      const errorEl = document.getElementById(`${inputEl.id}-error`);
      if (errorEl) {
        errorEl.classList.remove('is-visible');
      }
    }

    // Live validation cleanup on input
    [nameInput, phoneInput, occasionSelect, dateInput, locationInput].forEach((input) => {
      if (!input) return;
      input.addEventListener('input', () => clearError(input));
      input.addEventListener('change', () => clearError(input));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      let firstInvalidField = null;

      // Validate Name
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (nameVal.length < 2) {
        showError(nameInput, 'Please enter your name (at least 2 characters).');
        isValid = false;
        firstInvalidField = firstInvalidField || nameInput;
      } else {
        clearError(nameInput);
      }

      // Validate Phone (Indian 10-digit mobile number)
      const phoneVal = phoneInput ? phoneInput.value.trim().replace(/[\s-]/g, '') : '';
      const indianPhoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
      if (!indianPhoneRegex.test(phoneVal)) {
        showError(phoneInput, 'Please enter a valid 10-digit Indian phone number.');
        isValid = false;
        firstInvalidField = firstInvalidField || phoneInput;
      } else {
        clearError(phoneInput);
      }

      // Validate Occasion
      const occasionVal = occasionSelect ? occasionSelect.value : '';
      if (!occasionVal) {
        showError(occasionSelect, 'Please select the celebration occasion.');
        isValid = false;
        firstInvalidField = firstInvalidField || occasionSelect;
      } else {
        clearError(occasionSelect);
      }

      // Validate Event Date
      const dateVal = dateInput ? dateInput.value : '';
      if (!dateVal) {
        showError(dateInput, 'Please choose your event date.');
        isValid = false;
        firstInvalidField = firstInvalidField || dateInput;
      } else {
        const selectedDate = new Date(dateVal);
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        if (selectedDate < todayDate) {
          showError(dateInput, 'Event date cannot be in the past.');
          isValid = false;
          firstInvalidField = firstInvalidField || dateInput;
        } else {
          clearError(dateInput);
        }
      }

      // Validate Location
      const locationVal = locationInput ? locationInput.value.trim() : '';
      if (locationVal.length < 2) {
        showError(locationInput, 'Please enter your event location or area in Delhi.');
        isValid = false;
        firstInvalidField = firstInvalidField || locationInput;
      } else {
        clearError(locationInput);
      }

      if (!isValid) {
        if (firstInvalidField) {
          firstInvalidField.focus();
        }
        return;
      }

      // Build WhatsApp Message
      const requirementsVal = requirementsInput && requirementsInput.value.trim()
        ? requirementsInput.value.trim()
        : 'Please share available designs, themes, and pricing quote.';

      // Format Date nicely for message
      let formattedDate = dateVal;
      try {
        const parts = dateVal.split('-');
        if (parts.length === 3) {
          formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
      } catch (err) {
        formattedDate = dateVal;
      }

      const message = [
        '✨ *New Balloon Decoration Enquiry*',
        '-----------------------------------',
        `👤 *Name:* ${nameVal}`,
        `📞 *Phone:* ${phoneVal}`,
        `🎉 *Occasion:* ${occasionVal}`,
        `📅 *Event Date:* ${formattedDate}`,
        `📍 *Location:* ${locationVal}`,
        `📝 *Requirements:* ${requirementsVal}`,
        '-----------------------------------',
        'Kindly share the available designs and pricing options. Thank you!'
      ].join('\n');

      const whatsappUrl = `https://wa.me/${WHATSAPP_RAW_NUMBER}?text=${encodeURIComponent(message)}`;

      // Open WhatsApp in a new tab / application
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // --------------------------------------------------------------------------
  // 7. Image Fallback Handler (Prevent broken image icons)
  // --------------------------------------------------------------------------
  function initImageFallbacks() {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      img.addEventListener('error', function () {
        if (!this.dataset.fallbackApplied) {
          this.dataset.fallbackApplied = 'true';
          this.style.display = 'none';
          const parent = this.parentElement;
          if (parent) {
            const fallbackDiv = document.createElement('div');
            fallbackDiv.className = 'img-fallback';
            fallbackDiv.textContent = this.alt || 'Sharma Balloon Decoration';
            parent.appendChild(fallbackDiv);
          }
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // Initialize Everything on DOMContentLoaded
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initCopyrightYear();
    initHeaderScroll();
    initMobileMenu();
    initScrollSpy();
    initGallery();
    initEnquiryForm();
    initImageFallbacks();
  });
})();

