import { useEffect, useRef } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import BookingBar from '../shared/BookingBar';
import styles from './AureliaHero.module.css';

gsap.registerPlugin(ScrollTrigger);

const storyItems = [
  {
    number: '01',
    label: 'WELLNESS',
    title: 'Where Time Slows Down',
    text: 'Escape into a tranquil world designed for complete relaxation, renewal, and quiet moments of indulgence.',
    image: '/images/aurelia/spa.jpg',
  },
  {
    number: '02',
    label: 'THE STAY',
    title: 'Your Private Sanctuary',
    text: 'Discover beautifully crafted spaces where comfort, character, and understated luxury come together.',
    image: '/images/aurelia/suite.jpg',
  },
  {
    number: '03',
    label: 'DINING',
    title: 'An Art Worth Savoring',
    text: 'From intimate dinners to unforgettable evenings, every detail is designed around the pleasure of the moment.',
    image: '/images/aurelia/dining.jpg',
  },
  {
    number: '04',
    label: 'THE MOMENT',
    title: 'Stay for the Sunset',
    text: 'End the day surrounded by beauty, warm light, and the unmistakable feeling of being somewhere special.',
    image: '/images/aurelia/pool.jpg',
  },
];

export default function AureliaHero({ hotel }) {
  const heroRef = useRef(null);
  const stageRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    // Keep the supplied film at an unhurried pace. The previous 1.5x rate
    // and forced 20-second reset made the hero feel like it was flickering.
    video.playbackRate = 0.92;

    const handleLoaded = () => {
      video.playbackRate = 0.92;
    };

    video.addEventListener('loadedmetadata', handleLoaded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;

    if (!hero || !stage) return;

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray(
        `.${styles.storySlide}`
      );

      const intro = stage.querySelector(
        `.${styles.heroContent}`
      );

      const scrollCue = stage.querySelector(
        `.${styles.scrollCue}`
      );

      const video = stage.querySelector(
        `.${styles.heroVideo}`
      );

      if (!slides.length) return;

      gsap.set(slides, {
        autoAlpha: 0,
        scale: 1.08,
      });

      gsap.set(intro, {
        autoAlpha: 1,
        y: 0,
      });

      gsap.set(scrollCue, {
        autoAlpha: 1,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '+=5600',
          pin: stage,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /* =================================
         INTRO HOLD
      ================================= */

      timeline.to({}, {
        duration: 1.4,
      });


      /* =================================
         INTRO EXIT
      ================================= */

      timeline.to(intro, {
        autoAlpha: 0,
        y: -70,
        duration: 0.8,
        ease: 'power3.inOut',
      });

      timeline.to(
        scrollCue,
        {
          autoAlpha: 0,
          duration: 0.35,
        },
        '<'
      );


      /* =================================
         VIDEO DARKEN
      ================================= */

      timeline.to(
        video,
        {
          scale: 1.04,
          duration: 0.8,
          ease: 'power2.out',
        },
        '<'
      );


      /* =================================
         STORY
      ================================= */

      slides.forEach((slide, index) => {
        const image = slide.querySelector(
          `.${styles.storyImage}`
        );

        const text = slide.querySelector(
          `.${styles.storyText}`
        );

        const number = slide.querySelector(
          `.${styles.storyNumber}`
        );

        const title = slide.querySelector(
          `.${styles.storyTitle}`
        );

        const description = slide.querySelector(
          `.${styles.storyDescription}`
        );

        const previousSlide = slides[index - 1];

        gsap.set(text, {
          y: 50,
          autoAlpha: 0,
        });

        timeline.to(
          slide,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
          }
        );

        timeline.to(
          image,
          {
            scale: 1,
            duration: 2,
            ease: 'none',
          },
          '<'
        );

        timeline.to(
          text,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            ease: 'power3.out',
          },
          '-=0.35'
        );

        timeline.to(
          [number, title, description],
          {
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
          },
          '<'
        );

        timeline.to({}, {
          duration: 1.6,
        });

        if (previousSlide) {
          timeline.to(
            previousSlide,
            {
              autoAlpha: 0,
              scale: 1.02,
              duration: 0.8,
              ease: 'power2.inOut',
            }
          );
        }
      });
    }, hero);

    return () => ctx.revert();
  }, []);

  function handleDiscover() {
    document
      .getElementById('about')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
  }

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      id="hero"
    >

      <div
        ref={stageRef}
        className={styles.stickyStage}
      >

        {/* VIDEO */}

        <video
          ref={videoRef}
          className={styles.heroVideo}
          src="/videos/aurelia-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />

        <div className={styles.videoOverlay} />

        <div className={styles.vignette} />


        {/* INTRO */}

        <div className={styles.heroContent}>

          <div className={styles.heroMeta}>
            CAIRO · THE NILE · 2011
          </div>

          <div className={styles.heroEyebrow}>
            {hotel.tagline}
          </div>

          <h1>
            Where Cairo
            <br />
            <span>Becomes Timeless.</span>
          </h1>

          <p>
            A five-star Nile-front retreat where
            the grandeur of yesterday meets the
            quiet luxury of today.
          </p>


          <div className={styles.heroActions}>

            <button
              type="button"
              className={styles.btnGold}
              onClick={handleDiscover}
            >
              <span>Discover Aurelia</span>

              <ArrowUpRight
                size={16}
                strokeWidth={1.3}
              />
            </button>


            <button
              type="button"
              className={styles.btnOutline}
            >
              <span className={styles.playCircle}>
                <Play
                  size={10}
                  fill="currentColor"
                  strokeWidth={1}
                />
              </span>

              Watch film
            </button>

          </div>

        </div>


        {/* STORY */}

        <div className={styles.storyStage}>

          {storyItems.map((item) => (
            <article
              key={item.number}
              className={styles.storySlide}
            >

              <img
                src={item.image}
                alt={item.title}
                className={styles.storyImage}
              />

              <div className={styles.storyOverlay} />

              <div className={styles.storyText}>

                <div className={styles.storyNumber}>
                  <span>{item.number}</span>
                  <i />
                  <span>{item.label}</span>
                </div>

                <h2 className={styles.storyTitle}>
                  {item.title}
                </h2>

                <p className={styles.storyDescription}>
                  {item.text}
                </p>

              </div>

            </article>
          ))}

        </div>


        {/* SCROLL */}

        <div className={styles.scrollCue}>

          <div className={styles.scrollLine} />

          <span>
            SCROLL TO EXPLORE
          </span>

        </div>

      </div>


      {/* BOOKING */}

      <div className={styles.bookingWrap}>
        <BookingBar variant="light" />
      </div>

    </section>
  );
}
