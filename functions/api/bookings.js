import {
  cleanValue,
  createBookingPage,
  findActiveBookingBySlot,
  getConfig,
  jsonResponse,
  sendBookingEmails,
  sendBookingWhatsApp,
  slotKey,
  validateBooking,
} from '../_lib/booking.js';

export async function onRequestPost({ request, env }) {
  const config = getConfig(env);
  let payload;

  try {
    payload = await request.json();
  } catch (error) {
    return jsonResponse({ message: 'Please submit the form again.' }, 400);
  }

  const validationError = validateBooking(payload);
  if (validationError) return jsonResponse({ message: validationError }, 400);

  try {
    const key = slotKey(payload.date, payload.time);
    const duplicate = await findActiveBookingBySlot(config, key);
    if (duplicate) {
      return jsonResponse({ message: 'This time slot has already been booked. Please choose another time.' }, 409);
    }

    const booking = await createBookingPage(config, {
      name: cleanValue(payload.name),
      email: cleanValue(payload.email),
      phone: cleanValue(payload.phone),
      loanType: cleanValue(payload.loanType),
      date: payload.date,
      time: payload.time,
      message: cleanValue(payload.message),
    });

    const emailResults = await sendBookingEmails(config, booking);
    if (!emailResults.admin.ok) console.error('[booking] Admin email failed:', emailResults.admin.error);
    if (!emailResults.client.ok) console.error('[booking] Client email failed:', emailResults.client.error);
    const whatsappResult = await sendBookingWhatsApp(config, booking);
    if (!whatsappResult.ok) console.error('[booking] WhatsApp message failed:', whatsappResult.error);

    return jsonResponse({ message: 'Booking submitted.', booking }, 201);
  } catch (error) {
    console.error('[booking] Booking submission failed:', error);
    return jsonResponse({
      message: 'Sorry, we could not submit your appointment right now. Please try again or contact us on WhatsApp.',
    }, 500);
  }
}
