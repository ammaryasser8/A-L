const NOTIFICATIONS_KEY = 'al-guest-notifications';

function delay(ms = 300) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

function readAll() {
  try {
    const stored = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
  } catch {
    /* notification just won't persist across reloads */
  }
}

export const notificationService = {
  /**
   * Called internally by other services (reservationService,
   * conciergeService) when something worth telling the guest happens —
   * never called directly from a page.
   */
  notify({ guestId, title, body }) {
    const notification = {
      id: `notif-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      guestId,
      title,
      body,
      read: false,
      createdAt: new Date().toISOString(),
    };
    writeAll([notification, ...readAll()]);
    return notification;
  },

  async getNotificationsForGuest(guestId) {
    await delay();
    return readAll()
      .filter((notification) => notification.guestId === guestId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async markAsRead(id) {
    await delay(150);
    const list = readAll();
    const next = list.map((notification) => (notification.id === id ? { ...notification, read: true } : notification));
    writeAll(next);
    return next.find((notification) => notification.id === id);
  },
};
