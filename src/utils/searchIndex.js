import hotels from '../data/hotels.json';
import products from '../data/products.json';

function buildIndex() {
  const hotelEntries = hotels.map((hotel) => ({
    kind: 'Destination',
    id: `hotel-${hotel.id}`,
    title: hotel.name,
    subtitle: hotel.tagline,
    path: `/hotels/${hotel.slug}`,
    keywords: `${hotel.name} ${hotel.shortName} ${hotel.tagline}`.toLowerCase(),
  }));

  const productEntries = products.map((product) => {
    const hotel = hotels.find((entry) => entry.id === product.hotelId);
    return {
      kind: product.category,
      id: `product-${product.id}`,
      title: product.title,
      subtitle: hotel?.shortName || '',
      path: `/hotels/${hotel?.slug}/product/${product.slug}`,
      keywords: `${product.title} ${product.category} ${hotel?.shortName || ''}`.toLowerCase(),
    };
  });

  return [...hotelEntries, ...productEntries];
}

let cachedIndex = null;

export function searchIndex(query, limit = 20) {
  if (!cachedIndex) cachedIndex = buildIndex();
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return cachedIndex
    .filter((entry) => entry.keywords.includes(normalized))
    .slice(0, limit);
}