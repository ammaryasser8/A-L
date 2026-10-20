import styles from './GroupExperience.module.css';

export default function ConstellationSection({ sharedCategories }) {
  const items = sharedCategories.slice(0, 6);
  return (
    <section className={styles.constellation} aria-labelledby="constellation-title">
      <p className={styles.eyebrow}>A universe of considered moments</p>
      <h2 id="constellation-title">Everything begins<br />around <em>AL.</em></h2>
      <div className={styles.orbitField} data-orbit-field>
        <div className={styles.orbitLine} aria-hidden="true" /><div className={styles.orbitLineSmall} aria-hidden="true" />
        <svg className={styles.orbitLines} data-orbit-lines aria-hidden="true">
          {items.map((category, index) => <line key={category.label} data-orbit-line-to={index} x1="0" y1="0" x2="0" y2="0" />)}
        </svg>
        <span className={styles.orbitCore} data-orbit-core>AL</span>
        {items.map((category, index) => <a data-orbit data-cursor="Enter" key={category.label} className={`${styles.orbitItem} ${styles[`orbit${index + 1}`]}`} href="#experiences">{category.label}<i>↗</i></a>)}
      </div>
      <p className={styles.constellationNote}>Move through the collection by following the moments that call to you.</p>
    </section>
  );
}