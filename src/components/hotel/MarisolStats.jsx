import { useMemo } from 'react';
import { starsString } from '../../utils/stars';
import styles from './MarisolStats.module.css';

export default function MarisolStats({ products }) {
  const { avgRating, experienceCount, totalGuests, featuredReview } = useMemo(() => {
    const avg = products.reduce((sum, p) => sum + p.rating, 0) / products.length;
    const guests = products.reduce((sum, p) => sum + p.reviewsCount, 0);

    const topProduct = [...products].sort((a, b) => b.rating - a.rating)[0];
    const review = topProduct?.reviews.find((r) => r.rating === 5) || topProduct?.reviews[0];

    return {
      avgRating: avg,
      experienceCount: products.length,
      totalGuests: guests,
      featuredReview: review,
    };
  }, [products]);

  return (
    <section className={`wrap ${styles.section}`}>
      <div className={styles.quote}>
        <span className={styles.quoteMark}>&ldquo;</span>
        <p>{featuredReview?.comment}</p>
        <span className={styles.author}>— {featuredReview?.author}</span>
      </div>

      <div className={styles.stats}>
        <div>
          <b>
            {starsString(avgRating)} {avgRating.toFixed(1)}
          </b>
          <span>Guest rating</span>
        </div>
        <div>
          <b>{experienceCount}+</b>
          <span>Experiences</span>
        </div>
        <div>
          <b>{totalGuests.toLocaleString()}+</b>
          <span>Happy guests</span>
        </div>
      </div>
    </section>
  );
}