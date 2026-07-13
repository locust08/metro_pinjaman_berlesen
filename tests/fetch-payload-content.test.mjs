import test from 'node:test';
import assert from 'node:assert/strict';

import { defaultPayloadContent } from '../src/payload/content.ts';
import { fetchPayloadContent } from '../src/payload/fetchPayloadContent.ts';

const originalFetch = globalThis.fetch;
const originalContentUrl = process.env.PAYLOAD_PUBLIC_CONTENT_URL;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalContentUrl === undefined) delete process.env.PAYLOAD_PUBLIC_CONTENT_URL;
  else process.env.PAYLOAD_PUBLIC_CONTENT_URL = originalContentUrl;
});

test('fetchPayloadContent fetches published content and merges nullish values with defaults', async () => {
  process.env.PAYLOAD_PUBLIC_CONTENT_URL = 'https://cms.example.test/api/published-content';
  globalThis.fetch = async (url, options) => {
    assert.equal(url, process.env.PAYLOAD_PUBLIC_CONTENT_URL);
    assert.deepEqual(options, { headers: { accept: 'application/json' } });
    return new Response(JSON.stringify({
      siteSettings: {
        header: {
          aboutUsMenuLabel: '',
          loanMenuLabel: 'Loans from Payload',
        },
      },
    }));
  };

  const content = await fetchPayloadContent();

  assert.equal(content.siteSettings.header.aboutUsMenuLabel, '');
  assert.equal(content.siteSettings.header.loanMenuLabel, 'Loans from Payload');
  assert.equal(content.siteSettings.header.contactUsMenuLabel, defaultPayloadContent.siteSettings.header.contactUsMenuLabel);
});

test('fetchPayloadContent returns defaults when the published endpoint fails', async () => {
  globalThis.fetch = async () => {
    throw new Error('offline');
  };

  const content = await fetchPayloadContent();

  assert.deepEqual(content, defaultPayloadContent);
});
