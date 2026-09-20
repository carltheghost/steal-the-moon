/**
 * saturnEngine.js
 *
 * Deterministic Saturn-system Keplerian orbital simulator.
 * Vanilla JavaScript, zero dependencies.
 *
 * Origin: drafted by GPT (build-engineer consult, 2026-09-20) in the user's
 * signed-in ChatGPT session; constants reconciled against the verified
 * JPL SAT441 element table in ../data/major-moons-elements.json (all 8 moon
 * element rows matched exactly; Saturn GM taken from the SAT441 solution).
 *
 * Reference frame:
 *   Saturn-centered Cartesian frame using JPL SAT441 mean orbital elements
 *   at J2000 = JD 2451545.0 TDB. JPL tabulates the elements relative to
 *   each moon's local Laplace plane; the resulting Cartesian frame is treated
 *   here as an ecliptic-ish cinematic reference frame.
 *
 * Physical model:
 *   Two-body Keplerian propagation about Saturn only.
 *   Mutual moon perturbations, Saturn oblateness, solar perturbations,
 *   precession, and ephemeris-level effects are intentionally out of scope.
 *
 * JPL notes that mean satellite elements are approximate and are not intended
 * for high-fidelity ephemeris work.
 */

const TAU = 2 * Math.PI;
const DEG_TO_RAD = Math.PI / 180;
const DAY_SECONDS = 86400;

/**
 * Saturn gravitational parameter, km^3/s^2.
 * SAT441 solution from JPL SSD Planetary Satellite Physical Parameters
 * (https://ssd.jpl.nasa.gov/sats/phys_par/sep.html), ±0.24.
 * (The older canonical Jacobson 2006 value 3.7931187e7 differs by ~19,
 *  well outside the SAT441 quoted uncertainty, so SAT441 is used here.)
 */
const SATURN_GM = 37931206.23;

/** Saturn equatorial radius, km. */
const SATURN_EQUATORIAL_RADIUS_KM = 58232;

/** Hard outer scene boundary, approximately Phoebe's orbit, km. */
const BOUND_KM = 12.9e6;

/** Linear scene scale: one scene unit represents one million km. */
const KM_PER_UNIT = 1e6;

/**
 * Logarithmic scene scale parameters.
 * Formula:
 *   sceneUnits = LOG_K * log10(1 + km / LOG_KM0)
 * where LOG_KM0 is one Saturn radius.
 */
const LOG_KM0 = SATURN_EQUATORIAL_RADIUS_KM;
const LOG_K = 10;

/**
 * Named simulation time-scale presets.
 * Values are simulated seconds per real second.
 */
const TIME_PRESETS = Object.freeze({
  PAUSE: 0,
  REALTIME: 1,
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400
});

/*
 * JPL SAT441 mean elements, verified row-by-row against
 * ../data/major-moons-elements.json on 2026-09-20 (all 8 matched exactly):
 * Epoch: 2000-01-01.5 TDB = JD 2451545.0
 * a: km
 * period: days
 * e: dimensionless
 * i: degrees
 * node: longitude of ascending node, degrees
 * argp: argument of periapsis, degrees
 * M0: mean anomaly at J2000, degrees
 *
 * Note:
 * JPL's inclinations and nodes are referred to the individual local
 * Laplace planes rather than a single inertial ecliptic plane. They are
 * retained as published; the simulator treats the resulting Cartesian
 * coordinates as an ecliptic-ish cinematic frame.
 *
 * Published periods are retained independently for validation. Propagation
 * derives n = sqrt(GM / a^3), rather than using the tabulated period.
 */
