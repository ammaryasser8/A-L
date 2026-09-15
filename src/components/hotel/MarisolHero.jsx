import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { playHeroIntro, attachHeroParallax } from '../../animations/heroAnimations';
import HeroWaterEffect from '../ui/HeroWaterEffect';
import styles from './MarisolHero.module.css';

// Drop real assets at these paths and they appear automatically —
// video takes priority if present, otherwise the image is used.
const HERO_VIDEO = '/videos/marisol-hero.mp4';
const HERO_IMAGE = '/images/hero/marisol-hero-main.jpg';

export default function MarisolHero({ hotel, ready = true }) {
  const [checkIn, setCheckIn] = useState('2026-05-24');
  const [checkOut, setCheckOut] = useState('2026-05-28');
  const [guests, setGuests] = useState('2 Adults');
  const [note, setNote] = useState('');
  const [videoOpen, setVideoOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const actionsRef = useRef(null);
  const bookingRef = useRef(null);
  const scrollCueRef = useRef(null);

  // Entrance timeline, once the preloader (if any) hands off, matching the
  // brief's exact timing.
  useEffect(() => {
    if (!ready) return undefined;

    const ctx = gsap.context(() => {
      playHeroIntro(
        {
          image: imageRef.current,
          eyebrow: eyebrowRef.current,
          heading: headingRef.current,
          subtitle: subtitleRef.current,
          actions: actionsRef.current,
          booking: bookingRef.current,
          scrollCue: scrollCueRef.current,
        },
        reducedMotion
      );
    }, sectionRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Gentle on-scroll parallax, cleaned up on unmount.
  useEffect(() => {
    const st = attachHeroParallax(
      sectionRef.current,
      imageRef.current,
      contentRef.current,
      reducedMotion
    );
    return () => st?.kill();
  }, [reducedMotion]);

  function handleSubmit(e) {
    e.preventDefault();
    setNote(`Checking ${hotel?.name || 'the resort'}: ${checkIn} → ${checkOut}, ${guests}`);
  }

  return (
    <section id="hero" ref={sectionRef} className={styles.hero}>
      <div className={styles.marbleBg} />
      <div
        ref={imageRef}
        className={styles.photoLayer}
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />
      <video className={styles.video} autoPlay muted loop playsInline>
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      <HeroWaterEffect containerRef={sectionRef} />
      <div className={styles.scrim} />

      <div ref={contentRef} className={styles.content}>
        <div ref={eyebrowRef} className={styles.eyebrow}>
          {hotel?.address?.area}, {hotel?.address?.city}
        </div>
        <h1 ref={headingRef} className={styles.heading}>
          Where the Sea
          <br />
          <em>Feels Like Home</em>
        </h1>
        <p ref={subtitleRef} className={styles.subtitle}>
          A coastal sanctuary of refined luxury, natural beauty and unforgettable moments.
        </p>
        <button ref={actionsRef} className={styles.watchBtn} onClick={() => setVideoOpen(true)}>
          <span className={styles.playCircle}>▷</span> Watch Our Story
        </button>
      </div>

      <form id="booking" ref={bookingRef} className={styles.bookingBar} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Check In</span>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        </label>
        <span className={styles.divider} />
        <label className={styles.field}>
          <span>Check Out</span>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
        </label>
        <span className={styles.divider} />
        <label className={styles.field}>
          <span>Guests</span>
          <select value={guests} onChange={(e) => setGuests(e.target.value)}>
            <option>1 Adult</option>
            <option>2 Adults</option>
            <option>2 Adults, 1 Child</option>
            <option>4 Adults</option>
          </select>
        </label>
        <button type="submit" className={styles.bookingSubmit}>
          Check Availability →
        </button>
      </form>
      {note && <p className={styles.bookingNote}>{note}</p>}

      <div ref={scrollCueRef} className={styles.scrollCue}>
        <span className={styles.scrollLine} />
        <span>Scroll to Explore</span>
      </div>

      <div className={styles.signature}>More than a stay — it's a feeling.</div>

      {videoOpen && (
        <div className={styles.videoModal} onClick={() => setVideoOpen(false)}>
          <button className={styles.videoClose} aria-label="Close video">
            ✕
          </button>
          <div className={styles.videoModalInner} onClick={(e) => e.stopPropagation()}>
            <video className={styles.videoModalPlayer} src={HERO_VIDEO} controls autoPlay />
            <p className={styles.videoFallback}>
              (Add the real story film at <code>public{HERO_VIDEO}</code> — until then this player
              stays empty.)
            </p>
          </div>
        </div>
      )}
    </section>
  );
}