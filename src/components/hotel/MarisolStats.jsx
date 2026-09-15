import { useMemo } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { useCountUp } from '../../hooks/useCountUp';
import styles from './MarisolStats.module.css';

function StatItem({ value, decimals = 0, suffix = '', label, trigger }) {
  const count = useCountUp(value, trigger);
  return (
    <div className={styles.stat}>
      <span className={styles.value}>
        {count.toFixed(decimals)}
        {suffix}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export default function MarisolStats({ products }) {
  const [ref, visible] = useReveal(0.4);

  const { avgRating, experienceCount, totalGuests, restaurantCount } = useMemo(() => {
    const avg = products.reduce((sum, p) => sum + p.rating, 0) / products.length;
    const guests = products.reduce((sum, p) => sum + p.reviewsCount, 0);
    const restaurants = products.filter((p) => p.category === 'Restaurants').length;
    return {
      avgRating: avg,
      experienceCount: products.length,
      totalGuests: guests,
      restaurantCount: restaurants,
    };
  }, [products]);

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.grid}>
        <StatItem value={avgRating} decimals={1} label="Guest Rating" trigger={visible} />
        <StatItem value={experienceCount} label="Luxury Spaces" trigger={visible} />
        <StatItem value={restaurantCount} label="Dining Venues" trigger={visible} />
        <StatItem
          value={Math.round(totalGuests / 100) * 100}
          suffix="+"
          label="Happy Guests"
          trigger={visible}
        />
      </div>
    </section>
  );
}