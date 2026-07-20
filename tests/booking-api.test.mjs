import assert from 'node:assert/strict';
import test from 'node:test';

import { onRequestPost } from '../functions/api/bookings.js';
import { onRequestGet } from '../functions/api/bookings/booked-slots.js';

const env = {
  NOTION_TOKEN: 'test-token',
  APPOINTMENT_NOTION_DATABASE_ID: 'fa9a71965f8d40ff92276ba56aa2d69f',
  RESEND_API_KEY: 'test-resend',
  RESEND_TO_EMAIL: 'admin@example.com',
  WHATSAPP_ACCESS_TOKEN: 'test-whatsapp',
  WHATSAPP_PHONE_NUMBER_ID: '12345',
};

const validPayload = {
  name: 'Metro QA',
  email: 'metro.qa@example.com',
  phone: '01100000099',
  loanType: 'Personal Loan',
  date: '2026-08-15',
  time: '09:00',
  message: 'Internal regression test.',
};

function notionPage(id = 'page-id') {
  return {
    id,
    url: `https://notion.so/${id}`,
    properties: {
      Booking: { title: [{ plain_text: 'Metro QA - 2026-08-15 09:00' }] },
      Status: { select: { name: 'Pending Confirmation' } },
      'Customer Name': { rich_text: [{ plain_text: 'Metro QA' }] },
      Phone: { phone_number: '01100000099' },
      Email: { email: 'metro.qa@example.com' },
      'Loan Type': { select: { name: 'Personal Loan' } },
      'Message / Enquiry': { rich_text: [{ plain_text: 'Internal regression test.' }] },
      'Slot Key': { rich_text: [{ plain_text: '2026-08-15|09:00' }] },
      'Cancel Token': { rich_text: [{ plain_text: 'test-token' }] },
      'Cancel URL': { url: '' },
      Source: { select: { name: 'Website' } },
    },
  };
}

test('booking API succeeds when post-booking notifications fail', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url, options = {}) => {
    calls.push(String(url));
    if (String(url).includes('/databases/') && String(url).endsWith('/query')) {
      return Response.json({ results: [] });
    }
    if (String(url).endsWith('/pages') && options.method === 'POST') {
      return Response.json(notionPage('created-page'));
    }
    if (String(url).includes('/pages/created-page') && options.method === 'PATCH') {
      return Response.json(notionPage('created-page'));
    }
    if (String(url).includes('api.resend.com') || String(url).includes('graph.facebook.com')) {
      throw new Error('notification transport unavailable');
    }
    throw new Error(`Unexpected fetch: ${url}`);
  };

  try {
    const response = await onRequestPost({
      env,
      request: new Request('https://metropinjamanberlesen.pages.dev/api/bookings', {
        method: 'POST',
        body: JSON.stringify(validPayload),
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.message, 'Booking submitted.');
    assert.equal(body.booking.id, 'created-page');
    assert.deepEqual(body.warnings, [
      'Your booking was saved, but an email notification could not be sent.',
      'Your booking was saved, but a WhatsApp notification could not be sent.',
    ]);
    assert.ok(calls.some((url) => url.includes('/pages')));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('booking API returns controlled 409 for an already booked slot', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ results: [{ id: 'existing' }] });

  try {
    const response = await onRequestPost({
      env,
      request: new Request('https://metropinjamanberlesen.pages.dev/api/bookings', {
        method: 'POST',
        body: JSON.stringify(validPayload),
      }),
    });

    assert.equal(response.status, 409);
    assert.match((await response.json()).message, /already been booked/i);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('booking API returns controlled 400 for invalid form data', async () => {
  const response = await onRequestPost({
    env,
    request: new Request('https://metropinjamanberlesen.pages.dev/api/bookings', {
      method: 'POST',
      body: JSON.stringify({ ...validPayload, email: 'invalid' }),
    }),
  });

  assert.equal(response.status, 400);
  assert.match((await response.json()).message, /valid email/i);
});

test('booking API returns a safe 500 response for a Notion failure', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response('{"object":"error","message":"private detail"}', { status: 400 });

  try {
    const response = await onRequestPost({
      env,
      request: new Request('https://metropinjamanberlesen.pages.dev/api/bookings', {
        method: 'POST',
        body: JSON.stringify(validPayload),
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 500);
    assert.doesNotMatch(JSON.stringify(body), /private detail|Notion/i);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('booked slots API returns controlled 500 when Notion lookup fails', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ message: 'bad database' }, { status: 404 });

  try {
    const response = await onRequestGet({
      env,
      request: new Request('https://metropinjamanberlesen.pages.dev/api/bookings/booked-slots?date=2026-07-24'),
    });
    const body = await response.json();

    assert.equal(response.status, 500);
    assert.equal(body.message, 'Booked times are temporarily unavailable. Please try again.');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
