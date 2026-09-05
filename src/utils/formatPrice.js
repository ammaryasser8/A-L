export function formatPrice(price, currency = 'USD') {
  const symbols = { USD: '$', EUR: '€', EGP: 'E£' };
  const symbol = symbols[currency] || '';
  return `${symbol}${Number(price).toFixed(2)}`;
}