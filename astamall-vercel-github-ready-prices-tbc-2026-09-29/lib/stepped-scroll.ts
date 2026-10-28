import { gsap } from 'gsap';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

type Options = {
  /** The pinned, scrubbed ScrollTrigger that maps the scroll position to 0 ... end. */
  trigger: () => ScrollTrigger | null;
  /** The pin spacer; the section after it is where the page glides on to. */
  host: HTMLElement;
  /** The pinned section. */
  root: HTMLElement;
  /** Where the pinned journey ends, in stages. */
  end: number;
  /** How far one scroll gesture moves the journey, in stages. */
  step: number;
  /** The journey's current (scrubbed) position, in stages. */
  progress: () => number;
};

/**
 * Stepped scrolling for a pinned journey: each scroll gesture (wheel notch, trackpad swipe, touch swipe, key)
 * moves it on by one step. A trackpad swipe is followed live, then settles on the step. One virtual step past
 * the end glides the page on to the section below. Returns the cleanup.
 */
export function steppedScroll({ trigger, host, root, end, step: STEP, progress }: Options) {
  const EXIT = end + STEP;
  const scroller = { y: 0 };
  let moving: gsap.core.Tween | null = null;
  let target = 0;
  let lastWheel = 0;
  let lastAbs = 0;
  let touchY: number | null = null;
  // one scroll gesture: where it started, how far it has travelled (in stages) and how its speed has evolved
  type Gesture = { origin: number; travel: number; native: boolean; start: number; peak: number; trough: number; decayed: boolean };
  let gesture: Gesture | null = null;
  let settleTimer = 0;
  // a trackpad swipe of this many pixels of wheel delta covers one step
  const PX_PER_STEP = 240;
  const exitY = () => {
    const t = trigger()!;
    // past the end: the next section lands just under the fixed site header
    const next = host.nextElementSibling;
    const header = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0;
    return next ? scrollY + next.getBoundingClientRect().top - header : t.end + root.offsetHeight;
  };
  const stageY = (stage: number) => {
    const t = trigger()!;
    if (stage <= end) return t.start + (t.end - t.start) * stage / end;
    return mix(t.end, exitY(), Math.min(1, (stage - end) / STEP));
  };
  const clampStage = (stage: number) => Math.min(EXIT, Math.max(0, stage));
  // the resting step nearest the scroll position (or the one already being eased to)
  const current = () => {
    if (moving) return target;
    const t = trigger()!;
    // between the end of the pin and the next section the journey is scrolling away: one step, end to EXIT
    const at = scrollY <= t.end
      ? clamp01((scrollY - t.start) / (t.end - t.start)) * end
      : end + clamp01((scrollY - t.end) / (stageY(EXIT) - t.end)) * STEP;
    return Math.round(at / STEP) * STEP;
  };
  const inside = () => { const t = trigger(); return !!t && scrollY >= t.start - 2 && scrollY <= stageY(EXIT) + 2; };
  const scrollTo = () => window.scrollTo({ top: scroller.y, behavior: 'instant' });
  const go = (stage: number, duration?: number) => {
    if (!trigger()) return;
    const from = current();
    target = stage;
    gsap.killTweensOf(scroller);
    scroller.y = scrollY;
    moving = gsap.to(scroller, {
      y: stageY(stage), duration: duration ?? 1.1 + Math.min(Math.abs(stage - from) / STEP - 1, 4) * 0.2, ease: 'power2.out',
      onUpdate: scrollTo,
      onComplete: () => { moving = null; },
    });
  };
  // trackpads: the journey follows the fingers, with a light ease so it never jitters
  const follow = (stage: number) => {
    gsap.killTweensOf(scroller);
    moving = null;
    scroller.y = scrollY;
    gsap.to(scroller, { y: stageY(stage), duration: 0.35, ease: 'power3.out', onUpdate: scrollTo });
  };
  // the gesture is over: settle on the step it was heading for (a tiny nudge springs back)
  const finish = () => {
    clearTimeout(settleTimer);
    settleTimer = 0;
    const g = gesture;
    gesture = null;
    if (!g || g.native) return;
    const dest = Math.abs(g.travel) > STEP * 0.15 ? clampStage(g.origin + Math.sign(g.travel) * STEP) : g.origin;
    // the closer the fingers already brought it, the quicker it settles
    go(dest, 0.4 + Math.min(1, Math.abs(stageY(dest) - scrollY) / (stageY(STEP) - stageY(0))) * 0.5);
  };
  // Returns true when the gesture belongs to the journey (and so must not scroll the page natively).
  // A second scroll while the first is still easing queues on, up to two steps ahead.
  const step = (dir: number) => {
    if (!inside()) return false;
    const next = current() + dir * STEP;
    if (next < 0 || next > EXIT) return false;
    if (!moving || Math.abs(next - progress()) <= STEP * 2 + 0.01) go(next);
    return true;
  };
  // while gliding on to the sections below, input would fight the glide
  const leaving = () => !!moving && target >= EXIT;
  const onWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaY) < Math.abs(e.deltaX) || e.ctrlKey) return;
    if (leaving()) { e.preventDefault(); return; }
    const dy = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
    const abs = Math.abs(dy);
    if (!abs) return;
    const now = performance.now();
    const gap = now - lastWheel;
    lastWheel = now;
    // A new gesture starts after a pause, with every mouse-wheel notch, or when a fresh trackpad swipe
    // lifts the speed again while the previous swipe's momentum is still trailing off.
    const notch = e.deltaMode === 1 || (abs >= 80 && gap > 90);
    const g0 = gesture;
    if (g0) {
      g0.peak = Math.max(g0.peak, abs);
      if (abs < g0.peak * 0.5) g0.decayed = true;
      g0.trough = g0.decayed ? Math.min(g0.trough, lastAbs) : abs;
    }
    const rising = !!g0 && g0.decayed && now - g0.start > 250 && abs > g0.trough * 2 + 8;
    lastAbs = abs;
    if (!g0 || gap > 140 || notch || rising) {
      if (g0) finish();
      const origin = current();
      const next = origin + Math.sign(dy) * STEP;
      gesture = { origin, travel: 0, native: !inside() || next < 0 || next > EXIT, start: now, peak: abs, trough: abs, decayed: false };
    }
    const g = gesture!;
    if (g.native) return;
    e.preventDefault();
    g.travel = Math.max(-STEP, Math.min(STEP, g.travel + (notch ? Math.sign(dy) * STEP * 0.4 : (dy / PX_PER_STEP) * STEP)));
    follow(clampStage(g.origin + g.travel));
    clearTimeout(settleTimer);
    settleTimer = window.setTimeout(finish, notch ? 120 : 150);
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
    const el = e.target as HTMLElement | null;
    if (e.altKey || e.ctrlKey || e.metaKey || el?.closest('input,textarea,select,[contenteditable]')) return;
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
    clearTimeout(settleTimer);
    gsap.killTweensOf(scroller);
  };
}
