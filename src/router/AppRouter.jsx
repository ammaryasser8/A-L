import { Routes, Route } from 'react-router-dom';

import HomePage from '../pages/HomePage';
import AureliaHotelPage from '../pages/AureliaHotelPage';
import MarisolHotelPage from '../pages/MarisolHotelPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/hotels/aurelia-grand-hotel" element={<AureliaHotelPage />} />
      <Route path="/hotels/marisol-bay-resort" element={<MarisolHotelPage />} />
      <Route path="/hotels/:hotelSlug/product/:productSlug" element={<ProductDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}