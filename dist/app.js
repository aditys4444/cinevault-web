/**
 * CineVault — Official Website Interactive Logic
 * Design System: Obsidian Cinema
 * Release: v2.9.3 (Build 2930)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Current release constants (fallback if version.json is offline or cached)
  const APP_CONFIG = {
    version: '2.9.3',
    sizeMB: '11.0MB',
    apkPath: 'downloads/CineVault.apk',
    websiteUrl: 'https://cinevaultapk.online/'
  };

  // Try to sync with latest version.json dynamically
  fetch('version.json')
    .then(res => res.json())
    .then(data => {
      if (data && data.version) {
        APP_CONFIG.version = data.version;
        if (data.fileSizeMB) APP_CONFIG.sizeMB = data.fileSizeMB;
      }
    })
    .catch(() => {
      // Graceful fallback to default constants
    });

  // Track element focus for accessibility
  let lastFocusedElement = null;

  // =========================================================================
  // 1. Toast Feedback Helper
  // =========================================================================
  const toast = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // =========================================================================
  // 2. Mobile Navigation Drawer
  // =========================================================================
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileNav() {
    if (!mobileNavDrawer || !mobileMenuToggle) return;
    mobileNavDrawer.classList.add('open');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    mobileMenuToggle.classList.add('is-active');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    mobileMenuToggle.setAttribute('aria-label', 'Close navigation menu');
  }

  function closeMobileNav() {
    if (!mobileNavDrawer || !mobileMenuToggle) return;
    mobileNavDrawer.classList.remove('open');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    mobileMenuToggle.classList.remove('is-active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-label', 'Open navigation menu');
  }

  if (mobileMenuToggle && mobileNavDrawer) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNavDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close when clicking any nav link
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close when clicking outside drawer
    document.addEventListener('click', (e) => {
      if (mobileNavDrawer.classList.contains('open') && 
          !mobileNavDrawer.contains(e.target) && 
          e.target !== mobileMenuToggle && 
          !mobileMenuToggle.contains(e.target)) {
        closeMobileNav();
      }
    });
  }

  // =========================================================================
  // 3. Focus Trapping for Accessible Modals
  // =========================================================================
  function trapFocus(modalElement) {
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(modalElement.querySelectorAll(focusableSelectors))
      .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modalElement.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  }

  // =========================================================================
  // 4. Interactive App Preview Showcase & Lightbox Modal
  // =========================================================================
  const deviceCards = document.querySelectorAll('.showcase-device-card');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');

  let currentActiveImg = 'assets/home_screenshot.webp';

  function openLightbox(src, triggerEl) {
    if (lightboxModal && lightboxImg) {
      lastFocusedElement = triggerEl || document.activeElement;
      currentActiveImg = src || currentActiveImg;
      lightboxImg.src = currentActiveImg;
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (closeLightboxBtn) closeLightboxBtn.focus();
      trapFocus(lightboxModal);
    }
  }

  function closeLightbox() {
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }
  }

  deviceCards.forEach(card => {
    // Click event
    card.addEventListener('click', () => {
      const imgSrc = card.dataset.img;
      if (imgSrc) openLightbox(imgSrc, card);
    });

    // Keyboard accessibility: Enter or Space triggers enlargement
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const imgSrc = card.dataset.img;
        if (imgSrc) openLightbox(imgSrc, card);
      }
    });
  });

  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Mobile Carousel Dots Sync
  const showcaseGrid = document.getElementById('showcaseDevicesGrid');
  const showcaseDots = document.querySelectorAll('.showcase-dot');

  if (showcaseGrid && showcaseDots.length > 0) {
    let dotTicking = false;
    const cachedCardWidth = 266; // 250px card + 16px gap

    showcaseGrid.addEventListener('scroll', () => {
      if (!dotTicking) {
        dotTicking = true;
        requestAnimationFrame(() => {
          const scrollLeft = showcaseGrid.scrollLeft;
          const activeIndex = Math.min(showcaseDots.length - 1, Math.max(0, Math.round(scrollLeft / cachedCardWidth)));
          showcaseDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === activeIndex);
          });
          dotTicking = false;
        });
      }
    }, { passive: true });

    showcaseDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        if (deviceCards[idx]) {
          deviceCards[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      });
    });
  }

  // =========================================================================
  // 5. Direct Native Download Analytics & Non-blocking Toast
  // =========================================================================
  const downloadBtns = document.querySelectorAll('.trigger-download');

  downloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast(`Downloading CineVault v${APP_CONFIG.version} (${APP_CONFIG.sizeMB})...`);

      // Analytics Event
      if (typeof gtag === 'function') {
        gtag('event', 'apk_download', {
          event_category: 'Downloads',
          event_label: `CineVault v${APP_CONFIG.version} APK`,
          value: 1
        });
      }
      // Direct native browser download proceeds via normal <a href="downloads/CineVault.apk" download="CineVault.apk">
      // No custom modal, no blocking popups, no delayed overlays.
    });
  });

  // Global ESC Key Closes Lightbox Modal or Mobile Nav Drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxModal && lightboxModal.classList.contains('active')) {
        closeLightbox();
      } else if (mobileNavDrawer && mobileNavDrawer.classList.contains('open')) {
        closeMobileNav();
        if (mobileMenuToggle) mobileMenuToggle.focus();
      }
    }
  });

  // =========================================================================
  // 6. FireStick / TV Downloader URL Copy Button with Robust Fallback
  // =========================================================================
  const copyFirestickBtn = document.getElementById('copyFirestickUrlBtn');
  const firestickUrl = document.getElementById('firestickUrl');

  if (copyFirestickBtn && firestickUrl) {
    copyFirestickBtn.addEventListener('click', async () => {
      const rawText = firestickUrl.textContent.trim();
      const urlText = rawText.startsWith('http') ? rawText : 'https://' + rawText;
      let copied = false;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(urlText);
          copied = true;
        }
      } catch {
        copied = false;
      }

      if (!copied) {
        try {
          const tempInput = document.createElement('textarea');
          tempInput.value = urlText;
          tempInput.style.position = 'fixed';
          tempInput.style.opacity = '0';
          document.body.appendChild(tempInput);
          tempInput.select();
          copied = document.execCommand('copy');
          document.body.removeChild(tempInput);
        } catch {
          copied = false;
        }
      }

      showToast('Downloader link copied to clipboard!');
      const btnSpan = copyFirestickBtn.querySelector('span');
      if (btnSpan) {
        const orig = btnSpan.textContent;
        btnSpan.textContent = 'Copied!';
        setTimeout(() => { btnSpan.textContent = orig; }, 2200);
      }
    });
  }

  // =========================================================================
  // 7. Desktop Header Subtle Elevation Observer (Zero Scroll-Event Overhead)
  // =========================================================================
  const headerWrapper = document.getElementById('headerWrapper');
  const heroCtaRow = document.querySelector('.hero-cta-row');

  if (headerWrapper && heroCtaRow && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const isPastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        headerWrapper.classList.toggle('is-scrolled', isPastHero);
      });
    }, { threshold: 0.1 });

    heroObserver.observe(heroCtaRow);
  }

  // =========================================================================
  // 8. Telegram Community Links & Analytics
  // =========================================================================
  const telegramBtns = document.querySelectorAll('.btn-nav-telegram, .btn-hero-telegram, .mobile-nav-telegram, .footer-link[href*="telegram"]');
  telegramBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'telegram_click', {
          event_category: 'Community',
          event_label: 'CineVault Telegram Channel'
        });
      }
      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        setTimeout(() => {
          window.location.href = 'tg://join?invite=0nZRFagm4wU1MDll';
        }, 50);
      }
    });
  });

  // =========================================================================
  // 9. Accessible FAQ Accordion
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Collapse all others
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle clicked item
        if (isActive) {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });
});
