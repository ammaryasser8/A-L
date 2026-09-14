import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUpRight,
  Compass,
  Sparkles,
} from 'lucide-react';
import { motion, useInView } from 'motion/react';

import { useHotelBySlug } from '../hooks/useHotelBySlug';
import { useHotelProducts } from '../hooks/useHotelProducts';

import AureliaHeader from '../components/layout/AureliaHeader';
import AureliaSidebar from '../components/layout/AureliaSidebar';
import ProductCard from '../components/shared/ProductCard';

import styles from './AureliaCategoryPage.module.css';

const categoryContent = {
  Rooms: {
    eyebrow: 'THE ART OF STAYING',
    title: 'Rooms',
    italic: 'Quietly considered.',
    description:
      'Refined spaces shaped around light, comfort and the timeless character of Cairo.',
  },

  Suites: {
    eyebrow: 'THE AURELIA SUITES',
    title: 'Suites',
    italic: 'Made for lingering.',
    description:
      'Generous proportions, private moments and a sense of effortless grandeur.',
  },

  Pools: {
    eyebrow: 'THE WATER RITUAL',
    title: 'Pools',
    italic: 'A slower rhythm.',
    description:
      'Sunlit waters and secluded corners designed for unhurried afternoons.',
  },

  Restaurants: {
    eyebrow: 'THE TABLE',
    title: 'Dining',
    italic: 'An art worth savoring.',
    description:
      'Distinctive dining experiences where Egyptian character meets contemporary craft.',
  },

  'Spa & Wellness': {
    eyebrow: 'THE RITUAL',
    title: 'Wellness',
    italic: 'Where time slows down.',
    description:
      'Restorative rituals created to bring body, mind and surroundings into balance.',
  },

  Services: {
    eyebrow: 'THE AURELIA STANDARD',
    title: 'Services',
    italic: 'Nothing left to chance.',
    description:
      'Thoughtful details and intuitive service, delivered with quiet confidence.',
  },
};

const defaultContent = {
  eyebrow: 'THE AURELIA COLLECTION',
  title: 'Explore Aurelia',
  italic: 'Every stay tells a story.',
  description:
    'Discover a collection of rooms, suites, dining rituals and experiences created around the art of exceptional hospitality.',
};

/* =========================================================
   REVEAL
   ========================================================= */

