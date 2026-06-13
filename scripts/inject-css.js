/**
 * Post-build script: makes CSS work in all entry points.
 *
 * 1. Copies src/styles.css → dist/styles.css (for bundlers that handle CSS)
 * 2. Replaces import './styles.css' in dist/keyboard.js with auto-injection
 * 3. Prepends auto-injection to dist/index.esm.js (already done for ESM bundle)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const cssSrc = path.join(ROOT, 'src', 'styles.css');
const cssDst = path.join(ROOT, 'dist', 'styles.css');
const keyboardJs = path.join(ROOT, 'dist', 'keyboard.js');
const esmJs = path.join(ROOT, 'dist', 'index.esm.js');

const css = fs.readFileSync(cssSrc, 'utf-8');

// Escape backticks and ${} for template literal
const escapedCss = css.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

// The CSS injection code (used in multiple places)
const injectCode = `
/* ---- auto-injected keyboard styles ---- */
(function(){
  if (typeof document === 'undefined') return;
  var id = '__ckb_styles';
  if (document.getElementById(id)) return;
  var s = document.createElement('style');
  s.id = id;
  s.textContent = \`${escapedCss}\`;
  document.head.appendChild(s);
})();
`;

// ---- 1. Copy CSS to dist/ so import './styles.css' resolves ----
fs.copyFileSync(cssSrc, cssDst);
console.log('✅ Copied src/styles.css → dist/styles.css');

// ---- 2. Replace import in dist/keyboard.js with auto-injection ----
if (fs.existsSync(keyboardJs)) {
  let kbJs = fs.readFileSync(keyboardJs, 'utf-8');
  // Replace the static CSS import with runtime injection
  if (kbJs.includes("import './styles.css';")) {
    kbJs = kbJs.replace("import './styles.css';", injectCode);
    fs.writeFileSync(keyboardJs, kbJs);
    console.log('✅ Replaced import in dist/keyboard.js with auto-injection');
  } else {
    console.log('⚠️  dist/keyboard.js: import statement not found');
  }
} else {
  console.log('⚠️  dist/keyboard.js not found, skipping');
}

// ---- 3. Prepend auto-injection to dist/index.esm.js ----
if (fs.existsSync(esmJs)) {
  let esm = fs.readFileSync(esmJs, 'utf-8');
  // Check if already injected
  if (!esm.includes('__ckb_styles')) {
    esm = injectCode + '\n' + esm;
    fs.writeFileSync(esmJs, esm);
    console.log('✅ Prepended auto-injection to dist/index.esm.js');
  } else {
    console.log('✅ dist/index.esm.js already has auto-injection');
  }
} else {
  console.log('⚠️  dist/index.esm.js not found, skipping');
}

console.log('🎉 CSS injection complete');
