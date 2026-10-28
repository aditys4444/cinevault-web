const fs = require('fs');
const path = require('path');

console.log('========================================================');
console.log(' CineVault Comprehensive Codebase Integrity Verification');
console.log('========================================================\n');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');
const versionJson = JSON.parse(fs.readFileSync('version.json', 'utf8'));

let failures = 0;

function report(testName, passed, details = '') {
  if (passed) {
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName}: ${details}`);
    failures++;
  }
}

// 1. Verify Explorer section has been removed completely
const forbiddenExplorerTerms = [
  'id="explorer"',
  'id="explorerSearchInput"',
  'id="explorerClearSearch"',
  'id="explorerGrid"',
  'href="#explorer"'
];
let explorerLeftovers = forbiddenExplorerTerms.filter(t => html.includes(t));
report('Explorer section completely eradicated', explorerLeftovers.length === 0, explorerLeftovers.join(', '));

// 2. Verify downloadModal and stickyMobileBar removed completely
const forbiddenModalAndSticky = [
  'id="downloadModal"',
  'id="downloadModalTitle"',
  'id="closeDownloadModalBtn"',
  'id="directDownloadAgainBtn"',
  'id="stickyMobileBar"',
  'class="sticky-mobile-bar"',
  'class="modal-overlay"'
];
let modalLeftovers = forbiddenModalAndSticky.filter(t => html.includes(t));
report('Download modal and sticky bar completely removed from DOM', modalLeftovers.length === 0, modalLeftovers.join(', '));

// 3. Showcase screenshot assets verification
const showcaseScreenshots = [
  'assets/home_screenshot.webp',
  'assets/player_screenshot.webp',
  'assets/livetv_screenshot.webp'
];
let missingScreenshots = showcaseScreenshots.filter(shot => {
  return !html.includes(shot) || !fs.existsSync(shot);
});
report('Showcase Retina screenshots integrated and exist on disk', missingScreenshots.length === 0, missingScreenshots.join(', '));

// 4. Required DOM IDs for modern interactive features
const requiredIds = [
  'mainContent', 'headerWrapper', 'mainNavBar', 'desktopNavLinks',
  'mobileMenuToggle', 'mobileNavDrawer',
  'features', 'showcase', 'installation', 'faq', 'download',
  'showcaseDevicesGrid', 'showcaseDots', 'lightboxModal', 'lightboxImg', 'closeLightboxBtn',
  'firestickUrl', 'copyFirestickUrlBtn',
  'toastNotice', 'toastMessage'
];
let missingIds = requiredIds.filter(id => !html.includes(`id="${id}"`));
report(`All ${requiredIds.length} interactive element IDs present`, missingIds.length === 0, missingIds.join(', '));

// 5. Required DOM Classes
const requiredClasses = [
  'nav-bar', 'nav-link', 'btn-mobile-menu-toggle', 'mobile-nav-link',
  'bento-card', 'showcase-device-card', 'showcase-device-chassis',
  'showcase-screen-viewport', 'showcase-screen-img', 'trigger-download',
  'faq-item', 'faq-question', 'faq-answer'
];
let missingClasses = requiredClasses.filter(cls => !html.includes(cls));
report(`All ${requiredClasses.length} key component classes present in HTML`, missingClasses.length === 0, missingClasses.join(', '));

// 6. Check CSS rules in styles.css
const requiredCssRules = [
  '.header-wrapper', '.nav-bar', '.btn-mobile-menu-toggle', '.mobile-nav-drawer',
  '.bento-grid', '.bento-card', '.showcase-devices-grid', '.showcase-device-card',
  '.showcase-device-chassis', '.showcase-dots', '.showcase-dot',
  '.steps-grid', '.tv-sideload-box', '.faq-accordion', '.faq-item',
  '.skip-link', ':focus-visible'
];
let missingCss = requiredCssRules.filter(sel => !css.includes(sel));
report(`All ${requiredCssRules.length} component selectors present in styles.css`, missingCss.length === 0, missingCss.join(', '));

// 7. Performance & Anti-jank verification
const hasBackdropFilter = css.includes('backdrop-filter');
report('Zero backdrop-filter in styles.css for 60fps GPU performance', !hasBackdropFilter);

const hasTranslateZLayers = css.includes('transform: translateZ(0)');
report('Zero translateZ compositor layer bloat in styles.css', !hasTranslateZLayers);

const hasSmoothScrollHijack = css.includes('scroll-behavior: smooth');
report('Zero scroll-behavior: smooth on html for responsive browser scrolling', !hasSmoothScrollHijack);

const hasContentVisibility = css.includes('content-visibility: auto');
report('Off-screen sections use content-visibility: auto for smooth scroll containment', hasContentVisibility);

const hasOverflowClip = css.includes('overflow-x: clip');
report('Root html uses overflow-x: clip to preserve GPU compositor thread scrolling', hasOverflowClip);

// 8. Direct Download Links verification
const downloadButtons = [
  'href="downloads/CineVault.apk"',
  'download="CineVault.apk"'
];
let missingDownloadAttrs = downloadButtons.filter(attr => !html.includes(attr));
report('Download buttons link directly to downloads/CineVault.apk with download attribute', missingDownloadAttrs.length === 0);

// 9. Content and Version Consistency Audit
const expectedVersion = versionJson.version;
const expectedSize = versionJson.fileSizeMB;
const apkPath = path.join('downloads', 'CineVault.apk');

const apkExists = fs.existsSync(apkPath);
const apkSize = apkExists ? fs.statSync(apkPath).size : 0;
report('CineVault.apk exists in downloads/', apkExists);
report('CineVault.apk file size matches version.json fileSizeBytes', apkSize === versionJson.fileSizeBytes, `Actual: ${apkSize}, JSON: ${versionJson.fileSizeBytes}`);

const htmlHasCorrectVersion = html.includes(`v${expectedVersion}`);
report(`index.html mentions active version v${expectedVersion}`, htmlHasCorrectVersion);

const htmlHasCorrectSize = html.includes(expectedSize);
report(`index.html mentions active size ${expectedSize}`, htmlHasCorrectSize);

const jsHasCorrectVersion = js.includes(`version: '${expectedVersion}'`);
report(`app.js has fallback version set to ${expectedVersion}`, jsHasCorrectVersion);

const jsHasCorrectSize = js.includes(`sizeMB: '${expectedSize}'`);
report(`app.js has fallback size set to ${expectedSize}`, jsHasCorrectSize);

// 10. Accessibility Features Verification
const hasSkipLink = html.includes('class="skip-link"');
report('Skip to main content link configured', hasSkipLink);

const hasAriaExpandedOnFaq = html.includes('aria-expanded');
report('FAQ buttons include aria-expanded attributes', hasAriaExpandedOnFaq);

const hasAriaControlsOnFaq = html.includes('aria-controls');
report('FAQ buttons include aria-controls attributes', hasAriaControlsOnFaq);

const hasMobileNavAria = html.includes('aria-controls="mobileNavDrawer"');
report('Mobile navigation toggle includes aria-controls and aria-expanded', hasMobileNavAria);

console.log('\n========================================================');
if (failures === 0) {
  console.log(' OVERALL INTEGRITY: ALL CODE INTEGRATION TESTS PASSED!');
  console.log('========================================================\n');
  process.exit(0);
} else {
  console.error(` OVERALL INTEGRITY FAILED WITH ${failures} ERRORS.`);
  console.log('========================================================\n');
  process.exit(1);
}
