/**
 * CineVault — Official Distribution Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const APP_CONFIG = {
    version: '3.2.3',
    sizeMB: '5.2 MB',
    sha256: '68F5A8A73C2ED9A84703F8D63DD03F3893A846951C2B42861D1DFD49D89C8256',
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
      // Retain static fallback constants
    });

  let lastFocusedElement = null;

  // =========================================================================
  // 1. Mobile Navigation Sheet
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
  // 2. Showcase Gallery, Mobile Carousel Sync & Swipeable Lightbox
  // =========================================================================
  const deviceCards = Array.from(document.querySelectorAll('.showcase-device-card'));
  const showcaseGrid = document.getElementById('showcaseDevicesGrid');
  const showcaseDots = document.querySelectorAll('.showcase-dot');
  const showcaseTabs = document.querySelectorAll('.showcase-tab');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  let activeLightboxIndex = 0;

  function setActiveShowcaseIndex(idx) {
    deviceCards.forEach((card, i) => card.classList.toggle('is-highlighted', i === idx));
    showcaseDots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
    showcaseTabs.forEach((tab, i) => {
      const isSelected = i === idx;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', String(isSelected));
    });
  }

  function showLightboxAt(index) {
    if (!deviceCards.length || !lightboxImg) return;
    activeLightboxIndex = ((index % deviceCards.length) + deviceCards.length) % deviceCards.length;
    const card = deviceCards[activeLightboxIndex];
    const imgSrc = card.dataset.img;
    const caption = card.dataset.caption || '';
    if (imgSrc) lightboxImg.src = imgSrc;
    if (lightboxCaption) lightboxCaption.textContent = caption;
    setActiveShowcaseIndex(activeLightboxIndex);
  }

  function openLightbox(index, triggerEl) {
    if (!lightboxModal || !lightboxImg) return;
    lastFocusedElement = triggerEl || document.activeElement;
    showLightboxAt(index);
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

  if (lightboxModal) {
    lightboxModal.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        showLightboxAt(activeLightboxIndex - 1);
        return;
      }
      if (e.key === 'ArrowRight') {
        showLightboxAt(activeLightboxIndex + 1);
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = Array.from(
        lightboxModal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')
      ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
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

    let touchStartX = 0;
    let touchStartY = 0;
    lightboxModal.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );

    lightboxModal.addEventListener(
      'touchend',
      (e) => {
        if (e.changedTouches.length !== 1) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
          showLightboxAt(dx < 0 ? activeLightboxIndex + 1 : activeLightboxIndex - 1);
        }
      },
      { passive: true }
    );

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightboxAt(activeLightboxIndex - 1);
    });
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightboxAt(activeLightboxIndex + 1);
    });
  }

  deviceCards.forEach((card, index) => {
    card.addEventListener('click', () => openLightbox(index, card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index, card);
      }
    });
  });

  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', closeLightbox);
  }

  function selectShowcaseCard(idx) {
    setActiveShowcaseIndex(idx);
    if (showcaseGrid && window.innerWidth <= 1024 && deviceCards[idx]) {
      deviceCards[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  showcaseTabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      selectShowcaseCard(idx);
    });
  });

  if (showcaseGrid && showcaseDots.length > 0) {
    let dotTicking = false;

    showcaseGrid.addEventListener(
      'scroll',
      () => {
        if (dotTicking) return;
        dotTicking = true;
        requestAnimationFrame(() => {
          const gridRect = showcaseGrid.getBoundingClientRect();
          const gridCenter = gridRect.left + gridRect.width / 2;
          let activeIndex = 0;
          let closestDist = Infinity;

          deviceCards.forEach((card, idx) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const dist = Math.abs(cardCenter - gridCenter);
            if (dist < closestDist) {
              closestDist = dist;
              activeIndex = idx;
            }
          });

          setActiveShowcaseIndex(activeIndex);
          dotTicking = false;
        });
      },
      { passive: true }
    );

    showcaseDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        if (deviceCards[idx]) {
          deviceCards[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          setActiveShowcaseIndex(idx);
        }
      });
    });
  }

  // =========================================================================
  // 3. Direct APK Download Analytics (No Blocking/Floating Popup)
  // =========================================================================
  const downloadBtns = document.querySelectorAll('.trigger-download');

  downloadBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'apk_download', {
          event_category: 'Downloads',
          event_label: `CineVault v${APP_CONFIG.version} APK`,
          value: 1,
        });
      }
    });
  });

  // Global ESC key closes lightbox or mobile drawer
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
  // 4. Inline Clipboard Copy Helper (Fire TV URL)
  // =========================================================================
  async function copyTextInline(text, btn) {
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

    const btnSpan = btn.querySelector('span');
    if (btnSpan) {
      const orig = btnSpan.textContent;
      btnSpan.textContent = 'Copied!';
      setTimeout(() => {
        btnSpan.textContent = orig;
      }, 2000);
    }
  }

  const copyFirestickBtn = document.getElementById('copyFirestickUrlBtn');
  const firestickUrl = document.getElementById('firestickUrl');
  if (copyFirestickBtn && firestickUrl) {
    copyFirestickBtn.addEventListener('click', () => {
      const rawText = firestickUrl.textContent.trim();
      const urlText = rawText.startsWith('http') ? rawText : `https://${rawText}`;
      copyTextInline(urlText, copyFirestickBtn);
    });
  }

  // =========================================================================
  // 5. Header Elevation Observer
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
  // 6. Telegram Community Links & Mobile Deep-Link Intent
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
  // 7. Accessible FAQ Accordion
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
