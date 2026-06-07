"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

// Exact tunnel from pagmarscroll / Echo — Three.js imperative,
// rendered into its own canvas sitting behind the R3F canvas.
export default function TunnelBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const TUNNEL_WIDTH = 24, TUNNEL_HEIGHT = 16, SEGMENT_DEPTH = 6, NUM_SEGMENTS = 14;
    const FLOOR_COLS = 8, WALL_ROWS = 5;
    const COL_WIDTH = TUNNEL_WIDTH / FLOOR_COLS;
    const ROW_HEIGHT = TUNNEL_HEIGHT / WALL_ROWS;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x131313);
    scene.fog = new THREE.FogExp2(0x131313, 0.018);

    const W = window.innerWidth, H = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(70, W / H, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const createSegment = (zPos: number) => {
      const group = new THREE.Group();
      group.position.z = zPos;
      const w = TUNNEL_WIDTH / 2, h = TUNNEL_HEIGHT / 2, d = SEGMENT_DEPTH;
      const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.28, linewidth: 2 });
      const geo = new THREE.BufferGeometry();
      const v: number[] = [];
      for (let i = 0; i <= FLOOR_COLS; i++) {
        const x = -w + i * COL_WIDTH;
        v.push(x, -h, 0, x, -h, -d, x, h, 0, x, h, -d);
      }
      for (let i = 1; i < WALL_ROWS; i++) {
        const y = -h + i * ROW_HEIGHT;
        v.push(-w, y, 0, -w, y, -d, w, y, 0, w, y, -d);
      }
      v.push(-w, -h, 0, w, -h, 0, -w, h, 0, w, h, 0);
      v.push(-w, -h, 0, -w, h, 0, w, -h, 0, w, h, 0);
      v.push(-w, -h, -d, w, -h, -d, -w, h, -d, w, h, -d);
      v.push(-w, -h, -d, -w, h, -d, w, -h, -d, w, h, -d);
      geo.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
      group.add(new THREE.LineSegments(geo, mat));
      return group;
    };

    const segs: THREE.Group[] = [];
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      const s = createSegment(-i * SEGMENT_DEPTH);
      scene.add(s);
      segs.push(s);
    }

    // slow auto-drift — no scroll needed
    let t = 0;
    let fid: number;
    const animate = () => {
      fid = requestAnimationFrame(animate);
      t += 0.008;
      // gentle drift forward
      camera.position.z = -t * 1.2;
      const tl = NUM_SEGMENTS * SEGMENT_DEPTH;
      const cz = camera.position.z;
      segs.forEach(s => {
        if (s.position.z > cz + SEGMENT_DEPTH) {
          let m = 0; segs.forEach(x => (m = Math.min(m, x.position.z)));
          s.position.z = m - SEGMENT_DEPTH;
        }
        if (s.position.z < cz - tl - SEGMENT_DEPTH) {
          let m = -999999; segs.forEach(x => (m = Math.max(m, x.position.z)));
          s.position.z = m + SEGMENT_DEPTH;
        }
      });
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(fid);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        zIndex: 0,
      }}
    />
  );
}
