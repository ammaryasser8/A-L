import { Link } from 'react-router-dom';
import homeConfig from '../data/home-config.json';
import NotFoundPage from './NotFoundPage';
import styles from './GroupPage.module.css';

const CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    sections: (group) => [
      { heading: 'Introduction', body: `This Privacy Policy explains how ${group.name} ("we", "us", "our") collects, uses, and protects your personal information when you visit our website, book a stay, or contact us.` },
      { heading: 'Information We Collect', body: 'When you create an account, make a reservation, or contact concierge, we may collect your name, email address, phone number, payment details, and stay preferences.' },
      { heading: 'How We Use Your Information', body: 'We use your information to process reservations and requests, communicate with you about your stay, and improve our services.' },
      { heading: 'Sharing Your Information', body: `We do not sell your personal information. We may share it with trusted service providers who help us operate Aurelia Grand Hotel and Marisol Bay Resort, or where required by law.` },
      { heading: 'Your Rights', body: 'You may request access to, correction of, or deletion of your personal data at any time by contacting us using the details below.' },
      { heading: 'Contact Us', body: `For privacy-related questions, reach us at ${group.contact.email} or ${group.contact.phone}.` },
    ],
  },
  terms: {
    title: 'Terms of Use',
    sections: (group) => [
      { heading: 'Acceptance of Terms', body: `By accessing or using the ${group.name} website, you agree to be bound by these Terms of Use and our Privacy Policy.` },
      { heading: 'Reservations', body: 'All reservations made through this website are subject to availability and confirmation by the relevant hotel.' },
      { heading: 'Cancellations', body: 'Free cancellation is available up to 48 hours before check-in. Cancellations made within 48 hours of check-in may be subject to a one-night charge.' },
      { heading: 'Website Content', body: `All content on this website, including text, images, and the AL Hospitality Group and hotel logos, is the property of ${group.name} and may not be reproduced without permission.` },
      { heading: 'Limitation of Liability', body: `${group.name} is not liable for indirect or consequential losses arising from your use of this website, to the fullest extent permitted by law.` },
      { heading: 'Contact Us', body: `Questions about these terms can be sent to ${group.contact.email}.` },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    sections: (group) => [
      { heading: 'What Are Cookies', body: 'Cookies are small text files placed on your device that help our website function properly and let us understand how it is used.' },
      { heading: 'Cookies We Use', body: `${group.name} uses essential cookies (required for booking and account functionality), and, where you consent, analytics cookies.` },
      { heading: 'Managing Cookies', body: 'You can control or delete cookies through your browser settings at any time. Disabling essential cookies may affect your ability to complete a booking.' },
      { heading: 'Contact Us', body: `For questions about our use of cookies, contact ${group.contact.email}.` },
    ],
  },
};

export default function GroupLegalPage({ type }) {
  const { group } = homeConfig;
  const entry = CONTENT[type];
  if (!entry) return <NotFoundPage />;
  const sections = entry.sections(group);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
      </header>
      <div className={styles.content}>
        <p className={styles.eyebrow}>{group.name} · Guest information</p>
        <h1>{entry.title}</h1>
        <p className={styles.lead}>Last reviewed · January 2026</p>
        <div className={styles.legalLayout}>
          <nav className={styles.legalToc} aria-label="On this page">
            <span>In this note</span>
            {sections.map((section, index) => <a href={`#group-legal-${index}`} key={section.heading}>{String(index + 1).padStart(2, '0')} · {section.heading}</a>)}
          </nav>
          <article>
            {sections.map((section, index) => (
              <section className={styles.section} id={`group-legal-${index}`} key={section.heading}>
                <span className={styles.sectionNumber}>{String(index + 1).padStart(2, '0')}</span>
                <div><h2>{section.heading}</h2><p>{section.body}</p></div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </div>
  );
}
