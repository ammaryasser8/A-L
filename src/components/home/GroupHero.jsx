import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { gsap } from 'gsap';
import { useAuth } from '../../hooks/useAuth';
import { useReducedMotion } from '../../hooks/Usereducedmotion';
import CinematicProjector from './CinematicProjector';
import { AURELIA_SCENES, MARISOL_SCENES } from './heroScenes';
import styles from './GroupHero.module.css';

// One line per hotel, shown under the name while the opening plays.
const HOTEL_LINES = {
  Aurelia: 'Gilded detail, Nile light, a sense of history in every arrival.',
  Marisol: 'Open water, unhurried days, an architecture of calm.',
};

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
    const readyOpen = () => { openingDone = true; setPhase('projecting'); };
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
        // OPENING (runs once; the loader already covered the page):
        // 1) the two hotel names appear large at the centre of the hero,
        // 2) a line describing each hotel is revealed and then withdrawn,
        // 3) the names travel up to their place and the projector beams open.
        // The photographs only start when this timeline completes.
        const hero = heroRef.current;
        const compact = window.matchMedia('(max-width: 760px)').matches;
        const viewport = window.innerHeight;
        const heroTop = hero.getBoundingClientRect().top;
        const names = gsap.utils.toArray('[data-hotel-wordmark]');
        // Vertical distance from each name's resting place to where it opens.
        // Desktop: both names share the centre line. Compact: they stack.
        const offsets = names.map((name, index) => {
          const rect = name.getBoundingClientRect();
          const target = compact ? viewport * (index === 0 ? 0.3 : 0.62) : viewport * 0.44;
          return target - (rect.top - heroTop + rect.height / 2);
        });
        const bigScale = compact ? 1.3 : 1.6;
        gsap.set('[data-projector-stage]', { autoAlpha: 1 });
        gsap.set(names, { y: (index) => offsets[index], scale: bigScale, autoAlpha: 0 });
        gsap.timeline({ defaults: { overwrite: 'auto' }, onComplete: readyOpen })
          .fromTo('[data-hero-statement]', { autoAlpha: 0, y: 9 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.1)
          .to(names, { autoAlpha: 1, duration: 1.1, ease: 'power2.out', stagger: 0.15 }, 0.3)
          .fromTo('[data-hotel-tagline]', { autoAlpha: 0, y: 12, clipPath: 'inset(0 100% 0 0)' }, { autoAlpha: 1, y: 0, clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power3.out', stagger: 0.18 }, 1.5)
          .to('[data-hotel-tagline]', { autoAlpha: 0, y: -10, clipPath: 'inset(0 0% 0 100%)', duration: 0.8, ease: 'power3.in', stagger: 0.12 }, 3.9)
          .to(names, { y: 0, scale: 1, duration: 1.4, ease: 'power3.inOut', stagger: 0.08 }, 4.8)
          .fromTo('[data-hero-crest]', { autoAlpha: 0, scale: 0.76 }, { autoAlpha: 0.92, scale: 1, duration: 0.7, ease: 'power3.out' }, 5.6)
          .fromTo('[data-projector-beam]', { autoAlpha: 0, scaleY: 0.35 }, { autoAlpha: 1, scaleY: 1, duration: 1.1, ease: 'power2.out', stagger: 0.14, transformOrigin: '50% 0%' }, 5.7);
      }, heroRef);
      // Safety net: if the opening timeline was interrupted for any reason
      // the hero must still end up fully visible.
      safetyTimer = window.setTimeout(() => {
        if (openingDone) return;
        gsap.set('[data-hotel-wordmark]', { y: 0, scale: 1 });
        gsap.set('[data-hotel-tagline]', { autoAlpha: 0 });
        gsap.set('[data-hero-statement], [data-hotel-wordmark], [data-hero-crest], [data-projector-beam], [data-projector-stage]', { autoAlpha: 1 });
        readyOpen();
      }, 11000);
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
        <CinematicProjector name="Aurelia Grand Hotel" theme="Aurelia" tagline={HOTEL_LINES.Aurelia} slides={AURELIA_SCENES} interval={6000} active={projectorActive} reducedMotion={reducedMotion} />
        <CinematicProjector name="Marisol Bay Resort" theme="Marisol" tagline={HOTEL_LINES.Marisol} slides={MARISOL_SCENES} interval={6800} delay={1500} active={projectorActive} reducedMotion={reducedMotion} />
      </div>
      <div data-hero-crest className={styles.crest} aria-hidden="true"><span>AL</span><i /></div>
      <div className={styles.scrollPrompt} aria-hidden="true"><span>Scroll to enter</span><i /></div>
    </section>
  </>;
}