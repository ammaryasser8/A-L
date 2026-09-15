import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ChevronRight, Maximize2, Users } from 'lucide-react';
import { motion } from 'motion/react';
import products from '../data/products.json';
import { useHotelBySlug } from '../hooks/useHotelBySlug';
import MarisolHeader from '../components/layout/Marisolheader';
import MarisolSidebar from '../components/layout/MarisolSidebar';
import SiteFooter from '../components/layout/Sitefooter';
import MarisolCursor from '../components/ui/MarisolCursor';
import NotFoundPage from './NotFoundPage';
import styles from './MarisolCollectionPage.module.css';

const MARISOL_COLLECTIONS = [
  { slug: 'stays', category: 'Rooms', label: 'Rooms', title: 'Rooms made for the horizon.', note: 'Sunlight, open water and a quiet place to return to.' },
  { slug: 'suites', category: 'Suites', label: 'Suites', title: 'A little more of the sea.', note: 'Spacious private worlds for days that unfold slowly.' },
  { slug: 'pools', category: 'Pools', label: 'Pools', title: 'Meet the water halfway.', note: 'Blue edges, long afternoons and a view with no end.' },
  { slug: 'dining', category: 'Restaurants', label: 'Dining', title: 'The coastline, on your table.', note: 'Every table has its own hour, its own mood and its own horizon.' },
  { slug: 'wellness', category: 'Spa & Wellness', label: 'Wellness', title: 'Return to your rhythm.', note: 'Treatments, breath and stillness shaped by the sea.' },
  { slug: 'shoreline', category: 'Beach & Leisure', label: 'Shoreline', title: 'There is time by the water.', note: 'Cabana days and golden hours belong entirely to you.' },
  { slug: 'gatherings', category: 'Events & Meetings', label: 'Gatherings', title: 'Gather with room to breathe.', note: 'A clearer setting for ideas, celebrations and connection.' },
  { slug: 'movement', category: 'Fitness & Recreation', label: 'Movement', title: 'Move with the day.', note: 'Energy in the open air; the sea always in view.' },
  { slug: 'services', category: 'Services', label: 'Services', title: 'Every detail, quietly held.', note: 'The thoughtful conveniences that make a stay feel effortless.' },
];

export default function MarisolCollectionPage() {
  const { categorySlug } = useParams();
  const hotel = useHotelBySlug('marisol-bay-resort');
  const collection = MARISOL_COLLECTIONS.find((item) => item.slug === categorySlug);
  const items = products.filter((item) => item.hotelId === 2 && item.category === collection?.category);

  if (!hotel || !collection || !items.length) return <NotFoundPage />;
  const hero = items[0];

  return (
    <div className={styles.page}>
      <MarisolCursor />
      <MarisolSidebar />
      <MarisolHeader />
      <main>
        <section className={styles.hero}>
          <img src={`/${hero.images[0]}`} alt="" />
          <div className={styles.heroShade} />
          <div className={styles.heroCopy}>
            <Link to="/hotels/marisol-bay-resort" className={styles.back}><ArrowLeft size={16} /> The resort</Link>
            <span>Marisol / {collection.label}</span>
            <h1>{collection.title}</h1>
            <p>{collection.note}</p>
          </div>
          <div className={styles.heroCounter}>01 — {String(items.length).padStart(2, '0')}</div>
        </section>

        <section className={styles.editorial}>
          <aside className={styles.collectionNav}>
            <p>Explore Marisol</p>
            {MARISOL_COLLECTIONS.map((item) => <Link key={item.slug} className={item.slug === collection.slug ? styles.active : ''} to={`/hotels/marisol-bay-resort/collection/${item.slug}`}>{item.label}<ChevronRight size={14} /></Link>)}
          </aside>
          <div className={styles.collectionHead}><span>{String(items.length).padStart(2, '0')} considered choices</span><h2>Choose the moment<br /><em>that calls you.</em></h2></div>
        </section>

        <section className={styles.grid} aria-label={`${collection.label} at Marisol`}>
          {items.map((item, index) => <motion.article key={item.id} className={`${styles.card} ${index % 5 === 0 ? styles.large : ''}`} initial={{ opacity: 0, y: 42 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.17 }} transition={{ duration: 0.75, delay: Math.min(index * 0.06, 0.25) }}>
            <Link to={`/hotels/${hotel.slug}/product/${item.slug}`} data-cursor="VIEW">
              <div className={styles.imageWrap}><img src={`/${item.images[0]}`} alt={item.title} loading={index > 2 ? 'lazy' : 'eager'} /><i /></div>
              <div className={styles.cardMeta}><span>{item.style || collection.label}</span><h3>{item.title}</h3><p>{item.shortDescription}</p><div>{item.capacity && <span><Users size={14} /> {item.capacity} guests</span>}{item.size && <span><Maximize2 size={14} /> {item.size} m²</span>}<b>Explore <ArrowUpRight size={15} /></b></div></div>
            </Link>
          </motion.article>)}
        </section>
      </main>
      <SiteFooter hotel={hotel} />
    </div>
  );
}