function Reveal({
  children,
  delay = 0,
  className = '',
  y = 45,
}) {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.15,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y,
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
            }
          : {}
      }
      transition={{
        duration: 1,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   FLOATING ORB
   ========================================================= */

function FloatingOrb({ className }) {
  return (
    <motion.div
      className={`${styles.floatingOrb} ${className}`}
      animate={{
        y: [0, -18, 0],
        x: [0, 8, 0],
        scale: [1, 1.04, 1],
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/* =========================================================
   LUXURY DIVIDER
   ========================================================= */

function LuxuryDivider() {
  return (
    <div className={styles.luxuryDivider}>
      <span />
      <div>
        <Sparkles size={13} strokeWidth={1} />
      </div>
      <span />
    </div>
  );
}

/* =========================================================
   HERO TITLE
   ========================================================= */

function HeroTitle({ title }) {
  const words = title.split(' ');

  return (
    <h1 className={styles.heroTitle}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className={styles.heroTitleWord}
        >
          <motion.span
            initial={{
              y: '110%',
              opacity: 0,
            }}
            animate={{
              y: '0%',
              opacity: 1,
            }}
            transition={{
              duration: 1.15,
              delay: 0.18 + index * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

/* =========================================================
   PAGE
   ========================================================= */

export default function AureliaCategoryPage() {
  const hotel = useHotelBySlug('aurelia-grand-hotel');

  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const products = useHotelProducts(
    hotel?.id,
    selectedCategory || undefined
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedCategory]);

  if (!hotel) {
    return (
      <div className={styles.notFound}>
        Hotel not found.
      </div>
    );
  }

  const themeVars = {
    '--theme-primary':
      hotel.theme?.colors?.primary || '#5A1F29',

    '--theme-primary-dark':
      hotel.theme?.colors?.primaryDark || '#281014',

    '--theme-accent':
      hotel.theme?.colors?.accent || '#C9A86A',

    '--theme-accent-light':
      hotel.theme?.colors?.accentLight || '#E7D2A2',

    '--theme-surface':
      hotel.theme?.colors?.surface || '#F4EFE7',

    '--theme-surface-dark':
      hotel.theme?.colors?.surfaceDark || '#201315',

    '--theme-on-primary':
      hotel.theme?.colors?.onPrimary || '#F8F3EA',

    '--theme-ink':
      hotel.theme?.colors?.ink || '#211916',

    '--theme-muted': '#82786E',

    '--font-heading':
      hotel.theme?.fonts?.heading ||
      '"Cormorant Garamond", Georgia, serif',

    '--font-body':
      hotel.theme?.fonts?.body ||
      '"Manrope", Arial, sans-serif',
  };

  const categories = hotel.categories || [];

  const visibleCategories = selectedCategory
    ? categories.filter(
        (category) => category === selectedCategory
      )
    : categories;

  const content =
    categoryContent[selectedCategory] || defaultContent;

  const isFiltered = Boolean(selectedCategory);

  return (
    <div
      className={styles.page}
      style={themeVars}
    >
      <AureliaHeader
        onMenuClick={() => setSidebarOpen(true)}
      />

      <AureliaSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className={styles.hero}>
          <motion.div
            className={styles.heroImage}
            initial={{
              scale: 1.12,
              opacity: 0,
            }}
            animate={{
              scale: 1.02,
              opacity: 1,
            }}
            transition={{
              duration: 2,
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          <div className={styles.heroOverlay} />

          <motion.div
            className={styles.heroGlow}
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <FloatingOrb
            className={styles.heroOrbOne}
          />

          <FloatingOrb
            className={styles.heroOrbTwo}
          />

          <motion.div
            className={styles.heroTopLabel}
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.35,
            }}
          >
            <span>AURELIA</span>
            <i />
            <span>CAIRO</span>
          </motion.div>

          <div className={styles.heroContent}>

            <Reveal y={35}>
              <p className={styles.heroEyebrow}>
                {content.eyebrow}
              </p>
            </Reveal>

            <HeroTitle title={content.title} />

            <Reveal delay={0.35} y={35}>
              <p className={styles.heroItalic}>
                {content.italic}
              </p>
            </Reveal>

            <Reveal delay={0.45} y={25}>
              <p className={styles.heroDescription}>
                {content.description}
              </p>
            </Reveal>

            <Reveal delay={0.55} y={20}>
              <a
                href="#collection"
                className={styles.heroButton}
              >
                <span>
                  Explore the collection
                </span>

                <motion.span
                  className={styles.heroButtonIcon}
                  animate={{
                    y: [0, 5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <ArrowDown
                    size={17}
                    strokeWidth={1.3}
                  />
                </motion.span>
              </a>
            </Reveal>

          </div>

          <motion.div
            className={styles.heroBottom}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 1,
              duration: 1,
            }}
          >
            <span>
              SCROLL TO DISCOVER
            </span>

            <div className={styles.heroScroll}>
              <motion.span
                animate={{
                  y: [0, 22, 0],
                  opacity: [1, 0.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>
        </section>

        {/* =====================================================
            INTRO
        ===================================================== */}

        <section className={styles.intro}>
          <div className={styles.introGlow} />

          <div className={styles.introInner}>

            <Reveal>
              <p className={styles.eyebrow}>
                A DIFFERENT KIND OF LUXURY
              </p>
            </Reveal>

            <div className={styles.introGrid}>

              <Reveal>
                <h2>
                  Designed around
                  <br />
                  <em>how you feel.</em>
                </h2>
              </Reveal>

              <Reveal delay={0.12}>
                <div className={styles.introCopy}>

                  <p>
                    At Aurelia, every space is shaped
                    around a feeling — calm mornings,
                    lingering evenings and moments that
                    deserve to last a little longer.
                  </p>

                  <p>
                    Discover rooms, suites, dining and
                    experiences designed with a quiet
                    confidence that never needs to
                    announce itself.
                  </p>

                  <Link
                    to="/hotels/aurelia-grand-hotel"
                    className={styles.textLink}
                  >
                    <span>
                      Return to Aurelia
                    </span>

                    <ArrowUpRight
                      size={17}
                      strokeWidth={1.3}
                    />
                  </Link>

                </div>
              </Reveal>

            </div>

            <LuxuryDivider />

          </div>
        </section>

        {/* =====================================================
            COLLECTION
        ===================================================== */}

        <section
          id="collection"
          className={styles.collection}
        >
          <div className={styles.collectionAmbient} />

          <div className={styles.collectionInner}>

            <Reveal>
              <div className={styles.collectionHeading}>

                <div>
                  <p className={styles.eyebrow}>
                    {isFiltered
                      ? 'THE PRIVATE COLLECTION'
                      : 'THE AURELIA COLLECTION'}
                  </p>

                  <h2>
                    {isFiltered
                      ? content.title
                      : 'Find your place.'}
                  </h2>
                </div>

                <p className={styles.collectionDescription}>
                  {isFiltered
                    ? content.description
                    : 'A considered collection of spaces, rituals and experiences.'}
                </p>

              </div>
            </Reveal>

            {visibleCategories.map((category) => {

              const categoryProducts =
                products.filter(
                  (product) =>
                    product.category === category
                );

              if (categoryProducts.length === 0) {
                return null;
              }

              const categoryInfo =
                categoryContent[category] ||
                defaultContent;

              return (
                <section
                  key={category}
                  className={styles.categoryBlock}
                >

                  {!isFiltered && (
                    <Reveal>
                      <div className={styles.categoryHeader}>

                        <div>
                          <p className={styles.categoryEyebrow}>
                            {categoryInfo.eyebrow}
                          </p>

                          <h3>
                            {category === 'Restaurants'
                              ? 'Dining'
                              : category}
                          </h3>

                          <p className={styles.categoryItalic}>
                            {categoryInfo.italic}
                          </p>
                        </div>

                        <p className={styles.categoryDescription}>
                          {categoryInfo.description}
                        </p>

                      </div>
                    </Reveal>
                  )}

                  <div className={styles.productGrid}>

                    {categoryProducts.map(
                      (product, index) => (
                        <motion.div
                          key={product.id}
                          className={styles.productItem}
                          initial={{
                            opacity: 0,
                            y: 70,
                            scale: 0.97,
                          }}
                          whileInView={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                          }}
                          viewport={{
                            once: true,
                            amount: 0.08,
                          }}
                          transition={{
                            duration: 1,
                            delay:
                              Math.min(index, 5) *
                              0.1,
                            ease: [
                              0.16,
                              1,
                              0.3,
                              1,
                            ],
                          }}
                        >
                          <div
                            className={
                              styles.productGlow
                            }
                          />

                          <ProductCard
                            product={product}
                            hotelSlug={hotel.slug}
                          />
                        </motion.div>
                      )
                    )}

                  </div>

                </section>
              );
            })}

            {products.length === 0 && (
              <div className={styles.emptyState}>

                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <Compass
                    size={31}
                    strokeWidth={0.8}
                  />
                </motion.div>

                <p>
                  THE COLLECTION
                </p>

                <h2>
                  Something beautiful
                  <br />
                  is coming.
                </h2>

                <span>
                  This collection is currently
                  being curated. Please return
                  shortly.
                </span>

              </div>
            )}

          </div>
        </section>

        {/* =====================================================
            PHILOSOPHY
        ===================================================== */}

        <section className={styles.philosophy}>

          <motion.div
            className={styles.philosophyImage}
            initial={{
              scale: 1.1,
            }}
            whileInView={{
              scale: 1.02,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 1.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          <div className={styles.philosophyOverlay} />

          <FloatingOrb
            className={styles.philosophyOrb}
          />

          <div className={styles.philosophyContent}>

            <Reveal>
              <p className={styles.eyebrow}>
                THE AURELIA PHILOSOPHY
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2>
                Luxury should feel
                <br />
                <em>effortless.</em>
              </h2>
            </Reveal>

            <Reveal delay={0.18}>
              <LuxuryDivider />
            </Reveal>

            <Reveal delay={0.24}>
              <p className={styles.philosophyText}>
                Beautiful surroundings.
                <br />
                Thoughtful service.
                <br />
                The freedom to slow down.
              </p>
            </Reveal>

          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section className={styles.finalCta}>

          <motion.div
            className={styles.finalCtaImage}
            initial={{
              scale: 1.1,
            }}
            whileInView={{
              scale: 1.02,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 2,
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          <div className={styles.finalCtaOverlay} />

          <motion.div
            className={styles.finalCtaGlow}
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.45, 0.75, 0.45],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <div className={styles.finalCtaContent}>

            <Reveal>
              <p className={styles.eyebrow}>
                AURELIA GRAND HOTEL
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2>
                Stay somewhere
                <br />
                <em>worth remembering.</em>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <Link
                to="/hotels/aurelia-grand-hotel"
                className={styles.finalButton}
              >
                <span>
                  Discover Aurelia
                </span>

                <ArrowUpRight
                  size={18}
                  strokeWidth={1.2}
                />
              </Link>
            </Reveal>

          </div>

        </section>

      </main>
    </div>
  );
}