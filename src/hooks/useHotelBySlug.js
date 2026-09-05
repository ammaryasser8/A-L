import { useMemo } from 'react';
import hotels from '../data/hotels.json';

export function useHotelBySlug(slug) {
  return useMemo(() => hotels.find((h) => h.slug === slug) || null, [slug]);
}