"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function PlaceholderModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/rubens.glb");

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.4;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
  });

  return (
    <>
      {/* Lights so the model isn't black */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <directionalLight position={[-5, -2, -5]} intensity={0.8} color="#aaaaff" />

      <group ref={groupRef} scale={0.08}>
        <primitive object={scene} />
      </group>
    </>
  );
}

useGLTF.preload("/models/rubens.glb");
