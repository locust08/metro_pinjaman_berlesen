const { copyFileSync, existsSync, rmSync } = require('node:fs');
const { join } = require('node:path');

const bundleDirectory = join(process.cwd(), '.pages-functions');
const source = join(bundleDirectory, 'index.js');
const destination = join(process.cwd(), 'out', '_worker.js');

if (!existsSync(source)) {
  throw new Error('Pages Functions compilation did not produce index.js.');
}

copyFileSync(source, destination);
rmSync(bundleDirectory, { recursive: true, force: true });
