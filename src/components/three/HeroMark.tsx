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
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PointLight,
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
const DEPTH = 120; // deep enough that the sides read as solid when it tilts
const SCALE = 1 / 132;

/* The brand gradient runs from (380,860) to (930,360) */
const STOPS = [new Color("#4A12FF"), new Color("#7C22FF"), new Color("#C42BFF")];
const gradientAt = (x: number, y: number, out: Color) => {
  const t = Math.min(1, Math.max(0, ((x - 380) * 550 + (y - 860) * -500) / 552500));
  return t < 0.55 ? out.copy(STOPS[0]).lerp(STOPS[1], t / 0.55) : out.copy(STOPS[1]).lerp(STOPS[2], (t - 0.55) / 0.45);
};

/**
 * The Synclina "S" in 3D: the two official pieces, extruded deep with rounded, lacquered
 * edges, so the silhouette is exactly the logo. Once the intro doors part, the pieces slide
 * in from opposite sides and lock together. Then a slow sway and float, and it leans toward:
 *  - the pointer on desktop (up to ~14°),
 *  - the phone's tilt via the gyroscope where the browser allows it without a prompt
 *    (Android Chrome and most others; iOS Safari gates motion behind a permission dialog,
 *    so we never ask and fall back to dragging the mark),
 *  - a finger dragging across the mark, on any touch screen.
 * A 25° turn / 0.8 scale as the hero scrolls away.
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

    const material = new MeshPhysicalMaterial({
      vertexColors: true,
      metalness: 0.25,
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
    });
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
        bevelThickness: 9,
        bevelSize: 6,
        bevelOffset: -6, // bevel inside the outline, so the silhouette stays exact
        bevelSegments: small ? 4 : 6, // rounded edges that catch the light
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
    // A glint that drifts across the face, so the depth and bevels read even when still
    const glint = new PointLight(0xe6d4ff, 26, 30, 1.6);
    glint.position.set(3, 2, 5);
    scene.add(glint);

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
    const deg = Math.PI / 180;
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
    const cleanups: (() => void)[] = [];

    // Desktop: lean toward the pointer
    const POINTER_MAX = 14 * deg;
    if (finePointer() && !reduce && !small) {
      const onPointer = (e: PointerEvent) => {
        tgt.y = (e.clientX / window.innerWidth - 0.5) * 2 * POINTER_MAX;
        tgt.x = (e.clientY / window.innerHeight - 0.5) * POINTER_MAX;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });
      cleanups.push(() => window.removeEventListener("pointermove", onPointer));
    }

    // Phones: follow the gyroscope. No permission prompt, ever: where the browser requires
    // one (iOS 13+), events simply never arrive and the drag below takes over.
    const TILT_MAX = 28 * deg;
    let gyro = false;
    let dragging = false;
    if (!reduce && !finePointer() && "DeviceOrientationEvent" in window) {
      let base: { b: number; g: number } | null = null;
      const onTilt = (e: DeviceOrientationEvent) => {
        if (e.beta == null || e.gamma == null || dragging) return;
        // Map to the screen's axes when the phone is turned sideways
        const angle = (screen.orientation?.angle ?? 0) % 360;
        let fb = e.beta;
        let lr = e.gamma;
        if (angle === 90) [fb, lr] = [-e.gamma, e.beta];
        else if (angle === 270 || angle === -90) [fb, lr] = [e.gamma, -e.beta];
        // However the phone is first held is "neutral"; neutral drifts slowly so it re-centres
        if (!base) base = { b: fb, g: lr };
        base.b += (fb - base.b) * 0.004;
        base.g += (lr - base.g) * 0.004;
        gyro = true;
        tgt.x = clamp((fb - base.b) * deg * 0.9, TILT_MAX);
        tgt.y = clamp((lr - base.g) * deg * 1.1, TILT_MAX);
      };
      window.addEventListener("deviceorientation", onTilt, { passive: true });
      cleanups.push(() => window.removeEventListener("deviceorientation", onTilt));
    }

    // Any touch screen: drag across the mark to turn it (vertical swipes still scroll the page)
    if (!reduce) {
      el.style.touchAction = "pan-y";
      let sx = 0;
      let sy = 0;
      let bx = 0;
      let by = 0;
      const down = (e: PointerEvent) => {
        if (e.pointerType === "mouse") return;
        dragging = true;
        [sx, sy, bx, by] = [e.clientX, e.clientY, tgt.x, tgt.y];
      };
      const move = (e: PointerEvent) => {
        if (!dragging) return;
        tgt.y = clamp(by + ((e.clientX - sx) / el.clientWidth) * 1.6, 0.9);
        tgt.x = clamp(bx + ((e.clientY - sy) / el.clientHeight) * 0.6, TILT_MAX);
      };
      const up = () => {
        if (!dragging) return;
        dragging = false;
        if (!gyro) [tgt.x, tgt.y] = [0, 0]; // spring back
      };
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointermove", move, { passive: true });
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      el.addEventListener("pointerleave", up);
      cleanups.push(() => {
        el.removeEventListener("pointerdown", down);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
        el.removeEventListener("pointerleave", up);
      });
    }

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
    let visible = true;
    let t0 = -1;

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      if (t0 < 0) t0 = now;
      const t = (now - t0) / 1000;
      assemble(easeOut(Math.min(1, t / 1.3)));
      const k = dragging ? 0.18 : 0.08;
      cur.x += (tgt.x - cur.x) * k;
      cur.y += (tgt.y - cur.y) * k;
      const scroll = Math.min(1, window.scrollY / window.innerHeight);
      // Sway less while the visitor is steering it, so their input feels direct
      const sway = dragging || gyro ? 0.12 : 0.3;
      group.rotation.y = Math.sin(t * 0.45) * sway + cur.y + scroll * (25 * deg);
      group.rotation.x = cur.x + Math.sin(t * 0.3) * 0.07;
      group.rotation.z = -cur.y * 0.08;
      // Shift with the lean, so it parallaxes against the page rather than spinning in place
      group.position.x = -cur.y * 0.5;
      group.position.y = Math.sin(t * 0.8) * 0.08 + cur.x * 0.4;
      group.scale.setScalar(1 - 0.2 * scroll);
      glint.position.x = 3 * Math.cos(t * 0.5) - cur.y * 4;
      glint.position.y = 2 * Math.sin(t * 0.37) + cur.x * 4;
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
      cleanups.forEach((c) => c());
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReady, onFail]);

  return <div ref={host} style={{ position: "absolute", inset: 0 }} />;
}
