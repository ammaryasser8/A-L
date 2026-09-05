import styles from './MarisolHighlights.module.css';

const HIGHLIGHTS = [
  { title: 'Minimalist Design', text: 'Timeless spaces with elegant simplicity.' },
  { title: 'Infinity Views', text: 'Breathtaking ocean and skyline views.' },
  { title: 'Exquisite Dining', text: 'A culinary journey like no other.' },
  { title: 'Holistic Spa', text: 'Rejuvenate your body, mind, and soul.' },
];

export default function MarisolHighlights() {
  return (
    <section className={styles.grid}>
      {HIGHLIGHTS.map((h) => (
        <div key={h.title} className={styles.card}>
          <div className={styles.image} />
          <div className={styles.text}>
            <h3>{h.title}</h3>
            <p>{h.text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}