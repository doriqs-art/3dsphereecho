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
    <group ref={groupRef} scale={0.02}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/rubens.glb");
