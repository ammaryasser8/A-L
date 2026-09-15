import { useRef, useState } from 'react';
import styles from './MarisolHero.module.css';

export default function MarisolHero({ hotel }) {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const [checkIn, setCheckIn] = useState('2026-05-24');
  const [checkOut, setCheckOut] = useState('2026-05-27');
  const [guests, setGuests] = useState('2 Adults');
  const [bookingMessage, setBookingMessage] = useState('');

  function handleCheckAvailability(event) {
    event.preventDefault();
    setBookingMessage(`Checking ${hotel?.name || 'the resort'} for ${guests}, ${checkIn} → ${checkOut}...`);
  }

  function exploreResort() {
    document.getElementById('story')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function toggleFilm() {
    const film = videoRef.current;
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
    heroRef.current?.style.setProperty('--film-x', `${x * -12}px`);
  }

  function resetPointer() {
    heroRef.current?.style.removeProperty('--orbit-x');
    heroRef.current?.style.removeProperty('--orbit-y');
    heroRef.current?.style.removeProperty('--film-x');
  }

  return (
    <section ref={heroRef} id="hero" className={styles.hero} onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
      <video ref={videoRef} className={styles.video} autoPlay muted loop playsInline>
        <source src="/videos/marisol-hero.mp4" type="video/mp4" />
      </video>
      <div className={styles.scrim} />
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.orbit} aria-hidden="true"><i /><b /></div>
      <div className={styles.coordinates} aria-hidden="true"><span>RED SEA</span><i /><span>27° 11' N</span></div>

      <div className={styles.content}>
        <div className={styles.eyebrow}><span className={styles.eyebrowLine} /> MARISOL BAY RESORT</div>
        <h1 className={styles.heading}>Where the sea<br />feels like <span>home.</span></h1>
        <p className={styles.subtitle}>A considered escape shaped by open water, warm stone and the slow rhythm of the Red Sea.</p>
        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn} onClick={exploreResort}>Explore the resort</button>
          <button type="button" className={styles.ghostBtn} onClick={toggleFilm}><span className={styles.playCircle}>▷</span> Play / pause film</button>
        </div>
        <p className={styles.transmission}>MARISOL FIELD NOTES / THE RED SEA FREQUENCY</p>
      </div>

      <div className={styles.scrollCue}><span>Scroll to drift</span><i /></div>

      <form id="booking" className={styles.bookingCard} onSubmit={handleCheckAvailability}>
        <span className={styles.bookingLabel}>Plan your stay</span>
        <label className={styles.bookingField}>
          <small>Check in</small>
          <input type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} />
        </label>
        <label className={styles.bookingField}>
          <small>Check out</small>
          <input type="date" value={checkOut} onChange={(event) => setCheckOut(event.target.value)} />
        </label>
        <label className={styles.bookingField}>
          <small>Guests</small>
          <select value={guests} onChange={(event) => setGuests(event.target.value)}>
            <option>1 Adult</option><option>2 Adults</option><option>2 Adults, 1 Child</option><option>4 Adults</option>
          </select>
        </label>
        <button type="submit" className={styles.bookingSubmit}>Check availability <span>↗</span></button>
        {bookingMessage && <p className={styles.bookingNote}>{bookingMessage}</p>}
      </form>
    </section>
  );
}
