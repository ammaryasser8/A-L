import { Link } from 'react-router-dom';
import styles from './AuthLayout.module.css';

export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className={styles.layout}>
      <div className={styles.visual} aria-hidden="true">
        <div className={styles.visualImage} />
        <div className={styles.visualShade} />
        <p className={styles.visualQuote}>Two addresses.<br />One standard of hospitality.</p>
      </div>
      <div className={styles.panel}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
        <div className={styles.panelInner}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {children}
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </div>
    </div>
  );
}