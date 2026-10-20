import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchIndex } from '../../utils/searchIndex';
import { useAuth } from '../../hooks/useAuth';
import styles from './CommandCenter.module.css';

const QUICK_LINKS = [
  { title: 'Home', path: '/' },
  { title: 'Aurelia Grand Hotel', path: '/hotels/aurelia-grand-hotel' },
  { title: 'Marisol Bay Resort', path: '/hotels/marisol-bay-resort' },
  { title: 'Search AL', path: '/search' },
  { title: 'My reservations', path: '/account/reservations', requiresAuth: true },
  { title: 'AL Concierge', path: '/concierge', requiresAuth: true },
  { title: 'My Collection', path: '/account/collection', requiresAuth: true },
  { title: 'My account', path: '/account', requiresAuth: true },
];

export default function CommandCenter() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const paletteRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    function onKeyDown(event) {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
        setQuery('');
      } else if (key === 'escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    document.body.style.overflow = 'hidden';

    // Basic focus trap: if focus ever leaves the palette while it's open
    // (e.g. Tab past the last item), bring it back to the palette so a
    // keyboard user never ends up interacting with the page behind it.
    function onFocusIn(event) {
      if (paletteRef.current && !paletteRef.current.contains(event.target)) {
        inputRef.current?.focus();
      }
    }
    document.addEventListener('focusin', onFocusIn);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [open]);

  if (!open) return null;

  function go(path) {
    setOpen(false);
    navigate(path);
  }

  const links = QUICK_LINKS.filter((link) => !link.requiresAuth || isAuthenticated);
  const results = query ? searchIndex(query, 8) : [];

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="AL Command Center" onClick={() => setOpen(false)}>
      <div ref={paletteRef} className={styles.palette} onClick={(event) => event.stopPropagation()}>
        <input
          ref={inputRef}
          className={styles.input}
          placeholder="Search or jump to…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className={styles.list}>
          {query ? (
            results.length > 0 ? (
              results.map((result) => (
                <button type="button" key={result.id} className={styles.item} onClick={() => go(result.path)}>
                  <span className={styles.itemKind}>{result.kind}</span>
                  <span>{result.title}</span>
                </button>
              ))
            ) : <p className={styles.empty}>No results.</p>
          ) : (
            links.map((link) => (
              <button type="button" key={link.path} className={styles.item} onClick={() => go(link.path)}>
                <span>{link.title}</span>
              </button>
            ))
          )}
        </div>
        <p className={styles.hint}>Esc to close · ⌘K / Ctrl K to toggle</p>
      </div>
    </div>
  );
}