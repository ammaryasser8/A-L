import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import hotels from '../../data/hotels.json';
import products from '../../data/products.json';
import homeConfig from '../../data/home-config.json';
import { useReducedMotion } from '../../hooks/Usereducedmotion';
import BookingBar from '../shared/BookingBar';
import GroupHero from './GroupHero';
import GroupFooter from './GroupFooter';
import styles from './GroupExperience.module.css';

gsap.registerPlugin(ScrollTrigger);

const Arrow = () => <span aria-hidden="true" className={styles.arrow}>↗</span>;
const imagePath = (image) => `/${image}`;

function averageRating(items) {
  return items.reduce((sum, item) => sum + item.rating, 0) / items.length;
}

function DestinationPortal({ destination, index }) {
  const { hotel, image, accentClass } = destination;
  return (
    <article className={`${styles.portal} ${styles[accentClass]}`}>
      <div className={styles.portalImage} style={{ backgroundImage: `url(${imagePath(image)})` }} aria-hidden="true" />
      <div className={styles.portalShade} />
      <div className={styles.portalTop}><span>0{index + 1} / Destination</span><span>{hotel.address.city}, {hotel.address.country}</span></div>
      <div className={styles.portalContent}>
        <p className={styles.eyebrow}>{hotel.type}</p>
        <h2>{hotel.shortName}</h2>
        <h3>{hotel.tagline}</h3>
        <p>{hotel.description}</p>
        <Link data-cursor={`ENTER ${hotel.shortName.toUpperCase()}`} to={`/hotels/${hotel.slug}`} className={styles.lineLink}>Discover {hotel.shortName} <Arrow /></Link>
      </div>
      <span className={styles.ghostNumber}>0{index + 1}</span>
    </article>
  );
}

