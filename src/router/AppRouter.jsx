import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import LegalPage from '../pages/LegalPage';
import NotFoundPage from '../pages/NotFoundPage';
import CustomCursor from '../components/ui/CustomCursor';
import GenesisPreloader from '../components/ui/GenesisPreloader';
import CommandCenter from '../components/ui/CommandCenter';
import LoadingState from '../components/ui/LoadingState';
import SkipLink from '../components/ui/skiplink';
import AboutPage from '../pages/AboutPage';
import CareersPage from '../pages/CareersPage';
import PressPage from '../pages/PressPage';
import EventsPage from '../pages/EventsPage';
import GroupLegalPage from '../pages/GroupLegalPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import AccountPage from '../pages/AccountPage';
import AccountProfilePage from '../pages/AccountProfilePage';
import AccountReviewsPage from '../pages/AccountReviewsPage';
import AccountMembershipPage from '../pages/AccountMembershipPage';
import AccountMembershipBillingPage from '../pages/AccountMembershipBillingPage';
import MembershipPage from '../pages/MembershipPage';
import AccountReservationsPage from '../pages/AccountReservationsPage';
import AccountRequestsPage from '../pages/AccountRequestsPage';
import AccountNotificationsPage from '../pages/AccountNotificationsPage';
import AccountDocumentsPage from '../pages/AccountDocumentsPage';
import ConciergePage from '../pages/ConciergePage';
import ReservationDetailPage from '../pages/ReservationDetailPage';
import AccountExperiencesPage from '../pages/AccountExperiencesPage';
import AccountCollectionPage from '../pages/AccountCollectionPage';
import SearchPage from '../pages/SearchPage';
import PreArrivalPage from '../pages/PreArrivalPage';
import CheckInPage from '../pages/CheckInPage';
import BookingStayPage from '../pages/booking/BookingStayPage';
import BookingRoomPage from '../pages/booking/BookingRoomPage';
import BookingExtrasPage from '../pages/booking/BookingExtrasPage';
import BookingReviewPage from '../pages/booking/BookingReviewPage';
import BookingPaymentPage from '../pages/booking/BookingPaymentPage';
import BookingConfirmationPage from '../pages/booking/BookingConfirmationPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import DeveloperRoute from '../components/auth/DeveloperRoute';
import DeveloperPage from '../pages/DeveloperPage';

