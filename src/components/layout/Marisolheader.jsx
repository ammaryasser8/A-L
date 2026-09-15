import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSectionLink } from '../../hooks/useSectionLink';
import { useMagnetic } from '../../hooks/useMagnetic';
import marisolLogo from '../../assets/marisol-logo.png';
import styles from './MarisolHeader.module.css';

const HOTEL_PATH = '/hotels/marisol-bay-resort';

// Every link below now points to a real section on the page.
const NAV_LINKS = [
  { label: 'Home', id: 'hero' },
  { label: 'Accommodations', id: 'rooms' },
  { label: 'Experiences', id: 'experiences' },
  { label: 'Dining', id: 'dining' },
  { label: 'Gallery', id: 'gallery' },
  { label: 'About', id: 'story' },
];

export default function MarisolHeader() {
  const [solid, setSolid] = useState(false);
  const goTo = useSectionLink(HOTEL_PATH);
  const magneticBookBtn = useMagnetic(10);

  useEffect(() => {
    function onScroll() {
      setSolid(window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={solid ? `${styles.header} ${styles.solid}` : styles.header}>
      <div className={styles.navRow}>
        <div className={styles.brandCluster}>
          <Link to="/" className={styles.alLink} aria-label="AL Hospitality Group">
            <img src="/images/brand/al-logo.png" alt="" />
            <span>AL<br />Group</span>
          </Link>
          <span className={styles.brandRule} aria-hidden="true" />
          <Link to={HOTEL_PATH} className={styles.logo} aria-label="Marisol Bay Resort home">
            <img className={styles.marisolMark} src={marisolLogo} alt="" />
            <span className={styles.logoText}>
              <span className={styles.logoMain}>Marisol</span>
              <span className={styles.logoSub}>Bay Resort</span>
            </span>
          </Link>
        </div>

        <nav className={styles.links}>
          {NAV_LINKS.map((link, i) => (
            <button
              key={link.label}
              type="button"
              style={{ '--i': i }}
              onClick={() => goTo(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button ref={magneticBookBtn} className={styles.bookBtn} onClick={() => goTo('booking')}>
          Reserve a stay
        </button>
      </div>
    </header>
  );
}
