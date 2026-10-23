'use client';

import { Component, lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroCategories, heroStageProducts, heroStages } from '@/lib/cinematic-catalog';
import { selectedStage, stageWeight } from '@/lib/cinematic-motion';
import type { PointerState } from '@/components/cinematic/sculpture-scene';

const Scene = lazy(() => import('@/components/cinematic/sculpture-scene'));

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function CollectionFallback({ reason, onResume }: { reason: string; onResume?: () => void }) {
  const origin = heroStages[0];
  return <section className="journey-fallback" data-journey-mode={reason} aria-label="Explore ASTAMALL">
    <div className="journey-fallback-copy">
      <p className="journey-eyebrow">{origin.eyebrow}</p>
      <h1>{origin.title}<em>{origin.accent}</em></h1>
      <p>{origin.description}</p>
      <Link className="journey-cta" href="/shop">Explore All Products <span aria-hidden="true">↗</span></Link>
      {onResume && <button className="journey-resume" onClick={onResume}>Resume animation</button>}
    </div>
    <div className="journey-fallback-collection">{heroCategories.map((c, index) => {
      const product = heroStageProducts[index + 1][0];
      return <Link href={c.href} key={c.name}>
        <img src={product.imageUrl} alt={product.name} width="400" height="400" />
        <span>{c.label} <span aria-hidden="true">↗</span></span>
      </Link>;
    })}</div>
  </section>;
}

function StagePanel({ index, active, register }: { index: number; active: number; register: (index: number, element: HTMLDivElement | null) => void }) {
  const stage = heroStages[index];
  const Heading = index === 0 ? 'h1' : 'h2';
  return <div ref={element => register(index, element)} className="journey-panel sculpture-panel" aria-hidden={active !== index} inert={active !== index} style={{ opacity: index === 0 ? 1 : 0 }}>
    <p className="journey-eyebrow">{stage.eyebrow}</p>
    <Heading>{stage.title}{stage.accent && <em>{stage.accent}</em>}</Heading>
    <p className="journey-description">{stage.description}</p>
    <div className="journey-links"><Link className="journey-cta" href={stage.href}>{stage.cta} <span aria-hidden="true">↗</span></Link>
      {index === heroStages.length - 1 && <Link className="journey-story" href="/about">Our story</Link>}
    </div>
  </div>;
}

