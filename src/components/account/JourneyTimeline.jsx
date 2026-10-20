import { JOURNEY_STAGES } from '../../services/reservationService';
import styles from '../../pages/AccountPage.module.css';

const LABELS = {
  booked: 'Booked',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  arrival: 'Arrival',
  'checked-in': 'Checked in',
  'checked-out': 'Checked out',
};

export default function JourneyTimeline({ journey }) {
  const currentIndex = JOURNEY_STAGES.indexOf(journey);
  return (
    <ol className={styles.timeline}>
      {JOURNEY_STAGES.map((stage, index) => {
        const state = index < currentIndex ? styles.timelineDone : index === currentIndex ? styles.timelineActive : styles.timelineUpcoming;
        return (
          <li key={stage} className={`${styles.timelineStep} ${state}`}>
            <span className={styles.timelineDot} aria-hidden="true" />
            <span>{LABELS[stage]}</span>
          </li>
        );
      })}
    </ol>
  );
}