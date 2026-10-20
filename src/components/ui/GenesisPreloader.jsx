import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);
import { useReducedMotion } from '../../hooks/Usereducedmotion';
import { isLowPowerDevice } from '../../hooks/deviceCapability';
import styles from './GenesisPreloader.module.css';

/**
 * THE GENESIS OF AL — cinematic brand entrance.
 *
 * Target runtime: ~6.4s when the application is ready.
 * Maximum intentional wait: ~7s before the portal is allowed to finish.
 *
 * The visual sequence is deliberately independent from the real application
 * loading state. The portal only releases after the cinematic minimum is
 * reached AND the app/fonts are ready, with a hard safety cap.
 */
export default function GenesisPreloader({ onComplete }) {
  const root = useRef(null);
  const reducedMotion = useReducedMotion();
  const lowPower = isLowPowerDevice();

  const desktop =
    typeof window !== 'undefined' &&
    window.matchMedia('(min-width: 700px)').matches;

  const simplified = lowPower || !desktop;

  useLayoutEffect(() => {
    const appReady = Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 1800)),
    ]);

    if (reducedMotion) {
      const ctx = gsap.context(() => {
        gsap.timeline({
          onComplete: onComplete,
        })
          .fromTo('[data-genesis-logo]', { opacity: 0, scale: 0.97 }, {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: 'power2.out',
          })
          .fromTo('[data-genesis-name]', { opacity: 0, y: 5 }, {
            opacity: 1,
            y: 0,
            duration: 0.25,
          }, '-=0.1')
          .to(root.current, {
            opacity: 0,
            duration: 0.3,
            onComplete,
          }, '+=0.25');
      }, root);

      return () => ctx.revert();
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { overwrite: 'auto' },
      });

      /*
       * 0.00 — 0.55
       * VOID
       */
      tl.addLabel('void')
        .set(root.current, { '--portal-progress': 0 })
        .to({}, { duration: 0.42 })

        /*
         * 0.42 — 0.92
         * THE FIRST BREATH
         */
        .fromTo('[data-genesis-point]',
          { opacity: 0, scale: 0.2 },
          { opacity: 1, scale: 1, duration: 0.38, ease: 'power2.out' },
          '+=0.02'
        )
        .to('[data-genesis-point]', {
          opacity: 0.42,
          scale: 0.72,
          duration: 0.18,
          ease: 'power1.inOut',
        })

        /*
         * ARCHITECTURE
         * Precise, engraved, warm.
         */
        .addLabel('architecture')
        .to('[data-genesis-construction]', {
          opacity: 1,
          duration: 0.22,
          ease: 'power1.out',
        }, 'architecture')
        .to('[data-genesis-a]', {
          strokeDashoffset: 0,
          duration: 0.92,
          ease: 'power2.inOut',
        }, 'architecture+=0.08')
        .to('[data-genesis-guides]', {
          opacity: 0.55,
          duration: 0.55,
          ease: 'sine.out',
        }, 'architecture+=0.2')

        /*
         * FLUIDITY
         * Organic, pearl/teal, deliberately different from the A.
         */
        .addLabel('fluidity', 'architecture+=0.48')
        .to('[data-genesis-fluid-glow]', {
          opacity: 0.55,
          duration: 0.35,
        }, 'fluidity')
        .to('[data-genesis-l]', {
          strokeDashoffset: 0,
          duration: 1.02,
          ease: 'sine.inOut',
        }, 'fluidity')
        .to('[data-genesis-fluid-dot]', {
          motionPath: {
            path: '[data-genesis-l]',
            align: '[data-genesis-l]',
            alignOrigin: [0.5, 0.5],
          },
          duration: 1.02,
          ease: 'sine.inOut',
        }, 'fluidity')

        /*
         * SIGNATURES
         */
        .addLabel('signatures', 'fluidity+=0.55')
        .fromTo('[data-genesis-ammar]',
          { opacity: 0, y: 7, letterSpacing: '0.55em' },
          { opacity: 0.72, y: 0, letterSpacing: '0.34em', duration: 0.32 },
          'signatures'
        )
        .fromTo('[data-genesis-leqaa]',
          { opacity: 0, y: 7, letterSpacing: '0.55em' },
          { opacity: 0.72, y: 0, letterSpacing: '0.34em', duration: 0.32 },
          'signatures+=0.12'
        )
        .to(['[data-genesis-ammar]', '[data-genesis-leqaa]'], {
          opacity: 0,
          duration: 0.28,
        }, 'signatures+=0.52')

        /*
         * GRAVITY / COLLISION
         */
        .addLabel('gravity', 'signatures+=0.62')
        .to('[data-genesis-a-system]', {
          x: 20,
          y: -5,
          rotate: -4,
          duration: 0.48,
          ease: 'power3.inOut',
        }, 'gravity')
        .to('[data-genesis-l-system]', {
          x: -20,
          y: 5,
          rotate: 4,
          duration: 0.48,
          ease: 'power3.inOut',
        }, 'gravity')
        .to('[data-genesis-a-system]', {
          x: 7,
          y: 1,
          rotate: 2,
          duration: 0.22,
          ease: 'power2.in',
        }, 'gravity+=0.48')
        .to('[data-genesis-l-system]', {
          x: -7,
          y: -1,
          rotate: -2,
          duration: 0.22,
          ease: 'power2.in',
        }, 'gravity+=0.48')

        .addLabel('collision', 'gravity+=0.62')
        .to(['[data-genesis-a-system]', '[data-genesis-l-system]'], {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 0.91,
          duration: 0.34,
          ease: 'power4.in',
        }, 'collision')
        .fromTo('[data-genesis-forge-light]',
          { opacity: 0, scale: 0.4 },
          { opacity: 0.9, scale: 1, duration: 0.16, ease: 'power2.out' },
          'collision+=0.26'
        )
        .to('[data-genesis-forge-light]', {
          opacity: 0,
          scale: 1.9,
          duration: 0.34,
          ease: 'power2.out',
        }, 'collision+=0.42')

        /*
         * FORGING
         */
        .addLabel('forging', 'collision+=0.55')
        .to('[data-genesis-construction], [data-genesis-a-system], [data-genesis-l-system], [data-genesis-fluid-glow], [data-genesis-guides]', {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        }, 'forging')
        .to('[data-genesis-forged-ring]', {
          opacity: 0.72,
          scale: 1,
          duration: 0.42,
          ease: 'power2.out',
        }, 'forging+=0.08')

        /*
         * LOGO REVEAL
         * The official AL mark is the identity anchor; no hand-drawn
         * substitute is ever presented as the brand logo.
         */
        .addLabel('logoReveal', 'void+=0.4')
        .fromTo('[data-genesis-logo-frame]',
          { opacity: 0, scale: 0.84, rotateX: 9 },
          { opacity: 1, scale: 1, rotateX: 0, duration: 0.58, ease: 'power3.out' },
          'logoReveal'
        )
        .fromTo('[data-genesis-logo-outline]',
          { opacity: 0, scale: 0.96 },
          { opacity: 0.9, scale: 1, duration: 0.42, ease: 'power2.out' },
          'logoReveal+=0.08'
        )
        .fromTo('[data-genesis-official-logo]',
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.52, ease: 'power3.out' },
          'logoReveal+=0.18'
        )
        .to('[data-genesis-official-logo]', {
          filter: 'brightness(1.14) drop-shadow(0 0 18px rgba(226,196,132,.26))',
          duration: 0.28,
          yoyo: true,
          repeat: 1,
          ease: 'sine.inOut',
        }, 'logoReveal+=0.44')
        .fromTo('[data-genesis-sweep]',
          { xPercent: -155, opacity: 0 },
          { xPercent: 155, opacity: 0.75, duration: 0.72, ease: 'power2.inOut' },
          'logoReveal+=0.42'
        )
        .to('[data-genesis-sweep]', {
          opacity: 0,
          duration: 0.18,
        }, 'logoReveal+=1.04')

        /*
         * WORLDS
         * Images appear as atmospheric material, not cards.
         */
        .addLabel('worlds', 'logoReveal+=0.94')
        .fromTo('[data-genesis-aurelia]',
          { opacity: 0, xPercent: -7, scale: 1.08 },
          { opacity: 0.56, xPercent: 0, scale: 1, duration: 0.62, ease: 'power2.out' },
          'worlds'
        )
        .fromTo('[data-genesis-marisol]',
          { opacity: 0, xPercent: 7, scale: 1.08 },
          { opacity: 0.56, xPercent: 0, scale: 1, duration: 0.62, ease: 'power2.out' },
          'worlds+=0.08'
        )
        .fromTo('[data-genesis-world-caption]',
          { opacity: 0, y: 5 },
          { opacity: 0.58, y: 0, duration: 0.32 },
          'worlds+=0.28'
        )
        .to('[data-genesis-world-caption]', {
          opacity: 0,
          duration: 0.22,
        }, 'worlds+=0.92')
        .to(['[data-genesis-aurelia]', '[data-genesis-marisol]'], {
          opacity: 0.12,
          duration: 0.34,
          ease: 'power2.in',
        }, 'worlds+=0.96')

        /*
         * BRAND LOCKUP
         */
        .addLabel('brandLockup', 'worlds+=0.96')
        .fromTo('[data-genesis-name]',
          { opacity: 0, y: 8, letterSpacing: '0.48em' },
          { opacity: 1, y: 0, letterSpacing: '0.28em', duration: 0.42, ease: 'power2.out' },
          'brandLockup'
        )
        .fromTo('[data-genesis-origin]',
          { opacity: 0, scaleX: 0 },
          { opacity: 0.42, scaleX: 1, duration: 0.28, ease: 'power2.out' },
          'brandLockup+=0.1'
        )

        /*
         * A short stillness beat.
         * This is where the experience feels expensive rather than busy.
         */
        .addLabel('portal', 'brandLockup+=0.68')
        .addPause('portal');

      let released = false;
      let safetyTimer;

      const releasePortal = () => {
        if (released) return;
        released = true;
        clearTimeout(safetyTimer);
        tl.play('portal');
      };

      /*
       * The visual sequence reaches the portal around 5.8–6.1s.
       * We wait for readiness only at the end. If readiness is late, cap
       * the hold so the entrance never becomes an accidental loading screen.
       */
      appReady.then(() => {
        if (tl.time() >= tl.labels.portal) {
          releasePortal();
        } else {
          const remaining = Math.max(0, tl.labels.portal - tl.time());
          gsap.delayedCall(remaining, releasePortal);
        }
      });

      safetyTimer = setTimeout(releasePortal, 6800);

      /*
       * PORTAL
       */
      tl.to('[data-genesis-worlds]', {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      }, 'portal')
        .to('[data-genesis-name], [data-genesis-origin]', {
          opacity: 0,
          duration: 0.24,
        }, 'portal')
        .to('[data-genesis-forged-ring]', {
          opacity: 0,
          scale: 1.1,
          duration: 0.28,
        }, 'portal')
        .to('[data-genesis-logo-frame]', {
          scale: 1.06,
          duration: 0.22,
          ease: 'power2.out',
        }, 'portal+=0.05')
        .to('[data-genesis-portal-circle]', {
          attr: { r: '155%' },
          duration: 1.02,
          ease: 'power4.inOut',
        }, 'portal+=0.2')
        .to('[data-genesis-logo-frame]', {
          opacity: 0,
          scale: 1.16,
          duration: 0.5,
          ease: 'power2.in',
        }, 'portal+=0.42')
        .to(root.current, {
          opacity: 0,
          duration: 0.42,
          ease: 'power2.out',
          onComplete,
        }, 'portal+=0.92')
        .addLabel('exit');

      /*
       * If reduced hardware/mobile is detected, preserve the narrative but
       * remove the expensive geometry and image depth.
       */
      if (simplified) {
        gsap.set('[data-genesis-a-system], [data-genesis-l-system], [data-genesis-construction], [data-genesis-guides], [data-genesis-forge-light], [data-genesis-fluid-glow], [data-genesis-fluid-dot], [data-genesis-forged-ring], [data-genesis-world-caption]', { display: 'none' });
        gsap.set(['[data-genesis-aurelia]', '[data-genesis-marisol]'], { opacity: 0 });
      }

      return () => {
        clearTimeout(safetyTimer);
      };
    }, root);

    return () => ctx.revert();
  }, [onComplete, reducedMotion, simplified]);

  useLayoutEffect(() => {
    if (
      reducedMotion ||
      simplified ||
      !window.matchMedia('(pointer: fine)').matches
    ) {
      return undefined;
    }

    const el = root.current;
    if (!el) return undefined;

    const moveX = gsap.quickTo(el, '--genesis-light-x', {
      duration: 0.9,
      ease: 'power3.out',
    });
    const moveY = gsap.quickTo(el, '--genesis-light-y', {
      duration: 0.9,
      ease: 'power3.out',
    });

    const onMove = (event) => {
      moveX((event.clientX / window.innerWidth - 0.5) * 12);
      moveY((event.clientY / window.innerHeight - 0.5) * 8);
    };

    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [reducedMotion, simplified]);

  return (
    <div
      ref={root}
      className={styles.genesis}
      role="status"
      aria-label="Entering AL Hospitality Group"
    >
      <svg className={styles.portalSvg} aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="genesisVoid" cx="50%" cy="48%" r="72%">
            <stop offset="0%" stopColor="#17100e" />
            <stop offset="56%" stopColor="#090807" />
            <stop offset="100%" stopColor="#030303" />
          </radialGradient>

          <filter id="genesisSoftGlow">
            <feGaussianBlur stdDeviation="7" />
          </filter>

          <mask id="genesisPortalMask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <circle
              data-genesis-portal-circle
              cx="50%"
              cy="50%"
              r="0%"
              fill="black"
            />
          </mask>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill="url(#genesisVoid)"
          mask="url(#genesisPortalMask)"
        />
      </svg>

      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div data-genesis-point className={styles.point} aria-hidden="true" />
      <div data-genesis-forge-light className={styles.forgeLight} aria-hidden="true" />

      <div data-genesis-worlds className={styles.worlds} aria-hidden="true">
        <div data-genesis-aurelia className={`${styles.world} ${styles.worldAurelia}`} />
        <div data-genesis-marisol className={`${styles.world} ${styles.worldMarisol}`} />
      </div>

      <div data-genesis-world-caption className={styles.worldCaption} aria-hidden="true">
        <span>AURELIA</span>
        <i />
        <span>MARISOL</span>
      </div>

      <svg className={styles.geometry} viewBox="0 0 420 240" aria-hidden="true" focusable="false">
        <g data-genesis-construction className={styles.construction}>
          <circle data-genesis-guides cx="210" cy="120" r="92" />
          <circle data-genesis-guides cx="210" cy="120" r="67" strokeDasharray="1 8" />
          <path data-genesis-guides d="M45 120 H375" />
          <path data-genesis-guides d="M210 28 V212" />
          <path data-genesis-guides d="M90 191 L210 34 L330 191" />
        </g>

        <g data-genesis-a-system className={styles.aSystem}>
          <path
            data-genesis-a
            pathLength="1"
            d="M112 180 L169 45 L226 180"
          />
          <path d="M134 125 H204" />
          <path d="M150 87 H188" />
        </g>

        <g data-genesis-l-system className={styles.lSystem}>
          <path
            data-genesis-l
            pathLength="1"
            d="M279 42 C258 73 258 115 271 143 C283 169 311 179 351 174"
          />
          <circle data-genesis-fluid-dot r="3.2" cx="279" cy="42" />
        </g>
      </svg>

      <div data-genesis-fluid-glow className={styles.fluidGlow} aria-hidden="true" />
      <div data-genesis-forged-ring className={styles.forgedRing} aria-hidden="true" />

      <div data-genesis-logo-frame className={styles.logoFrame}>
        <span data-genesis-logo-outline className={styles.logoOutline} />

        <img
          data-genesis-official-logo
          className={styles.officialLogo}
          src="/images/brand/al-logo.png"
          alt="AL Hospitality Group"
        />

        <span data-genesis-sweep className={styles.sweep} />
      </div>

      <p data-genesis-name className={styles.name}>AL HOSPITALITY GROUP</p>
      <span data-genesis-origin className={styles.originLine} aria-hidden="true" />

      <p data-genesis-ammar className={`${styles.signature} ${styles.ammar}`}>AMMAR</p>
      <p data-genesis-leqaa className={`${styles.signature} ${styles.leqaa}`}>LEQAA</p>
    </div>
  );
}
