"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  BufferAttribute,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { MARK_PATHS } from "@/components/brand/SynclinaMark";
import { finePointer, onIntroDone, prefersReducedMotion } from "@/lib/scroll";

type Props = { onReady?: () => void; onFail?: () => void };

/* Official mark, in its own artwork coordinates (viewBox 340 333 602 546) */
const CX = 641;
const CY = 606;
const DEPTH = 64;
const SCALE = 1 / 132;

/* The brand gradient runs from (380,860) to (930,360) */
const STOPS = [new Color("#4A12FF"), new Color("#7C22FF"), new Color("#C42BFF")];
const gradientAt = (x: number, y: number, out: Color) => {
  const t = Math.min(1, Math.max(0, ((x - 380) * 550 + (y - 860) * -500) / 552500));
  return t < 0.55 ? out.copy(STOPS[0]).lerp(STOPS[1], t / 0.55) : out.copy(STOPS[1]).lerp(STOPS[2], (t - 0.55) / 0.45);
};

/**
 * The Synclina "S" in 3D: the two official pieces, extruded with crisp edges, so the
 * silhouette is exactly the logo. Once the intro doors part, the pieces slide in from
 * opposite sides and lock together. Then a slow sway, a lean of up to ~6° toward a fine
 * pointer, and a 25° turn / 0.8 scale as the hero scrolls away.
 */
export default function HeroMark({ onReady, onFail }: Props) {
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
    const camera = new PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 13);

    const group = new Group(); // sway, parallax, scroll
    const art = new Group(); // artwork space → world: centred, y flipped
    art.scale.set(SCALE, -SCALE, SCALE);
    group.add(art);
    scene.add(group);

    const material = new MeshStandardMaterial({ vertexColors: true, metalness: 0.3, roughness: 0.38 });
    const disposables: { dispose: () => void }[] = [material];
    const svg = new SVGLoader().parse(
      `<svg xmlns="http://www.w3.org/2000/svg"><path d="${MARK_PATHS.upper}"/><path d="${MARK_PATHS.lower}"/></svg>`,
    );

    const tmp = new Color();
    const pieces = svg.paths.map((path) => {
      const geo = new ExtrudeGeometry(SVGLoader.createShapes(path), {
        depth: DEPTH,
        curveSegments: small ? 32 : 64,
        bevelEnabled: true,
        bevelThickness: 3,
        bevelSize: 2.5,
        bevelOffset: -2.5, // bevel inside the outline, so the silhouette stays exact
        bevelSegments: 2,
      });
      const pos = geo.attributes.position;
      const col = new Float32Array(pos.count * 3);
      for (let i = 0; i < pos.count; i++) {
        gradientAt(pos.getX(i), pos.getY(i), tmp);
        col.set([tmp.r, tmp.g, tmp.b], i * 3);
      }
      geo.setAttribute("color", new BufferAttribute(col, 3));
      geo.translate(-CX, -CY, -DEPTH / 2);
      disposables.push(geo);
      const mesh = new Mesh(geo, material);
      art.add(mesh);
      return mesh;
    });

    scene.add(new AmbientLight(0xffffff, 0.75));
    const key = new DirectionalLight(0xffffff, 1.5);
    key.position.set(2, 3, 7);
    scene.add(key);
    const rim = new DirectionalLight(0xb48cff, 1.2);
    rim.position.set(-6, -3, -2);
    scene.add(rim);

    // 0 = apart (upper piece to the left, lower to the right), 1 = locked together
    const assemble = (p: number) => {
      const off = (1 - p) * 520;
      pieces[0].position.x = -off;
      pieces[1].position.x = off;
      pieces[0].rotation.y = (1 - p) * -0.5;
      pieces[1].rotation.y = (1 - p) * 0.5;
      pieces.forEach((m) => (m.visible = p > 0.001));
    };

    let raf = 0;
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

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
    let visible = true;
    let t0 = -1;

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      if (t0 < 0) t0 = now;
      const t = (now - t0) / 1000;
      assemble(easeOut(Math.min(1, t / 1.3)));
      cur.x += (tgt.x - cur.x) * 0.06;
      cur.y += (tgt.y - cur.y) * 0.06;
      const scroll = Math.min(1, window.scrollY / window.innerHeight);
      group.rotation.y = Math.sin(t * 0.45) * 0.22 + cur.y + scroll * ((25 * Math.PI) / 180);
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
      assemble(1);
      group.rotation.y = 0.12;
      renderer.render(scene, camera);
    } else {
      assemble(0);
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
