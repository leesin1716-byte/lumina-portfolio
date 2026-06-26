"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { lerp } from "@/lib/utils";

type RobotProps = {
  /** Pointer in normalized device coords (-1..1), already smoothed. */
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  /** Decaying 0..1 impulse, spikes to 1 on click. */
  pulse?: React.MutableRefObject<number>;
  reducedMotion?: boolean;
};

const SHELL = "#0c0e18";
const CYAN = "#4de2e2";
const VIOLET = "#8b7cff";
const MAGENTA = "#ff5fa2";

const _cyan = new THREE.Color(CYAN);
const _magenta = new THREE.Color(MAGENTA);
const _tmp = new THREE.Color();

/**
 * A stylized robot companion built entirely from primitives — a floating
 * helmet head whose gaze follows the cursor, with glowing visor eyes,
 * a pulsing antenna, and side pods. No external model required.
 */
export function Robot({ pointer, pulse, reducedMotion = false }: RobotProps) {
  const head = useRef<THREE.Group>(null!);
  const eyes = useRef<THREE.Group>(null!);
  const eyeMats = useRef<THREE.MeshStandardMaterial[]>([]);
  const antennaTip = useRef<THREE.Mesh>(null!);
  const ring = useRef<THREE.Mesh>(null!);
  const blink = useRef(0);
  const nextBlink = useRef(2 + Math.random() * 3);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const { x, y } = pointer.current;
    const p = pulse?.current ?? 0;

    if (head.current) {
      const targetRotY = x * 0.7;
      const targetRotX = -y * 0.45;
      head.current.rotation.y = lerp(head.current.rotation.y, targetRotY, 0.08);
      head.current.rotation.x = lerp(head.current.rotation.x, targetRotX, 0.08);
      head.current.scale.setScalar(1 + p * 0.1);
      head.current.position.y = p * 0.16;
    }

    // Click pulse: eyes flash toward magenta and brighten.
    _tmp.copy(_cyan).lerp(_magenta, Math.min(p, 1));
    for (const m of eyeMats.current) {
      if (m) {
        m.emissive.copy(_tmp);
        m.emissiveIntensity = 3.2 + p * 4;
      }
    }

    // Eyes drift a touch further than the head for a lively gaze.
    if (eyes.current) {
      eyes.current.position.x = lerp(eyes.current.position.x, x * 0.07, 0.1);
      eyes.current.position.y = lerp(eyes.current.position.y, y * 0.05, 0.1);

      // Blink: periodically squash the eyes on Y.
      if (!reducedMotion) {
        nextBlink.current -= delta;
        if (nextBlink.current <= 0) {
          blink.current = 1;
          nextBlink.current = 2.5 + Math.random() * 3.5;
        }
        blink.current = lerp(blink.current, 0, 0.25);
        eyes.current.scale.y = 1 - blink.current * 0.92;
      }
    }

    if (antennaTip.current) {
      const m = antennaTip.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 2 + Math.sin(t * 4) * 1.2 + p * 5;
    }
    if (ring.current) {
      ring.current.rotation.z = t * 0.3;
    }
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.4}
      rotationIntensity={reducedMotion ? 0 : 0.4}
      floatIntensity={reducedMotion ? 0 : 0.8}
      floatingRange={[-0.1, 0.1]}
    >
      {/* Halo ring behind the head */}
      <mesh ref={ring} position={[0, 0, -0.9]}>
        <torusGeometry args={[1.6, 0.018, 16, 80]} />
        <meshStandardMaterial
          color={VIOLET}
          emissive={VIOLET}
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>

      <group ref={head}>
        {/* Head shell */}
        <RoundedBox args={[1.7, 1.5, 1.45]} radius={0.42} smoothness={6}>
          <meshStandardMaterial
            color={SHELL}
            metalness={0.85}
            roughness={0.22}
          />
        </RoundedBox>

        {/* Glossy face panel */}
        <RoundedBox
          args={[1.28, 1.02, 0.18]}
          radius={0.28}
          smoothness={6}
          position={[0, 0.02, 0.74]}
        >
          <meshStandardMaterial
            color="#05060c"
            metalness={0.6}
            roughness={0.08}
          />
        </RoundedBox>

        {/* Eyes */}
        <group ref={eyes} position={[0, 0.04, 0.85]}>
          {[-0.3, 0.3].map((ex, idx) => (
            <mesh key={ex} position={[ex, 0, 0]}>
              <capsuleGeometry args={[0.1, 0.16, 8, 16]} />
              <meshStandardMaterial
                ref={(m) => {
                  if (m) eyeMats.current[idx] = m as THREE.MeshStandardMaterial;
                }}
                color={CYAN}
                emissive={CYAN}
                emissiveIntensity={3.2}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>

        {/* Cheek accents */}
        {[-0.46, 0.46].map((ex) => (
          <mesh key={ex} position={[ex, -0.34, 0.82]}>
            <circleGeometry args={[0.05, 24]} />
            <meshStandardMaterial
              color={MAGENTA}
              emissive={MAGENTA}
              emissiveIntensity={2.4}
              toneMapped={false}
            />
          </mesh>
        ))}

        {/* Side pods (headphone-like) */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.92, 0, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.34, 0.34, 0.18, 32]} />
              <meshStandardMaterial
                color={SHELL}
                metalness={0.9}
                roughness={0.25}
              />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} position={[side * 0.05, 0, 0]}>
              <torusGeometry args={[0.2, 0.03, 12, 32]} />
              <meshStandardMaterial
                color={VIOLET}
                emissive={VIOLET}
                emissiveIntensity={2.2}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}

        {/* Antenna */}
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.5, 12]} />
          <meshStandardMaterial color={SHELL} metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh ref={antennaTip} position={[0, 1.28, 0]}>
          <sphereGeometry args={[0.09, 24, 24]} />
          <meshStandardMaterial
            color={MAGENTA}
            emissive={MAGENTA}
            emissiveIntensity={2.6}
            toneMapped={false}
          />
        </mesh>
      </group>
    </Float>
  );
}
