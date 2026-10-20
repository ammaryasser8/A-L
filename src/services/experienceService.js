import { notificationService } from './notificationService';

const EXPERIENCE_BOOKINGS_KEY = 'al-guest-experience-bookings';

function delay(ms = 500) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

function readAll() {
  try {
    const stored = JSON.parse(localStorage.getItem(EXPERIENCE_BOOKINGS_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  try {
    localStorage.setItem(EXPERIENCE_BOOKINGS_KEY, JSON.stringify(list));
  } catch {
    /* booking just won't persist across reloads */
  }
}

/**
 * Covers dining, spa/wellness and other bookable experiences — anything
 * that isn't a room/suite stay (those go through reservationService /
 * the full booking flow instead). One shared shape: a product, a date
 * and time, a guest count.
 */
export const experienceService = {
  async createBooking({ guestId, productId, productTitle, hotelId, date, time, guests }) {
    await delay();
    const booking = {
      id: `EX-${Math.floor(1000 + Math.random() * 8999)}`,
      guestId,
      productId,
      hotelId,
      date,
      time,
      guests,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    writeAll([booking, ...readAll()]);
    notificationService.notify({
      guestId,
      title: 'Experience booked',
      body: `${productTitle} is booked for ${date} at ${time}.`,
    });
    return booking;
  },

  async getBookingsForGuest(guestId) {
    await delay(300);
    return readAll()
      .filter((booking) => booking.guestId === guestId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
};