export default function AstamallScrollHero() {
  const host = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef(0);
  const pointer = useRef<PointerState>({ x: 0, y: 0, active: 0, moved: 0 });
  const trigger = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState('initializing');
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(true);
  const fail = useCallback(() => { trigger.current?.kill(true); setFailed(true); setEnabled(false); }, []);
  const sceneReady = useCallback(() => setReady(true), []);
  const register = useCallback((index: number, element: HTMLDivElement | null) => { panels.current[index] = element; }, []);

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const small = matchMedia('(max-width: 767px)');
    let supportsWebGL = false;
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2');
      supportsWebGL = !!context;
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch { /* The static collection is already rendered. */ }
    const update = () => {
      if (!supportsWebGL || motion.matches) trigger.current?.kill(true);
      setMobile(small.matches);
      setEnabled(supportsWebGL && !motion.matches);
      setMode(motion.matches ? 'reduced-motion' : supportsWebGL ? 'animated' : 'webgl-unavailable');
    };
    update();
    motion.addEventListener('change', update);
    small.addEventListener('change', update);
    return () => { motion.removeEventListener('change', update); small.removeEventListener('change', update); };
  }, []);

  const animated = enabled && !failed && !paused;
  useEffect(() => {
    if (!animated || !root.current) return;
    let inView = true;
    const sync = () => setRunning(inView && document.visibilityState !== 'hidden');
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { rootMargin: '80px' });
    observer.observe(root.current);
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, [animated]);

  // The cursor (or a finger) is tracked in normalised device coordinates; the scene reads it every frame.
  useEffect(() => {
    const section = root.current;
    if (!animated || !section) return;
    const track = (clientX: number, clientY: number) => {
      const box = section.getBoundingClientRect();
      const state = pointer.current;
      state.x = ((clientX - box.left) / box.width) * 2 - 1;
      state.y = -((clientY - box.top) / box.height) * 2 + 1;
      state.active = 1; state.moved = performance.now();
    };
    const onPointer = (event: PointerEvent) => track(event.clientX, event.clientY);
    const onTouch = (event: TouchEvent) => { const t = event.touches[0]; if (t) track(t.clientX, t.clientY); };
    const onLeave = () => { pointer.current.active = 0; };
    section.addEventListener('pointermove', onPointer, { passive: true });
    section.addEventListener('touchmove', onTouch, { passive: true });
    section.addEventListener('pointerleave', onLeave);
    return () => { section.removeEventListener('pointermove', onPointer); section.removeEventListener('touchmove', onTouch); section.removeEventListener('pointerleave', onLeave); };
  }, [animated]);

  // Revert the pin synchronously, before React removes or replaces the section.
  useLayoutEffect(() => {
    if (!animated || !ready || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const paint = () => {
      panels.current.forEach((panel, i) => {
        if (!panel) return;
        const weight = stageWeight(progress.current, i);
        const visible = Math.max(0, (weight - .5) / .5);
        panel.style.opacity = String(visible);
        panel.style.transform = `translate3d(0,${(1 - visible) * 18}px,0)`;
      });
      const current = selectedStage(progress.current);
      if (current !== activeRef.current) { activeRef.current = current; setActive(current); }
    };
    const context = gsap.context(() => {
      const tween = gsap.fromTo(progress, { current: 0 }, {
        current: 1, ease: 'none', onUpdate: paint,
        scrollTrigger: {
          trigger: root.current, start: 'top top',
          end: () => `+=${Math.round(innerHeight * (mobile ? 3 : 4.2))}`,
          pin: true, pinSpacer: host.current!, scrub: .8, invalidateOnRefresh: true,
          snap: { snapTo: .25, duration: { min: .3, max: .8 }, delay: .1, ease: 'power2.inOut' },
          onRefresh: paint,
        },
      });
      trigger.current = tween.scrollTrigger!;
      paint();
    }, root);
    return () => { context.revert(); trigger.current = null; progress.current = 0; };
  }, [animated, ready, mobile]);

  useEffect(() => {
    if (!animated || ready) return;
    const timeout = window.setTimeout(fail, 30000);
    return () => clearTimeout(timeout);
  }, [animated, ready, fail]);

  function jump(stage: number) {
    const scroll = trigger.current;
    if (scroll) window.scrollTo({ top: scroll.start + (scroll.end - scroll.start) * stage / 4, behavior: 'smooth' });
  }
  function resume() { setReady(false); setActive(0); activeRef.current = 0; setPaused(false); }

  if (!animated) return <div ref={host} className="journey-host"><CollectionFallback reason={paused ? 'paused' : failed ? 'scene-unavailable' : mode} onResume={paused && enabled && !failed ? resume : undefined} /></div>;
  return <div ref={host} className="journey-host"><section ref={root} className="journey-hero sculpture-hero" aria-label="The ASTAMALL collection journey" data-stage={active} data-ready={ready}>
    <a className="journey-skip" href="#collection">Skip to products ↓</a>
    <button className="journey-pause" onClick={() => { trigger.current?.kill(true); window.scrollTo({ top: 0, behavior: 'instant' }); setPaused(true); }}>Pause animation</button>
    {/* The origin copy sits behind the sculpture; moving the cursor parts the liquid to read it. */}
    <div className="sculpture-copy sculpture-copy-back"><StagePanel index={0} active={active} register={register} /></div>
    <div className="sculpture-scene" aria-hidden="true">
      <SceneBoundary onFailure={fail}>
        <Suspense fallback={null}><Scene progress={progress} pointer={pointer} mobile={mobile} running={running || !ready} onReady={sceneReady} onFailure={fail} /></Suspense>
      </SceneBoundary>
    </div>
    <div className="sculpture-copy sculpture-copy-front">{heroStages.slice(1).map((_, i) => <StagePanel key={i + 1} index={i + 1} active={active} register={register} />)}</div>
    <div className="journey-bottom sculpture-bottom">
      <nav aria-label="Collection journey" className="journey-stages">{heroStages.map((stage, i) =>
        <button key={stage.label} onClick={() => jump(i)} aria-current={active === i ? 'step' : undefined}>
          <span className="journey-stage-dot" aria-hidden="true" /><span className="journey-stage-name">{['Origin', 'Beauty', 'Nourishment', 'Wellness', 'Collection'][i]}</span>
        </button>)}</nav>
    </div>
  </section></div>;
}
