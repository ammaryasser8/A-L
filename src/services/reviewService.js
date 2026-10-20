import { notificationService } from './notificationService';

const REVIEWS_KEY = 'al-guest-reviews';

function readAll() {
  try {
    const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
    return Array.isArray(reviews) ? reviews : [];
  } catch { return []; }
}

function writeAll(reviews) { try { localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews)); } catch { /* mock persistence only */ } }

export const reviewService = {
  getReviews(guestId) { return readAll().filter((review) => review.guestId === guestId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); },
  createReview({ guestId, reservationId, subject, rating, message }) {
    if (!rating || !message.trim()) throw new Error('Choose a rating and share a few words about your stay.');
    const review = { id: `REV-${Date.now().toString(36)}`, guestId, reservationId, subject, rating: Number(rating), message: message.trim(), createdAt: new Date().toISOString(), status: 'published' };
    writeAll([review, ...readAll()]);
    notificationService.notify({ guestId, title: 'Thank you for sharing your experience', body: 'Your review has been added to your private AL journey.' });
    return review;
  },
};
