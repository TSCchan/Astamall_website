'use client';

import { useEffect, useRef } from 'react';
import { LiquidEngine, type EngineOptions, type Rect } from '@/components/ui/liquid-sculpture-hero';
import { journeySculpture } from '@/lib/hero-journey';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const band = (p: number, a: number, b: number) => smooth(clamp01((p - a) / (b - a)));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * How the landing-page sculpture plays through the About journey (p: 0 Taiwan ... 5 ASTAMALL):
 * it grows out of Taiwan as the red ingredient, makes room for the orbiting ingredients, turns to a liquid
 * swirl as they merge (formulation), re-forms, then dissolves into the droplet that travels to Malaysia.
 */
function pose(p: number) {
  let scale = mix(0.18, 1, band(p, 0.35, 0.95));
  if (p > 1) scale = mix(1, 0.72, band(p, 1.0, 1.6));
  if (p > 2) scale = mix(0.72, 0.95, band(p, 2.2, 2.95));
  if (p > 3) scale = mix(0.95, 0.12, band(p, 3.0, 3.45));
  const visible = band(p, 0.35, 0.8) * (1 - band(p, 3.2, 3.5));
  // a gentler swirl than the landing page: the sculpture is smaller here and sits beside the copy
  const stir = 0.55 * (p < 3 ? band(p, 2.1, 2.55) * (1 - band(p, 2.7, 3.0)) : band(p, 3.0, 3.3));
  return { scale, visible, stir };
}

/**
 * The crimson liquid sculpture from the landing page, on its own particle canvas under the 3D stage.
 * The journey drives it through `register`, so it moves with the same scroll frame as everything else.
 */
export default function JourneySculpture({ register, mobile }: { register: (update: ((p: number) => void) | null) => void; mobile: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const fallback = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'ab-sculpture-canvas';
    node.appendChild(canvas);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const options: EngineOptions = {
      interactive: true, strength: 1, radius: 200, density: 1, dotSize: 1, spread: 1, turbulence: 1,
      returnSpeed: 1, streaks: true, restStyle: 'image', ambient: false, ambientIntensity: 1, speed: 1,
      intro: false, reducedMotion: reduced, bg: [250 / 255, 247 / 255, 242 / 255], imgBg: null, liquid: 1,
    };
    let engine: LiquidEngine | null = null;
    try { engine = new LiquidEngine(canvas, options, () => { node.dataset.gl = 'off'; }); } catch { node.dataset.gl = 'off'; }

    let last = 0, inView = true, w = 1, h = 1;
    const rectFor = (scale: number): Rect => {
      const a = journeySculpture.aspect;
      const base = Math.min(w * (mobile ? 0.9 : 0.8), h * (mobile ? 0.72 : 0.62) * a);
      const rw = base * scale, rh = rw / a;
      return { x: (w - rw) / 2, y: (h - rh) / 2, w: rw, h: rh };
    };
    const update = (p: number) => {
      last = p;
      const { scale, visible, stir } = pose(p);
      const rect = rectFor(scale);
      node.style.opacity = String(visible);
      engine?.setRect(rect);
      engine?.setStir(stir, 1);
      engine?.setVisible(inView && visible > 0.01 && !document.hidden);
      const img = fallback.current;
      if (img) Object.assign(img.style, { left: `${rect.x}px`, top: `${rect.y}px`, width: `${rect.w}px`, height: `${rect.h}px` });
    };
    const resize = new ResizeObserver(() => {
      w = Math.max(1, node.clientWidth); h = Math.max(1, node.clientHeight);
      engine?.resize(w, h, rectFor(pose(last).scale));
      update(last);
    });
    resize.observe(node);
    const seen = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(last); });
    seen.observe(node);
    const onVisibility = () => update(last);
    document.addEventListener('visibilitychange', onVisibility);

    let cancelled = false;
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      if (cancelled || !engine) return;
      try {
        engine.onFirstFrame = () => { if (!cancelled) node.dataset.gl = 'on'; };
        engine.setImage(image);
        engine.resize(w, h, rectFor(pose(last).scale));
        update(last);
      } catch { node.dataset.gl = 'off'; }
    };
    image.src = journeySculpture.src;

    // the cursor scatters the sculpture, exactly as on the landing page
    const section = node.closest('section') ?? node;
    const local = (e: PointerEvent) => { const b = node.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top] as const; };
    const onMove = (e: PointerEvent) => { const [x, y] = local(e); const touch = e.pointerType === 'touch'; if (!(touch && e.buttons === 0)) engine?.pointer('move', x, y, touch); };
    const onDown = (e: PointerEvent) => { const [x, y] = local(e); engine?.pointer('down', x, y, e.pointerType === 'touch'); };
    const onUp = (e: PointerEvent) => { const [x, y] = local(e); engine?.pointer('up', x, y, e.pointerType === 'touch'); };
    const onLeave = (e: PointerEvent) => { const [x, y] = local(e); engine?.pointer('leave', x, y, e.pointerType === 'touch'); };
    section.addEventListener('pointermove', onMove as EventListener, { passive: true });
    section.addEventListener('pointerdown', onDown as EventListener, { passive: true });
    section.addEventListener('pointerup', onUp as EventListener, { passive: true });
    section.addEventListener('pointercancel', onUp as EventListener, { passive: true });
    section.addEventListener('pointerleave', onLeave as EventListener, { passive: true });

    register(update);
    return () => {
      cancelled = true;
      register(null);
      image.onload = null;
      resize.disconnect();
      seen.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      section.removeEventListener('pointermove', onMove as EventListener);
      section.removeEventListener('pointerdown', onDown as EventListener);
      section.removeEventListener('pointerup', onUp as EventListener);
      section.removeEventListener('pointercancel', onUp as EventListener);
      section.removeEventListener('pointerleave', onLeave as EventListener);
      engine?.destroy();
      canvas.remove();
    };
  }, [register, mobile]);

  return <div ref={box} className="ab-sculpture" style={{ opacity: 0 }}>
    <img ref={fallback} className="ab-sculpture-fallback" src={journeySculpture.src} alt="" draggable={false} />
  </div>;
}
