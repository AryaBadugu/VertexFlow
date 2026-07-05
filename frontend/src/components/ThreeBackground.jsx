import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';

export default function ThreeBackground({ onReady }) {
  const canvasRef = useRef(null);
  const starsRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !starsRef.current) return;

    // ----- STARFIELD (Canvas 2D) -----
    const sc = starsRef.current;
    const sx = sc.getContext('2d');
    const PAL2 = [[155,77,255],[255,0,170],[77,200,255],[200,151,58]];
    let ST = [];
    
    function iS() {
      sc.width = window.innerWidth;
      sc.height = window.innerHeight;
      ST = Array.from({ length: 240 }, () => {
        const c = PAL2[Math.floor(Math.random() * 4)];
        return {
          x: Math.random() * sc.width,
          y: Math.random() * sc.height,
          r: Math.random() * 1.1 + .1,
          o: Math.random() * .4 + .05,
          ph: Math.random() * Math.PI * 2,
          sp: .003 + Math.random() * .008,
          col: c
        };
      });
    }
    
    let ft2 = 0;
    let starsReq;
    function dS(t) {
      const dt = (t - ft2) / 16;
      ft2 = t;
      sx.clearRect(0, 0, sc.width, sc.height);
      ST.forEach(s => {
        s.ph += s.sp * dt;
        const o = s.o * (.6 + .4 * Math.sin(s.ph));
        sx.beginPath();
        sx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        sx.fillStyle = `rgba(${s.col[0]},${s.col[1]},${s.col[2]},${o})`;
        sx.fill();
      });
      starsReq = requestAnimationFrame(dS);
    }
    iS();
    starsReq = requestAnimationFrame(dS);

    // ----- THREE.JS SCENE -----
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x04020A);
    scene.fog = new THREE.FogExp2(0x04020A, 0.02);

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    const group = new THREE.Group();
    scene.add(group);

    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x02010A, metalness: 0.97, roughness: 0.03,
      clearcoat: 1, clearcoatRoughness: 0.03,
      emissive: 0x7B2DBF, emissiveIntensity: 0.07
    });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.9, 10), coreMat);
    group.add(core);

    const w1mat = new THREE.MeshBasicMaterial({ color: 0x9B4DFF, wireframe: true, transparent: true, opacity: 0.1 });
    const w1 = new THREE.Mesh(new THREE.IcosahedronGeometry(2.15, 2), w1mat);
    group.add(w1);

    const w2mat = new THREE.MeshBasicMaterial({ color: 0x1A5FFF, wireframe: true, transparent: true, opacity: 0.04 });
    const w2 = new THREE.Mesh(new THREE.IcosahedronGeometry(2.45, 1), w2mat);
    group.add(w2);

    const ringMat = new THREE.MeshBasicMaterial({ color: 0xC8973A, transparent: true, opacity: 0.32 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.004, 6, 80), ringMat);
    ring.rotation.x = Math.PI * 0.42;
    group.add(ring);

    const ring2mat = new THREE.MeshBasicMaterial({ color: 0x4DC8FF, transparent: true, opacity: 0.14 });
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.56, 0.003, 6, 80), ring2mat);
    ring2.rotation.x = Math.PI * 0.18; ring2.rotation.y = Math.PI * 0.3;
    group.add(ring2);

    const PAL = [[0.61, 0.3, 1], [1, 0, 0.67], [0.3, 0.78, 1], [0.78, 0.59, 0.23]];
    const pGeo = new THREE.BufferGeometry();
    const N = 300;
    const pp = new Float32Array(N * 3), pc = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pp[i * 3] = (Math.random() - .5) * 18; pp[i * 3 + 1] = (Math.random() - .5) * 18; pp[i * 3 + 2] = (Math.random() - .5) * 18;
      const c = PAL[Math.floor(Math.random() * 4)]; pc[i * 3] = c[0]; pc[i * 3 + 1] = c[1]; pc[i * 3 + 2] = c[2];
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pp, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pc, 3));
    const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: .032, vertexColors: true, transparent: true, opacity: .85, blending: THREE.AdditiveBlending }));
    scene.add(pMesh);

    const EX = 7000;
    const exGeo = new THREE.BufferGeometry();
    const ei = new Float32Array(EX * 3), et = new Float32Array(EX * 3), ec = new Float32Array(EX * 3), cp = new Float32Array(EX * 3);
    for (let i = 0; i < EX; i++) {
      const phi = Math.acos(-1 + (2 * i) / EX), th = Math.sqrt(EX * Math.PI) * phi, r = 1.9;
      const x = r * Math.cos(th) * Math.sin(phi), y = r * Math.sin(th) * Math.sin(phi), z = r * Math.cos(phi);
      ei[i * 3] = cp[i * 3] = x; ei[i * 3 + 1] = cp[i * 3 + 1] = y; ei[i * 3 + 2] = cp[i * 3 + 2] = z;
      const d = new THREE.Vector3(x, y, z).normalize(), dist = 2 + Math.random() * 7.5;
      et[i * 3] = d.x * dist; et[i * 3 + 1] = d.y * dist; et[i * 3 + 2] = d.z * dist;
      const c = PAL[Math.floor(Math.random() * 4)]; ec[i * 3] = c[0]; ec[i * 3 + 1] = c[1]; ec[i * 3 + 2] = c[2];
    }
    exGeo.setAttribute('position', new THREE.BufferAttribute(cp, 3));
    exGeo.setAttribute('color', new THREE.BufferAttribute(ec, 3));
    const exMat = new THREE.PointsMaterial({ size: .044, vertexColors: true, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const exSys = new THREE.Points(exGeo, exMat);
    exSys.visible = false;
    group.add(exSys);

    scene.add(new THREE.AmbientLight(0xffffff, .05));
    const L1 = new THREE.PointLight(0x9B4DFF, 520); L1.position.set(4, 2, 4); scene.add(L1);
    const L2 = new THREE.PointLight(0xFF00AA, 360); L2.position.set(-4, -2, 2); scene.add(L2);
    const L3 = new THREE.PointLight(0x1A5FFF, 180); L3.position.set(0, 4, -4); scene.add(L3);

    const comp = new EffectComposer(renderer);
    comp.addPass(new RenderPass(scene, camera));
    const bl = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, .4, .85);
    bl.strength = 1.45; bl.radius = .55; bl.threshold = .08;
    comp.addPass(bl);

    let mx = 0, my = 0, hov = false, anim = false;
    const as = { p: 0 };
    const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();

    function updEx() {
      const pos = exGeo.attributes.position.array;
      for (let i = 0; i < EX; i++) {
        const ix = i * 3, iy = ix + 1, iz = ix + 2;
        pos[ix] = ei[ix] + (et[ix] - ei[ix]) * as.p; pos[iy] = ei[iy] + (et[iy] - ei[iy]) * as.p; pos[iz] = ei[iz] + (et[iz] - ei[iz]) * as.p;
        if (as.p > .01) { const a = as.p * .75, cx = pos[ix], cz = pos[iz]; pos[ix] = cx * Math.cos(a) - cz * Math.sin(a); pos[iz] = cx * Math.sin(a) + cz * Math.cos(a); }
      }
      exGeo.attributes.position.needsUpdate = true;
    }

    const onMouseMove = (e) => {
      mx = e.clientX - window.innerWidth / 2;
      my = e.clientY - window.innerHeight / 2;
      ptr.x = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.y = -(e.clientY / window.innerHeight) * 2 + 1;
      ray.setFromCamera(ptr, camera);
      if (ray.intersectObject(core).length) {
        if (!hov) {
          gsap.to(w1.scale, { x: 1.12, y: 1.12, z: 1.12, duration: .5 });
          gsap.to(coreMat, { emissiveIntensity: .22, duration: .3 });
          hov = true;
        }
      } else {
        if (hov) {
          gsap.to(w1.scale, { x: 1, y: 1, z: 1, duration: .5 });
          gsap.to(coreMat, { emissiveIntensity: .07, duration: .3 });
          hov = false;
        }
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    const onClick = () => {
      if (hov && !anim) {
        anim = true;
        gsap.to([coreMat, w1mat, w2mat, ringMat, ring2mat], { opacity: 0, duration: .2, onComplete: () => { core.visible = w1.visible = w2.visible = ring.visible = ring2.visible = false; } });
        exSys.visible = true; gsap.to(exMat, { opacity: 1, duration: .1 });
        gsap.to(as, { p: 1, duration: 1.9, ease: 'power4.out', onUpdate: updEx, onComplete: () => {
          gsap.to(as, { p: 0, duration: 2.5, delay: .2, ease: 'elastic.out(1,.5)', onUpdate: updEx, onComplete: () => {
            core.visible = w1.visible = w2.visible = ring.visible = ring2.visible = true;
            gsap.to(exMat, { opacity: 0, duration: .3 });
            gsap.to([coreMat, w1mat, w2mat, ringMat, ring2mat], { opacity: 1, duration: .5 });
            w1mat.opacity = .1; w2mat.opacity = .04; ringMat.opacity = .32; ring2mat.opacity = .14;
            exSys.visible = false; anim = false;
          } });
        } });
      }
    };
    window.addEventListener('click', onClick);

    const clk = new THREE.Clock();
    let webglReq;
    function tick() {
      const t = clk.getElapsedTime();
      group.rotation.y += .0012; group.rotation.x += .0006;
      group.rotation.y += .032 * (mx * .001 - group.rotation.y) * .1;
      group.rotation.x += .032 * (my * .001 - group.rotation.x) * .1;
      if (!anim) {
        const s = 1 + Math.sin(t * 1.5) * .013; w1.scale.set(s, s, s);
        const s2 = 1 + Math.cos(t * 1.05) * .02; w2.scale.set(s2, s2, s2);
        ring.rotation.z += .003; ring2.rotation.y += .005;
      }
      L1.position.set(Math.sin(t * .55) * 5, Math.cos(t * .4) * 4, 3);
      L2.position.set(Math.cos(t * .28) * 6, Math.sin(t * .35) * 3, Math.sin(t * .5) * 4);
      L3.position.set(Math.sin(t * .3 + 1) * 4, Math.cos(t * .45) * 3, -3);
      pMesh.rotation.y = t * .033; pMesh.rotation.x = -my * .00011;
      comp.render();
      webglReq = requestAnimationFrame(tick);
    }
    tick();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      comp.setSize(window.innerWidth, window.innerHeight);
      iS();
    };
    window.addEventListener('resize', onResize);

    // Call onReady with the elements we want to animate in GSAP timeline
    if (onReady) {
      onReady({
        coreScale: core.scale,
        w1Scale: w1.scale,
        w2Scale: w2.scale
      });
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(starsReq);
      cancelAnimationFrame(webglReq);
      renderer.dispose();
      comp.dispose();
    };
  }, []);

  return (
    <>
      <canvas id="webgl-canvas" ref={canvasRef}></canvas>
      <canvas id="stars" ref={starsRef}></canvas>
    </>
  );
}
