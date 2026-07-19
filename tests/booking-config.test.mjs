import assert from 'node:assert/strict';
import test from 'node:test';

import { getConfig } from '../functions/_lib/booking.js';

test('normalizes Notion database IDs from full Notion URLs', () => {
  const config = getConfig({
    NOTION_TOKEN: 'test-token',
    APPOINTMENT_NOTION_DATABASE_ID: 'https://www.notion.so/workspace/Appointment-Bookings-fa9a71965f8d40ff92276ba56aa2d69f?v=abcdef',
  });

  assert.equal(config.notionDatabaseId, 'fa9a71965f8d40ff92276ba56aa2d69f');
});

test('normalizes Notion database IDs from collection URLs and hyphenated IDs', () => {
  const config = getConfig({
    NOTION_TOKEN: 'test-token',
    APPOINTMENT_NOTION_DATABASE_ID: 'collection://fa9a7196-5f8d-40ff-9227-6ba56aa2d69f',
    VISITOR_EVENTS_NOTION_DATABASE_ID: 'collection://3984fcc4-f701-80ec-8e27-f466ebc06223',
  });

  assert.equal(config.notionDatabaseId, 'fa9a71965f8d40ff92276ba56aa2d69f');
  assert.equal(config.visitorEventsDatabaseId, '3984fcc4f70180ec8e27f466ebc06223');
});
