const NOTION_VERSION = '2022-06-28';
const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_DATABASE_ID = 'fa9a71965f8d40ff92276ba56aa2d69f';
const DEFAULT_APPOINTMENT_DURATION_MINUTES = 30;
const ACTIVE_STATUSES = ['Pending Confirmation', 'Confirmed - Booked'];

export function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export function htmlResponse(html, status = 200) {
  return new Response(html, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

export function cleanValue(value) {
  return String(value || '').trim();
}

export function escapeHtml(value) {
  return cleanValue(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue(email));
}

export function slotKey(date, time) {
  return `${date}|${time}`;
}

export function slotStart(date, time) {
  return new Date(`${date}T${time}:00+08:00`);
}

export function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function notionDateTime(date, time) {
  const { date: parsedDate, time: parsedTime } = addMinutesToWallClock(date, time, 0);
  return `${parsedDate}T${parsedTime}:00`;
}

export function notionEndDateTime(date, time) {
  const end = addMinutesToWallClock(date, time, DEFAULT_APPOINTMENT_DURATION_MINUTES);
  return `${end.date}T${end.time}:00`;
}

export function addMinutesToWallClock(date, time, minutesToAdd) {
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

export function getConfig(env) {
  return {
    notionToken: env.NOTION_TOKEN || '',
    notionDatabaseId: env.APPOINTMENT_NOTION_DATABASE_ID || env.NOTION_DATABASE_ID || DEFAULT_DATABASE_ID,
    resendApiKey: env.RESEND_API_KEY || '',
    resendFromEmail: env.RESEND_FROM_EMAIL_DEV || env.RESEND_FROM_EMAIL || env.RESEND_FROM_EMAIL_PROD || 'Metro Pinjaman Berlesen <no-reply@locus-t.com.my>',
    resendAdminEmails: env.RESEND_CONFIRMATION_TO_EMAIL_DEV || env.RESEND_TO_EMAIL_DEV || env.RESEND_TO_EMAILS || env.RESEND_TO_EMAIL || env.RESEND_TO_EMAIL_PROD || '',
    bookingBaseUrl: env.BOOKING_BASE_URL || 'https://metropinjamanberlesen.pages.dev',
  };
}

export function validateBooking(payload) {
  if (!cleanValue(payload.name)) return 'Please enter your full name.';
  if (!isValidEmail(payload.email)) return 'Please enter a valid email address.';
  if (!cleanValue(payload.phone)) return 'Please enter your contact number.';
  if (!cleanValue(payload.loanType)) return 'Please select a loan type.';
  if (!payload.date || !payload.time) return 'Please select your preferred date and time.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.date)) return 'Please select a valid date.';
  if (!/^\d{2}:\d{2}$/.test(payload.time)) return 'Please select a valid time.';
  return '';
}

export async function notionRequest(config, pathname, options = {}) {
  if (!config.notionToken) throw new Error('NOTION_TOKEN is not configured.');

  const response = await fetch(`https://api.notion.com/v1${pathname}`, {
    ...options,
    headers: {
      authorization: `Bearer ${config.notionToken}`,
      'notion-version': NOTION_VERSION,
      'content-type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Notion API error ${response.status}: ${(await response.text()).slice(0, 500)}`);
  }

  return response.json();
}

export async function findActiveBookingBySlot(config, key) {
  const result = await notionRequest(config, `/databases/${config.notionDatabaseId}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: {
        and: [
          { property: 'Slot Key', rich_text: { equals: key } },
          {
            or: ACTIVE_STATUSES.map((status) => ({ property: 'Status', select: { equals: status } })),
          },
        ],
      },
      page_size: 1,
    }),
  });

  return result.results?.[0] || null;
}

export async function findActiveBookingsForDate(config, date) {
  const result = await notionRequest(config, `/databases/${config.notionDatabaseId}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: {
        and: [
          { property: 'Slot Key', rich_text: { contains: `${date}|` } },
          {
            or: ACTIVE_STATUSES.map((status) => ({ property: 'Status', select: { equals: status } })),
          },
        ],
      },
      page_size: 100,
    }),
  });

  return result.results || [];
}

export function bookedTimesFromPages(date, pages) {
  return [...new Set(pages
    .map((page) => page.properties?.['Slot Key']?.rich_text || [])
    .map((richText) => richText.map((part) => part.plain_text).join(''))
    .filter((key) => key.startsWith(`${date}|`))
    .map((key) => key.split('|')[1]))].sort();
}

export function randomToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function formatAppointmentDate(booking) {
  return new Intl.DateTimeFormat('en-MY', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kuala_Lumpur',
  }).format(slotStart(booking.date, booking.time));
}

export function pageToBooking(page) {
  const props = page.properties || {};
  const key = props['Slot Key']?.rich_text?.map((part) => part.plain_text).join('') || '';
  const [date, time] = key.split('|');

  return {
    id: page.id,
    notionPageId: page.id,
    notionUrl: page.url,
    name: props['Customer Name']?.rich_text?.map((part) => part.plain_text).join('') || '',
    email: props.Email?.email || '',
    phone: props.Phone?.phone_number || '',
    loanType: props['Loan Type']?.select?.name || '',
    message: props['Message / Enquiry']?.rich_text?.map((part) => part.plain_text).join('') || '',
    status: props.Status?.select?.name || '',
    slotKey: key,
    date,
    time,
    cancelToken: props['Cancel Token']?.rich_text?.map((part) => part.plain_text).join('') || '',
    cancelUrl: props['Cancel URL']?.url || '',
  };
}

export async function createBookingPage(config, payload) {
  const token = randomToken();
  const key = slotKey(payload.date, payload.time);
  const title = `${payload.name} - ${payload.date} ${payload.time}`;
  const cancelUrl = `${config.bookingBaseUrl}/api/bookings/cancel?id=pending&token=${token}`;

  const page = await notionRequest(config, '/pages', {
    method: 'POST',
    body: JSON.stringify({
      parent: { database_id: config.notionDatabaseId },
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
        'Customer Name': { rich_text: [{ text: { content: cleanValue(payload.name) } }] },
        Phone: { phone_number: cleanValue(payload.phone) },
        Email: { email: cleanValue(payload.email) },
        'Loan Type': { select: { name: cleanValue(payload.loanType) } },
        'Message / Enquiry': { rich_text: [{ text: { content: cleanValue(payload.message) } }] },
        'Slot Key': { rich_text: [{ text: { content: key } }] },
        'Cancel Token': { rich_text: [{ text: { content: token } }] },
        'Cancel URL': { url: cancelUrl },
        Source: { select: { name: 'Website' } },
      },
    }),
  });

  const realCancelUrl = `${config.bookingBaseUrl}/api/bookings/cancel?id=${page.id}&token=${token}`;
  await notionRequest(config, `/pages/${page.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ properties: { 'Cancel URL': { url: realCancelUrl } } }),
  });

  return { ...pageToBooking(page), id: page.id, cancelToken: token, cancelUrl: realCancelUrl, date: payload.date, time: payload.time };
}

export async function cancelBookingPage(config, pageId, token) {
  const page = await notionRequest(config, `/pages/${pageId}`);
  const booking = pageToBooking(page);

  if (!booking.cancelToken || booking.cancelToken !== token) return null;

  await notionRequest(config, `/pages/${pageId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      properties: {
        Status: { select: { name: 'Cancelled' } },
        'Cancelled At': { date: { start: new Date().toISOString() } },
      },
    }),
  });

  return { ...booking, status: 'Cancelled' };
}

