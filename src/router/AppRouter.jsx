import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import AureliaHotelPage from '../pages/AureliaHotelPage';
import AureliaCategoryPage from '../pages/AureliaCategoryPage';
import MarisolHotelPage from '../pages/MarisolHotelPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import MarisolExperiencePage from '../pages/MarisolExperiencePage';
import MarisolCollectionPage from '../pages/MarisolCollectionPage';
import LegalPage from '../pages/LegalPage';
import NotFoundPage from '../pages/NotFoundPage';
import CustomCursor from '../components/ui/CustomCursor';

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
  const cursorVariant = pathname.startsWith('/hotels/aurelia') ? 'aurelia' : 'group';
  const usesMarisolCursor = pathname.startsWith('/hotels/marisol');

  return (
    <>
      <ScrollToTop />
      {!usesMarisolCursor && <CustomCursor variant={cursorVariant} />}

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

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </>
  );
}
