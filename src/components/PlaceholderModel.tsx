"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function PlaceholderModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/drum_set.glb");

  // Center & scale the model AFTER it's mounted into the scene graph
  useEffect(() => {
    if (!groupRef.current) return;

    const box = new THREE.Box3().setFromObject(groupRef.current);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    if (maxDim > 0) {
      const targetSize = 5; // world-units tall — tweak to resize
      const s = targetSize / maxDim;
      groupRef.current.scale.setScalar(s);

      // Re-center after scaling
      groupRef.current.position.set(
        -center.x * s,
        -center.y * s,
        -center.z * s
      );
    }
  }, [scene]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.4;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
  });

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <directionalLight position={[-5, -2, -5]} intensity={0.8} color="#aaaaff" />

      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
    </>
  );
}

useGLTF.preload("/models/drum_set.glb");
