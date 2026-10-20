import { Link } from 'react-router-dom';
import hotels from '../data/hotels.json';
import homeConfig from '../data/home-config.json';
import { useDocumentTitle, useMetaDescription } from '../hooks/useDocumentTitle';
import styles from './GroupPage.module.css';

export default function AboutPage() {
  const { group } = homeConfig;
  useDocumentTitle('About');
  useMetaDescription(group.description);
  const yearsActive = new Date().getFullYear() - group.foundedYear;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
      </header>

      <div className={styles.content}>
        <p className={styles.eyebrow}>About us</p>
        <h1>Two addresses.<br />One <em>philosophy.</em></h1>
        <p className={styles.lead}>{group.description}</p>

        <div className={styles.statRow}>
          <div><strong>{group.foundedYear}</strong><span>Founded</span></div>
          <div><strong>{yearsActive}</strong><span>Years of hospitality</span></div>
          <div><strong>{hotels.length}</strong><span>Destinations</span></div>
        </div>

        <section className={styles.section}>
          <h2>Where we began</h2>
          <p>{group.headquarters} is where AL Hospitality Group calls home — and where the idea for two very different hotels, held to one standard, first took shape.</p>
        </section>

        <div className={styles.worlds}>
          {hotels.map((hotel) => (
            <article key={hotel.id} className={styles.world}>
              <p className={styles.eyebrow}>{hotel.shortName}</p>
              <h3>{hotel.tagline}</h3>
              <p>{hotel.description}</p>
              <Link to={`/hotels/${hotel.slug}`}>Discover {hotel.shortName} ↗</Link>
            </article>
          ))}
        </div>

        <section className={styles.section}>
          <h2>Get in touch</h2>
          <p>
            <a href={`mailto:${group.contact.email}`}>{group.contact.email}</a>
            {' · '}
            <a href={`tel:${group.contact.phone.replace(/\s/g, '')}`}>{group.contact.phone}</a>
          </p>
        </section>
      </div>
    </div>
  );
}