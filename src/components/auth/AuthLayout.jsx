import { Link } from 'react-router-dom';
import styles from './AuthLayout.module.css';

const PERKS = [
  { icon: '✦', text: 'Book across both addresses in one place' },
  { icon: '♡', text: 'Save the rooms and experiences you love' },
  { icon: '◈', text: 'Manage reservations, requests and membership' },
];

export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className={styles.layout}>
      <div className={styles.aurora} aria-hidden="true"><i /><i /><i /><i /></div>
      <div className={styles.visual} aria-hidden="true">
        <div className={styles.visualImage} />
        <div className={styles.visualShade} />
        <div className={styles.visualContent}>
          <p className={styles.visualQuote}>Two addresses.<br />One standard of hospitality.</p>
          <ul className={styles.perks}>
            {PERKS.map(({ icon, text }) => <li key={text}><span>{icon}</span>{text}</li>)}
          </ul>
        </div>
      </div>
      <div className={styles.panel}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
        <div className={styles.panelInner}>
          <div className={styles.card}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            {children}
            {footer && <div className={styles.footer}>{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
