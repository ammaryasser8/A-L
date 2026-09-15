import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useHotelBySlug } from '../hooks/useHotelBySlug';
import { useHotelProducts } from '../hooks/useHotelProducts';

import MarisolHeader from '../components/layout/Marisolheader';
import SiteFooter from '../components/layout/Sitefooter';
import MarisolHero from '../components/hotel/MarisolHero';
import MarisolIntro from '../components/hotel/MarisolIntro';
import MarisolHighlights from '../components/hotel/MarisolHighlights';
import MarisolStayCollection from '../components/hotel/MarisolStayCollection';
import MarisolDining from '../components/hotel/MarisolDining';
import MarisolSpa from '../components/hotel/Marisolspa';
import MarisolExperiences from '../components/hotel/MarisolExperiences';
import MarisolResortMap from '../components/hotel/MarisolResortMap';
import MarisolStory from '../components/hotel/MarisolStory';
import MarisolGallery from '../components/hotel/MarisolGallery';
import MarisolTestimonials from '../components/hotel/MarisolTestimonials';
import MarisolFinalCTA from '../components/hotel/MarisolFinalCTA';

export default function MarisolHotelPage() {
  const hotel = useHotelBySlug('marisol-bay-resort');
  const products = useHotelProducts(hotel?.id);
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return undefined;
    const id = location.hash.slice(1);
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
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
    '--theme-muted': '#6b7570',
    '--font-heading': hotel.theme.fonts.heading,
    '--font-body': hotel.theme.fonts.body,
    fontFamily: hotel.theme.fonts.body,
  };

  return (
    <div style={themeVars}>
      <MarisolHeader />
      <MarisolHero hotel={hotel} />
      <MarisolIntro hotel={hotel} />
      <MarisolHighlights />
      <MarisolStayCollection hotel={hotel} />
      <MarisolDining hotel={hotel} />
      <MarisolSpa hotel={hotel} />
      <MarisolExperiences />
      <MarisolResortMap />
      <MarisolStory hotel={hotel} />
      <MarisolGallery hotel={hotel} />
      <MarisolTestimonials products={products} />
      <MarisolFinalCTA />
      <SiteFooter hotel={hotel} />
    </div>
  );
}
