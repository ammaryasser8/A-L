import { useEffect, useRef, useState } from 'react';

import {
  ArrowDown,
  ArrowUpRight,
} from 'lucide-react';

import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from 'motion/react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Link } from 'react-router-dom';

import { useHotelBySlug } from '../hooks/useHotelBySlug';

import AureliaHeader from '../components/layout/AureliaHeader';
import AureliaSidebar from '../components/layout/AureliaSidebar';
import AureliaHero from '../components/hotel/AureliaHero';

import styles from './AureliaHotelPage.module.css';

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   REVEAL
========================================================= */

function Reveal({
  children,
  delay = 0,
  className = '',
  amount = 0.2,
}) {
  const ref = useRef(null);

  const inView = useInView(ref, {
    once: true,
    amount,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: 45,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              y: 0,
            }
          : {}
      }
      transition={{
        duration: 1.05,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}


/* =========================================================
   LUXURY LINK
========================================================= */

function LuxuryLink({
  to,
  children,
  light = false,
}) {
  return (
    <Link
      to={to}
      className={`${styles.luxuryLink} ${
        light ? styles.luxuryLinkLight : ''
      }`}
    >
      <span className={styles.luxuryLinkText}>
        {children}
      </span>

      <span className={styles.luxuryLinkIcon}>
        <ArrowUpRight
          size={17}
          strokeWidth={1.25}
        />
      </span>

      <span className={styles.luxuryLinkLine} />
    </Link>
  );
}


/* =========================================================
   IMAGE REVEAL
========================================================= */

function ImageReveal({
  image,
  className = '',
  position = 'center',
}) {
  const ref = useRef(null);

  const inView = useInView(ref, {
    once: true,
    amount: 0.12,
  });

  return (
    <div
      ref={ref}
      className={`${styles.imageReveal} ${className}`}
    >
      <motion.div
        className={styles.imageRevealInner}
        style={{
          backgroundImage: `url("${image}")`,
          backgroundPosition: position,
        }}
        initial={{
          scale: 1.18,
          opacity: 0,
          filter: 'blur(5px)',
        }}
        animate={
          inView
            ? {
                scale: 1,
                opacity: 1,
                filter: 'blur(0px)',
              }
            : {}
        }
        transition={{
          duration: 1.8,
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      <motion.div
        className={styles.imageRevealGlow}
        initial={{
          opacity: 0,
        }}
        animate={
          inView
            ? {
                opacity: 1,
              }
            : {}
        }
        transition={{
          duration: 1.4,
          delay: 0.25,
        }}
      />

      <motion.div
        className={styles.imageRevealShine}
        initial={{
          x: '-120%',
          opacity: 0,
        }}
        animate={
          inView
            ? {
                x: '120%',
                opacity: [0, 0.35, 0],
              }
            : {}
        }
        transition={{
          duration: 1.8,
          delay: 0.35,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}


/* =========================================================
   CINEMATIC STORY
========================================================= */

function CinematicStory({
  id,
  image,
  eyebrow,
  title,
  text,
  side = 'left',
  to = '/hotels/aurelia-grand-hotel/explore',
}) {
  const ref = useRef(null);

  const {
    scrollYProgress,
  } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.16, 1.04, 1.12]
  );

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ['-4%', '4%']
  );

  const imageRotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.35, 0, -0.35]
  );

  const contentY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [65, 0, -45]
  );

  return (
    <section
      id={id}
      ref={ref}
      className={`${styles.cinematic} ${
        side === 'right'
          ? styles.cinematicRight
          : ''
      }`}
    >
      <motion.div
        className={styles.cinematicImage}
        style={{
          backgroundImage: `url("${image}")`,
          scale: imageScale,
          y: imageY,
          rotate: imageRotate,
        }}
      />

      <div className={styles.cinematicOverlay} />

      <div className={styles.cinematicVignette} />

      <motion.div
        className={styles.cinematicContent}
        style={{
          y: contentY,
        }}
      >
        <Reveal>
          <span className={styles.cinematicEyebrow}>
            {eyebrow}
          </span>

          <h2>{title}</h2>

          <p>{text}</p>

          <LuxuryLink
            to={to}
            light
          >
            Explore
          </LuxuryLink>
        </Reveal>
      </motion.div>

      <div className={styles.cinematicBottom}>
        <span>AURELIA GRAND HOTEL</span>

        <motion.div
          animate={{
            y: [0, 6, 0],
            opacity: [0.45, 1, 0.45],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <ArrowDown
            size={16}
            strokeWidth={1}
          />
        </motion.div>
      </div>
    </section>
  );
}


/* =========================================================
   PAGE GSAP
========================================================= */

function useAureliaAnimations() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {

      /* ---------------------------------------------
         GOLD DIVIDERS
      --------------------------------------------- */

      gsap.utils
        .toArray('[data-gsap-line]')
        .forEach((line) => {
          gsap.fromTo(
            line,
            {
              scaleX: 0,
              transformOrigin: 'left center',
            },
            {
              scaleX: 1,
              duration: 1.35,
              ease: 'power4.inOut',
              scrollTrigger: {
                trigger: line,
                start: 'top 88%',
                once: true,
              },
            }
          );
        });


      /* ---------------------------------------------
         TITLES
      --------------------------------------------- */

      gsap.utils
        .toArray('[data-gsap-title]')
        .forEach((title) => {
          gsap.fromTo(
            title,
            {
              opacity: 0,
              y: 55,
              filter: 'blur(7px)',
            },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1.25,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: title,
                start: 'top 84%',
                once: true,
              },
            }
          );
        });


      /* ---------------------------------------------
         IMAGE PARALLAX
      --------------------------------------------- */

      gsap.utils
        .toArray('[data-gsap-image]')
        .forEach((container) => {
          const image = container.querySelector(
            '[data-gsap-image-inner]'
          );

          if (!image) return;

          gsap.fromTo(
            image,
            {
              yPercent: -8,
              scale: 1.12,
            },
            {
              yPercent: 8,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: container,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.8,
              },
            }
          );
        });


      /* ---------------------------------------------
         IMAGE CLIP REVEAL
      --------------------------------------------- */

      gsap.utils
        .toArray('[data-gsap-image]')
        .forEach((container) => {
          gsap.fromTo(
            container,
            {
              clipPath: 'inset(0 0 100% 0)',
            },
            {
              clipPath: 'inset(0 0 0% 0)',
              duration: 1.5,
              ease: 'power4.inOut',
              scrollTrigger: {
                trigger: container,
                start: 'top 82%',
                once: true,
              },
            }
          );
        });


      /* ---------------------------------------------
         FLOATING GOLD ELEMENTS
      --------------------------------------------- */

      gsap.utils
        .toArray('[data-gsap-float]')
        .forEach((element, index) => {
          gsap.to(element, {
            y: index % 2 === 0 ? -12 : 12,
            duration: 4 + index * 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        });


      /* ---------------------------------------------
         ROOM IMAGE HOVER
      --------------------------------------------- */

      gsap.utils
        .toArray('[data-gsap-card]')
        .forEach((card) => {
          const image = card.querySelector(
            '[data-gsap-card-image]'
          );

          if (!image) return;

          const enter = () => {
            gsap.to(image, {
              scale: 1.075,
              duration: 1.15,
              ease: 'power3.out',
            });
          };

          const leave = () => {
            gsap.to(image, {
              scale: 1,
              duration: 1.25,
              ease: 'power3.out',
            });
          };

          card.addEventListener(
            'mouseenter',
            enter
          );

          card.addEventListener(
            'mouseleave',
            leave
          );
        });


      /* ---------------------------------------------
         ROOM CARD ENTRANCE
      --------------------------------------------- */

      gsap.utils
        .toArray('[data-gsap-card]')
        .forEach((card, index) => {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 80,
              rotateX: 4,
            },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 1.25,
              delay: index * 0.12,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 82%',
                once: true,
              },
            }
          );
        });


      /* ---------------------------------------------
         FINAL IMAGE
      --------------------------------------------- */

      const finalImage =
        rootRef.current.querySelector(
          '[data-final-image]'
        );

      if (finalImage) {
        gsap.fromTo(
          finalImage,
          {
            scale: 1.12,
            yPercent: -3,
          },
          {
            scale: 1.04,
            yPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: finalImage,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2,
            },
          }
        );
      }

    }, rootRef);

    return () => ctx.revert();
  }, []);

  return rootRef;
}


