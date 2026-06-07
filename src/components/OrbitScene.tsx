"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import TunnelBackground from "./SpaceGrid";
import PlaceholderModel from "./PlaceholderModel";
import OrbiterObject from "./OrbiterObject";

const ORBIT_RADIUS = 6.2;
const ORBIT_COUNT = 28;

type ShapeType = "square" | "rectangle" | "circle";

function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push(new THREE.Vector3(r * Math.cos(theta) * radius, y * radius, r * Math.sin(theta) * radius));
  }
  return pts;
}

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
    camera.position.x += (mouse.current.x * 0.8 - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y * 0.5 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function SceneContents() {
  const orbiterData = useMemo(() => {
    const positions = fibonacciSphere(ORBIT_COUNT, ORBIT_RADIUS);
    const shapes: ShapeType[] = ["square", "rectangle", "circle"];
    return positions.map((pos, i) => ({
      initialPosition: pos,
      orbitAxis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
      orbitSpeed: (0.010 + Math.random() * 0.007) * (Math.random() < 0.5 ? 1 : -1),
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.8 + Math.random() * 0.6,
      shape: shapes[i % 3],
    }));
  }, []);

  return (
    <>
      <CameraRig />
      <PlaceholderModel />
      {orbiterData.map((props, i) => (
        <OrbiterObject key={i} {...props} />
      ))}
    </>
  );
}

export default function OrbitScene() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden", background: "#131313" }}>

      <TunnelBackground />

      <div style={{ position: "fixed", inset: 0, zIndex: 1 }}>
        <Canvas
          camera={{ position: [0, 0, 13], fov: 58, near: 0.1, far: 200 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
          dpr={[1, 2]}
        >
          <SceneContents />
        </Canvas>
      </div>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "2rem",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <h1 style={{
          fontFamily: '"Syncopate", sans-serif',
          fontSize: "clamp(1.4rem, 4vw, 3.5rem)",
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: "#ffffff",
          margin: 0,
          textTransform: "uppercase",
        }}>
          ECHO
        </h1>
      </div>

    </div>
  );
}
