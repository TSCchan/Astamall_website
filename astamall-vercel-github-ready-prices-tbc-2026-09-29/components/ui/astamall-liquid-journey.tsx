'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LiquidEngine, type EngineOptions, type Rect } from '@/components/ui/liquid-sculpture-hero';
import { journeySculpture, journeyStages, type JourneyStage } from '@/lib/hero-journey';

const LAST = journeyStages.length - 1;
const HEADER = 84;
const PAPER: [number, number, number] = [247 / 255, 243 / 255, 236 / 255];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mixRect = (a: Rect, b: Rect, t: number): Rect => ({ x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t), h: mix(a.h, b.h, t) });

type Layout = { w: number; h: number; wide: boolean; cx: number; cy: number; hero: Rect; held: Rect; boxes: Rect[]; radius: number; rise: number };

function fit(maxW: number, maxH: number, aspect: number, x: number, y: number): Rect {
  const w = Math.min(maxW, maxH * aspect);
  const h = w / aspect;
  return { x: x - w / 2, y: y - h / 2, w, h };
}

/** Wide screens: copy on the left, sculpture and products centred beside it. Narrow: visual above, copy below. */
function measure(w: number, h: number, copyHeight: number): Layout {
  const wide = w >= 1024;
  const top = HEADER + 8;
  const bottom = wide ? h - 70 : Math.max(top + 220, h - copyHeight);
  const band = bottom - top;
  const cx = wide ? w * 0.635 : w * 0.5;
  const cy = top + band / 2;
  const a = journeySculpture.aspect;
  return {
    w, h, wide, cx, cy,
    hero: fit(wide ? w * 0.74 : w * 1.06, band * (wide ? 1.02 : 1), a, cx, cy),
    // behind the products the sculpture becomes a low liquid plinth
    held: fit(wide ? w * 0.5 : w * 0.92, band * 0.66, a, cx, cy + band * 0.16),
    boxes: journeyStages.map(stage => stage.image ? fit(wide ? w * 0.46 : w * 0.86, band * 0.84, stage.image.aspect, cx, cy - band * 0.02) : { x: 0, y: 0, w: 0, h: 0 }),
    radius: wide ? w * 0.3 : w * 0.62,
    rise: band * 0.36,
  };
}

/** Position on a rising helix: d = 1 is the next product (low, right, far), 0 the focus, -1 the previous (high, left, far). */
function helix(d: number, L: Layout) {
  const a = d * 1.75;
  const x = Math.sin(a) * L.radius;
  const z = (Math.cos(a) - 1) * L.radius * 1.15;
  const y = d * L.rise;
  const fade = 1 - smooth(clamp01((Math.abs(d) - 0.28) / 0.6));
  const blur = L.wide ? Math.abs(d) * 6 : 0;
  return { transform: `translate3d(${x}px,${y}px,${z}px) rotateY(${-d * 58}deg) rotateZ(${d * 7}deg)`, opacity: fade, blur };
}

function StageCopy({ stage, index, active }: { stage: JourneyStage; index: number; active: boolean }) {
  const Heading = index === 0 ? 'h1' : 'h2';
  return <>
    <p className="lj-eyebrow">{stage.eyebrow}</p>
    <Heading className="lj-title">{stage.title}{stage.accent && <em>{stage.accent}</em>}</Heading>
    <p className="lj-desc">{stage.description}</p>
    <div className="lj-ctas">
      <Link className="lj-btn" href={stage.href} tabIndex={active ? undefined : -1}>{stage.cta} <span aria-hidden="true">→</span></Link>
      {(index === 0 || index === LAST) && <Link className="lj-link" href="/about" tabIndex={active ? undefined : -1}>Our story <span aria-hidden="true">→</span></Link>}
    </div>
  </>;
}