// The heaviest pages (hotel worlds, full product galleries) are loaded
// on demand rather than bundled into the initial page load. Everything
// else on this list is small enough that splitting it would cost more
// in request overhead than it saves.
const AureliaHotelPage = lazy(() => import('../pages/AureliaHotelPage'));
const AureliaCategoryPage = lazy(() => import('../pages/AureliaCategoryPage'));
const MarisolHotelPage = lazy(() => import('../pages/MarisolHotelPage'));
const MarisolExperiencePage = lazy(() => import('../pages/MarisolExperiencePage'));
const MarisolCollectionPage = lazy(() => import('../pages/MarisolCollectionPage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname, search]);

  return null;
}

export default function AppRouter() {
  const { pathname } = useLocation();
  const cursorVariant = pathname.startsWith('/hotels/marisol') ? 'marisol' : pathname.startsWith('/hotels/aurelia') ? 'aurelia' : 'group';

  // The Genesis sequence plays on every real page load (AppRouter only
  // mounts once per load, not on internal client-side navigation), so it
  // always greets a fresh visit or reload, on any route.
  const [genesisDone, setGenesisDone] = useState(false);

  const finishGenesis = useCallback(() => {
    document.documentElement.dataset.alReady = 'true';
    delete document.documentElement.dataset.alLoading;
    setGenesisDone(true);
    window.dispatchEvent(new Event('al:ready'));
  }, []);

  useEffect(() => {
    if (genesisDone) return undefined;
    document.documentElement.dataset.alLoading = 'true';
    delete document.documentElement.dataset.alReady;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      delete document.documentElement.dataset.alLoading;
    };
  }, [genesisDone]);

  return (
    <>
      <SkipLink />
      <ScrollToTop />
      {genesisDone && <CustomCursor variant={cursorVariant} />}
      {!genesisDone && <GenesisPreloader onComplete={finishGenesis} />}
      <CommandCenter />

      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/hotels/aurelia-grand-hotel"
            element={<AureliaHotelPage />}
          />

          <Route
            path="/hotels/aurelia-grand-hotel/explore"
            element={<AureliaCategoryPage />}
          />

          <Route
            path="/hotels/marisol-bay-resort"
            element={<MarisolHotelPage />}
          />

          <Route
            path="/hotels/marisol-bay-resort/product/:productSlug"
            element={<MarisolExperiencePage />}
          />

          <Route
            path="/hotels/marisol-bay-resort/collection/:categorySlug"
            element={<MarisolCollectionPage />}
          />

          <Route
            path="/hotels/:hotelSlug/product/:productSlug"
            element={<ProductDetailPage />}
          />

          <Route path="/hotels/:hotelSlug/privacy-policy" element={<LegalPage type="privacy" />} />
          <Route path="/hotels/:hotelSlug/terms-of-use" element={<LegalPage type="terms" />} />
          <Route path="/hotels/:hotelSlug/cookie-policy" element={<LegalPage type="cookies" />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/account"
            element={(
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            )}
          />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/developer" element={<DeveloperRoute><DeveloperPage /></DeveloperRoute>} />
          <Route path="/account/profile" element={<ProtectedRoute><AccountProfilePage /></ProtectedRoute>} />
          <Route path="/account/reviews" element={<ProtectedRoute><AccountReviewsPage /></ProtectedRoute>} />
          <Route path="/account/membership" element={<ProtectedRoute><AccountMembershipPage /></ProtectedRoute>} />
          <Route path="/account/membership/billing" element={<ProtectedRoute><AccountMembershipBillingPage /></ProtectedRoute>} />
          <Route
            path="/account/reservations"
            element={(
              <ProtectedRoute>
                <AccountReservationsPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/account/experiences"
            element={(
              <ProtectedRoute>
                <AccountExperiencesPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/account/collection"
            element={(
              <ProtectedRoute>
                <AccountCollectionPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/favorites"
            element={(
              <ProtectedRoute>
                <AccountCollectionPage />
              </ProtectedRoute>
            )}
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/press" element={<PressPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/legal/privacy" element={<GroupLegalPage type="privacy" />} />
          <Route path="/legal/terms" element={<GroupLegalPage type="terms" />} />
          <Route path="/legal/cookies" element={<GroupLegalPage type="cookies" />} />
          <Route
            path="/account/reservations/:reservationId"
            element={(
              <ProtectedRoute>
                <ReservationDetailPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/account/reservations/:reservationId/pre-arrival"
            element={(
              <ProtectedRoute>
                <PreArrivalPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/account/reservations/:reservationId/check-in"
            element={(
              <ProtectedRoute>
                <CheckInPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/account/requests"
            element={(
              <ProtectedRoute>
                <AccountRequestsPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/account/notifications"
            element={(
              <ProtectedRoute>
                <AccountNotificationsPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/account/documents"
            element={(
              <ProtectedRoute>
                <AccountDocumentsPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/concierge"
            element={(
              <ProtectedRoute>
                <ConciergePage />
              </ProtectedRoute>
            )}
          />

          <Route path="/booking" element={<BookingStayPage />} />
          <Route path="/booking/room" element={<BookingRoomPage />} />
          <Route path="/booking/extras" element={<BookingExtrasPage />} />
          <Route
            path="/booking/review"
            element={(
              <ProtectedRoute>
                <BookingReviewPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/booking/payment"
            element={(
              <ProtectedRoute>
                <BookingPaymentPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/booking/confirmation"
            element={(
              <ProtectedRoute>
                <BookingConfirmationPage />
              </ProtectedRoute>
            )}
          />

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </Suspense>
    </>
  );
}
