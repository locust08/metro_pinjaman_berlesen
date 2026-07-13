import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

import { legacyContentBindings, renderLegacyContent } from '../src/payload/renderLegacyContent.ts';
import { defaultPayloadContent } from '../src/payload/content.ts';

const legacyPages = {
  home: 'index.html',
  aboutUs: 'about_us.html',
  loan: 'loan.html',
  howToApply: 'how_to_apply.html',
  contactUs: 'contact.html',
};
const legacyDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/legacy-pages');

function contentValue(content, pathExpression) {
  return pathExpression.replace(/\[(\d+)\]/g, '.$1').split('.').reduce((value, key) => value?.[key], content);
}

test('renderLegacyContent updates stable id fields without class regexes', () => {
  const html = '<h1 id="home-hero-main-heading" class="keep">Simple Loans,</h1><p id="home-hero-description" class="anything">Old description</p>';
  const content = structuredClone(defaultPayloadContent);
  content.homePage.hero = {
    mainHeading: 'Fast loans, clear terms',
    description: 'Updated description',
  };

  const output = renderLegacyContent(html, 'home', content);

  assert.match(output, /id="home-hero-main-heading" class="keep">Fast loans, clear terms<\/h1>/);
  assert.match(output, /id="home-hero-description" class="anything">Updated description<\/p>/);
  assert.doesNotMatch(output, /data-cms/);
});

test('renderLegacyContent leaves unmatched HTML unchanged', () => {
  const html = '<div><span>Keep me</span></div>';
  const output = renderLegacyContent(html, 'home', defaultPayloadContent);
  assert.equal(output, html);
});

test('every renderer binding resolves exactly once in its real legacy template', () => {
  for (const [pageId, filename] of Object.entries(legacyPages)) {
    const root = parse(fs.readFileSync(path.join(legacyDirectory, filename), 'utf8'));
    for (const binding of legacyContentBindings.filter((candidate) => candidate.pages.includes(filename))) {
      assert.equal(root.querySelectorAll(`#${binding.id}`).length, 1, `${filename}: ${binding.id}`);
    }
  }
});

test('real templates render metadata, shared responsive labels, images, and links to their intended elements', () => {
  const content = structuredClone(defaultPayloadContent);
  content.siteSettings.header.aboutUsMenuLabel = 'About Metro';
  content.homePage.seo.title = 'Home title';
  content.contactUsPage.seo.title = 'Contact title';

  for (const [pageId, filename] of Object.entries(legacyPages)) {
    const html = fs.readFileSync(path.join(legacyDirectory, filename), 'utf8');
    const root = parse(renderLegacyContent(html, pageId, content));
    for (const binding of legacyContentBindings.filter((candidate) => candidate.pages.includes(filename))) {
      const element = root.querySelector(`#${binding.id}`);
      const value = contentValue(content, binding.path);
      assert.ok(element, `${filename}: ${binding.id} is rendered`);
      if (binding.kind === 'image') assert.equal(element.getAttribute('src'), value.src, `${binding.id} image source`);
      if (binding.kind === 'href') assert.ok(element.getAttribute('href'), `${binding.id} href`);
      if (binding.kind === 'text' && typeof value === 'string') assert.equal(element.text.trim(), value, `${binding.id} text`);
    }
  }

  const contact = parse(renderLegacyContent(fs.readFileSync(path.join(legacyDirectory, 'contact.html'), 'utf8'), 'contactUs', content));
  assert.equal(contact.querySelector('#contact-form-heading').tagName, 'H1');
  assert.equal(contact.querySelector('#site-footer-link-contact-us').tagName, 'A');
  assert.equal(contact.querySelector('#contact-method-email-heading').tagName, 'SPAN');
  assert.equal(contact.querySelector('#site-contact-waze-link').tagName, 'A');
  assert.equal(contact.querySelector('#site-contact-google-maps-link').tagName, 'A');
});
