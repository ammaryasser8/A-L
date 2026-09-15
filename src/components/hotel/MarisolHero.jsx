import { useEffect, useRef, useState } from 'react';
import styles from './MarisolHero.module.css';

// Slide 1 is the video (public/videos/marisol-hero.mp4). Slides 2-4 are photos —
// see the image list at the end of this task for exactly what to shoot/source
// for each path below. Until the real files exist, the blue marble CSS
// background shows through instead of a broken image.
const SLIDES = [
  {
    type: 'video',
    media: '/videos/marisol-hero.mp4',
    eyebrow: 'Sahl Hasheesh · Red Sea',
    headingLine1: 'Where the sea',
    headingLine2: 'feels like',
    headingHighlight: 'home',
    subtitle:
      'A coastal sanctuary of light, sea air and considered moments.',
  },
  {
    type: 'image',
    media: '/images/hero/marisol-hero-rooms.jpg',
    eyebrow: 'Rooms & Suites',
    headingLine1: 'Wake up',
    headingLine2: 'to the',
    headingHighlight: 'water',
    subtitle:
      'Floor-to-ceiling views from every room, morning light over open water.',
  },
  {
    type: 'image',
    media: '/images/hero/marisol-hero-dining.jpg',
    eyebrow: 'Dining',
    headingLine1: 'Taste the',
    headingLine2: '',
    headingHighlight: 'coastline',
    subtitle: 'Coastal Mediterranean plates, served as the sun goes down.',
  },
  {
    type: 'image',
    media: '/images/hero/marisol-hero-spa.jpg',
    eyebrow: 'Spa & Wellness',
    headingLine1: 'Slow down,',
    headingLine2: '',
    headingHighlight: 'completely',
    subtitle: 'Open-air treatments built around light, salt air, and quiet.',
  },
];

const AUTO_ADVANCE_MS = 11000;

export default function MarisolHero({ hotel }) {
  const heroRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [checkIn, setCheckIn] = useState('2026-05-24');
  const [checkOut, setCheckOut] = useState('2026-05-27');
  const [guests, setGuests] = useState('2 Adults');
  const [bookingMessage, setBookingMessage] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveSlide((s) => (s + 1) % SLIDES.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timerRef.current);
  }, []);

  function goToSlide(i) {
    setActiveSlide(i);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveSlide((s) => (s + 1) % SLIDES.length);
    }, AUTO_ADVANCE_MS);
  }

  function handleCheckAvailability(e) {
    e.preventDefault();
    setBookingMessage(
      `Checking ${hotel?.name || 'the resort'} for ${guests}, ${checkIn} → ${checkOut}...`
    );
  }

  function exploreResort() {
    document.getElementById('story')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function toggleFilm() {
    const film = document.querySelector(`.${styles.video}`);
    if (!film) return;
    if (film.paused) film.play().catch(() => {});
    else film.pause();
  }

  function handlePointerMove(event) {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroRef.current?.style.setProperty('--orbit-x', `${x * 28}px`);
    heroRef.current?.style.setProperty('--orbit-y', `${y * 18}px`);
    heroRef.current?.style.setProperty('--film-x', `${x * -15}px`);
  }

  function resetPointer() {
    heroRef.current?.style.removeProperty('--orbit-x');
    heroRef.current?.style.removeProperty('--orbit-y');
    heroRef.current?.style.removeProperty('--film-x');
  }

  const slide = SLIDES[activeSlide];

  return (
    <section ref={heroRef} id="hero" className={styles.hero} onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={i === activeSlide ? `${styles.slide} ${styles.slideActive}` : styles.slide}
        >
          <div className={styles.marbleBg} />
          {s.type === 'image' && (
            <div className={styles.photoLayer} style={{ backgroundImage: `url(${s.media})` }} />
          )}
          {s.type === 'video' && (
            <video className={styles.video} autoPlay muted loop playsInline>
              <source src={s.media} type="video/mp4" />
            </video>
          )}
        </div>
      ))}

      <div className={styles.scrim} />
      <div className={styles.stars} aria-hidden="true" />
      <div className={styles.orbit} aria-hidden="true"><i /><b /></div>
      <div className={styles.coordinates} aria-hidden="true"><span>N 27° 11' 17.0"</span><i /><span>E 33° 50' 52.8"</span></div>

      <div className={styles.content} key={activeSlide}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          {slide.eyebrow}
        </div>
        <h1 className={styles.heading}>
          {slide.headingLine1}
          {slide.headingLine2 && (
            <>
              <br />
              {slide.headingLine2}{' '}
            </>
          )}
          {!slide.headingLine2 && ' '}
          <span>{slide.headingHighlight}</span>
        </h1>
        <p className={styles.subtitle}>{slide.subtitle}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={exploreResort}>Explore the resort</button>
          <button type="button" className={styles.ghostBtn} onClick={toggleFilm}>
            <span className={styles.playCircle}>▷</span> Watch video
          </button>
        </div>
        <p className={styles.transmission}>MARISOL FIELD NOTES / 2026 · THE RED SEA FREQUENCY</p>
      </div>

      <div className={styles.dots}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={i === activeSlide ? `${styles.dot} ${styles.dotActive}` : styles.dot}
            onClick={() => goToSlide(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <div className={styles.slideIndex} aria-hidden="true"><span>SCENE</span><strong>{String(activeSlide + 1).padStart(2, '0')}</strong><i /><span>{String(SLIDES.length).padStart(2, '0')}</span></div>

      <form id="booking" className={styles.bookingCard} onSubmit={handleCheckAvailability}>
        <div className={styles.bookingFields}>
          <label className={styles.bookingField}>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
            <small>Check in</small>
          </label>
          <label className={styles.bookingField}>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
            <small>Check out</small>
          </label>
          <label className={styles.bookingField}>
            <select value={guests} onChange={(e) => setGuests(e.target.value)}>
              <option>1 Adult</option>
              <option>2 Adults</option>
              <option>2 Adults, 1 Child</option>
              <option>4 Adults</option>
            </select>
            <small>Guests</small>
          </label>
        </div>
        <button type="submit" className={styles.bookingSubmit}>
          Check availability
        </button>
        {bookingMessage && <p className={styles.bookingNote}>{bookingMessage}</p>}
      </form>
    </section>
  );
}
