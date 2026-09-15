import { Link } from 'react-router-dom';
import styles from './GroupFooter.module.css';

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function GroupFooter({ group, hotels, categories }) {
  const currentYear = new Date().getFullYear();
  const hotelLinks = hotels.map((hotel) => ({ label: hotel.name, to: `/hotels/${hotel.slug}` }));

  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.topLine} />
      <div className={styles.signature}>
        <img src="/images/brand/al-logo.png" alt="AL Hospitality Group" />
        <p>Two worlds. One extraordinary measure of care.</p>
        <a href="#top" className={styles.return}>Return to the beginning <Arrow /></a>
      </div>

      <div className={styles.main}>
        <div className={styles.statement}>
          <p className={styles.eyebrow}>A private invitation</p>
          <h2>Stay closer<br />to the <em>exceptional.</em></h2>
          <p>Join the AL Circle for considered offers, seasonal stories, and first word from our two addresses.</p>
          <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
            <label hidden htmlFor="al-email">Email address</label>
            <input id="al-email" type="email" placeholder="Your email address" autoComplete="email" aria-label="Email address" />
            <button type="submit" aria-label="Register interest">→</button>
          </form>
          <small>We only write when there is something worth sharing.</small>
        </div>

        <div className={styles.links}>
          <section><p className={styles.eyebrow}>The collection</p>{hotelLinks.map((link) => <Link key={link.to} to={link.to}>{link.label} <Arrow /></Link>)}</section>
          <section><p className={styles.eyebrow}>Discover</p><a href="#experiences">Experiences <Arrow /></a><a href="#stays">Rooms & suites <Arrow /></a><a href="#journey">Plan your journey <Arrow /></a></section>
          <section><p className={styles.eyebrow}>At your service</p><a href={`mailto:${group.contact.email}`}>{group.contact.email} <Arrow /></a><a href={`tel:${group.contact.phone.replace(/\s/g, '')}`}>{group.contact.phone} <Arrow /></a><span>{group.headquarters}</span></section>
        </div>
      </div>

      <div className={styles.categoryRail} aria-label="Available experiences">
        {categories.map((category) => <span key={category.label}>{category.label}</span>)}
      </div>
      <div className={styles.bottom}>
        <span>© {currentYear} {group.name}</span>
        <span>Crafted in Egypt</span>
        <a href="#top">Privacy &amp; terms</a>
        <a href="#top" className={styles.topButton} aria-label="Back to top">↑</a>
      </div>
    </footer>
  );
}
