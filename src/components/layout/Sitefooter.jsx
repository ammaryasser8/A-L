import { Link } from 'react-router-dom';
import { useSectionLink } from '../../hooks/useSectionLink';
import styles from './SiteFooter.module.css';
import marisolLogo from '../../assets/marisol-logo.png';

const Arrow = () => <span className={styles.arrow} aria-hidden="true">↗</span>;

const links = [
  ['Stay', 'rooms'],
  ['Experiences', 'experiences'],
  ['Dining', 'dining'],
  ['Wellness', 'spa'],
  ['The resort', 'story'],
  ['Gallery', 'gallery'],
];

function MarisolMark() {
  return <img className={styles.marisolMark} src={marisolLogo} alt="" />;
}

export default function SiteFooter({ hotel }) {
  const hotelName = hotel?.name || 'Marisol Bay Resort';
  const hotelSlug = hotel?.slug || 'marisol-bay-resort';
  const legalBase = `/hotels/${hotelSlug}`;
  const goTo = useSectionLink(legalBase);
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.horizon} aria-hidden="true"><i /></div>

      <section className={styles.brandStage} aria-label="Marisol Bay Resort, part of AL Hospitality Group">
        <Link to="/" className={styles.alBrand}>
          <img src="/images/brand/al-logo.png" alt="AL Hospitality Group" />
          <span><small>The house behind</small>AL Hospitality Group</span>
        </Link>
        <div className={styles.relationship} aria-hidden="true"><i /><span>01</span><i /></div>
        <Link to={`/hotels/${hotelSlug}`} className={styles.marisolBrand}>
          <MarisolMark />
          <span><strong>Marisol</strong><small>Bay Resort · Red Sea</small></span>
        </Link>
      </section>

      <section className={styles.invitation}>
        <div>
          <p className={styles.eyebrow}>Sahl Hasheesh · Hurghada</p>
          <h2>Let the horizon<br /><em>stay with you.</em></h2>
        </div>
        <div className={styles.invitationCopy}>
          <p>Receive quiet notes on new seasons, table rituals, and days made for the water.</p>
          <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
            <label className={styles.srOnly} htmlFor="marisol-email">Email address</label>
            <input id="marisol-email" type="email" autoComplete="email" placeholder="Your email address" />
            <button type="submit" aria-label="Join the Marisol list">Join <Arrow /></button>
          </form>
          <small>Occasional correspondence. Always considered.</small>
        </div>
      </section>

      <section className={styles.navigation}>
        <div className={styles.address}>
          <MarisolMark />
          <p>{hotelName}</p>
          <span>{hotel?.address?.street}<br />{hotel?.address?.area}, {hotel?.address?.city}, Egypt</span>
          <a href={`tel:${hotel?.contact?.phone?.replace(/\s/g, '') || ''}`}>{hotel?.contact?.phone}</a>
          <a href={`mailto:${hotel?.contact?.email || ''}`}>{hotel?.contact?.email}</a>
        </div>
        <nav className={styles.linkGroup} aria-label="Explore Marisol">
          <p className={styles.eyebrow}>Explore</p>
          {links.map(([label, id]) => <button type="button" key={id} onClick={() => goTo(id)}>{label} <Arrow /></button>)}
        </nav>
        <nav className={styles.linkGroup} aria-label="AL Hospitality Group">
          <p className={styles.eyebrow}>AL Group</p>
          <Link to="/">The AL universe <Arrow /></Link>
          <Link to="/hotels/aurelia-grand-hotel">Aurelia Grand Hotel <Arrow /></Link>
          <Link to={`/hotels/${hotelSlug}`}>Marisol Bay Resort <Arrow /></Link>
        </nav>
        <div className={styles.concierge}>
          <p className={styles.eyebrow}>At your service</p>
          <h3>Every detail<br />has its tide.</h3>
          <button type="button" onClick={() => goTo('booking')}>Plan your stay <Arrow /></button>
        </div>
      </section>

      <div className={styles.bottom}>
        <span>© {year} Marisol Bay Resort · An AL Hospitality Group address</span>
        <div>
          <Link to={`${legalBase}/privacy-policy`}>Privacy</Link>
          <Link to={`${legalBase}/terms-of-use`}>Terms</Link>
          <Link to={`${legalBase}/cookie-policy`}>Cookies</Link>
        </div>
        <button type="button" className={styles.topButton} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button>
      </div>
    </footer>
  );
}
