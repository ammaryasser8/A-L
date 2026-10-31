import homeConfig from '../data/home-config.json';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import GroupPageShell, { Reveal } from './GroupPageShell';
import styles from './GroupPage.module.css';

const VALUES = [
  { icon: '♡', title: 'Care', text: 'For every arrival, every table, every quiet detail.' },
  { icon: '◈', title: 'Precision', text: 'The small things done right, every single time.' },
  { icon: '✦', title: 'Warmth', text: 'The same standard we hold our two hotels to.' },
];

export default function CareersPage() {
  const { group } = homeConfig;
  useDocumentTitle('Careers');

  return (
    <GroupPageShell
      eyebrow="Careers"
      title={<>Life at <em>AL.</em></>}
      lead={`${group.name} is built by the people who look after every arrival, every table, every quiet detail across ${group.headquarters} and the Red Sea coast. We hire for care, precision and warmth — the same standard we hold our two hotels to.`}
      image="/images/products/7-1.jpg"
    >
      <div className={styles.valueGrid}>
        {VALUES.map((value, index) => (
          <Reveal key={value.title} delay={index * 120} className={styles.valueCard}>
            <span className={styles.valueIcon} aria-hidden="true">{value.icon}</span>
            <h3>{value.title}</h3>
            <p>{value.text}</p>
          </Reveal>
        ))}
      </div>

      <Reveal as="section" className={styles.section}>
        <h2>Open positions</h2>
        {/* No real openings exist in this project's data — an honest
            empty state, not an invented job board. */}
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden="true">✦</span>
          <p>No open positions right now.</p>
          <p className={styles.emptySub}>Check back soon, or send us a speculative note below.</p>
        </div>
      </Reveal>

      <Reveal as="section" className={styles.section}>
        <h2>Apply speculatively</h2>
        <a className={styles.contactCard} href={`mailto:${group.contact.email}?subject=Speculative application`}>
          <span>Tell us about yourself</span><strong>{group.contact.email}</strong><em>Send a note ↗</em>
        </a>
      </Reveal>
    </GroupPageShell>
  );
}
