import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function WaterPlane() {
  const materialRef = useRef(null);

  useFrame((_, delta) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh rotation={[-Math.PI / 2.3, 0, 0]} position={[0, -0.7, 0]}>
      <planeGeometry args={[7, 5, 64, 48]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        ref={materialRef}
        uniforms={{ uTime: { value: 0 }, uColor: { value: new THREE.Color('#6F9690') } }}
        vertexShader={`
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec3 pos = position;
            pos.z += sin(pos.x * 1.8 + uTime * 0.55) * 0.06;
            pos.z += cos(pos.y * 2.6 + uTime * 0.35) * 0.035;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          
          varying vec2 vUv;
          void main() {
            float alpha = smoothstep(0.0, 0.6, vUv.y) * 0.16;
            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </mesh>
  );
}

export default function WaterCanvas({ active }) {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 1.1, 3.2], fov: 42 }}
      frameloop={active ? 'always' : 'never'}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <WaterPlane />
    </Canvas>
  );
}
