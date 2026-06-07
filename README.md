# Orbit Scene

A 3D orbit scene built with React Three Fiber — standalone, ready to merge into Echo.

## Stack
- Next.js 14 (App Router)
- React Three Fiber + Drei
- Three.js
- TypeScript

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Swapping the placeholder model

The center wireframe box lives in `src/components/PlaceholderModel.tsx`.

To replace it with your own `.glb`:

1. Drop your `.glb` file into `/public/models/your-model.glb`
2. Replace `PlaceholderModel.tsx` with:

```tsx
"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function PlaceholderModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/your-model.glb");

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.4;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
  });

  return <group ref={groupRef}><primitive object={scene} /></group>;
}
```

---

## Adding to Echo

Copy these files into your Echo project:

```
src/components/OrbitScene.tsx
src/components/SpaceGrid.tsx
src/components/PlaceholderModel.tsx
src/components/OrbiterObject.tsx
```

Then in your Echo page/route:

```tsx
import dynamic from "next/dynamic";
const OrbitScene = dynamic(() => import("@/components/OrbitScene"), { ssr: false });
export default function OrbitPage() { return <OrbitScene />; }
```

---

## Orbit settings

Tune these constants in `OrbitScene.tsx`:

| Constant | Default | Effect |
|---|---|---|
| `ORBIT_RADIUS` | `3.8` | Distance of objects from center |
| `ORBIT_COUNT` | `24` | Number of orbiting objects |

Tune per-object feel in `OrbiterObject.tsx`:
- `orbitSpeed` — how fast each object revolves
- `pulseSpeed` / `pulsePhase` — scale breathing rhythm
