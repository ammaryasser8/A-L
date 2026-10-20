import styles from './MembershipBadge.module.css';
import { identityVariant } from '../../utils/userIdentity';

export default function MembershipBadge({ user, className = '' }) {
  const variant = identityVariant(user);
  const title = variant === 'developer' ? 'Co-Founder & Developer' : variant === 'privilege' ? 'AL Privilege' : variant === 'member' ? 'AL Member' : 'AL Guest';
  return <span className={`${styles.badge} ${styles[variant]} ${className}`}><span className={styles.mark} aria-hidden="true" />{title}</span>;
}
