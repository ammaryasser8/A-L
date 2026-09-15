import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check, Clock3, Maximize2, Users } from 'lucide-react';
import products from '../data/products.json';
import { useHotelBySlug } from '../hooks/useHotelBySlug';
import { formatPrice } from '../utils/formatPrice';
import NotFoundPage from './NotFoundPage';
import SiteFooter from '../components/layout/Sitefooter';
import styles from './MarisolExperiencePage.module.css';

const LABELS = {
  Rooms: ['Private stay', 'A room shaped by the horizon.'],
  Suites: ['Signature suite', 'More sky. More stillness.'],
  Restaurants: ['At the table', 'The coast, served slowly.'],
  'Spa & Wellness': ['Wellness ritual', 'Return to your natural rhythm.'],
  Pools: ['By the water', 'A line between sea and sky.'],
  'Beach & Leisure': ['By the shoreline', 'A day with nowhere else to be.'],
  'Fitness & Recreation': ['Move freely', 'Energy, in the open air.'],
  'Events & Meetings': ['Gather differently', 'Ideas with room to breathe.'],
  Services: ['Considered service', 'The details, handled quietly.'],
};

export default function MarisolExperiencePage() {
  const { hotelSlug, productSlug } = useParams();
  const hotel = useHotelBySlug(hotelSlug);
  const product = products.find((item) => item.hotelId === 2 && item.slug === productSlug);
  const [requested, setRequested] = useState(false);

  if (!hotel || !product) return <NotFoundPage />;

  const [eyebrow, headline] = LABELS[product.category] || ['At Marisol', 'Made for the moment.'];
  const isStay = ['Rooms', 'Suites'].includes(product.category);
  const related = products.filter((item) => item.hotelId === 2 && item.category === product.category && item.id !== product.id).slice(0, 3);

  return (
    <div className={`${styles.page} ${styles[`category${product.category.replace(/[^a-z]/gi, '')}`]}`}>
      <header className={styles.header}>
        <Link to="/hotels/marisol-bay-resort" className={styles.back}><ArrowLeft size={16} /> Marisol Bay</Link>
        <span className={styles.mark}>M</span>
        <a href="#request" className={styles.plan}>Plan this moment <ArrowUpRight size={15} /></a>
      </header>

      <main>
        <section className={styles.hero}>
          <img src={`/${product.images[0]}`} alt={product.title} />
          <div className={styles.heroShade} />
          <div className={styles.heroCopy}>
            <p>{eyebrow} / {product.style}</p>
            <h1>{product.title}</h1>
            <span>{headline}</span>
          </div>
          <div className={styles.heroIndex}>MARISOL / {String(product.id).slice(-2)}</div>
        </section>

        <section className={styles.intro}>
          <p className={styles.kicker}>The experience</p>
          <h2>{product.description}</h2>
          <div className={styles.facts}>
            {isStay && <Fact icon={Users} label="Guests" value={`Up to ${product.capacity}`} />}
            {product.size && <Fact icon={Maximize2} label="Space" value={`${product.size} m²`} />}
            <Fact icon={Clock3} label="From" value={formatPrice(product.price, product.currency)} />
          </div>
        </section>

        <section className={styles.story}>
          <div className={styles.detailImage}><img src={`/${product.images[1] || product.images[0]}`} alt="" /></div>
          <div className={styles.storyCopy}>
            <p className={styles.kicker}>Made for your pace</p>
            <h2>A signature<br /><em>Marisol moment.</em></h2>
            <p>Warm materials, open horizons and intuitive service make space for the kind of day you want to have. Nothing crowded. Nothing overdone.</p>
            <ul>{product.amenities.slice(0, 5).map((amenity) => <li key={amenity}><Check size={15} /> {amenity}</li>)}</ul>
          </div>
        </section>

        <section id="request" className={styles.request}>
          <div><p className={styles.kicker}>Make it yours</p><h2>{requested ? 'We have your note.' : 'The next tide is yours.'}</h2><p>{requested ? 'A Marisol host will be in touch shortly to shape the details.' : `From ${formatPrice(product.price, product.currency)}, every ${isStay ? 'stay' : 'experience'} begins with a simple request.`}</p></div>
          {requested ? <div className={styles.confirmation}><Check size={21} /> Request received</div> : <button type="button" onClick={() => setRequested(true)}>Request availability <ArrowUpRight size={17} /></button>}
        </section>

        {related.length > 0 && <section className={styles.related}><p className={styles.kicker}>Continue the story</p><h2>More to discover</h2><div>{related.map((item) => <Link key={item.id} to={`/hotels/${hotel.slug}/product/${item.slug}`}><img src={`/${item.images[0]}`} alt={item.title} /><span>{item.title}<ArrowUpRight size={16} /></span></Link>)}</div></section>}
      </main>
      <SiteFooter hotel={hotel} />
    </div>
  );
}

function Fact({ icon: Icon, label, value }) {
  return <div><Icon size={18} /><span><small>{label}</small>{value}</span></div>;
}
