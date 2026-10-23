'use client';

import { Component, lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroCategories, heroIntro, heroOutro, spiralProducts } from '@/lib/cinematic-catalog';
import { spiralPanelWeight, spiralState } from '@/lib/cinematic-motion';
import { FluidSim } from '@/lib/fluid-sim';
import type { SpiralPoint } from '@/components/cinematic/spiral-scene';

const Scene = lazy(() => import('@/components/cinematic/spiral-scene'));
const count = spiralProducts.length;
const stops = count + 2;

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function CollectionFallback({ reason, onResume }: { reason: string; onResume?: () => void }) {
  return <section className="journey-fallback" data-journey-mode={reason} aria-label="Explore ASTAMALL">
    <div className="journey-fallback-copy">
      <p className="journey-eyebrow">{heroIntro.eyebrow}</p>
      <h1>{heroIntro.title}<em>{heroIntro.accent}</em></h1>
      <p>{heroIntro.description}</p>
      <Link className="journey-cta" href="/shop">Explore All Products <span aria-hidden="true">↗</span></Link>
      {onResume && <button className="journey-resume" onClick={onResume}>Resume animation</button>}
    </div>
    <div className="journey-fallback-collection">{heroCategories.map(c => {
      const product = spiralProducts.find(p => p.category === c.name)!;
      return <Link href={c.href} key={c.name}>
        <img src={product.imageUrl} alt={product.name} width="400" height="400" />
        <span>{c.label} <span aria-hidden="true">↗</span></span>
      </Link>;
    })}</div>
  </section>;
}

