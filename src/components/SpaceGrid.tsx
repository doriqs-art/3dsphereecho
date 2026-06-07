"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COLS = 30;
const ROWS = 20;
const CELL = 1.8;
const GW = COLS * CELL;
const GH = ROWS * CELL;
const GRID_COLOR = new THREE.Color(0x1e3020);

export default function SpaceGrid() {
  const groupRef = useRef<THREE.Group>(null);

  const lines: THREE.BufferGeometry[] = [];

  for (let i = 0; i <= COLS; i++) {
    const x = -GW / 2 + i * CELL;
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, -GH / 2, 0),
      new THREE.Vector3(x, GH / 2, 0),
    ]);
    lines.push(geo);
  }
  for (let j = 0; j <= ROWS; j++) {
    const y = -GH / 2 + j * CELL;
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-GW / 2, y, 0),
      new THREE.Vector3(GW / 2, y, 0),
    ]);
    lines.push(geo);
  }

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.x = Math.sin(t * 0.25) * 0.35;
    groupRef.current.position.y = Math.cos(t * 0.18) * 0.25;
  });

  return (
    <group ref={groupRef} position={[0, 0, -7]}>
      {lines.map((geo, i) => (
        <primitive key={i} object={new THREE.Line(geo, new THREE.LineBasicMaterial({
          color: GRID_COLOR,
          transparent: true,
          opacity: 0.5,
        }))} />
      ))}
    </group>
  );
}
