import hotels from '../../data/hotels.json';
import LuxuryStat from './LuxuryStat';
import styles from './GroupExperience.module.css';

export default function ProofSection({ productCount, avgRating, totalReviews }) {
  return (
    <section className={styles.proof}>
      <p className={styles.eyebrow}>The collection, in numbers</p>
      <div>
        <LuxuryStat target={hotels.length} label="Distinct destinations" format={(v) => String(Math.round(v)).padStart(2, '0')} />
        <LuxuryStat target={productCount} label="Curated stays & experiences" format={(v) => String(Math.round(v)).padStart(3, '0')} />
        <LuxuryStat target={avgRating} label="Average guest rating" format={(v) => v.toFixed(1)} />
        <LuxuryStat target={totalReviews} label="Guest reviews across AL" format={(v) => Math.round(v).toLocaleString()} />
      </div>
    </section>
  );
}