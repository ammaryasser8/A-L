import { Link } from 'react-router-dom';
import { useSectionLink } from '../../hooks/useSectionLink';
import styles from './AureliaFooter.module.css';

const Arrow = () => <span className={styles.arrow} aria-hidden="true">↗</span>;
const chapters = [['The hotel', 'about'], ['Rooms & suites', 'rooms'], ['Dining', 'dining'], ['Wellness', 'wellness'], ['Plan a stay', 'booking']];

export default function AureliaFooter({ hotel }) {
  const hotelSlug = hotel?.slug || 'aurelia-grand-hotel';
  const legalBase = `/hotels/${hotelSlug}`;
  const goTo = useSectionLink(legalBase);
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.topLine} aria-hidden="true"><i /></div>
      <section className={styles.brandStage} aria-label="Aurelia Grand Hotel, part of AL Hospitality Group">
        <Link to="/" className={styles.alBrand}><img src="/images/brand/al-logo.png" alt="AL Hospitality Group" /><span><small>The house behind</small>AL Hospitality Group</span></Link>
        <div className={styles.relationship} aria-hidden="true"><i /><span>01</span><i /></div>
        <Link to={`/hotels/${hotelSlug}`} className={styles.aureliaBrand}><img src="/images/aurelia/logo.png" alt="Aurelia Grand Hotel" /><span><strong>Aurelia</strong><small>Grand Hotel · Cairo</small></span></Link>
      </section>
      <section className={styles.invitation}>
        <div><p className={styles.eyebrow}>Garden City · Cairo</p><h2>Make room for<br /><em>the remarkable.</em></h2></div>
        <div className={styles.invitationCopy}><p>Letters from a grand address: seasonal tables, considered stays and the rituals that make a city feel personal.</p><form className={styles.form} onSubmit={(event) => event.preventDefault()}><label className={styles.srOnly} htmlFor="aurelia-email">Email address</label><input id="aurelia-email" type="email" autoComplete="email" placeholder="Your email address" /><button type="submit" aria-label="Join the Aurelia list">Join <Arrow /></button></form><small>Private correspondence, sent with intention.</small></div>
      </section>
      <section className={styles.navigation}>
        <div className={styles.address}><img src="/images/aurelia/logo.png" alt="" /><p>{hotel?.name || 'Aurelia Grand Hotel'}</p><span>{hotel?.address?.street}<br />{hotel?.address?.area}, {hotel?.address?.city}, Egypt</span><a href={`tel:${hotel?.contact?.phone?.replace(/\s/g, '') || ''}`}>{hotel?.contact?.phone}</a><a href={`mailto:${hotel?.contact?.email || ''}`}>{hotel?.contact?.email}</a></div>
        <nav className={styles.linkGroup} aria-label="Explore Aurelia"><p className={styles.eyebrow}>Explore</p>{chapters.map(([label, id]) => <button key={id} type="button" onClick={() => goTo(id)}>{label} <Arrow /></button>)}</nav>
        <nav className={styles.linkGroup} aria-label="AL Hospitality Group"><p className={styles.eyebrow}>AL Group</p><Link to="/">The AL universe <Arrow /></Link><Link to="/hotels/marisol-bay-resort">Marisol Bay Resort <Arrow /></Link><Link to={`/hotels/${hotelSlug}`}>Aurelia Grand Hotel <Arrow /></Link></nav>
        <div className={styles.concierge}><p className={styles.eyebrow}>At your service</p><h3>Every arrival<br />begins in <em>gold.</em></h3><button type="button" onClick={() => goTo('booking')}>Plan your stay <Arrow /></button></div>
      </section>
      <div className={styles.bottom}><span>© {year} Aurelia Grand Hotel · An AL Hospitality Group address</span><div><Link to={`${legalBase}/privacy-policy`}>Privacy</Link><Link to={`${legalBase}/terms-of-use`}>Terms</Link><Link to={`${legalBase}/cookie-policy`}>Cookies</Link></div><button type="button" className={styles.topButton} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button></div>
    </footer>
  );
}
