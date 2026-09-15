import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Bath,
  BedDouble,
  Check,
  Maximize2,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  motion,
  useScroll,
  useTransform,
} from 'motion/react';

import products from '../data/products.json';
import { useHotelBySlug } from '../hooks/useHotelBySlug';
import { formatPrice } from '../utils/formatPrice';

import StarRating from '../components/shared/StarRating';
import Button from '../components/shared/Button';
import ReviewList from '../components/shared/ReviewList';
import NotFoundPage from './NotFoundPage';

import styles from './ProductDetailPage.module.css';

const amenityIcons = [
  Sparkles,
  Bath,
  BedDouble,
  Maximize2,
];

export default function ProductDetailPage() {
  const { hotelSlug, productSlug } = useParams();

  const hotel = useHotelBySlug(hotelSlug);

  const product = products.find(
    (p) =>
      p.slug === productSlug &&
      p.hotelId === hotel?.id
  );

  const [reserved, setReserved] = useState(false);

  if (!hotel || !product) {
    return <NotFoundPage />;
  }

  const collectionPath = hotel.id === 1
    ? `/hotels/${hotel.slug}/explore`
    : `/hotels/${hotel.slug}#rooms`;

  const themeVars = {
    '--theme-primary': hotel.theme.colors.primary,
    '--theme-primary-dark':
      hotel.theme.colors.primaryDark,
    '--theme-accent': hotel.theme.colors.accent,
    '--theme-accent-light':
      hotel.theme.colors.accentLight,
    '--theme-surface': hotel.theme.colors.surface,
    '--theme-surface-dark':
      hotel.theme.colors.surfaceDark,
    '--theme-on-primary':
      hotel.theme.colors.onPrimary,
    '--theme-ink': hotel.theme.colors.ink,
    '--theme-muted': '#88776a',
    '--font-heading': hotel.theme.fonts.heading,
    '--font-body': hotel.theme.fonts.body,
  };

  const imageSrc = product.images?.[0]
    ? `/${product.images[0]}`
    : null;

  return (
    <div
      className={styles.page}
      style={themeVars}
    >
      <LuxuryHero
        product={product}
        hotel={hotel}
        imageSrc={imageSrc}
        collectionPath={collectionPath}
      />

      <main>
        <ExperienceSection
          product={product}
          hotel={hotel}
        />

        <AmenitiesSection
          amenities={product.amenities}
        />

        <ReservationSection
          product={product}
          hotel={hotel}
          reserved={reserved}
          setReserved={setReserved}
        />

        {product.reviews?.length > 0 && (
          <ReviewsSection
            product={product}
          />
        )}

        <ClosingSection
          hotel={hotel}
          collectionPath={collectionPath}
        />
      </main>
    </div>
  );
}


/* =========================================================
   HERO
========================================================= */

function LuxuryHero({
  product,
  hotel,
  imageSrc,
  collectionPath,
}) {
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: [
      'start start',
      'end start',
    ],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '18%']
  );

  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.04, 1.13]
  );

  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '24%']
  );

  const scrollToExperience = () => {
    document
      .getElementById('experience')
      ?.scrollIntoView({
        behavior: 'smooth',
      });
  };

  return (
    <section
      ref={heroRef}
      className={styles.hero}
    >
      <motion.div
        className={styles.heroImage}
        style={{
          y: imageY,
          scale: imageScale,
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.title}
          />
        ) : (
          <div
            className={styles.heroFallback}
          />
        )}
      </motion.div>

      <div className={styles.heroShade} />
      <div className={styles.heroGlow} />
      <div className={styles.heroGrain} />

      <header className={styles.heroNav}>
        <Link
          to={collectionPath}
          className={styles.backLink}
        >
          <ArrowLeft
            size={16}
            strokeWidth={1.3}
          />

          <span>Collection</span>
        </Link>

        <div className={styles.brand}>
          {hotel.shortName.toUpperCase()}
        </div>

        <Link
          to={`/hotels/${hotel.slug}`}
          className={styles.hotelLink}
        >
          {hotel.name}

          <ArrowUpRight
            size={14}
            strokeWidth={1.3}
          />
        </Link>
      </header>

      <motion.div
        className={styles.heroContent}
        style={{
          y: contentY,
        }}
      >
        <div className={styles.heroEyebrow}>
          <span />

          <span>
            {product.category}
          </span>

          {product.style && (
            <>
              <span />

              <span>
                {product.style}
              </span>
            </>
          )}

          <span />
        </div>

        <h1>
          {product.title}
        </h1>

        <p>
          A considered expression of
          <br />
          the {hotel.shortName} way of staying.
        </p>
      </motion.div>

      <button
        type="button"
        className={styles.heroExplore}
        onClick={scrollToExperience}
        aria-label="Discover this stay"
      >
        <span
          className={styles.exploreRing}
        >
          <span>
            DISCOVER · DISCOVER ·
          </span>
        </span>

        <ArrowDown
          size={18}
          strokeWidth={1.2}
        />
      </button>

      <div className={styles.heroBottom}>
        <span>
          {hotel.name.toUpperCase()}
        </span>

        <div
          className={styles.heroLine}
        />

        <span>
          {product.category.toUpperCase()}
        </span>
      </div>
    </section>
  );
}


