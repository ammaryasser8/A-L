import { Link, NavLink } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { useCountUp } from '../hooks/useCountUp';
import styles from './GroupPage.module.css';

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/press', label: 'Press' },
  { to: '/careers', label: 'Careers' },
  { to: '/events', label: 'Events' },
];

/** Fades/slides its children in once, the first time they scroll into view. */
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const [ref, visible] = useReveal(0.12);
  return (
    <Tag ref={ref} className={`${styles.reveal} ${visible ? styles.revealIn : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

/** A number that counts up once when it scrolls into view. */
export function Stat({ value, label, prefix = '' }) {
  const [ref, visible] = useReveal(0.4);
  const shown = useCountUp(value, visible, 1400);
  return (
    <div ref={ref} className={styles.stat}>
      <strong>{prefix}{Math.round(shown)}</strong>
      <span>{label}</span>
    </div>
  );
}

/**
 * Shared frame for the group's information pages (About, Press, Careers, Events):
 * dark backdrop with a slow gold/wine glow, a nav between the four pages,
 * and an image hero.
 */
export default function GroupPageShell({ eyebrow, title, lead, image, children }) {
  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden="true"><i /><i /></div>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
        <nav className={styles.nav} aria-label="Group pages">
          {LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.navActive}` : styles.navLink)}>{label}</NavLink>
          ))}
        </nav>
      </header>

      <section className={styles.hero}>
        {image && <div className={styles.heroImage} style={{ backgroundImage: `url(${image})` }} aria-hidden="true" />}
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          {lead && <p className={styles.lead}>{lead}</p>}
        </div>
      </section>

      <div className={styles.body}>{children}</div>
    </div>
  );
}
