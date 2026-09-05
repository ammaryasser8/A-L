import BookingBar from '../shared/BookingBar';
import styles from './MarisolHero.module.css';

export default function MarisolHero({ hotel }) {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.eyebrow}>Luxury Coastal Retreat</div>
        <h1 className={styles.heading}>
          Elevate your <span>escape</span>
        </h1>
        <p className={styles.subtitle}>{hotel?.description}</p>
        <div className={styles.actions}>
          <button className={styles.primaryBtn}>Explore the resort</button>
          <button className={styles.ghostBtn}>▷ Watch video</button>
        </div>
      </div>

      <div className={styles.bookingWrap}>
        <BookingBar variant="glass" />
      </div>
    </section>
  );
}