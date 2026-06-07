"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function PlaceholderModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.4;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
  });

  const cornerPositions: [number, number, number][] = [
    [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1],
    [1, -1, -1],  [1, -1, 1],  [1, 1, -1],  [1, 1, 1],
  ];

  return (
    <group ref={groupRef}>
      {/* inner fill */}
      <mesh>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshBasicMaterial color="#1a1a1a" transparent opacity={0.6} />
      </mesh>

      {/* wireframe edges */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.4, 1.4, 1.4)]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.75} />
      </lineSegments>

      {/* corner dots */}
      {cornerPositions.map(([x, y, z], i) => (
        <mesh key={i} position={[x * 0.7, y * 0.7, z * 0.7]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}
