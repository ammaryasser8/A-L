import { Routes, Route } from 'react-router-dom';

import ScrollToTop from './ScrollToTop';
import HomePage from '../pages/HomePage';
import AureliaHotelPage from '../pages/AureliaHotelPage';
import MarisolHotelPage from '../pages/MarisolHotelPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import LegalPage from '../pages/LegalPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hotels/aurelia-grand-hotel" element={<AureliaHotelPage />} />
        <Route path="/hotels/marisol-bay-resort" element={<MarisolHotelPage />} />
        <Route path="/hotels/:hotelSlug/product/:productSlug" element={<ProductDetailPage />} />
        <Route path="/hotels/:hotelSlug/privacy-policy" element={<LegalPage type="privacy" />} />
        <Route path="/hotels/:hotelSlug/terms-of-use" element={<LegalPage type="terms" />} />
        <Route path="/hotels/:hotelSlug/cookie-policy" element={<LegalPage type="cookies" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}