import styles from './Booking.module.css';

const STEPS = ['Stay', 'Room', 'Extras', 'Review', 'Payment', 'Confirmation'];

export default function BookingSteps({ current }) {
  return (
    <nav className={styles.steps}>
      {STEPS.map((label, index) => {
        const step = index + 1;
        const className = step === current ? styles.stepActive : step < current ? styles.stepDone : undefined;
        return <span key={label} className={className} aria-current={step === current ? 'step' : undefined}>{String(step).padStart(2, '0')} {label}</span>;
      })}
      <div className={styles.mobileProgress} aria-hidden="true">
        <span>Step {current} of {STEPS.length}</span>
        <i><em style={{ width: `${(current / STEPS.length) * 100}%` }} /></i>
      </div>
    </nav>
  );
}
