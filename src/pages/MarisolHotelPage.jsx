import { useState } from 'react';
import { useHotelBySlug } from '../hooks/useHotelBySlug';
import { useHotelProducts } from '../hooks/useHotelProducts';

import MarisolHeader from '../components/layout/MarisolHeader';
import MarisolHero from '../components/hotel/MarisolHero';
import MarisolHighlights from '../components/hotel/MarisolHighlights';
import MarisolExperiences from '../components/hotel/MarisolExperiences';
import MarisolPromoBanner from '../components/hotel/MarisolPromoBanner';
import MarisolStats from '../components/hotel/MarisolStats';
import CategoryTabs from '../components/shared/CategoryTabs';
import ProductCard from '../components/shared/ProductCard';

import styles from './MarisolHotelPage.module.css';

export default function MarisolHotelPage() {
  const hotel = useHotelBySlug('marisol-bay-resort');
  const [activeCategory, setActiveCategory] = useState('All');
  const products = useHotelProducts(hotel?.id, activeCategory);
  const allProducts = useHotelProducts(hotel?.id); // unfiltered, for the stats section

  if (!hotel) return null;

  const themeVars = {
    '--theme-primary': hotel.theme.colors.primary,
    '--theme-primary-dark': hotel.theme.colors.primaryDark,
    '--theme-accent': hotel.theme.colors.accent,
    '--theme-accent-light': hotel.theme.colors.accentLight,
    '--theme-surface': hotel.theme.colors.surface,
    '--theme-surface-dark': hotel.theme.colors.surfaceDark,
    '--theme-on-primary': hotel.theme.colors.onPrimary,
    '--theme-ink': hotel.theme.colors.ink,
    '--theme-muted': '#6b7570',
    '--font-heading': hotel.theme.fonts.heading,
    '--font-body': hotel.theme.fonts.body,
    fontFamily: hotel.theme.fonts.body,
  };

  return (
    <div style={themeVars}>
      <MarisolHeader />
      <MarisolHero hotel={hotel} />
      <MarisolHighlights />

      <section id="rooms" className={`wrap ${styles.roomsSection}`}>
        <div className={styles.roomsHead}>
          <div>
            <span className={styles.eyebrow}>Accommodation</span>
            <h2>Rooms & Suites</h2>
          </div>
        </div>

        <CategoryTabs
          categories={hotel.categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} hotelSlug={hotel.slug} />
          ))}
        </div>
      </section>

      <MarisolExperiences />
      <MarisolPromoBanner />
      <MarisolStats products={allProducts} />

      {/* TODO: <SiteFooter /> — هتضاف هنا لما فرع feature/shared-footer يتدمج في main */}
    </div>
  );
}