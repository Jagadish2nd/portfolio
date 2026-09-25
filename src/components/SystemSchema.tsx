import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

/**
 * SystemSchema — interactive 3D network of obsidian nodes connected by
 * structural lines with a crimson "logic" pulse traveling along them.
 *
 * - Desktop: parallax follows cursor with damping.
 * - Mobile: tilt follows DeviceOrientation.
 * - Scroll: scene assembles from a loose cloud into a compact core.
 */

type NodeDef = {
  label: string;
  short: string;
  position: THREE.Vector3;
  loose: THREE.Vector3;
};

const NODE_DEFS: NodeDef[] = [
  { label: "Systems & Architecture", short: "SYS", position: new THREE.Vector3(0, 0, 0), loose: new THREE.Vector3(0, 0.4, 0) },
  { label: "Algorithms & Data", short: "ALG", position: new THREE.Vector3(2.6, 1.4, -0.6), loose: new THREE.Vector3(5.2, 3.4, -2.4) },
  { label: "Machine Learning", short: "ML", position: new THREE.Vector3(-2.4, 1.6, 0.8), loose: new THREE.Vector3(-5.4, 3.6, 2.6) },
  { label: "Distributed Networks", short: "NET", position: new THREE.Vector3(2.2, -1.6, 0.9), loose: new THREE.Vector3(4.8, -3.8, 3.2) },
  { label: "Security & Cryptography", short: "SEC", position: new THREE.Vector3(-2.6, -1.4, -0.7), loose: new THREE.Vector3(-5.2, -3.6, -2.8) },
];

const EDGES: Array<[number, number]> = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [1, 2], [2, 4], [4, 3], [3, 1],
];

