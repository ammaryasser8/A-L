import { useEffect, useState } from 'react';

import { ArrowUpRight } from 'lucide-react';

import { motion } from 'motion/react';

import { Link } from 'react-router-dom';

import { useHotelBySlug } from '../hooks/useHotelBySlug';
import { useDocumentTitle, useMetaDescription } from '../hooks/useDocumentTitle';
import { useAureliaAnimations } from '../hooks/useAureliaAnimations';

import AureliaHeader from '../components/layout/AureliaHeader';
import AureliaSidebar from '../components/layout/AureliaSidebar';
import AureliaFooter from '../components/layout/AureliaFooter';
import AureliaHero from '../components/hotel/AureliaHero';
import Reveal from '../components/hotel/AureliaReveal';
import LuxuryLink from '../components/hotel/AureliaLuxuryLink';
import ImageReveal from '../components/hotel/AureliaImageReveal';
import CinematicStory from '../components/hotel/AureliaCinematicStory';

import styles from './AureliaHotelPage.module.css';


export default function AureliaHotelPage() {
  const hotel = useHotelBySlug(
    'aurelia-grand-hotel'
  );

  useDocumentTitle(hotel?.name);
  useMetaDescription(hotel ? `${hotel.tagline} — ${hotel.description}` : undefined);

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

      <main id="main-content">

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
      <AureliaFooter hotel={hotel} />
    </div>
  );
}