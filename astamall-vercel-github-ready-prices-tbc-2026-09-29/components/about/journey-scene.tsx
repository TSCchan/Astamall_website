'use client';

import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image as ImagePlane, Line } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { journeyIngredients, journeyProducts, places } from '@/lib/about-journey';

/*
 * The About journey in one scene, driven by `progress` (0 = Taiwan ... 5 = ASTAMALL):
 * 0 Taiwan       a dotted globe turned to Taiwan
 * 1 Astaxanthin  the camera dives into Taiwan; the landing-page sculpture grows in its place (journey-sculpture.tsx)
 * 2 Ingredients  the featured ingredients orbit it
 * 3 Formulation  they spiral in and merge, and the sculpture swirls to liquid and re-forms
 * 4 Malaysia     it dissolves into a droplet that travels the arc from Taiwan to Malaysia
 * 5 ASTAMALL     the droplet opens into the whole collection, every product in the shop
 */

const R = 2.2;
const D2R = Math.PI / 180;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const band = (p: number, a: number, b: number) => smooth(clamp01((p - a) / (b - a)));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const TW = places.taiwan;
const MY = places.malaysia;
const MID = { lat: (TW.lat + MY.lat) / 2, lon: (TW.lon + MY.lon) / 2 };

function surface(lat: number, lon: number, r = R) {
  const la = lat * D2R, lo = lon * D2R;
  return new THREE.Vector3(r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo));
}

/** Great-circle arc from Taiwan to Malaysia, lifted off the surface in the middle. */
function arcPoint(t: number, out = new THREE.Vector3()) {
  const a = surface(TW.lat, TW.lon, 1), b = surface(MY.lat, MY.lon, 1);
  const omega = Math.acos(clamp01(a.dot(b)));
  const s = Math.sin(omega);
  out.copy(a).multiplyScalar(Math.sin((1 - t) * omega) / s).addScaledVector(b, Math.sin(t * omega) / s);
  return out.multiplyScalar(R * (1.006 + 0.2 * Math.sin(Math.PI * t)));
}

export type SceneProps = {
  progress: RefObject<number>;
  running: boolean;
  mobile: boolean;
  onReady: () => void;
};

