import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
export default function DeveloperRoute({ children }) {
  const { session, isLoading } = useAuth(); const location = useLocation();
  if (isLoading) return <main aria-live="polite">Preparing the control center…</main>;
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;
  if (session.administrativeIdentity?.role !== 'co_founder_developer') return <Navigate to="/account" replace />;
  return children;
}
