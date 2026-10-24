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
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;
/** Each scroll gesture moves half a stage: two scrolls bring in the next product. */
const STEP = 0.5;
/** The journey runs one half step past the last product, so it also takes two scrolls to move on. */
const END = LAST + STEP;
/** Virtual step past the end: the page glides on to the sections below. */
const EXIT = END + STEP;

type Layout = { w: number; h: number; wide: boolean; cx: number; cy: number; hero: Rect; boxes: Rect[] };

function fit(maxW: number, maxH: number, aspect: number, x: number, y: number): Rect {
  const w = Math.min(maxW, maxH * aspect);
  const h = w / aspect;
  return { x: x - w / 2, y: y - h / 2, w, h };
}

/** Wide screens: copy on the left, sculpture and products centred beside it. Narrow: visual above, copy below. */
function measure(w: number, h: number, copyHeight: number): Layout {
  const wide = w >= 1024;
  const top = HEADER + 8;
  const bottom = wide ? h - 40 : Math.max(top + 220, h - copyHeight);
  const band = bottom - top;
  const cx = wide ? w * 0.635 : w * 0.5;
  const cy = top + band / 2;
  const a = journeySculpture.aspect;
  return {
    w, h, wide, cx, cy,
    hero: fit(wide ? w * 0.74 : w * 1.06, band * (wide ? 1.02 : 1), a, cx, cy),
    // every product grows from the sculpture's centre
    boxes: journeyStages.map(stage => stage.image ? fit(wide ? w * 0.48 : w * 0.88, band * 0.86, stage.image.aspect, cx, cy) : { x: 0, y: 0, w: 0, h: 0 }),
  };
}

/**
 * Product i, at progress p. It grows out of the centre along a tightening spiral over [i - 0.85, i],
 * then drifts forward and dissolves over [i, i + 0.6] while the next one grows behind it.
 */
