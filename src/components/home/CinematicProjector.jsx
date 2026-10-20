import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './GroupHero.module.css';

function Scene({ scene, name, number, total, previous }) {
  return <div className={`${styles.scene} ${previous ? styles.scenePrevious : styles.sceneCurrent} ${styles[`align${scene.align}`]}`} data-projector-scene={previous ? 'previous' : 'current'} style={{ '--scene-image': `url("${scene.image}")` }}>
    <div className={styles.sceneShade} aria-hidden="true" />
    <div className={styles.projectorGrain} aria-hidden="true" />
    <div data-scene-copy className={styles.frameCopy}>
      <p data-scene-label>{name}</p><h2 data-scene-title>{scene.category}</h2><span data-scene-description>{scene.description}</span><small data-scene-index>{String(number).padStart(2, '0')} / {String(total).padStart(2, '0')}</small>
    </div>
  </div>;
}

export default function CinematicProjector({ name, theme, slides, delay = 0, interval = 3600, active, reducedMotion }) {
  const projectorRef = useRef(null);
  const timerRef = useRef(null);
  const currentRef = useRef(0);
  const hasIntroducedRef = useRef(false);
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState(null);

  useEffect(() => {
    const load = (image) => { const asset = new Image(); asset.src = image; };
    slides.slice(0, 2).forEach(({ image }) => load(image));
    const rest = slides.slice(2);
    const idle = window.requestIdleCallback || ((callback) => window.setTimeout(callback, 1200));
    const cancel = window.cancelIdleCallback || window.clearTimeout;
    const handle = idle(() => rest.forEach(({ image }) => load(image)));
    return () => cancel(handle);
  }, [slides]);

  useEffect(() => {
    if (!active || reducedMotion || slides.length < 2) return undefined;
    let stopped = false;
    const schedule = (wait) => {
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        if (stopped || document.hidden) { schedule(900); return; }
        const next = (currentRef.current + 1) % slides.length;
        setPrevious(currentRef.current);
        currentRef.current = next;
        setCurrent(next);
        schedule(interval);
      }, wait);
    };
    schedule(interval + delay);
    return () => { stopped = true; window.clearTimeout(timerRef.current); };
  }, [active, delay, interval, reducedMotion, slides.length]);

  useLayoutEffect(() => {
    if (!active || reducedMotion || !projectorRef.current) return undefined;
    const lite = window.matchMedia('(max-width: 760px)').matches;
    const enterFilter = (base) => (lite ? `brightness(${base})` : `blur(5px) brightness(${base})`);
    const ctx = gsap.context(() => {
      const currentScene = projectorRef.current.querySelector('[data-projector-scene="current"]');
      const previousScene = projectorRef.current.querySelector('[data-projector-scene="previous"]');
      const currentTitle = currentScene?.querySelector('[data-scene-title]');
      const currentDescription = currentScene?.querySelector('[data-scene-description]');
      const oldTitle = previousScene?.querySelector('[data-scene-title]');
      const oldDescription = previousScene?.querySelector('[data-scene-description]');
      const oldMeta = previousScene?.querySelectorAll('[data-scene-label], [data-scene-index]');
      const sweep = projectorRef.current.querySelector('[data-scene-sweep]');
      const currentMeta = currentScene?.querySelectorAll('[data-scene-label], [data-scene-index]');
      if (previousScene) {
        // One broadcast package: description leaves first, then the title
        // through its mask, the plate darkens, a light sweep crosses the frame
        // and the next shot (image, title, description) settles in.
        gsap.timeline({ onComplete: () => setPrevious(null), defaults: { overwrite: 'auto' } })
          .to(oldDescription, { opacity: 0, y: -8, duration: 0.3, ease: 'power2.in' }, 0)
          .to(oldMeta, { opacity: 0, duration: 0.25, ease: 'power1.in' }, 0.05)
          .to(oldTitle, { opacity: 0, clipPath: 'inset(0 0% 0 100%)', duration: 0.4, ease: 'power3.in' }, 0.1)
          .to(previousScene, { filter: 'brightness(.6)', duration: 0.4, ease: 'power1.in' }, 0.2)
          .fromTo(sweep, { xPercent: -130, opacity: 0 }, { xPercent: 130, opacity: 1, duration: 0.8, ease: 'power2.inOut' }, 0.3)
          .to(sweep, { opacity: 0, duration: 0.25, ease: 'power1.out' }, 0.85)
          .to(previousScene, { opacity: 0, scale: 1.025, duration: 0.55, ease: 'power2.inOut' }, 0.5)
          .fromTo(currentScene, { opacity: 0, scale: 1.05, filter: enterFilter(0.67) }, { opacity: 1, scale: 1, filter: lite ? 'brightness(1)' : 'blur(0px) brightness(1)', duration: 0.85, ease: 'power3.out' }, 0.5)
          .fromTo(currentTitle, { opacity: 0, y: 22, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power3.out' }, 0.85)
          .fromTo(currentDescription, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.0)
          .fromTo(currentMeta, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.out' }, 0.95);
      } else if (!hasIntroducedRef.current) {
        hasIntroducedRef.current = true;
        gsap.timeline({ defaults: { overwrite: 'auto' } })
          .fromTo(currentScene, { opacity: 0, scale: 1.035, filter: enterFilter(0.7) }, { opacity: 1, scale: 1, filter: lite ? 'brightness(1)' : 'blur(0px) brightness(1)', duration: 1.05, ease: 'power3.out' })
          .fromTo(currentTitle, { opacity: 0, y: 20, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.68, ease: 'power3.out' }, 0.36)
          .fromTo(currentDescription, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.48, ease: 'power2.out' }, 0.55)
          .fromTo(currentScene?.querySelectorAll('[data-scene-label], [data-scene-index]'), { opacity: 0 }, { opacity: 1, duration: 0.36 }, 0.48);
      }
    }, projectorRef);
    return () => ctx.revert();
  }, [active, current, previous, reducedMotion]);

  const titleParts = theme === 'Aurelia' ? ['Aurelia', 'Grand Hotel'] : ['Marisol', 'Bay Resort'];
  return <article ref={projectorRef} className={`${styles.projector} ${styles[`projector${theme}`]} ${active ? styles.projectorVisible : ''}`} aria-label={`${name}: ${slides[current].category}`}>
    <div data-hotel-wordmark className={styles.wordmark} aria-hidden="true"><strong>{titleParts[0]}</strong><span>{titleParts[1]}</span></div>
    <div data-projector-beam className={styles.projectorBeam} aria-hidden="true"><i /><b /><em /></div>
    <div className={styles.projectedFrame}><div data-scene-sweep className={styles.sceneSweep} aria-hidden="true" /><Scene scene={slides[current]} name={name} number={current + 1} total={slides.length} />{previous !== null && <Scene scene={slides[previous]} name={name} number={previous + 1} total={slides.length} previous />}</div>
  </article>;
}