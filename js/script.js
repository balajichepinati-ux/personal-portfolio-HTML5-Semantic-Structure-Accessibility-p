/* ==========================================================================
   PORTFOLIO CORE INTERACTION LOGIC (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Global DOM Selections
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const announcer = document.getElementById('sr-announcer');

  // ==========================================================================
  // 1. SCROLL EFFECT ON HEADER
  // ==========================================================================
  const handleHeaderScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('site-header--scrolled');
    } else {
      header.classList.remove('site-header--scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll(); // Run once in case page loads scrolled

  // ==========================================================================
  // 2. ACTIVE NAVIGATION ITEM STATE & ARIA HIGHLIGHTING
  // ==========================================================================
  const highlightActiveNavItem = () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      // Simple path matching
      if (currentPath.endsWith(linkHref) || (currentPath === '/' && linkHref === 'index.html')) {
        link.classList.add('nav-link--active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('nav-link--active');
        link.removeAttribute('aria-current');
      }
    });
  };
  highlightActiveNavItem();

  // ==========================================================================
  // 3. ACCESSIBLE MOBILE DRAWER WITH KEYBOARD TRAPPING & BODY LOCKING
  // ==========================================================================
  if (menuToggle && navMenu) {
    const toggleMobileMenu = () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
      
      if (!isExpanded) {
        // Menu opened
        document.body.style.overflow = 'hidden';
        announceToScreenReader('Navigation menu opened');
        // Set focus to the first nav link
        const firstLink = navMenu.querySelector('.nav-link');
        if (firstLink) firstLink.focus();
      } else {
        // Menu closed
        document.body.style.overflow = '';
        announceToScreenReader('Navigation menu closed');
        menuToggle.focus();
      }
    };

    menuToggle.addEventListener('click', toggleMobileMenu);

    // Keyboard Trap inside Mobile Drawer
    navMenu.addEventListener('keydown', (e) => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      if (!isExpanded) return;

      const focusableElements = navMenu.querySelectorAll('a, button');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }

      if (e.key === 'Escape') {
        toggleMobileMenu();
      }
    });

    // Close menu drawer if user clicks outer overlay (clicking main/footer directly)
    document.addEventListener('click', (e) => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        toggleMobileMenu();
      }
    });
  }

  // Helper function to update the hidden aria-live announcer
  function announceToScreenReader(message) {
    if (announcer) {
      announcer.textContent = message;
    }
  }

  // ==========================================================================
  // 4. INTERACTIVE 3D TILT EFFECT FOR GLASS CARDS & FLOATERS
  // ==========================================================================
  const tiltElements = document.querySelectorAll('.tilt-element');
  
  // Disable 3D tilt if user has requested reduced motion for accessibility
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!prefersReducedMotion.matches) {
    tiltElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const cardRect = element.getBoundingClientRect();
        
        // Cursor positions relative to the element
        const cardX = e.clientX - cardRect.left;
        const cardY = e.clientY - cardRect.top;
        
        // Normalize coordinates to -0.5 to 0.5 range
        const xPercent = (cardX / cardRect.width) - 0.5;
        const yPercent = (cardY / cardRect.height) - 0.5;
        
        // Define intensity (max tilt angle in degrees)
        const maxTilt = 10; 
        
        // Calculate tilt values (invert Y coordinate to tilt properly)
        const tiltX = (yPercent * maxTilt * -1).toFixed(2);
        const tiltY = (xPercent * maxTilt).toFixed(2);
        
        element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        element.style.transition = 'transform 0.05s ease-out';
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        element.style.transition = 'transform 0.4s ease-out';
      });
    });
  }

  // ==========================================================================
  // 5. SKILLS PAGE ANIMATION METER (Intersection Observer)
  // ==========================================================================
  const skillSection = document.querySelector('.skills-grid');
  const progressBars = document.querySelectorAll('.skill-progress-bar');
  const circleProgresses = document.querySelectorAll('.circle-progress');

  if (skillSection) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 1. Animate linear skill bars
          progressBars.forEach(bar => {
            const skillLevel = bar.getAttribute('data-level');
            bar.style.width = `${skillLevel}%`;
          });

          // 2. Animate circular SVG meters
          circleProgresses.forEach(circle => {
            const level = circle.getAttribute('data-level');
            // SVG perimeter represents 283 units
            const perimeter = 283;
            const offset = perimeter - (perimeter * level / 100);
            circle.style.strokeDashoffset = offset;
          });

          // Unobserve once loaded
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    skillsObserver.observe(skillSection);
  }

  // ==========================================================================
  // 6. PROJECTS PAGE INTERACTIVE CATEGORY FILTERING
  // ==========================================================================
  const filterTabs = document.querySelector('.filter-tabs');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterTabs) {
    filterTabs.addEventListener('click', (e) => {
      const button = e.target.closest('.tab-btn');
      if (!button) return;

      // Remove active from other buttons, set on this one
      filterTabs.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterVal = button.getAttribute('data-filter');

      // Announce category change to screen readers
      announceToScreenReader(`Filtering projects by ${button.textContent.trim()}`);

      projectCards.forEach(card => {
        const wrap = card.closest('.perspective-wrap') || card;
        const category = card.getAttribute('data-category');

        if (filterVal === 'all' || category === filterVal) {
          wrap.style.display = 'block';
          // Little scale-in dynamic transition
          setTimeout(() => {
            wrap.style.opacity = '1';
            wrap.style.transform = 'scale(1)';
          }, 50);
        } else {
          wrap.style.opacity = '0';
          wrap.style.transform = 'scale(0.95)';
          setTimeout(() => {
            wrap.style.display = 'none';
          }, 300);
        }
      });
    });
  }

  // ==========================================================================
  // 7. PROJECT DETAILS ACCESS MODAL (KEYBOARD TRAP / STATE RESTORE)
  // ==========================================================================
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const projectTriggerBtns = document.querySelectorAll('.btn-view-details');
  let lastActiveElement = null; // Store item to return focus to

  // Mock Database of projects details to populate modal dynamically
  const projectDetailsDb = {
    '1': {
      title: 'Quantum Dashboard 3D',
      category: 'Web Apps',
      tags: ['HTML5', 'Vanilla JS', 'CSS 3D', 'SVG'],
      client: 'SaaS Alpha Corp',
      date: 'Q1 2026',
      role: 'Lead Architect',
      desc: 'Quantum Dashboard is a futuristic control panel featuring fully handcrafted CSS 3D visualization layers, live SVG performance streams, and strict semantic HTML5. The layout serves metrics securely and achieves high responsive standard thresholds.',
      demoUrl: '#',
      githubUrl: '#'
    },
    '2': {
      title: 'Aero Glass E-commerce',
      category: 'Design Systems',
      tags: ['CSS Glass', 'Flexbox', 'Accessibility'],
      client: 'Apex Retail',
      date: 'Q4 2025',
      role: 'UX Developer',
      desc: 'A gorgeous glassmorphism shopping layout. Every component conforms strictly to WCAG 2.1 AA criteria, features a custom screen-reader visible catalog drawer, keyboard navigation, and seamless animation indicators.',
      demoUrl: '#',
      githubUrl: '#'
    },
    '3': {
      title: 'Nebula Portal API',
      category: 'Systems',
      tags: ['NodeJS', 'API', 'REST', 'Vanilla JS'],
      client: 'Nebula Labs',
      date: 'Mid 2025',
      role: 'Backend Developer',
      desc: 'An administrative node-centric client console showcasing real-time API integrations, micro-animations, and complete forms validations using custom JS patterns.',
      demoUrl: '#',
      githubUrl: '#'
    }
  };

  const openProjectModal = (projectId) => {
    const data = projectDetailsDb[projectId];
    if (!data || !modal) return;

    // Save current active element
    lastActiveElement = document.activeElement;

    // Populate modal components
    modal.querySelector('.modal-title').textContent = data.title;
    modal.querySelector('.modal-desc').textContent = data.desc;
    
    // Set text values
    modal.querySelector('.meta-client').textContent = data.client;
    modal.querySelector('.meta-date').textContent = data.date;
    modal.querySelector('.meta-role').textContent = data.role;

    // Tags
    const tagsContainer = modal.querySelector('.modal-tags');
    tagsContainer.innerHTML = '';
    data.tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'project-tag';
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });

    // Links
    const demoLink = modal.querySelector('.modal-btn-demo');
    const codeLink = modal.querySelector('.modal-btn-code');
    if (demoLink) demoLink.setAttribute('href', data.demoUrl);
    if (codeLink) codeLink.setAttribute('href', data.githubUrl);

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.setAttribute('aria-hidden', 'false');
    
    announceToScreenReader(`Project details for ${data.title} loaded.`);

    // Focus on close button or primary action
    setTimeout(() => {
      modalClose.focus();
    }, 100);
  };

  const closeProjectModal = () => {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    modal.setAttribute('aria-hidden', 'true');

    announceToScreenReader('Project details dialog closed.');

    // Restore focus
    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  };

  if (projectTriggerBtns.length > 0 && modal && modalClose) {
    projectTriggerBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        openProjectModal(id);
      });
    });

    modalClose.addEventListener('click', closeProjectModal);

    // Close Modal on clicking background
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeProjectModal();
      }
    });

    // Keyboard controls inside Modal (Escape to close, Tab trapping)
    modal.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeProjectModal();
      }

      if (e.key === 'Tab') {
        const focusables = modal.querySelectorAll('a, button, input, [tabindex="0"]');
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) { // Back Tab
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else { // Normal Tab
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });
  }

  // ==========================================================================
  // 8. CONTACT FORM CLIENT-SIDE VALIDATION & SCREEN-READER ARIA MESSAGES
  // ==========================================================================
  const contactForm = document.getElementById('portfolio-contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    const inputs = contactForm.querySelectorAll('.form-control');

    // Validation patterns
    const valRules = {
      name: (val) => val.trim().length >= 2,
      email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      subject: (val) => val.trim().length >= 4,
      message: (val) => val.trim().length >= 10
    };

    // Live validation feedback on blur
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        validateField(input);
      });

      // Clear dynamic invalid styling as user begins editing
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
          input.classList.remove('invalid');
          const errorMsg = document.getElementById(`${input.id}-error`);
          if (errorMsg) errorMsg.style.display = 'none';
        }
      });
    });

    const validateField = (input) => {
      const fieldName = input.getAttribute('name');
      const valFunc = valRules[fieldName];
      const errorMsg = document.getElementById(`${input.id}-error`);
      
      if (!valFunc) return true;

      const isValid = valFunc(input.value);

      if (!isValid) {
        input.classList.add('invalid');
        input.classList.remove('valid');
        input.setAttribute('aria-invalid', 'true');
        if (errorMsg) errorMsg.style.display = 'block';
        return false;
      } else {
        input.classList.remove('invalid');
        input.classList.add('valid');
        input.setAttribute('aria-invalid', 'false');
        if (errorMsg) errorMsg.style.display = 'none';
        return true;
      }
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let formHasErrors = false;

      // Validate all fields on submit
      inputs.forEach(input => {
        const isFieldValid = validateField(input);
        if (!isFieldValid) {
          formHasErrors = true;
        }
      });

      if (formHasErrors) {
        announceToScreenReader('Form submission failed. Please resolve highlighed inputs fields errors.');
        
        // Focus on the first invalid element
        const firstInvalid = contactForm.querySelector('.form-control.invalid');
        if (firstInvalid) firstInvalid.focus();
        
        // Show status message
        formStatus.className = 'form-status error';
        formStatus.innerHTML = `
          <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
          Please complete all required fields correctly before submitting.
        `;
        return;
      }

      // If valid, simulate dynamic submission (SaaS CRM integration)
      formStatus.className = 'form-status success';
      formStatus.innerHTML = `
        <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
        Thank you! Your message has been sent successfully. I will get back to you shortly.
      `;
      announceToScreenReader('Message sent successfully. Thank you for your inquiry.');

      // Clear the form
      contactForm.reset();
      inputs.forEach(input => {
        input.classList.remove('valid');
        input.removeAttribute('aria-invalid');
      });
    });
  }
});
