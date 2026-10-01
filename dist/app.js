/**
 * CineVault — Official Website Interactive Logic
 * Design System: Obsidian Cinema
 * Release: v2.7.0
 */

document.addEventListener('DOMContentLoaded', () => {
  // Current release constants (fallback if version.json is cached or offline)
  const APP_CONFIG = {
    version: '2.7.0',
    sizeMB: '10.9 MB',
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
  // 2. Interactive App Preview Showcase (Filter Pills & Device Lightbox)
  // =========================================================================
  const filterPills = document.querySelectorAll('.showcase-filter-pill');
  const deviceCards = document.querySelectorAll('.showcase-device-card');
  const devicesGrid = document.getElementById('showcaseDevicesGrid');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      const filterVal = pill.dataset.filter;

      if (devicesGrid) {
        devicesGrid.classList.remove('view-all', 'view-player');
        if (filterVal === 'all') devicesGrid.classList.add('view-all');
        if (filterVal === 'player') devicesGrid.classList.add('view-player');
      }

      deviceCards.forEach(card => {
        const cat = card.dataset.category;
        if (filterVal === 'all') {
          card.classList.remove('hidden-card');
        } else if (filterVal === 'player') {
          if (cat === 'player') {
            card.classList.remove('hidden-card');
          } else {
            card.classList.add('hidden-card');
          }
        } else {
          // 'core'
          if (cat === 'core') {
            card.classList.remove('hidden-card');
          } else {
            card.classList.add('hidden-card');
          }
        }
      });
    });
  });

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

      // Open reassurance modal after a slight moment so download initiates smoothly
      setTimeout(() => {
        openDownloadModal();
      }, 400);
    });
  });

  if (directDownloadAgainBtn) {
    directDownloadAgainBtn.addEventListener('click', () => {
      showToast(`Restarting download v${APP_CONFIG.version}...`);
    });
  }

  // =========================================================================
  // 5. Security Inspection 72-Engine Modal
  // =========================================================================
  const securityModal = document.getElementById('securityModal');
  const openSecurityModalBtn = document.getElementById('openSecurityModalBtn');
  const closeSecurityModalBtn = document.getElementById('closeSecurityModalBtn');
  const securityModalDoneBtn = document.getElementById('securityModalDoneBtn');

  function openSecurityModal() {
    if (securityModal) {
      securityModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSecurityModal() {
    if (securityModal) {
      securityModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (openSecurityModalBtn) {
    openSecurityModalBtn.addEventListener('click', openSecurityModal);
  }

  if (closeSecurityModalBtn) {
    closeSecurityModalBtn.addEventListener('click', closeSecurityModal);
  }

  if (securityModalDoneBtn) {
    securityModalDoneBtn.addEventListener('click', closeSecurityModal);
  }

  if (securityModal) {
    securityModal.addEventListener('click', (e) => {
      if (e.target === securityModal) closeSecurityModal();
    });
  }

  // Global ESC Key Closes Any Active Modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeDownloadModal();
      closeSecurityModal();
    }
  });


  // =========================================================================
  // 7. Multi-Device Installation Tab Switcher
  // =========================================================================
  const deviceTabBtns = document.querySelectorAll('.device-tab-btn');
  const devicePanes = {
    phone: document.getElementById('pane-phone'),
    firestick: document.getElementById('pane-firestick'),
    tv: document.getElementById('pane-tv')
  };

  deviceTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetDevice = btn.dataset.device;
      deviceTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      Object.keys(devicePanes).forEach(dev => {
        if (devicePanes[dev]) {
          if (dev === targetDevice) {
            devicePanes[dev].classList.add('active');
          } else {
            devicePanes[dev].classList.remove('active');
          }
        }
      });
    });
  });

  // Copy FireStick URL Button
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
  // 8. Sticky Mobile Download Bar (Scroll Triggered)
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
  // 9. Copy SHA-256 Checksum
  // =========================================================================
  const copyBtn = document.getElementById('copyHashBtn');
  const copyBtnText = document.getElementById('copyHashBtnText');
  const apkHash = document.getElementById('apkHash');

  if (copyBtn && apkHash) {
    copyBtn.addEventListener('click', async () => {
      const hashText = apkHash.textContent.trim();
      try {
        await navigator.clipboard.writeText(hashText);
        if (copyBtnText) copyBtnText.textContent = 'Copied!';
        showToast('SHA-256 Checksum copied to clipboard');
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'Copy Hash';
        }, 2000);
      } catch (err) {
        showToast('Hash: ' + hashText);
      }
    });
  }

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
