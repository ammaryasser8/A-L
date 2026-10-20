import { useEffect, useMemo, useRef, useState } from 'react';
import hotels from '../../data/hotels.json';
import products from '../../data/products.json';
import homeConfig from '../../data/home-config.json';
import { useReducedMotion } from '../../hooks/Usereducedmotion';
import { useVisualEngine } from '../../hooks/useVisualEngine';
import { useDocumentTitle, useMetaDescription } from '../../hooks/useDocumentTitle';
import { useGroupSceneAnimations } from '../../hooks/useGroupSceneAnimations';
import { useConstellationProximity } from '../../hooks/useConstellationProximity';
import { useGalleryDepth } from '../../hooks/useGalleryDepth';
import { useBookingFocus } from '../../hooks/useBookingFocus';
import { usePortalPhysics } from '../../hooks/usePortalPhysics';
import GroupHero from './GroupHero';
import ManifestoScene from './ManifestoScene';
import DualWorldsSection from './DualWorldsSection';
import ConvergenceSection from './ConvergenceSection';
import BlueprintScene from './BlueprintScene';
import ConstellationSection from './ConstellationSection';
import DestinationPortal from './DestinationPortal';
import ExperiencesSection from './ExperiencesSection';
import GallerySection from './GallerySection';
import StaysSection from './StaysSection';
import ProofSection from './ProofSection';
import VoicesSection from './VoicesSection';
import BookingSection from './BookingSection';
import GravityScene from './GravityScene';
import JourneySection from './JourneySection';
import GroupFooter from './GroupFooter';
import styles from './GroupExperience.module.css';

function averageRating(items) {
  return items.reduce((sum, item) => sum + item.rating, 0) / items.length;
}

/**
 * The AL Hospitality Group homepage. This component owns page-level
 * state (menu, selected stay) and the real-time visual engine; every
 * scene's own scroll/pointer choreography lives in a dedicated hook
 * (src/hooks/use*.js), and every scene's markup lives in its own
 * component (this same folder) — this file just assembles them in
 * order, in the sequence documented in the project's own scene map:
 * Hero → Manifesto → Dual Worlds → Convergence → Blueprint →
 * Constellation → Portals → Experiences → Gallery → Stays → Proof →
 * Voices → Booking → Gravity → Journey → Footer.
 */
export default function GroupExperience() {
  const root = useRef(null);
  const experienceTrack = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedStay, setSelectedStay] = useState(0);
  const reducedMotion = useReducedMotion();
  const engine = useVisualEngine({ reducedMotion });
  useDocumentTitle();
  useMetaDescription(homeConfig.group.description);

  const model = useMemo(() => {
    const destinations = hotels.map((hotel, index) => ({
      id: hotel.slug.split('-')[0], number: `0${index + 1}`, hotel,
      image: index === 0 ? 'images/products/7-1.jpg' : 'images/products/101-1.jpg',
      accentClass: index === 0 ? 'aureliaPortal' : 'marisolPortal',
    }));
    const byHotel = Object.fromEntries(hotels.map((hotel) => [hotel.id, products.filter((product) => product.hotelId === hotel.id)]));
    const totalReviews = products.reduce((sum, product) => sum + product.reviewsCount, 0);
    const sharedCategories = homeConfig.homepage.sharedCategories.filter(({ label }) => products.some((product) => product.category === label));
    const experiences = sharedCategories.map((category, index) => {
      const categoryProducts = products.filter((item) => item.category === category.label);
      const preferredHotelId = index % 2 === 0 ? 1 : 2;
      const product = categoryProducts.find((item) => item.hotelId === preferredHotelId && item.featured)
        || categoryProducts.find((item) => item.hotelId === preferredHotelId)
        || categoryProducts.find((item) => item.featured)
        || categoryProducts[0];
      return product && { ...category, product, number: String(index + 1).padStart(2, '0') };
    }).filter(Boolean).slice(0, 6);
    const stays = hotels.map((hotel) => (byHotel[hotel.id].find((item) => item.featured && ['Rooms', 'Suites'].includes(item.category)) || byHotel[hotel.id][0])).filter(Boolean);
    const guestVoices = destinations.map(({ hotel }) => {
      const product = byHotel[hotel.id].find((item) => item.reviews?.length);
      return product && { hotel, review: product.reviews[0], product };
    }).filter(Boolean);
    return {
      destinations, experiences, stays, guestVoices, sharedCategories, totalReviews,
      productCount: products.length,
      avgRating: averageRating(products),
      totalRooms: products.filter((product) => ['Rooms', 'Suites'].includes(product.category)).length,
      byHotel,
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useGroupSceneAnimations(root, experienceTrack, reducedMotion);
  useConstellationProximity(root, reducedMotion);
  useGalleryDepth(root, reducedMotion);
  useBookingFocus(root, reducedMotion);
  usePortalPhysics(root, reducedMotion, engine);

  return (
    <div id="top" ref={root} className={styles.home}>
      <GroupHero destinations={model.destinations} menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((value) => !value)} onMenuClose={() => setMenuOpen(false)} />
      <main id="main-content">
        <ManifestoScene />
        <DualWorldsSection />
        <ConvergenceSection />
        <BlueprintScene />
        <ConstellationSection sharedCategories={model.sharedCategories} />

        <section data-portals className={styles.portals} aria-label="The two AL destinations">
          {model.destinations.map((destination, index) => <DestinationPortal key={destination.id} destination={destination} index={index} />)}
        </section>

        <ExperiencesSection experiences={model.experiences} trackRef={experienceTrack} />
        <GallerySection />
        <StaysSection stays={model.stays} selectedStay={selectedStay} setSelectedStay={setSelectedStay} />
        <ProofSection productCount={model.productCount} avgRating={model.avgRating} totalReviews={model.totalReviews} />
        <VoicesSection guestVoices={model.guestVoices} />
        <BookingSection />
        <GravityScene />
        <JourneySection destinations={model.destinations} />
      </main>
      <GroupFooter group={homeConfig.group} hotels={hotels} categories={model.sharedCategories} />
    </div>
  );
}