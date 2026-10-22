'use client';

import { Suspense, useEffect, useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { heroStageArt } from '@/lib/cinematic-catalog';
import { scenePhase } from '@/lib/cinematic-motion';

type SceneProps = {
  progress: RefObject<number>; mobile: boolean; running: boolean; preloadThrough: number;
  onReady: () => void; onFailure: () => void;
};

// One shared broad wave reveals continuous, refracting surfaces. No grain or particles.
const liquidField = `
uniform float uTime;
uniform float uBlend;
uniform float uSculpture;
uniform float uHover;
uniform float uMotion;
uniform vec2 uCursor;
uniform vec2 uVelocity;
float waterline(vec2 p) {
  float swell = sin(uBlend * 3.14159265);
  return mix(-4.6, 4.6, uBlend) + swell * (
    sin(p.x * 1.35 + uBlend * 5.0 + uTime * .32) * .46 +
    sin(p.x * 2.7 - uBlend * 3.0 - uTime * .23) * .16);
}
`;

const liquidVertex = `${liquidField}
varying vec2 vUv;
varying vec2 vSurface;
void main() {
  vUv = uv;
  vSurface = position.xy;
  vec3 p = position;
  float swell = sin(uBlend * 3.14159265);
  float distanceToFront = p.y - waterline(p.xy);
  float fold = exp(-distanceToFront * distanceToFront * 1.3) * swell;
  p.x += sin(p.y * 2.1 + p.x * .8 + uBlend * 8.0) * fold * .34 * uMotion;
  p.y += sin(p.x * 1.9 + uBlend * 6.0) * fold * .20 * uMotion;
  p.z += cos(p.x * 1.4 + uBlend * 8.0) * fold * .42;
  vec2 delta = uv - uCursor;
  float local = exp(-dot(delta, delta) * 11.0);
  float ripple = sin(length(delta) * 24.0 - uTime * 4.0);
  // Pointer movement stretches the silhouette and sends a ripple around contact.
  float living = uSculpture * uMotion;
  p.x += living * (sin(p.y * 1.7 + uTime * .7) * .055 +
    local * uHover * (uVelocity.x * .70 + ripple * delta.x * .24));
  p.y += living * (sin(p.x * 1.5 - uTime * .55) * .065 +
    local * uHover * (uVelocity.y * .70 + ripple * delta.y * .24));
  p.z += living * local * uHover * ripple * .16;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const liquidFragment = `${liquidField}
uniform sampler2D uMap;
uniform float uIncoming;
varying vec2 vUv;
varying vec2 vSurface;
void main() {
  float swell = sin(uBlend * 3.14159265);
  float distanceToFront = vSurface.y - waterline(vSurface);
  float lens = exp(-distanceToFront * distanceToFront * 2.6) * swell;
  vec2 flow = vec2(sin(vSurface.y * 2.0 + uBlend * 7.0),
    cos(vSurface.x * 2.0 - uBlend * 6.0));
  vec2 uv = vUv + flow * lens * .075 * uMotion;
  vec2 delta = vUv - uCursor;
  float local = exp(-dot(delta, delta) * 14.0);
  float ripple = sin(length(delta) * 28.0 - uTime * 4.0);
  uv -= uSculpture * uMotion * local * uHover *
    (uVelocity * .065 + delta * ripple * .07);
  uv += uSculpture * uMotion * vec2(
    sin(vUv.y * 8.0 + uTime * .65), cos(vUv.x * 7.0 - uTime * .55)) * .005;
  // Never extend edge texels into the transparent surround.
  float bounds = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  vec4 photo = texture2D(uMap, clamp(uv, 0.0, 1.0));
  float filled = 1.0 - smoothstep(-.24, .24, distanceToFront);
  float mask = mix(1.0 - filled, filled, uIncoming);
  float crest = exp(-abs(distanceToFront) * 12.0) * swell;
  photo.rgb = mix(photo.rgb, vec3(1.0, .88, .78), crest * .24);
  photo.rgb += uSculpture * local * uHover * ripple * .018;
  gl_FragColor = vec4(photo.rgb, photo.a * mask * bounds);
  #include <colorspace_fragment>
}`;

function LiquidArtwork({ stage, progress, mobile }: Pick<SceneProps, 'progress' | 'mobile'> & { stage: number }) {
  const art = heroStageArt[stage];
  const texture = useTexture(art.imageUrl);
  const mesh = useRef<THREE.Mesh>(null);
  const pointer = useRef({ target: new THREE.Vector2(.5, .5), previous: new THREE.Vector2(.5, .5), hover: 0 });
  const image = texture.image as { width: number; height: number };
  const ratio = image.width / image.height;
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false,
    uniforms: {
      uMap: { value: texture }, uTime: { value: 0 }, uBlend: { value: 0 },
      uIncoming: { value: 0 }, uSculpture: { value: stage === 0 ? 1 : 0 },
      uHover: { value: 0 }, uMotion: { value: mobile ? .55 : 1 },
      uCursor: { value: new THREE.Vector2(.5, .5) }, uVelocity: { value: new THREE.Vector2() },
    }, vertexShader: liquidVertex, fragmentShader: liquidFragment,
  }), [texture, stage, mobile]);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
    return () => material.dispose();
  }, [texture, material]);

  useFrame(({ clock }, delta) => {
    if (!mesh.current) return;
    const phase = scenePhase(progress.current);
    mesh.current.visible = stage === phase.from || (stage === phase.to && phase.blend > 0);
    if (!mesh.current.visible) { pointer.current.hover = 0; return; }
    const u = material.uniforms, dt = Math.min(delta, .05), input = pointer.current;
    u.uTime.value = clock.elapsedTime;
    u.uBlend.value = phase.blend;
    u.uIncoming.value = phase.from !== phase.to && stage === phase.to ? 1 : 0;
    u.uHover.value = THREE.MathUtils.damp(u.uHover.value, input.hover, 5, dt);
    u.uCursor.value.lerp(input.target, 1 - Math.exp(-dt * 8));
    // Velocity is measured per second; smoothing and decay are frame-rate independent.
    const vx = THREE.MathUtils.clamp((input.target.x - input.previous.x) / Math.max(dt, .001), -.9, .9);
    const vy = THREE.MathUtils.clamp((input.target.y - input.previous.y) / Math.max(dt, .001), -.9, .9);
    u.uVelocity.value.x = THREE.MathUtils.damp(u.uVelocity.value.x, vx, 4, dt);
    u.uVelocity.value.y = THREE.MathUtils.damp(u.uVelocity.value.y, vy, 4, dt);
    input.previous.copy(input.target);
  });

  function touchSurface(event: ThreeEvent<PointerEvent>) {
    if (stage !== 0 || mobile || !event.uv) return;
    const input = pointer.current;
    if (!input.hover) input.previous.copy(event.uv);
    input.target.copy(event.uv);
    input.hover = 1;
  }

  return <mesh ref={mesh} material={material} renderOrder={stage}
    onPointerMove={stage === 0 ? touchSurface : undefined}
    onPointerOut={() => { pointer.current.hover = 0; }}>
    <planeGeometry args={[art.size * Math.min(1, ratio), art.size / Math.max(1, ratio), mobile ? 32 : 72, mobile ? 32 : 72]} />
  </mesh>;
}

function Lifecycle({ onReady, onFailure }: Pick<SceneProps, 'onReady' | 'onFailure'>) {
  const { gl } = useThree();
  const firstFrame = useRef(false);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    canvas.addEventListener('webglcontextlost', lost);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [gl, onFailure]);
  useFrame(() => {
    if (!firstFrame.current) { firstFrame.current = true; onReady(); }
  });
  return null;
}

export default function AstamallScene(props: SceneProps) {
  return <Canvas dpr={[1, props.mobile ? 1.25 : 1.5]} frameloop={props.running ? 'always' : 'never'}
    camera={{ position: [0, 0, props.mobile ? 11.5 : 10], fov: 38 }}
    gl={{ antialias: !props.mobile, alpha: true, powerPreference: 'high-performance' }}
    fallback={<span>Explore the ASTAMALL collection using the category links.</span>}>
    {[0, 1, 2, 3, 4].filter(stage => stage <= props.preloadThrough).map(stage =>
      <Suspense key={stage} fallback={null}><LiquidArtwork stage={stage} progress={props.progress} mobile={props.mobile} /></Suspense>)}
    <Lifecycle onReady={props.onReady} onFailure={props.onFailure} />
  </Canvas>;
}
