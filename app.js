/**
 * CineVault — Official Website Interactive Logic
 * Design System: Obsidian Cinema
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Interactive Showcase Tab Switcher
  const tabButtons = document.querySelectorAll('.showcase-tab-btn');
  const showcaseImg = document.getElementById('showcasePreviewImg');
  const showcaseTitle = document.getElementById('showcaseViewTitle');
  const showcaseSpec = document.getElementById('showcaseSpecTag');

  let currentActiveImg = 'assets/home_screenshot.png';

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetImg = btn.dataset.img;
      const targetTitle = btn.dataset.title;
      const targetSpec = btn.dataset.spec;

      if (targetImg && showcaseImg) {
        currentActiveImg = targetImg;
        showcaseImg.style.opacity = '0.3';
        showcaseImg.style.transform = 'scale(0.98)';

        setTimeout(() => {
          showcaseImg.src = targetImg;
          if (showcaseTitle && targetTitle) showcaseTitle.textContent = targetTitle;
          if (showcaseSpec && targetSpec) showcaseSpec.textContent = targetSpec;
          showcaseImg.style.opacity = '1';
          showcaseImg.style.transform = 'scale(1)';
        }, 150);
      }
    });
  });

  // 2. Lightbox Modal for Uncropped Retina Screenshots
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
    previewTrigger.addEventListener('click', () => {
      openLightbox(currentActiveImg);
    });
  }

  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  // 3. Toast Feedback Helper
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
    }, 2600);
  }

  // 4. Copy SHA-256 Checksum
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

  // 5. Download Triggers Toast
  const downloadBtns = document.querySelectorAll('.trigger-download');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Downloading CineVault v2.4.0 (8.8 MB)...');
    });
  });
});