const MOON_DATA = Object.freeze({
  Mimas: Object.freeze({
    name: "Mimas",
    a: 186000,
    periodDays: 0.942422,
    e: 0.020,
    inclinationDeg: 1.6,
    nodeDeg: 66.2,
    argpDeg: 160.4,
    meanAnomalyDeg: 275.3,
    radiusKm: 198.20
  }),

  Enceladus: Object.freeze({
    name: "Enceladus",
    a: 238400,
    periodDays: 1.370218,
    e: 0.005,
    inclinationDeg: 0.0,
    nodeDeg: 0.0,
    argpDeg: 119.5,
    meanAnomalyDeg: 57.0,
    radiusKm: 252.10
  }),

  Tethys: Object.freeze({
    name: "Tethys",
    a: 295000,
    periodDays: 1.887802,
    e: 0.001,
    inclinationDeg: 1.1,
    nodeDeg: 273.0,
    argpDeg: 335.3,
    meanAnomalyDeg: 0.0,
    radiusKm: 531.10
  }),

  Dione: Object.freeze({
    name: "Dione",
    a: 377700,
    periodDays: 2.736916,
    e: 0.002,
    inclinationDeg: 0.0,
    nodeDeg: 0.0,
    argpDeg: 116.0,
    meanAnomalyDeg: 212.0,
    radiusKm: 561.40
  }),

  Rhea: Object.freeze({
    name: "Rhea",
    a: 527200,
    periodDays: 4.517503,
    e: 0.001,
    inclinationDeg: 0.3,
    nodeDeg: 133.7,
    argpDeg: 44.3,
    meanAnomalyDeg: 31.5,
    radiusKm: 763.50
  }),

  Titan: Object.freeze({
    name: "Titan",
    a: 1221900,
    periodDays: 15.945448,
    e: 0.029,
    inclinationDeg: 0.3,
    nodeDeg: 78.6,
    argpDeg: 78.3,
    meanAnomalyDeg: 11.7,
    radiusKm: 2574.76
  }),

  Hyperion: Object.freeze({
    name: "Hyperion",
    a: 1481500,
    periodDays: 21.276658,
    e: 0.105,
    inclinationDeg: 0.6,
    nodeDeg: 87.1,
    argpDeg: 214.0,
    meanAnomalyDeg: 122.9,
    radiusKm: 135.00
  }),

  Iapetus: Object.freeze({
    name: "Iapetus",
    a: 3561700,
    periodDays: 79.331002,
    e: 0.028,
    inclinationDeg: 7.6,
    nodeDeg: 86.5,
    argpDeg: 254.5,
    meanAnomalyDeg: 74.8,
    radiusKm: 734.30
  })
});

const MOON_NAMES = Object.freeze(Object.keys(MOON_DATA));

let epochJD = 2451545.0;
let timeScale = TIME_PRESETS.REALTIME;

/**
 * Creates a deterministic Mulberry32 pseudo-random number generator.
 *
 * @param {number} seed - Integer or numeric seed.
 * @returns {function(): number} Function returning deterministic values in [0, 1).
 */
