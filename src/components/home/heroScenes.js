import products from '../../data/products.json';

/**
 * Hero scenes are derived from the project's product data: for every scene we
 * pick the best representative product of a category (featured first, then the
 * highest rating) and use its real photograph. Only the art-direction layer
 * (display name, copy, text alignment) lives here.
 */
function pick(hotelId, category, preferredId) {
  const preferred = products.find((product) => product.id === preferredId && product.hotelId === hotelId && product.images?.length);
  if (preferred) return preferred;
  const pool = products.filter((product) => product.hotelId === hotelId && product.category === category && product.images?.length);
  const ranked = [...pool].sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating || a.id - b.id);
  return ranked[0];
}

function buildScenes(hotelId, plan) {
  return plan.map(({ source, id, ...scene }) => {
    const product = pick(hotelId, source, id);
    return product && { ...scene, productId: product.id, image: `/${product.images[0]}` };
  }).filter(Boolean);
}

export const AURELIA_SCENES = buildScenes(1, [
  { source: 'Rooms', category: 'Rooms', description: 'Warm stone, soft light, and rooms composed for stillness.', align: 'left' },
  { source: 'Suites', category: 'Suites', description: 'Timeless interiors crafted for quiet, understated luxury.', align: 'right' },
  { source: 'Spa & Wellness', category: 'Spa', description: 'A quiet ritual of marble, warmth, and restoration.', align: 'left' },
  { source: 'Restaurants', category: 'Dining', description: 'Evenings composed with ceremony, season, and soft light.', align: 'right' },
  { source: 'Pools', category: 'Pool', description: 'Still water beneath gilded light, kept for unhurried afternoons.', align: 'left' },
  { source: 'Services', id: 48, category: 'Signature', description: 'Private service, anticipated before it is ever asked.', align: 'right' },
]);

export const MARISOL_SCENES = buildScenes(2, [
  { source: 'Rooms', category: 'Rooms', description: 'Coastal living shaped by sea light, quiet textures, and effortless comfort.', align: 'right' },
  { source: 'Suites', category: 'Suites', description: 'Open retreats facing the bay, bright with salt air.', align: 'left' },
  { source: 'Beach & Leisure', category: 'Beach', description: 'Sand, sail, and slow tides at the edge of the Red Sea.', align: 'right' },
  { source: 'Pools', category: 'Pool', description: 'Edge-of-horizon water that dissolves into the sky.', align: 'left' },
  { source: 'Spa & Wellness', category: 'Spa', description: 'Space to reset, with the Red Sea just beyond.', align: 'right' },
  { source: 'Restaurants', category: 'Dining', description: 'Fresh, sunlit flavours in a setting made for lingering.', align: 'left' },
  { source: 'Events & Meetings', category: 'Events', description: 'Glass, sea light, and celebrations that breathe.', align: 'right' },
]);