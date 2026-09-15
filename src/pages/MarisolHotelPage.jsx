import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useHotelBySlug } from '../hooks/useHotelBySlug';
import { useHotelProducts } from '../hooks/useHotelProducts';

import MarisolHeader from '../components/layout/MarisolHeader';
import MarisolHero from '../components/hotel/MarisolHero';
import MarisolIntro from '../components/hotel/MarisolIntro';
import MarisolHighlights from '../components/hotel/MarisolHighlights';
import MarisolExperiences from '../components/hotel/MarisolExperiences';
import MarisolDining from '../components/hotel/MarisolDining';
import MarisolSpa from '../components/hotel/MarisolSpa';
import MarisolPromoBanner from '../components/hotel/MarisolPromoBanner';
import MarisolStory from '../components/hotel/MarisolStory';
import MarisolStats from '../components/hotel/MarisolStats';
import MarisolTestimonials from '../components/hotel/MarisolTestimonials';
import MarisolGallery from '../components/hotel/MarisolGallery';
import MarisolResortMap from '../components/hotel/MarisolResortMap';
import MarisolLocation from '../components/hotel/MarisolLocation';
import MarisolFinalCTA from '../components/hotel/MarisolFinalCTA';
import RoomsCarousel from '../components/hotel/RoomsCarousel';
import SiteFooter from '../components/layout/SiteFooter';
import Preloader from '../components/ui/Preloader';
import CategoryTabs from '../components/shared/CategoryTabs';

import styles from './MarisolHotelPage.module.css';

export default function MarisolHotelPage() {
  const hotel = useHotelBySlug('marisol-bay-resort');
  const [activeCategory, setActiveCategory] = useState('All');
  const products = useHotelProducts(hotel?.id, activeCategory);
  const allProducts = useHotelProducts(hotel?.id); // unfiltered, for the stats section
  const location = useLocation();

  // Preloader shows once per browser session, not on every visit/refresh.
  const [heroReady, setHeroReady] = useState(
    () => sessionStorage.getItem('marisol-preloaded') === '1'
  );

  // Lets header/footer links like "#rooms" or "#experiences" work even when
  // they navigate here FROM another page (product detail, legal pages, etc).
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        // small delay so the page has finished laying out first
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      }
    }
  }, [location.hash]);

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
    '--theme-muted': hotel.theme.colors.muted || '#6f9690',
    '--font-heading': hotel.theme.fonts.heading,
    '--font-body': hotel.theme.fonts.body,
    fontFamily: hotel.theme.fonts.body,
  };

  return (
    <div className={styles.marisolPage} style={themeVars}>
      {!heroReady && (
        <Preloader
          label={hotel.name}
          onComplete={() => {
            sessionStorage.setItem('marisol-preloaded', '1');
            setHeroReady(true);
          }}
        />
      )}
      <MarisolHeader hotel={hotel} />
      <MarisolHero hotel={hotel} ready={heroReady} />
      <MarisolIntro hotel={hotel} />
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
          variant="light"
        />

        <RoomsCarousel products={products} hotelSlug={hotel.slug} />
      </section>

      <MarisolExperiences />
      <MarisolDining hotel={hotel} />
      <MarisolSpa hotel={hotel} />
      <MarisolPromoBanner />
      <MarisolStory hotel={hotel} />
      <MarisolStats products={allProducts} />
      <MarisolTestimonials products={allProducts} />
      <MarisolGallery hotel={hotel} />
      <MarisolResortMap />
      <MarisolLocation hotel={hotel} />
      <MarisolFinalCTA />

      <SiteFooter hotel={hotel} />
    </div>
  );
}