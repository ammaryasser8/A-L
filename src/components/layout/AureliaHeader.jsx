import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ProfileAvatar from '../account/ProfileAvatar';
import styles from './AureliaHeader.module.css';

const HOTEL_PATH = '/hotels/aurelia-grand-hotel';

export default function AureliaHeader({ onMenuClick }) {
  const [solid, setSolid] = useState(false);
  const { isAuthenticated, session } = useAuth();
  const guestName = [session?.firstName, session?.lastName].filter(Boolean).join(' ') || 'Account';

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className={solid ? `${styles.header} ${styles.solid}` : styles.header}>
      <div className={styles.utilityBar}>
        <span>Aurelia Grand Hotel · Cairo, Egypt</span>
        <span className={styles.utilityRight}>
          <Link to="/">AL Hospitality Group</Link>
          <button type="button" onClick={() => scrollToSection('about')}>About Aurelia</button>
        </span>
      </div>

      <div className={styles.navRow}>
        <Link to={HOTEL_PATH} className={styles.logo} aria-label="Aurelia Grand Hotel, part of AL Hospitality Group">
          <img src="/images/brand/al-logo.png" alt="AL Hospitality Group" className={styles.alMark} />
          <span className={styles.logoDivider} aria-hidden="true" />
          <img src="/images/aurelia/logo.png" alt="Aurelia Grand Hotel" className={styles.aureliaMark} />
        </Link>

        <nav className={styles.links} aria-label="Aurelia navigation">
          <Link to={HOTEL_PATH}>Home</Link>
          <button type="button" onClick={() => scrollToSection('rooms')}>Stays</button>
          <button type="button" onClick={() => scrollToSection('dining')}>Dining</button>
          <button type="button" onClick={() => scrollToSection('wellness')}>Wellness</button>
        </nav>

        <div className={styles.actions}>
          <Link className={styles.searchBtn} to="/search" aria-label="Search AL Hospitality Group"><Search size={17} strokeWidth={1.35} /></Link>
          <Link className={styles.accountLink} to={isAuthenticated ? '/account' : '/login'} aria-label={isAuthenticated ? `Open ${guestName}'s account` : 'Sign in'}>
            {isAuthenticated ? <><ProfileAvatar user={session} size="compact" /><i aria-hidden="true" /><span className={styles.accountName}>{guestName}</span></> : 'Sign in'}
          </Link>
          <button className={styles.menuBtn} type="button" onClick={onMenuClick} aria-label="Open Aurelia archive"><Menu size={18} strokeWidth={1.35} /><span>Archive</span></button>
          <button className={styles.bookBtn} type="button" onClick={() => scrollToSection('booking')}>Reserve</button>
        </div>
      </div>
    </header>
  );
}
