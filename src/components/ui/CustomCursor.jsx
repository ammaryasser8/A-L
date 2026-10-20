import { useEffect, useRef } from 'react';
import styles from './CustomCursor.module.css';

const MODES = {
  default: { label: '', scale: 1 }, link: { label: '', scale: 1.08 }, button: { label: 'OPEN', scale: 1.18 },
  view: { label: 'VIEW', scale: 1.35 }, explore: { label: 'EXPLORE', scale: 1.42 }, discover: { label: 'DISCOVER', scale: 1.42 },
  book: { label: 'RESERVE', scale: 1.42 }, reserve: { label: 'RESERVE', scale: 1.42 }, open: { label: 'OPEN', scale: 1.25 },
  enter: { label: 'ENTER', scale: 1.25 }, menu: { label: 'MENU', scale: 1.25 }, close: { label: 'CLOSE', scale: 1.15 },
  drag: { label: 'DRAG', scale: 1.35 }, play: { label: 'PLAY', scale: 1.28 }, download: { label: 'DOWNLOAD', scale: 1.32 },
  disabled: { label: 'UNAVAILABLE', scale: 1 }, hidden: { label: '', scale: 0 }, form: { label: '', scale: 0 },
};

function resolveTarget(target) {
  const element = target?.closest?.('[data-cursor], [data-cursor-label], [data-cursor-hidden], a, button, input, textarea, select, [role="button"], video, img');
  if (!element || element.closest('[data-cursor-hidden]')) return { mode: 'default', theme: '' };
  if (element.matches('input, textarea, select, [contenteditable="true"]')) return { mode: 'default', theme: '' };
  if (element.matches(':disabled, [aria-disabled="true"]')) return { mode: 'disabled', theme: '' };
  const explicit = element.dataset.cursor?.toLowerCase();
  const hasVisualContent = element.matches('a') && Boolean(element.querySelector('img, picture, video, [class*="image"], [class*="media"]') || element.closest('article, [class*="card"], [class*="tile"], [class*="highlight"]'));
  const label = element.dataset.cursorLabel || '';
  const automaticMode = element.matches('button, [role="button"]') ? 'button' : element.matches('a') && hasVisualContent ? 'explore' : element.matches('a') && label ? 'open' : element.matches('a') ? 'link' : element.matches('video') ? 'play' : element.matches('img') ? 'view' : 'default';
  const mode = explicit || automaticMode;
  return { mode: MODES[mode] ? mode : 'default', label, icon: element.dataset.cursorIcon || '', theme: element.closest('[data-cursor-theme]')?.dataset.cursorTheme || '' };
}

export default function CustomCursor({ variant = 'group' }) {
  const coreRef = useRef(null);
  const fieldRef = useRef(null);
  const labelRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches) return undefined;
    const root = rootRef.current;
    const core = coreRef.current;
    const field = fieldRef.current;
    const label = labelRef.current;
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    const position = { x: startX, y: startY, fieldX: startX, fieldY: startY, previousX: startX, previousY: startY };
    let frame = 0;
    const applyContext = (next) => {
      const config = MODES[next.mode] || MODES.default;
      root.dataset.mode = next.mode;
      root.dataset.theme = next.theme || variant;
      root.dataset.icon = next.icon || '';
      label.textContent = next.label || config.label;
      root.style.setProperty('--cursor-scale', String(config.scale));
    };
    const render = () => {
      frame = 0;
      const dx = position.x - position.previousX;
      const dy = position.y - position.previousY;
      position.previousX += dx * 0.42;
      position.previousY += dy * 0.42;
      position.fieldX += (position.x - position.fieldX) * (reducedMotion.matches ? 1 : 0.16);
      position.fieldY += (position.y - position.fieldY) * (reducedMotion.matches ? 1 : 0.16);
      const speed = Math.min(Math.hypot(dx, dy), 28);
      const rotation = Math.atan2(dy, dx) * 57.3;
      const stretch = reducedMotion.matches ? 1 : 1 + speed / 190;
      // The point remains the immediate, precise mouse position; the field
      // follows with a deliberately softer, editorial delay.
      core.style.transform = `translate3d(${position.x}px,${position.y}px,0)`;
      field.style.transform = `translate3d(${position.fieldX}px,${position.fieldY}px,0) rotate(${rotation}deg) scaleX(${stretch})`;
    };
    const requestRender = () => { if (!frame) frame = requestAnimationFrame(render); };
    const onMouseMove = (event) => { position.x = event.clientX; position.y = event.clientY; requestRender(); };
    const onMouseOver = (event) => applyContext(resolveTarget(event.target));
    const onWindowEnter = (event) => applyContext(resolveTarget(event.target));
    const onSelection = () => applyContext(resolveTarget(document.elementFromPoint(position.x, position.y)));
    const onScroll = () => { applyContext(resolveTarget(document.elementFromPoint(position.x, position.y))); };

    document.documentElement.classList.add('alCursorActive');
    applyContext({ mode: 'default', theme: variant });
    render();
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mouseenter', onWindowEnter, { passive: true });
    document.addEventListener('selectionchange', onSelection);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.documentElement.classList.remove('alCursorActive');
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseenter', onWindowEnter);
      document.removeEventListener('selectionchange', onSelection);
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [variant]);

  return <div ref={rootRef} className={styles.cursor} aria-hidden="true"><span ref={fieldRef} className={styles.field}><i /><b /><em ref={labelRef} /></span><span ref={coreRef} className={styles.core} /></div>;
}
