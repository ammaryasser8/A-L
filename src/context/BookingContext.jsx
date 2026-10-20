import { useEffect, useMemo, useState } from 'react';
import { BookingContext } from '../hooks/useBooking';

const DRAFT_KEY = 'al-booking-draft';

function readDraft() {
  try {
    return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null') || {};
  } catch {
    return {};
  }
}

export function BookingProvider({ children }) {
  const [draft, setDraft] = useState(readDraft);

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* draft just won't survive a refresh */
    }
  }, [draft]);

  const value = useMemo(() => ({
    draft,
    updateDraft(patch) {
      setDraft((current) => ({ ...current, ...patch }));
    },
    clearDraft() {
      setDraft({});
      try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
    },
  }), [draft]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}