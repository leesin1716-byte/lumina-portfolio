"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Robot } from "@/components/canvas/Robot";
import { lerp } from "@/lib/utils";

const CYAN = "#4de2e2";
const VIOLET = "#8b7cff";

function Rig({ reducedMotion }: { reducedMotion: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const { camera } = useThree();

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(() => {
    // Smooth the pointer the robot reads.
    pointer.current.x = lerp(pointer.current.x, target.current.x, 0.06);
    pointer.current.y = lerp(pointer.current.y, target.current.y, 0.06);

    // Subtle camera parallax for depth.
    if (!reducedMotion) {
      camera.position.x = lerp(camera.position.x, target.current.x * 0.6, 0.04);
      camera.position.y = lerp(
        camera.position.y,
        -target.current.y * 0.4,
        0.04,
      );
      camera.lookAt(0, 0, 0);
    }
  });

  return <Robot pointer={pointer} reducedMotion={reducedMotion} />;
}

export function RobotScene({
  reducedMotion = false,
}: {
  reducedMotion?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 32 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <pointLight position={[-5, 1, 3]} intensity={40} color={VIOLET} distance={16} />
      <pointLight position={[5, -1, 3]} intensity={40} color={CYAN} distance={16} />

      <Suspense fallback={null}>
        <Rig reducedMotion={reducedMotion} />

        {!reducedMotion && (
          <Sparkles
            count={48}
            scale={[9, 6, 4]}
            size={2.2}
            speed={0.25}
            opacity={0.5}
            color="#aab0ff"
          />
        )}

        <Environment resolution={256} frames={1}>
          <Lightformer
            form="rect"
            intensity={2.4}
            color={CYAN}
            position={[-4, 1, 3]}
            scale={[5, 5, 1]}
          />
          <Lightformer
            form="rect"
            intensity={2.4}
            color={VIOLET}
            position={[4, 1, 3]}
            scale={[5, 5, 1]}
          />
          <Lightformer
            form="circle"
            intensity={1.6}
            color="#ffffff"
            position={[0, 4, 2]}
            scale={3}
          />
        </Environment>
      </Suspense>

      <EffectComposer enableNormalPass={false}>
        <Bloom
          mipmapBlur
          intensity={0.95}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.3}
          radius={0.75}
        />
      </EffectComposer>
    </Canvas>
  );
}
