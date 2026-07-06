const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 3001);
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

const NOTION_TOKEN = process.env.NOTION_TOKEN || '';
const NOTION_DATABASE_ID = process.env.APPOINTMENT_NOTION_DATABASE_ID || process.env.NOTION_DATABASE_ID || 'fa9a71965f8d40ff92276ba56aa2d69f';
const NOTION_VERSION = '2022-06-28';

const activeStatuses = new Set(['Pending Confirmation', 'Confirmed - Booked']);
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(BOOKINGS_FILE)) fs.writeFileSync(BOOKINGS_FILE, '[]\n');
}

function readBookings() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8'));
}

function writeBookings(bookings) {
  ensureDataFile();
  fs.writeFileSync(BOOKINGS_FILE, `${JSON.stringify(bookings, null, 2)}\n`);
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Request body is too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function slotKey(date, time) {
  return `${date}|${time}`;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function slotStart(date, time) {
  return new Date(`${date}T${time}:00+08:00`);
}

function notionDateTime(date, time) {
  return `${date}T${time}:00`;
}

function notionEndDateTime(date, time) {
  const end = addMinutes(slotStart(date, time), 30);
  const year = end.getFullYear();
  const month = String(end.getMonth() + 1).padStart(2, '0');
  const day = String(end.getDate()).padStart(2, '0');
  const hours = String(end.getHours()).padStart(2, '0');
  const minutes = String(end.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
}

function validateBooking(payload) {
  if (!payload.name || !String(payload.name).trim()) return 'Please enter your full name.';
  if (!payload.email && !payload.phone) return 'Please enter either email or contact number.';
  if (!payload.loanType) return 'Please select a loan type.';
  if (!payload.date || !payload.time) return 'Please select your preferred date and time.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.date)) return 'Please select a valid date.';
  if (!/^\d{2}:\d{2}$/.test(payload.time)) return 'Please select a valid time.';
  return '';
}

async function notionRequest(pathname, options = {}) {
  if (!NOTION_TOKEN) return null;

  const response = await fetch(`https://api.notion.com/v1${pathname}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Notion API error ${response.status}: ${text}`);
  }

  return response.json();
}

async function findActiveNotionBooking(key) {
  if (!NOTION_TOKEN) return null;

  const result = await notionRequest(`/databases/${NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: {
        and: [
          { property: 'Slot Key', rich_text: { equals: key } },
          {
            or: [
              { property: 'Status', select: { equals: 'Pending Confirmation' } },
              { property: 'Status', select: { equals: 'Confirmed - Booked' } },
            ],
          },
        ],
      },
      page_size: 1,
    }),
  });

  return result.results && result.results[0] ? result.results[0] : null;
}

async function findActiveNotionBookingsForDate(date) {
  if (!NOTION_TOKEN) return [];

  const nextDay = new Date(`${date}T00:00:00+08:00`);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDate = `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`;

  const result = await notionRequest(`/databases/${NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: {
        and: [
          { property: 'Preferred Slot', date: { on_or_after: date } },
          { property: 'Preferred Slot', date: { before: nextDate } },
          {
            or: [
              { property: 'Status', select: { equals: 'Pending Confirmation' } },
              { property: 'Status', select: { equals: 'Confirmed - Booked' } },
            ],
          },
        ],
      },
      page_size: 100,
    }),
  });

  return result.results || [];
}