/** Reduced motion: the same stages as a calm, stacked sequence. */
function StaticJourney() {
  return <section className="lj-static" aria-label="The ASTAMALL collection">
    {journeyStages.map((stage, i) => {
      const image = stage.image ?? journeySculpture;
      return <div className="lj-static-row" key={stage.label}>
        <div className="lj-static-copy"><StageCopy stage={stage} index={i} active /></div>
        <img src={image.src} alt={image.alt} width={Math.round(image.aspect * 800)} height="800" loading={i ? 'lazy' : 'eager'} />
      </div>;
    })}
  </section>;
}

export default function AstamallLiquidJourney() {
  const host = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);
  const stageEl = useRef<HTMLDivElement>(null);
  const fallback = useRef<HTMLImageElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const orbit = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const products = useRef<(HTMLDivElement | null)[]>([]);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const engine = useRef<LiquidEngine | null>(null);
  const layout = useRef<Layout | null>(null);
  const progress = useRef({ value: 0 });
  const trigger = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<'animated' | 'static'>('animated');

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMode(motion.matches ? 'static' : 'animated');
    update();
    motion.addEventListener('change', update);
    return () => motion.removeEventListener('change', update);
  }, []);

  // Everything scroll-driven is written straight to the DOM; React only tracks the active stage.
  const paint = useCallback(() => {
    const L = layout.current;
    if (!L) return;
    const p = progress.current.value;
    const seg = Math.min(Math.floor(p), LAST - 1);
    const f = p - seg;

    const rect = mixRect(L.hero, L.held, smooth(clamp01(p)));
    engine.current?.setRect(rect);
    const img = fallback.current;
    if (img) Object.assign(img.style, { left: `${rect.x}px`, top: `${rect.y}px`, width: `${rect.w}px`, height: `${rect.h}px` });
    // between stages the sculpture turns liquid and spirals, re-forming as each product lands
    engine.current?.setStir(p >= LAST ? 0 : Math.pow(Math.sin(Math.PI * f), 1.3), seg % 2 ? -1 : 1);

    products.current.forEach((el, i) => {
      if (!el) return;
      const d = i - p;
      if (Math.abs(d) > 0.9) { el.style.visibility = 'hidden'; return; }
      const s = helix(d, L);
      el.style.visibility = 'visible';
      el.style.opacity = String(s.opacity);
      el.style.transform = s.transform;
      el.style.filter = s.blur > 0.2 ? `blur(${s.blur.toFixed(1)}px)` : 'none';
    });
    panels.current.forEach((el, i) => {
      if (!el) return;
      const d = p - i;
      const visible = clamp01(1 - Math.abs(d) * 2.3);
      el.style.opacity = String(visible);
      el.style.transform = `translate3d(0,${-d * 34}px,0)`;
      el.style.visibility = visible > 0.01 ? 'visible' : 'hidden';
    });
    if (hint.current) hint.current.style.opacity = String(clamp01(1 - p * 4) * 0.55);
    if (backdrop.current) backdrop.current.style.opacity = String(1 - smooth(clamp01(p)) * 0.35);
    const current = Math.round(p);
    if (current !== activeRef.current) { activeRef.current = current; setActive(current); }
  }, []);

  const relayout = useCallback(() => {
    const section = root.current;
    if (!section) return;
    const w = section.clientWidth;
    const h = section.clientHeight;
    const copyHeight = w >= 1024 ? 0 : (copy.current?.offsetHeight ?? 0) + 76;
    const L = measure(w, h, copyHeight);
    layout.current = L;
    L.boxes.forEach((box, i) => {
      const el = products.current[i];
      if (el) Object.assign(el.style, { left: `${box.x}px`, top: `${box.y}px`, width: `${box.w}px`, height: `${box.h}px` });
    });
    if (orbit.current) orbit.current.style.transformOrigin = `${L.cx}px ${L.cy}px`;
    const word = backdrop.current;
    if (word) {
      let size = Math.min(h * 0.42, (w * 0.94) / 5.2);
      word.style.fontSize = `${size}px`;
      if (word.scrollWidth > w * 0.94) { size *= (w * 0.94) / word.scrollWidth; word.style.fontSize = `${size}px`; }
      word.style.top = `${L.wide ? L.cy : L.hero.y + L.hero.h / 2}px`;
    }
    if (hint.current) Object.assign(hint.current.style, { left: `${L.hero.x + L.hero.w / 2}px`, top: `${Math.min(L.hero.y + L.hero.h * 0.97, h - 96)}px` });
    engine.current?.resize(w, h, L.hero);
    paint();
  }, [paint]);

  // The particle sculpture: one engine for the whole journey.
  useEffect(() => {
    const section = root.current;
    const stage = stageEl.current;
    if (mode !== 'animated' || !section || !stage) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'lj-canvas';
    stage.appendChild(canvas);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fail = () => { section.dataset.gl = 'off'; };
    const options: EngineOptions = {
      interactive: true, strength: 1, radius: 230, density: 1, dotSize: 1, spread: 1, turbulence: 1,
      returnSpeed: 1, streaks: true, restStyle: 'image', ambient: false, ambientIntensity: 1, speed: 1,
      intro: false, reducedMotion: reduced, bg: PAPER, imgBg: null, liquid: 1,
    };
    let liquid: LiquidEngine | null = null;
    try { liquid = new LiquidEngine(canvas, options, fail); engine.current = liquid; } catch { fail(); }

    let cancelled = false;
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      if (cancelled || !liquid) return;
      try {
        liquid.onFirstFrame = () => { if (!cancelled) section.dataset.gl = 'on'; };
        liquid.setImage(image);
        relayout();
      } catch { fail(); }
    };
    image.src = journeySculpture.src;

    const resize = new ResizeObserver(() => relayout());
    resize.observe(section);
    if (copy.current) resize.observe(copy.current);
    document.fonts?.ready.then(() => { if (!cancelled) relayout(); });
    const seen = new IntersectionObserver(([entry]) => liquid?.setVisible(entry.isIntersecting && !document.hidden));
    seen.observe(section);
    const onVisibility = () => liquid?.setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);

    // the cursor stirs the sculpture and tilts the product orbit
    let tiltX = 0, tiltY = 0, aimX = 0, aimY = 0, tiltFrame = 0;
    const tilt = () => {
      tiltX += (aimX - tiltX) * 0.08;
      tiltY += (aimY - tiltY) * 0.08;
      if (orbit.current) orbit.current.style.transform = `rotateX(${(-tiltY * 4).toFixed(2)}deg) rotateY(${(tiltX * 6).toFixed(2)}deg)`;
      tiltFrame = Math.abs(aimX - tiltX) + Math.abs(aimY - tiltY) > 0.002 ? requestAnimationFrame(tilt) : 0;
    };
    const local = (e: PointerEvent) => { const b = section.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top, b.width, b.height] as const; };
    const onMove = (e: PointerEvent) => {
      const [x, y, w, h] = local(e);
      const touch = e.pointerType === 'touch';
      if (!(touch && e.buttons === 0 && e.pressure === 0)) liquid?.pointer('move', x, y, touch);
      if (!touch && !reduced) {
        aimX = x / w * 2 - 1; aimY = y / h * 2 - 1;
        if (!tiltFrame) tiltFrame = requestAnimationFrame(tilt);
      }
      section.dataset.touched = '1';
    };
    const onDown = (e: PointerEvent) => { const [x, y] = local(e); liquid?.pointer('down', x, y, e.pointerType === 'touch'); };
    const onUp = (e: PointerEvent) => { const [x, y] = local(e); liquid?.pointer('up', x, y, e.pointerType === 'touch'); };
    const onLeave = (e: PointerEvent) => {
      const [x, y] = local(e);
      liquid?.pointer('leave', x, y, e.pointerType === 'touch');
      aimX = 0; aimY = 0;
      if (!tiltFrame) tiltFrame = requestAnimationFrame(tilt);
    };
    section.addEventListener('pointermove', onMove, { passive: true });
    section.addEventListener('pointerdown', onDown, { passive: true });
    section.addEventListener('pointerup', onUp, { passive: true });
    section.addEventListener('pointercancel', onUp, { passive: true });
    section.addEventListener('pointerleave', onLeave, { passive: true });
    relayout();

    return () => {
      cancelled = true;
      image.onload = null;
      cancelAnimationFrame(tiltFrame);
      resize.disconnect();
      seen.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerdown', onDown);
      section.removeEventListener('pointerup', onUp);
      section.removeEventListener('pointercancel', onUp);
      section.removeEventListener('pointerleave', onLeave);
      liquid?.destroy();
      engine.current = null;
      canvas.remove();
      delete section.dataset.gl;
    };
  }, [mode, relayout]);

  // Pinned scroll: one viewport per stage, scrubbed and snapped to each stage.
  // Reverted synchronously, before React removes the section.
  useLayoutEffect(() => {
    if (mode !== 'animated' || !root.current || !host.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const state = progress.current;
    const context = gsap.context(() => {
      const tween = gsap.to(state, {
        value: LAST, ease: 'none', onUpdate: paint,
        scrollTrigger: {
          trigger: root.current, start: 'top top',
          end: () => `+=${Math.round(innerHeight * LAST * (innerWidth < 1024 ? 0.85 : 1.05))}`,
          pin: true, pinSpacer: host.current!, scrub: 1, invalidateOnRefresh: true,
          // no inertia: a flick moves one stage at a time instead of flying past products
          snap: { snapTo: 1 / LAST, inertia: false, duration: { min: 0.45, max: 1.1 }, delay: 0.06, ease: 'power3.inOut' },
        },
      });
      trigger.current = tween.scrollTrigger!;
    }, root);
    return () => { context.revert(); trigger.current = null; state.value = 0; };
  }, [mode, paint]);

  function jump(stage: number) {
    const scroll = trigger.current;
    if (scroll) window.scrollTo({ top: scroll.start + (scroll.end - scroll.start) * stage / LAST, behavior: 'smooth' });
  }

  if (mode === 'static') return <StaticJourney />;
  return <div ref={host} className="lj-host">
    <section ref={root} className="lj-root" aria-label="The ASTAMALL collection" data-stage={active}>
      <a className="lj-skip" href="#collection">Skip to products</a>
      <div ref={backdrop} className="lj-backdrop" aria-hidden="true">ASTAMALL</div>
      <div ref={stageEl} className="lj-stage" aria-hidden="true">
        <img ref={fallback} className="lj-fallback" src={journeySculpture.src} alt="" draggable={false} />
      </div>
      <div className="lj-products" aria-hidden="true">
        <div ref={orbit} className="lj-orbit">
          {journeyStages.map((stage, i) => stage.image && <div key={stage.label} ref={el => { products.current[i] = el; }} className="lj-product">
            <img src={stage.image.src} alt="" draggable={false} decoding="async" />
          </div>)}
        </div>
      </div>
      <div ref={hint} className="lj-hint" aria-hidden="true">Move across the sculpture</div>
      <div ref={copy} className="lj-copy">
        {journeyStages.map((stage, i) => <div key={stage.label} ref={el => { panels.current[i] = el; }} className="lj-panel"
          aria-hidden={active !== i} inert={active !== i} style={i ? { opacity: 0, visibility: 'hidden' } : undefined}>
          <StageCopy stage={stage} index={i} active={active === i} />
          {stage.image && <span className="lj-sr">{stage.image.alt}</span>}
        </div>)}
      </div>
      <nav className="lj-steps" aria-label="Collection journey">
        {journeyStages.map((stage, i) => <button key={stage.label} type="button" onClick={() => jump(i)} aria-current={active === i ? 'step' : undefined}>
          <span className="lj-step-dot" aria-hidden="true" /><span className="lj-step-name">{stage.label}</span>
        </button>)}
      </nav>
    </section>
  </div>;
}
