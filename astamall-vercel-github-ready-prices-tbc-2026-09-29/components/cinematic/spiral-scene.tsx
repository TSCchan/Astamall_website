'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { spiralProducts } from '@/lib/cinematic-catalog';
import { spiralState } from '@/lib/cinematic-motion';

export type SpiralPoint = { x: number; y: number; visible: boolean };
type SceneProps = {
  progress: RefObject<number>; onSpiralPoint: (point: SpiralPoint) => void; mobile: boolean; running: boolean;
  onReady: () => void; onFailure: () => void;
};

// Card shader: rounded corners, a liquid waterline that reveals each product as it arrives,
// and a soft wet highlight that travels with the reveal.
const vertexShader = `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const fragmentShader = `
uniform sampler2D uMap; uniform float uOpacity; uniform float uReveal; uniform float uTime;
varying vec2 vUv;
void main() {
  vec2 q = abs(vUv - .5) * 2.;
  float r = .1; vec2 d = q - (1. - r);
  float corner = 1. - smoothstep(-.012, .0, length(max(d, 0.)) - r);
  float wave = sin(vUv.x * 9. + uTime * 1.6) * .035 + sin(vUv.x * 23. - uTime * 2.3) * .012;
  float line = uReveal * 1.35 - .17 + wave;
  float revealed = 1. - smoothstep(line - .03, line, vUv.y);
  float crest = exp(-abs(vUv.y - line) * 40.) * step(.001, uReveal) * step(uReveal, .999);
  vec4 photo = texture2D(uMap, vUv);
  photo.rgb = mix(photo.rgb, vec3(.62, .05, .12), crest * .85);
  gl_FragColor = vec4(photo.rgb, corner * revealed * uOpacity);
  #include <colorspace_fragment>
}`;

const geometry = (mobile: boolean) => ({
  radius: mobile ? 2.3 : 3.3,
  rise: mobile ? 1.1 : 1.35,
  step: Math.PI * 2 / 5.2,
  size: mobile ? 2.5 : 3.3,
  offsetX: mobile ? 0 : 2.55,
  offsetY: mobile ? 1.15 : 0,
});

function Helix({ progress, onSpiralPoint, mobile }: Pick<SceneProps, 'progress' | 'onSpiralPoint' | 'mobile'>) {
  const textures = useTexture(spiralProducts.map(p => p.imageUrl));
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const g = geometry(mobile);
  const camera = useThree(state => state.camera);
  const probe = useRef(new THREE.Vector3());

  const materials = useMemo(() => textures.map(texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, toneMapped: false, side: THREE.FrontSide,
      uniforms: { uMap: { value: texture }, uOpacity: { value: 0 }, uReveal: { value: 0 }, uTime: { value: 0 } },
      vertexShader, fragmentShader,
    });
  }), [textures]);
  useEffect(() => () => materials.forEach(material => material.dispose()), [materials]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const s = spiralState(progress.current ?? 0, spiralProducts.length);
    const node = group.current;
    // Intro: the helix rises from depth with an extra half-turn. Outro: it pulls back to show the whole spiral.
    node.rotation.y = -s.focus * g.step - (1 - s.intro) * Math.PI * .9;
    node.position.set(g.offsetX + s.outro * (mobile ? 0 : -1.2), g.offsetY + s.focus * g.rise - s.outro * 1.2, -(1 - s.intro) * 7 - s.outro * 7);
    node.rotation.x = s.outro * .22;
    meshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      const material = mesh.material as THREE.ShaderMaterial;
      const ahead = i - s.focus;
      const reveal = THREE.MathUtils.clamp(1.5 - ahead, 0, 1);
      const behindFade = 1 - THREE.MathUtils.clamp(-ahead * 1.1, 0, 1);
      const outroLift = s.outro * .7;
      material.uniforms.uReveal.value = Math.max(reveal, s.outro);
      material.uniforms.uOpacity.value = Math.min(1, behindFade + outroLift) * (.25 + .75 * s.intro);
      material.uniforms.uTime.value = clock.elapsedTime;
      mesh.visible = material.uniforms.uOpacity.value > .01 && material.uniforms.uReveal.value > .001;
      const lift = THREE.MathUtils.clamp(1 - Math.abs(ahead), 0, 1);
      mesh.scale.setScalar(1 + lift * .08);
    });
    // The fluid travels the same helix: report the on-screen point between this product and the next.
    const angle = (s.focus + .55) * g.step;
    const at = probe.current.set(Math.sin(angle) * g.radius, -(s.focus + .55) * g.rise, Math.cos(angle) * g.radius);
    node.localToWorld(at).project(camera);
    onSpiralPoint({ x: at.x * .5 + .5, y: -at.y * .5 + .5, visible: at.z < 1 });
  });

  return <group ref={group}>
    {spiralProducts.map((product, i) => {
      const angle = i * g.step;
      return <mesh key={product.id} ref={element => { meshes.current[i] = element; }} material={materials[i]}
        position={[Math.sin(angle) * g.radius, -i * g.rise, Math.cos(angle) * g.radius]} rotation={[0, angle, 0]} renderOrder={i}>
        <planeGeometry args={[g.size, g.size]} />
      </mesh>;
    })}
  </group>;
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

export default function SpiralScene(props: SceneProps) {
  return <Canvas dpr={[1, props.mobile ? 1.25 : 1.6]} frameloop={props.running ? 'always' : 'never'}
    camera={{ position: [0, 0, props.mobile ? 11 : 10.5], fov: 36 }}
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    fallback={<span>Explore the ASTAMALL collection using the product links.</span>}>
    <Helix progress={props.progress} onSpiralPoint={props.onSpiralPoint} mobile={props.mobile} />
    <Lifecycle onReady={props.onReady} onFailure={props.onFailure} />
  </Canvas>;
}