function productMotion(i: number, p: number, box: Rect, wide: boolean) {
  const grow = clamp01((p - (i - 0.85)) / 0.85);
  const leave = i < LAST ? clamp01((p - i) / 0.6) : 0;
  if (grow <= 0 || leave >= 1) return null;
  if (leave > 0) {
    const o = easeIn(leave);
    return { transform: `translate3d(0,${-o * box.h * 0.06}px,0) scale(${1 + o * 0.4}) rotate(${o * 14}deg)`, opacity: 1 - smooth(leave), blur: wide ? o * 8 : 0 };
  }
  const e = easeOut(grow);
  const turn = (1 - e) * Math.PI * 2.4;
  const r = (1 - e) * box.h * 0.16;
  return {
    transform: `translate3d(${Math.cos(turn) * r}px,${Math.sin(turn) * r * 0.7}px,0) scale(${0.05 + 0.95 * e}) rotate(${-(1 - e) * 150}deg)`,
    opacity: smooth(clamp01(grow / 0.35)),
    blur: wide ? (1 - e) * 10 : 0,
  };
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
  // the engine renders only while the hero is on screen and the sculpture has not dissolved
  const view = useRef({ inView: true, dissolved: false });
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
    const raw = progress.current.value;
    const p = Math.min(raw, LAST);
    // the half step past the last product: it settles back slightly before the page moves on
    const hold = smooth(clamp01((raw - LAST) / STEP));

    // the first product grows from the sculpture's centre while the sculpture swirls apart and fades away
    const fade = smooth(clamp01((p - 0.08) / 0.62));
    if (stageEl.current) stageEl.current.style.opacity = String(1 - fade);
    const dissolved = fade >= 0.999;
    if (dissolved !== view.current.dissolved) {
      view.current.dissolved = dissolved;
      engine.current?.setVisible(view.current.inView && !document.hidden && !dissolved);
    }
    if (!dissolved) engine.current?.setStir(smooth(clamp01(p / 0.45)), 1);

    products.current.forEach((el, i) => {
      if (!el) return;
      const s = productMotion(i, p, L.boxes[i], L.wide);
      if (!s) { el.style.visibility = 'hidden'; return; }
      el.style.visibility = 'visible';
      el.style.opacity = String(s.opacity);
      el.style.transform = i === LAST && hold > 0 ? `${s.transform} translate3d(0,${-hold * 14}px,0) scale(${1 - hold * 0.05})` : s.transform;
      el.style.filter = s.blur > 0.2 ? `blur(${s.blur.toFixed(1)}px)` : 'none';
    });
    // copy changes hands just before each half-way point, so a resting half step always shows the incoming stage
    panels.current.forEach((el, i) => {
      if (!el) return;
      const enter = i === 0 ? 1 : smooth(clamp01((p - (i - 0.62)) / 0.1));
      const exit = i === LAST ? 1 : 1 - smooth(clamp01((p - (i + 0.28)) / 0.1));
      const visible = enter * exit;
      el.style.opacity = String(visible);
      el.style.transform = `translate3d(0,${(1 - enter) * 26 - (1 - exit) * 26}px,0)`;
      el.style.visibility = visible > 0.01 ? 'visible' : 'hidden';
    });
    if (hint.current) hint.current.style.opacity = String(clamp01(1 - p * 4) * 0.55);
    if (backdrop.current) backdrop.current.style.opacity = String(1 - fade * 0.35);
    const current = Math.min(LAST, Math.floor(p + 0.62));
    if (current !== activeRef.current) { activeRef.current = current; setActive(current); }
  }, []);

  const relayout = useCallback(() => {
    const section = root.current;
    if (!section) return;
    const w = section.clientWidth;
    const h = section.clientHeight;
    const copyHeight = w >= 1024 ? 0 : (copy.current?.offsetHeight ?? 0) + 40;
    const L = measure(w, h, copyHeight);
    layout.current = L;
    L.boxes.forEach((box, i) => {
      const el = products.current[i];
      if (el) Object.assign(el.style, { left: `${box.x}px`, top: `${box.y}px`, width: `${box.w}px`, height: `${box.h}px` });
    });
    if (orbit.current) orbit.current.style.transformOrigin = `${L.cx}px ${L.cy}px`;
    const img = fallback.current;
    if (img) Object.assign(img.style, { left: `${L.hero.x}px`, top: `${L.hero.y}px`, width: `${L.hero.w}px`, height: `${L.hero.h}px` });
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
    const sync = () => liquid?.setVisible(view.current.inView && !document.hidden && !view.current.dissolved);
    const seen = new IntersectionObserver(([entry]) => { view.current.inView = entry.isIntersecting; sync(); });
    seen.observe(section);
    const onVisibility = sync;
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

  // Pinned scroll: one viewport per stage. Each scroll gesture (wheel, trackpad, swipe, key) eases the
  // journey on by half a stage, so two scrolls bring in the next product; the scrollbar snaps to half stages.
  // Reverted synchronously, before React removes the section.
  useLayoutEffect(() => {
    if (mode !== 'animated' || !root.current || !host.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const state = progress.current;
    const context = gsap.context(() => {
      const tween = gsap.to(state, {
        value: END, ease: 'none', onUpdate: paint,
        scrollTrigger: {
          trigger: root.current, start: 'top top',
          end: () => `+=${Math.round(innerHeight * END * (innerWidth < 1024 ? 0.85 : 1.05))}`,
          pin: true, pinSpacer: host.current!, scrub: 0.35, invalidateOnRefresh: true,
          snap: { snapTo: STEP / END, inertia: false, duration: { min: 0.5, max: 1 }, delay: 0.1, ease: 'power2.inOut' },
        },
      });
      trigger.current = tween.scrollTrigger!;
    }, root);

    const scroller = { y: 0 };
    let moving: gsap.core.Tween | null = null;
    let target = 0;
    let lastWheel = 0;
    let used = false;
    let touchY: number | null = null;
    const stageY = (stage: number) => {
      const t = trigger.current!;
      if (stage < EXIT) return t.start + (t.end - t.start) * stage / END;
      // past the end: the next section (the marquee) lands just under the fixed site header
      const next = host.current?.nextElementSibling;
      const header = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0;
      return next ? scrollY + next.getBoundingClientRect().top - header : t.end + (root.current?.offsetHeight ?? innerHeight);
    };
    // the resting half step nearest the scroll position (or the one already being eased to)
    const current = () => {
      if (moving) return target;
      const t = trigger.current!;
      // between the end of the pin and the next section the hero is scrolling away: one step, END to EXIT
      const at = scrollY <= t.end
        ? clamp01((scrollY - t.start) / (t.end - t.start)) * END
        : END + clamp01((scrollY - t.end) / (stageY(EXIT) - t.end)) * STEP;
      return Math.round(at / STEP) * STEP;
    };
    const inside = () => { const t = trigger.current; return !!t && scrollY >= t.start - 2 && scrollY <= stageY(EXIT) + 2; };
    const go = (stage: number) => {
      if (!trigger.current) return;
      const from = current();
      target = stage;
      moving?.kill();
      scroller.y = scrollY;
      moving = gsap.to(scroller, {
        y: stageY(stage), duration: 1.1 + Math.min(Math.abs(stage - from) / STEP - 1, 4) * 0.2, ease: 'power2.out',
        onUpdate: () => window.scrollTo({ top: scroller.y, behavior: 'instant' }),
        onComplete: () => { moving = null; },
      });
    };
    // Returns true when the gesture belongs to the journey (and so must not scroll the page natively).
    // A second scroll while the first is still easing queues on, up to one full stage ahead.
    const step = (dir: number) => {
      if (!inside()) return false;
      const next = current() + dir * STEP;
      if (next < 0 || next > EXIT) return false;
      if (!moving || Math.abs(next - progress.current.value) <= 1.01) go(next);
      return true;
    };
    // while gliding on to the sections below, input would fight the glide
    const leaving = () => !!moving && target >= EXIT;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX) || e.ctrlKey) return;
      if (leaving()) { e.preventDefault(); return; }
      // a trackpad's momentum arrives as a stream of events: only a fresh gesture moves on.
      // Mouse-wheel notches are large and spaced out, so each notch counts as its own scroll.
      const now = performance.now();
      const gap = now - lastWheel;
      const notch = e.deltaMode === 1 || Math.abs(e.deltaY) >= 80;
      if (gap > 220 || (notch && gap > 90)) used = false;
      lastWheel = now;
      const dir = Math.sign(e.deltaY);
      if (!dir || !inside()) return;
      const next = current() + dir * STEP;
      if (next < 0 || next > EXIT) return;
      e.preventDefault();
      if (used) return;
      used = true;
      step(dir);
    };
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0]?.clientY ?? null; };
    const onTouchMove = (e: TouchEvent) => {
      if (leaving()) { e.preventDefault(); return; }
      if (touchY === null || !inside()) return;
      const dy = touchY - (e.touches[0]?.clientY ?? touchY);
      const next = current() + Math.sign(dy) * STEP;
      if (!dy || next < 0 || next > EXIT) return;
      e.preventDefault();
      if (Math.abs(dy) > 28) { touchY = null; step(Math.sign(dy)); }
    };
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (e.altKey || e.ctrlKey || e.metaKey || target?.closest('input,textarea,select,[contenteditable]')) return;
      const dir = ['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey) ? 1
        : ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey) ? -1 : 0;
      if (dir && (leaving() || step(dir))) e.preventDefault();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKey);
      moving?.kill();
      context.revert(); trigger.current = null; state.value = 0;
    };
  }, [mode, paint]);

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
    </section>
  </div>;
}
