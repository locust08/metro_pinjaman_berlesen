const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 3001);
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

const NOTION_TOKEN = process.env.NOTION_TOKEN || '';
const NOTION_DATABASE_ID = process.env.APPOINTMENT_NOTION_DATABASE_ID || process.env.NOTION_DATABASE_ID || 'fa9a71965f8d40ff92276ba56aa2d69f';
const NOTION_VERSION = '2022-06-28';
const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_APPOINTMENT_DURATION_MINUTES = 30;
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL_DEV || process.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM_EMAIL_PROD || 'Metro Pinjaman Berlesen <no-reply@locus-t.com.my>';
const RESEND_ADMIN_EMAILS = process.env.RESEND_CONFIRMATION_TO_EMAIL_DEV || process.env.RESEND_TO_EMAIL_DEV || process.env.RESEND_TO_EMAILS || process.env.RESEND_TO_EMAIL || process.env.RESEND_TO_EMAIL_PROD || '';
const BOOKING_BASE_URL = process.env.BOOKING_BASE_URL || `http://localhost:${PORT}`;
const OFFICE_ADDRESS = 'Jalan Metro 1, Metro Prima, 52100 Kuala Lumpur, Federal Territory of Kuala Lumpur';
const OFFICE_PHONE = '+60 11-7007 3191';
const OFFICE_EMAIL = 'metropinjamanberlesan@gmail.com';
const WHATSAPP_MESSAGE = 'Hi Metro Pinjaman Berlesen, I would like to enquire about a loan appointment.';
const WHATSAPP_URL = `https://wa.me/601170073191?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/place/Jalan+Metro+1,+Metro+Prima,+52100+Kuala+Lumpur,+Wilayah+Persekutuan+Kuala+Lumpur/data=!4m2!3m1!1s0x31cc46401fe7d16b:0xcbf18c7859da390b';

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

function sendHtml(res, statusCode, html) {
  res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
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

function cleanValue(value) {
  return String(value || '').trim();
}

function escapeHtml(value) {
  return cleanValue(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue(email));
}

function parseRecipientEmails(value) {
  return cleanValue(value)
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);
}

function slotStart(date, time) {
  return new Date(`${date}T${time}:00+08:00`);
}

function notionDateTime(date, time) {
  const parsed = addMinutesToWallClock(date, time, 0);
  return `${parsed.date}T${parsed.time}:00`;
}

function notionEndDateTime(date, time) {
  const end = addMinutesToWallClock(date, time, DEFAULT_APPOINTMENT_DURATION_MINUTES);
  return `${end.date}T${end.time}:00`;
}

function addMinutesToWallClock(date, time, minutesToAdd) {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(cleanValue(date));
  const timeMatch = /^(\d{1,2}):(\d{2})(?:\s*([AP]M))?$/i.exec(cleanValue(time));

  if (!dateMatch || !timeMatch) {
    throw new Error('Invalid appointment date or time.');
  }

  let hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const meridiem = timeMatch[3]?.toUpperCase();

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  if (hours > 23 || minutes > 59) throw new Error('Invalid appointment time.');

  const wallClock = new Date(Date.UTC(
    Number(dateMatch[1]),
    Number(dateMatch[2]) - 1,
    Number(dateMatch[3]),
    hours,
    minutes + minutesToAdd,
    0,
  ));
  const pad = (value) => String(value).padStart(2, '0');

  return {
    date: `${wallClock.getUTCFullYear()}-${pad(wallClock.getUTCMonth() + 1)}-${pad(wallClock.getUTCDate())}`,
    time: `${pad(wallClock.getUTCHours())}:${pad(wallClock.getUTCMinutes())}`,
  };
}

function validateBooking(payload) {
  if (!payload.name || !String(payload.name).trim()) return 'Please enter your full name.';
  if (!payload.email || !isValidEmail(payload.email)) return 'Please enter a valid email address.';
  if (!payload.phone || !String(payload.phone).trim()) return 'Please enter your contact number.';
  if (!payload.loanType) return 'Please select a loan type.';
  if (!payload.date || !payload.time) return 'Please select your preferred date and time.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.date)) return 'Please select a valid date.';
  if (!/^\d{2}:\d{2}$/.test(payload.time)) return 'Please select a valid time.';
  return '';
}

function formatAppointmentDate(booking) {
  const start = slotStart(booking.date, booking.time);
  return new Intl.DateTimeFormat('en-MY', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kuala_Lumpur',
  }).format(start);
}

function formatIcsDate(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

function buildCalendarInvite(booking) {
  const start = slotStart(booking.date, booking.time);
  const end = addMinutes(start, 30);
  const escapeIcs = (value) => String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Metro Pinjaman Berlesen//Appointment//EN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${booking.id}@metropinjamanberlesan.com`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    'STATUS:TENTATIVE',
    `SUMMARY:${escapeIcs(`Loan Appointment - ${booking.loanType}`)}`,
    `DESCRIPTION:${escapeIcs(`Metro Pinjaman Berlesen appointment. Contact: +60 11-7007 3191. Cancel: ${booking.cancelUrl || ''}`)}`,
    'LOCATION:Jalan Metro 1, Metro Prima, 52100 Kuala Lumpur, Federal Territory of Kuala Lumpur',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function bookingReference(booking) {
  return booking.id || booking.slotKey || `${booking.date}-${booking.time}`;
}

