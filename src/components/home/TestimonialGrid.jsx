import { useMemo } from 'react';
import styles from './TestimonialGrid.module.css';

function starString(rating) {
  const full = Math.round(rating);
  return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full);
}

export default function TestimonialGrid({ products, hotels }) {
  const testimonials = useMemo(() => {
    const seenPerHotel = {};
    const picked = [];
    const sortedByRating = [...products].sort((a, b) => b.rating - a.rating);

    for (const product of sortedByRating) {
      seenPerHotel[product.hotelId] = seenPerHotel[product.hotelId] || 0;
      if (seenPerHotel[product.hotelId] >= 2) continue;

      const review = product.reviews.find((r) => r.rating === 5) || product.reviews[0];
      const hotel = hotels.find((h) => h.id === product.hotelId);

      picked.push({ ...review, hotelName: hotel ? hotel.name : '' });
      seenPerHotel[product.hotelId] += 1;

      if (picked.length >= 3) break;
    }
    return picked;
  }, [products, hotels]);

  return (
    <section className={`wrap ${styles.section}`}>
      <h2 className={styles.heading}>What our guests say</h2>
      <div className={styles.grid}>
        {testimonials.map((t, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.stars}>{starString(t.rating)}</div>
            <p className={styles.comment}>&ldquo;{t.comment}&rdquo;</p>
            <div className={styles.author}>
              {t.author}
              <span>{t.hotelName}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}