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
    eyebrow: 'Luxury Coastal Retreat',
    headingLine1: 'Elevate',
    headingLine2: 'your',
    headingHighlight: 'escape',
    subtitle:
      'Experience unparalleled luxury and minimalist elegance at Marisol Bay Resort.',
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

const AUTO_ADVANCE_MS = 7000;

export default function MarisolHero({ hotel }) {
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

  const slide = SLIDES[activeSlide];

  return (
    <section id="hero" className={styles.hero}>
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
          <button className={styles.primaryBtn}>Explore the resort</button>
          <button className={styles.ghostBtn}>
            <span className={styles.playCircle}>▷</span> Watch video
          </button>
        </div>
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