import { notificationService } from './notificationService';

const RESERVATIONS_KEY = 'al-guest-reservations';

/**
 * MOCK RESERVATION SERVICE.
 *
 * Reservations are created by the booking flow and stored in localStorage,
 * keyed to the signed-in guest's id. Real hotel/room data (name, image,
 * price) is resolved from hotels.json/products.json at read time via IDs
 * — never duplicated into the stored reservation — exactly as the data
 * model calls for (reservation.hotelId / reservation.roomId, resolved
 * through services rather than copied).
 */

function delay(ms = 500) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

function readAll() {
  try {
    const stored = JSON.parse(localStorage.getItem(RESERVATIONS_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  try {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(list));
  } catch {
    /* reservation just won't persist across reloads */
  }
}

function nightsBetween(checkIn, checkOut) {
  const ms = new Date(checkOut) - new Date(checkIn);
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export const JOURNEY_STAGES = ['booked', 'confirmed', 'preparing', 'arrival', 'checked-in', 'checked-out'];

export const reservationService = {
  async createReservation({ guestId, hotelId, roomId, checkIn, checkOut, guests, pricePerNight, extraIds = [], extrasTotal = 0 }) {
    await delay();
    const nights = nightsBetween(checkIn, checkOut);
    const roomTotal = Math.round(pricePerNight * nights * 100) / 100;
    const reservation = {
      id: `AL-${Math.floor(10000 + Math.random() * 89999)}`,
      guestId,
      hotelId,
      roomId,
      checkIn,
      checkOut,
      nights,
      guests,
      pricePerNight,
      extraIds,
      extrasTotal,
      roomTotal,
      total: Math.round((roomTotal + extrasTotal) * 100) / 100,
      status: 'confirmed',
      // A simple, honest journey timeline — a successful mock payment
      // means both "booked" and "confirmed" are already true.
      journey: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    writeAll([...readAll(), reservation]);
    notificationService.notify({
      guestId,
      title: 'Reservation confirmed',
      body: `Your stay at reservation ${reservation.id} is confirmed for ${checkIn} — ${checkOut}.`,
    });
    return reservation;
  },

  async getReservationsForGuest(guestId) {
    await delay(300);
    return readAll()
      .filter((reservation) => reservation.guestId === guestId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getReservationById(id) {
    await delay(250);
    const found = readAll().find((reservation) => reservation.id === id);
    if (!found) throw new Error('Reservation not found.');
    return found;
  },

  async updateReservation(id, patch) {
    await delay(300);
    const list = readAll();
    const index = list.findIndex((reservation) => reservation.id === id);
    if (index === -1) throw new Error('Reservation not found.');
    const updated = { ...list[index], ...patch };
    list[index] = updated;
    writeAll(list);
    return updated;
  },
};