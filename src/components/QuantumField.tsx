import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * QuantumField — interactive background.
 *
 * A deep-space wave lattice of points that reacts to the pointer with a
 * travelling ripple, plus a slow-drifting constellation of nodes and
 * structural lines. Crimson core palette with violet / cyan depth accents.
 */

const VERT = /* glsl */ `
  uniform float uTime;
  uniform vec2  uPointer;     // world-space x/z of pointer
  uniform float uEnergy;      // 0..1 click / activity energy
  uniform float uDpr;
  uniform float uScroll;

  attribute float aRand;

  varying float vIntensity;
  varying float vRand;

  void main() {
    vec3 pos = position;

    float t = uTime;
    float wave =
      sin(pos.x * 0.22 + t * 0.55) * 0.9 +
      cos(pos.z * 0.19 - t * 0.42) * 0.9 +
      sin((pos.x + pos.z) * 0.11 + t * 0.30) * 0.6;

    float d = distance(pos.xz, uPointer);
    float ripple = exp(-d * d * 0.0065) * (2.6 + uEnergy * 4.0)
                 * sin(d * 0.42 - t * 2.6);

    pos.y += wave * 0.7 + ripple;
    pos.y += aRand * 0.35;
    pos.y -= uScroll * 2.0;

    float proximity = exp(-d * d * 0.004);
    vIntensity = clamp(proximity * 1.25 + abs(pos.y) * 0.10 + uEnergy * 0.25, 0.0, 1.0);
    vRand = aRand;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (1.1 + vIntensity * 4.6 + aRand * 0.8) * uDpr * (150.0 / max(-mv.z, 0.001));
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform vec3 uColorBase;
  uniform vec3 uColorHot;
  uniform vec3 uColorCool;

  varying float vIntensity;
  varying float vRand;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    if (r > 0.5) discard;

    float core = smoothstep(0.5, 0.0, r);
    vec3 cool = mix(uColorBase, uColorCool, vRand);
    vec3 col  = mix(cool, uColorHot, pow(vIntensity, 1.4));

    float alpha = core * (0.16 + vIntensity * 0.9);
    gl_FragColor = vec4(col, alpha);
  }
`;

