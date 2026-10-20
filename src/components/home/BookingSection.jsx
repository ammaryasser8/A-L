import BookingBar from '../shared/BookingBar';
import styles from './GroupExperience.module.css';

export default function BookingSection() {
  return (
    <section data-booking-scene className={styles.bookingScene} aria-labelledby="booking-title">
      <div data-booking-aura className={styles.bookingAura} aria-hidden="true" />
      <div className={styles.bookingCopy}><p className={styles.eyebrow}>Your next chapter</p><h2 id="booking-title">Find the time<br />to <em>arrive.</em></h2><p>Choose your dates. The rest unfolds with care.</p></div>
      <BookingBar variant="glass" />
    </section>
  );
}