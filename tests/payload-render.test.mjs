import test from 'node:test';
import assert from 'node:assert/strict';

import { renderLegacyContent } from '../src/payload/renderLegacyContent.ts';
import { defaultPayloadContent } from '../src/payload/content.ts';

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
