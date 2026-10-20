import { Link } from 'react-router-dom';
import hotels from '../data/hotels.json';
import homeConfig from '../data/home-config.json';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './GroupPage.module.css';

export default function PressPage() {
  const { group } = homeConfig;
  useDocumentTitle('Press & Media');

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
      </header>

      <div className={styles.content}>
        <p className={styles.eyebrow}>Press &amp; media</p>
        <h1>For the <em>press.</em></h1>

        <section className={styles.section}>
          <h2>News &amp; announcements</h2>
          <div className={styles.empty}>
            <p>Nothing published yet.</p>
            <p className={styles.emptySub}>Announcements from {group.name} will appear here.</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Brand information</h2>
          <p>
            {group.name} was founded in {group.foundedYear} and is headquartered in {group.headquarters}.
            The group curates two distinct properties — {hotels.map((h) => h.name).join(' and ')}.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Press contact</h2>
          <p>
            <a href={`mailto:${group.contact.email}?subject=Press inquiry`}>{group.contact.email}</a>
            {' · '}
            <a href={`tel:${group.contact.phone.replace(/\s/g, '')}`}>{group.contact.phone}</a>
          </p>
        </section>
      </div>
    </div>
  );
}