/** Cursor and scroll both feed one fluid. The cursor paints freely; scrolling swirls ink along the product spiral. */
function useFluid(root: React.RefObject<HTMLElement | null>, progress: React.RefObject<number>, spiralPoint: React.RefObject<SpiralPoint>, mounted: boolean, running: boolean, mobile: boolean) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const runningRef = useRef(running);
  useEffect(() => { runningRef.current = running; }, [running]);
  useEffect(() => {
    const node = canvas.current, section = root.current;
    if (!mounted || !node || !section) return;
    let sim: FluidSim;
    try { sim = new FluidSim(node, { simResolution: mobile ? 96 : 128, dyeResolution: mobile ? 420 : 720, pixelRatio: mobile ? 1.25 : 1.5 }); }
    catch { node.hidden = true; return; }
    // Phones get a finer brush and less ink, so a thumb-sized screen is never fully flooded.
    const radius = mobile ? .012 : .019, ink = mobile ? .6 : 1;
    const pointer = { x: -1, y: -1, last: 0 };
    const born = performance.now();
    let frame = 0, previous = born, lastProgress = progress.current ?? 0;
    let scrolled = 0;

    const paint = (clientX: number, clientY: number) => {
      const box = node.getBoundingClientRect();
      const x = (clientX - box.left) / box.width, y = (clientY - box.top) / box.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      if (pointer.x >= 0) {
        const dx = x - pointer.x, dy = y - pointer.y, speed = Math.hypot(dx, dy);
        if (speed > .0005) sim.splat(x, y, dx * 4600, dy * 4600, (.3 + Math.min(speed * 8, .5)) * ink, radius * (1.2 + Math.min(speed * 26, 1.3)));
      }
      pointer.x = x; pointer.y = y; pointer.last = performance.now();
    };
    const onPointer = (event: PointerEvent) => paint(event.clientX, event.clientY);
    const onTouch = (event: TouchEvent) => { const t = event.touches[0]; if (t) paint(t.clientX, t.clientY); };
    const onLeave = () => { pointer.x = -1; };
    section.addEventListener('pointermove', onPointer, { passive: true });
    section.addEventListener('touchmove', onTouch, { passive: true });
    section.addEventListener('pointerleave', onLeave);
    const resize = new ResizeObserver(() => sim.resize());
    resize.observe(node);

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!runningRef.current) { previous = now; return; }
      const elapsed = Math.min((now - previous) / 1000, .25), dt = Math.min(elapsed, 1 / 30); previous = now;
      const age = (now - born) / 1000;
      // Opening bloom: a broad pour across the hero so the liquid is present before anyone moves.
      if (age < 1.6 && Math.floor(now / 16) % 3 === 0) {
        const a = age * 3;
        sim.splat(.68 + Math.cos(a) * .16, .5 + Math.sin(a * 1.3) * .22, Math.cos(a + 1.6) * 700, Math.sin(a + 1.6) * 700, .28 * ink, radius * 2.2);
      }
      // Idle drift keeps the surface alive when the pointer rests.
      if (now - pointer.last > 2600 && age > 1.6 && Math.floor(now / 16) % 6 === 0) {
        const t = now / 1000;
        const x = .55 + Math.sin(t * .45) * .3, y = .5 + Math.sin(t * .7 + 1) * .28;
        sim.splat(x, y, Math.cos(t * .45) * 300, Math.cos(t * .7 + 1) * 300, .12, radius * 1.8);
      }
      // Scroll: ink orbits the point travelling down the helix, so the liquid spirals into the next product.
      const p = progress.current ?? 0, delta = p - lastProgress; lastProgress = p;
      const point = spiralPoint.current;
      if (Math.abs(delta) > .00002 && point?.visible) {
        const energy = Math.min(Math.abs(delta) * 160, 1);
        // The orbit is widest between products and tightens as the next one arrives: an inward spiral.
        const orbit = now / 1000 * 5 + p * 60, r = (mobile ? .13 : .17) * (.4 + .6 * Math.abs(Math.sin(p * (count + 1) * Math.PI)));
        // Two arms orbit the arriving product, drawing a double spiral; the emission budget stays small per frame.
        const aspect = node.clientWidth / node.clientHeight, dir = Math.sign(delta);
        for (const arm of [0, Math.PI]) {
          const a = orbit + arm, ax = point.x + Math.cos(a) * r, ay = point.y + Math.sin(a) * r * aspect;
          sim.splat(ax, ay, -Math.sin(a) * 2400 * dir, Math.cos(a) * 2400 * dir, (.12 + energy * .18) * ink, radius * 1.05);
        }
        scrolled = now;
      }
      // Once the reader settles on a product, the ink drains away so the product reads clearly.
      sim.dyeDissipation = now - scrolled < 450 ? 1.2 : now - scrolled < 2600 ? 2.4 : now - pointer.last < 1500 ? .85 : 1.35;
      sim.step(dt, elapsed);
      sim.render();
    };
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame); resize.disconnect();
      section.removeEventListener('pointermove', onPointer); section.removeEventListener('touchmove', onTouch); section.removeEventListener('pointerleave', onLeave);
      sim.dispose();
    };
  }, [root, progress, spiralPoint, mounted, mobile]);
  return canvas;
}

