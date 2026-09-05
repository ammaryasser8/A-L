import { useMemo } from 'react';
import products from '../data/products.json';

/**
 * Returns products belonging to a given hotel, optionally filtered by category.
 * @param {number} hotelId
 * @param {string} [category] - pass "All" or omit to get every category
 */
export function useHotelProducts(hotelId, category) {
  return useMemo(() => {
    let list = products.filter((p) => p.hotelId === hotelId);
    if (category && category !== 'All') {
      list = list.filter((p) => p.category === category);
    }
    return list;
  }, [hotelId, category]);
}