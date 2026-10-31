import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import hotels from '../data/hotels.json';
import products from '../data/products.json';
import { useAuth } from '../hooks/useAuth';
import { conciergeService } from '../services/conciergeService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import GroupPageShell, { Reveal } from './GroupPageShell';
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
    <GroupPageShell
      eyebrow="Events"
      title={<>Weddings, meetings<br />and private <em>occasions.</em></>}
      lead="Two venues, held to the same considered standard as the rooms upstairs."
      image={venues[0] ? `/${venues[0].images[0]}` : '/images/products/7-1.jpg'}
    >
      <section className={styles.section}>
        <h2>Our venues</h2>
        {venues.map((venue, index) => {
          const hotel = hotels.find((entry) => entry.id === venue.hotelId);
          return (
            <Reveal key={venue.id} delay={index * 100}>
              <article className={styles.venueCard}>
                <div className={styles.venueImage}><img src={`/${venue.images[0]}`} alt={venue.title} loading="lazy" /></div>
                <div className={styles.venueInfo}>
                  <span className={styles.venueTag}>{hotel?.shortName}</span>
                  <h3>{venue.title}</h3>
                  <p>{venue.description}</p>
                  <ul className={styles.venueFacts}>
                    <li>Up to {venue.capacity} guests</li>
                    <li>{venue.size} m²</li>
                    <li>from ${venue.price.toFixed(0)}</li>
                  </ul>
                  <Link className={styles.pillLink} to={`/hotels/${hotel?.slug}/product/${venue.slug}`}>View venue ↗</Link>
                </div>
              </article>
            </Reveal>
          );
        })}
      </section>

      <Reveal as="section" className={styles.section}>
        <h2>Plan an event</h2>
        {sent ? (
          <p className={styles.thanks}>Thank you — our events team has your inquiry and will be in touch.</p>
        ) : (
          <form onSubmit={handleInquiry} className={styles.inquiry}>
            <textarea
              required
              rows={4}
              aria-label="Tell us about the occasion"
              placeholder="Tell us about the occasion — date, guest count, venue you have in mind…"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <button type="submit" disabled={submitting} className={styles.submit}>
              {submitting ? 'Sending…' : 'Send inquiry'}
            </button>
          </form>
        )}
      </Reveal>
    </GroupPageShell>
  );
}
