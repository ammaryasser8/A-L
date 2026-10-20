import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Returns a `goTo(id)` function for in-page section navigation that also
 * works correctly from OTHER pages (product detail, legal pages, etc):
 * - If already on `hotelPath`, smooth-scrolls to the element with that id.
 * - Otherwise, navigates to `hotelPath#id` (the target page is responsible
 *   for scrolling to the hash once it mounts — see MarisolHotelPage's
 *   `location.hash` effect for the matching half of this pattern).
 */
export function useSectionLink(hotelPath) {
  const navigate = useNavigate();
  const location = useLocation();

  return function goTo(id) {
    if (location.pathname === hotelPath) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`${hotelPath}#${id}`);
    }
  };
}