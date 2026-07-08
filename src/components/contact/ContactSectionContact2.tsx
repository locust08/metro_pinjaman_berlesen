import React, { useEffect, useMemo, useState } from 'react';

type BookingForm = {
  name: string;
  email: string;
  phone: string;
  loanType: string;
  date: string;
  time: string;
  message: string;
};

const timeSlots = [
  ['09:00', '9:00 AM'],
  ['10:00', '10:00 AM'],
  ['11:00', '11:00 AM'],
  ['12:00', '12:00 PM'],
  ['14:00', '2:00 PM'],
  ['15:00', '3:00 PM'],
  ['16:00', '4:00 PM'],
  ['17:00', '5:00 PM'],
];

declare global {
  interface Window {
    metroTrack?: (eventName: string, eventParams?: Record<string, string>) => void;
  }
}

const todayIso = () => new Date().toISOString().slice(0, 10);

const ContactSectionContact2: React.FC = () => {
  const today = useMemo(() => todayIso(), []);
  const isLocal =
    typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const [form, setForm] = useState<BookingForm>({
    name: '',
    email: '',
    phone: '',
    loanType: '',
    date: today,
    time: '',
    message: '',
  });
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const updateForm = (field: keyof BookingForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const isBooked = (time: string) => bookedTimes.includes(time);

  const loadBookedTimes = async (date = form.date) => {
    if (!date) return;

    try {
      const response = await fetch(`/api/bookings/booked-slots?date=${encodeURIComponent(date)}`);
      if (!response.ok) return;

      const data = await response.json();
      const nextBookedTimes = data.bookedTimes || [];
      setBookedTimes(nextBookedTimes);

      if (nextBookedTimes.includes(form.time)) {
        updateForm('time', '');
      }
    } catch {
      setBookedTimes([]);
    }
  };

  useEffect(() => {
    loadBookedTimes(form.date);
  }, [form.date]);

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your full name.';
    if (!form.email.trim()) return 'Please enter your email address.';
    if (!form.phone.trim()) return 'Please enter your contact number.';
    if (!form.loanType) return 'Please select a loan type.';
    if (!form.date || !form.time) return 'Please select your preferred date and time.';
    if (isBooked(form.time)) return 'This time slot has already been booked. Please choose another time.';
    return '';
  };

  const submitBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSuccessMessage('');
    const validationError = validate();
    setErrorMessage(validationError);
    if (validationError) return;

    setLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(data.message || 'This time slot is unavailable. Please choose another time.');
        await loadBookedTimes();
        return;
      }

      setSuccessMessage('Thank you. Your preferred slot has been submitted.');
      setErrorMessage('');
      window.metroTrack?.('lead_form_submit', {
        form_id: 'contact_booking',
        form_name: 'Contact appointment booking',
      });
      updateForm('time', '');
      await loadBookedTimes();
    } catch {
      setErrorMessage('Booking service is currently unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const resetTestBookings = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/test/reset-bookings', { method: 'POST' });
      if (!response.ok) throw new Error('Reset failed');
      setSuccessMessage('Test bookings have been reset.');
      await loadBookedTimes();
    } catch {
      setErrorMessage('Could not reset test bookings.');
    }
  };

  return (
    <section className="py-12 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="border-t pt-16">
          <div className="max-w-lg mx-auto lg:max-w-none">
            <div className="flex flex-wrap -mx-4">
              <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
                <div className="max-w-lg py-7">
                  <h1 className="font-heading text-4xl sm:text-6xl tracking-sm mb-6">Contact us</h1>
                  <p className="text-lg text-gray-700 mb-16">
                    Contact Metro Pinjaman Berlesen for personal and business loan enquiries. Our team is
                    ready to assist you 24/7.
                  </p>
                  <form onSubmit={submitBooking}>
                    <label className="block pl-4 mb-1 text-sm font-medium">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => updateForm('name', event.target.value)}
                      className="w-full px-4 py-3 mb-6 outline-none ring-offset-0 focus:ring-2 focus:ring-lime-500 shadow rounded-full"
                    />
                    <label className="block pl-4 mb-1 text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => updateForm('email', event.target.value)}
                      className="w-full px-4 py-3 mb-6 outline-none ring-offset-0 focus:ring-2 focus:ring-lime-500 shadow rounded-full"
                    />
                    <label className="block pl-4 mb-1 text-sm font-medium">Contact Number</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(event) => updateForm('phone', event.target.value)}
                      className="w-full px-4 py-3 mb-6 outline-none ring-offset-0 focus:ring-2 focus:ring-lime-500 shadow rounded-full"
                    />
                    <label className="block pl-4 mb-1 text-sm font-medium">Loan Type</label>
                    <div className="relative w-full mb-8 bg-white rounded-full">
                      <span className="absolute top-1/2 right-0 mr-4 transform -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none">
                          <path d="M6.3999 8.2L9.9999 11.8L13.5999 8.2" stroke="#646A69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <select
                        value={form.loanType}
                        onChange={(event) => updateForm('loanType', event.target.value)}
                        className="w-full px-4 py-3 text-gray-600 border rounded-full appearance-none cursor-pointer outline-none ring-offset-0 focus:ring-2 focus:ring-lime-500 bg-transparent relative"
                      >
                        <option value="">Select loan type</option>
                        <option value="Personal Loan">Personal Loan</option>
                        <option value="Business Loan">Business Loan</option>
                      </select>
                    </div>
                    <div className="flex flex-wrap -mx-2">
                      <div className="w-full sm:w-1/2 px-2">
                        <label className="block pl-4 mb-1 text-sm font-medium">Preferred Date</label>
                        <input
                          type="date"
                          value={form.date}
                          min={today}
                          onChange={(event) => updateForm('date', event.target.value)}
                          className="w-full px-4 py-3 mb-6 text-gray-600 outline-none ring-offset-0 focus:ring-2 focus:ring-lime-500 shadow rounded-full"
                        />
                      </div>
                      <div className="w-full sm:w-1/2 px-2">
                        <label className="block pl-4 mb-1 text-sm font-medium">Preferred Time</label>
                        <div className="relative w-full mb-8 bg-white rounded-full">
                          <span className="absolute top-1/2 right-0 mr-4 transform -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none">
                              <path d="M6.3999 8.2L9.9999 11.8L13.5999 8.2" stroke="#646A69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <select
                            value={form.time}
                            onFocus={() => loadBookedTimes()}
                            onClick={() => loadBookedTimes()}
                            onChange={(event) => updateForm('time', event.target.value)}
                            className="w-full px-4 py-3 text-gray-600 border rounded-full appearance-none cursor-pointer outline-none ring-offset-0 focus:ring-2 focus:ring-lime-500 bg-transparent relative"
                          >
                            <option value="">Select preferred time</option>
                            {timeSlots.map(([time, label]) => (
                              <option key={time} value={time} disabled={isBooked(time)}>
                                {isBooked(time) ? `${label} - Booked` : label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <label className="block pl-4 mb-1 text-sm font-medium">Message / Enquiry</label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(event) => updateForm('message', event.target.value)}
                      className="w-full px-4 py-3 mb-8 outline-none ring-offset-0 focus:ring-2 focus:ring-lime-500 shadow rounded-2xl resize-none"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full py-3 px-5 items-center justify-center font-medium text-white hover:text-teal-900 border border-teal-900 hover:border-lime-500 bg-teal-900 hover:bg-lime-500 rounded-full transition duration-200 disabled:opacity-60"
                    >
                      <span className="mr-2">{loading ? 'Submitting...' : 'Submit'}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width={21} height={20} viewBox="0 0 21 20" fill="none">
                        <path d="M5.25 10H15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10.5 4.75L15.75 10L10.5 15.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {successMessage && <p className="mt-4 text-sm text-teal-900 text-center font-medium">{successMessage}</p>}
                    {errorMessage && <p className="mt-4 text-sm text-red-600 text-center font-medium">{errorMessage}</p>}
                    {isLocal && (
                      <button type="button" onClick={resetTestBookings} className="mt-3 mx-auto block text-sm text-gray-600 underline">
                        Reset test bookings
                      </button>
                    )}
                  </form>
                </div>
              </div>
              <div className="w-full lg:w-1/2 px-4">
                <div className="lg:max-w-md lg:ml-auto h-full">
                  <img className="block w-full h-full" src="flow-assets/contact/photo-1.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSectionContact2;