export function QuantumField() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08080b, 0.026);

    const camera = new THREE.PerspectiveCamera(
      38,
      mount.clientWidth / mount.clientHeight,
      0.1,
      300,
    );
    camera.position.set(0, 9, 34);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !isCoarse, alpha: true });
    } catch {
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, isCoarse ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);

    /* ---------------- point lattice ---------------- */
    const COLS = isCoarse ? 90 : 150;
    const ROWS = isCoarse ? 60 : 96;
    const SPREAD_X = 150;
    const SPREAD_Z = 110;

    const count = COLS * ROWS;
    const positions = new Float32Array(count * 3);
    const rands = new Float32Array(count);
    let i = 0;
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        positions[i * 3] = (c / (COLS - 1) - 0.5) * SPREAD_X;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (r / (ROWS - 1) - 0.5) * SPREAD_Z;
        rands[i] = Math.random();
        i++;
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("aRand", new THREE.BufferAttribute(rands, 1));

    const uniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uEnergy: { value: 0 },
      uDpr: { value: dpr },
      uScroll: { value: 0 },
      uColorBase: { value: new THREE.Color(0x2a2233) },
      uColorHot: { value: new THREE.Color(0xff2b3d) },
      uColorCool: { value: new THREE.Color(0x4de3ff) },
    };

    const points = new THREE.Points(
      geom,
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    world.add(points);

    /* ---------------- constellation ---------------- */
    const NODE_POS = [
      new THREE.Vector3(0, 6, 2),
      new THREE.Vector3(11, 9.5, -6),
      new THREE.Vector3(-10.5, 10.5, -3),
      new THREE.Vector3(8.5, 3.5, 7),
      new THREE.Vector3(-9, 3, 6),
      new THREE.Vector3(1.5, 13, -9),
    ];
    const EDGES: Array<[number, number]> = [
      [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 5], [3, 1], [4, 2],
    ];

    const nodeGroup = new THREE.Group();
    world.add(nodeGroup);

    const nodeGeo = new THREE.IcosahedronGeometry(0.42, 2);
    const haloGeo = new THREE.IcosahedronGeometry(0.9, 2);
    const nodes: THREE.Mesh[] = [];
    const halos: THREE.Mesh[] = [];

    NODE_POS.forEach((p, idx) => {
      const mesh = new THREE.Mesh(
        nodeGeo,
        new THREE.MeshBasicMaterial({ color: idx % 3 === 0 ? 0xff2b3d : 0xd8d8e4 }),
      );
      mesh.position.copy(p);
      nodeGroup.add(mesh);
      nodes.push(mesh);

      const halo = new THREE.Mesh(
        haloGeo,
        new THREE.MeshBasicMaterial({
          color: idx % 3 === 0 ? 0xff2b3d : 0x7a5cff,
          transparent: true,
          opacity: 0.12,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      halo.position.copy(p);
      nodeGroup.add(halo);
      halos.push(halo);
    });

    const linePositions = new Float32Array(EDGES.length * 6);
    EDGES.forEach(([a, b], e) => {
      linePositions.set(
        [
          NODE_POS[a].x, NODE_POS[a].y, NODE_POS[a].z,
          NODE_POS[b].x, NODE_POS[b].y, NODE_POS[b].z,
        ],
        e * 6,
      );
    });
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({
        color: 0x6d6d8a,
        transparent: true,
        opacity: 0.28,
      }),
    );
    nodeGroup.add(lines);

    /* travelling pulse along edges */
    const pulseGeo = new THREE.SphereGeometry(0.16, 12, 12);
    const pulse = new THREE.Mesh(
      pulseGeo,
      new THREE.MeshBasicMaterial({ color: 0xff3546 }),
    );
    nodeGroup.add(pulse);

    /* ---------------- interaction ---------------- */
    const pointer = { x: 0, y: 0 };      // normalized -1..1
    const target = { x: 0, y: 0 };
    let energy = 0;
    let scrollN = 0;
    let scrollTargetN = 0;

    const onPointerMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onPointerDown = () => {
      energy = 1;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      target.x = (t.clientX / window.innerWidth) * 2 - 1;
      target.y = (t.clientY / window.innerHeight) * 2 - 1;
      energy = Math.max(energy, 0.45);
    };
    const onScrollSignal = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail;
      if (typeof detail === "number") scrollTargetN = detail;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("schema:scroll", onScrollSignal as EventListener);

    const onResize = () => {
      if (!mount.clientWidth || !mount.clientHeight) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    /* ---------------- loop ---------------- */
    const clock = new THREE.Clock();
    let raf = 0;
    let visible = true;
    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    const render = () => {
      raf = requestAnimationFrame(render);
      if (!visible) return;

      const t = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta(), 0.05);

      pointer.x += (target.x - pointer.x) * Math.min(1, dt * 4);
      pointer.y += (target.y - pointer.y) * Math.min(1, dt * 4);
      energy *= Math.exp(-2.4 * dt);
      scrollN += (scrollTargetN - scrollN) * Math.min(1, dt * 3);

      const idleX = reduced ? 0 : Math.sin(t * 0.18) * 0.25;
      const idleY = reduced ? 0 : Math.cos(t * 0.13) * 0.2;

      uniforms.uTime.value = reduced ? 0 : t;
      uniforms.uEnergy.value = energy;
      uniforms.uScroll.value = scrollN;
      uniforms.uPointer.value.set(
        (pointer.x + idleX) * 44,
        (pointer.y + idleY) * 26 + 6,
      );

      // camera parallax
      camera.position.x += ((pointer.x + idleX) * 5 - camera.position.x) * Math.min(1, dt * 2);
      camera.position.y += (9 - (pointer.y + idleY) * 3.4 - camera.position.y) * Math.min(1, dt * 2);
      camera.lookAt(0, 1.5 - scrollN * 1.5, 0);

      nodeGroup.rotation.y = Math.sin(t * 0.12) * 0.22 + pointer.x * 0.25;
      nodeGroup.rotation.x = -pointer.y * 0.12;
      nodeGroup.position.y = -scrollN * 3.5;

      nodes.forEach((n, idx) => {
        const s = 1 + Math.sin(t * 1.6 + idx) * 0.12 + energy * 0.5;
        n.scale.setScalar(s);
        halos[idx].scale.setScalar(1 + Math.sin(t * 1.1 + idx * 0.7) * 0.25 + energy);
        (halos[idx].material as THREE.MeshBasicMaterial).opacity =
          0.09 + 0.06 * Math.sin(t * 1.4 + idx) + energy * 0.15;
      });

      // pulse travels edge to edge
      const cycle = 1.9;
      const total = (t / cycle) % EDGES.length;
      const eIdx = Math.floor(total);
      const frac = total - eIdx;
      const [a, b] = EDGES[eIdx];
      pulse.position.lerpVectors(NODE_POS[a], NODE_POS[b], frac);
      pulse.scale.setScalar(0.8 + Math.sin(frac * Math.PI) * 0.9);

      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("schema:scroll", onScrollSignal as EventListener);
      renderer.dispose();
      geom.dispose();
      lineGeo.dispose();
      nodeGeo.dispose();
      haloGeo.dispose();
      pulseGeo.dispose();
      scene.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else m?.dispose();
      });
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden />;
}
