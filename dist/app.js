/**
 * CineVault — Official Website Interactive Logic
 * Design System: Obsidian Void
 */

document.addEventListener('DOMContentLoaded', () => {
  const APP_CONFIG = {
    version: '3.1.0',
    sizeMB: '11.5 MB',
    sha256: 'F08A143FE6F4258C3048006CE52C9DA0DAA917756FD6EDCA66801919B3C594B6',
    apkPath: 'downloads/CineVault.apk',
    websiteUrl: 'https://www.cinevaultapk.online/',
  };

  function syncVersionDom(version, sizeMB, sha256) {
    if (version) {
      document.querySelectorAll('[data-app-version]').forEach((el) => {
        el.textContent = `v${version}`;
      });
    }
    if (sizeMB) {
      document.querySelectorAll('[data-app-size]').forEach((el) => {
        el.textContent = sizeMB;
      });
    }
    const hashEl = document.getElementById('apkHash');
    if (sha256 && hashEl) {
      hashEl.textContent = sha256;
    }
  }

  // Hydrate dynamic release badges from version.json
  fetch('version.json')
    .then((res) => res.json())
    .then((data) => {
      if (!data) return;
      if (data.version || data.latestVersionName) {
        APP_CONFIG.version = data.version || data.latestVersionName;
      }
      if (data.fileSizeMB) {
        APP_CONFIG.sizeMB = data.fileSizeMB;
      }
      if (data.sha256) {
        APP_CONFIG.sha256 = data.sha256;
      }
      syncVersionDom(APP_CONFIG.version, APP_CONFIG.sizeMB, APP_CONFIG.sha256);
    })
    .catch(() => {
      // Keep static fallback constants
    });

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
      if (mobileNavDrawer.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    document.addEventListener('click', (e) => {
      if (
        mobileNavDrawer.classList.contains('open') &&
        !mobileNavDrawer.contains(e.target) &&
        e.target !== mobileMenuToggle &&
        !mobileMenuToggle.contains(e.target)
      ) {
        closeMobileNav();
      }
    });
  }

  // =========================================================================
  // 3. Lightbox Modal with Clean Focus Handling (Single Bound Listener)
  // =========================================================================
  const deviceCards = document.querySelectorAll('.showcase-device-card');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');

  let currentActiveImg = 'assets/home_screenshot.webp?v=3.1.0';

  if (lightboxModal) {
    lightboxModal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusables = Array.from(
        lightboxModal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')
      ).filter((el) => !el.hasAttribute('disabled'));
      if (focusables.length === 0) return;

      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        lastEl.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        firstEl.focus();
        e.preventDefault();
      }
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  function openLightbox(src, triggerEl) {
    if (!lightboxModal || !lightboxImg) return;
    lastFocusedElement = triggerEl || document.activeElement;
    currentActiveImg = src || currentActiveImg;
    lightboxImg.src = currentActiveImg;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (closeLightboxBtn) closeLightboxBtn.focus();
  }

  function closeLightbox() {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  deviceCards.forEach((card) => {
    card.addEventListener('click', () => {
      const imgSrc = card.dataset.img;
      if (imgSrc) openLightbox(imgSrc, card);
    });

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

  // Mobile Carousel Pagination Dots
  const showcaseGrid = document.getElementById('showcaseDevicesGrid');
  const showcaseDots = document.querySelectorAll('.showcase-dot');

  if (showcaseGrid && showcaseDots.length > 0) {
    let dotTicking = false;

    showcaseGrid.addEventListener(
      'scroll',
      () => {
        if (dotTicking) return;
        dotTicking = true;
        requestAnimationFrame(() => {
          const firstCard = deviceCards[0];
          const stepWidth = firstCard ? firstCard.getBoundingClientRect().width + 16 : 266;
          const activeIndex = Math.min(
            showcaseDots.length - 1,
            Math.max(0, Math.round(showcaseGrid.scrollLeft / stepWidth))
          );
          showcaseDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === activeIndex);
          });
          dotTicking = false;
        });
      },
      { passive: true }
    );

    showcaseDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        if (deviceCards[idx]) {
          deviceCards[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      });
    });
  }

  // =========================================================================
  // 4. Download Analytics & Toast
  // =========================================================================
  const downloadBtns = document.querySelectorAll('.trigger-download');

  downloadBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast(`Downloading CineVault v${APP_CONFIG.version} (${APP_CONFIG.sizeMB})...`);
      if (typeof gtag === 'function') {
        gtag('event', 'apk_download', {
          event_category: 'Downloads',
          event_label: `CineVault v${APP_CONFIG.version} APK`,
          value: 1,
        });
      }
    });
  });

  // Global ESC key closes lightbox or mobile navigation drawer
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    } else if (mobileNavDrawer && mobileNavDrawer.classList.contains('open')) {
      closeMobileNav();
      if (mobileMenuToggle) mobileMenuToggle.focus();
    }
  });

  // =========================================================================
  // 5. Clipboard Copy Helper (Fire TV URL & SHA-256 Hash)
  // =========================================================================
  async function copyTextWithFeedback(text, btn, toastText) {
    let copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      try {
        const tempInput = document.createElement('textarea');
        tempInput.value = text;
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

    showToast(toastText);
    const btnSpan = btn.querySelector('span');
    if (btnSpan) {
      const orig = btnSpan.textContent;
      btnSpan.textContent = 'Copied!';
      setTimeout(() => {
        btnSpan.textContent = orig;
      }, 2200);
    }
  }

  const copyFirestickBtn = document.getElementById('copyFirestickUrlBtn');
  const firestickUrl = document.getElementById('firestickUrl');
  if (copyFirestickBtn && firestickUrl) {
    copyFirestickBtn.addEventListener('click', () => {
      const rawText = firestickUrl.textContent.trim();
      const urlText = rawText.startsWith('http') ? rawText : `https://${rawText}`;
      copyTextWithFeedback(urlText, copyFirestickBtn, 'Downloader URL copied to clipboard!');
    });
  }

  const copyHashBtn = document.getElementById('btnCopyHash');
  const apkHashEl = document.getElementById('apkHash');
  if (copyHashBtn && apkHashEl) {
    copyHashBtn.addEventListener('click', () => {
      copyTextWithFeedback(apkHashEl.textContent.trim(), copyHashBtn, 'SHA-256 Checksum copied!');
    });
  }

  // =========================================================================
  // 6. Header Elevation Observer (Zero Scroll-Event Overhead)
  // =========================================================================
  const headerWrapper = document.getElementById('headerWrapper');
  const heroCtaRow = document.querySelector('.hero-cta-row');

  if (headerWrapper && heroCtaRow && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isPastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
          headerWrapper.classList.toggle('is-scrolled', isPastHero);
        });
      },
      { threshold: 0.1 }
    );
    heroObserver.observe(heroCtaRow);
  }

  // =========================================================================
  // 7. Telegram Community Links & Mobile Deep-Link Intent
  // =========================================================================
  const telegramBtns = document.querySelectorAll(
    '.btn-nav-telegram, .btn-hero-telegram, .mobile-nav-telegram, .footer-link[href*="telegram"]'
  );
  telegramBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'telegram_click', {
          event_category: 'Community',
          event_label: 'CineVault Telegram Channel',
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
  // 8. Accessible FAQ Accordion
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('active', !isActive);
      questionBtn.setAttribute('aria-expanded', String(!isActive));
    });
  });
});
