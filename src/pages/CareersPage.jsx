import { Link } from 'react-router-dom';
import homeConfig from '../data/home-config.json';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './GroupPage.module.css';

export default function CareersPage() {
  const { group } = homeConfig;
  useDocumentTitle('Careers');

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
      </header>

      <div className={styles.content}>
        <p className={styles.eyebrow}>Careers</p>
        <h1>Life at <em>AL.</em></h1>
        <p className={styles.lead}>
          {group.name} is built by the people who look after every arrival, every table, every
          quiet detail across {group.headquarters} and the Red Sea coast. We hire for care,
          precision and warmth — the same standard we hold our two hotels to.
        </p>

        <section className={styles.section}>
          <h2>Open positions</h2>
          {/* No real openings exist in this project's data — an honest
              empty state, not an invented job board. */}
          <div className={styles.empty}>
            <p>No open positions right now.</p>
            <p className={styles.emptySub}>Check back soon, or send us a speculative note below.</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Apply speculatively</h2>
          <p>
            Tell us about yourself at{' '}
            <a href={`mailto:${group.contact.email}?subject=Speculative application`}>{group.contact.email}</a>.
          </p>
        </section>
      </div>
    </div>
  );
}