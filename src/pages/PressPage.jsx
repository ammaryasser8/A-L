import hotels from '../data/hotels.json';
import homeConfig from '../data/home-config.json';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import GroupPageShell, { Reveal, Stat } from './GroupPageShell';
import styles from './GroupPage.module.css';

export default function PressPage() {
  const { group } = homeConfig;
  useDocumentTitle('Press & Media');

  return (
    <GroupPageShell eyebrow="Press & media" title={<>For the <em>press.</em></>} image="/images/products/101-1.jpg">
      <Reveal as="section" className={styles.section}>
        <h2>News &amp; announcements</h2>
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden="true">✦</span>
          <p>Nothing published yet.</p>
          <p className={styles.emptySub}>Announcements from {group.name} will appear here.</p>
        </div>
      </Reveal>

      <Reveal as="section" className={styles.section}>
        <h2>Brand information</h2>
        <p>
          {group.name} was founded in {group.foundedYear} and is headquartered in {group.headquarters}.
          The group curates two distinct properties — {hotels.map((h) => h.name).join(' and ')}.
        </p>
        <div className={styles.statRow}>
          <Stat value={group.foundedYear} label="Founded" />
          <Stat value={hotels.length} label="Properties" />
          <div className={styles.stat}><strong className={styles.statText}>{group.headquarters}</strong><span>Headquarters</span></div>
        </div>
      </Reveal>

      <Reveal as="section" className={styles.section}>
        <h2>Press contact</h2>
        <div className={styles.contactGrid}>
          <a className={styles.contactCard} href={`mailto:${group.contact.email}?subject=Press inquiry`}>
            <span>Email</span><strong>{group.contact.email}</strong><em>Write to us ↗</em>
          </a>
          <a className={styles.contactCard} href={`tel:${group.contact.phone.replace(/\s/g, '')}`}>
            <span>Phone</span><strong>{group.contact.phone}</strong><em>Call us ↗</em>
          </a>
        </div>
      </Reveal>
    </GroupPageShell>
  );
}
