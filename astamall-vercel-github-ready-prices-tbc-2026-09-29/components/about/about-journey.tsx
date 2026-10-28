'use client';

import { Component, lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { chapters, journeyIngredients, journeyProducts, type Chapter } from '@/lib/about-journey';
import JourneySculpture from '@/components/about/journey-sculpture';
import { steppedScroll } from '@/lib/stepped-scroll';

const Scene = lazy(() => import('@/components/about/journey-scene'));
const LAST = chapters.length - 1;
/** As on the landing page, each scroll gesture moves half a chapter: two scrolls bring in the next one. */
const STEP = 0.5;
/** The journey runs one half step past the last chapter, so it also takes two scrolls to move on. */
const END = LAST + STEP;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function ChapterExtra({ chapter }: { chapter: Chapter }) {
  if (chapter.key === 'ingredients') return <ul className="ab-ingredients">{journeyIngredients.map(item =>
    <li key={item.slug}><Link href={`/ingredients/${item.slug}`}><span className="ab-swatch" style={{ background: item.color }} aria-hidden="true" />{item.name}</Link></li>)}</ul>;
  if (chapter.key === 'astamall') return <Link className="ab-btn" href="/shop">Explore the Collection <span aria-hidden="true">→</span></Link>;
  return null;
}

/** Reduced motion and no WebGL: the same journey as a calm vertical timeline. */
function StaticJourney() {
  return <section className="ab-journey-static" id="journey" aria-labelledby="journey-title">
    <h2 id="journey-title" className="ab-static-heading">From Taiwan to Malaysia.</h2>
    <ol className="ab-static-list">{chapters.map(chapter => <li key={chapter.key}>
      <span className="ab-static-label">{chapter.label}</span>
      <h3>{chapter.title}</h3>
      <p>{chapter.text}</p>
      <ChapterExtra chapter={chapter} />
      {chapter.key === 'astamall' && <div className="ab-static-products">{journeyProducts.map(p =>
        <Link key={p.slug} href={`/shop/${p.slug}`}><img src={p.image} alt={p.name} width="160" height="160" loading="lazy" /></Link>)}</div>}
    </li>)}</ol>
  </section>;
}

export default function AboutJourney() {
  const host = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef(0);
  const trigger = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<'animated' | 'static'>('animated');
  const [near, setNear] = useState(false);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const [mobile, setMobile] = useState(false);
  const fail = useCallback(() => setMode('static'), []);
  const sceneReady = useCallback(() => setReady(true), []);
  // the landing-page sculpture plays the red ingredient; it moves on the same scroll frame as the 3D scene
  const sculpture = useRef<((p: number) => void) | null>(null);
  const registerSculpture = useCallback((update: ((p: number) => void) | null) => { sculpture.current = update; update?.(progress.current); }, []);

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const small = matchMedia('(max-width: 899px)');
    let webgl = false;
    try {
      const context = document.createElement('canvas').getContext('webgl2');
      webgl = !!context;
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch { /* the static timeline is the fallback */ }
    const update = () => { setMode(motion.matches || !webgl ? 'static' : 'animated'); setMobile(small.matches); };
    update();
    motion.addEventListener('change', update);
    small.addEventListener('change', update);
    return () => { motion.removeEventListener('change', update); small.removeEventListener('change', update); };
  }, []);

  // The 3D scene loads as the journey approaches, and only renders while it is on screen.
  useEffect(() => {
    const section = root.current;
    if (mode !== 'animated' || !section) return;
    const approach = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setNear(true); }, { rootMargin: '900px 0px' });
    const onScreen = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting && !document.hidden));
    const onVisibility = () => setRunning(!document.hidden && section.getBoundingClientRect().bottom > 0 && section.getBoundingClientRect().top < innerHeight);
    approach.observe(section);
    onScreen.observe(section);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { approach.disconnect(); onScreen.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
  }, [mode]);

  const paint = useCallback(() => {
    const p = progress.current;
    if (fill.current) fill.current.style.transform = `scaleY(${p / LAST})`;
    sculpture.current?.(p);
    // A chapter's copy holds through the first scroll after it; on the second it hands over to the next chapter.
    panels.current.forEach((el, i) => {
      if (!el) return;
      const d = p - i;
      const fadeIn = smooth(clamp01((d + 0.4) / 0.3));
      const fadeOut = 1 - smooth(clamp01((d - 0.5) / 0.2));
      const visible = fadeIn * fadeOut;
      el.style.opacity = String(visible);
      el.style.transform = `translate3d(0,${d < 0 ? (1 - fadeIn) * 28 : -(1 - fadeOut) * 28}px,0)`;
      el.style.visibility = visible > 0.01 ? 'visible' : 'hidden';
    });
    const current = Math.min(LAST, Math.floor(p + 0.3));
    if (current !== activeRef.current) { activeRef.current = current; setActive(current); }
  }, []);

  // Pinned for one viewport per chapter and scrubbed. Scroll gestures step it on half a chapter at a time, then
  // past the last chapter on to the sections below; the scrollbar snaps to half chapters.
  // Reverted before React removes the section.
  useLayoutEffect(() => {
    if (mode !== 'animated' || !root.current || !host.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const state = { value: 0 };
    const context = gsap.context(() => {
      const tween = gsap.to(state, {
        value: END, ease: 'none',
        // the half step past the last chapter holds it in place
        onUpdate: () => { progress.current = Math.min(state.value, LAST); paint(); },
        scrollTrigger: {
          trigger: root.current, start: 'top top',
          end: () => `+=${Math.round(innerHeight * END * (innerWidth < 900 ? 0.8 : 0.95))}`,
          pin: true, pinSpacer: host.current!, scrub: 0.3, invalidateOnRefresh: true,
          // the delay outlasts a gesture's settle, so snapping only ever handles the scrollbar
          snap: { snapTo: STEP / END, inertia: false, directional: false, delay: 0.3, duration: { min: 0.5, max: 1 }, ease: 'power2.inOut' },
        },
      });
      trigger.current = tween.scrollTrigger!;
    }, root);
    paint();
    const release = steppedScroll({ trigger: () => trigger.current, host: host.current, root: root.current, end: END, step: STEP, progress: () => state.value });
    return () => { release(); context.revert(); trigger.current = null; progress.current = 0; };
  }, [mode, paint]);

  function jump(i: number) {
    const t = trigger.current;
    if (t) window.scrollTo({ top: t.start + (t.end - t.start) * i / END, behavior: 'smooth' });
  }

  if (mode === 'static') return <StaticJourney />;
  return <div ref={host} className="ab-journey-host">
    <section ref={root} className="ab-journey" id="journey" aria-labelledby="journey-title" data-ready={ready}>
      <h2 id="journey-title" className="ab-sr">From Taiwan to Malaysia</h2>
      <nav className="ab-rail" aria-label="Journey chapters">
        <span className="ab-rail-line" aria-hidden="true"><span ref={fill} className="ab-rail-fill" /></span>
        <ol>{chapters.map((chapter, i) => <li key={chapter.key}>
          <button type="button" onClick={() => jump(i)} aria-current={active === i ? 'step' : undefined} data-passed={i < active || undefined}>
            <span className="ab-rail-dot" aria-hidden="true" /><span className="ab-rail-label">{chapter.label}</span>
          </button>
        </li>)}</ol>
      </nav>
      <div className="ab-stage" aria-hidden="true">
        {near && <JourneySculpture register={registerSculpture} mobile={mobile} />}
        {near && <SceneBoundary onFailure={fail}><Suspense fallback={null}>
          <Scene progress={progress} running={running} mobile={mobile} onReady={sceneReady} />
        </Suspense></SceneBoundary>}
      </div>
      <div className="ab-copy">{chapters.map((chapter, i) => <div key={chapter.key} ref={el => { panels.current[i] = el; }} className="ab-chapter"
        aria-hidden={active !== i} inert={active !== i} style={i ? { opacity: 0, visibility: 'hidden' } : undefined}>
        <h3>{chapter.title}</h3>
        <p>{chapter.text}</p>
        <ChapterExtra chapter={chapter} />
      </div>)}</div>
    </section>
  </div>;
}
