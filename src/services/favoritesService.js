import { api } from './apiClient';
export const favoritesService = {
  async getFavorites() {
    const data = await api('/favorites');
    return data.favorites.map((item) => ({ guestId: item.userId, productId: item.productId, savedAt: item.createdAt }));
  },
  async isFavorite(_guestId, productId) {
    return (await this.getFavorites()).some((item) => item.productId === productId);
  },
  async addFavorite(productId) {
    await api('/favorites', { method: 'POST', body: JSON.stringify({ productId }) });
    return true;
  },
  async removeFavorite(productId) {
    await api(`/favorites/${encodeURIComponent(productId)}`, { method: 'DELETE' });
    return false;
  },
  async toggleFavorite(_guestId, productId, currentValue) {
    const exists = typeof currentValue === 'boolean' ? currentValue : await this.isFavorite(null, productId);
    return exists ? this.removeFavorite(productId) : this.addFavorite(productId);
  },
};
