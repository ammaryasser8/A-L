import styles from './CategoryTabs.module.css';

export default function CategoryTabs({ categories, active, onChange }) {
  const allTabs = ['All', ...categories];

  return (
    <div className={styles.tabs}>
      {allTabs.map((cat) => (
        <button
          key={cat}
          className={cat === active ? `${styles.tab} ${styles.active}` : styles.tab}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}