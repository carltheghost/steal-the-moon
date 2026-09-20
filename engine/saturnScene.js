/* saturnScene.js
 *
 * Cinematic, deterministic Saturn-system renderer.
 * Built by GPT (ChatGPT, via the user's signed-in session) for the
 * Steal the Moon rebuild — 2026-09-20.
 *
 * Requires THREE r160+ as a global/API argument and an engine implementing:
 *   stateAtJD(jd)
 *   trueScale(km)
 *   logScale(km)
 *   isOutOfBounds(km)
 *   TIME_PRESETS
 *   MOON_DATA
 *
 * Constructor:
 *   const system = createSaturnSystem(THREE, engine, textures);
 *
 * No runtime asset fetching, no Math.random(), no addons, no postprocessing.
 */

function createSaturnSystem(THREE, engine, textures = {}) {
  if (!THREE) throw new Error("createSaturnSystem: THREE is required.");
  if (!engine || typeof engine.stateAtJD !== "function") {
    throw new Error("createSaturnSystem: a compatible Saturn engine is required.");
  }

  const TAU = Math.PI * 2;
  const SATURN_GM = 37931206.23;
  const SATURN_RADIUS_KM = 58232;
  const SATURN_FLATTENING = 0.098;
  const SATURN_POLAR_FACTOR = 1 - SATURN_FLATTENING;

  const RING_DEFS = [
    { name: "C Ring", inner: 74658, outer: 92000, opacity: 0.46 },
    { name: "B Ring", inner: 92000, outer: 117580, opacity: 0.86 },
    { name: "Cassini Division", inner: 117580, outer: 122170, opacity: 0.055 },
    { name: "A Ring", inner: 122170, outer: 136775, opacity: 0.78 }
  ];

  const MOON_NAMES = [
    "Mimas",
    "Enceladus",
    "Tethys",
    "Dione",
    "Rhea",
    "Titan",
    "Hyperion",
    "Iapetus"
  ];

  const DEFAULT_MOON_COLORS = {
    Mimas: 0xd9d8cf,
    Enceladus: 0xe8e7df,
    Tethys: 0xbcb8aa,
    Dione: 0xa9a59a,
    Rhea: 0xc2bfb2,
    Titan: 0xb8793e,
    Hyperion: 0x877967,
    Iapetus: 0x665f55
  };

  const state = {
    scaleMode: "true",
    disposed: false,
    autoOrbit: false,
    autoOrbitAngle: 0,
    lastFrameTime: null,
    fly: null
  };

  const scene = new THREE.Scene();
  scene.name = "SaturnSystem";

  const camera = new THREE.PerspectiveCamera(
    45,
    typeof window !== "undefined" ? window.innerWidth / Math.max(1, window.innerHeight) : 1,
    0.01,
    100000
  );
  camera.name = "SaturnSystemCamera";

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(
    typeof window !== "undefined"
      ? Math.min(window.devicePixelRatio || 1, 1.5)
      : 1
  );

  if (typeof window !== "undefined") {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  } else {
    renderer.setSize(1280, 720, false);
  }

  if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  if ("toneMapping" in renderer && THREE.ACESFilmicToneMapping !== undefined) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
  }

  const root = new THREE.Group();
  root.name = "SaturnSystemRoot";
  scene.add(root);

  const saturnGroup = new THREE.Group();
  saturnGroup.name = "Saturn";
  root.add(saturnGroup);

  const ringGroup = new THREE.Group();
  ringGroup.name = "Rings";
  root.add(ringGroup);

  const moonGroup = new THREE.Group();
  moonGroup.name = "Moons";
  root.add(moonGroup);

  const labelGroup = new THREE.Group();
  labelGroup.name = "Labels";
  root.add(labelGroup);

  const starGroup = new THREE.Group();
  starGroup.name = "Stars";
  scene.add(starGroup);

  const moonObjects = Object.create(null);
  const labels = Object.create(null);

  let resizeHandler = null;

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function easeInOutCubic(t) {
    t = clamp(t, 0, 1);
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function scaleKm(km) {
    if (state.scaleMode === "log") {
      return engine.logScale(km);
    }
    return engine.trueScale(km);
  }

  function finiteNumber(v, fallback = 0) {
    return Number.isFinite(v) ? v : fallback;
  }

  function vectorFromKm(body) {
    if (!body) return new THREE.Vector3();

    return new THREE.Vector3(
      finiteNumber(scaleKm(finiteNumber(body.x))),
      finiteNumber(scaleKm(finiteNumber(body.y))),
      finiteNumber(scaleKm(finiteNumber(body.z)))
    );
  }

  function getMoonData(name) {
    return engine.MOON_DATA ? engine.MOON_DATA[name] : null;
  }

  function makeCanvasTexture(width, height, draw) {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    draw(ctx, width, height);

    const texture = new THREE.CanvasTexture(canvas);

    if ("colorSpace" in texture && THREE.SRGBColorSpace) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }

    texture.needsUpdate = true;
    return texture;
  }

  function makeSaturnFallbackTexture() {
    return makeCanvasTexture(1024, 512, (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);

      gradient.addColorStop(0.00, "#b5a989");
      gradient.addColorStop(0.08, "#d5c6a4");
      gradient.addColorStop(0.16, "#9e8f72");
      gradient.addColorStop(0.24, "#d1bd92");
      gradient.addColorStop(0.33, "#a28e6b");
      gradient.addColorStop(0.43, "#cbb58c");
      gradient.addColorStop(0.51, "#827359");
      gradient.addColorStop(0.59, "#c2ad83");
      gradient.addColorStop(0.68, "#9d8968");
      gradient.addColorStop(0.77, "#d0bd95");
      gradient.addColorStop(0.87, "#a08d6c");
      gradient.addColorStop(0.95, "#c9b58d");
      gradient.addColorStop(1.00, "#8f7f62");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (let y = 0; y < height; y += 7) {
        const phase = Math.sin(y * 0.11) * 0.5 + 0.5;
        ctx.globalAlpha = 0.035 + phase * 0.035;
        ctx.fillStyle = y % 14 === 0 ? "#fff4d1" : "#554b3a";
        ctx.fillRect(0, y, width, 2);
      }

      ctx.globalAlpha = 1;
    });
  }

  function makeRingFallbackTexture() {
    return makeCanvasTexture(2048, 64, (ctx, width, height) => {
      const image = ctx.createImageData(width, height);

      function hash(n) {
        const x = Math.sin(n * 12.9898) * 43758.5453123;
        return x - Math.floor(x);
      }

      for (let x = 0; x < width; x++) {
        const u = x / (width - 1);
        const wave =
          Math.sin(u * 260.0) * 0.5 +
          Math.sin(u * 711.0) * 0.25 +
          Math.sin(u * 1517.0) * 0.125;

        const noise = hash(x * 17.31) - 0.5;

        let brightness = 0.57 + wave * 0.16 + noise * 0.09;

        if (u > 0.425 && u < 0.445) brightness *= 0.20;
        if (u > 0.70 && u < 0.715) brightness *= 0.28;
        if (u > 0.885 && u < 0.90) brightness *= 0.18;

        brightness = clamp(brightness, 0.08, 0.92);

        for (let y = 0; y < height; y++) {
          const idx = (y * width + x) * 4;
          const vertical = 0.96 + Math.sin(y * 0.4) * 0.025;

          image.data[idx] = brightness * 255 * vertical;
          image.data[idx + 1] = brightness * 241 * vertical;
          image.data[idx + 2] = brightness * 211 * vertical;
          image.data[idx + 3] = 255;
        }
      }

      ctx.putImageData(image, 0, 0);
    });
  }

  function makeLabelTexture(text, color = "#ffffff") {
    return makeCanvasTexture(512, 128, (ctx, width, height) => {
      ctx.clearRect(0, 0, width, height);

      ctx.font = "600 44px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.shadowColor = "rgba(0,0,0,0.95)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 2;

      ctx.fillStyle = color;
      ctx.fillText(text, width / 2, height / 2);

      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    });
  }

  const fallbackSaturnTexture = textures.saturn || makeSaturnFallbackTexture();
  const fallbackRingTexture = textures.rings || makeRingFallbackTexture();

  if (textures.starfield) {
    scene.background = textures.starfield;
  } else {
    scene.background = new THREE.Color(0x020308);
  }

  if (fallbackSaturnTexture && "colorSpace" in fallbackSaturnTexture && THREE.SRGBColorSpace) {
    fallbackSaturnTexture.colorSpace = THREE.SRGBColorSpace;
  }

  if (fallbackRingTexture && "colorSpace" in fallbackRingTexture && THREE.SRGBColorSpace) {
    fallbackRingTexture.colorSpace = THREE.SRGBColorSpace;
  }

  /*
   * Lighting
   */
  const ambient = new THREE.AmbientLight(0x6f7890, 0.28);
  ambient.name = "SystemAmbient";
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xfff3d6, 2.4);
  sun.name = "Sun";
  sun.position.set(180, 70, 120);
  scene.add(sun);

  const rim = new THREE.PointLight(0x7c9bd6, 0.42, 0, 2);
  rim.name = "SaturnRim";
  rim.position.set(-60, 20, -90);
  scene.add(rim);

  /*
   * Saturn — oblate spheroid, scaled by the engine's selected physical scale.
   */
  const saturnRadius = scaleKm(SATURN_RADIUS_KM);

  const saturnGeometry = new THREE.SphereGeometry(1, 96, 64);

  const saturnMaterial = new THREE.MeshStandardMaterial({
    map: fallbackSaturnTexture || null,
    color: 0xffffff,
    roughness: 0.88,
    metalness: 0.0
  });

  const saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial);
  saturnMesh.name = "SaturnBody";
  saturnMesh.scale.set(
    saturnRadius,
    saturnRadius * SATURN_POLAR_FACTOR,
    saturnRadius
  );

  saturnGroup.add(saturnMesh);

  /*
   * Subtle Saturn atmospheric glow.
   */
  const atmosphereGeometry = new THREE.SphereGeometry(1.018, 64, 32);
  const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xd4bd8c,
    transparent: true,
    opacity: 0.075,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  atmosphere.name = "SaturnAtmosphere";
  atmosphere.scale.copy(saturnMesh.scale);
  saturnGroup.add(atmosphere);

  /*
   * Ring meshes — each annulus uses real Saturn-centered kilometer radii
   * converted by the exact same scale function used everywhere else.
   */
  function buildRingSegment(definition, index) {
    const segments = 512;
    const radialSegments = 8;

    const vertexCount = (segments + 1) * (radialSegments + 1);
    const positions = new Float32Array(vertexCount * 3);
    const normals = new Float32Array(vertexCount * 3);
    const uvs = new Float32Array(vertexCount * 2);
    const indices = [];

    let vertex = 0;

    for (let r = 0; r <= radialSegments; r++) {
      const rt = r / radialSegments;
      const radiusKm =
        definition.inner +
        (definition.outer - definition.inner) * rt;

      const radius = scaleKm(radiusKm);

      for (let s = 0; s <= segments; s++) {
        const st = s / segments;
        const angle = st * TAU;

        const i3 = vertex * 3;
        const i2 = vertex * 2;

        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = Math.sin(angle) * radius;

        normals[i3] = 0;
        normals[i3 + 1] = 1;
        normals[i3 + 2] = 0;

        uvs[i2] = rt;
        uvs[i2 + 1] = st;

        vertex++;
      }
    }

    const row = segments + 1;

    for (let r = 0; r < radialSegments; r++) {
      for (let s = 0; s < segments; s++) {
        const a = r * row + s;
        const b = a + 1;
        const c = a + row;
        const d = c + 1;

        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeBoundingSphere();

    const material = new THREE.MeshStandardMaterial({
      map: fallbackRingTexture || null,
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: definition.opacity,
      roughness: 0.72,
      metalness: 0.0,
      depthWrite: index !== 2,
      alphaTest: index === 2 ? 0.0 : 0.02
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = definition.name;
    mesh.renderOrder = 10 + index;

    return mesh;
  }

  const ringMeshes = RING_DEFS.map(buildRingSegment);

  for (const mesh of ringMeshes) {
    ringGroup.add(mesh);
  }

  /*
   * Extremely subtle ring backlight helper — no postprocessing.
   */
  const ringGlowGeometry = new THREE.RingGeometry(
    scaleKm(74658),
    scaleKm(136775),
    512
  );

  const ringGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xd7c6a2,
    transparent: true,
    opacity: 0.035,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const ringGlow = new THREE.Mesh(ringGlowGeometry, ringGlowMaterial);
  ringGlow.name = "RingGlow";
  ringGlow.renderOrder = 5;
  ringGroup.add(ringGlow);

  /*
   * Deterministic PRNG for stars — local and seeded. No Math.random anywhere.
   */
  function mulberry32(seed) {
    let a = seed >>> 0;

    return function next() {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;

      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);

      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildStarfield() {
    const count = 3000;
    const rng = mulberry32(0x53415455);

    const outerPhysicalRadius = Math.max(
      scaleKm(1600000),
      saturnRadius * 100
    );

    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const u = rng();
      const v = rng();

      const y = 1 - 2 * u;
      const radial = Math.sqrt(Math.max(0, 1 - y * y));
      const phi = TAU * v;

      const radius = outerPhysicalRadius * (0.94 + rng() * 0.06);

      const x = Math.cos(phi) * radial * radius;
      const yy = y * radius;
      const z = Math.sin(phi) * radial * radius;

      const i3 = i * 3;

      positions[i3] = x;
      positions[i3 + 1] = yy;
      positions[i3 + 2] = z;

      const brightness = 0.45 + rng() * 0.55;
      const warm = rng();

      colors[i3] = brightness * (0.88 + warm * 0.12);
      colors[i3 + 1] = brightness * (0.90 + warm * 0.10);
      colors[i3 + 2] = brightness * (0.95 + (1 - warm) * 0.05);

      sizes[i] = 0.65 + rng() * 1.8;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 2.1,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      depthWrite: false
    });

    const stars = new THREE.Points(geometry, material);
    stars.name = "Starfield3000";

    starGroup.add(stars);

    return stars;
  }

  const stars = buildStarfield();

  /*
   * Labels.
   */
  function createLabel(name, color = "#ffffff") {
    const texture = makeLabelTexture(name, color);

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      opacity: 0.88
    });

    const sprite = new THREE.Sprite(material);

    sprite.name = `${name}Label`;
    sprite.scale.set(9, 2.25, 1);
    sprite.renderOrder = 100;

    labelGroup.add(sprite);
    labels[name] = sprite;

    return sprite;
  }

  createLabel("Saturn", "#f7dfac");

  for (const name of MOON_NAMES) {
    createLabel(name, "#ffffff");
  }

  /*
   * Moons.
   */
  function createMoon(name, index) {
    const data = getMoonData(name);

    const radiusKm =
      data && Number.isFinite(data.radiusKm)
        ? data.radiusKm
        : 1;

    const radius = Math.max(
      Math.abs(scaleKm(radiusKm)),
      0.001
    );

    const geometry = new THREE.SphereGeometry(
      1,
      name === "Hyperion" ? 24 : 32,
      name === "Hyperion" ? 16 : 20
    );

    const texture =
      textures.moons &&
      textures.moons[name]
        ? textures.moons[name]
        : null;

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      color: texture
        ? 0xffffff
        : (DEFAULT_MOON_COLORS[name] || 0xb0aaa0),
      roughness: name === "Enceladus" ? 0.48 : 0.86,
      metalness: 0.0
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = name;
    mesh.scale.setScalar(radius);
    mesh.castShadow = false;
    mesh.receiveShadow = false;

    moonGroup.add(mesh);

    moonObjects[name] = {
      name,
      mesh,
      radiusKm,
      index
    };

    return mesh;
  }

  MOON_NAMES.forEach(createMoon);

  /*
   * Camera state — initial framing broad enough to show Saturn and its rings.
   */
  const initialCameraPosition = new THREE.Vector3(
    scaleKm(330000),
    scaleKm(155000),
    scaleKm(330000)
  );

  camera.position.copy(initialCameraPosition);
  camera.lookAt(0, 0, 0);

  const cameraTarget = new THREE.Vector3(0, 0, 0);

  function getBodyObject(name) {
    if (name === "Saturn") return saturnGroup;
    if (moonObjects[name]) return moonObjects[name].mesh;
    return null;
  }

  function getBodyPosition(name) {
    if (name === "Saturn") {
      return new THREE.Vector3(0, 0, 0);
    }

    const moon = moonObjects[name];

    if (!moon) return null;

    return moon.mesh.position.clone();
  }

  /*
   * Engine update.
   */
  let currentJD = null;

  function update(jd) {
    if (state.disposed) return;

    currentJD = jd;

    const orbitalState = engine.stateAtJD(jd);

    if (!orbitalState) return;

    if (orbitalState.saturn) {
      saturnGroup.position.copy(vectorFromKm(orbitalState.saturn));
    } else {
      saturnGroup.position.set(0, 0, 0);
    }

    for (const name of MOON_NAMES) {
      const moon = moonObjects[name];
      const orbital = orbitalState.moons && orbitalState.moons[name];

      if (!moon || !orbital) continue;

      moon.mesh.position.copy(vectorFromKm(orbital));

      const p = moon.mesh.position;
      const bodyDistance = p.length();

      const outOfBounds =
        typeof engine.isOutOfBounds === "function"
          ? engine.isOutOfBounds(bodyDistance)
          : false;

      moon.mesh.visible = !outOfBounds;

      const label = labels[name];

      if (label) {
        label.position.copy(p);

        const labelOffset = Math.max(
          Math.abs(scaleKm(moon.radiusKm)) * 2.8,
          1.5
        );

        label.position.y += labelOffset;
        label.visible = !outOfBounds;
      }
    }

    labels.Saturn.position.set(
      saturnGroup.position.x,
      saturnGroup.position.y +
        Math.max(saturnRadius * 1.55, 2),
      saturnGroup.position.z
    );

    updateFlyTo();

    return orbitalState;
  }

  /*
   * Cinematic camera fly-to with internal easeInOutCubic tween (no GSAP).
   */
  function flyTo(bodyName, durationSec = 2.5) {
    const body = getBodyObject(bodyName);

    if (!body) {
      throw new Error(`flyTo: unknown body "${bodyName}".`);
    }

    const bodyPosition =
      bodyName === "Saturn"
        ? new THREE.Vector3(0, 0, 0)
        : body.position.clone();

    const from = camera.position.clone();
    const offset = new THREE.Vector3();

    if (bodyName === "Saturn") {
      offset.set(
        Math.max(saturnRadius * 3.2, 12),
        Math.max(saturnRadius * 1.55, 6),
        Math.max(saturnRadius * 3.2, 12)
      );
    } else {
      const distance = Math.max(
        bodyPosition.length(),
        Math.abs(scaleKm(
          moonObjects[bodyName]
            ? moonObjects[bodyName].radiusKm
            : 1
        )) * 8,
        8
      );

      offset.set(
        distance * 0.9,
        distance * 0.42,
        distance * 0.9
      );
    }

    const targetPosition = bodyPosition.clone().add(offset);
    const startTarget = cameraTarget.clone();
    const endTarget = bodyPosition.clone();

    state.fly = {
      bodyName,
      from,
      to: targetPosition,
      startTarget,
      endTarget,
      startTime: typeof performance !== "undefined"
        ? performance.now()
        : 0,
      durationMs: Math.max(0.001, durationSec) * 1000
    };

    return {
      body: bodyName,
      durationSec: Math.max(0.001, durationSec)
    };
  }

  function updateFlyTo() {
    if (!state.fly) return;

    const now =
      typeof performance !== "undefined"
        ? performance.now()
        : state.fly.startTime + state.fly.durationMs;

    const elapsed = now - state.fly.startTime;
    const t = clamp(elapsed / state.fly.durationMs, 0, 1);
    const eased = easeInOutCubic(t);

    camera.position.lerpVectors(state.fly.from, state.fly.to, eased);
    cameraTarget.lerpVectors(state.fly.startTarget, state.fly.endTarget, eased);
    camera.lookAt(cameraTarget);

    if (t >= 1) {
      camera.position.copy(state.fly.to);
      cameraTarget.copy(state.fly.endTarget);
      camera.lookAt(cameraTarget);
      state.fly = null;
    }
  }

  /*
   * Auto orbit — camera only; orbital state stays owned by the engine.
   */
  function startAutoOrbit() {
    state.autoOrbit = true;
    state.lastFrameTime = null;
  }

  function stopAutoOrbit() {
    state.autoOrbit = false;
    state.lastFrameTime = null;
  }

  function updateAutoOrbit(now) {
    if (!state.autoOrbit || state.fly) {
      state.lastFrameTime = now;
      return;
    }

    if (state.lastFrameTime === null) {
      state.lastFrameTime = now;
      return;
    }

    const dt = clamp((now - state.lastFrameTime) / 1000, 0, 0.1);
    state.lastFrameTime = now;

    state.autoOrbitAngle = (state.autoOrbitAngle + dt * 0.055) % TAU;

    const radius = Math.max(saturnRadius * 5.5, 30);
    const height = Math.max(saturnRadius * 1.55, 8);

    camera.position.set(
      Math.cos(state.autoOrbitAngle) * radius,
      height,
      Math.sin(state.autoOrbitAngle) * radius
    );

    cameraTarget.set(0, 0, 0);
    camera.lookAt(cameraTarget);
  }

  /*
   * Scale mode — rebuild distance-dependent geometry (no accumulated transforms).
   */
  function rebuildForScaleMode() {
    const newSaturnRadius = scaleKm(SATURN_RADIUS_KM);

    saturnMesh.scale.set(
      newSaturnRadius,
      newSaturnRadius * SATURN_POLAR_FACTOR,
      newSaturnRadius
    );

    atmosphere.scale.copy(saturnMesh.scale);

    for (let i = 0; i < ringMeshes.length; i++) {
      const def = RING_DEFS[i];
      const geometry = ringMeshes[i].geometry;

      const position = geometry.getAttribute("position");
      const segments = 512;
      const radialSegments = 8;
      let vertex = 0;

      for (let r = 0; r <= radialSegments; r++) {
        const rt = r / radialSegments;
        const radiusKm = def.inner + (def.outer - def.inner) * rt;
        const radius = scaleKm(radiusKm);

        for (let s = 0; s <= segments; s++) {
          const st = s / segments;
          const angle = st * TAU;
          const i3 = vertex * 3;

          position.array[i3] = Math.cos(angle) * radius;
          position.array[i3 + 1] = 0;
          position.array[i3 + 2] = Math.sin(angle) * radius;

          vertex++;
        }
      }

      position.needsUpdate = true;
      geometry.computeBoundingSphere();
    }

    ringGlow.geometry.dispose();
    ringGlow.geometry = new THREE.RingGeometry(
      scaleKm(74658),
      scaleKm(136775),
      512
    );

    for (const name of MOON_NAMES) {
      const moon = moonObjects[name];
      const radius = Math.max(Math.abs(scaleKm(moon.radiusKm)), 0.001);
      moon.mesh.scale.setScalar(radius);
    }

    const position = stars.geometry.getAttribute("position");
    const newRadius = Math.max(scaleKm(1600000), newSaturnRadius * 100);

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);

      const length = Math.sqrt(x * x + y * y + z * z);
      if (length <= 0) continue;

      const target = newRadius * 0.97;

      position.setXYZ(
        i,
        (x / length) * target,
        (y / length) * target,
        (z / length) * target
      );
    }

    position.needsUpdate = true;
    stars.geometry.computeBoundingSphere();

    camera.position.multiplyScalar(
      Math.max(0.001, newSaturnRadius / Math.max(saturnRadius, 0.001))
    );
  }

  function setScaleMode(mode) {
    if (mode !== "true" && mode !== "log") {
      throw new Error(`setScaleMode: expected "true" or "log", got "${mode}".`);
    }

    if (mode === state.scaleMode) return;

    state.scaleMode = mode;
    rebuildForScaleMode();

    return state.scaleMode;
  }

  /*
   * Render loop — update(jd) stays explicit and deterministic; the internal
   * loop only handles presentation (auto-orbit, camera tweening).
   */
  let animationFrame = null;

  function renderLoop(now) {
    if (state.disposed) return;

    updateAutoOrbit(now);
    renderer.render(scene, camera);

    animationFrame = typeof requestAnimationFrame === "function"
      ? requestAnimationFrame(renderLoop)
      : null;
  }

  /*
   * Resize handling with the requested pixel-ratio cap.
   */
  if (typeof window !== "undefined") {
    resizeHandler = function onResize() {
      if (state.disposed) return;

      const width = Math.max(1, window.innerWidth);
      const height = Math.max(1, window.innerHeight);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height, false);
    };

    window.addEventListener("resize", resizeHandler, { passive: true });
  }

  if (typeof requestAnimationFrame === "function") {
    animationFrame = requestAnimationFrame(renderLoop);
  }

  function disposeMaterial(material) {
    if (!material) return;

    if (material.map && material.map !== textures.saturn &&
        material.map !== textures.rings) {
      material.map.dispose();
    }

    if (material.dispose) material.dispose();
  }

  function disposeObject(object) {
    if (!object) return;

    object.traverse((child) => {
      if (child.geometry) {
        child.geometry.dispose();
      }

      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(disposeMaterial);
        } else {
          disposeMaterial(child.material);
        }
      }
    });
  }

  function dispose() {
    if (state.disposed) return;

    state.disposed = true;
    state.autoOrbit = false;
    state.fly = null;

    if (animationFrame !== null && typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    if (typeof window !== "undefined" && resizeHandler) {
      window.removeEventListener("resize", resizeHandler);
      resizeHandler = null;
    }

    disposeObject(root);
    disposeObject(starGroup);

    if (ambient.parent) ambient.parent.remove(ambient);
    if (sun.parent) sun.parent.remove(sun);
    if (rim.parent) rim.parent.remove(rim);

    if (renderer) {
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }

    for (const key of Object.keys(labels)) {
      const label = labels[key];
      if (
        label &&
        label.material &&
        label.material.map &&
        label.material.map !== textures.saturn &&
        label.material.map !== textures.rings
      ) {
        label.material.map.dispose();
      }
    }
  }

  return {
    scene,
    camera,
    renderer,
    root,
    saturn: saturnMesh,
    rings: ringGroup,
    moons: moonGroup,
    labels: labelGroup,

    update,
    setScaleMode,
    flyTo,
    startAutoOrbit,
    stopAutoOrbit,
    getBodyPosition,
    dispose,

    get scaleMode() {
      return state.scaleMode;
    },

    get currentJD() {
      return currentJD;
    },

    get starfield() {
      return stars;
    },

    get GM() {
      return SATURN_GM;
    },

    get saturnRadiusKm() {
      return SATURN_RADIUS_KM;
    }
  };
}

if (typeof globalThis !== "undefined") {
  globalThis.createSaturnSystem = createSaturnSystem;
}