export function SystemSchema() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    scene.fog = new THREE.Fog(0x121212, 12, 28);

    const camera = new THREE.PerspectiveCamera(35, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mount.appendChild(renderer.domElement);

    // Lighting — cold industrial with rim highlights
    scene.add(new THREE.AmbientLight(0x1a1a1a, 1.2));
    const keyLight = new THREE.DirectionalLight(0xbfd4ff, 0.9);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xff2a2a, 0.5);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);
    const fillLight = new THREE.PointLight(0xffffff, 0.4, 30);
    fillLight.position.set(0, 0, 8);
    scene.add(fillLight);

    // World group — everything we tilt/parallax
    const world = new THREE.Group();
    scene.add(world);

    // Subtle 3D coordinate grid (XZ plane), faded
    const grid = new THREE.GridHelper(40, 40, 0x262626, 0x1c1c1c);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.35;
    grid.position.y = -4.5;
    world.add(grid);
    const gridV = new THREE.GridHelper(40, 40, 0x262626, 0x1c1c1c);
    (gridV.material as THREE.Material).transparent = true;
    (gridV.material as THREE.Material).opacity = 0.18;
    gridV.rotation.x = Math.PI / 2;
    gridV.position.z = -8;
    world.add(gridV);

    // Nodes — matte obsidian spheres
    const nodeGeometry = new THREE.IcosahedronGeometry(0.55, 3);
    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.7,
      metalness: 0.4,
      envMapIntensity: 0.6,
    });

    const nodeMeshes: THREE.Mesh[] = [];
    const nodeGlows: THREE.Mesh[] = [];
    const nodeGroup = new THREE.Group();
    world.add(nodeGroup);

    NODE_DEFS.forEach((def) => {
      const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
      // Start in "loose data cloud" position
      mesh.position.copy(def.loose);
      mesh.userData.target = def.position.clone();
      mesh.userData.loose = def.loose.clone();
      mesh.userData.label = def.label;
      mesh.userData.short = def.short;
      nodeGroup.add(mesh);
      nodeMeshes.push(mesh);

      // Bloom proxy — additive red sphere that scales on hover
      const glowGeo = new THREE.SphereGeometry(0.62, 24, 24);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.copy(mesh.position);
      nodeGroup.add(glow);
      nodeGlows.push(glow);

      // Wireframe shell — gives "architectural" rim highlight
      const shell = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.58, 1),
        new THREE.MeshBasicMaterial({
          color: 0x262626,
          wireframe: true,
          transparent: true,
          opacity: 0.6,
        })
      );
      mesh.add(shell);
    });

    // Structural connection lines — dark grey
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x262626,
      transparent: true,
      opacity: 0.85,
    });
    const edgeLines: THREE.Line[] = [];
    EDGES.forEach(([a, b]) => {
      const geo = new THREE.BufferGeometry().setFromPoints([
        nodeMeshes[a].position.clone(),
        nodeMeshes[b].position.clone(),
      ]);
      const line = new THREE.Line(geo, lineMaterial);
      line.userData.a = a;
      line.userData.b = b;
      world.add(line);
      edgeLines.push(line);
    });

    // Crimson energy pulses — small emissive spheres traveling along edges
    const pulses = EDGES.map(([a, b], i) => {
      const geo = new THREE.SphereGeometry(0.085, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const m = new THREE.Mesh(geo, mat);
      // Halo
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 16, 16),
        new THREE.MeshBasicMaterial({
          color: 0xff0000,
          transparent: true,
          opacity: 0.25,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      m.add(halo);
      world.add(m);
      return { mesh: m, a, b, t: (i / EDGES.length) % 1 };
    });

    // Background drifting particle field (data dust)
    const dustCount = 220;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3 + 0] = (Math.random() - 0.5) * 30;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 4;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: 0x444444,
        size: 0.025,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
      })
    );
    world.add(dust);

    // Interaction state
    const pointer = new THREE.Vector2(-10, -10);
    const targetTilt = { x: 0, y: 0 };
    const currentTilt = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    let hoveredIndex = -1;

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      pointer.set(x, y);
      targetTilt.y = x * 0.35;
      targetTilt.x = -y * 0.2;
    };
    renderer.domElement.addEventListener("pointermove", onPointerMove);

    // Mobile tilt
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      targetTilt.y = THREE.MathUtils.degToRad(Math.max(-30, Math.min(30, e.gamma))) * 0.6;
      targetTilt.x = THREE.MathUtils.degToRad(Math.max(-30, Math.min(30, e.beta - 30))) * 0.4;
    };
    window.addEventListener("deviceorientation", onOrientation);

    // Assembly state — driven by scroll
    const state = { assembly: 0 }; // 0 = loose cloud, 1 = compact core
    const updateScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const t = Math.min(1, window.scrollY / (max * 0.35));
      gsap.to(state, { assembly: t, duration: 0.8, ease: "power2.out", overwrite: true });
    };
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    // Resize
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // Intro — initial "Mapping Nodes" reveal
    nodeGroup.scale.setScalar(0.001);
    gsap.to(nodeGroup.scale, { x: 1, y: 1, z: 1, duration: 1.6, ease: "power3.out", delay: 0.2 });

    // Animation loop
    const clock = new THREE.Clock();
    let raf = 0;
    const tmp = new THREE.Vector3();

    const tick = () => {
      const dt = clock.getDelta();
      const t = clock.elapsedTime;

      // Smoothly interpolate node positions between loose & compact
      nodeMeshes.forEach((mesh, i) => {
        tmp.copy(mesh.userData.loose).lerp(mesh.userData.target, state.assembly);
        // Add gentle floating sway when loose
        const sway = (1 - state.assembly) * 0.15;
        tmp.x += Math.sin(t * 0.6 + i) * sway;
        tmp.y += Math.cos(t * 0.5 + i * 1.3) * sway;
        mesh.position.lerp(tmp, 0.15);
        nodeGlows[i].position.copy(mesh.position);
        mesh.rotation.y += dt * 0.15;
        mesh.rotation.x += dt * 0.05;
      });

      // Rebuild edge geometry from current node positions
      edgeLines.forEach((line) => {
        const a = nodeMeshes[line.userData.a].position;
        const b = nodeMeshes[line.userData.b].position;
        const positions = (line.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
        positions[0] = a.x; positions[1] = a.y; positions[2] = a.z;
        positions[3] = b.x; positions[4] = b.y; positions[5] = b.z;
        line.geometry.attributes.position.needsUpdate = true;
      });

      // Heartbeat pulse — two beats per cycle
      const beat = (Math.sin(t * 4.5) * 0.5 + 0.5) ** 4 + (Math.sin(t * 4.5 + 1.0) * 0.5 + 0.5) ** 6;
      const pulseSpeed = 0.35 + beat * 0.25;

      pulses.forEach((p) => {
        p.t += dt * pulseSpeed * 0.6;
        if (p.t > 1) p.t -= 1;
        const a = nodeMeshes[p.a].position;
        const b = nodeMeshes[p.b].position;
        p.mesh.position.lerpVectors(a, b, p.t);
        const mat = p.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.55 + beat * 0.4;
        const haloMat = (p.mesh.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial;
        haloMat.opacity = 0.18 + beat * 0.3;
      });

      // Raycast for hover
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(nodeMeshes, false);
      const newHover = hits.length > 0 ? nodeMeshes.indexOf(hits[0].object as THREE.Mesh) : -1;
      if (newHover !== hoveredIndex) {
        hoveredIndex = newHover;
        renderer.domElement.style.cursor = newHover >= 0 ? "pointer" : "default";
      }

      // Apply scale + bloom on hover
      nodeMeshes.forEach((mesh, i) => {
        const target = i === hoveredIndex ? 1.55 : 1.0;
        const s = THREE.MathUtils.lerp(mesh.scale.x, target, 0.15);
        mesh.scale.setScalar(s);
        const glowMat = nodeGlows[i].material as THREE.MeshBasicMaterial;
        const glowTarget = i === hoveredIndex ? 0.55 : 0.0;
        glowMat.opacity = THREE.MathUtils.lerp(glowMat.opacity, glowTarget, 0.12);
        nodeGlows[i].scale.setScalar(s * 1.15);
      });

      // Parallax / tilt
      currentTilt.x += (targetTilt.x - currentTilt.x) * 0.05;
      currentTilt.y += (targetTilt.y - currentTilt.y) * 0.05;
      world.rotation.x = currentTilt.x;
      world.rotation.y = currentTilt.y;

      // Camera dolly with scroll (subtle depth)
      camera.position.z = 11 - state.assembly * 1.8;

      // Drift dust
      dust.rotation.y += dt * 0.01;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("deviceorientation", onOrientation);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose?.();
        const mat = (obj as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose?.();
      });
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}