import { useReveal } from '../../hooks/useReveal';
import styles from './MarisolHighlights.module.css';

const HIGHLIGHTS = [
  ['01', 'Minimalist Design', 'Warm stone, clean lines, no excess.', '/images/sections/marisol-highlight-design.jpg'],
  ['02', 'Infinity Views', 'The horizon is always in the room.', '/images/sections/marisol-highlight-views.jpg'],
  ['03', 'Exquisite Dining', 'Coastal plates with a little theatre.', '/images/sections/marisol-highlight-dining.jpg'],
  ['04', 'Holistic Spa', 'A slower tempo for body and mind.', '/images/sections/marisol-highlight-spa.jpg'],
];

export default function MarisolHighlights() {
  const [sectionRef, visible] = useReveal();
  return (
    <section ref={sectionRef} className={`${styles.section} ${visible ? styles.visible : ''}`}>
      <div className={styles.head}><span>Marisol, in four movements</span><h2>Not just a stay.<br /><em>A state of mind.</em></h2></div>
      <div className={styles.grid}>
        {HIGHLIGHTS.map(([number, title, text, media], index) => (
          <article className={`${styles.card} ${index === 0 ? styles.featured : ''}`} key={title}>
            <div className={styles.image} style={{ backgroundImage: `url(${media})` }} />
            <div className={styles.wash} />
            <span className={styles.number}>{number}</span>
            <div className={styles.copy}><h3>{title}</h3><p>{text}</p><span className={styles.arrow}>↗</span></div>
          </article>
        ))}
      </div>
    </section>
  );
}
