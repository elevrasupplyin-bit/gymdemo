/**
 * IRONVAULT FITNESS - INTERACTIVE ENGINE
 * Pure vanilla JavaScript: Fast, accessible, and zero external runtime dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. STICKY HEADER & NAVBAR DYNAMICS
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('siteHeader');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleScrollHeader = () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader(); // Initial run

  // Mobile menu toggle
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);

      // Animate hamburger spans
      const spans = hamburgerBtn.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close mobile menu on link click
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        const spans = hamburgerBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. ACTIVE NAVIGATION INDICATOR ON SCROLL (SPY)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      const currentNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (currentNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          currentNavLink.classList.add('active');
        } else {
          currentNavLink.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // --------------------------------------------------------------------------
  // 3. STATS NUMBER COUNTER ANIMATION
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasCounted = false;

  const animateCounters = () => {
    statNumbers.forEach((counter) => {
      const target = +counter.getAttribute('data-target');
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out expo curve for professional athletic stats feel
        const easeOutQuad = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOutQuad * target);

        counter.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  // --------------------------------------------------------------------------
  // 4. INTERSECTION OBSERVER FOR SCROLL REVEALS & STATS
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');

          // Trigger stats counters only once when stats section enters view
          if (!hasCounted && entry.target.classList.contains('stat-card')) {
            hasCounted = true;
            animateCounters();
          }

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // --------------------------------------------------------------------------
  // 5. LEAD FORM VALIDATION & HIGH-CONVERTING SUBMISSION
  // --------------------------------------------------------------------------
  const leadForm = document.getElementById('leadForm');
  const nameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phoneNumber');
  const emailInput = document.getElementById('emailAddress');
  const programSelect = document.getElementById('programSelect');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccessMessage');

  if (leadForm) {
    const validatePhone = (val) => /^[6-9]\d{9}$/.test(val.replace(/\s+/g, ''));
    const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        nameInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Indian Phone format
      const cleanedPhone = phoneInput.value.replace(/[\s\-+]/g, '');
      if (!validatePhone(cleanedPhone)) {
        phoneInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        phoneInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Email
      if (!validateEmail(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        emailInput.closest('.form-group').classList.remove('has-error');
      }

      if (!isValid) return;

      // Realistic CTA button loading state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> SECURING PASS...`;

      setTimeout(() => {
        submitBtn.style.display = 'none';
        formSuccess.style.display = 'flex';
        leadForm.reset();

        // Optional UX: Smooth scroll user to show confirmation
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1200);
    });

    // Clear error states on input
    [nameInput, phoneInput, emailInput].forEach((input) => {
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('has-error');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. PROGRAM CARD & PRICING PRE-SELECT INTERACTION
  // --------------------------------------------------------------------------
  const programCards = document.querySelectorAll('.program-card');
  if (programSelect && programCards.length) {
    programCards.forEach((card, index) => {
      const actionBtn = card.querySelector('.card-action');
      if (actionBtn) {
        actionBtn.addEventListener('click', () => {
          // Pre-populate dropdown selection logically
          const options = programSelect.options;
          if (options.length > index + 1) {
            programSelect.selectedIndex = index + 1;
          }
        });
      }
    });
  }
});
