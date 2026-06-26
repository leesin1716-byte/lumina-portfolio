"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion, type MotionValue } from "framer-motion";
import * as THREE from "three";
import { projects } from "@/lib/content";
import { lerp } from "@/lib/utils";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uActive;
  uniform float uSeed;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = fract(sin(dot(i, vec2(12.9898, 78.233))) * 43758.5453);
    float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(12.9898, 78.233))) * 43758.5453);
    float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453);
    float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(12.9898, 78.233))) * 43758.5453);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * vnoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.12 + uSeed;
    float reveal = 1.0 - clamp(uActive, 0.0, 1.0);

    // Liquid domain warp.
    vec2 q = vec2(fbm(uv * 2.2 + t), fbm(uv * 2.2 + vec2(5.2, 1.3) - t));
    vec2 r = vec2(
      fbm(uv * 3.0 + q * 1.6 + t * 0.7),
      fbm(uv * 3.0 + q * 1.6 + vec2(8.3, 2.8))
    );
    float n = fbm(uv * 2.0 + r * 1.3);

    // Distortion that settles as the card reveals.
    n += reveal * 0.55 * sin(uv.y * 11.0 + uTime * 5.0);

    float g = clamp(n * 1.25 + uv.x * 0.28 + 0.12, 0.0, 1.0);
    vec3 col = mix(uColorA, uColorB, g);

    // Specular-ish highlight from the warp field.
    col += pow(smoothstep(0.62, 1.0, r.x), 3.0) * 0.3;

    // Grain.
    float grain = (fract(sin(dot(uv + uTime, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.05;
    col += grain;

    // Vignette.
    float vig = smoothstep(1.15, 0.25, length(uv - 0.5));
    col *= mix(0.65, 1.05, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Plane({ active }: { active: number | null }) {
  const { viewport } = useThree();
  const targetA = useRef(new THREE.Color("#6d5cff"));
  const targetB = useRef(new THREE.Color("#4de2e2"));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uActive: { value: 0 },
      uSeed: { value: Math.random() * 10 },
      uColorA: { value: new THREE.Color("#6d5cff") },
      uColorB: { value: new THREE.Color("#4de2e2") },
    }),
    [],
  );

  useEffect(() => {
    if (active !== null) {
      const g = projects[active].gradient;
      targetA.current.set(g[0]);
      targetB.current.set(g[1]);
    }
  }, [active]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uColorA.value.lerp(targetA.current, 0.08);
    uniforms.uColorB.value.lerp(targetB.current, 0.08);
    uniforms.uActive.value = lerp(
      uniforms.uActive.value,
      active !== null ? 1 : 0,
      0.12,
    );
  });

  return (
    <mesh frustumCulled={false} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

type Props = {
  active: number | null;
  px: MotionValue<number>;
  py: MotionValue<number>;
};

/** A shader-driven liquid gradient preview that follows the cursor. */
export function WorksGLPreview({ active, px, py }: Props) {
  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-64 w-80 overflow-hidden rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/10 md:block"
      style={{ x: px, y: py, translate: "-50% -50%" }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: active !== null ? 1 : 0,
        scale: active !== null ? 1 : 0.8,
      }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Plane active={active} />
      </Canvas>

      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
        {active !== null &&
          projects[active].tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur"
            >
              {tag}
            </span>
          ))}
      </div>
    </motion.div>
  );
}
