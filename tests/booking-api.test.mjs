import assert from 'node:assert/strict';
import test from 'node:test';

import { onRequestPost } from '../functions/api/bookings.js';

const payload = {
  name: 'Internal Regression Test',
  email: 'internal-regression@example.invalid',
  phone: '0100000000',
  loanType: 'Personal Loan',
  date: '2026-08-31',
  time: '09:00',
  message: 'Automated internal test',
};

function request(body = payload) {
  return new Request('https://example.test/api/bookings', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

test('returns 201 with a safe warning when Resend fails after Notion creation', async (t) => {
  let notionCalls = 0;
  t.mock.method(globalThis, 'fetch', async (url) => {
    const href = String(url);
    if (href.includes('/databases/') && href.endsWith('/query')) {
      return Response.json({ results: [] });
    }
    if (href.endsWith('/pages')) {
      notionCalls += 1;
      return Response.json({ id: 'fake-page-id', url: 'https://notion.test/fake', properties: {} });
    }
    if (href.includes('/pages/fake-page-id')) return Response.json({});
    if (href.includes('api.resend.com')) throw new Error('simulated network failure');
    throw new Error(`Unexpected request: ${href}`);
  });

  const response = await onRequestPost({
    request: request(),
    env: { NOTION_TOKEN: 'fake-token', NOTION_DATABASE_ID: 'a'.repeat(32), RESEND_API_KEY: 'fake-key' },
  });
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(notionCalls, 1);
  assert.match(body.warnings.join(' '), /email notification could not be sent/i);
  assert.doesNotMatch(JSON.stringify(body), /simulated network failure/i);
});

test('returns controlled 409 for an already booked slot', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ results: [{ id: 'existing' }] }));
  const response = await onRequestPost({
    request: request(),
    env: { NOTION_TOKEN: 'fake-token', NOTION_DATABASE_ID: 'a'.repeat(32) },
  });
  assert.equal(response.status, 409);
  assert.match((await response.json()).message, /already been booked/i);
});

test('returns controlled 400 for invalid form data', async () => {
  const response = await onRequestPost({ request: request({ ...payload, email: 'invalid' }), env: {} });
  assert.equal(response.status, 400);
  assert.match((await response.json()).message, /valid email/i);
});

test('returns a safe 500 response for a Notion failure', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('{"object":"error","message":"private detail"}', { status: 400 }));
  const response = await onRequestPost({
    request: request(),
    env: { NOTION_TOKEN: 'fake-token', NOTION_DATABASE_ID: 'a'.repeat(32) },
  });
  const body = await response.json();
  assert.equal(response.status, 500);
  assert.doesNotMatch(JSON.stringify(body), /private detail|Notion/i);
});
