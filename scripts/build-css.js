/**
 * Writes the standalone stylesheet (dist/styles.css) from the STYLES constant
 * that the library injects at runtime. Keeps the `./styles` export in sync with
 * the styles applied by injectStyles() so consumers can opt into a static CSS
 * file (e.g. for SSR or to pre-load styling).
 */
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const bundlePath = path.join(distDir, 'querychips.js');

if (!fs.existsSync(bundlePath)) {
  console.error(`build-css: expected bundle not found at ${bundlePath}. Run the rollup build first.`);
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { STYLES } = require(bundlePath);

if (typeof STYLES !== 'string' || STYLES.length === 0) {
  console.error('build-css: STYLES export missing or empty.');
  process.exit(1);
}

const outPath = path.join(distDir, 'styles.css');
fs.writeFileSync(outPath, STYLES.trimStart());
console.log(`build-css: wrote ${outPath} (${STYLES.length} bytes)`);
