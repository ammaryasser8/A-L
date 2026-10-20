import { reservationService } from './reservationService';

/**
 * Documents are never stored on their own — a "confirmation", "invoice"
 * and "receipt" are just three different readings of the same
 * reservation record, generated on demand. This keeps the reservation
 * the single source of truth, per the project's own data model rules.
 */
export const documentService = {
  async getDocumentsForGuest(guestId) {
    const reservations = await reservationService.getReservationsForGuest(guestId);
    return reservations.flatMap((reservation) => ([
      { id: `${reservation.id}-confirmation`, type: 'Confirmation', reservation },
      { id: `${reservation.id}-invoice`, type: 'Invoice', reservation },
      { id: `${reservation.id}-receipt`, type: 'Receipt', reservation },
    ]));
  },
};