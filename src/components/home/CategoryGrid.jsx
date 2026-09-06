import styles from './CategoryGrid.module.css';

export default function CategoryGrid({ categories }) {
  return (
    <section className={`wrap ${styles.section}`}>
      <div className={styles.head}>
        <h2>One membership, every category</h2>
        <p>Whichever address you choose, these categories are consistent across both hotels.</p>
      </div>

      <div className={styles.grid}>
        {categories.map((cat) => (
          <div key={cat.label} className={styles.tile}>
            <div className={styles.dot} />
            <h3>{cat.label}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}