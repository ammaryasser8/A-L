import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import marisolMark from '../../assets/marisol-logo.png';
import { useAuth } from '../../hooks/useAuth';
import styles from './MarisolHeader.module.css';
import accountStyles from './HotelAccountControls.module.css';
import ProfileAvatar from '../account/ProfileAvatar';

const HOTEL_PATH = '/hotels/marisol-bay-resort';

export default function MarisolHeader() {
  const [solid, setSolid] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, session } = useAuth();
  const guestName = [session?.firstName, session?.lastName].filter(Boolean).join(' ') || 'Account';

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 42);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openAtlas = () => window.dispatchEvent(new Event('marisol-menu-toggle'));
  const reserve = () => {
    const booking = document.getElementById('booking');
    if (booking) booking.scrollIntoView({ behavior: 'smooth', block: 'center' });
    else navigate(`${HOTEL_PATH}#booking`);
  };

  return (
    <header className={`${styles.header} ${solid ? styles.solid : ''}`}>
      <div className={styles.utilityBar}>
        <span>AL Hospitality Group / The Red Sea frequency</span>
        <span>27.188° N · 33.848° E · Sahl Hasheesh</span>
      </div>
      <div className={styles.navRow}>
        <Link to="/" className={styles.brandPair} aria-label="AL Hospitality Group and Marisol Bay Resort">
          <span className={styles.alBrand}><img src="/images/brand/al-logo.png" alt="" /><small>AL</small></span>
          <i className={styles.divider} aria-hidden="true" />
          <span className={styles.marisolBrand}><img src={marisolMark} alt="" /><span><strong>Marisol</strong><small>Bay Resort</small></span></span>
        </Link>
        <nav className={styles.links} aria-label="Marisol navigation">
          <Link to={HOTEL_PATH}>The resort</Link>
          <Link to={`${HOTEL_PATH}/collection/stays`}>Stays</Link>
          <Link to={`${HOTEL_PATH}/collection/dining`}>Dining</Link>
          <Link to={`${HOTEL_PATH}/collection/wellness`}>Wellness</Link>
        </nav>
        <div className={styles.actions}>
          <Link className={accountStyles.searchBtn} to="/search" aria-label="Search AL Hospitality Group"><Search size={17} strokeWidth={1.35} /></Link>
          <Link className={accountStyles.accountLink} to={isAuthenticated ? '/account' : '/login'} aria-label={isAuthenticated ? `Open ${guestName}'s account` : 'Sign in'}>
            {isAuthenticated ? <><ProfileAvatar user={session} size="compact" /><i aria-hidden="true" /><span className={accountStyles.accountName}>{guestName}</span></> : 'Sign in'}
          </Link>
          <button type="button" className={styles.atlasBtn} onClick={openAtlas} data-cursor="MENU" aria-label="Open Marisol atlas"><Menu size={17} strokeWidth={1.35} /><span>Atlas</span></button>
          <button className={styles.bookBtn} data-cursor="RESERVE" onClick={reserve}>Reserve</button>
        </div>
      </div>
    </header>
  );
}
