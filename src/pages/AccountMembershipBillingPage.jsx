import { Link } from 'react-router-dom';
import styles from './GuestPortal.module.css';
import './GuestPortalExtras.css';

export default function AccountMembershipBillingPage() {
  return <main className={styles.portal}><header className={styles.header}><Link to="/account" className={styles.brand}><img src="/images/brand/al-logo.png" alt="" /><span>AL Guest portal</span></Link><Link to="/account/membership" className="utilityLink">Membership</Link></header><section className="pageIntro"><p className={styles.eyebrow}>Membership billing</p><h1>A clear record, kept private.</h1><p>AL does not collect payment-card details or process membership payments in this application.</p></section><section className="billingList"><div className="emptyState"><h2>No billing records.</h2><p>Membership requests are reviewed manually. Any future paid membership integration will require verified server-side payment events.</p><Link to="/account/membership">View membership</Link></div></section></main>;
}