function buttonHtml(href, label, variant = 'primary') {
  if (!href) return '';
  const style = variant === 'primary'
    ? 'background:#020617;color:#ffffff;border:1px solid #020617;'
    : 'background:#ffffff;color:#0f766e;border:1px solid #0f766e;';
  return `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 8px 10px 0;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;padding:12px 16px;${style}">${escapeHtml(label)}</a>`;
}

function buildEmailShell({ title, preheader, reference, body }) {
  const safeTitle = escapeHtml(title);
  const safePreheader = escapeHtml(preheader || title);
  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>${safeTitle}</title>
  </head>
  <body style="margin:0;background:#f6f8f5;color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${safePreheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#ffffff;border:1px solid #dfe7df;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:26px 30px;border-bottom:1px solid #e5ebe5;background:#ffffff;">
                <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#0f766e;">Metro Pinjaman Berlesen</div>
                <div style="font-size:24px;line-height:1.25;font-weight:800;color:#0f172a;margin-top:8px;">${safeTitle}</div>
                <div style="font-size:13px;color:#64748b;margin-top:8px;">Ref: ${escapeHtml(reference || '-')}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 30px;">${body}</td>
            </tr>
            <tr>
              <td style="padding:20px 30px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:13px;line-height:1.7;color:#475569;">
                <strong style="color:#0f172a;">Metro Pinjaman Berlesen</strong><br>
                ${escapeHtml(OFFICE_ADDRESS)}<br>
                ${escapeHtml(OFFICE_PHONE)} | ${escapeHtml(OFFICE_EMAIL)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function rowsHtml(rows) {
  return rows.map(([label, value]) => `
    <tr>
      <th align="left" style="width:38%;padding:12px 14px;border-bottom:1px solid #e2e8f0;background:#f8fafc;font-size:14px;color:#0f172a;">${escapeHtml(label)}</th>
      <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;font-size:14px;line-height:1.5;color:#334155;">${escapeHtml(value || '-')}</td>
    </tr>`).join('');
}

function bookingRows(booking, { includeInternal = false } = {}) {
  const rows = [
    ['Customer Name', booking.name],
    ['Email', booking.email],
    ['Contact Number', booking.phone],
    ['Loan Type', booking.loanType],
    ['Preferred Slot', formatAppointmentDate(booking)],
    ['Message / Enquiry', booking.message || '-'],
    ['Status', booking.status || 'Pending Confirmation'],
  ];
  if (includeInternal) {
    rows.push(['Slot Key', booking.slotKey || '-']);
    rows.push(['Source', booking.source || 'Website']);
  }
  return rows;
}

function buildAdminEmail(booking) {
  const reference = bookingReference(booking);
  const preferredSlot = formatAppointmentDate(booking);
  const text = [
    'New Metro Pinjaman Berlesen appointment request',
    '',
    `Reference: ${reference}`,
    `Name: ${booking.name}`,
    `Email: ${booking.email}`,
    `Contact Number: ${booking.phone}`,
    `Loan Type: ${booking.loanType}`,
    `Preferred Slot: ${preferredSlot}`,
    `Message / Enquiry: ${booking.message || '-'}`,
    `Status: ${booking.status || 'Pending Confirmation'}`,
    `Notion: ${booking.notionUrl || '-'}`,
  ].join('\n');

  const body = `
    <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#334155;">A new appointment request was submitted from the website. Reply directly to the customer from this email if needed.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;border-collapse:separate;border-spacing:0;overflow:hidden;">${rowsHtml(bookingRows(booking, { includeInternal: true }))}</table>
    <div style="margin-top:22px;">
      ${buttonHtml(booking.notionUrl, 'Open in Notion')}
      ${buttonHtml(`mailto:${booking.email}`, 'Reply to Client', 'secondary')}
      ${buttonHtml(WHATSAPP_URL, 'Open WhatsApp', 'secondary')}
    </div>`;

  return {
    subject: `New appointment: ${booking.name} - ${booking.date} ${booking.time}`,
    text,
    html: buildEmailShell({
      title: 'New appointment booking',
      preheader: `${booking.name} requested ${preferredSlot}.`,
      reference,
      body,
    }),
  };
}

function buildClientEmail(booking) {
  const reference = bookingReference(booking);
  const preferredSlot = formatAppointmentDate(booking);
  const text = [
    `Hi ${booking.name},`,
    '',
    'Thank you. We have received your appointment request.',
    '',
    `Preferred Slot: ${preferredSlot}`,
    `Loan Type: ${booking.loanType}`,
    '',
    'Our team will contact you to confirm the appointment. A calendar file is attached for your convenience.',
    `Cancel appointment: ${booking.cancelUrl}`,
    `WhatsApp: ${WHATSAPP_URL}`,
    `Location: ${GOOGLE_MAPS_URL}`,
    '',
    'Metro Pinjaman Berlesen',
  ].join('\n');

  const body = `
    <p style="margin:0 0 16px;font-size:16px;color:#0f172a;font-weight:700;">Hi ${escapeHtml(booking.name)},</p>
    <p style="margin:0 0 18px;font-size:14px;line-height:1.7;color:#334155;">Thank you. We have received your appointment request and our team will contact you to confirm it.</p>
    <div style="display:inline-block;margin:0 0 18px;padding:7px 10px;border-radius:999px;background:#ecfdf5;color:#047857;font-size:12px;font-weight:700;">Pending Confirmation</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;border-collapse:separate;border-spacing:0;overflow:hidden;">${rowsHtml(bookingRows(booking))}</table>
    <p style="margin:18px 0 0;font-size:14px;line-height:1.7;color:#334155;">A calendar file is attached to this email. If you need to change your appointment, please cancel this request first and submit a new preferred slot.</p>
    <div style="margin-top:22px;">
      ${buttonHtml(booking.cancelUrl, 'Cancel Appointment')}
      ${buttonHtml(WHATSAPP_URL, 'WhatsApp Us', 'secondary')}
      ${buttonHtml(GOOGLE_MAPS_URL, 'View Location', 'secondary')}
    </div>`;

  return {
    subject: 'We received your Metro Pinjaman Berlesen appointment request',
    text,
    html: buildEmailShell({
      title: 'Appointment request received',
      preheader: `We received your appointment request for ${preferredSlot}.`,
      reference,
      body,
    }),
  };
}

async function sendResendEmail({ to, replyTo, subject, text, html, attachments }) {
  const recipients = Array.isArray(to) ? to : parseRecipientEmails(to);
  if (!RESEND_API_KEY || !recipients.length) {
    return { ok: false, error: 'Missing RESEND_API_KEY or recipient email.' };
  }

  const payload = {
    from: RESEND_FROM_EMAIL,
    to: recipients,
    subject,
    text,
    html,
  };

  if (replyTo) payload.reply_to = replyTo;
  if (attachments && attachments.length) payload.attachments = attachments;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text();
      return { ok: false, error: `Resend returned ${response.status}: ${body.slice(0, 500)}` };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message || 'Resend request failed.' };
  }
}

