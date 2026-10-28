/**
 * Toqa Adel Portfolio - Main Application Script
 * Theme toggle, mobile menu, scroll spy, skills filter, modals, and inquiry form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initScrollSpy();
  initSkillsFilter();
  initModals();
  initContactForm();
});

/* ==========================================================================
   1. THEME TOGGLE (DARK / LIGHT MODE)
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Retrieve saved theme or check OS preference
  const savedTheme = localStorage.getItem('toqa_portfolio_theme');
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    html.setAttribute('data-theme', 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('toqa_portfolio_theme', newTheme);
    });
  }
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileMenuBtn || !navMenu) return;

  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-active');
  });

  // Close nav on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-active');
    });
  });

  // Close nav if clicked outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      navMenu.classList.remove('mobile-active');
    }
  });
}

/* ==========================================================================
   3. SCROLL SPY & ACTIVE NAV HIGHLIGHT
   ========================================================================== */
function initScrollSpy() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const HEADER_HEIGHT = 80; // px — matches the sticky header height

  function updateActiveNav() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Find the last section whose top edge has scrolled past the header
    let currentId = sections[0].getAttribute('id');
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top + scrollY - HEADER_HEIGHT - 10;
      if (scrollY >= top) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Run on scroll (passive for performance) and on load
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

// Global scroll helper for Hero terminal button
window.scrollToLab = function() {
  const labSection = document.getElementById('lab');
  if (labSection) {
    labSection.scrollIntoView({ behavior: 'smooth' });
    // Switch to first tab if not already
    const firstTabBtn = document.querySelector('.lab-tab-btn[data-tab="bdd-runner"]');
    if (firstTabBtn) firstTabBtn.click();
  }
};

/* ==========================================================================
   4. SKILLS FILTER TABS
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Set active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter skill cards
      skillCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filter === 'all' || cardCat === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   5. CASE STUDY MODAL DIALOGS
   ========================================================================== */
function initModals() {
  const openButtons = document.querySelectorAll('.open-modal-btn');
  const modals = document.querySelectorAll('.modal-overlay');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modals.forEach(modal => {
    // Close button
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }

    // Modal action buttons
    const actionCloseButtons = modal.querySelectorAll('.modal-close-action');
    actionCloseButtons.forEach(b => {
      b.addEventListener('click', () => closeModal(modal));
    });

    // Close when clicking overlay backdrop outside dialog
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(m => {
        if (m.classList.contains('active')) closeModal(m);
      });
    }
  });

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   6. CONTACT & HIRE ME FORM VALIDATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('hireForm');
  if (!form) return;

  const clientName = document.getElementById('clientName');
  const clientEmail = document.getElementById('clientEmail');
  const serviceType = document.getElementById('serviceType');
  const targetPlatform = document.getElementById('targetPlatform');
  const projectTimeline = document.getElementById('projectTimeline');
  const projectScope = document.getElementById('projectScope');
  const formSuccessMessage = document.getElementById('formSuccessMessage');
  const directMailtoBtn = document.getElementById('directMailtoBtn');
  const copyBriefBtn = document.getElementById('copyBriefBtn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset error states
    document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('has-error'));

    // Validate Name
    if (!clientName.value.trim()) {
      clientName.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!clientEmail.value.trim() || !emailRegex.test(clientEmail.value.trim())) {
      clientEmail.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    // Validate Service
    if (!serviceType.value) {
      serviceType.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    // Validate Scope
    if (!projectScope.value.trim() || projectScope.value.trim().length < 10) {
      projectScope.closest('.form-group').classList.add('has-error');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Build Formatted Project Brief
    const serviceLabels = {
      e2e_automation: "End-to-End Web & Mobile Automated Testing",
      api_testing: "REST API Testing & Postman Collection Setup",
      cicd_quality_gate: "CI/CD Pipeline Quality Gate Integration",
      qa_strategy_bdd: "QA Strategy, BDD Setup & Defect Audit",
      sql_db_validation: "Database & BI Data Integrity Validation"
    };

    const selectedServiceName = serviceLabels[serviceType.value] || serviceType.value;
    const platformVal = targetPlatform.value.trim() || "Not specified";
    const timelineVal = projectTimeline.options[projectTimeline.selectedIndex].text;

    const emailSubject = encodeURIComponent(`QA Freelance Inquiry: ${selectedServiceName} - from ${clientName.value.trim()}`);
    const emailBody = encodeURIComponent(
      `Hello Toqa,\n\n` +
      `I would like to inquire about your freelance QA engineering services.\n\n` +
      `Client Name: ${clientName.value.trim()}\n` +
      `Client Email: ${clientEmail.value.trim()}\n` +
      `Selected Service: ${selectedServiceName}\n` +
      `Target Tech Stack / Platform: ${platformVal}\n` +
      `Timeline: ${timelineVal}\n\n` +
      `Project Details & Scope:\n${projectScope.value.trim()}\n\n` +
      `Best regards,\n${clientName.value.trim()}`
    );

    const mailtoUrl = `mailto:toka.adel50@gmail.com?subject=${emailSubject}&body=${emailBody}`;

    // Update Direct Mailto Button
    directMailtoBtn.setAttribute('href', mailtoUrl);

    // Show Success Alert
    formSuccessMessage.style.display = 'flex';
    formSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Handle Copy Brief Button
    copyBriefBtn.onclick = () => {
      const plainBriefText = 
        `QA Freelance Inquiry for Toqa Adel Mohamed\n` +
        `-----------------------------------------\n` +
        `Client Name: ${clientName.value.trim()}\n` +
        `Client Email: ${clientEmail.value.trim()}\n` +
        `Selected Service: ${selectedServiceName}\n` +
        `Target Stack: ${platformVal}\n` +
        `Timeline: ${timelineVal}\n\n` +
        `Scope:\n${projectScope.value.trim()}\n` +
        `-----------------------------------------`;

      navigator.clipboard.writeText(plainBriefText).then(() => {
        const originalText = copyBriefBtn.textContent;
        copyBriefBtn.textContent = "Copied to Clipboard!";
        setTimeout(() => {
          copyBriefBtn.textContent = originalText;
        }, 2500);
      }).catch(() => {
        alert("Brief text copied!");
      });
    };
  });

  // CV Modal Helpers
  window.openCvModal = function() {
    const cvModal = document.getElementById('modal-cv');
    if (cvModal) {
      cvModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const navCvBtn = document.getElementById('btnOpenCvModalNav');
  const heroCvBtn = document.getElementById('btnOpenCvModalHero');
  if (navCvBtn) navCvBtn.addEventListener('click', window.openCvModal);
  if (heroCvBtn) heroCvBtn.addEventListener('click', window.openCvModal);

  const copyCvBtn = document.getElementById('btnCopyCvInfo');
  if (copyCvBtn) {
    copyCvBtn.addEventListener('click', () => {
      const contactInfo = 
`Toqa Adel Mohamed Mohamed
Software QA Engineer | Automation & API Tester | Technical Support Specialist
Phone: 01121188154 (+20 112 118 8154)
Email: toka.adel50@gmail.com
Location: Giza, Egypt
LinkedIn: https://linkedin.com/in/toqa-adel
GitHub: https://github.com/Toqa-Adel`;

      navigator.clipboard.writeText(contactInfo).then(() => {
        const originalText = copyCvBtn.textContent;
        copyCvBtn.textContent = "Contact Info Copied!";
        setTimeout(() => {
          copyCvBtn.textContent = originalText;
        }, 2500);
      }).catch(() => {
        alert("Contact details copied!");
      });
    });
  }
}
