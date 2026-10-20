import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <main className={styles.page}>
      <div className={styles.atmosphere} aria-hidden="true" />
      <header className={styles.header}><Link to="/" className={styles.brand}>AL<span>Hospitality Group</span></Link></header>
      <section className={styles.content} aria-labelledby="not-found-title">
        <p className={styles.eyebrow}><Compass size={14} aria-hidden="true" /> A quiet detour</p>
        <p className={styles.code}>404</p>
        <h1 id="not-found-title">Lost between<br /><em>two worlds.</em></h1>
        <p className={styles.copy}>The page you were looking for has moved on. Your next considered stay is still within reach.</p>
        <div className={styles.actions}>
          <Link to="/">Return to the AL universe <ArrowLeft size={15} /></Link>
          <Link className={styles.secondary} to="/search">Search the collection</Link>
        </div>
      </section>
    </main>
  );
}
