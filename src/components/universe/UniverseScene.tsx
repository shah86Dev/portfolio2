"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { Group, Mesh } from "three";

import type { MethodStage } from "@/content";

/**
 * The Engineering Universe, in three dimensions.
 *
 * This is the ONLY module in the codebase that imports `three`. It is reached
 * exclusively through a `next/dynamic` import with `ssr: false`, which keeps
 * the 3D bundle out of the initial JavaScript of every route.
 *
 * Deliberate constraints (docs/constitution.md §6):
 *   - procedural geometry only — no loaded models, no textures, no HDRI
 *   - no shadows, no post-processing
 *   - device pixel ratio clamped
 *   - the frameloop stops entirely under reduced motion
 */

/* Scene colours mirror the design tokens in globals.css. three.js cannot read
   CSS custom properties, so they are restated here — and only here. */
const COLOR = {
  signal: "#38d6f2",
  signalStrong: "#7ee7fb",
  signalDim: "#16667a",
  surface: "#0e1420",
  /** Node body — lighter than the surface so it reads against the void. */
  node: "#1d3b4a",
} as const;

const ORBIT_RADIUS = 2.65;
const TAU = Math.PI * 2;

/** Angle of node `i`, measured in the scene's own XY plane. Index 0 is top. */
const nodeAngle = (index: number, count: number) => Math.PI / 2 - (index / count) * TAU;

/** Rotation that brings node `i` to the top of the ring. */
const rotationForIndex = (index: number, count: number) => (index / count) * TAU;

interface SceneProps {
  stages: MethodStage[];
  activeIndex: number;
  onSelect: (index: number) => void;
  animate: boolean;
  /** Bumped by the Reset view control to force a return to the base pose. */
  resetToken: number;
}

export default function UniverseScene({
  stages,
  activeIndex,
  onSelect,
  animate,
  resetToken,
}: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.9, 7.4], fov: 42 }}
      dpr={[1, 1.75]}
      frameloop={animate ? "always" : "demand"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      // The rail beneath the canvas carries all semantics; this is decorative.
      aria-hidden="true"
      tabIndex={-1}
      style={{ touchAction: "pan-y" }}
    >
      <color attach="background" args={["#05070c"]} />
      <fog attach="fog" args={["#05070c", 8, 17]} />

      <ambientLight intensity={0.55} />
      <hemisphereLight args={[COLOR.signal, "#060910", 0.5]} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} />
      <pointLight position={[-5, -2, 3]} intensity={18} color={COLOR.signal} distance={16} />

      <Universe
        stages={stages}
        activeIndex={activeIndex}
        onSelect={onSelect}
        animate={animate}
        resetToken={resetToken}
      />
    </Canvas>
  );
}

function Universe({ stages, activeIndex, onSelect, animate, resetToken }: SceneProps) {
  const group = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  const { invalidate } = useThree();
  const count = stages.length;

  // False while the ring is still easing toward its target pose.
  const settled = useRef(false);

  const desired = activeIndex >= 0 ? rotationForIndex(activeIndex, count) : 0;

  // Whenever the pose changes, wake the frameloop so the ring can ease to its
  // new position — necessary in `demand` mode, harmless in `always`.
  useEffect(() => {
    settled.current = false;
    invalidate();
  }, [activeIndex, resetToken, invalidate]);

  const nodes = useMemo(
    () =>
      stages.map((stage, index) => {
        const angle = nodeAngle(index, count);
        return {
          stage,
          index,
          position: [
            Math.cos(angle) * ORBIT_RADIUS,
            Math.sin(angle) * ORBIT_RADIUS,
            Math.sin(index * 1.7) * 0.32,
          ] as [number, number, number],
        };
      }),
    [stages, count],
  );

  const connectorPositions = useMemo(() => {
    const points: number[] = [];
    for (const node of nodes) {
      points.push(0, 0, 0, ...node.position);
    }
    return new Float32Array(points);
  }, [nodes]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;

    const step = Math.min(delta, 0.05);

    if (activeIndex >= 0 || !animate) {
      // Ease to the target pose: the selected node at the top of the ring, or
      // the base pose when nothing is selected and motion is off.
      const diff = shortestAngle(desired - g.rotation.z);
      if (Math.abs(diff) < 0.001) {
        g.rotation.z = desired;
        settled.current = true;
      } else {
        g.rotation.z += diff * Math.min(1, step * 5);
      }
    } else {
      // Idle drift, well under the 0.05 rad/s ceiling in the constitution.
      g.rotation.z += step * 0.045;
    }

    if (core.current && animate) {
      core.current.rotation.x += step * 0.12;
      core.current.rotation.y += step * 0.18;
    }

    // In `demand` mode keep rendering until the pose has settled.
    if (!animate && !settled.current) invalidate();
  });

  return (
    <group rotation={[0.18, 0, 0]}>
      {/* The system under construction. */}
      <mesh ref={core}>
        <icosahedronGeometry args={[0.92, 0]} />
        <meshStandardMaterial
          color={COLOR.surface}
          roughness={0.35}
          metalness={0.55}
          emissive={COLOR.signal}
          emissiveIntensity={0.07}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.32, 1]} />
        <meshBasicMaterial color={COLOR.signal} wireframe transparent opacity={0.16} />
      </mesh>

      <group ref={group}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[connectorPositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={COLOR.signalDim} transparent opacity={0.9} />
        </lineSegments>

        {nodes.map(({ stage, index, position }) => (
          <UniverseNode
            key={stage.id}
            position={position}
            active={index === activeIndex}
            dimmed={activeIndex >= 0 && index !== activeIndex}
            onSelect={() => onSelect(index)}
          />
        ))}
      </group>
    </group>
  );
}

interface NodeProps {
  position: [number, number, number];
  active: boolean;
  dimmed: boolean;
  onSelect: () => void;
}

function UniverseNode({ position, active, dimmed, onSelect }: NodeProps) {
  const [hovered, setHovered] = useState(false);
  const emphasised = active || hovered;

  return (
    <group position={position}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
        scale={active ? 1.5 : hovered ? 1.22 : 1}
      >
        <octahedronGeometry args={[0.34, 0]} />
        {/* Inactive nodes still have to read as objects on a near-black
            background, so they keep a visible emissive floor rather than
            fading into the void. */}
        <meshStandardMaterial
          color={emphasised ? COLOR.signalStrong : COLOR.node}
          emissive={COLOR.signal}
          emissiveIntensity={active ? 0.95 : hovered ? 0.6 : 0.32}
          roughness={0.25}
          metalness={0.45}
          transparent
          opacity={dimmed && !hovered ? 0.7 : 1}
        />
      </mesh>

      {active ? (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.62, 0.008, 6, 48]} />
          <meshBasicMaterial color={COLOR.signal} transparent opacity={0.8} />
        </mesh>
      ) : null}

      {/* No labels inside the canvas.
          drei's <Html> portals real DOM over the scene, which gave React a
          node to remove on unmount that it no longer owned — a NotFoundError
          in the console whenever the canvas went away. The node names already
          live in the rail directly beneath the canvas and in the caption
          overlay, both of which are ordinary DOM, so the portal bought
          nothing and cost a crash. */}
    </group>
  );
}

/** Normalises an angle difference into (-π, π] so the ring takes the short way. */
function shortestAngle(delta: number): number {
  return Math.atan2(Math.sin(delta), Math.cos(delta));
}