/* =========================================================
   EXPERIENCE
========================================================= */

function ExperienceSection({
  product,
  hotel,
}) {
  const experienceImage =
    product.images?.[1] ||
    product.images?.[0];

  return (
    <section
      id="experience"
      className={styles.experience}
    >
      <div className={styles.experienceInner}>

        <motion.div
          className={
            styles.experienceVisual
          }
          initial={{
            opacity: 0,
            x: -45,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 1,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >
          {experienceImage ? (
            <motion.img
              src={`/${experienceImage}`}
              alt={`${product.title} interior`}
              className={
                styles.experienceImage
              }
              initial={{
                scale: 1.1,
              }}
              whileInView={{
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 1.5,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
            />
          ) : (
            <div
              className={
                styles.visualFallback
              }
            />
          )}

          <div
            className={
              styles.experienceImageOverlay
            }
          />

          <div
            className={
              styles.experienceImageLabel
            }
          >
            <Sparkles
              size={15}
              strokeWidth={1.2}
            />

            <span>
              {hotel.shortName.toUpperCase()} INTERIORS
            </span>
          </div>
        </motion.div>


        <motion.div
          className={
            styles.experienceCopy
          }
          initial={{
            opacity: 0,
            y: 45,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.9,
            delay: 0.1,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >
          <p className={styles.eyebrow}>
            THE EXPERIENCE
          </p>

          <h2>
            A room is a space.
            <br />
            <em>
              A stay is a feeling.
            </em>
          </h2>

          <div
            className={styles.copyDivider}
          />

          <p className={styles.lead}>
            {product.description}
          </p>

          <p>
            Every element has been
            considered to create an
            atmosphere that feels
            effortless, intimate and
            distinctly {hotel.shortName}.
          </p>

          <div
            className={styles.detailStrip}
          >
            {product.capacity && (
              <div
                className={styles.detail}
              >
                <Users
                  size={19}
                  strokeWidth={1.2}
                />

                <span>
                  <small>
                    CAPACITY
                  </small>

                  {product.capacity}{' '}
                  guests
                </span>
              </div>
            )}

            {product.size && (
              <div
                className={styles.detail}
              >
                <Maximize2
                  size={19}
                  strokeWidth={1.2}
                />

                <span>
                  <small>
                    SPACE
                  </small>

                  {product.size} m²
                </span>
              </div>
            )}

            {product.style && (
              <div
                className={styles.detail}
              >
                <Sparkles
                  size={19}
                  strokeWidth={1.2}
                />

                <span>
                  <small>
                    MOOD
                  </small>

                  {product.style}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}


/* =========================================================
   AMENITIES
========================================================= */

function AmenitiesSection({
  amenities,
}) {
  if (!amenities?.length) {
    return null;
  }

  return (
    <section className={styles.amenities}>
      <div
        className={
          styles.amenitiesIntro
        }
      >
        <p className={styles.eyebrow}>
          THOUGHTFUL DETAILS
        </p>

        <h2>
          Everything
          <br />
          <em>
            beautifully considered.
          </em>
        </h2>

        <p>
          The quiet details make the
          difference. Discover the
          touches created around your
          comfort.
        </p>
      </div>

      <div
        className={
          styles.amenitiesList
        }
      >
        {amenities.map(
          (amenity, index) => {
            const Icon =
              amenityIcons[
                index %
                  amenityIcons.length
              ];

            return (
              <motion.div
                key={amenity}
                className={styles.amenity}
                initial={{
                  opacity: 0,
                  y: 25,
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
                  duration: 0.65,
                  delay: index * 0.06,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
              >
                <div
                  className={
                    styles.amenityIcon
                  }
                >
                  <Icon
                    size={20}
                    strokeWidth={1.2}
                  />
                </div>

                <span>
                  {amenity}
                </span>

                <ArrowUpRight
                  className={
                    styles.amenityArrow
                  }
                  size={17}
                  strokeWidth={1.2}
                />
              </motion.div>
            );
          }
        )}
      </div>
    </section>
  );
}


/* =========================================================
   RESERVATION
========================================================= */

function ReservationSection({
  product,
  hotel,
  reserved,
  setReserved,
}) {
  return (
    <section
      className={styles.reservation}
    >
      <div
        className={
          styles.reservationGlow
        }
      />

      <div
        className={
          styles.reservationInner
        }
      >
        <motion.div
          className={
            styles.reservationCopy
          }
          initial={{
            opacity: 0,
            x: -35,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.9,
          }}
        >
          <p className={styles.eyebrow}>
            YOUR {hotel.shortName.toUpperCase()} STAY
          </p>

          <h2>
            Make the
            <br />
            moment
            <br />
            <em>yours.</em>
          </h2>

          <p>
            Begin your stay at {hotel.name}.
            Our team will
            take care of every detail.
          </p>
        </motion.div>

        <motion.div
          className={
            styles.bookingCard
          }
          initial={{
            opacity: 0,
            y: 55,
            rotate: 1.5,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            rotate: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 1,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >
          <div
            className={styles.cardGlow}
          />

          <div
            className={styles.bookingTop}
          >
            <span>
              {product.category}
            </span>

            <span>{hotel.shortName.toUpperCase()}</span>
          </div>

          <div
            className={styles.bookingMain}
          >
            <h3>
              {product.title}
            </h3>

            <ArrowUpRight
              size={21}
              strokeWidth={1.2}
            />
          </div>

          <div
            className={styles.bookingPrice}
          >
            <strong>
              {formatPrice(
                product.price,
                product.currency
              )}
            </strong>

            <span>
              / night
            </span>
          </div>

          <div
            className={
              styles.bookingDivider
            }
          />

          {reserved ? (
            <motion.div
              className={
                styles.confirmation
              }
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
            >
              <div
                className={styles.check}
              >
                <Check
                  size={17}
                  strokeWidth={1.6}
                />
              </div>

              <div>
                <strong>
                  Request received
                </strong>

                <p>
                  Our team will confirm
                  your stay by email
                  shortly.
                </p>
              </div>
            </motion.div>
          ) : (
            <Button
              variant="primary"
              onClick={() =>
                setReserved(true)
              }
            >
              Reserve your stay
            </Button>
          )}

          <small>
            Best available rate ·
            Subject to availability
          </small>
        </motion.div>
      </div>
    </section>
  );
}


/* =========================================================
   REVIEWS
========================================================= */

function ReviewsSection({
  product,
}) {
  return (
    <section className={styles.reviews}>
      <div
        className={styles.reviewsTop}
      >
        <div>
          <p className={styles.eyebrow}>
            GUEST IMPRESSIONS
          </p>

          <h2>
            Remembered
            <br />
            <em>
              long after leaving.
            </em>
          </h2>
        </div>

        <div
          className={styles.rating}
        >
          <strong>
            {product.rating}
          </strong>

          <StarRating
            rating={product.rating}
            reviewsCount={
              product.reviewsCount
            }
          />
        </div>
      </div>

      <div
        className={styles.reviewsBody}
      >
        <ReviewList
          reviews={product.reviews}
        />
      </div>
    </section>
  );
}


/* =========================================================
   CLOSING
========================================================= */

function ClosingSection({
  hotel,
  collectionPath,
}) {
  return (
    <section className={styles.closing}>
      <div
        className={
          styles.closingGlow
        }
      />

      <p>
        THE {hotel.name.toUpperCase()}
      </p>

      <h2>
        Stay somewhere
        <br />
        <em>
          worth remembering.
        </em>
      </h2>

      <Link
        to={collectionPath}
        className={
          styles.closingLink
        }
      >
        <span>
          Explore the collection
        </span>

        <ArrowUpRight
          size={18}
          strokeWidth={1.2}
        />
      </Link>
    </section>
  );
}