/* =========================================================
   MAIN PAGE
========================================================= */

export default function AureliaHotelPage() {
  const hotel = useHotelBySlug(
    'aurelia-grand-hotel'
  );

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const pageRef = useAureliaAnimations();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!hotel) {
    return (
      <div className={styles.notFound}>
        Hotel not found.
      </div>
    );
  }

  const themeStyle = {
    '--theme-primary':
      hotel.theme?.colors?.primary ||
      '#641f2d',

    '--theme-primary-dark':
      hotel.theme?.colors?.primaryDark ||
      '#241417',

    '--theme-accent':
      hotel.theme?.colors?.accent ||
      '#c7aa72',

    '--theme-accent-light':
      hotel.theme?.colors?.accentLight ||
      '#ead9b2',

    '--theme-surface':
      hotel.theme?.colors?.surface ||
      '#f3eee5',

    '--theme-surface-dark':
      hotel.theme?.colors?.surfaceDark ||
      '#191315',

    '--theme-on-primary':
      hotel.theme?.colors?.onPrimary ||
      '#ffffff',

    '--theme-ink':
      hotel.theme?.colors?.ink ||
      '#171415',
  };

  return (
    <div
      ref={pageRef}
      className={styles.page}
      style={themeStyle}
    >
      <AureliaHeader
        onMenuClick={() =>
          setSidebarOpen(true)
        }
      />

      <AureliaSidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <main>

        <AureliaHero hotel={hotel} />


        {/* =================================================
            INTRO
        ================================================= */}

        <section
          id="about"
          className={styles.intro}
        >
          <div className={styles.introGlow} />

          <div className={styles.introMeta}>
            <Reveal>
              <span>CAIRO · EGYPT</span>
            </Reveal>

            <Reveal delay={0.12}>
              <span>
                AURELIA GRAND HOTEL
              </span>
            </Reveal>
          </div>

          <div className={styles.introBody}>
            <Reveal>
              <span className={styles.eyebrow}>
                THE AURELIA EXPERIENCE
              </span>

              <h2 data-gsap-title>
                Stay
                <br />
                somewhere
                <br />
                <em>unforgettable.</em>
              </h2>
            </Reveal>

            <Reveal
              delay={0.15}
              className={styles.introDescription}
            >
              <p>
                A refined address in the heart
                of Cairo, where grand
                architecture, contemporary
                comfort and quietly exceptional
                service come together.
              </p>

              <LuxuryLink
                to="/hotels/aurelia-grand-hotel/explore"
              >
                Discover Aurelia
              </LuxuryLink>
            </Reveal>
          </div>

          <div className={styles.introBottom}>
            <span>EST. 2026</span>

            <div
              data-gsap-line
              className={styles.introLine}
            />

            <span>
              CAIRO / NILE / AURELIA
            </span>
          </div>
        </section>


        {/* =================================================
            ARRIVAL
        ================================================= */}

        <CinematicStory
          id="arrival"
          image="/images/aurelia/lobby.jpg"
          eyebrow="THE ARRIVAL"
          title={
            <>
              An entrance
              <br />
              <em>
                worth remembering.
              </em>
            </>
          }
          text="From the first step inside, Aurelia is designed to slow the world down. Warm light, generous spaces and an unmistakable sense of arrival."
          to="/hotels/aurelia-grand-hotel/explore"
        />


        {/* =================================================
            ARCHITECTURE
        ================================================= */}

        <section
          className={styles.architecture}
        >
          <div
            className={styles.architectureImage}
            data-gsap-image
          >
            <ImageReveal
              image="/images/aurelia/architecture.jpg"
              position="center"
            />

            <div
              className={styles.imageCaption}
            >
              <span>
                THE ARCHITECTURE
              </span>

              <span>
                CAIRO · AURELIA
              </span>
            </div>
          </div>

          <div
            className={styles.architectureCopy}
          >
            <div
              className={styles.architectureAccent}
              data-gsap-float
            />

            <Reveal>
              <span className={styles.eyebrow}>
                A SENSE OF PLACE
              </span>

              <h2 data-gsap-title>
                Old soul.
                <br />
                <em>New rhythm.</em>
              </h2>

              <p>
                Classical proportions meet
                a contemporary interpretation
                of Egyptian elegance. Nothing
                is excessive. Everything is
                considered.
              </p>

              <LuxuryLink
                to="/hotels/aurelia-grand-hotel/explore"
              >
                Explore the architecture
              </LuxuryLink>
            </Reveal>
          </div>
        </section>


        {/* =================================================
            ROOMS
        ================================================= */}

        <section
          id="rooms"
          className={styles.rooms}
        >
          <div className={styles.roomsTop}>
            <Reveal>
              <span className={styles.eyebrow}>
                THE STAY
              </span>

              <h2 data-gsap-title>
                Your room
                <br />
                <em>after dark.</em>
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p>
                Spaces created around the
                feeling of coming home to
                somewhere extraordinary.
              </p>
            </Reveal>
          </div>

          <div
            className={styles.roomComposition}
          >
            <motion.div
              className={styles.roomMain}
              data-gsap-card
              initial={{
                opacity: 0,
                y: 60,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 1.1,
                ease: [
                  0.16,
                  1,
                  0.3,
                  1,
                ],
              }}
            >
              <ImageReveal
                image="/images/aurelia/room.jpg"
                position="center"
              />

              <Link
                to="/hotels/aurelia-grand-hotel/explore?category=Rooms"
                className={styles.roomCardLink}
              >
                <div className={styles.roomTag}>
                  <span>
                    DELUXE ROOM
                  </span>

                  <span className={styles.roomArrow}>
                    <ArrowUpRight
                      size={17}
                      strokeWidth={1}
                    />
                  </span>
                </div>

                <span className={styles.roomCardHover}>
                  VIEW ROOM
                </span>
              </Link>
            </motion.div>


            <motion.div
              className={styles.roomSecondary}
              data-gsap-card
              initial={{
                opacity: 0,
                y: 75,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 1.2,
                delay: 0.12,
                ease: [
                  0.16,
                  1,
                  0.3,
                  1,
                ],
              }}
            >
              <ImageReveal
                image="/images/aurelia/roomm.jpg"
                position="center"
              />

              <Link
                to="/hotels/aurelia-grand-hotel/explore?category=Suites"
                className={styles.roomCardLink}
              >
                <div className={styles.roomTag}>
                  <span>
                    AURELIA SUITE
                  </span>

                  <span className={styles.roomArrow}>
                    <ArrowUpRight
                      size={17}
                      strokeWidth={1}
                    />
                  </span>
                </div>

                <span className={styles.roomCardHover}>
                  VIEW SUITE
                </span>
              </Link>
            </motion.div>

            <div
              className={styles.roomVerticalText}
            >
              <span>
                ROOMS / SUITES
              </span>
            </div>
          </div>

          <div
            className={styles.roomsFooter}
          >
            <span>
              24H CONCIERGE · CITY VIEWS ·
              PRIVATE DINING
            </span>

            <LuxuryLink
              to="/hotels/aurelia-grand-hotel/explore?category=Rooms"
            >
              View all rooms
            </LuxuryLink>
          </div>
        </section>


        {/* =================================================
            DINING
        ================================================= */}

        <CinematicStory
          id="dining"
          image="/images/aurelia/diningg.jpg"
          eyebrow="DINING AFTER DARK"
          title={
            <>
              Dinner
              <br />
              becomes
              <br />
              <em>
                an occasion.
              </em>
            </>
          }
          text="Intimate tables, refined flavours and an atmosphere designed for evenings that are never rushed."
          side="right"
          to="/hotels/aurelia-grand-hotel/explore?category=Restaurants"
        />


        {/* =================================================
            WELLNESS
        ================================================= */}

        <section
          id="wellness"
          className={styles.wellness}
        >
          <div
            className={styles.wellnessImage}
            data-gsap-image
          >
            <ImageReveal
              image="/images/aurelia/spaa.jpg"
              position="center"
            />
          </div>

          <div
            className={styles.wellnessCopy}
          >
            <Reveal>
              <span className={styles.eyebrow}>
                WELLNESS
              </span>

              <h2 data-gsap-title>
                Leave the
                <br />
                outside
                <br />
                <em>behind.</em>
              </h2>

              <p>
                A private world of warm
                water, restorative treatments
                and unhurried rituals designed
                to return you to yourself.
              </p>

              <LuxuryLink
                to="/hotels/aurelia-grand-hotel/explore?category=Spa%20%26%20Wellness"
              >
                Enter the spa
              </LuxuryLink>
            </Reveal>
          </div>
        </section>


        {/* =================================================
            FINAL CTA
        ================================================= */}

        <section
          id="booking"
          className={styles.final}
        >
          <motion.div
            className={styles.finalImage}
            data-final-image
            initial={{
              scale: 1.1,
            }}
            whileInView={{
              scale: 1.045,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 2,
              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
          />

          <div className={styles.finalOverlay} />

          <div className={styles.finalGlow} />

          <div className={styles.finalFrame} />

          <Reveal
            className={styles.finalContent}
          >
            <span className={styles.eyebrow}>
              AURELIA GRAND HOTEL
            </span>

            <h2 data-gsap-title>
              Your room
              <br />
              <em>is waiting.</em>
            </h2>

            <p>
              Come to Cairo.
              <br />
              Experience Aurelia.
            </p>

            <LuxuryLink
              to="/hotels/aurelia-grand-hotel/explore?category=Rooms"
              light
            >
              Begin your stay
            </LuxuryLink>
          </Reveal>

          <div className={styles.finalBottom}>
            <span>CAIRO · EGYPT</span>

            <span>AURELIA</span>

            <span>EST. 2026</span>
          </div>
        </section>

      </main>
    </div>
  );
}