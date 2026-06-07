"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type ShapeType = "square" | "rectangle" | "circle";

interface Props {
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
}: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const posRef = useRef<THREE.Vector3>(initialPosition.clone());
  const quatRef = useRef(new THREE.Quaternion());

  const { fillGeo, edgeGeo, circlePoints } = useMemo(() => {
    if (shape === "square") {
      const geo = new THREE.PlaneGeometry(1.6, 1.6);
      return { fillGeo: geo, edgeGeo: new THREE.EdgesGeometry(geo), circlePoints: null };
    } else if (shape === "rectangle") {
      const geo = new THREE.PlaneGeometry(2.2, 1.4);
      return { fillGeo: geo, edgeGeo: new THREE.EdgesGeometry(geo), circlePoints: null };
    } else {
      const geo = new THREE.RingGeometry(0.5, 0.75, 64);
      const pts: THREE.Vector3[] = [];
      for (let a = 0; a <= 128; a++) {
        const ang = (a / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(ang) * 0.75, Math.sin(ang) * 0.75, 0));
      }
      return { fillGeo: geo, edgeGeo: null, circlePoints: pts };
    }
  }, [shape]);

  const circleLine = useMemo(() => {
    if (!circlePoints) return null;
    return new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(circlePoints),
      new THREE.LineBasicMaterial({ color: "#cccccc", transparent: true, opacity: 0.6 })
    );
  }, [circlePoints]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    quatRef.current.setFromAxisAngle(orbitAxis, orbitSpeed * 0.016);
    posRef.current.applyQuaternion(quatRef.current);
    groupRef.current.position.copy(posRef.current);
    groupRef.current.lookAt(0, 0, 0);
    const s = 1 + Math.sin(t * pulseSpeed + pulsePhase) * 0.04;
    groupRef.current.scale.setScalar(s);
  });

  return (
    <group ref={groupRef}>
      {shape !== "circle" && fillGeo && (
        <>
          <mesh geometry={fillGeo}>
            <meshBasicMaterial color="#c8c8c8" side={THREE.DoubleSide} transparent opacity={0.2} />
          </mesh>
          {edgeGeo && (
            <lineSegments geometry={edgeGeo}>
              <lineBasicMaterial color="#dddddd" transparent opacity={0.55} />
            </lineSegments>
          )}
        </>
      )}
      {shape === "circle" && fillGeo && circleLine && (
        <>
          <mesh geometry={fillGeo}>
            <meshBasicMaterial color="#c8c8c8" side={THREE.DoubleSide} transparent opacity={0.2} />
          </mesh>
          <primitive object={circleLine} />
        </>
      )}
    </group>
  );
}
