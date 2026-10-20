import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowUpRight, Check, Clock3, Heart, Maximize2, Users } from 'lucide-react';
import products from '../data/products.json';
import { useHotelBySlug } from '../hooks/useHotelBySlug';
import { useAuth } from '../hooks/useAuth';
import { useBooking } from '../hooks/useBooking';
import { experienceService } from '../services/experienceService';
import { favoritesService } from '../services/favoritesService';
import { formatPrice } from '../utils/formatPrice';
import NotFoundPage from './NotFoundPage';
import SiteFooter from '../components/layout/SiteFooter';
import MarisolSidebar from '../components/layout/MarisolSidebar';
import MarisolHeader from '../components/layout/Marisolheader';
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
  const { productSlug } = useParams();
  const hotel = useHotelBySlug('marisol-bay-resort');
  const product = products.find((item) => item.hotelId === 2 && item.slug === productSlug);
  const navigate = useNavigate();
  const { session, isAuthenticated } = useAuth();
  const { updateDraft } = useBooking();
  const [requested, setRequested] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [guests, setGuests] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [favorited, setFavorited] = useState(false);

  const isStay = product ? ['Rooms', 'Suites'].includes(product.category) : false;

  useEffect(() => {
    if (!product || !isAuthenticated) return undefined;
    let cancelled = false;
    favoritesService.isFavorite(session.id, product.id).then((value) => {
      if (!cancelled) setFavorited(value);
    });
    return () => { cancelled = true; };
  }, [isAuthenticated, session, product]);

  if (!hotel || !product) return <NotFoundPage />;

  const [eyebrow, headline] = LABELS[product.category] || ['At Marisol', 'Made for the moment.'];
  const related = products.filter((item) => item.hotelId === 2 && item.category === product.category && item.id !== product.id).slice(0, 3);

  async function handleToggleFavorite() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/hotels/${hotel.slug}/product/${product.slug}` } } });
      return;
    }
    const nowFavorited = await favoritesService.toggleFavorite(session.id, product.id);
    setFavorited(nowFavorited);
  }

  function handleReserveStay() {
    updateDraft({ hotelSlug: hotel.slug });
    navigate('/booking');
  }

  async function handleRequestAvailability(event) {
    event.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/hotels/${hotel.slug}/product/${product.slug}` } } });
      return;
    }
    setSubmitting(true);
    await experienceService.createBooking({
      guestId: session.id,
      productId: product.id,
      productTitle: product.title,
      hotelId: hotel.id,
      date,
      time,
      guests,
    });
    setSubmitting(false);
    setRequested(true);
  }

  return (
    <div className={`${styles.page} ${styles[`category${product.category.replace(/[^a-z]/gi, '')}`]}`}>
      <MarisolSidebar />
      <MarisolHeader />
      <main>
        <section className={styles.hero}>
          <img src={`/${product.images[0]}`} alt={product.title}  loading="lazy" />
          <div className={styles.heroShade} />
          <div className={styles.heroCopy}>
            <p>{eyebrow} / {product.style}</p>
            <h1>{product.title}</h1>
            <span>{headline}</span>
          </div>
          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label={favorited ? 'Remove from your collection' : 'Save to your collection'}
            aria-pressed={favorited}
            className={styles.favoriteButton}
          >
            <Heart size={18} strokeWidth={1.4} fill={favorited ? 'currentColor' : 'none'} />
          </button>
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
          <div className={styles.detailImage}><img src={`/${product.images[1] || product.images[0]}`} alt=""  loading="lazy" /></div>
          <div className={styles.storyCopy}>
            <p className={styles.kicker}>Made for your pace</p>
            <h2>A signature<br /><em>Marisol moment.</em></h2>
            <p>Warm materials, open horizons and intuitive service make space for the kind of day you want to have. Nothing crowded. Nothing overdone.</p>
            <ul>{product.amenities.slice(0, 5).map((amenity) => <li key={amenity}><Check size={15} /> {amenity}</li>)}</ul>
          </div>
        </section>

        <section id="request" className={styles.request}>
          <div><p className={styles.kicker}>Make it yours</p><h2>{requested ? 'We have your note.' : 'The next tide is yours.'}</h2><p>{requested ? 'A Marisol host will be in touch shortly to shape the details.' : `From ${formatPrice(product.price, product.currency)}, every ${isStay ? 'stay' : 'experience'} begins with a simple request.`}</p></div>
          {requested ? (
            <div className={styles.confirmation}><Check size={21} /> Request received</div>
          ) : isStay ? (
            <button type="button" onClick={handleReserveStay}>Reserve your stay <ArrowUpRight size={17} /></button>
          ) : (
            <form onSubmit={handleRequestAvailability} className={styles.requestForm}>
              <div className={styles.requestFields}>
                <input type="date" required value={date} onChange={(event) => setDate(event.target.value)} />
                <input type="time" required value={time} onChange={(event) => setTime(event.target.value)} />
                <input type="number" min="1" max="10" required value={guests} onChange={(event) => setGuests(event.target.value)} />
              </div>
              <button type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Request availability'} <ArrowUpRight size={17} /></button>
            </form>
          )}
        </section>

        {related.length > 0 && <section className={styles.related}><p className={styles.kicker}>Continue the story</p><h2>More to discover</h2><div>{related.map((item) => <Link key={item.id} to={`/hotels/${hotel.slug}/product/${item.slug}`}><img src={`/${item.images[0]}`} alt={item.title}  loading="lazy" /><span>{item.title}<ArrowUpRight size={16} /></span></Link>)}</div></section>}
      </main>
      <SiteFooter hotel={hotel} />
    </div>
  );
}

function Fact({ icon: Icon, label, value }) {
  return <div><Icon size={18} /><span><small>{label}</small>{value}</span></div>;
}