export default function AstamallScrollHero() {
  const host = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef(0);
  const spiralPoint = useRef<SpiralPoint>({ x: .7, y: .5, visible: false });
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

  const fluid = useFluid(root, progress, spiralPoint, animated, running, mobile);
  const reportSpiral = useCallback((point: SpiralPoint) => { spiralPoint.current = point; }, []);

  // Revert the pin synchronously, before React removes or replaces the section.
  useLayoutEffect(() => {
    if (!animated || !ready || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const paint = () => {
      const p = progress.current;
      panels.current.forEach((panel, i) => {
        if (!panel) return;
        const weight = spiralPanelWeight(p, count, i);
        panel.style.opacity = String(weight);
        panel.style.transform = `translate3d(0,${(1 - weight) * 22}px,0)`;
      });
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      const current = spiralState(p, count).selected;
      if (current !== activeRef.current) { activeRef.current = current; setActive(current); }
    };
    const context = gsap.context(() => {
      const tween = gsap.fromTo(progress, { current: 0 }, {
        current: 1, ease: 'none', onUpdate: paint,
        scrollTrigger: {
          trigger: root.current, start: 'top top',
          end: () => `+=${Math.round(innerHeight * stops * (mobile ? .45 : .55))}`,
          pin: true, pinSpacer: host.current!, scrub: .8, invalidateOnRefresh: true,
          snap: { snapTo: 1 / (stops - 1), duration: { min: .25, max: .7 }, delay: .08, ease: 'power2.inOut' },
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

  function jump(stop: number) {
    const scroll = trigger.current;
    if (scroll) window.scrollTo({ top: scroll.start + (scroll.end - scroll.start) * stop / (stops - 1), behavior: 'smooth' });
  }
  function resume() { setReady(false); setActive(0); activeRef.current = 0; setPaused(false); }

  if (!animated) return <div ref={host} className="journey-host"><CollectionFallback reason={paused ? 'paused' : failed ? 'scene-unavailable' : mode} onResume={paused && enabled && !failed ? resume : undefined} /></div>;
  const focusedCategory = active >= 1 && active <= count ? spiralProducts[active - 1].category : null;
  return <div ref={host} className="journey-host"><section ref={root} className="journey-hero spiral-hero" aria-label="The ASTAMALL collection" data-stage={active} data-ready={ready}>
    <a className="journey-skip" href="#collection">Skip to products ↓</a>
    <button className="journey-pause" onClick={() => { trigger.current?.kill(true); window.scrollTo({ top: 0, behavior: 'instant' }); setPaused(true); }}>Pause animation</button>
    <div className="spiral-scene" aria-hidden="true">
      <SceneBoundary onFailure={fail}>
        <Suspense fallback={null}><Scene progress={progress} onSpiralPoint={reportSpiral} mobile={mobile} running={running || !ready} onReady={sceneReady} onFailure={fail} /></Suspense>
      </SceneBoundary>
    </div>
    <div className="journey-copy">
      <div ref={element => { panels.current[0] = element; }} className="journey-panel" aria-hidden={active !== 0} inert={active !== 0} style={{ opacity: 1 }}>
        <p className="journey-eyebrow">{heroIntro.eyebrow}</p>
        <h1>{heroIntro.title}<em>{heroIntro.accent}</em></h1>
        <p className="journey-description">{heroIntro.description}</p>
        <div className="journey-links"><Link className="journey-cta" href="/shop">Explore the Collection <span aria-hidden="true">↗</span></Link></div>
      </div>
      {spiralProducts.map((product, i) => <div key={product.id} ref={element => { panels.current[i + 1] = element; }} className="journey-panel spiral-panel" aria-hidden={active !== i + 1} inert={active !== i + 1} style={{ opacity: 0 }}>
        <p className="spiral-category">{heroCategories.find(c => c.name === product.category)?.label}</p>
        <h2>{product.name}</h2>
        <p className="journey-description">{product.benefit}</p>
        <div className="journey-links"><Link className="journey-cta" href={product.href}>View product <span aria-hidden="true">↗</span></Link></div>
      </div>)}
      <div ref={element => { panels.current[count + 1] = element; }} className="journey-panel" aria-hidden={active !== count + 1} inert={active !== count + 1} style={{ opacity: 0 }}>
        <h2>{heroOutro.title}<em>{heroOutro.accent}</em></h2>
        <p className="journey-description">{heroOutro.description}</p>
        <div className="journey-links"><Link className="journey-cta" href="/shop">Explore All Products <span aria-hidden="true">↗</span></Link><Link className="journey-story" href="/about">Our story</Link></div>
      </div>
    </div>
    <canvas ref={fluid} className="fluid-canvas" aria-hidden="true" />
    <div className="journey-bottom spiral-bottom">
      <span className="spiral-progress" aria-hidden="true"><span ref={bar} /></span>
      <nav aria-label="Jump to a collection" className="journey-stages">{heroCategories.map(c => {
        const index = spiralProducts.findIndex(p => p.category === c.name);
        return <button key={c.name} onClick={() => jump(index + 1)} aria-current={focusedCategory === c.name ? 'step' : undefined}>
          <span className="journey-stage-name">{c.label}</span>
        </button>;
      })}</nav>
    </div>
  </section></div>;
}
