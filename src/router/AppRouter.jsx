import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import AureliaHotelPage from '../pages/AureliaHotelPage';
import AureliaCategoryPage from '../pages/AureliaCategoryPage';
import MarisolHotelPage from '../pages/MarisolHotelPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import NotFoundPage from '../pages/NotFoundPage';

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
  return (
    <>
      <ScrollToTop />

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
          path="/hotels/:hotelSlug/product/:productSlug"
          element={<ProductDetailPage />}
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </>
  );
}