export default function GroupExperience() {
  const root = useRef(null);
  const experienceTrack = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedStay, setSelectedStay] = useState(0);
  const reducedMotion = useReducedMotion();

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

  useLayoutEffect(() => {
    if (reducedMotion || !root.current) return undefined;
    const ctx = gsap.context(() => {
      const hero = root.current.querySelector('[data-home-hero]');
      const copy = root.current.querySelector('[data-hero-copy]');
      const heroWorlds = root.current.querySelectorAll('[data-hero-world]');
      const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTimeline.from(heroWorlds, { clipPath: 'inset(0 50% 0 50%)', duration: 1.35, stagger: 0.12 })
        .from(copy.children, { y: 28, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=.72');
      gsap.to(heroWorlds[0], { xPercent: -5, scale: 1.08, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to(heroWorlds[1], { xPercent: 5, scale: 1.08, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to(copy, { yPercent: 18, opacity: 0.35, ease: 'none', scrollTrigger: { trigger: hero, start: '35% top', end: 'bottom top', scrub: true } });

      const convergence = root.current.querySelector('[data-convergence]');
      if (convergence) {
        const layers = convergence.querySelectorAll('[data-convergence-layer]');
        const statement = convergence.querySelector('[data-convergence-copy]');
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: convergence,
            start: 'top 82%',
            end: 'bottom 18%',
            // A little inertia keeps this editorial reveal from snapping shut
            // when the visitor scrolls through the statement quickly.
            scrub: 1.35,
          },
        });
        timeline
          .fromTo(layers[0], { xPercent: -18, scale: 1.08 }, { xPercent: -2, scale: 1.015, duration: 1.25, ease: 'none' })
          .fromTo(layers[1], { xPercent: 18, scale: 1.08 }, { xPercent: 2, scale: 1.015, duration: 1.25, ease: 'none' }, '<')
          .fromTo(statement, { y: 30, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 1.05, ease: 'none' }, '<.15')
          .to({}, { duration: 0.7 })
          .to(layers[0], { xPercent: -8, scale: 1.05, duration: 1.1, ease: 'none' })
          .to(layers[1], { xPercent: 8, scale: 1.05, duration: 1.1, ease: 'none' }, '<')
          .to(statement, { y: -16, opacity: 0.7, duration: 1.1, ease: 'none' }, '<');
      }

      root.current.querySelectorAll('[data-orbit]').forEach((element, index) => {
        gsap.from(element, { scale: 0.65, opacity: 0, duration: .85, delay: index * .08, ease: 'power3.out', scrollTrigger: { trigger: element.parentElement, start: 'top 72%', once: true } });
      });

      root.current.querySelectorAll('[data-reveal]').forEach((element) => {
        gsap.from(element, { y: 44, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 86%', once: true } });
      });
      const track = experienceTrack.current;
      if (track && window.matchMedia('(min-width: 800px)').matches) {
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth + 56),
          ease: 'none',
          scrollTrigger: { trigger: track.parentElement, start: 'top top', end: () => `+=${track.scrollWidth - window.innerWidth + 200}`, pin: true, scrub: 1, invalidateOnRefresh: true },
        });
      }
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const section = root.current?.querySelector('[data-dual-worlds]');
    if (!section) return undefined;
    const left = section.querySelector('[data-dual-left]');
    const right = section.querySelector('[data-dual-right]');
    const onMove = (event) => {
      const bounds = section.getBoundingClientRect();
      const ratio = (event.clientX - bounds.left) / bounds.width - 0.5;
      gsap.to(left, { x: ratio * 18, duration: .7, overwrite: true });
      gsap.to(right, { x: ratio * -18, duration: .7, overwrite: true });
    };
    const onLeave = () => { gsap.to([left, right], { x: 0, duration: .8, overwrite: true }); };
    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    return () => { section.removeEventListener('mousemove', onMove); section.removeEventListener('mouseleave', onLeave); };
  }, [reducedMotion]);

  return (
    <div id="top" ref={root} className={styles.home}>
      <GroupHero destinations={model.destinations} menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((value) => !value)} onMenuClose={() => setMenuOpen(false)} />
      <main>
        <section id="manifesto" className={styles.manifesto}>
          <div className={styles.sectionLabel}><span>01</span><i />The Group</div>
          <p className={styles.eyebrow}>One collection / two points of view</p>
          <h2 data-reveal>Not two hotels.<br />Two ways to <em>arrive.</em></h2>
          <div className={styles.manifestoEnd} data-reveal><p>{homeConfig.group.description}</p><a className={styles.lineLink} href="#dual-worlds">Meet the two worlds <Arrow /></a></div>
        </section>

        <section id="dual-worlds" data-dual-worlds className={styles.dual}>
          <div data-dual-left className={`${styles.dualSide} ${styles.dualAurelia}`}><div className={styles.dualImage} /><div className={styles.dualContent}><span>01 / Heritage</span><h2>Stone.<br /><em>Ceremony.</em></h2><p>Gilded detail, Nile light, a sense of history in every arrival.</p></div></div>
          <div data-dual-right className={`${styles.dualSide} ${styles.dualMarisol}`}><div className={styles.dualImage} /><div className={styles.dualContent}><span>02 / Horizon</span><h2>Sea.<br /><em>Freedom.</em></h2><p>Open water, unhurried days, an architecture of calm.</p></div></div>
          <div className={styles.dualSeam} aria-hidden="true"><span>AL</span></div>
        </section>

        <section data-convergence className={styles.convergence} aria-label="Different in spirit, united in excellence">
          <div data-convergence-layer className={`${styles.convergenceImage} ${styles.convergenceAurelia}`} aria-hidden="true" />
          <div data-convergence-layer className={`${styles.convergenceImage} ${styles.convergenceMarisol}`} aria-hidden="true" />
          <div data-convergence-copy className={styles.convergenceCopy}><span>AL / 02</span><strong>Different in spirit.<br /><em>United in excellence.</em></strong><i>AL</i></div>
        </section>

        <section className={styles.constellation} aria-labelledby="constellation-title">
          <p className={styles.eyebrow}>A universe of considered moments</p>
          <h2 id="constellation-title">Everything begins<br />around <em>AL.</em></h2>
          <div className={styles.orbitField}>
            <div className={styles.orbitLine} aria-hidden="true" /><div className={styles.orbitLineSmall} aria-hidden="true" />
            <span className={styles.orbitCore}>AL</span>
            {model.sharedCategories.slice(0, 6).map((category, index) => <a data-orbit key={category.label} className={`${styles.orbitItem} ${styles[`orbit${index + 1}`]}`} href="#experiences">{category.label}<i>↗</i></a>)}
          </div>
          <p className={styles.constellationNote}>Move through the collection by following the moments that call to you.</p>
        </section>

        <section className={styles.portals} aria-label="The two AL destinations">
          {model.destinations.map((destination, index) => <DestinationPortal key={destination.id} destination={destination} index={index} />)}
        </section>

        <section id="experiences" className={styles.experienceSection}>
          <div className={styles.experienceIntro}><div className={styles.sectionLabel}><span>03</span><i />Curated experiences</div><p className={styles.eyebrow}>Across the collection</p><h2>There is more<br />than one way to <em>feel.</em></h2><p>Spaces, rituals and moments selected from the actual experiences at both addresses.</p></div>
          <div className={styles.experiencePin}><div ref={experienceTrack} className={styles.experienceTrack}>{model.experiences.map((experience) => { const hotel = hotels.find((item) => item.id === experience.product.hotelId); return hotel ? <Link key={experience.label} to={`/hotels/${hotel.slug}/product/${experience.product.slug}`} className={styles.experienceCard} data-cursor="VIEW"><div className={styles.cardImage} style={{ backgroundImage: `url(${imagePath(experience.product.images[0])})` }} /><div className={styles.cardMeta}><span>{experience.number} / {experience.label}</span><strong>{experience.product.title}</strong><p>{experience.product.shortDescription}</p><Arrow /></div></Link> : null; })}</div></div>
        </section>

        <section className={styles.gallery} aria-label="A closer look at the AL collection">
          <p className={styles.galleryLabel}>Fragments of a stay / Cairo to the Red Sea</p>
          <figure className={`${styles.galleryItem} ${styles.galleryTall}`}><img src="/images/products/20-1.jpg" alt="Architectural detail at Aurelia Grand Hotel" /><figcaption>Aurelia / a sense of arrival</figcaption></figure>
          <figure className={`${styles.galleryItem} ${styles.galleryWide}`}><img src="/images/products/110-1.jpg" alt="Sea-facing view at Marisol Bay Resort" /><figcaption>Marisol / room to breathe</figcaption></figure>
          <p className={styles.galleryStatement}>The details are<br /><em>the destination.</em></p>
          <figure className={`${styles.galleryItem} ${styles.gallerySquare}`}><img src="/images/products/10-1.jpg" alt="A considered AL hospitality experience" /><figcaption>Every moment, composed</figcaption></figure>
        </section>

        <section id="stays" className={styles.stays}>
          <div className={styles.stayHead}><div className={styles.sectionLabel}><span>04</span><i />The art of staying</div><h2 data-reveal>Rooms with a<br /><em>sense of place.</em></h2></div>
          <div className={styles.staySwitch} role="tablist" aria-label="Choose a destination">{model.stays.map((stay, index) => { const hotel = hotels.find((item) => item.id === stay.hotelId); return <button key={stay.id} type="button" role="tab" aria-selected={selectedStay === index} onClick={() => setSelectedStay(index)}>{String(index + 1).padStart(2, '0')} / {hotel.shortName}</button>; })}</div>
          <div className={styles.stayGrid}>{model.stays.map((stay, index) => { const hotel = hotels.find((item) => item.id === stay.hotelId); return <Link key={stay.id} to={`/hotels/${hotel.slug}/product/${stay.slug}`} className={`${styles.stayCard} ${selectedStay === index ? styles.stayActive : ''}`}><div className={styles.stayImage} style={{ backgroundImage: `url(${imagePath(stay.images[0])})` }} /><div><p>{hotel.shortName} / {stay.category}</p><h3>{stay.title}</h3><span>{stay.size} m² · Up to {stay.capacity} guests <Arrow /></span></div></Link>; })}</div>
        </section>

        <section className={styles.proof}>
          <p className={styles.eyebrow}>The collection, in numbers</p>
          <div>{[[String(hotels.length).padStart(2, '0'), 'Distinct destinations'], [String(model.productCount).padStart(3, '0'), 'Curated stays & experiences'], [model.avgRating.toFixed(1), 'Average guest rating'], [model.totalReviews.toLocaleString(), 'Guest reviews across AL']].map(([value, label]) => <article key={label}><strong>{value}</strong><span>{label}</span></article>)}</div>
        </section>

        <section className={styles.voices}><div className={styles.sectionLabel}><span>05</span><i />Guest voices</div><h2 data-reveal>Remembered for<br />how it <em>felt.</em></h2><div className={styles.voiceGrid}>{model.guestVoices.map(({ hotel, review, product }) => <article key={hotel.id}><span>{hotel.shortName} / {product.title}</span><blockquote>“{review.comment}”</blockquote><p>{review.author} · Verified guest rating {review.rating}/5</p></article>)}</div></section>

        <section className={styles.bookingScene} aria-labelledby="booking-title">
          <div className={styles.bookingAura} aria-hidden="true" />
          <div className={styles.bookingCopy}><p className={styles.eyebrow}>Your next chapter</p><h2 id="booking-title">Find the time<br />to <em>arrive.</em></h2><p>Choose your dates. The rest unfolds with care.</p></div>
          <BookingBar variant="glass" />
        </section>

        <section id="journey" className={styles.journey}><div className={styles.journeyGlow} /><p className={styles.eyebrow}>The next chapter</p><h2>Choose a world.<br /><em>Make it yours.</em></h2><div>{model.destinations.map((destination) => <Link data-cursor={`ENTER ${destination.hotel.shortName.toUpperCase()}`} key={destination.id} to={`/hotels/${destination.hotel.slug}`}><small>{destination.number} / {destination.hotel.address.city}</small><strong>{destination.hotel.name}</strong><Arrow /></Link>)}</div></section>
      </main>
      <GroupFooter group={homeConfig.group} hotels={hotels} categories={model.sharedCategories} />
    </div>
  );
}
