import { useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './GroupHero.module.css';

const Arrow = () => <span aria-hidden="true" className={styles.arrow}>↗</span>;

export default function GroupHero({ destinations, menuOpen, onMenuToggle, onMenuClose }) {
  const heroRef = useRef(null);

  function handlePointerMove(event) {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroRef.current?.style.setProperty('--aurelia-x', `${x * -22}px`);
    heroRef.current?.style.setProperty('--marisol-x', `${x * 22}px`);
    heroRef.current?.style.setProperty('--atmosphere-x', `${x * 12}px`);
    heroRef.current?.style.setProperty('--atmosphere-y', `${y * 12}px`);
  }

  function resetPointer() {
    ['--aurelia-x', '--marisol-x', '--atmosphere-x', '--atmosphere-y'].forEach((variable) => {
      heroRef.current?.style.removeProperty(variable);
    });
  }

  return (
    <>
      <header className={styles.header}>
        <Link className={styles.brand} to="/" aria-label="AL Hospitality Group home">
          <img src="/images/brand/al-logo.png" alt="" />
          <span>AL<br />Hospitality Group</span>
        </Link>
        <p className={styles.headerLine}>One group · two worlds · Egypt</p>
        <button
          type="button"
          className={`${styles.menuButton} ${menuOpen ? styles.menuOpen : ''}`}
          onClick={onMenuToggle}
          aria-expanded={menuOpen}
          aria-controls="group-navigation"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        >
          <i /><i />
        </button>
      </header>

      <nav id="group-navigation" className={`${styles.menu} ${menuOpen ? styles.menuVisible : ''}`} aria-hidden={!menuOpen}>
        <p>Choose a chapter</p>
        <a href="#manifesto" onClick={onMenuClose}><small>01</small>The Group <Arrow /></a>
        {destinations.map((destination) => (
          <Link key={destination.id} to={`/hotels/${destination.hotel.slug}`} onClick={onMenuClose}>
            <small>{destination.number}</small>{destination.hotel.shortName}<Arrow />
          </Link>
        ))}
        <a href="#experiences" onClick={onMenuClose}><small>04</small>Experiences <Arrow /></a>
      </nav>

      <section ref={heroRef} data-home-hero className={styles.hero} aria-labelledby="group-title" onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
        <div data-hero-world="aurelia" className={`${styles.world} ${styles.aurelia}`} aria-hidden="true" />
        <div data-hero-world="marisol" className={`${styles.world} ${styles.marisol}`} aria-hidden="true" />
        <div className={styles.atmosphere} aria-hidden="true" />
        <div className={styles.seam} aria-hidden="true"><i /></div>
        <div className={styles.crest} aria-hidden="true"><span>AL</span><i /></div>
        <div data-hero-copy className={styles.content}>
          <p className={styles.kicker}>AL Hospitality Group · Cairo / Red Sea</p>
          <h1 id="group-title"><span>Two worlds.</span><br /><em>One standard.</em></h1>
          <p className={styles.intro}>A palace shaped by history. A coast shaped by horizon. Held together by the art of exceptional hospitality.</p>
          <div className={styles.choices}>
            {destinations.map((destination) => (
              <Link
                key={destination.id}
                className={`${styles.choice} ${styles[destination.id === 'aurelia' ? 'choiceAurelia' : 'choiceMarisol']}`}
                to={`/hotels/${destination.hotel.slug}`}
                data-cursor={`ENTER ${destination.hotel.shortName.toUpperCase()}`}
              >
                <small>{destination.number} / {destination.hotel.address.city}</small>
                <strong>{destination.id === 'marisol' ? 'Marisol' : destination.hotel.shortName}</strong>
                <Arrow />
              </Link>
            ))}
          </div>
        </div>
        <a className={styles.scrollPrompt} href="#manifesto"><span>Scroll to enter</span><i /></a>
        <div className={styles.marker}><span>01</span><i /><span>06</span></div>
      </section>
    </>
  );
}
