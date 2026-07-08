const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(path.join(outDir, 'index.html'))) {
  throw new Error('Next static export did not create out/index.html');
}

fs.cpSync(outDir, publicDir, { recursive: true, force: true });
