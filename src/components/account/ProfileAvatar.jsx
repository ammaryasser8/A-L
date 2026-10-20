import styles from './ProfileAvatar.module.css';
import { identityVariant } from '../../utils/userIdentity';

function initials(user) {
  return `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || user?.email?.[0] || 'A'}`.toUpperCase();
}

export default function ProfileAvatar({ user, size = 'default', className = '' }) {
  const variant = identityVariant(user);
  const label = `${user?.firstName || 'AL'} ${user?.lastName || 'guest'} profile image`;
  return <span className={`${styles.frame} ${styles[variant]} ${styles[size]} ${className}`} data-identity={variant}>
    <span className={styles.inner}>{user?.avatar ? <img src={user.avatar} alt={label} /> : <span aria-label={label}>{initials(user)}</span>}</span>
    {variant === 'developer' && <span className={styles.orbit} aria-hidden="true" />}
  </span>;
}
