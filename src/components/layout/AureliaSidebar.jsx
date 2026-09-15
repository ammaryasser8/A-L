import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  ArrowUpRight,
  MapPin,
  
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import styles from './AureliaSidebar.module.css';

const navigationItems = [
  {
    label: 'Home',
    href: '/hotels/aurelia-grand-hotel',
  },
  {
    label: 'Rooms',
    href: '/hotels/aurelia-grand-hotel/explore?category=Rooms',
  },
  {
    label: 'Suites',
    href: '/hotels/aurelia-grand-hotel/explore?category=Suites',
  },
  {
    label: 'Pools',
    href: '/hotels/aurelia-grand-hotel/explore?category=Pools',
  },
  {
    label: 'Restaurants',
    href: '/hotels/aurelia-grand-hotel/explore?category=Restaurants',
  },
  {
    label: 'Spa & Wellness',
    href: '/hotels/aurelia-grand-hotel/explore?category=Spa%20%26%20Wellness',
  },
  {
    label: 'Services',
    href: '/hotels/aurelia-grand-hotel/explore?category=Services',
  },
  {
    label: 'About',
    href: '/hotels/aurelia-grand-hotel#about',
  },
  {
    label: 'Contact',
    href: '/hotels/aurelia-grand-hotel',
  },
];

export default function AureliaSidebar({
  open,
  onClose,
}) {
  /* =====================================================
     ESC KEY
  ===================================================== */

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [open, onClose]);


  /* =====================================================
     LOCK BODY SCROLL
  ===================================================== */

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);


  /* =====================================================
     ANIMATION
  ===================================================== */

  const sidebarVariants = {
    hidden: {
      x: '-100%',
    },

    visible: {
      x: 0,

      transition: {
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],

        when: 'beforeChildren',

        staggerChildren: 0.045,
      },
    },

    exit: {
      x: '-100%',

      transition: {
        duration: 0.55,
        ease: [0.65, 0, 0.35, 1],
      },
    },
  };


  const overlayVariants = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,

      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },

    exit: {
      opacity: 0,

      transition: {
        duration: 0.35,
      },
    },
  };


  const contentVariants = {
    hidden: {
      opacity: 0,
      y: 18,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };


  const navItemVariants = {
    hidden: {
      opacity: 0,
      x: -28,
    },

    visible: {
      opacity: 1,
      x: 0,

      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };


  return (
    <AnimatePresence>
      {open && (
        <>
          {/* =================================================
              OVERLAY
          ================================================= */}

          <motion.div
            className={styles.overlay}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />


          {/* =================================================
              SIDEBAR
          ================================================= */}

          <motion.aside
            className={styles.sidebar}
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            aria-label="Aurelia navigation menu"
          >

            {/* =================================================
                DECORATIVE LIGHT
            ================================================= */}

            <div className={styles.goldGlow} />


            {/* =================================================
                TOP
            ================================================= */}

            <div className={styles.topSection}>

              <motion.div
                className={styles.sidebarHeader}
                variants={contentVariants}
              >

                {/* BRAND */}

                <Link
                  to="/hotels/aurelia-grand-hotel"
                  className={styles.brand}
                  onClick={onClose}
                >

                  <img
                    src="/images/brand/al-logo.png"
                    alt="Aurelia Grand Hotel"
                    className={styles.logo}
                  />

                  <div className={styles.brandText}>

                    <span
                      className={styles.brandName}
                    >
                      Aurelia
                    </span>

                    <span
                      className={styles.brandSub}
                    >
                      GRAND HOTEL
                    </span>

                  </div>

                </Link>


                {/* CLOSE */}

                <motion.button
                  type="button"
                  className={styles.closeBtn}
                  onClick={onClose}
                  aria-label="Close menu"

                  whileHover={{
                    rotate: 90,
                    scale: 1.06,
                  }}

                  whileTap={{
                    scale: 0.9,
                  }}
                >
                  <X
                    size={20}
                    strokeWidth={1.15}
                  />
                </motion.button>

              </motion.div>


              {/* =================================================
                  INTRO
              ================================================= */}

              <motion.div
                className={styles.intro}
                variants={contentVariants}
              >

                <span className={styles.eyebrow}>
                  The Aurelia Experience
                </span>

                <h2>
                  Where Cairo
                  <br />
                  becomes timeless.
                </h2>

                <p>
                  Discover a world of quiet luxury,
                  timeless architecture and
                  unforgettable moments.
                </p>

              </motion.div>

            </div>


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <motion.nav
              className={styles.navigation}
              variants={contentVariants}
              aria-label="Main navigation"
            >

              <div className={styles.navHeader}>

                <span>
                  Explore Aurelia
                </span>

                <span className={styles.navLine} />

              </div>


              <div className={styles.navList}>

                {navigationItems.map((item) => (

                  <motion.div
                    key={item.label}
                    variants={navItemVariants}
                  >

                    <Link
                      to={item.href}
                      className={styles.navLink}
                      onClick={onClose}
                    >

                      <span
                        className={styles.navLabel}
                      >
                        {item.label}
                      </span>


                      <span
                        className={styles.navArrow}
                      >
                        <ArrowUpRight
                          size={20}
                          strokeWidth={1.15}
                        />
                      </span>

                    </Link>

                  </motion.div>

                ))}

              </div>

            </motion.nav>


            {/* =================================================
                FOOTER
            ================================================= */}

            <motion.div
              className={styles.sidebarFooter}
              variants={contentVariants}
            >

              <div className={styles.footerTop}>

                {/* LOCATION */}

                <div className={styles.location}>

                  <MapPin
                    size={15}
                    strokeWidth={1.15}
                  />

                  <div>

                    <span
                      className={
                        styles.locationLabel
                      }
                    >
                      Located in
                    </span>

                    <span
                      className={
                        styles.locationValue
                      }
                    >
                      Cairo, Egypt
                    </span>

                  </div>

                </div>


                {/* SOCIAL */}

                <motion.a
                  href="#"
                  className={styles.social}
                  aria-label="Instagram"

                  whileHover={{
                    y: -2,
                    scale: 1.05,
                  }}
                >
                </motion.a>

              </div>


              {/* BOOK */}

              <motion.button
                type="button"
                className={styles.bookingBtn}

                onClick={() => {
                  onClose();

                  setTimeout(() => {
                    document
                      .getElementById('booking')
                      ?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                  }, 300);
                }}

                whileHover={{
                  y: -2,
                }}

                whileTap={{
                  scale: 0.98,
                }}
              >

                <span>
                  Reserve your stay
                </span>

                <ArrowUpRight
                  size={18}
                  strokeWidth={1.15}
                />

              </motion.button>

            </motion.div>

          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}