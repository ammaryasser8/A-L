export function nightsBetween(checkIn, checkOut) {
  return Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000));
}

export function extrasTotal(selectedIds = [], extras = []) {
  return extras
    .filter((extra) => selectedIds.includes(extra.id))
    .reduce((sum, extra) => sum + extra.price, 0);
}