async function sendBookingEmails(booking) {
  const adminEmail = buildAdminEmail(booking);
  const clientEmail = buildClientEmail(booking);
  const calendarInvite = buildCalendarInvite(booking);

  const [adminResult, clientResult] = await Promise.all([
    sendResendEmail({
      to: RESEND_ADMIN_EMAILS,
      replyTo: booking.email,
      ...adminEmail,
    }),
    sendResendEmail({
      to: booking.email,
      ...clientEmail,
      attachments: [
        {
          filename: 'metro-pinjaman-appointment.ics',
          content: Buffer.from(calendarInvite).toString('base64'),
        },
      ],
    }),
  ]);

  if (!adminResult.ok) console.error('[booking] Admin email failed:', adminResult.error);
  if (!clientResult.ok) console.error('[booking] Client email failed:', clientResult.error);

  return { admin: adminResult, client: clientResult };
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

  const result = await notionRequest(`/databases/${NOTION_DATABASE_ID}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: {
        and: [
          { property: 'Slot Key', rich_text: { contains: `${date}|` } },
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
    cancelToken: crypto.randomBytes(24).toString('hex'),
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
  booking.cancelUrl = `${BOOKING_BASE_URL}/api/bookings/cancel?id=${encodeURIComponent(booking.id)}&token=${encodeURIComponent(booking.cancelToken)}`;

  const notionPage = await createNotionBooking(payload, key);
  if (notionPage) {
    booking.notionSynced = true;
    booking.notionPageId = notionPage.id;
    booking.notionUrl = notionPage.url;
  }

  bookings.push(booking);
  writeBookings(bookings);

  const emailResults = await sendBookingEmails(booking);
  booking.emailSent = Boolean(emailResults.admin.ok || emailResults.client.ok);
  writeBookings(bookings);

  sendJson(res, 201, { message: 'Booking submitted.', booking });
}

async function handleCancelBooking(res, url) {
  const id = url.searchParams.get('id');
  const token = url.searchParams.get('token');
  const bookings = readBookings();
  const booking = bookings.find((item) => item.id === id && item.cancelToken === token);

  if (!booking) {
    return sendHtml(res, 404, '<h1>Booking not found</h1><p>This cancellation link is invalid or expired.</p>');
  }

  booking.status = 'Cancelled';
  booking.cancelledAt = new Date().toISOString();

  if (booking.notionPageId) {
    await updateNotionBookingStatus(booking.notionPageId, 'Cancelled').catch(() => null);
  }

  writeBookings(bookings);

  sendHtml(res, 200, `<!doctype html>
<html>
  <head>
    <title>Appointment Cancelled</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body style="margin:0;background:#f8fafc;color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
    <main style="max-width:640px;margin:64px auto;padding:32px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;">
      <h1 style="margin:0 0 12px;font-size:28px;">Appointment Cancelled</h1>
      <p style="font-size:16px;line-height:1.6;">Your appointment for ${escapeHtml(formatAppointmentDate(booking))} has been cancelled. This time slot is now available again.</p>
      <p><a href="/contact.html" style="color:#0f766e;font-weight:700;">Book another appointment</a></p>
    </main>
  </body>
</html>`);
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

    if (req.method === 'GET' && url.pathname === '/api/bookings/cancel') {
      await handleCancelBooking(res, url);
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
    console.error('[booking] Request failed:', error);
    sendJson(res, 500, {
      message: 'Sorry, we could not submit your appointment right now. Please try again or contact us on WhatsApp.',
    });
  }
});

server.listen(PORT, () => {
  console.log(`Booking test server running at http://localhost:${PORT}`);
  if (!NOTION_TOKEN) {
    console.log('NOTION_TOKEN is not set. Bookings will be blocked locally for testing only.');
  }
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY is not set. Booking emails will not be sent.');
  }
});
