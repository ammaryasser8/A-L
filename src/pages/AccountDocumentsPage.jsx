import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import hotels from '../data/hotels.json';
import products from '../data/products.json';
import { useAuth } from '../hooks/useAuth';
import { documentService } from '../services/documentService';
import styles from './AccountPage.module.css';

export default function AccountDocumentsPage() {
  const { session } = useAuth();
  const [documents, setDocuments] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    let cancelled = false;
    documentService.getDocumentsForGuest(session.id).then((list) => { if (!cancelled) setDocuments(list); });
    return () => { cancelled = true; };
  }, [session.id]);

  return (
    <div className={styles.account}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link>
        <Link to="/account" className={styles.logout}>Back to account</Link>
      </header>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>AL Guest</p>
        <h1>Documents.</h1>
      </section>
      <section className={styles.panel} style={{ maxWidth: 760 }}>
        {documents === null && <p>Loading…</p>}
        {documents?.length === 0 && (
          <div className={styles.empty}>
            <p>No documents yet.</p>
            <p className={styles.emptySub}>Confirmations, invoices and receipts from your reservations will appear here.</p>
          </div>
        )}
        {documents?.length > 0 && (
          <div className={styles.docList}>
            {documents.map((doc) => {
              const hotel = hotels.find((entry) => entry.id === doc.reservation.hotelId);
              const room = products.find((product) => product.id === doc.reservation.roomId);
              const isOpen = open === doc.id;
              return (
                <article key={doc.id} className={styles.docItem}>
                  <button type="button" className={styles.docRow} onClick={() => setOpen(isOpen ? null : doc.id)}>
                    <span>{doc.type}</span>
                    <span className={styles.reservationId}>{doc.reservation.id}</span>
                    <span>{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <dl className={styles.summary}>
                      <div className={styles.summaryRow}><dt>Hotel</dt><dd>{hotel?.shortName}</dd></div>
                      <div className={styles.summaryRow}><dt>Room</dt><dd>{room?.title}</dd></div>
                      <div className={styles.summaryRow}><dt>Dates</dt><dd>{doc.reservation.checkIn} — {doc.reservation.checkOut}</dd></div>
                      {doc.type !== 'Confirmation' && (
                        <>
                          <div className={styles.summaryRow}><dt>Room total</dt><dd>${doc.reservation.roomTotal?.toFixed(0)}</dd></div>
                          <div className={styles.summaryRow}><dt>Extras</dt><dd>${(doc.reservation.extrasTotal || 0).toFixed(0)}</dd></div>
                          <div className={styles.summaryRow}><dt className={styles.total}>{doc.type === 'Invoice' ? 'Amount due' : 'Amount paid'}</dt><dd className={styles.total}>${doc.reservation.total.toFixed(0)}</dd></div>
                        </>
                      )}
                    </dl>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}