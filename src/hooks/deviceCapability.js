/**
 * A coarse, cheap "should this device get the heavier motion layers?"
 * check — deliberately simple (no benchmarking, no GPU probing) so it
 * costs nothing to call. Used alongside prefers-reduced-motion and
 * pointer:fine checks to gate pointer-tracking effects (proximity
 * systems, parallax, portal physics) on devices unlikely to run them
 * smoothly: low core count, or the visitor has asked their browser to
 * use less data.
 */
export function isLowPowerDevice() {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency || 8;
  const saveData = navigator.connection?.saveData;
  return cores <= 3 || Boolean(saveData);
}