function mulberry32(seed) {
  let state = seed >>> 0;

  return function random() {
    state = (state + 0x6D2B79F5) | 0;

    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Solves Kepler's equation M = E - e*sin(E) using Newton-Raphson iteration.
 *
 * Mean anomaly is normalized into [0, 2π). The iteration terminates when the
 * correction is <= 1e-12 radians or after 50 iterations.
 *
 * @param {number} M - Mean anomaly in radians.
 * @param {number} e - Orbital eccentricity.
 * @returns {number} Eccentric anomaly in radians, normalized to [0, 2π).
 */
function keplerSolve(M, e) {
  if (!Number.isFinite(M)) {
    throw new TypeError("M must be a finite number.");
  }

  if (!Number.isFinite(e) || e < 0 || e >= 1) {
    throw new RangeError("e must satisfy 0 <= e < 1.");
  }

  let normalizedM = M % TAU;
  if (normalizedM < 0) {
    normalizedM += TAU;
  }

  let E = e < 0.8 ? normalizedM : Math.PI;

  for (let iteration = 0; iteration < 50; iteration += 1) {
    const f = E - e * Math.sin(E) - normalizedM;
    const fp = 1 - e * Math.cos(E);
    const delta = f / fp;

    E -= delta;

    if (Math.abs(delta) <= 1e-12) {
      break;
    }
  }

  E %= TAU;
  if (E < 0) {
    E += TAU;
  }

  return E;
}

/**
 * Returns the list of supported major Saturn moons.
 *
 * @returns {string[]} New array containing the eight supported moon names.
 */
function getMoonNames() {
  return [...MOON_NAMES];
}

/**
 * Returns the published element-table entry for a named moon.
 *
 * @param {string} name - Moon name.
 * @returns {object|undefined} Frozen orbital/physical data, or undefined if unknown.
 */
function getMoonData(name) {
  return MOON_DATA[name];
}

/**
 * Tests whether a distance lies outside the hard Saturn-system scene boundary.
 *
 * @param {number} km - Distance from Saturn in kilometres.
 * @returns {boolean} True when |km| exceeds the 12.9-million-km boundary.
 */
function isOutOfBounds(km) {
  if (!Number.isFinite(km)) {
    throw new TypeError("km must be a finite number.");
  }

  return Math.abs(km) > BOUND_KM;
}

/**
 * Converts kilometres to linear scene units.
 *
 * Formula:
 *   sceneUnits = km / KM_PER_UNIT
 *
 * with KM_PER_UNIT = 1,000,000 km per scene unit.
 *
 * @param {number} km - Distance in kilometres.
 * @returns {number} Linear scene-space distance.
 */
function trueScale(km) {
  if (!Number.isFinite(km)) {
    throw new TypeError("km must be a finite number.");
  }

  return km / KM_PER_UNIT;
}

/**
 * Converts a non-negative kilometre distance to logarithmic scene units.
 *
 * Formula:
 *   sceneUnits = LOG_K * log10(1 + km / LOG_KM0)
 *
 * where LOG_KM0 = 58,232 km, one Saturn equatorial radius, and LOG_K = 10.
 *
 * Negative distances are invalid for this radial scale.
 *
 * @param {number} km - Non-negative distance in kilometres.
 * @returns {number} Logarithmically compressed scene-space distance.
 */
function logScale(km) {
  if (!Number.isFinite(km)) {
    throw new TypeError("km must be a finite number.");
  }

  if (km < 0) {
    throw new RangeError("logScale(km) requires km >= 0.");
  }

  return LOG_K * Math.log10(1 + km / LOG_KM0);
}

/**
 * Sets the simulation time scale.
 *
 * @param {number} simSecondsPerRealSecond - Simulated seconds per real second.
 * @returns {number} The applied time scale.
 */
function setTimeScale(simSecondsPerRealSecond) {
  if (!Number.isFinite(simSecondsPerRealSecond) || simSecondsPerRealSecond < 0) {
    throw new RangeError("Time scale must be a finite non-negative number.");
  }

  timeScale = simSecondsPerRealSecond;
  return timeScale;
}

/**
 * Sets the simulation epoch.
 *
 * @param {number} jd - Julian Date in the same TDB convention as the J2000 elements.
 * @returns {number} The applied Julian Date.
 */
function setEpochJD(jd) {
  if (!Number.isFinite(jd)) {
    throw new TypeError("jd must be a finite number.");
  }

  epochJD = jd;
  return epochJD;
}

/**
 * Returns the current simulation epoch.
 *
 * @returns {number} Current Julian Date.
 */
function getEpochJD() {
  return epochJD;
}

/**
 * Advances the simulation clock by real elapsed seconds.
 *
 * @param {number} realDtSeconds - Real elapsed time in seconds.
 * @returns {number} Updated simulation epoch Julian Date.
 */
function advance(realDtSeconds) {
  if (!Number.isFinite(realDtSeconds)) {
    throw new TypeError("realDtSeconds must be a finite number.");
  }

  epochJD += (realDtSeconds * timeScale) / DAY_SECONDS;
  return epochJD;
}

/**
 * Computes the coplanar circular Hohmann-transfer Δv around Saturn.
 *
 * For inward transfers r2 < r1, the transfer direction is reversed but both
 * burns are returned as non-negative magnitudes.
 *
 * @param {number} r1km - Initial circular-orbit radius in kilometres.
 * @param {number} r2km - Final circular-orbit radius in kilometres.
 * @returns {{dv1:number,dv2:number,total:number,transferDays:number}}
 *   Burn magnitudes and transfer half-period.
 */
function hohmannDeltaV(r1km, r2km) {
  if (!Number.isFinite(r1km) || !Number.isFinite(r2km)) {
    throw new TypeError("r1km and r2km must be finite numbers.");
  }

  if (r1km <= 0 || r2km <= 0) {
    throw new RangeError("Orbital radii must be positive.");
  }

  if (r1km === r2km) {
    return {
      dv1: 0,
      dv2: 0,
      total: 0,
      transferDays: 0
    };
  }

  const mu = SATURN_GM;

  const v1 = Math.sqrt(mu / r1km);
  const v2 = Math.sqrt(mu / r2km);

  const transferA = (r1km + r2km) / 2;

  const transferAtR1 = Math.sqrt(
    mu * (2 / r1km - 1 / transferA)
  );

  const transferAtR2 = Math.sqrt(
    mu * (2 / r2km - 1 / transferA)
  );

  const dv1 = Math.abs(transferAtR1 - v1);
  const dv2 = Math.abs(v2 - transferAtR2);

  const transferSeconds =
    Math.PI * Math.sqrt((transferA ** 3) / mu);

  return {
    dv1,
    dv2,
    total: dv1 + dv2,
    transferDays: transferSeconds / DAY_SECONDS
  };
}

/**
 * Propagates every supported moon to a Julian Date using Keplerian two-body
 * motion about Saturn.
 *
 * Mean motion is derived from:
 *   n = sqrt(GM / a^3)
 *
 * rather than from the published period. The published JPL period is retained
 * in each element record for validation: periodDerived = 2π/n should closely
 * reproduce the published value, with small differences caused by rounded
 * mean elements and the adopted Saturn GM.
 *
 * Positions and velocities are rotated from perifocal coordinates using:
 *   Rz(node) * Rx(i) * Rz(argp)
 *
 * Positions are km and velocities are km/s. Saturn remains at the origin.
 *
 * @param {number} jd - Julian Date at which to evaluate the system.
 * @returns {{
 *   saturn:{x:number,y:number,z:number},
 *   moons:Object<string,{x:number,y:number,z:number,vx:number,vy:number,vz:number}>
 * }} Saturn-centered state vector.
 */
function stateAtJD(jd) {
  if (!Number.isFinite(jd)) {
    throw new TypeError("jd must be a finite number.");
  }

  const moons = {};
  const elapsedSeconds = (jd - 2451545.0) * DAY_SECONDS;

  for (const name of MOON_NAMES) {
    const moon = MOON_DATA[name];

    const a = moon.a;
    const e = moon.e;

    // Keplerian mean motion derived from Saturn GM.
    const n = Math.sqrt(SATURN_GM / (a * a * a));

    const M0 = moon.meanAnomalyDeg * DEG_TO_RAD;
    const M = M0 + n * elapsedSeconds;
    const E = keplerSolve(M, e);

    const cosE = Math.cos(E);
    const sinE = Math.sin(E);

    const sqrtOneMinusESquared = Math.sqrt(1 - e * e);

    /*
     * Perifocal position:
     *   x = a(cos E - e)
     *   y = a sqrt(1-e²) sin E
     */
    const xPerifocal = a * (cosE - e);
    const yPerifocal = a * sqrtOneMinusESquared * sinE;

    /*
     * Perifocal velocity can be written directly from the eccentric anomaly:
     *
     *   dx/dt = -a n sin(E) / (1 - e cos(E))
     *   dy/dt =  a n sqrt(1-e²) cos(E) / (1 - e cos(E))
     */
    const denominator = 1 - e * cosE;

    const vxPerifocal =
      (-a * n * sinE) / denominator;

    const vyPerifocal =
      (a * n * sqrtOneMinusESquared * cosE) / denominator;

    const node = moon.nodeDeg * DEG_TO_RAD;
    const inclination = moon.inclinationDeg * DEG_TO_RAD;
    const argp = moon.argpDeg * DEG_TO_RAD;

    const cosNode = Math.cos(node);
    const sinNode = Math.sin(node);
    const cosInc = Math.cos(inclination);
    const sinInc = Math.sin(inclination);
    const cosArgp = Math.cos(argp);
    const sinArgp = Math.sin(argp);

    /*
     * Combined Rz(node) * Rx(i) * Rz(argp) rotation.
     */
    const p11 =
      cosNode * cosArgp -
      sinNode * sinArgp * cosInc;

    const p12 =
      -cosNode * sinArgp -
      sinNode * cosArgp * cosInc;

    const p13 =
      sinNode * sinInc;

    const p21 =
      sinNode * cosArgp +
      cosNode * sinArgp * cosInc;

    const p22 =
      -sinNode * sinArgp +
      cosNode * cosArgp * cosInc;

    const p23 =
      -cosNode * sinInc;

    const p31 =
      sinArgp * sinInc;

    const p32 =
      cosArgp * sinInc;

    const p33 =
      cosInc;

    const x = p11 * xPerifocal + p12 * yPerifocal;
    const y = p21 * xPerifocal + p22 * yPerifocal;
    const z = p31 * xPerifocal + p32 * yPerifocal;

    const vx = p11 * vxPerifocal + p12 * vyPerifocal;
    const vy = p21 * vxPerifocal + p22 * vyPerifocal;
    const vz = p31 * vxPerifocal + p32 * vyPerifocal;

    moons[name] = {
      x,
      y,
      z,
      vx,
      vy,
      vz
    };
  }

  return {
    saturn: {
      x: 0,
      y: 0,
      z: 0
    },
    moons
  };
}

export {
  TAU,
  DAY_SECONDS,
  SATURN_GM,
  SATURN_EQUATORIAL_RADIUS_KM,
  BOUND_KM,
  KM_PER_UNIT,
  LOG_KM0,
  LOG_K,
  TIME_PRESETS,
  MOON_DATA,
  mulberry32,
  keplerSolve,
  stateAtJD,
  setTimeScale,
  setEpochJD,
  advance,
  getEpochJD,
  hohmannDeltaV,
  trueScale,
  logScale,
  isOutOfBounds,
  getMoonNames,
  getMoonData
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    TAU,
    DAY_SECONDS,
    SATURN_GM,
    SATURN_EQUATORIAL_RADIUS_KM,
    BOUND_KM,
    KM_PER_UNIT,
    LOG_KM0,
    LOG_K,
    TIME_PRESETS,
    MOON_DATA,
    mulberry32,
    keplerSolve,
    stateAtJD,
    setTimeScale,
    setEpochJD,
    advance,
    getEpochJD,
    hohmannDeltaV,
    trueScale,
    logScale,
    isOutOfBounds,
    getMoonNames,
    getMoonData
  };
}
