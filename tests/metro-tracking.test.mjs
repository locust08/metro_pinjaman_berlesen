import test from 'node:test';
import assert from 'node:assert/strict';

import fs from 'node:fs';
import vm from 'node:vm';

function createElement({
  tagName = 'FORM',
  attrs = {},
  textContent = '',
  matches = () => false,
  querySelector = () => null,
  closest = () => null,
} = {}) {
  return {
    tagName,
    attributes: Object.entries(attrs).map(([name, value]) => ({ name, value })),
    textContent,
    getAttribute(name) {
      return attrs[name] || '';
    },
    matches,
    querySelector,
    closest,
  };
}

function loadAnalytics() {
  const listeners = {};
  const beacons = [];
  const document = {
    title: 'Metro',
    referrer: '',
    readyState: 'complete',
    head: { appendChild() {} },
    documentElement: { clientWidth: 1440 },
    querySelector() {
      return null;
    },
    createElement(tagName) {
      return createElement({ tagName: tagName.toUpperCase() });
    },
    addEventListener(type, handler) {
      listeners[type] = listeners[type] || [];
      listeners[type].push(handler);
    },
  };
  const context = {
    Blob,
    Date,
    Intl,
    Math,
    URLSearchParams,
    WeakMap,
    window: {
      location: {
        pathname: '/contact.html',
        href: 'https://metropinjamanberlesen.pages.dev/contact.html',
        search: '',
      },
      innerWidth: 1440,
      localStorage: new Map(),
      sessionStorage: new Map(),
      crypto: { randomUUID: () => '11111111-1111-4111-8111-111111111111' },
      dataLayer: [],
    },
    document,
    navigator: {
      userAgent: 'Node Test',
      sendBeacon(url, blob) {
        beacons.push({ url, blob });
        return true;
      },
    },
  };
  context.window.window = context.window;
  context.window.document = document;
  context.window.navigator = context.navigator;
  context.window.localStorage.getItem = context.window.localStorage.get.bind(context.window.localStorage);
  context.window.localStorage.setItem = context.window.localStorage.set.bind(context.window.localStorage);
  context.window.sessionStorage.getItem = context.window.sessionStorage.get.bind(context.window.sessionStorage);
  context.window.sessionStorage.setItem = context.window.sessionStorage.set.bind(context.window.sessionStorage);

  vm.createContext(context);
  vm.runInContext(fs.readFileSync('public/js/global-88881.js', 'utf8'), context);

  return { context, listeners, beacons };
}

async function readBeaconPayload(beacon) {
  return JSON.parse(await beacon.blob.text());
}

test('successful booking can be tracked with booking id context', async () => {
  const { context, beacons } = loadAnalytics();

  context.window.metroTrack('booking_created', {
    booking_id: '3974fcc4-f701-811e-a894-eb6085e289f6',
    booking_status: 'Pending Confirmation',
    preferred_slot: '2026-07-10|16:00',
    loan_type: 'Business Loan',
  });

  const payload = await readBeaconPayload(beacons.at(-1));
  assert.equal(payload.event, 'booking_created');
  assert.equal(payload.booking_id, '3974fcc4-f701-811e-a894-eb6085e289f6');
  assert.equal(payload.booking_status, 'Pending Confirmation');
  assert.equal(payload.preferred_slot, '2026-07-10|16:00');
  assert.equal(payload.loan_type, 'Business Loan');
});

test('booking form focus sends form_start instead of legacy lead_form_start', async () => {
  const { listeners, beacons } = loadAnalytics();
  const form = createElement({
    matches: (selector) => selector === 'form',
    querySelector(selector) {
      return selector === "input[type='date'], select" ? createElement() : null;
    },
  });
  const input = createElement({ closest: () => form });

  listeners.focusin[0]({ target: input });

  const payload = await readBeaconPayload(beacons.at(-1));
  assert.equal(payload.event, 'form_start');
  assert.equal(payload.form_id, 'contact_booking');
});
