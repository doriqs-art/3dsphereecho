"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import SpaceGrid from "./SpaceGrid";
import PlaceholderModel from "./PlaceholderModel";
import OrbiterObject from "./OrbiterObject";

const ORBIT_RADIUS = 3.8;
const ORBIT_COUNT = 24;

type ShapeType = "square" | "rectangle" | "circle";

// Fibonacci sphere — even distribution of points on a sphere surface
function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push(
      new THREE.Vector3(
        r * Math.cos(theta) * radius,
        y * radius,
        r * Math.sin(theta) * radius
      )
    );
  }
  return pts;
}

// Camera rig — follows mouse gently
function CameraRig() {
  const { camera, gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useMemo(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / gl.domElement.clientWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / gl.domElement.clientHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [gl]);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.7 - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y * 0.45 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Scene contents — all R3F hooks live inside Canvas
function SceneContents() {
  const orbiterData = useMemo(() => {
    const positions = fibonacciSphere(ORBIT_COUNT, ORBIT_RADIUS);
    const shapes: ShapeType[] = ["square", "rectangle", "circle"];

    return positions.map((pos, i) => ({
      initialPosition: pos,
      orbitAxis: new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize(),
      orbitSpeed: (0.012 + Math.random() * 0.008) * (Math.random() < 0.5 ? 1 : -1),
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.8 + Math.random() * 0.6,
      shape: shapes[i % 3],
    }));
  }, []);

  return (
    <>
      <CameraRig />
      <SpaceGrid />
      <PlaceholderModel />
      {orbiterData.map((props, i) => (
        <OrbiterObject key={i} {...props} />
      ))}
    </>
  );
}

export default function OrbitScene() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#131313" }}>
      <Canvas
        camera={{ position: [0, 0, 9], fov: 60, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color("#131313"));
        }}
        dpr={[1, 2]}
      >
        <SceneContents />
      </Canvas>

      {/* Label — matches Echo's typographic style */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.15)",
          fontFamily: "'Courier New', monospace",
          fontSize: 11,
          letterSpacing: "4px",
          textTransform: "uppercase",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        orbit scene · placeholder model
      </div>
    </div>
  );
}
