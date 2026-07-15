const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const legacyDir = path.join(rootDir, 'src', 'legacy-pages');
const outDir = path.join(rootDir, 'out');
const publicDir = path.join(rootDir, 'public');

const pages = [
  'index.html',
  'loan.html',
  'about_us.html',
  'contact.html',
  'how_to_apply.html',
];

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function readIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function extractTitle(html) {
  return /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.trim() || '';
}

function escapeHtmlText(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function assertContains(file, content, expected) {
  if (!content.includes(expected)) {
    throw new Error(`${file} is missing expected content: ${expected}`);
  }
}

function assertEqual(file, label, actual, expected) {
  if (actual !== expected) {
    throw new Error(`${file} ${label} mismatch: expected "${expected}", got "${actual}"`);
  }
}

function assertNotContains(file, content, unexpected) {
  if (content.includes(unexpected)) {
    throw new Error(`${file} contains unexpected content: ${unexpected}`);
  }
}

function assertRepresentativeExample(file, content) {
  assertContains(file, content, 'Representative example');
  assertContains(file, content, 'Amount borrowed');
  assertContains(file, content, 'RM5,000');
  assertContains(file, content, 'RM448');
  assertContains(file, content, 'RM5,448');
  assertContains(file, content, '180-day period');
  assertNotContains(file, content, 'RM313.36');
  assertNotContains(file, content, '313.36');
  assertNotContains(file, content, 'Estimated Monthly Payment');
}

for (const page of pages) {
  const legacy = read(path.join(legacyDir, page));
  const built = read(path.join(outDir, page));
  const title = extractTitle(legacy);

  assertEqual(page, 'title', extractTitle(built), escapeHtmlText(title));
  assertContains(page, built, '/css/tailwind/tailwind.min.css');
  assertContains(page, built, '/css/main.css');
  assertContains(page, built, 'global-88881.js');
  assertNotContains(page, built, 'LoanEase');
  assertNotContains(page, built, 'Page title');
  assertNotContains(page, built, 'href="#"');
  assertNotContains(page, built, '601170073191');
  assertNotContains(page, built, '+60 11-7007 3191');
  assertNotContains(page, built, 'Sherman Way Parking');
  assertNotContains(page, built, 'Reseda');
  assertNotContains(page, built, 'EV charging');
  assertNotContains(page, built, 'legacy website');
  assertNotContains(page, built, 'legacy Metro Pinjaman Berlesen website');
  assertNotContains(page, built, 'legacy application');
  assertNotContains(page, built, '18+');
  assertNotContains(page, built, '100%');
  assertNotContains(page, built, '10 minutes');
  assertNotContains(page, built, 'save thousands');
  assertNotContains(page, built, 'Review focus');
  assertNotContains(page, built, 'Personal income and repayment ability');
  assertNotContains(page, built, 'Business revenue, operations, and cash flow');

  assertNotContains(`src/legacy-pages/${page}`, legacy, 'RM313.36');
  assertNotContains(`src/legacy-pages/${page}`, legacy, '313.36');
  assertNotContains(`out/${page}`, built, 'RM313.36');
  assertNotContains(`out/${page}`, built, '313.36');
}

const howToApply = read(path.join(outDir, 'how_to_apply.html'));
assertContains('how_to_apply.html', howToApply, 'contactBookingForm()');
assertContains('how_to_apply.html', howToApply, 'Preferred Date');
assertContains('how_to_apply.html', howToApply, 'Prefer Call Back Time');
assertContains('how_to_apply.html', howToApply, 'Select location');
assertContains('how_to_apply.html', howToApply, 'Kuala Lumpur');
assertContains('how_to_apply.html', howToApply, '/api/bookings');
assertContains('how_to_apply.html', howToApply, 'Personal Loan');
assertContains('how_to_apply.html', howToApply, 'Business Loan');

const index = read(path.join(outDir, 'index.html'));
assertContains('index.html', index, 'Pay Off Your Debts');
assertContains('index.html', index, 'No ATM Card');
assertContains('index.html', index, 'Open To Malaysian only');
assertContains('index.html', index, 'No Guarantor');
assertContains('index.html', index, 'Open every day');

const loan = read(path.join(outDir, 'loan.html'));
const loanHtmlRoute = readIfExists(path.join(outDir, 'loan.html.html'));
const loanSource = read(path.join(legacyDir, 'loan.html'));
assertContains('loan.html', loan, 'Minimum monthly salary of RM3,000');
assertContains('loan.html', loan, 'Loan from RM500 to RM100,000');
assertContains('loan.html', loan, 'From 8% - 12% APR');
assertContains('loan.html', loan, 'Payment options from 6 months to 60 months');
assertRepresentativeExample('src/legacy-pages/loan.html', loanSource);
assertRepresentativeExample('out/loan.html', loan);
if (loanHtmlRoute) {
  assertRepresentativeExample('out/loan.html.html', loanHtmlRoute);
}

const loanScript = read(path.join(publicDir, 'js', '1286481.js'));
assertNotContains('public/js/1286481.js', loanScript, 'loan-estimator');
assertNotContains('public/js/1286481.js', loanScript, 'est-result');
assertNotContains('public/js/1286481.js', loanScript, 'Estimated Monthly Payment');
assertNotContains('public/js/1286481.js', loanScript, 'RM313.36');
assertNotContains('public/js/1286481.js', loanScript, '313.36');

const contact = read(path.join(outDir, 'contact.html'));
assertContains('contact.html', contact, '+60 10-215 0037');
assertContains('contact.html', contact, 'https://wa.me/60102150037');
assertContains('contact.html', contact, 'metropinjamanberlesan@gmail.com');
assertContains('contact.html', contact, 'Select location');

console.log(`Verified ${pages.length} legacy pages in Next export.`);
