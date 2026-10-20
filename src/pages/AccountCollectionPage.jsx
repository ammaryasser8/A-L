import { useEffect, useState } from 'react';
import { ArrowUpRight, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import hotels from '../data/hotels.json';
import products from '../data/products.json';
import { useAuth } from '../hooks/useAuth';
import { favoritesService } from '../services/favoritesService';
import ProfileAvatar from '../components/account/ProfileAvatar';
import MembershipBadge from '../components/account/MembershipBadge';
import styles from './AccountCollectionPage.module.css';

function productRoute(product, hotel) { return `/hotels/${hotel?.slug}/product/${product.slug}`; }

export default function AccountCollectionPage() {
  const { session } = useAuth();
  const [favorites, setFavorites] = useState(null);
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState('');
  useEffect(() => {
    let active = true;
    favoritesService.getFavorites().then((list) => { if (active) setFavorites(list); }).catch((requestError) => { if (active) setError(requestError.message || 'Your collection could not be loaded.'); });
    return () => { active = false; };
  }, [session.id]);
  async function handleRemove(productId) {
    if (removing) return;
    setRemoving(productId); setError('');
    try { await favoritesService.removeFavorite(productId); setFavorites((list) => list.filter((entry) => entry.productId !== productId)); }
    catch (requestError) { setError(requestError.message || 'We could not remove this item. Please try again.'); }
    finally { setRemoving(''); }
  }
  const savedProducts = favorites?.map((entry) => ({ entry, product: products.find((item) => item.id === entry.productId) })).filter((item) => item.product) || [];
  return <main className={styles.collection}>
    <header className={styles.header}><Link to="/" className={styles.brand}><img src="/images/brand/al-logo.png" alt="" /><span>AL Hospitality Group</span></Link><nav aria-label="Collection navigation"><Link to="/account">Account</Link><Link to="/account/profile">Profile</Link></nav></header>
    <section className={styles.hero}><div className={styles.heroGlow} aria-hidden="true" /><div className={styles.identity}><ProfileAvatar user={session} size="small" /><div><MembershipBadge user={session} /><p>Private collection</p></div></div><p className={styles.eyebrow}>The objects of your attention</p><h1>A collection<br /><em>of possibility.</em></h1><p className={styles.lead}>Keep the rooms, tables and moments you may wish to return to. Your collection is private to your AL account.</p><p className={styles.count} aria-live="polite">{favorites === null ? 'Loading your collection' : `${savedProducts.length} ${savedProducts.length === 1 ? 'saved experience' : 'saved experiences'}`}</p></section>
    <section className={styles.content} aria-live="polite">
      {error && <div className={styles.feedback} role="alert">{error} <button type="button" onClick={() => window.location.reload()}>Try again</button></div>}
      {favorites === null && <div className={styles.loading}><span /><p>Gathering your saved moments</p></div>}
      {favorites?.length === 0 && <section className={styles.empty}><Sparkles size={22} strokeWidth={1.1} aria-hidden="true" /><p className={styles.eyebrow}>A place to begin</p><h2>Your collection awaits.</h2><p>Save the stays and experiences that speak to you, then return whenever the moment feels right.</p><Link to="/hotels/aurelia-grand-hotel/explore">Discover Aurelia <ArrowUpRight size={16} /></Link><Link className={styles.secondaryLink} to="/hotels/marisol-bay-resort">Explore Marisol</Link></section>}
      {savedProducts.length > 0 && <div className={styles.grid}>{savedProducts.map(({ entry, product }, index) => { const hotel = hotels.find((item) => item.id === product.hotelId); return <article key={entry.productId} className={`${styles.card} ${index === 0 ? styles.featured : ''}`}><Link to={productRoute(product, hotel)} className={styles.imageLink} aria-label={`Open ${product.title}`}><img src={`/${product.images?.[0]}`} alt={product.title} loading={index > 1 ? 'lazy' : 'eager'} /><span>{hotel?.shortName} · {product.category}</span></Link><div className={styles.cardCopy}><p>{product.style || product.category}</p><h2><Link to={productRoute(product, hotel)}>{product.title}</Link></h2><div><Link to={productRoute(product, hotel)}>Discover <ArrowUpRight size={15} /></Link><button type="button" onClick={() => handleRemove(product.id)} disabled={removing === product.id} aria-label={`Remove ${product.title} from your collection`}><Heart size={16} fill="currentColor" />{removing === product.id ? 'Removing' : 'Remove'}</button></div></div></article>; })}</div>}
    </section>
  </main>;
}
