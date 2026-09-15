import { useState } from 'react';
import { ArrowUpRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHotelProducts } from '../../hooks/useHotelProducts';
import { useReveal } from '../../hooks/useReveal';
import styles from './MarisolStayCollection.module.css';

export default function MarisolStayCollection({ hotel }) {
  const rooms = useHotelProducts(hotel?.id, 'Rooms').slice(0, 3);
  const suites = useHotelProducts(hotel?.id, 'Suites').slice(0, 3);
  const stays = [...rooms, ...suites];
  const [activeIndex, setActiveIndex] = useState(0);
  const [sectionRef, visible] = useReveal();

  if (!stays.length) return null;
  const activeStay = stays[activeIndex];

  return (
    <section ref={sectionRef} id="rooms" className={`${styles.section} ${visible ? styles.visible : ''}`}>
      <div className={styles.topline}><span>Stays / 01</span><i /><span>Choose your horizon</span></div>
      <div className={styles.heading}><h2>Every room holds<br /><em>a different morning.</em></h2><p>Not a catalogue. A small collection of atmospheres, waiting for the one that feels like yours.</p></div>
      <div className={styles.stayStudio}>
        <div className={styles.canvas}>
          <div className={styles.photo} key={activeStay.id} style={{ backgroundImage: `url(/${activeStay.images[0]})` }} />
          <div className={styles.photoWash} />
          <span className={styles.canvasTag}>Marisol selected stay / {String(activeIndex + 1).padStart(2, '0')}</span>
          <div className={styles.activeDetails}>
            <span>{activeStay.category}</span>
            <h3>{activeStay.title}</h3>
            <p><Users size={14} /> Up to {activeStay.capacity} guests <i /> {activeStay.size} m²</p>
            <Link to={`/hotels/${hotel.slug}/product/${activeStay.slug}`}>Enter this stay <ArrowUpRight size={16} /></Link>
          </div>
        </div>
        <div className={styles.chooser}>
          <div className={styles.chooserHead}><span>Room index</span><b>{String(activeIndex + 1).padStart(2, '0')} / {String(stays.length).padStart(2, '0')}</b></div>
          <div className={styles.options}>
            {stays.map((stay, index) => (
              <button type="button" key={stay.id} className={activeIndex === index ? styles.selected : ''} onClick={() => setActiveIndex(index)} data-cursor="VIEW">
                <small>{String(index + 1).padStart(2, '0')}</small><span>{stay.title}</span><i />
              </button>
            ))}
          </div>
          <p className={styles.chooserNote}>Move through the collection. The light changes with every choice.</p>
          <Link to={`/hotels/${hotel.slug}/collection/stays`} className={styles.allStays}>View all rooms & suites <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </section>
  );
}
