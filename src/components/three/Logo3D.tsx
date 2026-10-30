"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MARK_PATHS } from "@/components/brand/SynclinaMark";
import { onIntroDone } from "@/lib/scroll";

/* Brand gradient, applied as vertex colours along the same diagonal as the 2D logo */
const STOPS = [new THREE.Color("#4A12FF"), new THREE.Color("#7C22FF"), new THREE.Color("#C42BFF")];
const G_FROM = new THREE.Vector2(380, 860);
const G_TO = new THREE.Vector2(930, 360);
const CENTER = new THREE.Vector2(641, 606); // centre of the mark in SVG units
const SCALE = 1 / 150; // SVG units → world units (mark ≈ 4 units wide)

function gradientAt(x: number, y: number, out: THREE.Color) {
  const d = G_TO.clone().sub(G_FROM);
  const t = THREE.MathUtils.clamp(new THREE.Vector2(x, y).sub(G_FROM).dot(d) / d.lengthSq(), 0, 1);
  return t < 0.55 ? out.lerpColors(STOPS[0], STOPS[1], t / 0.55) : out.lerpColors(STOPS[1], STOPS[2], (t - 0.55) / 0.45);
}

function buildPiece(d: string) {
  const data = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`);
  const shapes = data.paths.flatMap((p) => p.toShapes());
  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: 64,
    bevelEnabled: true,
    bevelThickness: 10,
    bevelSize: 7,
    bevelSegments: 5,
    curveSegments: 40,
  });
  // Colour by SVG position before flipping into world space
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    gradientAt(pos.getX(i), pos.getY(i), c).toArray(colors, i * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.translate(-CENTER.x, -CENTER.y, -32);
  geo.scale(SCALE, -SCALE, SCALE); // SVG is y-down
  geo.computeVertexNormals();
  return geo;
}

/** Image-based lighting so the glossy surfaces have something to reflect. */
function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Orbiters() {
  const ring = useRef<THREE.Mesh>(null);
  const spheres = useRef<THREE.Group>(null);
  const shapes = useRef<THREE.Group>(null);

  const sparkles = useMemo(() => {
    const n = 220;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 2.6 + Math.random() * 2.4;
      const a = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 4;
      arr.set([Math.cos(a) * r, y, Math.sin(a) * r - 1], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (ring.current) {
      ring.current.rotation.z += delta * 0.25;
    }
    if (spheres.current) spheres.current.rotation.y += delta * 0.35;
    if (shapes.current) {
      shapes.current.children.forEach((m, i) => {
        m.rotation.x += delta * (0.2 + i * 0.1);
        m.rotation.y += delta * 0.25;
        m.position.y = (i ? -1.4 : 1.6) + Math.sin(t * 0.8 + i * 2) * 0.15;
      });
    }
  });

  return (
    <>
      {/* Thin orbit ring */}
      <group rotation={[1.15, 0.2, 0]}>
        <mesh ref={ring}>
          <torusGeometry args={[2.75, 0.018, 16, 160]} />
          <meshStandardMaterial color="#c4b5fd" emissive="#7c22ff" emissiveIntensity={1.2} metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* Glossy spheres travelling on the ring's plane */}
      <group rotation={[1.15, 0.2, 0]}>
        <group ref={spheres}>
          {[0, 2.1, 4.2].map((a, i) => (
            <mesh key={i} position={[Math.cos(a) * 2.75, Math.sin(a) * 2.75, 0]}>
              <sphereGeometry args={[0.09 + i * 0.03, 32, 32]} />
              <meshPhysicalMaterial color={["#a855f7", "#d946ef", "#6d28d9"][i]} metalness={0.2} roughness={0.15} clearcoat={1} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Floating wireframe solids */}
      <group ref={shapes}>
        <mesh position={[-3.1, 1.6, -1.2]}>
          <icosahedronGeometry args={[0.38, 0]} />
          <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.55} />
        </mesh>
        <mesh position={[2.85, -1.4, -0.8]}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshBasicMaterial color="#d946ef" wireframe transparent opacity={0.55} />
        </mesh>
      </group>

      <points geometry={sparkles}>
        <pointsMaterial color="#c084fc" size={0.025} sizeAttenuation transparent opacity={0.8} depthWrite={false} />
      </points>
    </>
  );
}

export default function Logo3D() {
  const group = useRef<THREE.Group>(null);
  const upper = useRef<THREE.Mesh>(null);
  const lower = useRef<THREE.Mesh>(null);
  const assembled = useRef(0); // 0 → 1 as the two strokes slide into sync
  const started = useRef(false);

  const { upperGeo, lowerGeo, material } = useMemo(
    () => ({
      upperGeo: buildPiece(MARK_PATHS.upper),
      lowerGeo: buildPiece(MARK_PATHS.lower),
      material: new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        metalness: 0.1,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        envMapIntensity: 0.5,
        emissive: new THREE.Color("#2a0a7a"),
        emissiveIntensity: 0.12,
        transparent: true,
      }),
    }),
    [],
  );

  useEffect(() => onIntroDone(() => (started.current = true)), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (started.current) assembled.current = Math.min(1, assembled.current + delta * 0.9);
    const e = 1 - Math.pow(1 - assembled.current, 4); // ease-out

    if (upper.current && lower.current) {
      upper.current.position.x = (1 - e) * -3.2;
      lower.current.position.x = (1 - e) * 3.2;
      upper.current.position.z = lower.current.position.z = (1 - e) * -1.5;
    }
    material.opacity = e;

    const g = group.current;
    if (g) {
      // Gentle sway + a light lean toward the pointer
      const targetY = Math.sin(t * 0.45) * 0.35 + state.pointer.x * 0.3;
      const targetX = -state.pointer.y * 0.18;
      g.rotation.y += (targetY - g.rotation.y) * 0.06;
      g.rotation.x += (targetX - g.rotation.x) * 0.06;
      g.position.y = Math.sin(t * 0.9) * 0.08;
    }
  });

  return (
    <>
      <Environment />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <pointLight position={[-4, -2, 3]} intensity={18} color="#7c22ff" />
      <pointLight position={[4, 2, 2]} intensity={12} color="#d946ef" />

      <group ref={group}>
        <mesh ref={upper} geometry={upperGeo} material={material} />
        <mesh ref={lower} geometry={lowerGeo} material={material} />
      </group>
      <Orbiters />
    </>
  );
}
