import { notificationService } from './notificationService';
import { guestProfileService } from './guestProfileService';
import { getRequestPriority } from './guestExperienceService';

const REQUESTS_KEY = 'al-guest-requests';

function delay(ms = 450) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

function readAll() {
  try {
    const stored = JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  try {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(list));
  } catch {
    /* request just won't persist across reloads */
  }
}

export const CONCIERGE_CATEGORIES = [
  'Reservation',
  'Room',
  'Dining',
  'Transportation',
  'Concierge',
  'Experience',
  'Billing',
  'Technical',
  'General',
];

export const conciergeService = {
  async createRequest({ guestId, category, subject, message, reservationId = null }) {
    await delay();
    const request = {
      id: `REQ-${Math.floor(1000 + Math.random() * 8999)}`,
      guestId,
      category,
      subject: subject?.trim() || `${category} request`,
      message,
      reservationId,
      status: 'submitted',
      priority: getRequestPriority(guestProfileService.getProfile(guestId)),
      assignedDepartment: category === 'Billing' ? 'Guest accounts' : category === 'Technical' ? 'Digital guest services' : 'AL Guest Relations',
      lastResponse: 'Received by the AL guest team.',
      createdAt: new Date().toISOString(),
    };
    writeAll([request, ...readAll()]);
    notificationService.notify({
      guestId,
      title: 'Request received',
      body: `Our concierge team has your ${category.toLowerCase()} request and will follow up shortly.`,
    });
    return request;
  },

  async getRequestsForGuest(guestId) {
    await delay(300);
    return readAll()
      .filter((request) => request.guestId === guestId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
};
