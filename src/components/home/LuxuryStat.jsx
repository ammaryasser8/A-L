import { useReveal } from '../../hooks/useReveal';
import { useCountUp } from '../../hooks/useCountUp';

// Scene 10 — Luxury Data: each figure counts up from zero once it enters
// view (real data only — target is always a number already computed from
// the actual hotels/products/reviews, never invented).
export default function LuxuryStat({ target, label, format }) {
  const [ref, visible] = useReveal(0.4);
  const count = useCountUp(target, visible, 1600);
  return (
    <article ref={ref}>
      <strong>{format(count)}</strong>
      <span>{label}</span>
    </article>
  );
}