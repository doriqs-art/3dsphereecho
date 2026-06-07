"use client";

import { useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import OrbiterObject from "./OrbiterObject";
import PlaceholderModel from "./PlaceholderModel";
import TunnelBackground from "./SpaceGrid";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const SPHERE_RADIUS = 6.5;   // ← increase to spread shapes further apart
const COUNT = 22;             // ← decrease to reduce crowding
const SHAPES: Array<"square" | "rectangle" | "circle"> = [
  "square", "rectangle", "circle",
];
// ─────────────────────────────────────────────────────────────────────────────

function generateFibonacciSphere(count: number, radius: number) {
  const points: THREE.Vector3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.399 radians

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;           // -1 to 1
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius
      )
    );
  }
  return points;
}

export default function OrbitScene() {
  const orbiters = useMemo(() => {
    const positions = generateFibonacciSphere(COUNT, SPHERE_RADIUS);

    return positions.map((pos, i) => {
      // Unique orbit axis per shape — tilted differently so they don't all
      // spin on the same plane and overlap as they move
      const axis = new THREE.Vector3(
        Math.sin(i * 1.3),
        Math.cos(i * 0.7),
        Math.sin(i * 2.1)
      ).normalize();

      return {
        key: i,
        initialPosition: pos,
        orbitAxis: axis,
        orbitSpeed: 0.03 + (i % 5) * 0.006,   // slow, gentle drift
        pulsePhase: (i / COUNT) * Math.PI * 2,
        pulseSpeed: 0.6 + (i % 3) * 0.2,
        shape: SHAPES[i % SHAPES.length],
      };
    });
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#131313",
      }}
    >
      {/* Tunnel grid background — renders on its own canvas behind R3F */}
      <TunnelBackground />

      {/* ECHO title */}
      <div
        style={{
          position: "absolute",
          top: "2rem",
          width: "100%",
          textAlign: "center",
          fontFamily: "'Syncopate', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          letterSpacing: "0.04em",
          color: "#ffffff",
          zIndex: 10,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        ECHO
      </div>

      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Bust in the centre */}
        <PlaceholderModel />

        {/* Orbiting shapes — each on its own tilted axis */}
        {orbiters.map((o) => (
          <OrbiterObject
            key={o.key}
            initialPosition={o.initialPosition}
            orbitAxis={o.orbitAxis}
            orbitSpeed={o.orbitSpeed}
            pulsePhase={o.pulsePhase}
            pulseSpeed={o.pulseSpeed}
            shape={o.shape}
          />
        ))}
      </Canvas>
    </div>
  );
}
