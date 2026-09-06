import styles from './CategoryTabs.module.css';

export default function CategoryTabs({ categories, active, onChange, variant = 'light' }) {
  const allTabs = ['All', ...categories];
  const wrapClass = variant === 'dark' ? `${styles.tabs} ${styles.dark}` : styles.tabs;

  return (
    <div className={wrapClass}>
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