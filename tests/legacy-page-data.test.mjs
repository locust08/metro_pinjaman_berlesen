import test from 'node:test';
import assert from 'node:assert/strict';

import { loadLegacyPage } from '../src/lib/legacyPageData.ts';

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('loadLegacyPage exposes Payload SEO title and description to Next Head props', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({
    homePage: {
      seo: {
        title: 'Payload SEO title',
        description: 'Payload SEO description',
      },
    },
  }));

  const page = await loadLegacyPage('index.html', 'home');

  assert.equal(page.title, 'Payload SEO title');
  assert.equal(page.description, 'Payload SEO description');
  assert.match(page.bodyHtml, /id="home-hero-main-heading"/);
});