const dotVertex = /* glsl */ `
  uniform float uSize;
  uniform float uScale;
  attribute float aSeed;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    // dots fade towards the limb, so the globe reads as round without any outline
    float facing = normalize(normalMatrix * normal).z;
    vAlpha = smoothstep(0.02, 0.5, facing) * (0.45 + 0.4 * aSeed);
    gl_PointSize = uSize * uScale / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const dotFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.3, d) * vAlpha * uOpacity;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

/**
 * A DOM label pinned to a point in the scene: projected to the screen every frame, faded by `opacity`
 * (written by the owning component's own frame). Sits beside the canvas, so text stays crisp.
 */
function Label({ text, className, anchor, opacity }: { text: string; className: string; anchor: RefObject<THREE.Object3D | null>; opacity: RefObject<number> }) {
  const gl = useThree(state => state.gl);
  const el = useRef<HTMLDivElement | null>(null);
  const at = useMemo(() => new THREE.Vector3(), []);
  useEffect(() => {
    const node = document.createElement('div');
    node.className = className;
    node.textContent = text;
    node.setAttribute('aria-hidden', 'true');
    node.style.cssText = 'position:absolute;left:0;top:0;z-index:2;pointer-events:none;opacity:0;will-change:transform,opacity';
    gl.domElement.parentElement?.appendChild(node);
    el.current = node;
    return () => { node.remove(); el.current = null; };
  }, [gl, text, className]);
  useFrame(({ camera, size }) => {
    const node = el.current, o = anchor.current;
    if (!node || !o) return;
    o.getWorldPosition(at).project(camera);
    node.style.transform = `translate3d(${((at.x + 1) / 2) * size.width}px,${((1 - at.y) / 2) * size.height}px,0)`;
    node.style.opacity = String(opacity.current ?? 0);
  });
  return null;
}

function Globe({ progress, onLoaded }: { progress: RefObject<number>; onLoaded: () => void }) {
  const group = useRef<THREE.Group>(null);
  const base = useRef<THREE.MeshStandardMaterial>(null);
  const dotMaterial = useRef<THREE.ShaderMaterial>(null);
  const line = useRef<THREE.Object3D & { material: { dashOffset: number; opacity: number } }>(null);
  const drop = useRef<THREE.Mesh>(null);
  const twMark = useRef<THREE.Group>(null);
  const twPin = useRef<THREE.Group>(null);
  const myPin = useRef<THREE.Group>(null);
  const myMark = useRef<THREE.Group>(null);
  const twAnchor = useRef<THREE.Group>(null);
  const myAnchor = useRef<THREE.Group>(null);
  const twAlpha = useRef(0);
  const myAlpha = useRef(0);
  const [dots, setDots] = useState<THREE.BufferGeometry | null>(null);
  const uniforms = useMemo(() => ({
    uSize: { value: 22 }, uScale: { value: 1 }, uOpacity: { value: 1 }, uColor: { value: new THREE.Color('#9a4655') },
  }), []);
  const arc = useMemo(() => Array.from({ length: 81 }, (_, i) => arcPoint(i / 80)), []);
  const arcLength = useMemo(() => arc.reduce((sum, v, i) => (i ? sum + v.distanceTo(arc[i - 1]) : 0), 0), [arc]);
  const tw = useMemo(() => surface(TW.lat, TW.lon, R * 1.004), []);
  const my = useMemo(() => surface(MY.lat, MY.lon, R * 1.004), []);
  const twOrient = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), tw.clone().normalize()), [tw]);
  const myOrient = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), my.clone().normalize()), [my]);
  const scratch = useMemo(() => new THREE.Vector3(), []);

  // Land points (Natural Earth, 50m) pre-sampled on the Asia-facing hemisphere: lat/lon pairs in hundredths of a degree.
  useEffect(() => {
    let cancelled = false;
    let geometry: THREE.BufferGeometry | null = null;
    fetch('/assets/globe-land.bin').then(r => r.arrayBuffer()).then(buffer => {
      if (cancelled) return;
      const pairs = new Int16Array(buffer);
      const n = pairs.length / 2;
      const position = new Float32Array(n * 3), normal = new Float32Array(n * 3), seed = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const v = surface(pairs[i * 2] / 100, pairs[i * 2 + 1] / 100);
        position.set([v.x, v.y, v.z], i * 3);
        v.normalize();
        normal.set([v.x, v.y, v.z], i * 3);
        seed[i] = Math.random();
      }
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
      geometry.setAttribute('normal', new THREE.BufferAttribute(normal, 3));
      geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
      setDots(geometry);
      onLoaded();
    }).catch(() => onLoaded());
    return () => { cancelled = true; geometry?.dispose(); };
  }, [onLoaded]);

  useFrame(({ clock, size, viewport }) => {
    const g = group.current;
    if (!g) return;
    const p = progress.current ?? 0;
    const t = clock.elapsedTime;
    // dots keep the same printed density on any stage size and pixel ratio
    const u0 = dotMaterial.current?.uniforms;
    if (u0) u0.uSize.value = 22 * Math.min(1.2, Math.max(0.4, size.height / 820)) * viewport.dpr;
    // seen in Taiwan, gone while the ingredient story plays, back for the journey home
    const vis = Math.max(1 - band(p, 0.3, 0.85), band(p, 3.0, 3.45) * (1 - band(p, 4.35, 4.85)));
    g.visible = vis > 0.004;
    if (!g.visible) {
      // the labels live in the DOM, so they have to be hidden explicitly
      twAlpha.current = 0;
      myAlpha.current = 0;
      return;
    }
    let view = TW;
    if (p > 3) view = { lat: mix(TW.lat, MID.lat, band(p, 3.0, 3.7)), lon: mix(TW.lon, MID.lon, band(p, 3.0, 3.7)) };
    if (p > 4) view = { lat: mix(MID.lat, MY.lat, band(p, 4.0, 4.7)), lon: mix(MID.lon, MY.lon, band(p, 4.0, 4.7)) };
    const drift = p < 0.3 ? Math.sin(t * 0.25) * 2.5 : 0;
    g.rotation.set(view.lat * D2R, -(view.lon + drift) * D2R, 0, 'XYZ');
    // dive into Taiwan, come back out for the journey, dive into Malaysia
    // dive in from Taiwan; come back from a gentle zoom (never from deep inside); dive into Malaysia
    const zoom = p < 2 ? 0.86 + 2.7 * band(p, 0.15, 0.9) : p < 4 ? 1.5 - 0.64 * band(p, 3.0, 3.7) : 0.86 + 2.3 * band(p, 4.3, 4.95);
    g.scale.setScalar(zoom);
    const u = dotMaterial.current?.uniforms;
    if (u) { u.uScale.value = Math.min(zoom, 1.7); u.uOpacity.value = vis; }
    // markers keep a steady size on screen and fade with the globe
    for (const pin of [twPin.current, myPin.current]) {
      if (!pin) continue;
      pin.scale.setScalar(1 / Math.pow(zoom, 0.85));
      pin.traverse(o => { const m = (o as THREE.Mesh).material as THREE.Material | undefined; if (m) m.opacity = (o.userData.alpha ?? 1) * vis; });
    }
    if (base.current) base.current.opacity = vis * 0.92;

    const travel = band(p, 3.45, 4.15);
    if (line.current) {
      line.current.material.dashOffset = arcLength * (1 - travel);
      line.current.material.opacity = vis * (travel > 0 ? 0.9 : 0);
    }
    if (drop.current) {
      drop.current.visible = travel > 0.001 && travel < 0.999;
      arcPoint(travel, scratch);
      drop.current.position.copy(scratch);
    }
    const pulse = 1 + 0.18 * Math.sin(t * 2.6);
    twMark.current?.scale.setScalar(pulse);
    const arrived = band(p, 4.05, 4.3);
    myMark.current?.scale.setScalar((0.35 + 0.65 * arrived) * pulse);
    twAlpha.current = vis * (1 - band(p, 0.15, 0.45) * (1 - band(p, 3.1, 3.5)));
    myAlpha.current = vis * band(p, 3.3, 3.8);
  });

  return <group ref={group}>
    <mesh renderOrder={0}>
      <sphereGeometry args={[R * 0.996, 96, 64]} />
      <meshStandardMaterial ref={base} color="#f3ece4" roughness={1} transparent opacity={0.92} />
    </mesh>
    {dots && <points geometry={dots} renderOrder={1}>
      <shaderMaterial ref={dotMaterial} uniforms={uniforms} vertexShader={dotVertex} fragmentShader={dotFragment} transparent depthWrite={false} />
    </points>}
    <Line ref={line as never} points={arc} color="#9e1b32" lineWidth={2.2} dashed dashSize={arcLength} gapSize={arcLength} transparent opacity={0} />
    <mesh ref={drop} visible={false}>
      <sphereGeometry args={[0.055, 24, 16]} />
      <meshPhysicalMaterial color="#a3122e" roughness={0.15} clearcoat={1} />
    </mesh>
    <group ref={twPin} position={tw} quaternion={twOrient}>
      <group ref={twMark}><mesh userData={{ alpha: 0.85 }}><ringGeometry args={[0.05, 0.075, 40]} /><meshBasicMaterial color="#9e1b32" transparent opacity={0.85} side={THREE.DoubleSide} /></mesh></group>
      <mesh><circleGeometry args={[0.032, 24]} /><meshBasicMaterial color="#9e1b32" transparent side={THREE.DoubleSide} /></mesh>
      <group ref={twAnchor} position={[0.1, 0.04, 0]} />
    </group>
    <group ref={myPin} position={my} quaternion={myOrient}>
      <group ref={myMark}><mesh userData={{ alpha: 0.85 }}><ringGeometry args={[0.05, 0.075, 40]} /><meshBasicMaterial color="#9e1b32" transparent opacity={0.85} side={THREE.DoubleSide} /></mesh></group>
      <mesh><circleGeometry args={[0.032, 24]} /><meshBasicMaterial color="#9e1b32" transparent side={THREE.DoubleSide} /></mesh>
      <group ref={myAnchor} position={[0.1, 0.04, 0]} />
    </group>
    <Label text="Taiwan" className="ab-geo-label" anchor={twAnchor} opacity={twAlpha} />
    <Label text="Malaysia" className="ab-geo-label" anchor={myAnchor} opacity={myAlpha} />
  </group>;
}

/** The featured ingredients orbit the sculpture (drawn beneath this canvas), then spiral into it. */
function Ingredients({ progress, mobile }: { progress: RefObject<number>; mobile: boolean }) {
  const orbs = useRef<(THREE.Mesh | null)[]>([]);
  const anchors = useMemo(() => journeyIngredients.map(() => ({ current: null as THREE.Object3D | null })), []);
  const alphas = useMemo(() => journeyIngredients.map(() => ({ current: 0 })), []);
  useFrame(({ clock }) => {
    const p = progress.current ?? 0;
    const t = clock.elapsedTime;
    const emerge = easeOut(band(p, 1.05, 1.65));
    const merge = band(p, 2.05, 2.85);
    const radius = mix(0.45, mobile ? 1.55 : 2.05, emerge) * (1 - merge);
    const size = 0.3 * emerge * (1 - band(p, 2.5, 2.95));
    journeyIngredients.forEach((_, i) => {
      const orb = orbs.current[i];
      if (!orb) return;
      const a = (i / journeyIngredients.length) * Math.PI * 2 + t * 0.3 + merge * 4.5;
      orb.visible = size > 0.004;
      orb.scale.setScalar(Math.max(size, 0.001));
      orb.position.set(Math.cos(a) * radius, Math.sin(a) * radius * 0.32, Math.sin(a) * radius * 0.75);
      alphas[i].current = emerge * (1 - band(p, 1.95, 2.35)) * (0.45 + 0.55 * (Math.sin(a) * 0.5 + 0.5));
    });
  });
  return <>{journeyIngredients.map((item, i) => <mesh key={item.slug} ref={el => { orbs.current[i] = el; }} visible={false}>
    <sphereGeometry args={[1, 64, 48]} />
    <meshPhysicalMaterial color={item.color} roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} sheen={0.6} sheenColor="#ffffff" envMapIntensity={1.1} />
    <group ref={el => { anchors[i].current = el; }} position={[0, -1.55, 0]} />
    <Label text={item.name} className="ab-orb-label" anchor={anchors[i]} opacity={alphas[i]} />
  </mesh>)}</>;
}

/** Every product in the shop, opening out of Malaysia into a slow carousel. */
function Collection({ progress, mobile }: { progress: RefObject<number>; mobile: boolean }) {
  const ring = useRef<THREE.Group>(null);
  const cards = useRef<(THREE.Mesh | null)[]>([]);
  const n = journeyProducts.length;
  useFrame(({ clock }) => {
    const g = ring.current;
    if (!g) return;
    const p = progress.current ?? 0;
    const appear = band(p, 4.4, 4.98);
    g.visible = appear > 0.003;
    if (!g.visible) return;
    const spin = clock.elapsedTime * 0.09 + p * 0.9;
    const radius = mix(0.15, mobile ? 1.9 : 2.15, easeOut(appear));
    const size = (mobile ? 0.9 : 1.05) * (0.35 + 0.65 * appear);
    cards.current.forEach((card, i) => {
      if (!card) return;
      const a = (i / n) * Math.PI * 2 + spin;
      const depth = Math.cos(a) * 0.5 + 0.5;
      card.position.set(Math.sin(a) * radius + (mobile ? 0 : 0.2), Math.cos(a * 2) * 0.12 + (depth - 0.5) * -0.35 * appear, Math.cos(a) * radius * 0.55 - 0.5);
      card.scale.set(size, size, 1);
      card.renderOrder = 10 + Math.round(depth * 100);
      (card.material as THREE.Material & { opacity: number }).opacity = appear * (0.3 + 0.7 * depth);
    });
  });
  return <group ref={ring} visible={false} rotation={[0.12, 0, 0]}>
    {journeyProducts.map((product, i) => <ImagePlane key={product.slug} ref={el => { cards.current[i] = el; }} url={product.image} radius={0.08} transparent opacity={0} toneMapped={false} />)}
  </group>;
}

function Studio() {
  const gl = useThree(state => state.gl);
  const env = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return texture;
  }, [gl]);
  useEffect(() => () => env.dispose(), [env]);
  return <>
    <primitive object={env} attach="environment" />
    <ambientLight intensity={0.55} />
    <directionalLight position={[3, 4, 6]} intensity={1.4} />
    <directionalLight position={[-4, -2, 2]} intensity={0.35} color="#f2c7cf" />
  </>;
}

/** A light parallax from the cursor, so the scene answers the hand. */
function Rig() {
  useFrame(({ camera, pointer }, dt) => {
    const k = 1 - Math.pow(0.06, dt);
    camera.position.x += (pointer.x * 0.35 - camera.position.x) * k;
    camera.position.y += (pointer.y * 0.22 - camera.position.y) * k;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function JourneyScene({ progress, running, mobile, onReady }: SceneProps) {
  const [loaded, setLoaded] = useState(false);
  const markLoaded = useMemo(() => () => setLoaded(true), []);
  useEffect(() => { if (loaded) onReady(); }, [loaded, onReady]);
  return <Canvas
    className="ab-canvas"
    dpr={[1, 1.75]}
    camera={{ position: [0, 0, 9], fov: mobile ? 40 : 34 }}
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    frameloop={running ? 'always' : 'never'}
  >
    <Studio />
    <Rig />
    <Globe progress={progress} onLoaded={markLoaded} />
    <Ingredients progress={progress} mobile={mobile} />
    {/* the product photos stream in on their own, so the globe never waits for them */}
    <Suspense fallback={null}><Collection progress={progress} mobile={mobile} /></Suspense>
  </Canvas>;
}
