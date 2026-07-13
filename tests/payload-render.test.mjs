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
const mappingFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../docs/payload-frontend-mapping.md');

function contentValue(content, pathExpression) {
  return pathExpression.replace(/\[(\d+)\]/g, '.$1').split('.').reduce((value, key) => value?.[key], content);
}

function activeMappingIds() {
  const mapping = fs.readFileSync(mappingFile, 'utf8');
  const documentedIds = [...mapping.matchAll(/\|\s*#([a-z0-9-]+)\s*\|/g)].map((match) => match[1]);
  const excludedIds = new Set([...mapping.matchAll(/^- `([a-z0-9-]+)`:/gm)].map((match) => match[1]));

  return documentedIds.filter((id) => !excludedIds.has(id)).sort();
}

test('renderer bindings exactly match the active documented mapping contract', () => {
  const documentedIds = activeMappingIds();
  const rendererIds = legacyContentBindings.map((binding) => binding.id).sort();

  assert.deepEqual(rendererIds, documentedIds);
});

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
  assert.doesNotMatch(output, new RegExp(['data', 'cms'].join('-')));
});

test('renderLegacyContent leaves unmatched HTML unchanged', () => {
  const html = '<div><span>Keep me</span></div>';
  const output = renderLegacyContent(html, 'home', defaultPayloadContent);
  assert.equal(output, html);
});

test('renderLegacyContent escapes hostile editor text without creating executable nodes', () => {
  const html = '<main><h1 id="home-hero-main-heading">Safe heading</h1><script>window.legacy = true</script></main>';
  const content = structuredClone(defaultPayloadContent);
  content.homePage.hero.mainHeading = '<script>window.injected = true</script><img src=x onerror="alert(1)">';

  const output = renderLegacyContent(html, 'home', content);
  const root = parse(output);

  assert.equal(root.querySelectorAll('script').length, 1, 'only the existing legacy script remains');
  assert.equal(root.querySelectorAll('img').length, 0, 'hostile editor text cannot create an image node');
  assert.match(output, /&lt;script&gt;window\.injected = true&lt;\/script&gt;/);
  assert.match(output, /&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;/);
});

test('renderLegacyContent blocks unsafe href and image source overrides', () => {
  const html = '<a id="site-contact-waze-link" href="/safe-map">Map</a><img id="contact-form-image" src="/safe-image.png" alt="Safe">';
  const content = structuredClone(defaultPayloadContent);
  content.siteSettings.contactDetails.wazeUrl = 'javascript:alert(1)';
  content.contactUsPage.contactForm.image = { src: 'javascript:alert(2)', alt: 'Updated alt' };

  const root = parse(renderLegacyContent(html, 'contactUs', content));

  assert.equal(root.querySelector('#site-contact-waze-link').getAttribute('href'), '/safe-map');
  assert.equal(root.querySelector('#contact-form-image').getAttribute('src'), '/safe-image.png');
  assert.equal(root.querySelector('#contact-form-image').getAttribute('alt'), 'Updated alt');
});

test('renderLegacyContent maps all statistic values to their counter targets', () => {
  const html = [1, 2, 3, 4]
    .map((index) => `<span id="home-statistic-${index}-value" class="js-stat-counter" data-target="0" data-suffix="">0</span>`)
    .join('');
  const content = structuredClone(defaultPayloadContent);

  const root = parse(renderLegacyContent(html, 'home', content));

  assert.deepEqual(
    [1, 2, 3, 4].map((index) => {
      const counter = root.querySelector(`#home-statistic-${index}-value`);
      return [counter.getAttribute('data-target'), counter.getAttribute('data-suffix')];
    }),
    [['4', ''], ['2', ''], ['24', 'h'], ['100', '%']],
  );
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
      if (binding.kind === 'href') assert.equal(element.getAttribute('href'), String(value), `${binding.id} href`);
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
