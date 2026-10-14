/**
 * CineVault — Official Website Interactive Logic
 * Design System: Obsidian Cinema
 * Release: v2.8.0
 */

document.addEventListener('DOMContentLoaded', () => {
  // Current release constants (fallback if version.json is cached or offline)
  const APP_CONFIG = {
    version: '2.8.0',
    sizeMB: '12.4 MB',
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
    }, 2800);
  }

  // =========================================================================
  // 2. Interactive App Preview Showcase (Device Lightbox)
  // =========================================================================
  const deviceCards = document.querySelectorAll('.showcase-device-card');

  // Attach Lightbox triggers to each device card
  deviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.dataset.img;
      if (imgSrc) openLightbox(imgSrc);
    });
  });

  // =========================================================================
  // 3. Lightbox Modal for Uncropped Retina Screenshots
  // =========================================================================
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const previewTrigger = document.getElementById('showcasePreviewTrigger');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');

  function openLightbox(src) {
    if (lightboxModal && lightboxImg) {
      lightboxImg.src = src || currentActiveImg;
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (previewTrigger) {
    previewTrigger.addEventListener('click', () => openLightbox(currentActiveImg));
  }

  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // =========================================================================
  // 4. Smart Download Reassurance Modal
  // =========================================================================
  const downloadModal = document.getElementById('downloadModal');
  const closeDownloadModalBtn = document.getElementById('closeDownloadModalBtn');
  const directDownloadAgainBtn = document.getElementById('directDownloadAgainBtn');
  const downloadBtns = document.querySelectorAll('.trigger-download');

  function openDownloadModal() {
    if (downloadModal) {
      downloadModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDownloadModal() {
    if (downloadModal) {
      downloadModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeDownloadModalBtn) {
    closeDownloadModalBtn.addEventListener('click', closeDownloadModal);
  }

  if (downloadModal) {
    downloadModal.addEventListener('click', (e) => {
      if (e.target === downloadModal) closeDownloadModal();
    });
  }

  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Trigger toast feedback
      showToast(`Downloading CineVault v${APP_CONFIG.version} (${APP_CONFIG.sizeMB})...`);

      // Analytics Event
      if (typeof gtag === 'function') {
        gtag('event', 'apk_download', {
          event_category: 'Downloads',
          event_label: `CineVault v${APP_CONFIG.version} APK`,
          value: 1
        });
      }

      // Instant clean download without intrusive popups
      // Download initiates natively via the <a> link
    });
  });

  if (directDownloadAgainBtn) {
    directDownloadAgainBtn.addEventListener('click', () => {
      showToast(`Restarting download v${APP_CONFIG.version}...`);
    });
  }

  // Global ESC Key Closes Any Active Modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeDownloadModal();
    }
  });

  // =========================================================================
  // 5. FireStick / TV Downloader URL Copy Button
  // =========================================================================
  const copyFirestickBtn = document.getElementById('copyFirestickUrlBtn');
  const firestickUrl = document.getElementById('firestickUrl');
  if (copyFirestickBtn && firestickUrl) {
    copyFirestickBtn.addEventListener('click', async () => {
      const urlText = firestickUrl.textContent.trim();
      try {
        await navigator.clipboard.writeText(urlText);
        copyFirestickBtn.textContent = 'Copied!';
        showToast('FireStick Downloader URL copied');
        setTimeout(() => {
          copyFirestickBtn.textContent = 'Copy URL';
        }, 2000);
      } catch {
        showToast('URL: ' + urlText);
      }
    });
  }

  // =========================================================================
  // 6. Sticky Mobile Download Bar (Scroll Triggered)
  // =========================================================================
  const stickyMobileBar = document.getElementById('stickyMobileBar');
  let isScrolling = false;

  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        if (stickyMobileBar) {
          if (window.scrollY > 380) {
            stickyMobileBar.classList.add('visible');
          } else {
            stickyMobileBar.classList.remove('visible');
          }
        }
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  // =========================================================================
  // 10. Telegram Channel Direct App Opener & Analytics
  // =========================================================================
  const telegramBtns = document.querySelectorAll('.btn-nav-telegram, .btn-hero-telegram, .footer-link[href*="telegram"]');
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
  // 11. Interactive FAQ Accordion
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });
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
