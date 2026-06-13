/**
 * Post-build script: injects the CSS into the JS bundle so it loads
 * automatically when the library is imported.
 *
 * Reads src/styles.css, wraps it in DOM injection code,
 * and prepends it to dist/index.esm.js.
 */
const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '..', 'src', 'styles.css');
const jsPath = path.resolve(__dirname, '..', 'dist', 'index.esm.js');

const css = fs.readFileSync(cssPath, 'utf-8');

// Escape backticks and ${} for template literal
const escapedCss = css.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

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

const js = fs.readFileSync(jsPath, 'utf-8');
fs.writeFileSync(jsPath, injectCode + '\n' + js);

console.log('✅ CSS auto-injection prepended to dist/index.esm.js');
