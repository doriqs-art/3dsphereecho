"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type ShapeType = "square" | "rectangle" | "circle";

interface OrbiterProps {
  initialPosition: THREE.Vector3;
  orbitAxis: THREE.Vector3;
  orbitSpeed: number;
  pulsePhase: number;
  pulseSpeed: number;
  shape: ShapeType;
}

export default function OrbiterObject({
  initialPosition,
  orbitAxis,
  orbitSpeed,
  pulsePhase,
  pulseSpeed,
  shape,
}: OrbiterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const posRef = useRef<THREE.Vector3>(initialPosition.clone());
  const quatRef = useRef(new THREE.Quaternion());

  const { fillGeo, edgeGeo, circlePoints } = useMemo(() => {
    if (shape === "square") {
      const geo = new THREE.PlaneGeometry(0.7, 0.7);
      return { fillGeo: geo, edgeGeo: new THREE.EdgesGeometry(geo), circlePoints: null };
    } else if (shape === "rectangle") {
      const geo = new THREE.PlaneGeometry(1.05, 0.62);
      return { fillGeo: geo, edgeGeo: new THREE.EdgesGeometry(geo), circlePoints: null };
    } else {
      const geo = new THREE.RingGeometry(0.22, 0.36, 48);
      const pts: THREE.Vector3[] = [];
      for (let a = 0; a <= 64; a++) {
        const ang = (a / 64) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(ang) * 0.36, Math.sin(ang) * 0.36, 0));
      }
      return { fillGeo: geo, edgeGeo: null, circlePoints: pts };
    }
  }, [shape]);

  const circleLine = useMemo(() => {
    if (!circlePoints) return null;
    return new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(circlePoints),
      new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.45 })
    );
  }, [circlePoints]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    quatRef.current.setFromAxisAngle(orbitAxis, orbitSpeed * 0.016);
    posRef.current.applyQuaternion(quatRef.current);
    groupRef.current.position.copy(posRef.current);
    groupRef.current.lookAt(0, 0, 0);
    const s = 1 + Math.sin(t * pulseSpeed + pulsePhase) * 0.055;
    groupRef.current.scale.setScalar(s);
  });

  return (
    <group ref={groupRef}>
      {shape !== "circle" && fillGeo && (
        <>
          <mesh geometry={fillGeo}>
            <meshBasicMaterial color="#131313" side={THREE.DoubleSide} transparent opacity={0.85} />
          </mesh>
          {edgeGeo && (
            <lineSegments geometry={edgeGeo}>
              <lineBasicMaterial color="#ffffff" transparent opacity={0.45} />
            </lineSegments>
          )}
        </>
      )}
      {shape === "circle" && fillGeo && circleLine && (
        <>
          <mesh geometry={fillGeo}>
            <meshBasicMaterial color="#131313" side={THREE.DoubleSide} transparent opacity={0.85} />
          </mesh>
          <primitive object={circleLine} />
        </>
      )}
    </group>
  );
}
