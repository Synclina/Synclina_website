"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  BufferAttribute,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { finePointer, onIntroDone, prefersReducedMotion } from "@/lib/scroll";

type Props = { onReady?: () => void; onFail?: () => void };

/**
 * Two interlocking tubes following the logo strokes, indigo to orchid, matte metal.
 * Draws in over 1.6s once the intro lifts, idles with a slow sway, leans up to ~6°
 * toward a fine pointer, and turns 25° / shrinks to 0.8 as the hero scrolls away.
 */
export default function HeroRibbon({ onReady, onFail }: Props) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = prefersReducedMotion();
    const small = window.matchMedia("(max-width: 900px)").matches;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      onFail?.();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.domElement.setAttribute("aria-hidden", "true");
    el.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 11);

    // Logo grid (50px = 1 unit), centred and flipped to y-up
    const P = (x: number, y: number) => new Vector3((x - 85) / 50, -(y - 95) / 50, 0);
    const line = (x1: number, y1: number, x2: number, y2: number, n = 24) =>
      Array.from({ length: n + 1 }, (_, i) => P(x1 + ((x2 - x1) * i) / n, y1 + ((y2 - y1) * i) / n));
    const arc = (cx: number, cy: number, r: number, a0: number, a1: number, n = 48) =>
      Array.from({ length: n + 1 }, (_, i) => {
        const a = a0 + ((a1 - a0) * i) / n;
        return P(cx + r * Math.cos(a), cy + r * Math.sin(a));
      });
    const join = (...parts: Vector3[][]) => parts.flatMap((p, i) => (i ? p.slice(1) : p));
    const A = join(line(150, 20, 50, 20), arc(50, 70, 50, -Math.PI / 2, (-3 * Math.PI) / 2), line(50, 120, 110, 120));
    const B = join(line(70, 70, 120, 70), arc(120, 120, 50, -Math.PI / 2, Math.PI / 2), line(120, 170, 40, 170));

    const c0 = new Color("#3A1CD8");
    const c1 = new Color("#C96EFF");
    const tmp = new Color();
    const grad = (x: number, y: number) => tmp.copy(c0).lerp(c1, Math.min(1, Math.max(0, (x + y + 3.2) / 6.4)));
    const tubeMat = new MeshStandardMaterial({ vertexColors: true, metalness: 0.5, roughness: 0.3 });
    const group = new Group();
    scene.add(group);

    const disposables: { dispose: () => void }[] = [tubeMat];
    const parts = [A, B].map((pts) => {
      const geo = new TubeGeometry(new CatmullRomCurve3(pts, false, "centripetal"), small ? 120 : 240, 0.2, small ? 16 : 28, false);
      const pos = geo.attributes.position;
      const col = new Float32Array(pos.count * 3);
      for (let i = 0; i < pos.count; i++) {
        const c = grad(pos.getX(i), pos.getY(i));
        col.set([c.r, c.g, c.b], i * 3);
      }
      geo.setAttribute("color", new BufferAttribute(col, 3));
      const mesh = new Mesh(geo, tubeMat);
      const caps = [pts[0], pts[pts.length - 1]].map((p) => {
        const capGeo = new SphereGeometry(0.2, 24, 16);
        const capMat = new MeshStandardMaterial({ color: grad(p.x, p.y).clone(), metalness: 0.5, roughness: 0.3 });
        disposables.push(capGeo, capMat);
        const m = new Mesh(capGeo, capMat);
        m.position.copy(p);
        m.visible = false;
        return m;
      });
      disposables.push(geo);
      group.add(mesh, ...caps);
      return { mesh, caps, total: geo.index!.count };
    });

    scene.add(new AmbientLight(0xffffff, 0.55));
    const key = new DirectionalLight(0xffffff, 1.1);
    key.position.set(3, 4, 6);
    scene.add(key);
    const rim = new DirectionalLight(0x8d5cff, 1.4);
    rim.position.set(-5, -2, -3);
    scene.add(rim);

    const draw = (p: number) =>
      parts.forEach(({ mesh, caps, total }) => {
        mesh.geometry.setDrawRange(0, Math.floor((total * p) / 3) * 3);
        caps[0].visible = p > 0.01;
        caps[1].visible = p > 0.995;
      });

    const size = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (!raf) renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(size);
    ro.observe(el);

    const tgt = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const MAX = (6 * Math.PI) / 180;
    const onPointer = (e: PointerEvent) => {
      tgt.y = (e.clientX / window.innerWidth - 0.5) * 2 * MAX;
      tgt.x = (e.clientY / window.innerHeight - 0.5) * MAX;
    };
    const parallax = finePointer() && !reduce && !small;
    if (parallax) window.addEventListener("pointermove", onPointer, { passive: true });

    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    let visible = true;
    let raf = 0;
    let t0 = -1;

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      if (t0 < 0) t0 = now;
      const t = (now - t0) / 1000;
      draw(ease(Math.min(1, t / 1.6)));
      cur.x += (tgt.x - cur.x) * 0.06;
      cur.y += (tgt.y - cur.y) * 0.06;
      const scroll = Math.min(1, window.scrollY / window.innerHeight);
      group.rotation.y = Math.sin(t * 0.45) * 0.28 + cur.y + scroll * ((25 * Math.PI) / 180);
      group.rotation.x = cur.x + Math.sin(t * 0.3) * 0.05;
      group.scale.setScalar(1 - 0.2 * scroll);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce) start();
    });
    io.observe(el);
    const onVis = () => !reduce && start();
    document.addEventListener("visibilitychange", onVis);

    size();
    let stopIntro = () => {};
    if (reduce) {
      draw(1);
      renderer.render(scene, camera);
    } else {
      draw(0);
      renderer.render(scene, camera);
      stopIntro = onIntroDone(start);
    }
    onReady?.();

    return () => {
      stopIntro();
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointer);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReady, onFail]);

  return <div ref={host} style={{ position: "absolute", inset: 0 }} />;
}
