import styles from './Booking.module.css';

const STEPS = ['Stay', 'Room', 'Extras', 'Review', 'Payment', 'Confirmation'];

export default function BookingSteps({ current }) {
  return (
    <nav className={styles.steps} aria-label="Booking progress">
      <ol>
        {STEPS.map((label, index) => {
          const step = index + 1;
          const state = step === current ? styles.stepActive : step < current ? styles.stepDone : '';
          return (
            <li key={label} className={`${styles.step} ${state}`} aria-current={step === current ? 'step' : undefined}>
              <b aria-hidden="true">{step < current ? '✓' : step}</b>
              <em>{label}</em>
            </li>
          );
        })}
      </ol>
      <span className={styles.stepCount}>Step {current} of {STEPS.length}</span>
    </nav>
  );
}
