import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useConfigurator, TimeOfDay } from '../context/ConfiguratorContext';
import { PRODUCT_MAP, ProductCategory, PRODUCTS } from '../data/products';
import { THEMES } from '../data/themes';
import { WALL_FINISH_MAP, MetalFinish } from '../data/productVisuals3D';
import { 
  Sun, 
  Moon, 
  Sunset, 
  Sunrise, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  Check
} from 'lucide-react';

export const RoomScene3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const {
    roomShape,
    width,
    length,
    height,
    unit,
    selectedTheme,
    wallFinish,
    selections,
    selectedLayout,
    placedItems,
    removePlacedItem,
    restorePlacedItem,
    replacePlacedItem,
    timeOfDay,
    setTimeOfDay,
    spaceClashWarnings,
    activeBundleTab,
    photorealRenderUrl,
    setPhotorealRenderUrl,
    isGeneratingRender,
    generatePhotorealHeroRender
  } = useConfigurator();

  const [selectedFixtureId, setSelectedFixtureId] = useState<string | null>('vanity');
  const [replaceModalCategory, setReplaceModalCategory] = useState<ProductCategory | null>(null);

  // References to keep Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const coveLightRef = useRef<THREE.PointLight | null>(null);
  const mirrorLightRef = useRef<THREE.PointLight | null>(null);
  const fixturesGroupRef = useRef<THREE.Group | null>(null);

  // Convert entered room dimensions to meters
  const toMeters = (val: number, u: string) => {
    if (u === 'ft') return val * 0.3048;
    if (u === 'cm') return val / 100;
    return val;
  };

  const roomW = Math.max(1.8, Math.min(8.5, toMeters(width, unit)));
  const roomL = Math.max(1.8, Math.min(9.5, toMeters(length, unit)));
  const wallH = Math.max(2.1, Math.min(5.0, toMeters(height, unit)));

  // Initialize Three.js Isometric Dollhouse Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const widthPx = container.clientWidth || 800;
    const heightPx = container.clientHeight || 520;
    const aspect = widthPx / heightPx;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFAEFF1); // Band 1 warm neutral background
    sceneRef.current = scene;

    // 2. Orthographic Isometric Camera
    // High isometric angle: ~35.264° elevation, 45° azimuth
    const frustumSize = Math.max(roomW, roomL, wallH * 1.25) * 2.15;
    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      -50,
      100
    );

    // Standard Isometric Vector: equal components in X and Z, elevated in Y
    const isoDist = 18;
    const isoElev = isoDist * 0.8165; // tan(35.264 deg) * sqrt(2)
    camera.position.set(isoDist, isoElev, isoDist);
    camera.lookAt(0, wallH * 0.25, 0);
    cameraRef.current = camera;

    // 3. Renderer with soft shadow maps and clean tone mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(widthPx, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Constrained Orbit Controls (Architectural Model View)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minPolarAngle = Math.PI / 6; // ~30° (overhead)
    controls.maxPolarAngle = Math.PI / 2 - 0.08; // ~85° (never below floor)
    controls.minAzimuthAngle = -Math.PI / 4; // Constrained clean frontal angle
    controls.maxAzimuthAngle = Math.PI * 0.75;
    controls.target.set(0, wallH * 0.25, 0);
    controls.enableZoom = true;
    controls.minZoom = 0.55;
    controls.maxZoom = 2.4;
    controls.enablePan = false;
    controlsRef.current = controls;

    // 5. Studio Architectural Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFBF8, 0.92);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Soft Key Directional Light (Model Studio)
    const dirLight = new THREE.DirectionalLight(0xFFFAF2, 1.4);
    dirLight.position.set(10, 16, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 40;
    const d = 7;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0004;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Fill Light from opposite side
    const fillLight = new THREE.DirectionalLight(0xE5EEF7, 0.5);
    fillLight.position.set(-8, 10, -6);
    scene.add(fillLight);

    // Warm cove / interior accent light
    const coveLight = new THREE.PointLight(0xFCE8C3, 1.0, 9);
    coveLight.position.set(0, wallH * 0.9, 0);
    scene.add(coveLight);
    coveLightRef.current = coveLight;

    // Mirror backlight
    const mirrorLight = new THREE.PointLight(0xFFF3D6, 0.8, 4);
    mirrorLight.position.set(0.5, 1.6, -roomL / 2 + 0.4);
    scene.add(mirrorLight);
    mirrorLightRef.current = mirrorLight;

    // 6. Group for dynamic fixture objects & dollhouse shell
    const fixturesGroup = new THREE.Group();
    scene.add(fixturesGroup);
    fixturesGroupRef.current = fixturesGroup;

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      const newAspect = newWidth / newHeight;
      const curFrustum = Math.max(roomW, roomL, wallH * 1.25) * 2.15;
      camera.left = (-curFrustum * newAspect) / 2;
      camera.right = (curFrustum * newAspect) / 2;
      camera.top = curFrustum / 2;
      camera.bottom = -curFrustum / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  // Update Time-of-Day Lighting Mood
  useEffect(() => {
    if (!sceneRef.current || !dirLightRef.current || !ambientLightRef.current || !coveLightRef.current || !mirrorLightRef.current) return;

    const dir = dirLightRef.current;
    const amb = ambientLightRef.current;
    const cove = coveLightRef.current;
    const mirror = mirrorLightRef.current;

    switch (timeOfDay) {
      case 'dawn':
        sceneRef.current.background = new THREE.Color(0xF5EBE6);
        amb.color.setHex(0xFFEADB);
        amb.intensity = 0.75;
        dir.color.setHex(0xFFD7BA);
        dir.intensity = 1.1;
        dir.position.set(12, 10, 6);
        cove.intensity = 0.5;
        mirror.intensity = 0.7;
        break;

      case 'midday':
        sceneRef.current.background = new THREE.Color(0xFAEFF1);
        amb.color.setHex(0xFFFFFF);
        amb.intensity = 0.95;
        dir.color.setHex(0xFFFAF2);
        dir.intensity = 1.4;
        dir.position.set(10, 16, 8);
        cove.intensity = 0.3;
        mirror.intensity = 0.5;
        break;

      case 'sunset':
        sceneRef.current.background = new THREE.Color(0xEDE0D4);
        amb.color.setHex(0xFCE4C8);
        amb.intensity = 0.7;
        dir.color.setHex(0xFFA86B);
        dir.intensity = 1.3;
        dir.position.set(14, 8, 4);
        cove.intensity = 1.1;
        mirror.intensity = 1.0;
        break;

      case 'night':
        sceneRef.current.background = new THREE.Color(0x23201E);
        amb.color.setHex(0x3B3734);
        amb.intensity = 0.45;
        dir.color.setHex(0x566070);
        dir.intensity = 0.5;
        dir.position.set(6, 12, 6);
        cove.intensity = 1.8;
        cove.color.setHex(0xF5BA6A);
        mirror.intensity = 1.6;
        mirror.color.setHex(0xFFD699);
        break;
    }
  }, [timeOfDay]);

  // Rebuild Dollhouse Room Geometry & Procedural Fixtures
  useEffect(() => {
    if (!sceneRef.current || !fixturesGroupRef.current) return;
    const fixturesGroup = fixturesGroupRef.current;

    // Clear existing children
    while (fixturesGroup.children.length > 0) {
      const obj = fixturesGroup.children[0];
      fixturesGroup.remove(obj);
    }

    // Dynamic camera frustum scaling to frame the exact room with height
    if (cameraRef.current && mountRef.current) {
      const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      const frustumSize = Math.max(roomW, roomL, wallH * 1.25) * 2.15;
      const camera = cameraRef.current;
      camera.left = (-frustumSize * aspect) / 2;
      camera.right = (frustumSize * aspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.lookAt(0, wallH * 0.25, 0);
      camera.updateProjectionMatrix();
    }

    // ==========================================
    // DATA-DRIVEN MATERIAL ENGINE
    // ==========================================
    const parseHex = (hexStr?: string, fallback: number = 0xCCCCCC): number => {
      if (!hexStr) return fallback;
      const clean = hexStr.replace('#', '');
      const parsed = parseInt(clean, 16);
      return isNaN(parsed) ? fallback : parsed;
    };

    // 1. Wall Surface Finish (from selectable wallFinish state)
    const activeWallOption = WALL_FINISH_MAP[wallFinish] || WALL_FINISH_MAP['warm-putty'];
    const wallMat = new THREE.MeshStandardMaterial({
      color: activeWallOption.colorInt,
      roughness: activeWallOption.roughness,
      metalness: 0.02
    });

    const wallTrimMat = new THREE.MeshStandardMaterial({
      color: activeWallOption.trimColorInt,
      roughness: 0.65,
      metalness: 0.1
    });

    // 2. Flooring Material (driven by selections.flooring)
    const flooringProd = selections.flooring !== 'none' ? PRODUCT_MAP[selections.flooring] : null;
    const floorColorInt = flooringProd?.visual3D 
      ? parseHex(flooringProd.visual3D.colorHex, 0xEFECE6)
      : 0xD8D4CE; // Neutral screed if omitted
    const floorRoughness = flooringProd?.visual3D?.roughness ?? 0.45;
    const floorMetalness = flooringProd?.visual3D?.metalness ?? 0.03;

    const floorMat = new THREE.MeshStandardMaterial({
      color: floorColorInt,
      roughness: floorRoughness,
      metalness: floorMetalness
    });

    // Floor Grid lines color
    const gridColorInt = flooringProd?.visual3D?.secondaryColorHex 
      ? parseHex(flooringProd.visual3D.secondaryColorHex, 0xC4BFB5)
      : 0xB5B0A6;

    // 3. Hardware Metal Finishes Helper
    const getMetalMaterial = (finish?: MetalFinish, customHex?: string): THREE.MeshStandardMaterial => {
      if (customHex) {
        return new THREE.MeshStandardMaterial({
          color: parseHex(customHex, 0x1A1A1A),
          roughness: 0.45,
          metalness: 0.65
        });
      }
      switch (finish) {
        case 'brass':
          return new THREE.MeshStandardMaterial({
            color: 0xAE8A4E,
            roughness: 0.22,
            metalness: 0.90
          });
        case 'chrome':
          return new THREE.MeshStandardMaterial({
            color: 0xC4CBD4,
            roughness: 0.12,
            metalness: 0.95
          });
        case 'brushed-nickel':
          return new THREE.MeshStandardMaterial({
            color: 0x8EA5AD,
            roughness: 0.30,
            metalness: 0.82
          });
        case 'matte-black':
        default:
          return new THREE.MeshStandardMaterial({
            color: 0x1A1A1A,
            roughness: 0.55,
            metalness: 0.40
          });
      }
    };

    // Sanitary White Porcelain
    const porcelainMat = new THREE.MeshStandardMaterial({
      color: 0xFAFAFA,
      roughness: 0.18,
      metalness: 0.04
    });

    // Translucent Physical Shower Glass Divider Panel
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xFAFCFD,
      transmission: 0.94,
      opacity: 0.96,
      transparent: true,
      roughness: 0.06,
      ior: 1.52
    });

    // ==========================================
    // 1. ISOMETRIC DOLLHOUSE SHELL (Cutaway 2-Wall Box)
    // ==========================================
    const floorThickness = 0.18;
    const wallThickness = 0.14;

    // A. Floor Platform
    const floorGeo = new THREE.BoxGeometry(roomW, floorThickness, roomL);
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0, -floorThickness / 2, 0);
    floorMesh.receiveShadow = true;
    fixturesGroup.add(floorMesh);

    // Subtle Architectural Floor Tile Grid Lines (600mm luxury grid)
    if (selections.flooring !== 'none') {
      const gridStep = 0.6;
      const gridLinesGroup = new THREE.Group();
      const lineMat = new THREE.LineBasicMaterial({ 
        color: gridColorInt, 
        transparent: true, 
        opacity: 0.5 
      });

      // Grid lines along X
      for (let z = -roomL / 2 + gridStep; z < roomL / 2; z += gridStep) {
        const points = [
          new THREE.Vector3(-roomW / 2 + 0.02, 0.002, z),
          new THREE.Vector3(roomW / 2 - 0.02, 0.002, z)
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, lineMat);
        gridLinesGroup.add(line);
      }
      // Grid lines along Z
      for (let x = -roomW / 2 + gridStep; x < roomW / 2; x += gridStep) {
        const points = [
          new THREE.Vector3(x, 0.002, -roomL / 2 + 0.02),
          new THREE.Vector3(x, 0.002, roomL / 2 - 0.02)
        ];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, lineMat);
        gridLinesGroup.add(line);
      }
      fixturesGroup.add(gridLinesGroup);
    }

    // B. Back Wall (Along X axis at -roomL / 2) with Cut-In Window Aperture
    const backWallGeo = new THREE.BoxGeometry(roomW + wallThickness, wallH, wallThickness);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(-wallThickness / 2, wallH / 2, -roomL / 2 - wallThickness / 2);
    backWall.receiveShadow = true;
    fixturesGroup.add(backWall);

    // Back Wall Top Coping Trim
    const backTrimGeo = new THREE.BoxGeometry(roomW + wallThickness + 0.04, 0.05, wallThickness + 0.04);
    const backTrim = new THREE.Mesh(backTrimGeo, wallTrimMat);
    backTrim.position.set(-wallThickness / 2, wallH + 0.025, -roomL / 2 - wallThickness / 2);
    fixturesGroup.add(backTrim);

    // Architectural Window on Back Wall (Single source of truth with 2D plan)
    const windowGroup = new THREE.Group();
    const windowW = Math.min(0.9, roomW * 0.32);
    const windowH = Math.min(1.0, wallH * 0.38);
    const windowPosX = Math.min(roomW / 4, roomW / 2 - windowW / 2 - 0.3);
    const windowPosY = wallH * 0.56;

    // Window Frame
    const winFrameMat = getMetalMaterial('matte-black');
    const frameThickness = 0.035;
    const winOuterGeo = new THREE.BoxGeometry(windowW, windowH, wallThickness + 0.02);
    const winOuterMesh = new THREE.Mesh(winOuterGeo, winFrameMat);
    windowGroup.add(winOuterMesh);

    // Frosted Soft Glazing
    const winGlassGeo = new THREE.BoxGeometry(windowW - frameThickness * 2, windowH - frameThickness * 2, 0.02);
    const winGlassMat = new THREE.MeshStandardMaterial({
      color: 0xF2F8FA,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.88
    });
    const winGlassMesh = new THREE.Mesh(winGlassGeo, winGlassMat);
    windowGroup.add(winGlassMesh);

    // Window Sill Ledge
    const sillGeo = new THREE.BoxGeometry(windowW + 0.08, 0.035, wallThickness + 0.08);
    const sillMesh = new THREE.Mesh(sillGeo, wallTrimMat);
    sillMesh.position.set(0, -windowH / 2 - 0.015, 0.02);
    sillMesh.castShadow = true;
    windowGroup.add(sillMesh);

    windowGroup.position.set(windowPosX, windowPosY, -roomL / 2 - wallThickness / 2 + 0.01);
    fixturesGroup.add(windowGroup);

    // C. Left Wall (Along Z axis at -roomW / 2) with Architectural Interior Door
    const leftWallGeo = new THREE.BoxGeometry(wallThickness, wallH, roomL + wallThickness);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-roomW / 2 - wallThickness / 2, wallH / 2, -wallThickness / 2);
    leftWall.receiveShadow = true;
    fixturesGroup.add(leftWall);

    // Left Wall Top Coping Trim
    const leftTrimGeo = new THREE.BoxGeometry(wallThickness + 0.04, 0.05, roomL + wallThickness + 0.04);
    const leftTrim = new THREE.Mesh(leftTrimGeo, wallTrimMat);
    leftTrim.position.set(-roomW / 2 - wallThickness / 2, wallH + 0.025, -wallThickness / 2);
    fixturesGroup.add(leftTrim);

    // Architectural Door on Left Wall (Visible frame, ajar leaf, handle, and swing arc)
    const doorGroup = new THREE.Group();
    const doorW = 0.85;
    const doorH = Math.min(2.1, wallH - 0.2);
    const doorPosZ = Math.min(roomL / 2 - doorW / 2 - 0.25, roomL * 0.28);

    // Door Architrave Frame
    const doorFrameGeo = new THREE.BoxGeometry(wallThickness + 0.02, doorH + 0.04, doorW + 0.04);
    const doorFrameMat = getMetalMaterial('matte-black');
    const doorFrame = new THREE.Mesh(doorFrameGeo, doorFrameMat);
    doorFrame.position.set(0, doorH / 2 + 0.02, 0);
    doorGroup.add(doorFrame);

    // Door Leaf slightly ajar (rotated ~18° inward into the room)
    const doorLeafGeo = new THREE.BoxGeometry(0.04, doorH, doorW);
    const doorLeafMat = new THREE.MeshStandardMaterial({
      color: 0xF3ECE4,
      roughness: 0.7,
      metalness: 0.02
    });
    const doorLeaf = new THREE.Mesh(doorLeafGeo, doorLeafMat);
    doorLeaf.position.set(0.06, doorH / 2, 0.04);
    doorLeaf.rotation.y = 0.32; // slightly ajar
    doorLeaf.castShadow = true;
    doorGroup.add(doorLeaf);

    // Sleek Architectural Modern Lever Handle
    const handleGeo = new THREE.BoxGeometry(0.06, 0.025, 0.12);
    const handleMat = getMetalMaterial('matte-black');
    const doorHandle = new THREE.Mesh(handleGeo, handleMat);
    doorHandle.position.set(0.12, 1.0, -doorW * 0.35);
    doorGroup.add(doorHandle);

    doorGroup.position.set(-roomW / 2 - wallThickness / 2 + 0.01, 0, doorPosZ);
    fixturesGroup.add(doorGroup);

    // Door Swing Arc on floor
    const arcRadius = doorW;
    const arcPoints: THREE.Vector3[] = [];
    for (let theta = 0; theta <= Math.PI / 2.2; theta += Math.PI / 24) {
      arcPoints.push(new THREE.Vector3(
        -roomW / 2 + Math.sin(theta) * arcRadius,
        0.003,
        doorPosZ + doorW / 2 - (1 - Math.cos(theta)) * arcRadius
      ));
    }
    const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
    const arcMat = new THREE.LineDashedMaterial({
      color: 0xAE8A4E,
      dashSize: 0.05,
      gapSize: 0.04,
      transparent: true,
      opacity: 0.4
    });
    const arcLine = new THREE.Line(arcGeo, arcMat);
    arcLine.computeLineDistances();
    fixturesGroup.add(arcLine);

    // ==========================================
    // 2. PROCEDURAL FIXTURES (Data-Driven Per Selection & Layout)
    // ==========================================
    const vanityProd = selections.vanity !== 'none' ? PRODUCT_MAP[selections.vanity] : null;
    const toiletProd = selections.toilet !== 'none' ? PRODUCT_MAP[selections.toilet] : null;
    const showerProd = selections.shower !== 'none' ? PRODUCT_MAP[selections.shower] : null;
    const faucetProd = selections.faucet !== 'none' ? PRODUCT_MAP[selections.faucet] : null;
    const lightingProd = selections.lighting !== 'none' ? PRODUCT_MAP[selections.lighting] : null;

    const vanityWidthMm = vanityProd?.dimensions.widthMm || 900;
    const vanityDepthMm = vanityProd?.dimensions.depthMm || 520;
    const vanityHeightMm = vanityProd?.dimensions.heightMm || 480;
    const vanityWidth = Math.max(0.65, Math.min(roomW * 0.52, vanityWidthMm / 1000));
    const vanityDepth = Math.max(0.38, Math.min(0.68, vanityDepthMm / 1000));
    const vanityHeight = Math.max(0.38, Math.min(0.85, vanityHeightMm / 1000));

    const toiletWidthMm = toiletProd?.dimensions.widthMm || 400;
    const toiletDepthMm = toiletProd?.dimensions.depthMm || 650;
    const toiletWidth = Math.max(0.34, Math.min(0.55, toiletWidthMm / 1000));
    const toiletDepth = Math.max(0.46, Math.min(0.75, toiletDepthMm / 1000));

    const showerWidthMm = showerProd?.dimensions.widthMm || 1000;
    const showerDepthMm = showerProd?.dimensions.depthMm || 1000;
    const showerWidth = Math.max(0.8, Math.min(roomW * 0.48, showerWidthMm / 1000));
    const showerDepth = Math.max(0.8, Math.min(roomL * 0.48, showerDepthMm / 1000));

    // Dynamic Layout Arrangement based on selectedLayout
    let sPosX = -roomW / 2 + showerWidth / 2 + 0.06;
    let sPosZ = -roomL / 2 + showerDepth / 2 + 0.06;

    let vPosX = 0;
    let vPosZ = -roomL / 2 + vanityDepth / 2 + 0.04;

    let tPosX = 0;
    let tPosZ = 0;
    let tRotY = 0;

    if (selectedLayout === 'linear') {
      // Linear Wet Wall
      sPosX = -roomW / 2 + showerWidth / 2 + 0.06;
      sPosZ = -roomL / 2 + showerDepth / 2 + 0.06;

      tPosX = sPosX + showerWidth / 2 + toiletWidth / 2 + 0.22;
      tPosZ = -roomL / 2 + toiletDepth / 2 + 0.04;
      tRotY = 0;

      vPosX = Math.min(roomW / 2 - vanityWidth / 2 - 0.12, tPosX + toiletWidth / 2 + vanityWidth / 2 + 0.25);
      vPosZ = -roomL / 2 + vanityDepth / 2 + 0.04;
    } else if (selectedLayout === 'l-shaped') {
      // L-Shaped Sanctuary
      sPosX = -roomW / 2 + showerWidth / 2 + 0.06;
      sPosZ = -roomL / 2 + showerDepth / 2 + 0.06;

      vPosX = Math.min(roomW / 2 - vanityWidth / 2 - 0.15, sPosX + showerWidth / 2 + vanityWidth / 2 + 0.35);
      vPosZ = -roomL / 2 + vanityDepth / 2 + 0.04;

      tPosX = -roomW / 2 + toiletDepth / 2 + 0.04;
      tPosZ = Math.min(roomL / 2 - toiletWidth / 2 - 0.25, sPosZ + showerDepth / 2 + toiletWidth / 2 + 0.35);
      tRotY = -Math.PI / 2;
    } else {
      // Parallel Galley
      vPosX = -roomW / 4;
      vPosZ = -roomL / 2 + vanityDepth / 2 + 0.04;

      sPosX = roomW / 4 + 0.05;
      sPosZ = -roomL / 2 + showerDepth / 2 + 0.06;

      tPosX = Math.min(roomW / 2 - toiletDepth / 2 - 0.2, 0.4);
      tPosZ = Math.min(roomL / 2 - toiletWidth / 2 - 0.3, 0.45);
      tRotY = 0;
    }

    // ==========================================
    // A. VANITY & BASIN (Omitted if 'none')
    // ==========================================
    const vanityPlaced = placedItems.find(p => p.id === 'vanity');
    if (vanityProd && (!vanityPlaced || !vanityPlaced.isRemoved)) {
      const vanityGroup = new THREE.Group();
      const geomVariant = vanityProd.visual3D?.geometryVariant || 'floating';
      const isFloating = geomVariant === 'floating';
      const isDouble = geomVariant === 'double-basin';
      const isFreestanding = geomVariant === 'freestanding';

      const posX = vPosX + (vanityPlaced?.x || 0) * 0.1;
      const posZ = vPosZ;
      const posY = isFloating ? 0.52 : vanityHeight / 2;

      vanityGroup.position.set(posX, posY, posZ);

      // Cabinet Material (Warm wood / walnut / lacquer from visual3D)
      const cabinetColorInt = parseHex(vanityProd.visual3D?.colorHex, 0xA47551);
      const cabinetMat = new THREE.MeshStandardMaterial({
        color: cabinetColorInt,
        roughness: vanityProd.visual3D?.roughness ?? 0.60,
        metalness: vanityProd.visual3D?.metalness ?? 0.02
      });

      const cabinetGeo = new THREE.BoxGeometry(vanityWidth, vanityHeight, vanityDepth);
      const cabinetMesh = new THREE.Mesh(cabinetGeo, cabinetMat);
      cabinetMesh.castShadow = true;
      cabinetMesh.receiveShadow = true;
      vanityGroup.add(cabinetMesh);

      // Hardware handles (Matte black / brass)
      const hardwareMat = getMetalMaterial(vanityProd.visual3D?.metalFinish || 'matte-black', vanityProd.visual3D?.hardwareColorHex);
      const handleGeo = new THREE.BoxGeometry(vanityWidth * 0.22, 0.02, 0.02);
      const handleMesh = new THREE.Mesh(handleGeo, hardwareMat);
      handleMesh.position.set(0, 0, vanityDepth / 2 + 0.012);
      vanityGroup.add(handleMesh);

      // Fluted Detail lines on double-basin / signature facades
      if (isDouble) {
        const slatGeo = new THREE.BoxGeometry(0.015, vanityHeight - 0.05, 0.012);
        for (let sx = -vanityWidth / 2 + 0.05; sx < vanityWidth / 2 - 0.05; sx += 0.055) {
          const slat = new THREE.Mesh(slatGeo, cabinetMat);
          slat.position.set(sx, 0, vanityDepth / 2 + 0.006);
          vanityGroup.add(slat);
        }
      }

      // Legs if freestanding console
      if (isFreestanding) {
        const legGeo = new THREE.CylinderGeometry(0.02, 0.016, posY - vanityHeight / 2 + 0.04);
        const ferruleGeo = new THREE.CylinderGeometry(0.022, 0.018, 0.06);
        const legPositions = [
          [-vanityWidth / 2 + 0.06, -(vanityHeight / 2 + 0.05), vanityDepth / 2 - 0.06],
          [vanityWidth / 2 - 0.06, -(vanityHeight / 2 + 0.05), vanityDepth / 2 - 0.06],
          [-vanityWidth / 2 + 0.06, -(vanityHeight / 2 + 0.05), -vanityDepth / 2 + 0.06],
          [vanityWidth / 2 - 0.06, -(vanityHeight / 2 + 0.05), -vanityDepth / 2 + 0.06]
        ];
        legPositions.forEach(([lx, ly, lz]) => {
          const leg = new THREE.Mesh(legGeo, cabinetMat);
          leg.position.set(lx, ly, lz);
          leg.castShadow = true;
          vanityGroup.add(leg);

          // Brass ferrule tip
          const ferrule = new THREE.Mesh(ferruleGeo, hardwareMat);
          ferrule.position.set(lx, ly - 0.08, lz);
          vanityGroup.add(ferrule);
        });
      }

      // Countertop Slab
      const counterColorInt = parseHex(vanityProd.visual3D?.countertopColorHex, 0xFAF8F4);
      const counterGeo = new THREE.BoxGeometry(vanityWidth + 0.03, 0.05, vanityDepth + 0.03);
      const counterMat = new THREE.MeshStandardMaterial({
        color: counterColorInt,
        roughness: 0.22,
        metalness: 0.05
      });
      const counterMesh = new THREE.Mesh(counterGeo, counterMat);
      counterMesh.position.set(0, vanityHeight / 2 + 0.025, 0);
      counterMesh.castShadow = true;
      vanityGroup.add(counterMesh);

      // Basins (Dual if double-basin, single otherwise)
      const basinOffsets = isDouble ? [-vanityWidth * 0.25, vanityWidth * 0.25] : [0];
      basinOffsets.forEach(bx => {
        // Basin
        const basinGeo = new THREE.CylinderGeometry(0.18, 0.15, 0.09, 24);
        const basinMesh = new THREE.Mesh(basinGeo, porcelainMat);
        basinMesh.position.set(bx, vanityHeight / 2 + 0.03, 0);
        vanityGroup.add(basinMesh);

        // Faucet (Rendered only if faucet selection !== 'none')
        if (faucetProd) {
          const faucetMat = getMetalMaterial(faucetProd.visual3D?.metalFinish || 'matte-black');
          const fVariant = faucetProd.visual3D?.geometryVariant || 'waterfall-flat';

          if (fVariant === 'bridge-gooseneck') {
            // High-arc gooseneck bridge faucet
            const spoutPole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.22, 16), faucetMat);
            spoutPole.position.set(bx, vanityHeight / 2 + 0.16, -vanityDepth * 0.26);
            vanityGroup.add(spoutPole);

            const arch = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 12, 16, Math.PI), faucetMat);
            arch.position.set(bx, vanityHeight / 2 + 0.27, -vanityDepth * 0.26 + 0.03);
            arch.rotation.y = Math.PI / 2;
            vanityGroup.add(arch);

            // Cross handles
            const h1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.01, 0.04), faucetMat);
            h1.position.set(bx - 0.07, vanityHeight / 2 + 0.08, -vanityDepth * 0.26);
            vanityGroup.add(h1);
            const h2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.01, 0.04), faucetMat);
            h2.position.set(bx + 0.07, vanityHeight / 2 + 0.08, -vanityDepth * 0.26);
            vanityGroup.add(h2);
          } else if (fVariant === 'wall-mount-minimal') {
            // Wall-mount horizontal spout emerging from tile
            const wallSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.014, 0.18, 16), faucetMat);
            wallSpout.rotation.x = Math.PI / 2;
            wallSpout.position.set(bx, vanityHeight / 2 + 0.22, -vanityDepth / 2 + 0.08);
            vanityGroup.add(wallSpout);

            const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.02, 16), faucetMat);
            dial.rotation.x = Math.PI / 2;
            dial.position.set(bx + 0.1, vanityHeight / 2 + 0.22, -vanityDepth / 2 + 0.01);
            vanityGroup.add(dial);
          } else if (fVariant === 'waterfall-flat') {
            // Horizontal wide waterfall blade
            const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.02, 0.16, 16), faucetMat);
            baseMesh.position.set(bx, vanityHeight / 2 + 0.11, -vanityDepth * 0.26);
            vanityGroup.add(baseMesh);

            const bladeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.12), faucetMat);
            bladeMesh.position.set(bx, vanityHeight / 2 + 0.19, -vanityDepth * 0.26 + 0.04);
            vanityGroup.add(bladeMesh);
          } else {
            // Single lever monobloc
            const monoSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.22, 16), faucetMat);
            monoSpout.position.set(bx, vanityHeight / 2 + 0.14, -vanityDepth * 0.26);
            vanityGroup.add(monoSpout);

            const lever = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.08), faucetMat);
            lever.rotation.z = Math.PI / 4;
            lever.position.set(bx + 0.02, vanityHeight / 2 + 0.24, -vanityDepth * 0.26);
            vanityGroup.add(lever);
          }
        }

        // Mirror above each basin (Rendered if 'extra-mirror' is present)
        if (selections['mirror-extras'].includes('extra-mirror')) {
          const mirrorW = isDouble ? vanityWidth * 0.38 : vanityWidth * 0.72;
          const mirrorH = 0.85;
          const mirrorGeo = new THREE.BoxGeometry(mirrorW, mirrorH, 0.02);
          const mirrorMesh = new THREE.Mesh(mirrorGeo, new THREE.MeshStandardMaterial({
            color: 0xEAF2F8,
            metalness: 0.96,
            roughness: 0.04
          }));
          mirrorMesh.position.set(bx, vanityHeight / 2 + 0.65, -vanityDepth / 2 + 0.01);
          vanityGroup.add(mirrorMesh);

          // LED Backlit Glow Halo
          const haloGeo = new THREE.BoxGeometry(mirrorW + 0.05, mirrorH + 0.05, 0.005);
          const haloColorInt = parseHex(lightingProd?.visual3D?.colorHex, 0xFFE8B8);
          const haloMesh = new THREE.Mesh(haloGeo, new THREE.MeshBasicMaterial({ color: haloColorInt }));
          haloMesh.position.set(bx, vanityHeight / 2 + 0.65, -vanityDepth / 2 + 0.002);
          vanityGroup.add(haloMesh);
        }
      });

      fixturesGroup.add(vanityGroup);
    }

    // ==========================================
    // B. TOILET / SANITATION (Omitted if 'none')
    // ==========================================
    const toiletPlaced = placedItems.find(p => p.id === 'toilet');
    if (toiletProd && (!toiletPlaced || !toiletPlaced.isRemoved)) {
      const toiletGroup = new THREE.Group();
      const geomVariant = toiletProd.visual3D?.geometryVariant || 'wall-hung';
      const isWallHung = geomVariant === 'wall-hung';
      const isTwoPiece = geomVariant === 'two-piece';

      const tX = tPosX + (toiletPlaced?.x || 0) * 0.1;
      const tZ = tPosZ + (toiletPlaced?.z || 0) * 0.1;
      toiletGroup.position.set(tX, 0, tZ);
      toiletGroup.rotation.y = tRotY;

      const commodeColorInt = parseHex(toiletProd.visual3D?.colorHex, 0xFAFAFA);
      const commodeMat = new THREE.MeshStandardMaterial({
        color: commodeColorInt,
        roughness: toiletProd.visual3D?.roughness ?? 0.18,
        metalness: toiletProd.visual3D?.metalness ?? 0.04
      });

      if (isWallHung) {
        // Suspended Cantilevered Wall-Hung Commode (160mm clear floor space beneath)
        const bowlGeo = new THREE.CylinderGeometry(0.18, 0.12, 0.32, 24);
        const bowlMesh = new THREE.Mesh(bowlGeo, commodeMat);
        bowlMesh.position.set(0, 0.32, 0.06);
        bowlMesh.castShadow = true;
        toiletGroup.add(bowlMesh);

        const seatGeo = new THREE.BoxGeometry(0.35, 0.04, 0.48);
        const seatMesh = new THREE.Mesh(seatGeo, commodeMat);
        seatMesh.position.set(0, 0.48, 0.08);
        toiletGroup.add(seatMesh);
      } else if (isTwoPiece) {
        // Classic Two-Piece Toilet with Rear Cistern Tank
        const baseGeo = new THREE.BoxGeometry(0.36, 0.40, 0.52);
        const baseMesh = new THREE.Mesh(baseGeo, commodeMat);
        baseMesh.position.set(0, 0.20, 0.08);
        baseMesh.castShadow = true;
        toiletGroup.add(baseMesh);

        const tankGeo = new THREE.BoxGeometry(0.42, 0.45, 0.22);
        const tankMesh = new THREE.Mesh(tankGeo, commodeMat);
        tankMesh.position.set(0, 0.55, -0.16);
        toiletGroup.add(tankMesh);
      } else {
        // Sculptural Integrated Smart Bidet (Sleek elongated skirt with LED halo)
        const baseGeo = new THREE.CylinderGeometry(0.20, 0.16, 0.38, 28);
        const baseMesh = new THREE.Mesh(baseGeo, commodeMat);
        baseMesh.position.set(0, 0.19, 0.04);
        baseMesh.castShadow = true;
        toiletGroup.add(baseMesh);

        const seatGeo = new THREE.BoxGeometry(0.38, 0.06, 0.54);
        const seatMesh = new THREE.Mesh(seatGeo, commodeMat);
        seatMesh.position.set(0, 0.41, 0.08);
        toiletGroup.add(seatMesh);

        // LED Glowing Halo Ring on rim
        const haloColorInt = parseHex(toiletProd.visual3D?.secondaryColorHex, 0x4AA8FF);
        const haloRingGeo = new THREE.TorusGeometry(0.16, 0.01, 16, 32);
        const haloRingMat = new THREE.MeshBasicMaterial({ color: haloColorInt });
        const haloRing = new THREE.Mesh(haloRingGeo, haloRingMat);
        haloRing.rotation.x = Math.PI / 2;
        haloRing.position.set(0, 0.44, 0.08);
        toiletGroup.add(haloRing);
      }

      // Actuator Flush Plate on wall in toilet metal finish
      const plateMat = getMetalMaterial(toiletProd.visual3D?.metalFinish || 'matte-black');
      const plateGeo = new THREE.BoxGeometry(0.015, 0.20, 0.14);
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.position.set(0.32, 0.85, 0);
      toiletGroup.add(plate);

      fixturesGroup.add(toiletGroup);
    }

    // ==========================================
    // C. SHOWER ZONE WITH GLASS PARTITION PANEL (Omitted if 'none')
    // ==========================================
    const showerPlaced = placedItems.find(p => p.id === 'shower');
    if (showerProd && (!showerPlaced || !showerPlaced.isRemoved)) {
      const showerGroup = new THREE.Group();
      const geomVariant = showerProd.visual3D?.geometryVariant || 'frameless-glass';
      const isFullEnclosure = geomVariant === 'full-enclosure';
      const isBlackFramed = geomVariant === 'black-framed-glass';

      const sX = sPosX + (showerPlaced?.x || 0) * 0.1;
      const sZ = sPosZ + (showerPlaced?.z || 0) * 0.1;
      showerGroup.position.set(sX, 0, sZ);

      const showerMetalMat = getMetalMaterial(showerProd.visual3D?.metalFinish || 'matte-black');

      // 1. Clean Vertical Glass Partition Panel (Matching reference style: partition, not full box)
      const glassPanelW = showerDepth;
      const glassPanelH = Math.min(2.05, wallH - 0.25);
      const glassGeo = new THREE.BoxGeometry(0.024, glassPanelH, glassPanelW);
      const glassMesh = new THREE.Mesh(glassGeo, glassMat);
      glassMesh.position.set(showerWidth / 2, glassPanelH / 2, 0);
      showerGroup.add(glassMesh);

      // Metal U-channel / Clamps on glass divider
      const channelThickness = isBlackFramed ? 0.035 : 0.028;
      const channelGeo = new THREE.BoxGeometry(channelThickness, 0.04, glassPanelW + 0.02);
      const channelMesh = new THREE.Mesh(channelGeo, showerMetalMat);
      channelMesh.position.set(showerWidth / 2, 0.02, 0);
      showerGroup.add(channelMesh);

      // Top stabilizer arm to wall
      const rodGeo = new THREE.CylinderGeometry(0.01, 0.01, showerWidth / 2 + 0.1);
      const rod = new THREE.Mesh(rodGeo, showerMetalMat);
      rod.rotation.z = Math.PI / 2;
      rod.position.set(showerWidth / 4, glassPanelH - 0.05, -glassPanelW * 0.3);
      showerGroup.add(rod);

      // Full enclosure return panel if steam shower
      if (isFullEnclosure) {
        const returnGeo = new THREE.BoxGeometry(showerWidth, glassPanelH, 0.024);
        const returnMesh = new THREE.Mesh(returnGeo, glassMat);
        returnMesh.position.set(0, glassPanelH / 2, showerDepth / 2);
        showerGroup.add(returnMesh);
      }

      // 2. Linear Trench Drain
      const drainGeo = new THREE.BoxGeometry(0.06, 0.005, showerDepth * 0.7);
      const drain = new THREE.Mesh(drainGeo, showerMetalMat);
      drain.position.set(showerWidth / 2 - 0.1, 0.003, 0);
      showerGroup.add(drain);

      // 3. Overhead Shower / Column (Digital, Thermostatic, Rainpanel, or Steam)
      if (showerProd.id === 'shower-rainpanel') {
        // Flush ceiling-mount rain panel in brass/metal
        const panelGeo = new THREE.BoxGeometry(0.55, 0.015, 0.55);
        const panel = new THREE.Mesh(panelGeo, showerMetalMat);
        panel.position.set(0, wallH - 0.02, 0);
        panel.castShadow = true;
        showerGroup.add(panel);

        // Concealed wall thermostatic mixer valve
        const valveGeo = new THREE.BoxGeometry(0.02, 0.22, 0.12);
        const valve = new THREE.Mesh(valveGeo, showerMetalMat);
        valve.position.set(-showerWidth / 2 + 0.02, 1.1, 0);
        showerGroup.add(valve);
      } else if (showerProd.id === 'shower-digital') {
        // Digital multipoint interface console on wall
        const consoleGeo = new THREE.BoxGeometry(0.02, 0.28, 0.18);
        const consoleMat = new THREE.MeshStandardMaterial({ color: 0x1E2226, roughness: 0.3, metalness: 0.8 });
        const consoleMesh = new THREE.Mesh(consoleGeo, consoleMat);
        consoleMesh.position.set(-showerWidth / 2 + 0.02, 1.15, 0);
        showerGroup.add(consoleMesh);

        // Digital screen glow
        const screenGeo = new THREE.BoxGeometry(0.005, 0.12, 0.14);
        const screenMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8 });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(-showerWidth / 2 + 0.032, 1.18, 0);
        showerGroup.add(screen);

        // Ceiling rainhead
        const headGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.025, 24);
        const head = new THREE.Mesh(headGeo, showerMetalMat);
        head.position.set(0, wallH - 0.25, 0);
        showerGroup.add(head);
      } else {
        // Vertical Exposed Thermostatic Shower Column (matte black riser rail + gooseneck)
        const columnGeo = new THREE.BoxGeometry(0.035, 1.1, 0.06);
        const column = new THREE.Mesh(columnGeo, showerMetalMat);
        column.position.set(-showerWidth / 2 + 0.03, 1.15, 0);
        showerGroup.add(column);

        const armGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.42);
        const arm = new THREE.Mesh(armGeo, showerMetalMat);
        arm.position.set(-showerWidth / 2 + 0.2, Math.min(2.15, wallH - 0.2), 0);
        arm.rotation.z = Math.PI / 2;
        showerGroup.add(arm);

        const headGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.02, 24);
        const head = new THREE.Mesh(headGeo, showerMetalMat);
        head.position.set(-showerWidth / 2 + 0.4, Math.min(2.05, wallH - 0.3), 0);
        head.castShadow = true;
        showerGroup.add(head);
      }

      fixturesGroup.add(showerGroup);
    }

    // ==========================================
    // D. LIGHTING FIXTURES (Pendant / Cove)
    // ==========================================
    if (lightingProd) {
      if (lightingProd.id === 'light-pendant' && selections.vanity !== 'none') {
        // Drop pendant beside vanity
        const pendantGroup = new THREE.Group();
        const pMat = getMetalMaterial('brass');
        const cordGeo = new THREE.CylinderGeometry(0.003, 0.003, wallH - 1.8);
        const cord = new THREE.Mesh(cordGeo, pMat);
        cord.position.set(0, wallH - (wallH - 1.8) / 2, 0);
        pendantGroup.add(cord);

        const shadeGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.25, 16);
        const shadeMat = new THREE.MeshPhysicalMaterial({
          color: 0xFFF8E7,
          transmission: 0.85,
          roughness: 0.1,
          ior: 1.5
        });
        const shade = new THREE.Mesh(shadeGeo, shadeMat);
        shade.position.set(0, 1.7, 0);
        pendantGroup.add(shade);

        pendantGroup.position.set(vPosX + vanityWidth / 2 + 0.15, 0, vPosZ);
        fixturesGroup.add(pendantGroup);
      }
    }

    // ==========================================
    // 3. ARCHITECTURAL DECOR TOUCHES (Matching Reference Style: Plants, Mat, Door)
    // ==========================================
    
    // Decor 1: Small Ceramic Potted Plant near Vanity Area (Clean silhouette)
    const plantGroup = new THREE.Group();
    const potGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.16, 16);
    const potMat = new THREE.MeshStandardMaterial({ color: 0xDDD4C8, roughness: 0.85 }); // Warm ceramic
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.set(0, 0.08, 0);
    pot.castShadow = true;
    plantGroup.add(pot);

    // Simple, clean upright succulent / snake plant silhouette
    const leafGeo = new THREE.ConeGeometry(0.028, 0.26, 4);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x33593B, roughness: 0.65 });
    const leafRotations = [
      [0, 0, 0.08],
      [0.08, 0, -0.06],
      [-0.07, 0, 0.04],
      [0.04, 0, 0.09]
    ];
    leafRotations.forEach(([rx, ry, rz], li) => {
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set((li - 1.5) * 0.02, 0.22, 0);
      leaf.rotation.set(rx, ry, rz);
      plantGroup.add(leaf);
    });

    // Position plant safely near vanity or front corner without colliding
    const plantX = Math.min(roomW / 2 - 0.28, vPosX + vanityWidth / 2 + 0.3);
    const plantZ = Math.min(roomL / 2 - 0.28, vPosZ + 0.35);
    plantGroup.position.set(plantX, 0, plantZ);
    fixturesGroup.add(plantGroup);

    // Decor 2: Subtle Bath Mat / Rug (In front of vanity or shower zone)
    const matGeo = new THREE.BoxGeometry(0.65, 0.015, 0.42);
    const matMat = new THREE.MeshStandardMaterial({
      color: 0xE2DDD5, // Muted natural linen / stone
      roughness: 0.95
    });
    const bathMat = new THREE.Mesh(matGeo, matMat);
    if (selections.shower !== 'none') {
      bathMat.position.set(sPosX + showerWidth / 2 + 0.35, 0.008, sPosZ);
    } else {
      bathMat.position.set(vPosX, 0.008, vPosZ + vanityDepth / 2 + 0.35);
    }
    fixturesGroup.add(bathMat);

  }, [roomShape, width, length, height, unit, selectedTheme, wallFinish, selections, placedItems, activeBundleTab, selectedLayout]);

  const timeOfDayLabels: { id: TimeOfDay; label: string; icon: any }[] = [
    { id: 'dawn', label: 'Morning Dawn', icon: Sunrise },
    { id: 'midday', label: 'Crisp Midday', icon: Sun },
    { id: 'sunset', label: 'Golden Hour', icon: Sunset },
    { id: 'night', label: 'Evening Spa', icon: Moon }
  ];

  return (
    <div className="bg-white border border-stone/20 rounded-sm shadow-editorial overflow-hidden flex flex-col">
      {/* 3D Canvas Header Bar */}
      <div className="p-4 border-b border-stone/20 bg-porcelain-warm/70 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif text-lg font-semibold text-ink">
              Architectural Dollhouse Cutaway
            </h3>
            <span className="text-[10px] font-mono bg-accent/15 text-accent font-semibold px-2 py-0.5 rounded uppercase">
              Isometric 35.3° Axonometric
            </span>
            {spaceClashWarnings && spaceClashWarnings.length === 0 ? (
              <span className="text-[10px] font-mono bg-green-100 text-green-800 border border-green-300 font-semibold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                <Check size={11} />
                <span>Spatial Validation Passed</span>
              </span>
            ) : (
              <span className="text-[10px] font-mono bg-amber-100 text-amber-900 border border-amber-300 font-semibold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                <span>⚠️ Layout Conflict ({spaceClashWarnings?.length || 1})</span>
              </span>
            )}
          </div>
          <p className="text-xs text-stone-dark mt-0.5 font-mono">
            Room: {length}×{width}×{height} {unit} ({roomL.toFixed(1)}m × {roomW.toFixed(1)}m × {wallH.toFixed(1)}m) · Tier: {activeBundleTab} · Wall: {WALL_FINISH_MAP[wallFinish]?.name || 'Putty Plaster'}
          </p>
        </div>

        {/* Fixture Quick Selector */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-stone-dark">Focused Item:</span>
          {(['shower', 'vanity', 'toilet'] as const).map(fId => {
            const item = placedItems.find(p => p.id === fId);
            const isRemoved = item?.isRemoved || selections[fId] === 'none';
            return (
              <button
                key={fId}
                onClick={() => setSelectedFixtureId(fId)}
                className={`px-2.5 py-1 rounded-sm border uppercase transition-colors ${
                  selectedFixtureId === fId
                    ? 'border-accent bg-accent/10 text-ink font-semibold'
                    : isRemoved
                    ? 'border-stone/20 text-stone line-through'
                    : 'border-stone/20 text-stone-dark hover:border-stone/40'
                }`}
              >
                {fId} {selections[fId] === 'none' ? '(None)' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Three.js Render Viewport */}
      <div className="relative w-full h-[450px] sm:h-[540px] bg-[#FAEFF1]">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating Selected Fixture Action Pill */}
        {selectedFixtureId && selections[selectedFixtureId as keyof typeof selections] !== 'none' && (
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm border border-stone/25 p-3 rounded-sm shadow-luxury flex items-center gap-3 animate-fade-in text-xs font-mono">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase text-stone-dark block">Active Focus</span>
              <strong className="text-ink capitalize font-serif text-sm">
                {selectedFixtureId === 'shower' ? PRODUCT_MAP[selections.shower]?.name :
                 selectedFixtureId === 'vanity' ? PRODUCT_MAP[selections.vanity]?.name :
                 PRODUCT_MAP[selections.toilet]?.name}
              </strong>
            </div>

            <div className="h-6 w-[1px] bg-stone/20"></div>

            {/* Remove / Restore */}
            {placedItems.find(p => p.id === selectedFixtureId)?.isRemoved ? (
              <button
                onClick={() => restorePlacedItem(selectedFixtureId)}
                className="px-2.5 py-1.5 bg-green-700 text-white rounded-sm hover:bg-green-800 transition-colors"
              >
                Restore Item
              </button>
            ) : (
              <button
                onClick={() => removePlacedItem(selectedFixtureId)}
                className="p-1.5 text-stone-dark hover:text-red-700 transition-colors rounded-sm hover:bg-red-50"
                title="Remove item from 3D scene"
              >
                <Trash2 size={15} />
              </button>
            )}

            {/* Replace Button */}
            <button
              onClick={() => {
                const cat: ProductCategory = 
                  selectedFixtureId === 'shower' ? 'shower' :
                  selectedFixtureId === 'vanity' ? 'vanity' : 'toilet';
                setReplaceModalCategory(cat);
              }}
              className="px-2.5 py-1.5 bg-porcelain-warm border border-stone/30 hover:border-accent text-ink rounded-sm transition-colors flex items-center gap-1.5"
            >
              <RefreshCw size={12} />
              <span>Replace</span>
            </button>
          </div>
        )}

        {/* AI Photoreal Render Trigger Badge */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={generatePhotorealHeroRender}
            disabled={isGeneratingRender}
            className="px-4 py-2.5 bg-ink text-porcelain text-xs font-mono uppercase tracking-wider rounded-sm shadow-luxury flex items-center gap-2 border border-accent/40 transition-all hover:bg-accent disabled:opacity-50"
          >
            <Sparkles size={14} className="text-accent" />
            <span>{isGeneratingRender ? 'Preparing Preview...' : 'Preview Design Mood'}</span>
          </button>
        </div>
      </div>

      {/* AI "Live in It" Simulator (Circadian Lighting Atmosphere) */}
      <div className="p-4 sm:p-5 border-t border-stone/20 bg-porcelain-warm/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-stone-dark">
          <Sparkles size={15} className="text-accent" />
          <span className="font-semibold uppercase tracking-wider text-ink">AI Atmosphere:</span>
          <span>Adaptive circadian lighting simulation</span>
        </div>

        {/* Time of Day Toggle Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-sm border border-stone/25 shadow-xs">
          {timeOfDayLabels.map(tod => {
            const Icon = tod.icon;
            const active = timeOfDay === tod.id;
            return (
              <button
                key={tod.id}
                onClick={() => setTimeOfDay(tod.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono transition-all ${
                  active
                    ? 'bg-ink text-porcelain font-semibold shadow-xs'
                    : 'text-stone-dark hover:text-ink hover:bg-porcelain-warm'
                }`}
              >
                <Icon size={14} className={active ? 'text-accent' : ''} />
                <span className="hidden md:inline">{tod.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Replace Fixture Modal */}
      {replaceModalCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-porcelain border border-stone/30 shadow-luxury rounded-sm p-6 max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center border-b border-stone/20 pb-3">
              <h4 className="font-serif text-lg font-semibold text-ink">
                Replace {replaceModalCategory.toUpperCase()}
              </h4>
              <button 
                onClick={() => setReplaceModalCategory(null)}
                className="text-xs font-mono uppercase text-stone hover:text-ink"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto">
              <div 
                onClick={() => {
                  replacePlacedItem(replaceModalCategory, 'none');
                  setReplaceModalCategory(null);
                }}
                className="p-3 bg-porcelain-warm border border-dashed border-stone/40 hover:border-accent rounded-sm cursor-pointer transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-serif text-sm font-semibold text-ink">None (Omit Fixture)</div>
                  <div className="text-[11px] font-mono text-stone">Remove fixture entirely from room</div>
                </div>
                <div className="font-mono text-xs font-bold text-ink">₹0</div>
              </div>

              {PRODUCTS.filter(p => p.category === replaceModalCategory).map(prod => (
                <div 
                  key={prod.id}
                  onClick={() => {
                    replacePlacedItem(replaceModalCategory, prod.id);
                    setReplaceModalCategory(null);
                  }}
                  className="p-3 bg-white border border-stone/20 hover:border-accent rounded-sm cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-serif text-sm font-semibold text-ink">{prod.name}</div>
                    <div className="text-[11px] font-mono text-stone">{prod.finishName} · {prod.tier}</div>
                  </div>
                  <div className="font-mono text-xs font-semibold text-ink">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Photoreal Hero Render Output Modal */}
      {photorealRenderUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-fade-in">
          <div className="bg-porcelain border border-stone/30 shadow-luxury rounded-sm p-6 sm:p-8 max-w-2xl w-full space-y-6">
            <div className="flex justify-between items-center border-b border-stone/20 pb-3">
              <div>
                <div className="flex items-center gap-2 text-accent font-mono text-xs tracking-wider font-semibold">
                  <Sparkles size={14} />
                  <span>Design Mood Preview</span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-ink mt-0.5">
                  Curated Material & Light Story
                </h3>
              </div>
              <button 
                onClick={() => setPhotorealRenderUrl(null)}
                className="text-xs font-mono uppercase text-stone hover:text-ink px-2 py-1 rounded hover:bg-stone/10 transition-colors"
              >
                Close ✕
              </button>
            </div>

            {/* Generated High-Resolution Render Simulation */}
            <div className="w-full h-80 rounded-sm overflow-hidden relative border border-stone/20 shadow-inner flex items-center justify-center bg-gradient-to-tr from-[#1E2226] via-[#2B3138] to-[#404852]">
              <div className="text-center text-porcelain p-6 space-y-3">
                <div className="w-12 h-12 rounded-full border border-accent text-accent flex items-center justify-center mx-auto">
                  <Sparkles size={22} />
                </div>
                <div className="font-serif text-2xl tracking-wide font-medium">
                  {THEMES[selectedTheme].name} Private Sanctuary
                </div>
                <p className="text-xs text-stone-light max-w-md mx-auto leading-relaxed font-sans">
                  Photorealistic volumetric ray-traced composition at {timeOfDay} light. Enveloped in {WALL_FINISH_MAP[wallFinish]?.name || 'Putty Plaster'} with authentic {THEMES[selectedTheme].finishes} finishes.
                </p>
                <div className="text-[10px] font-mono text-accent pt-2">
                  Spatial Model: {length}×{width}×{height} {unit} ({roomShape}) · Render Quality: Ultra HD 4K
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-stone/15">
              <span className="text-xs font-mono text-stone-dark">
                © 2026 KOHLER Spatia Concept · Prototype
              </span>
              <div className="px-4 py-2 bg-band-2 border border-accent/40 rounded-sm text-xs font-mono text-ink leading-normal">
                <span className="text-accent font-semibold">Prototype Notice: </span>
                Photoreal rendering is a prototype preview — full-resolution export will be available in a future version.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
