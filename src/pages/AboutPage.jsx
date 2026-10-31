import { Link } from 'react-router-dom';
import hotels from '../data/hotels.json';
import homeConfig from '../data/home-config.json';
import { useDocumentTitle, useMetaDescription } from '../hooks/useDocumentTitle';
import GroupPageShell, { Reveal, Stat } from './GroupPageShell';
import styles from './GroupPage.module.css';

const WORLD_IMAGE = { 'aurelia-grand-hotel': '/images/products/7-1.jpg', 'marisol-bay-resort': '/images/products/101-1.jpg' };

export default function AboutPage() {
  const { group } = homeConfig;
  useDocumentTitle('About');
  useMetaDescription(group.description);
  const yearsActive = new Date().getFullYear() - group.foundedYear;

  return (
    <GroupPageShell eyebrow="About us" title={<>Two addresses.<br />One <em>philosophy.</em></>} lead={group.description} image="/images/products/7-1.jpg">
      <Reveal className={styles.statRow}>
        <Stat value={group.foundedYear} label="Founded" />
        <Stat value={yearsActive} label="Years of hospitality" />
        <Stat value={hotels.length} label="Destinations" />
      </Reveal>

      <Reveal as="section" className={styles.section}>
        <h2>Where we began</h2>
        <p>{group.headquarters} is where AL Hospitality Group calls home — and where the idea for two very different hotels, held to one standard, first took shape.</p>
      </Reveal>

      <div className={styles.worlds}>
        {hotels.map((hotel, index) => (
          <Reveal key={hotel.id} delay={index * 140}>
            <Link to={`/hotels/${hotel.slug}`} className={`${styles.world} ${index === 0 ? styles.worldWine : styles.worldTeal}`}>
              <span className={styles.worldImage} style={{ backgroundImage: `url(${WORLD_IMAGE[hotel.slug]})` }} aria-hidden="true" />
              <span className={styles.worldShade} aria-hidden="true" />
              <span className={styles.worldBody}>
                <span className={styles.eyebrow}>{hotel.shortName}</span>
                <h3>{hotel.tagline}</h3>
                <p>{hotel.description}</p>
                <em>Discover {hotel.shortName} ↗</em>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal as="section" className={styles.section}>
        <h2>Get in touch</h2>
        <div className={styles.contactGrid}>
          <a className={styles.contactCard} href={`mailto:${group.contact.email}`}><span>Email</span><strong>{group.contact.email}</strong><em>Write to us ↗</em></a>
          <a className={styles.contactCard} href={`tel:${group.contact.phone.replace(/\s/g, '')}`}><span>Phone</span><strong>{group.contact.phone}</strong><em>Call us ↗</em></a>
        </div>
      </Reveal>
    </GroupPageShell>
  );
}
