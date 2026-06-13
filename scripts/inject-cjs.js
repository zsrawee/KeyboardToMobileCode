/**
 * Inject CSS into dist/index.cjs.js (CommonJS bundle)
 */
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '..', 'src', 'styles.css'), 'utf-8');
const escapedCss = css.replace(/`/g, '\\`').replace(/\${/g, '\\${');

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

const cjsPath = path.join(__dirname, '..', 'dist', 'index.cjs.js');
if (fs.existsSync(cjsPath)) {
  const cjs = fs.readFileSync(cjsPath, 'utf-8');
  fs.writeFileSync(cjsPath, injectCode + '\n' + cjs);
  console.log('✅ CSS auto-injection prepended to dist/index.cjs.js');
} else {
  console.log('⚠️  dist/index.cjs.js not found');
}
