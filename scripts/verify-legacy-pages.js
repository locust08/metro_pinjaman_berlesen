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
  assertNotContains(page, built, 'Newsletter');
  assertNotContains(page, built, 'WHATSAPP US');
  assertNotContains(page, built, 'WhatsApp us');
  assertNotContains(page, built, 'Talk to an advisor');
  assertNotContains(page, built, 'Check Your Rate');
  assertNotContains(page, built, 'Open To Malaysian only');
  assertNotContains(page, built, 'RM3000');
  assertNotContains(page, built, 'Prefer Call Back Time');

  assertNotContains(`src/legacy-pages/${page}`, legacy, 'RM313.36');
  assertNotContains(`src/legacy-pages/${page}`, legacy, '313.36');
  assertNotContains(`out/${page}`, built, 'RM313.36');
  assertNotContains(`out/${page}`, built, '313.36');
}

const howToApply = read(path.join(outDir, 'how_to_apply.html'));
assertContains('how_to_apply.html', howToApply, 'contactBookingForm()');
assertContains('how_to_apply.html', howToApply, 'Preferred Date');
assertContains('how_to_apply.html', howToApply, 'Preferred callback time');
assertContains('how_to_apply.html', howToApply, 'Prepare these documents before submitting your loan enquiry.');
assertContains('how_to_apply.html', howToApply, 'our team will review your application and contact you about the next step.');
assertNotContains('how_to_apply.html', howToApply, 'our team will process your application as quickly as possible.');
assertContains('how_to_apply.html', howToApply, 'RM3,000');
assertContains('how_to_apply.html', howToApply, 'Select location');
assertContains('how_to_apply.html', howToApply, 'Kuala Lumpur');
assertContains('how_to_apply.html', howToApply, '/api/bookings');
assertContains('how_to_apply.html', howToApply, 'Personal Loan');
assertContains('how_to_apply.html', howToApply, 'Business Loan');

const index = read(path.join(outDir, 'index.html'));
assertContains('index.html', index, 'Pay Off Your Debts');
assertContains('index.html', index, 'No ATM Card');
assertContains('index.html', index, 'Open to all Malaysians');
assertContains('index.html', index, 'No Guarantor');
assertContains('index.html', index, 'Open every day');
assertContains('index.html', index, '6–60 month repayment options');
assertContains('index.html', index, 'href="loan.html#interest-rate">Apply Now</a>');
assertContains('index.html', index, 'href="loan.html">View Loan Details</a>');
assertNotContains('index.html', index, 'href="loan.html#interest-rate">View Loan Details</a>');

const loan = read(path.join(outDir, 'loan.html'));
const loanHtmlRoute = readIfExists(path.join(outDir, 'loan.html.html'));
const loanSource = read(path.join(legacyDir, 'loan.html'));
assertContains('loan.html', loan, 'Minimum monthly salary of RM3,000');
assertContains('loan.html', loan, 'Loan from RM500 to RM100,000');
assertContains('loan.html', loan, 'From 8% - 12% APR');
assertContains('loan.html', loan, 'Payment options from 6 months to 60 months');
assertContains('loan.html', loan, 'Explore business loan support for working capital, stock purchases, overheads and other business activities.');
assertContains('loan.html', loan, 'Business funding information');
assertContains('loan.html', loan, 'View required documents');
assertContains('loan.html', loan, 'Personal Loan Documents');
assertContains('loan.html', loan, 'Business Loan Documents');
assertNotContains('loan.html', loan, 'flexible loan tenures and high financing margins');
assertNotContains('loan.html', loan, 'Flexible business funding');
assertNotContains('loan.html', loan, 'View the required documents below.');
assertNotContains('loan.html', loan, 'Latest 3 months payslip and bank statement');
assertNotContains('loan.html', loan, 'NRIC copy and name card');
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
assertContains('contact.html', contact, 'Metro Pinjaman Berlesen provides information and enquiry support for personal and business loans.');
assertNotContains('contact.html', contact, 'Metro Pinjaman Berlesen offers personal loans and business loans with flexible repayment options.');

const about = read(path.join(outDir, 'about_us.html'));
assertContains('about_us.html', about, 'Clear loan information and application guidance for individuals and businesses across Malaysia.');
assertContains('about_us.html', about, 'Metro Pinjaman Berlesen provides enquiry support for personal and business loans.');
assertContains('about_us.html', about, 'Open to all Malaysians');
assertContains('about_us.html', about, 'No ATM card required');
assertContains('about_us.html', about, 'No guarantor required');
assertContains('about_us.html', about, 'Available 24 hours, 7 days a week');
assertContains('about_us.html', about, 'We support individuals, small-business owners and companies looking for personal or business loan information.');
assertContains('about_us.html', about, 'Companies and corporate groups');
assertContains('about_us.html', about, 'Need help with your loan enquiry?');
assertContains('about_us.html', about, '6–60 month repayment options');
assertNotContains('about_us.html', about, 'Personalized service');
assertNotContains('about_us.html', about, '6 to 60 month payment options');
assertNotContains('about_us.html', about, 'Trust &amp; security');
assertNotContains('about_us.html', about, 'Processing and disbursement time');
assertNotContains('about_us.html', about, 'Ready to get started?');
assertNotContains('about_us.html', about, 'get a decision in minutes');

console.log(`Verified ${pages.length} legacy pages in Next export.`);