async function updateNotionBookingStatus(pageId, status) {
  if (!NOTION_TOKEN || !pageId) return null;

  return notionRequest(`/pages/${pageId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      properties: {
        Status: { select: { name: status } },
      },
    }),
  });
}

async function createNotionBooking(payload, key) {
  if (!NOTION_TOKEN) return null;

  const title = `${payload.name} - ${payload.date} ${payload.time}`;

  return notionRequest('/pages', {
    method: 'POST',
    body: JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        Booking: { title: [{ text: { content: title } }] },
        Status: { select: { name: 'Pending Confirmation' } },
        'Preferred Slot': {
          date: {
            start: notionDateTime(payload.date, payload.time),
            end: notionEndDateTime(payload.date, payload.time),
            time_zone: 'Asia/Kuala_Lumpur',
          },
        },
        'Customer Name': { rich_text: [{ text: { content: payload.name || '' } }] },
        Phone: payload.phone ? { phone_number: payload.phone } : { phone_number: null },
        Email: payload.email ? { email: payload.email } : { email: null },
        'Loan Type': { select: { name: payload.loanType } },
        'Message / Enquiry': { rich_text: [{ text: { content: payload.message || '' } }] },
        'Slot Key': { rich_text: [{ text: { content: key } }] },
        Source: { select: { name: 'Website' } },
      },
    }),
  });
}

async function handleBookedSlots(req, res, url) {
  const date = url.searchParams.get('date');
  if (!date) return sendJson(res, 400, { message: 'Date is required.' });

  const localBookedTimes = readBookings()
    .filter((booking) => {
      if (booking.date !== date || !activeStatuses.has(booking.status)) return false;
      return !NOTION_TOKEN || !booking.notionSynced;
    })
    .map((booking) => booking.time);

  const notionBookings = await findActiveNotionBookingsForDate(date);
  const notionBookedTimes = notionBookings
    .map((booking) => booking.properties && booking.properties['Slot Key'] && booking.properties['Slot Key'].rich_text)
    .filter(Boolean)
    .map((richText) => richText.map((part) => part.plain_text).join(''))
    .filter((key) => key.startsWith(`${date}|`))
    .map((key) => key.split('|')[1]);

  sendJson(res, 200, { bookedTimes: [...new Set([...localBookedTimes, ...notionBookedTimes])].sort() });
}

async function handleCreateBooking(req, res) {
  const payload = await readJsonBody(req);
  const validationError = validateBooking(payload);
  if (validationError) return sendJson(res, 400, { message: validationError });

  const key = slotKey(payload.date, payload.time);
  const bookings = readBookings();
  const duplicate = bookings.find((booking) => {
    if (booking.slotKey !== key || !activeStatuses.has(booking.status)) return false;
    return !NOTION_TOKEN || !booking.notionSynced;
  });
  if (duplicate) {
    return sendJson(res, 409, { message: 'This time slot has already been booked. Please choose another time.' });
  }

  const notionDuplicate = await findActiveNotionBooking(key);
  if (notionDuplicate) {
    return sendJson(res, 409, { message: 'This time slot has already been booked. Please choose another time.' });
  }

  const booking = {
    id: `local-${Date.now()}`,
    slotKey: key,
    status: 'Pending Confirmation',
    source: 'Website',
    submittedAt: new Date().toISOString(),
    name: String(payload.name || '').trim(),
    email: String(payload.email || '').trim(),
    phone: String(payload.phone || '').trim(),
    loanType: payload.loanType,
    date: payload.date,
    time: payload.time,
    message: String(payload.message || '').trim(),
    notionSynced: false,
  };

  const notionPage = await createNotionBooking(payload, key);
  if (notionPage) {
    booking.notionSynced = true;
    booking.notionPageId = notionPage.id;
    booking.notionUrl = notionPage.url;
  }

  bookings.push(booking);
  writeBookings(bookings);
  sendJson(res, 201, { message: 'Booking submitted.', booking });
}

async function handleResetBookings(res) {
  const bookings = readBookings();
  const notionPageIds = bookings
    .filter((booking) => booking.notionPageId)
    .map((booking) => booking.notionPageId);

  await Promise.all(notionPageIds.map((pageId) => (
    updateNotionBookingStatus(pageId, 'Cancelled').catch(() => null)
  )));
  writeBookings([]);
  sendJson(res, 200, { message: 'Test bookings reset.' });
}

function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';

  const filePath = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream' });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (req.method === 'GET' && url.pathname === '/api/bookings/booked-slots') {
      await handleBookedSlots(req, res, url);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/bookings') {
      await handleCreateBooking(req, res);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/test/reset-bookings') {
      await handleResetBookings(res);
      return;
    }

    serveStatic(req, res, url);
  } catch (error) {
    sendJson(res, 500, { message: error.message || 'Server error.' });
  }
});

server.listen(PORT, () => {
  console.log(`Booking test server running at http://localhost:${PORT}`);
  if (!NOTION_TOKEN) {
    console.log('NOTION_TOKEN is not set. Bookings will be blocked locally for testing only.');
  }
});
