import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { notificationService } from '../services/notificationService';
import styles from './AccountPage.module.css';

export default function AccountNotificationsPage() {
  const { session } = useAuth();
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    let cancelled = false;
    notificationService.getNotificationsForGuest(session.id).then((list) => { if (!cancelled) setNotifications(list); });
    return () => { cancelled = true; };
  }, [session.id]);

  async function handleRead(id) {
    await notificationService.markAsRead(id);
    setNotifications((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <div className={styles.account}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
        <Link to="/account" className={styles.logout}>Back to account</Link>
      </header>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>AL Guest</p>
        <h1>Notifications.</h1>
      </section>
      <section className={styles.panel} style={{ maxWidth: 720 }}>
        {notifications === null && <p>Loading…</p>}
        {notifications?.length === 0 && (
          <div className={styles.empty}>
            <p>No notifications yet.</p>
            <p className={styles.emptySub}>Updates about your reservations and requests will appear here.</p>
          </div>
        )}
        {notifications?.length > 0 && (
          <div className={styles.notifList}>
            {notifications.map((notification) => (
              <button
                type="button"
                key={notification.id}
                className={notification.read ? styles.notifItem : `${styles.notifItem} ${styles.notifUnread}`}
                onClick={() => handleRead(notification.id)}
              >
                <div>
                  <p className={styles.reservationHotel}>{notification.title}</p>
                  <p className={styles.requestMessage}>{notification.body}</p>
                  <p className={styles.reservationId}>{new Date(notification.createdAt).toLocaleString()}</p>
                </div>
                {!notification.read && <span className={styles.dot} aria-label="Unread" />}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}