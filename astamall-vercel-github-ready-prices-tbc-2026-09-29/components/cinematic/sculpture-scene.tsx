'use client';

import { Suspense, useEffect, useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { heroStageProducts } from '@/lib/cinematic-catalog';
import { scenePhase, stageWeight } from '@/lib/cinematic-motion';

export type PointerState = { x: number; y: number; active: number; moved: number };
type SceneProps = {
  progress: RefObject<number>; pointer: RefObject<PointerState>; mobile: boolean; running: boolean;
  onReady: () => void; onFailure: () => void;
};

/* ------------------------------------------------------------------ */
/* Poses: deterministic shape states blended by scroll progress.       */
/* ring 0 is the origin sculpture; ring 1 is an open ribbon or halo.   */
/* ------------------------------------------------------------------ */
type Pose = { ring: number; radius: number; tube: number; flat: number; tiltX: number; tiltZ: number; wave: number; lobe: number; ribbon: number; noise: number; scale: number; stretch: number; y: number; z: number };
const poses: Pose[] = [
  { ring: 0, radius: 2.5, tube: .6, flat: .2, tiltX: .25, tiltZ: -.12, wave: .2, lobe: 0, ribbon: .6, noise: .09, scale: 1.9, stretch: .26, y: .05, z: 0 },           // origin sculpture
  { ring: 1, radius: 2.75, tube: .6, flat: .16, tiltX: .42, tiltZ: .1, wave: .3, lobe: .05, ribbon: 1.2, noise: .035, scale: 1, stretch: 0, y: .68, z: 0 },       // skincare wrap
  { ring: 1, radius: 2.85, tube: .64, flat: .18, tiltX: .3, tiltZ: -.22, wave: .45, lobe: .1, ribbon: 1.6, noise: .04, scale: 1, stretch: 0, y: .66, z: 0 },       // health-food sweep
  { ring: 1, radius: 2.7, tube: .5, flat: .4, tiltX: .5, tiltZ: .16, wave: .1, lobe: .18, ribbon: .4, noise: .02, scale: 1, stretch: 0, y: .7, z: 0 },          // structured supplement form
  { ring: 1, radius: 1.75, tube: .4, flat: .2, tiltX: 1.5708, tiltZ: 0, wave: .12, lobe: .04, ribbon: 1, noise: .03, scale: 1, stretch: 0, y: 1.9, z: -3.2 },    // halo behind the family
];
const keys = Object.keys(poses[0]) as (keyof Pose)[];

const deformChunk = /* glsl */`
uniform float uTime; uniform float uRing; uniform float uRadius; uniform float uTube; uniform float uFlat;
uniform float uTiltX; uniform float uTiltZ; uniform float uWave; uniform float uLobe; uniform float uRibbon;
uniform float uNoise; uniform float uScale; uniform float uStretch; uniform float uFold;
uniform vec2 uPointer; uniform float uPush; uniform vec3 uOffset;
attribute vec2 aParam;
// Simplex noise (Ashima Arts, MIT).
vec3 m289(vec3 x){return x-floor(x*(1./289.))*289.;} vec4 m289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 perm(vec4 x){return m289(((x*34.)+1.)*x);} vec4 tis(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy; i=m289(i);
  vec4 p=perm(perm(perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  vec3 ns=.142857142857*D.wyz-D.xzx; vec4 j=p-49.*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw); vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=tis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3))); p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
mat2 rot2(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
// The origin sculpture: a two-lobed liquid form that twists, elongates, folds and rolls at rest.
vec3 sculpture(vec2 uv){
  float phi=uv.x*6.2831853, theta=uv.y*3.1415927, t=uTime;
  vec3 s=vec3(sin(theta)*cos(phi), cos(theta), sin(theta)*sin(phi));
  vec3 q=s;
  q.x*=1.32;
  q.yz*=1.-.24*exp(-q.x*q.x*2.6);
  q.y*=1.+uStretch*(.5+.5*sin(t*.33));
  q.xz=rot2(sin(t*.21)*.8*q.y)*q.xz;
  q.xy=rot2(sin(t*.16+1.)*.4*q.z)*q.xy;
  q.y+=.22*sin(q.x*1.6+t*.42);
  q.z+=.16*cos(q.x*1.2-t*.33);
  q*=1.+uNoise*snoise(s*.85+vec3(t*.07,t*.1,0.));
  return q*uScale;
}
// Open forms: a flattened tube around a ring; its cross-section twists along the path like a ribbon.
vec3 ribbon(vec2 uv){
  float phi=uv.x*6.2831853, psi=(uv.y-.5)*6.2831853, t=uTime;
  float R=uRadius*(1.+uLobe*sin(3.*phi+t*.15));
  vec2 c=rot2(uRibbon*sin(2.*phi+t*.3)+uFold*1.4)*vec2(cos(psi)*uTube, -sin(psi)*uTube*uFlat);
  vec3 d=vec3(cos(phi),0.,sin(phi));
  vec3 p=d*(R+c.x)+vec3(0.,c.y+uWave*sin(2.*phi+t*.35),0.);
  return p*(1.+uNoise*snoise(p*.7+vec3(0.,t*.1,0.)));
}
vec3 shape(vec2 uv){
  vec3 p=mix(sculpture(uv), ribbon(uv), uRing);
  p.yz=rot2(uTiltX)*p.yz;
  p.xy=rot2(uTiltZ)*p.xy;
  // The cursor parts the liquid: nearby surface is pushed outward and back, opening a window onto the copy.
  vec2 d=p.xy-(uPointer-uOffset.xy);
  float f=exp(-dot(d,d)/1.35)*uPush;
  p.xy+=normalize(d+vec2(.0001))*f*.85;
  p.z-=f*.6;
  return p;
}
void deformSurface(vec2 uv, out vec3 position, out vec3 normal){
  vec2 st=vec2(uv.x, clamp(uv.y,.002,.998));
  position=shape(uv);
  float e=.0016;
  vec3 du=shape(st+vec2(e,0.))-shape(st-vec2(e,0.));
  vec3 dv=shape(st+vec2(0.,e))-position;
  normal=normalize(cross(du,dv)+vec3(1e-6));
}
`;

function LiquidMorphSculpture({ progress, pointer, mobile }: Pick<SceneProps, 'progress' | 'pointer' | 'mobile'>) {
  const mesh = useRef<THREE.Mesh>(null);
  const camera = useThree(state => state.camera);
  const scratch = useRef({ pose: { ...poses[0] }, world: new THREE.Vector3(), ray: new THREE.Vector3(), offset: new THREE.Vector2(), push: 0 });
  const geometry = useMemo(() => {
    const g = new THREE.SphereGeometry(1, mobile ? 150 : 230, mobile ? 110 : 170);
    g.setAttribute('aParam', g.attributes.uv);
    return g;
  }, [mobile]);
  const material = useMemo(() => {
    const uniforms: Record<string, THREE.IUniform> = {
      uTime: { value: 0 }, uFold: { value: 0 }, uPush: { value: 0 },
      uPointer: { value: new THREE.Vector2(99, 99) }, uOffset: { value: new THREE.Vector3() },
      ...Object.fromEntries(keys.filter(k => k !== 'y' && k !== 'z').map(k => [`u${k[0].toUpperCase()}${k.slice(1)}`, { value: poses[0][k] }])),
    };
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#850a20'), roughness: .1, metalness: 0, clearcoat: 1, clearcoatRoughness: .04,
      sheen: .18, sheenColor: new THREE.Color('#ff5468'), sheenRoughness: .3, specularIntensity: 1, ior: 1.45,
      envMapIntensity: .95, emissive: new THREE.Color('#2a030b'), emissiveIntensity: .5, side: THREE.DoubleSide,
    });
    m.userData.uniforms = uniforms;
    m.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\n${deformChunk}`)
        .replace('#include <beginnormal_vertex>', 'vec3 dPosition; vec3 dNormal; deformSurface(aParam, dPosition, dNormal);\nvec3 objectNormal = dNormal;')
        .replace('#include <begin_vertex>', 'vec3 transformed = dPosition;');
      // Light passing through thin edges: a crimson rim that reads as translucent liquid.
      shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(.62, .05, .13) * pow(1. - abs(dot(normal, normalize(vViewPosition))), 2.6) * .5;');
    };
    return m;
  }, []);
  useEffect(() => () => { geometry.dispose(); }, [geometry]);
  useEffect(() => () => { material.dispose(); }, [material]);

  useFrame(({ clock }, delta) => {
    const node = mesh.current;
    if (!node) return;
    const u = (node.material as THREE.Material).userData.uniforms as Record<string, THREE.IUniform>;
    const s = scratch.current, dt = Math.min(delta, .05);
    // Scroll decides the silhouette exactly; idle motion only animates within it.
    const { from, to, blend } = scenePhase(progress.current ?? 0);
    const mid = from === to ? 0 : Math.sin(blend * Math.PI);
    for (const key of keys) s.pose[key] = THREE.MathUtils.lerp(poses[from][key], poses[to][key], blend);
    // Between categories the ribbon folds back into itself and sweeps across before unwrapping again.
    const folding = poses[from].ring > 0 && poses[to].ring > 0 ? mid : 0;
    const shrink = mobile ? .52 : 1;
    u.uTime.value = clock.elapsedTime;
    u.uRing.value = s.pose.ring - folding * .55;
    u.uFold.value = mid;
    u.uRadius.value = s.pose.radius * shrink; u.uTube.value = s.pose.tube * shrink; u.uScale.value = s.pose.scale * (mobile ? .72 : 1);
    for (const key of ['flat', 'tiltX', 'tiltZ', 'wave', 'lobe', 'ribbon', 'noise', 'stretch'] as const) u[`u${key[0].toUpperCase()}${key.slice(1)}`].value = s.pose[key];
    u.uWave.value *= shrink;

    // Pointer: project to the z=0 plane, then drift the whole body away from the cursor.
    const p = pointer.current;
    const activity = p ? Math.max(0, 1 - (performance.now() - p.moved) / 1600) * p.active : 0;
    if (p) {
      s.ray.set(p.x, p.y, .5).unproject(camera).sub(camera.position).normalize();
      s.world.copy(camera.position).addScaledVector(s.ray, -camera.position.z / s.ray.z);
    }
    // Scroll places the body exactly; only the cursor's drift is smoothed on top of it.
    const strength = THREE.MathUtils.lerp(1, .38, s.pose.ring);
    const baseX = mid * (to % 2 ? 1.3 : -1.3) * shrink, baseY = s.pose.y * shrink;
    const dx = baseX + s.offset.x - s.world.x, dy = baseY + s.offset.y - s.world.y;
    const near = Math.exp(-(dx * dx + dy * dy) / (mobile ? 5 : 9));
    const len = Math.hypot(dx, dy) || 1;
    s.offset.x = THREE.MathUtils.damp(s.offset.x, (dx / len) * near * activity * strength * (mobile ? 1.2 : 2), 3.2, dt);
    s.offset.y = THREE.MathUtils.damp(s.offset.y, (dy / len) * near * activity * strength * (mobile ? .9 : 1.4), 3.2, dt);
    node.position.set(baseX + s.offset.x, baseY + s.offset.y, s.pose.z);
    s.push = THREE.MathUtils.damp(s.push, activity * strength, 4, dt);
    u.uPush.value = s.push * (mobile ? .55 : 1);
    u.uPointer.value.set(s.world.x, s.world.y);
    u.uOffset.value.copy(node.position);
  });

  return <mesh ref={mesh} geometry={geometry} material={material} frustumCulled={false} renderOrder={0} />;
}

/* Products sit inside the liquid. A circular window opens with the ribbon and closes again on reverse scroll. */
const productVertex = `varying vec2 vUv; varying vec3 vWorld;
void main(){ vUv=uv; vec4 w=modelMatrix*vec4(position,1.); vWorld=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`;
const productFragment = `uniform sampler2D uMap; uniform float uRadius; uniform float uOpacity; uniform float uTime; uniform vec2 uCenter;
varying vec2 vUv; varying vec3 vWorld;
void main(){
  vec2 q=abs(vUv-.5)*2.; vec2 d=q-(1.-.12);
  float corner=1.-smoothstep(-.015,0.,length(max(d,0.))-.12);
  vec2 rel=vWorld.xy-uCenter;
  float edge=uRadius+sin(atan(rel.y,rel.x)*5.+uTime*.8)*.16+sin(atan(rel.y,rel.x)*11.-uTime*1.3)*.05;
  float dist=length(rel);
  float inside=1.-smoothstep(edge-.05,edge,dist);
  float crest=exp(-abs(dist-edge)*14.)*step(.01,uRadius)*step(uRadius,6.5);
  vec4 photo=texture2D(uMap,vUv);
  photo.rgb=mix(photo.rgb,vec3(.66,.07,.19),crest*.9);
  float alpha=corner*inside*uOpacity;
  if(alpha<.01) discard;
  gl_FragColor=vec4(photo.rgb,alpha);
  #include <colorspace_fragment>
}`;

function layout(count: number, family: boolean, mobile: boolean) {
  const k = mobile ? .5 : 1;
  if (family) return Array.from({ length: count }, (_, i) => {
    const x = (i - (count - 1) / 2) * 1.62;
    return { x: x * k * (mobile ? .82 : .9), y: (.5 - Math.abs(x) * .08) * k, z: -Math.abs(x) * .22, size: (i === Math.floor(count / 2) ? 1.55 : 1.22) * k, turn: -x * .07 };
  });
  return [{ x: 0, y: 0, z: .1, size: 2 * k, turn: 0 }, { x: -1.7 * k, y: -.1 * k, z: -.5, size: 1.38 * k, turn: .3 }, { x: 1.7 * k, y: -.1 * k, z: -.5, size: 1.38 * k, turn: -.3 }].slice(0, count);
}

function ProductReveal({ stage, progress, mobile }: { stage: number; progress: SceneProps['progress']; mobile: boolean }) {
  const items = heroStageProducts[stage];
  const textures = useTexture(items.map(item => item.imageUrl));
  const group = useRef<THREE.Group>(null);
  const placement = layout(items.length, stage === 4, mobile);
  const materials = useMemo(() => textures.map(texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return new THREE.ShaderMaterial({
      transparent: true, depthWrite: true, toneMapped: false,
      uniforms: { uMap: { value: texture }, uRadius: { value: 0 }, uOpacity: { value: 0 }, uTime: { value: 0 }, uCenter: { value: new THREE.Vector2() } },
      vertexShader: productVertex, fragmentShader: productFragment,
    });
  }), [textures]);
  useEffect(() => () => materials.forEach(material => material.dispose()), [materials]);

  useFrame(({ clock }) => {
    const node = group.current;
    if (!node) return;
    const weight = stageWeight(progress.current ?? 0, stage);
    node.visible = weight > .002;
    if (!node.visible) return;
    const opening = THREE.MathUtils.smoothstep(weight, .08, 1);
    node.position.y = mobile ? .55 : .68;
    node.children.forEach((child, i) => {
      const u = ((child as THREE.Mesh).material as THREE.ShaderMaterial).uniforms;
      // Lead product first, the rest a beat later, all bounded by the same liquid window.
      const local = THREE.MathUtils.clamp(opening * 1.25 - i * .12, 0, 1);
      u.uRadius.value = local * local * 7;
      u.uOpacity.value = Math.min(1, weight * 2.2);
      u.uTime.value = clock.elapsedTime;
      u.uCenter.value.set(0, node.position.y);
    });
  });

  return <group ref={group} visible={false}>
    {items.map((item, i) => <mesh key={item.id} material={materials[i]} position={[placement[i].x, placement[i].y, placement[i].z]} rotation={[0, placement[i].turn, 0]} renderOrder={1}>
      <planeGeometry args={[placement[i].size, placement[i].size]} />
    </mesh>)}
  </group>;
}

// Studio reflections from a procedural room, so the liquid has real highlights without an external HDR.
function Studio() {
  const gl = useThree(state => state.gl);
  const env = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const texture = pmrem.fromScene(room, .035).texture;
    room.dispose(); pmrem.dispose();
    return texture;
  }, [gl]);
  useEffect(() => () => env.dispose(), [env]);
  return <>
    <primitive object={env} attach="environment" />
    <ambientLight intensity={.35} />
    <directionalLight position={[-4, 6, 6]} intensity={2.2} color="#fff4ec" />
    <directionalLight position={[5, -2, 3]} intensity={.9} color="#ffd6d0" />
  </>;
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
  useFrame(() => { if (!firstFrame.current) { firstFrame.current = true; onReady(); } });
  return null;
}

export default function SculptureScene(props: SceneProps) {
  return <Canvas dpr={[1, props.mobile ? 1.5 : 1.75]} frameloop={props.running ? 'always' : 'never'}
    camera={{ position: [0, 0, props.mobile ? 12.5 : 10], fov: 36 }}
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    fallback={<span>Explore the ASTAMALL collection using the category links.</span>}>
    <Studio />
    <LiquidMorphSculpture progress={props.progress} pointer={props.pointer} mobile={props.mobile} />
    {[1, 2, 3, 4].map(stage => <Suspense key={stage} fallback={null}><ProductReveal stage={stage} progress={props.progress} mobile={props.mobile} /></Suspense>)}
    <Lifecycle onReady={props.onReady} onFailure={props.onFailure} />
  </Canvas>;
}
