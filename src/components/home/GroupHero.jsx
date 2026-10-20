import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { gsap } from 'gsap';
import { useAuth } from '../../hooks/useAuth';
import { useReducedMotion } from '../../hooks/Usereducedmotion';
import CinematicProjector from './CinematicProjector';
import { AURELIA_SCENES, MARISOL_SCENES } from './heroScenes';
import styles from './GroupHero.module.css';

const Arrow = () => <span aria-hidden="true" className={styles.arrow}>↗</span>;

export default function GroupHero({ destinations, menuOpen, onMenuToggle, onMenuClose }) {
  const heroRef = useRef(null);
  const menuButtonRef = useRef(null);
  const hasOpened = useRef(false);
  const reducedMotion = useReducedMotion();
  const { isAuthenticated, session } = useAuth();
  const [headerSolid, setHeaderSolid] = useState(false);
  const [phase, setPhase] = useState('waiting');
  const guestName = [session?.firstName, session?.lastName].filter(Boolean).join(' ') || 'Account';
  const guestInitial = (session?.firstName?.[0] || session?.email?.[0] || 'A').toUpperCase();

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { onMenuClose(); menuButtonRef.current?.focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, onMenuClose]);

  useEffect(() => {
    const updateHeader = () => setHeaderSolid(window.scrollY > 48);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  useLayoutEffect(() => {
    let context;
    let fallbackTimer;
    let safetyTimer;
    let openTimer;
    let openingDone = false;
    const readyObserver = new MutationObserver(() => {
      if (document.documentElement.dataset.alReady === 'true') start();
    });
    const start = () => {
      if (hasOpened.current) return;
      hasOpened.current = true;
      setPhase('opening');
      if (reducedMotion) { setPhase('projecting'); return; }
      // The loader emits `al:ready` from inside one of its own GSAP callbacks.
      // GSAP records animations created during a callback into the loader's
      // context, and that context is reverted as soon as the loader unmounts,
      // which would kill this opening sequence. Defer one tick so the timeline
      // is created outside the loader's context.
      openTimer = window.setTimeout(runOpening, 0);
    };
    const runOpening = () => {
      context = gsap.context(() => {
        // OPENING (runs once): curtain -> hotel names -> projector beams.
        // The first projected scene starts when this timeline completes.
        gsap.set('[data-projector-stage]', { autoAlpha: 1 });
        gsap.timeline({ defaults: { overwrite: 'auto' }, onComplete: () => { openingDone = true; setPhase('projecting'); } })
          .to('[data-curtain-left]', { xPercent: -104, duration: 1.8, ease: 'power4.inOut' }, 0)
          .to('[data-curtain-right]', { xPercent: 104, duration: 1.8, ease: 'power4.inOut' }, 0)
          .to('[data-curtain-sheen]', { opacity: 0, duration: 0.55, ease: 'power2.out' }, 0.7)
          .fromTo('[data-hero-statement]', { autoAlpha: 0, y: 9 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.82)
          .fromTo('[data-hotel-wordmark]', { autoAlpha: 0, y: 150, scale: 1.14 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.inOut', stagger: 0.12 }, 1.05)
          .fromTo('[data-hero-crest]', { autoAlpha: 0, scale: 0.76 }, { autoAlpha: 0.92, scale: 1, duration: 0.7, ease: 'power3.out' }, 1.3)
          .fromTo('[data-projector-beam]', { autoAlpha: 0, scaleY: 0.35 }, { autoAlpha: 1, scaleY: 1, duration: 1.1, ease: 'power2.out', stagger: 0.14, transformOrigin: '50% 0%' }, 2.15);
      }, heroRef);
      // Safety net: if the opening timeline was interrupted for any reason
      // the curtain must never be left closed over the hero.
      safetyTimer = window.setTimeout(() => {
        if (openingDone) return;
        gsap.set('[data-curtain-left]', { xPercent: -104 });
        gsap.set('[data-curtain-right]', { xPercent: 104 });
        gsap.set('[data-curtain-sheen], [data-hero-statement], [data-hotel-wordmark], [data-hero-crest], [data-projector-beam], [data-projector-stage]', { autoAlpha: 1 });
        setPhase('projecting');
      }, 7000);
    };
    if (document.documentElement.dataset.alReady === 'true') start();
    else window.addEventListener('al:ready', start, { once: true });
    readyObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-al-ready'] });
    // The normal route is the event emitted by GenesisPreloader. This guard
    // keeps the hero usable if a custom loader is disabled or interrupted.
    fallbackTimer = window.setTimeout(start, 8000);
    return () => {
      window.removeEventListener('al:ready', start);
      readyObserver.disconnect();
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(safetyTimer);
      window.clearTimeout(openTimer);
      context?.revert();
      // React Strict Mode deliberately mounts, cleans up, then mounts effects
      // again in development. Let that second setup build the real timeline.
      hasOpened.current = false;
    };
  }, [reducedMotion]);

  const projectorActive = phase === 'projecting';
  return <>
    <header className={`${styles.header} ${headerSolid ? styles.headerSolid : ''}`}>
      <Link className={styles.brand} to="/" aria-label="AL Hospitality Group home"><img src="/images/brand/al-logo.png" alt="" /><span>AL<br />Hospitality Group</span></Link>
      <p className={styles.headerLine}>One group · two worlds · Egypt</p>
      <div className={styles.headerActions}>
        <Link className={styles.searchLink} to="/search" title="Search AL Hospitality Group" aria-label="Search AL Hospitality Group"><Search size={17} strokeWidth={1.45} /></Link>
        <Link className={styles.accountLink} to={isAuthenticated ? '/account' : '/login'}>{isAuthenticated ? <><span className={styles.avatar}>{session?.avatar ? <img src={session.avatar} alt="" /> : guestInitial}</span><i aria-hidden="true" /><span className={styles.accountName}>{guestName}</span></> : 'Sign in'}</Link>
        <button ref={menuButtonRef} type="button" className={`${styles.menuButton} ${menuOpen ? styles.menuOpen : ''}`} onClick={onMenuToggle} aria-expanded={menuOpen} aria-controls="group-navigation" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}><i /><i /></button>
      </div>
    </header>
    <nav id="group-navigation" className={`${styles.menu} ${menuOpen ? styles.menuVisible : ''}`} aria-hidden={!menuOpen} inert={!menuOpen}>
      <p>Choose a chapter</p><a href="#manifesto" onClick={onMenuClose}><small>01</small>The Group <Arrow /></a>
      {destinations.map((destination) => <Link key={destination.id} to={`/hotels/${destination.hotel.slug}`} onClick={onMenuClose}><small>{destination.number}</small>{destination.hotel.shortName}<Arrow /></Link>)}
      <a href="#experiences" onClick={onMenuClose}><small>04</small>Experiences <Arrow /></a>
    </nav>
    <section ref={heroRef} data-home-hero className={`${styles.hero} ${styles[`phase${phase[0].toUpperCase()}${phase.slice(1)}`]}`} aria-label="AL Hospitality: two cinematic hotel worlds">
      <div className={styles.atmosphere} aria-hidden="true" />
      <p data-hero-statement className={styles.statement} aria-hidden="true"><span>One group</span><i /> <span>Two worlds</span></p>
      <div data-projector-stage className={styles.projectorStage}>
        <CinematicProjector name="Aurelia Grand Hotel" theme="Aurelia" slides={AURELIA_SCENES} interval={6000} active={projectorActive} reducedMotion={reducedMotion} />
        <CinematicProjector name="Marisol Bay Resort" theme="Marisol" slides={MARISOL_SCENES} interval={6800} delay={1500} active={projectorActive} reducedMotion={reducedMotion} />
      </div>
      <div data-hero-crest className={styles.crest} aria-hidden="true"><span>AL</span><i /></div>
      <div className={styles.scrollPrompt} aria-hidden="true"><span>Scroll to enter</span><i /></div>
      <div className={styles.curtain} aria-hidden="true"><div data-curtain-left className={`${styles.curtainPanel} ${styles.curtainLeft}`} /><div data-curtain-right className={`${styles.curtainPanel} ${styles.curtainRight}`} /><div data-curtain-sheen className={styles.curtainSheen} /></div>
    </section>
  </>;
}