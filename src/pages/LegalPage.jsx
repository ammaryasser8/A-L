import { useParams, Link } from 'react-router-dom';
import { useHotelBySlug } from '../hooks/useHotelBySlug';
import NotFoundPage from './NotFoundPage';
import SiteFooter from '../components/layout/SiteFooter';
import styles from './LegalPage.module.css';

const CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    sections: (hotel) => [
      {
        heading: 'Introduction',
        body: `This Privacy Policy explains how ${hotel.name} ("we", "us", "our"), part of AL Hospitality Group, collects, uses, and protects your personal information when you visit our website or make a reservation with us.`,
      },
      {
        heading: 'Information We Collect',
        body: 'When you book a room, contact us, or subscribe to our newsletter, we may collect your name, email address, phone number, payment details, and stay preferences.',
      },
      {
        heading: 'How We Use Your Information',
        body: 'We use your information to process reservations, communicate with you about your stay, improve our services, and, where you have opted in, send you offers and updates.',
      },
      {
        heading: 'Sharing Your Information',
        body: `We do not sell your personal information. We may share it with trusted service providers who help us operate ${hotel.name} (such as payment processors), or where required by law.`,
      },
      {
        heading: 'Your Rights',
        body: 'You may request access to, correction of, or deletion of your personal data at any time by contacting us using the details below.',
      },
      {
        heading: 'Contact Us',
        body: `For any privacy-related questions, reach us at ${hotel.contact?.email || 'our front desk'} or ${hotel.contact?.phone || ''}.`,
      },
    ],
  },
  terms: {
    title: 'Terms of Use',
    sections: (hotel) => [
      {
        heading: 'Acceptance of Terms',
        body: `By accessing or using the ${hotel.name} website, you agree to be bound by these Terms of Use and our Privacy Policy.`,
      },
      {
        heading: 'Reservations',
        body: `All reservations made through this website are subject to availability and confirmation by ${hotel.name}. Check-in time is ${hotel.checkInTime || '15:00'} and check-out time is ${hotel.checkOutTime || '12:00'}, unless otherwise agreed.`,
      },
      {
        heading: 'Cancellations',
        body: 'Free cancellation is available up to 48 hours before check-in. Cancellations made within 48 hours of check-in may be subject to a one-night charge.',
      },
      {
        heading: 'Website Content',
        body: 'All content on this website, including text, images, and the AL Hospitality Group and hotel logos, is the property of AL Hospitality Group and may not be reproduced without permission.',
      },
      {
        heading: 'Limitation of Liability',
        body: `${hotel.name} is not liable for indirect or consequential losses arising from your use of this website, to the fullest extent permitted by law.`,
      },
      {
        heading: 'Contact Us',
        body: `Questions about these terms can be sent to ${hotel.contact?.email || 'our front desk'}.`,
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    sections: (hotel) => [
      {
        heading: 'What Are Cookies',
        body: 'Cookies are small text files placed on your device that help our website function properly and let us understand how it is used.',
      },
      {
        heading: 'Cookies We Use',
        body: `${hotel.name} uses essential cookies (required for booking and site functionality), analytics cookies (to understand site usage), and, where you consent, marketing cookies (to show you relevant offers).`,
      },
      {
        heading: 'Managing Cookies',
        body: 'You can control or delete cookies through your browser settings at any time. Disabling essential cookies may affect your ability to complete a booking.',
      },
      {
        heading: 'Third-Party Cookies',
        body: 'Some cookies are placed by trusted third parties, such as analytics or payment providers, to help us operate the website securely.',
      },
      {
        heading: 'Contact Us',
        body: `For questions about our use of cookies, contact ${hotel.contact?.email || 'our front desk'}.`,
      },
    ],
  },
};

export default function LegalPage({ type }) {
  const { hotelSlug } = useParams();
  const hotel = useHotelBySlug(hotelSlug);

  if (!hotel || !CONTENT[type]) {
    return <NotFoundPage />;
  }

  const themeVars = {
    '--theme-primary': hotel.theme.colors.primary,
    '--theme-accent': hotel.theme.colors.accent,
    '--theme-ink': hotel.theme.colors.ink,
    '--theme-surface-dark': hotel.theme.colors.surfaceDark,
    '--theme-muted': '#83766A',
    '--font-heading': hotel.theme.fonts.heading,
    '--font-body': hotel.theme.fonts.body,
    fontFamily: hotel.theme.fonts.body,
    background: hotel.theme.colors.surface,
    minHeight: '100vh',
  };

  const { title, sections } = CONTENT[type];

  return (
    <div style={themeVars}>
      <div className={`wrap ${styles.wrap}`}>
        <Link to={`/hotels/${hotel.slug}`} className={styles.back}>
          ← Back to {hotel.name}
        </Link>

        <span className={styles.eyebrow}>{hotel.name}</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.updated}>Last updated: January 2026</p>

        {sections(hotel).map((s) => (
          <section key={s.heading} className={styles.section}>
            <h2>{s.heading}</h2>
            <p>{s.body}</p>
          </section>
        ))}
      </div>

      <SiteFooter hotel={hotel} />
    </div>
  );
}