import {
  bookedTimesFromPages,
  findActiveBookingsForDate,
  getConfig,
  jsonResponse,
} from '../../_lib/booking.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const date = url.searchParams.get('date');
  if (!date) return jsonResponse({ message: 'Date is required.' }, 400);

  const config = getConfig(env);
  const bookings = await findActiveBookingsForDate(config, date);

  return jsonResponse({ bookedTimes: bookedTimesFromPages(date, bookings) });
}
