import { useState } from 'react';
import { useSectionLink } from '../../hooks/useSectionLink';
import styles from './MarisolResortMap.module.css';

const HOTSPOTS = [
  { id: 'rooms', label: 'Rooms', x: 30, y: 35, blurb: 'Ocean-view rooms and suites along the shoreline.', sectionId: 'rooms' },
  { id: 'pool', label: 'Pools', x: 52, y: 22, blurb: 'Infinity pools facing open water.', sectionId: 'rooms' },
  { id: 'beach', label: 'Beach', x: 70, y: 55, blurb: 'Private beachfront, steps from the water.', sectionId: 'rooms' },
  { id: 'restaurant', label: 'Restaurants', x: 40, y: 62, blurb: 'Coastal dining, indoors and by the sea.', sectionId: 'dining' },
  { id: 'spa', label: 'Spa', x: 62, y: 74, blurb: 'A quiet wing built for water, stone, and rest.', sectionId: 'spa' },
  { id: 'activities', label: 'Activities', x: 20, y: 68, blurb: 'Water sports, yoga, and guided experiences.', sectionId: 'experiences' },
];

const HOTEL_PATH = '/hotels/marisol-bay-resort';

export default function MarisolResortMap() {
  const [active, setActive] = useState(null);
  const goTo = useSectionLink(HOTEL_PATH);

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <span className={styles.eyebrow}>Explore the Resort</span>
        <h2>Discover the perfect spot for your stay</h2>
      </div>

      <div className={styles.mapWrap}>
        <svg viewBox="0 0 100 100" className={styles.mapSvg} preserveAspectRatio="none">
          <path
            d="M8,40 C5,20 25,5 50,8 C75,10 95,15 92,45 C90,70 70,92 45,90 C20,88 10,65 8,40 Z"
            className={styles.landShape}
          />
          <path
            d="M0,50 C15,45 30,55 50,50 C70,45 85,55 100,50"
            className={styles.waterLine}
          />
        </svg>

        {HOTSPOTS.map((h) => (
          <button
            key={h.id}
            type="button"
            className={active === h.id ? `${styles.hotspot} ${styles.hotspotActive}` : styles.hotspot}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            onClick={() => setActive(active === h.id ? null : h.id)}
            aria-label={h.label}
          >
            <span className={styles.pulse} />
          </button>
        ))}

        {active && (
          <HotspotPanel
            spot={HOTSPOTS.find((h) => h.id === active)}
            onNavigate={(sectionId) => {
              goTo(sectionId);
              setActive(null);
            }}
          />
        )}
      </div>
    </section>
  );
}

function HotspotPanel({ spot, onNavigate }) {
  return (
    <div className={styles.panel} style={{ left: `${spot.x}%`, top: `${spot.y}%` }}>
      <h4>{spot.label}</h4>
      <p>{spot.blurb}</p>
      <button type="button" onClick={() => onNavigate(spot.sectionId)}>
        View {spot.label} →
      </button>
    </div>
  );
}
