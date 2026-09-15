import { useEffect, useState } from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { useSectionLink } from '../../hooks/useSectionLink';
import styles from './MarisolSidebar.module.css';

const CHAPTERS = [
  ['Arrival', 'hero'],
  ['The tide', 'story'],
  ['Stays', 'rooms'],
  ['Dining', 'dining'],
  ['Wellness', 'spa'],
  ['Experiences', 'experiences'],
  ['Gallery', 'gallery'],
];

export default function MarisolSidebar() {
  const goTo = useSectionLink('/hotels/marisol-bay-resort');
  const [current, setCurrent] = useState('hero');

  useEffect(() => {
    const sections = CHAPTERS
      .map(([, id]) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const nearest = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (nearest?.target.id) setCurrent(nearest.target.id);
      },
      { rootMargin: '-35% 0px -48% 0px', threshold: [0.04, 0.22, 0.55] }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <aside className={styles.rail} aria-label="Marisol chapters">
      <div className={styles.top}><span className={styles.orbit}><Sparkles size={13} /></span><i /></div>
      <nav>
        {CHAPTERS.map(([label, id], index) => (
          <button
            key={id}
            type="button"
            className={current === id ? styles.active : ''}
            onClick={() => {
              setCurrent(id);
              goTo(id);
            }}
            data-cursor={label.toUpperCase()}
          >
            <small>{String(index + 1).padStart(2, '0')}</small><span>{label}</span><i />
          </button>
        ))}
      </nav>
      <button className={styles.compass} type="button" onClick={() => goTo('booking')} aria-label="Plan a Marisol stay" data-cursor="PLAN"><Compass size={18} /><span>Plan</span></button>
    </aside>
  );
}
