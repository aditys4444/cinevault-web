const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// 1. Verify Explorer section has been removed completely
const forbiddenExplorerTerms = [
  'id="explorer"',
  'id="explorerSearchInput"',
  'id="explorerClearSearch"',
  'id="explorerGrid"',
  'href="#explorer"'
];

let explorerLeftovers = [];
for (const term of forbiddenExplorerTerms) {
  if (html.includes(term)) {
    explorerLeftovers.push(term);
  }
}

if (explorerLeftovers.length === 0) {
  console.log('EXPLORER REMOVAL AUDIT: 100% CLEAN (Zero leftover explorer IDs/links found in index.html)');
} else {
  console.error('EXPLORER REMOVAL FAILED: Still found:', explorerLeftovers);
  process.exit(1);
}

// 2. Verify all high-definition showcase screenshots are configured
const showcaseScreenshots = [
  'assets/loading_screenshot.webp',
  'assets/home_screenshot.webp',
  'assets/explore_search_screenshot.webp',
  'assets/security_scan_screenshot.webp',
  'assets/player_screenshot.webp',
  'assets/livetv_screenshot.webp'
];

let missingScreenshots = [];
for (const shot of showcaseScreenshots) {
  if (!html.includes(shot)) {
    missingScreenshots.push(shot);
  }
}

if (missingScreenshots.length === 0) {
  console.log('SHOWCASE SCREENSHOTS AUDIT: 100% PASSED (All 6 high-definition screenshots integrated into multi-device showcase)');
} else {
  console.error('SHOWCASE AUDIT FAILED: Missing screenshot references:', missingScreenshots);
  process.exit(1);
}

// 3. Required interactive IDs
const requiredIds = [
  'toastNotice', 'toastMessage', 'showcaseDevicesGrid', 'lightboxModal',
  'lightboxImg', 'closeLightboxBtn', 'downloadModal', 'closeDownloadModalBtn',
  'directDownloadAgainBtn', 'securityModal', 'openSecurityModalBtn',
  'closeSecurityModalBtn', 'securityModalDoneBtn', 'pane-phone',
  'pane-firestick', 'pane-tv', 'copyFirestickUrlBtn', 'firestickUrl',
  'stickyMobileBar', 'copyHashBtn', 'copyHashBtnText', 'apkHash'
];

let missing = [];
for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) {
    missing.push(id);
  }
}

if (missing.length === 0) {
  console.log('DOM ID AUDIT: 100% PASSED (All ' + requiredIds.length + ' required element IDs are present in index.html)');
} else {
  console.error('DOM ID AUDIT FAILED: Missing IDs:', missing);
  process.exit(1);
}

// 4. Required interactive classes
const requiredClasses = [
  'showcase-filter-pill', 'showcase-device-card', 'showcase-device-chassis',
  'showcase-screen-viewport', 'showcase-screen-img', 'trigger-download',
  'device-tab-btn', 'faq-item', 'review-card'
];

let missingClasses = [];
for (const cls of requiredClasses) {
  if (!html.includes(cls)) {
    missingClasses.push(cls);
  }
}

if (missingClasses.length === 0) {
  console.log('DOM CLASS AUDIT: 100% PASSED (All ' + requiredClasses.length + ' required interactive classes are present in index.html)');
} else {
  console.error('DOM CLASS AUDIT FAILED: Missing Classes:', missingClasses);
  process.exit(1);
}

// 5. Check CSS rules in styles.css
const css = fs.readFileSync('styles.css', 'utf8');
const requiredCssRules = [
  '.hero-specs-row', '.showcase-devices-grid', '.showcase-device-card',
  '.showcase-device-chassis', '.showcase-filter-pill',
  '.device-tabs-container', '.device-tab-btn', '.reviews-section',
  '.review-card', '.modal-overlay', '.chrome-reassurance-box', '.sticky-mobile-bar'
];

let missingCss = [];
for (const selector of requiredCssRules) {
  if (!css.includes(selector)) {
    missingCss.push(selector);
  }
}

if (missingCss.length === 0) {
  console.log('CSS AUDIT: 100% PASSED (All ' + requiredCssRules.length + ' component selectors are present in styles.css)');
} else {
  console.error('CSS AUDIT FAILED: Missing CSS rules:', missingCss);
  process.exit(1);
}

console.log('\n======================================================');
console.log('OVERALL INTEGRITY: ALL CODE INTEGRATION TESTS PASSED!');
console.log('======================================================\n');
