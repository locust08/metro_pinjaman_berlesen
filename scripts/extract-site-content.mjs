import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const legacyDir = path.join(root, 'src', 'legacy-pages');
const outputPath = path.join(root, 'src', 'content', 'defaultSiteContent.js');

const pages = [
  ['home', 'index.html'],
  ['about', 'about_us.html'],
  ['loan', 'loan.html'],
  ['howToApply', 'how_to_apply.html'],
  ['contact', 'contact.html'],
];

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function compactText(value) {
  return decodeHtml(value).replace(/\s+/g, ' ').trim();
}

function stripIgnoredHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '');
}

function extractTextSlots(html, pageId) {
  const slots = [];
  const source = stripIgnoredHtml(html);
  const textPattern = />\s*([^<>{}][^<>]*?)\s*</g;
  let match;

  while ((match = textPattern.exec(source))) {
    const text = compactText(match[1]);
    if (!text || text === '&') continue;
    slots.push({
      key: `${pageId}.text.${slots.length}`,
      label: `${pageId} text ${slots.length + 1}`,
      text,
    });
  }

  return slots;
}

function readAttribute(tag, name) {
  const pattern = new RegExp(`${name}=["']([^"']*)["']`, 'i');
  return pattern.exec(tag)?.[1] || '';
}

function isEditableImage(src) {
  return Boolean(src) && !src.includes('/logos/') && !src.includes('/footer/') && !src.includes('/icons/') && !src.startsWith('icons/');
}

function extractImageSlots(html, pageId) {
  const slots = [];
  const imagePattern = /<img\b[^>]*>/gi;
  let match;

  while ((match = imagePattern.exec(html))) {
    const tag = match[0];
    const src = readAttribute(tag, 'src');
    if (!isEditableImage(src)) continue;

    slots.push({
      key: `${pageId}.image.${slots.length}`,
      label: `${pageId} image ${slots.length + 1}`,
      image: {
        src,
        alt: readAttribute(tag, 'alt'),
      },
    });
  }

  return slots;
}

const pageContent = {};

for (const [pageId, fileName] of pages) {
  const html = fs.readFileSync(path.join(legacyDir, fileName), 'utf8');
  pageContent[pageId] = {
    textSlots: extractTextSlots(html, pageId),
    imageSlots: extractImageSlots(html, pageId),
  };
}

const siteContent = {
  site: {
    navbar: {
      logoAlt: 'Metro Pinjaman Berlesen',
      items: [
        { label: 'About us', href: 'about_us.html' },
        { label: 'Loan', href: 'loan.html' },
        { label: 'How to apply', href: 'how_to_apply.html' },
        { label: 'Contact us', href: 'contact.html' },
      ],
      cta: { label: 'Apply now', href: 'loan.html' },
    },
    footer: {
      copyright: '© 2026 Flow. All rights reserved.',
      contact: {
        email: 'metropinjamanberlesan@gmail.com',
        phone: '+60 11-7007 3191',
        address: 'Jalan Metro 1, Metro Prima, 52100 Kuala Lumpur, Federal Territory of Kuala Lumpur',
      },
    },
  },
  pages: pageContent,
};

fs.writeFileSync(
  outputPath,
  `export const defaultSiteContent = ${JSON.stringify(siteContent, null, 2)};\n`,
);