function formatIcsDate(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

export function buildCalendarInvite(booking) {
  const escapeIcs = (value) => String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
  const start = slotStart(booking.date, booking.time);
  const end = addMinutes(start, 30);

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
    `DESCRIPTION:${escapeIcs(`Metro Pinjaman Berlesen appointment. Cancel: ${booking.cancelUrl}`)}`,
    'LOCATION:Jalan Metro 1, Metro Prima, 52100 Kuala Lumpur, Federal Territory of Kuala Lumpur',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function emailShell(title, body) {
  return `<!doctype html><html><body style="margin:0;background:#f8fafc;color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;"><tr><td style="padding:24px 28px;border-bottom:1px solid #e2e8f0;"><div style="font-size:20px;font-weight:700;color:#0f172a;">Metro Pinjaman Berlesen</div><div style="font-size:13px;color:#64748b;margin-top:4px;">${escapeHtml(title)}</div></td></tr><tr><td style="padding:24px 28px;">${body}</td></tr></table></td></tr></table></body></html>`;
}

function rowsHtml(booking) {
  return [
    ['Name', booking.name],
    ['Email', booking.email],
    ['Contact Number', booking.phone],
    ['Loan Type', booking.loanType],
    ['Preferred Slot', formatAppointmentDate(booking)],
    ['Message / Enquiry', booking.message || '-'],
  ].map(([label, value]) => `<tr><th align="left" style="width:38%;padding:11px 12px;border-bottom:1px solid #e2e8f0;background:#f8fafc;font-size:14px;color:#0f172a;">${escapeHtml(label)}</th><td style="padding:11px 12px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#334155;">${escapeHtml(value)}</td></tr>`).join('');
}

export async function sendResendEmail(config, { to, replyTo, subject, text, html, attachments }) {
  const recipients = Array.isArray(to) ? to : cleanValue(to).split(',').map((email) => email.trim()).filter(Boolean);
  if (!config.resendApiKey || !recipients.length) return { ok: false, error: 'Missing Resend configuration.' };

  const payload = {
    from: config.resendFromEmail,
    to: recipients,
    subject,
    text,
    html,
  };
  if (replyTo) payload.reply_to = replyTo;
  if (attachments?.length) payload.attachments = attachments;

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${config.resendApiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) return { ok: false, error: `Resend returned ${response.status}: ${(await response.text()).slice(0, 500)}` };
  return { ok: true };
}

export async function sendBookingEmails(config, booking) {
  const detailRows = rowsHtml(booking);
  const adminHtml = emailShell('Internal appointment notification', `<h1 style="margin:0 0 16px;font-size:20px;">New Appointment Booking</h1><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;border-collapse:separate;border-spacing:0;overflow:hidden;">${detailRows}</table><p style="margin:18px 0 0;"><a href="${escapeHtml(booking.notionUrl)}" style="color:#0f766e;font-weight:700;">Open in Notion</a></p>`);
  const clientHtml = emailShell('Appointment request received', `<p style="margin:0 0 16px;font-size:16px;color:#0f172a;font-weight:700;">Hi ${escapeHtml(booking.name)},</p><p style="margin:0 0 18px;font-size:14px;line-height:1.7;color:#334155;">Thank you. We have received your appointment request and our team will contact you to confirm it.</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;border-collapse:separate;border-spacing:0;overflow:hidden;">${detailRows}</table><p style="margin:18px 0 0;font-size:14px;line-height:1.7;color:#334155;">A calendar file is attached to this email.</p><p style="margin:18px 0 0;"><a href="${escapeHtml(booking.cancelUrl)}" style="display:inline-block;border:1px solid #0f766e;border-radius:8px;color:#0f766e;text-decoration:none;font-size:14px;font-weight:700;padding:12px 18px;">Cancel Appointment</a></p>`);
  const text = `Appointment booking\nName: ${booking.name}\nEmail: ${booking.email}\nContact Number: ${booking.phone}\nLoan Type: ${booking.loanType}\nPreferred Slot: ${formatAppointmentDate(booking)}\nMessage: ${booking.message || '-'}\nCancel: ${booking.cancelUrl}`;
  const calendarInvite = buildCalendarInvite(booking);

  const [admin, client] = await Promise.all([
    sendResendEmail(config, {
      to: config.resendAdminEmails,
      replyTo: booking.email,
      subject: `New appointment: ${booking.name} - ${booking.date} ${booking.time}`,
      text,
      html: adminHtml,
    }),
    sendResendEmail(config, {
      to: booking.email,
      subject: 'We received your Metro Pinjaman Berlesen appointment request',
      text,
      html: clientHtml,
      attachments: [{ filename: 'metro-pinjaman-appointment.ics', content: btoa(calendarInvite) }],
    }),
  ]);

  return { admin, client };
}
