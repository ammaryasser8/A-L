import { useMemo } from 'react';
import styles from './MarisolStats.module.css';

const ICONS = {
  rating: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L12 3Z" />
    </svg>
  ),
  rooms: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M4 21V9l8-5 8 5v12" />
      <path d="M9 21v-6h6v6" />
    </svg>
  ),
  experiences: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="3" y="11" width="18" height="7" rx="1" />
      <path d="M7 11V8a5 5 0 0 1 10 0v3" />
    </svg>
  ),
  guests: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c2.5.3 4.5 2.4 4.5 5.5" />
    </svg>
  ),
};

export default function MarisolStats({ products }) {
  const { avgRating, experienceCount, totalGuests, featuredReview } = useMemo(() => {
    const avg = products.reduce((sum, p) => sum + p.rating, 0) / products.length;
    const guests = products.reduce((sum, p) => sum + p.reviewsCount, 0);
    const topProduct = [...products].sort((a, b) => b.rating - a.rating)[0];
    const review = topProduct?.reviews.find((r) => r.rating === 5) || topProduct?.reviews[0];
    return { avgRating: avg, experienceCount: products.length, totalGuests: guests, featuredReview: review };
  }, [products]);

  return (
    <section className={styles.section}>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.quoteBlock}>
          <span className={styles.eyebrow}>Guests love us</span>
          <p className={styles.comment}>&ldquo;{featuredReview?.comment}&rdquo;</p>
          <div className={styles.authorRow}>
            <span className={styles.avatar} />
            <span className={styles.author}>{featuredReview?.author}</span>
          </div>
        </div>

        <div className={styles.statsBox}>
          <div className={styles.stat}>
            <span className={styles.icon}>{ICONS.rating}</span>
            <b>{avgRating.toFixed(1)}/5</b>
            <span>Guest rating</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.icon}>{ICONS.experiences}</span>
            <b>{experienceCount}+</b>
            <span>Experiences</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.icon}>{ICONS.guests}</span>
            <b>{Math.round(totalGuests / 100)}00+</b>
            <span>Happy guests</span>
          </div>
        </div>
      </div>
    </section>
  );
}