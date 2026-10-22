'use client';

import { Component, lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroCategories, heroStageArt, heroStages } from '@/lib/cinematic-catalog';
import { selectedStage, stageWeight } from '@/lib/cinematic-motion';

const Scene = lazy(() => import('@/components/cinematic/astamall-scene'));

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function CollectionFallback({ reason, onResume }: { reason: string; onResume?: () => void }) {
  return <section className="journey-fallback" data-journey-mode={reason} aria-label="Explore ASTAMALL">
    <div className="journey-fallback-copy">
      <p className="journey-eyebrow">THE ESSENCE OF ASTAMALL</p>
      <h1>One Powerful Ingredient.<em>A World of Possibilities.</em></h1>
      <p>Discover beauty and wellness through thoughtfully selected products, inspired by astaxanthin.</p>
      <Link className="journey-cta" href="/shop">Explore All Products <span aria-hidden="true">↗</span></Link>
      {onResume && <button className="journey-resume" onClick={onResume}>Resume animation</button>}
    </div>
    <div className="journey-fallback-collection">{heroCategories.map((c, index) => {
      const art = heroStageArt[index + 1];
      return <Link href={c.href} key={c.name}>
        <img src={art.imageUrl} alt={art.alt} width="400" height="400" />
        <span>{c.label} <span aria-hidden="true">↗</span></span>
      </Link>;
    })}</div>
  </section>;
}

export default function AstamallScrollHero() {
  const host = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef(0);
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
  const [preloadThrough, setPreloadThrough] = useState(1);
  const fail = useCallback(() => { trigger.current?.kill(true); setFailed(true); setEnabled(false); }, []);
  const sceneReady = useCallback(() => setReady(true), []);

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

  // Revert the pin synchronously, before React removes or replaces the section.
  useLayoutEffect(() => {
    if (!animated || !ready || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const paint = () => {
      const current = selectedStage(progress.current);
      panels.current.forEach((panel, i) => {
        if (!panel) return;
        const weight = stageWeight(progress.current, i);
        panel.style.opacity = String(Math.max(0, (weight - 0.55) / 0.45));
        panel.style.transform = `translate3d(0,${(1 - weight) * 18}px,0)`;
      });
      if (current !== activeRef.current) {
        activeRef.current = current;
        setActive(current);
        setPreloadThrough(value => Math.max(value, Math.min(4, current + 1)));
      }
    };
    const context = gsap.context(() => {
      const tween = gsap.fromTo(progress, { current: 0 }, {
        current: 1, ease: 'none', onUpdate: paint,
        scrollTrigger: {
          trigger: root.current, start: 'top top',
          end: () => `+=${Math.round(innerHeight * (mobile ? 3 : 4.2))}`,
          pin: true, pinSpacer: host.current!, scrub: 0.7, invalidateOnRefresh: true,
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
    if (scroll) window.scrollTo({ top: scroll.start + (scroll.end - scroll.start) * stage / 4, behavior: 'instant' });
  }
  function resume() {
    setReady(false); setActive(0); activeRef.current = 0; setPaused(false);
  }

  if (!animated) return <div ref={host} className="journey-host"><CollectionFallback reason={paused ? 'paused' : failed ? 'scene-unavailable' : mode} onResume={paused && enabled && !failed ? resume : undefined} /></div>;
  return <div ref={host} className="journey-host"><section ref={root} className="journey-hero" aria-label="The ASTAMALL collection journey" data-stage={active} data-ready={ready}>
    <a className="journey-skip" href="#collection">Skip to products ↓</a>
    <button className="journey-pause" onClick={() => { trigger.current?.kill(true); window.scrollTo({ top: 0, behavior: 'instant' }); setPaused(true); }}>Pause animation</button>
    <div className="journey-scene" aria-hidden="true">
      <SceneBoundary onFailure={fail}>
        <Suspense fallback={null}><Scene progress={progress} mobile={mobile} running={running || !ready} preloadThrough={preloadThrough} onReady={sceneReady} onFailure={fail} /></Suspense>
      </SceneBoundary>
      {!ready && <div className="journey-loading-art"><img src={heroStageArt[0].imageUrl} alt="" width="1440" height="1080" /></div>}
    </div>
    <div className="journey-copy">
      {heroStages.map((stage, i) => <div ref={element => { panels.current[i] = element; }} className="journey-panel" key={stage.label} aria-hidden={active !== i} inert={active !== i} style={{ opacity: i === 0 ? 1 : 0 }}>
        <p className="journey-eyebrow">{stage.eyebrow}</p>
        {i === 0 ? <h1>{stage.title}<em>{stage.accent}</em></h1> : <h2>{stage.title}{stage.accent && <em>{stage.accent}</em>}</h2>}
        <p className="journey-description">{stage.description}</p>
        <div className="journey-links"><Link className="journey-cta" href={stage.href}>{stage.cta} <span aria-hidden="true">↗</span></Link>
          {i === 4 && <Link className="journey-story" href="/about">Our story</Link>}
        </div>
      </div>)}
    </div>
    <div className="journey-bottom">
      <span className="journey-scroll-hint"><span aria-hidden="true">↓</span> Explore at your pace</span>
      <nav aria-label="Collection journey" className="journey-stages">{heroStages.map((stage, i) =>
        <button key={stage.label} onClick={() => jump(i)} aria-label={`Show ${stage.label}`} aria-current={active === i ? 'step' : undefined}>
          <span className="journey-stage-dot" aria-hidden="true"/><span className="journey-stage-name">{['Origin', 'Beauty', 'Nourishment', 'Wellness', 'Collection'][i]}</span>
        </button>)}</nav>

    </div>
  </section></div>;
}
