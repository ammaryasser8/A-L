import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import marisolMark from '../../assets/marisol-logo.png';
import styles from './MarisolHeader.module.css';

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
        <span>Marisol Bay Resort · Sahl Hasheesh / Red Sea</span>
        <span className={styles.utilityRight}>
          <Link to="/">EN ⌄</Link>
          <Link to="/hotels/marisol-bay-resort#contact">Contact us</Link>
        </span>
      </div>
      <div className={styles.navRow}>
        <Link to="/" className={styles.alBrand} aria-label="AL Hospitality Group">
          <img src="/images/brand/al-logo.png" alt="" />
          <span>AL<br />Group</span>
        </Link>
        <i className={styles.divider} aria-hidden="true" />
        <Link to="/hotels/marisol-bay-resort" className={styles.logo}>
          <img src={marisolMark} alt="" />
          <span><strong>Marisol</strong><small>Bay Resort</small></span>
        </Link>
        <p className={styles.frequency}>COORDINATES / 27.188° N · 33.848° E</p>
        <button
          className={styles.bookBtn}
          data-cursor="RESERVE"
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
