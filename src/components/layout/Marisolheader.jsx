import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './MarisolHeader.module.css';

const NAV_LINKS = [
  { label: 'The Resort', to: '#' },
  { label: 'Accommodation', to: '#rooms' },
  { label: 'Dining', to: '#' },
  { label: 'Spa', to: '#' },
  { label: 'Experiences', to: '#' },
  { label: 'Offers', to: '#' },
];

export default function MarisolHeader() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    function onScroll() {
      setSolid(window.scrollY > 60);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={solid ? `${styles.header} ${styles.solid}` : styles.header}>
      <div className={styles.utilityBar}>
        <span>Exclusive offer — up to 20% off your summer escape</span>
        <span className={styles.utilityRight}>
          <Link to="/">EN ⌄</Link>
          <span>Contact us</span>
        </span>
      </div>
      <div className={styles.navRow}>
        <Link to="/hotels/marisol-bay-resort" className={styles.logo}>
          Marisol <span>Bay</span>
        </Link>
        <nav className={styles.links}>
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.to}>
              {link.label}
            </a>
          ))}
        </nav>
        <button className={styles.bookBtn}>Book now</button>
      </div>
    </header>
  );
}