import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import hotels from '../data/hotels.json';
import products from '../data/products.json';
import { useAuth } from '../hooks/useAuth';
import { conciergeService } from '../services/conciergeService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './GroupPage.module.css';

export default function EventsPage() {
  useDocumentTitle('Events');
  const venues = products.filter((product) => product.category === 'Events & Meetings');
  const { session, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleInquiry(event) {
    event.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/events' } } });
      return;
    }
    setSubmitting(true);
    await conciergeService.createRequest({ guestId: session.id, category: 'Events', message });
    setSubmitting(false);
    setSent(true);
    setMessage('');
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
      </header>

      <div className={styles.content}>
        <p className={styles.eyebrow}>Events</p>
        <h1>Weddings, meetings<br />and private <em>occasions.</em></h1>
        <p className={styles.lead}>Two venues, held to the same considered standard as the rooms upstairs.</p>

        <section className={styles.section}>
          <h2>Our venues</h2>
          {venues.map((venue) => {
            const hotel = hotels.find((entry) => entry.id === venue.hotelId);
            return (
              <article key={venue.id} className={styles.venueCard}>
                <img src={`/${venue.images[0]}`} alt={venue.title}  loading="lazy" />
                <div className={styles.venueInfo}>
                  <p className={styles.venueMeta}>{hotel?.shortName}</p>
                  <h3>{venue.title}</h3>
                  <p>{venue.description}</p>
                  <p className={styles.venueMeta}>Up to {venue.capacity} guests · {venue.size} m² · from ${venue.price.toFixed(0)}</p>
                  <Link to={`/hotels/${hotel?.slug}/product/${venue.slug}`}>View venue ↗</Link>
                </div>
              </article>
            );
          })}
        </section>

        <section className={styles.section}>
          <h2>Plan an event</h2>
          {sent ? (
            <p>Thank you — our events team has your inquiry and will be in touch.</p>
          ) : (
            <form onSubmit={handleInquiry} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <textarea
                required
                rows={4}
                placeholder="Tell us about the occasion — date, guest count, venue you have in mind…"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                style={{ border: '1px solid rgba(28,21,18,.22)', padding: 14, font: '14px/1.6 Jost, sans-serif', background: 'transparent', color: 'var(--al-ink)', resize: 'vertical' }}
              />
              <button type="submit" disabled={submitting} className={styles.categoryBtn} style={{ alignSelf: 'flex-start' }}>
                {submitting ? 'Sending…' : 'Send inquiry'}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}