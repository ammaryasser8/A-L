import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './MarisolHeader.module.css';

const NAV_LINKS = [
  { label: 'The Resort', to: '/hotels/marisol-bay-resort#story' },
  { label: 'Accommodation', to: '/hotels/marisol-bay-resort#rooms' },
  { label: 'Dining', to: '/hotels/marisol-bay-resort#dining' },
  { label: 'Spa', to: '/hotels/marisol-bay-resort#spa' },
  { label: 'Experiences', to: '/hotels/marisol-bay-resort#experiences' },
  { label: 'Gallery', to: '/hotels/marisol-bay-resort#gallery' },
];

export default function MarisolHeader() {
  const [solid, setSolid] = useState(false);
  const navigate = useNavigate();

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
          <Link to="/hotels/marisol-bay-resort#contact">Contact us</Link>
        </span>
      </div>
      <div className={styles.navRow}>
        <Link to="/hotels/marisol-bay-resort" className={styles.logo}>
          Marisol <span>Bay</span>
        </Link>
        <nav className={styles.links}>
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          className={styles.bookBtn}
          onClick={() => {
            const booking = document.getElementById('booking');
            if (booking) booking.scrollIntoView({ behavior: 'smooth', block: 'center' });
            else navigate('/hotels/marisol-bay-resort#booking');
          }}
        >
          Book now
        </button>
      </div>
    </header>
  );
}
