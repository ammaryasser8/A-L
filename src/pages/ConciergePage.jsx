import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { conciergeService, CONCIERGE_CATEGORIES } from '../services/conciergeService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './ConciergePage.module.css';

export default function ConciergePage() {
  useDocumentTitle('Concierge');
  const { session } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState(CONCIERGE_CATEGORIES[0]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    const request = await conciergeService.createRequest({ guestId: session.id, category, subject, message });
    setSubmitting(false);
    setSent(request);
    setMessage('');
    setSubject('');
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
        <Link to="/account/requests" className={styles.history}>Request history</Link>
      </header>

      <div className={styles.content}>
        <p className={styles.eyebrow}>AL Concierge</p>
        <h1>How may we enhance your stay?</h1>

        {sent ? (
          <div className={styles.confirmed}>
            <p>Your request has been received.</p>
            <p className={styles.confirmedId}>{sent.id} · {sent.category}</p>
            <div className={styles.confirmedActions}>
              <button type="button" onClick={() => setSent(null)}>Send another request</button>
              <button type="button" onClick={() => navigate('/account/requests')}>View request history</button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.categories}>
              {CONCIERGE_CATEGORIES.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={option === category ? `${styles.category} ${styles.categoryActive}` : styles.category}
                  onClick={() => setCategory(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.field}>
                <span>Subject</span>
                <input required value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="A short description of your request" />
              </label>
              <label className={styles.field}>
                <span>Tell us what you need</span>
                <textarea
                  required
                  rows={5}
                  placeholder={`Anything specific we should know for ${category.toLowerCase()}?`}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </label>
              <button type="submit" className={styles.submit} disabled={submitting}>
                {submitting ? 'Sending…' : 'Send request'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
