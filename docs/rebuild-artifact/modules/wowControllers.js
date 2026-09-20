/**
 * wowControllers.js
 *
 * Five showpiece scene controllers for the Steal the Moon artifact rebuild,
 * per docs/wow-features.md. Vanilla JS, zero dependencies besides the
 * sibling physics core (engine/saturnEngine.js), whose deterministic API
 * (keplerSolve, mulberry32) is imported and consumed below.
 *
 * Each controller is a factory returning:
 *   { init(scene, data), update(dt, simDate), dispose(), legend(), ... }
 *
 * - `scene` is an adapter object supplied by the renderer (a three.js scene
 *   wrapper in production). Every controller works headless when `scene` is
 *   null: init() builds the data model + state, update() advances the real
 *   arithmetic, dispose() tears down. No scene call is made unguarded.
 * - `update(dt, simDate)`: dt = simulated seconds to advance;
 *   simDate = Julian date (TDB-approx) of the new sim time.
 * - `legend()` returns the two-tag assignment (HEIST FRAME / REAL PHYSICS)
 *   plus the source strip text, per the shared chrome convention.
 *
 * Honesty rule: every baked data const carries `source` + `verified`
 * annotations. Only numbers from docs/wow-features.md (or the docs it
 * cites) appear; anything illustrative is labeled as such.
 *
 * Determinism: seeded mulberry32 only; no Math.random, no Date.now in logic.
 */

"use strict";

import { keplerSolve, mulberry32 } from "../../../engine/saturnEngine.js";

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

function hasDOM() {
  return typeof document !== "undefined" && typeof document.createElement === "function";
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

/** Julian date (TDB-approx) from an ISO string, via the J2000 anchor. */
function jdFromISO(iso) {
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) {
    throw new TypeError("jdFromISO: unparseable ISO date: " + iso);
  }
  const J2000_MS = Date.UTC(2000, 0, 1, 12, 0, 0);
  return 2451545.0 + (ms - J2000_MS) / 86400000;
}

/** ISO date (YYYY-MM-DD, UTC) from a Julian date (TDB-approx). */
function isoFromJD(jd) {
  const J2000_MS = Date.UTC(2000, 0, 1, 12, 0, 0);
  const ms = J2000_MS + (jd - 2451545.0) * 86400000;
  return new Date(ms).toISOString().slice(0, 10);
}

/** Format a seconds count as "7d 40m 15s" style. */
function formatLag(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const parts = [];
  if (days) parts.push(days + "d");
  if (hours) parts.push(hours + "h");
  if (mins) parts.push(mins + "m");
  parts.push(secs + "s");
  return parts.join(" ");
}

/**
 * Builds the standard two-tag legend block.
 *
 * @param {string[]} realPhysics - Lines tagged REAL PHYSICS.
 * @param {string[]} heistFrame - Lines tagged HEIST FRAME.
 * @param {string} sourceStrip - Bottom source-strip text.
 * @returns {{realPhysics:string[],heistFrame:string[],sourceStrip:string}}
 */
function makeLegend(realPhysics, heistFrame, sourceStrip) {
  return Object.freeze({
    realPhysics: Object.freeze([...realPhysics]),
    heistFrame: Object.freeze([...heistFrame]),
    sourceStrip
  });
}

/* ================================================================== */
/* 1. slingshotLedger — Cassini VVEJ replay                             */
/* ================================================================== */

/**
 * Verified waypoint table, baked inline per docs/wow-features.md
 * ("Only verified numbers; no computed extras").
 *
 * closestApproachKm is the flyby altitude; deltaVKms is the heliocentric
 * speed gain quoted in the brief (null where the brief gives none).
 */
const SLINGSHOT_WAYPOINTS = Object.freeze([
  Object.freeze({
    kind: "launch",
    dateISO: "1997-10-15",
    body: "Earth (launch)",
    closestApproachKm: null,
    deltaVKms: null,
    note: "Cassini-Huygens launch",
    source: "NASA/JPL Cassini trajectory timeline (docs/wow-features.md)",
    verified: true
  }),
  Object.freeze({
    kind: "flyby",
    dateISO: "1998-04-26",
    body: "Venus",
    closestApproachKm: 284,
    deltaVKms: 7,
    note: "Venus-1 gravity assist",
    source: "NASA/JPL Cassini trajectory timeline (docs/wow-features.md)",
    verified: true
  }),
  Object.freeze({
    kind: "flyby",
    dateISO: "1999-06-24",
    body: "Venus",
    closestApproachKm: 600,
    deltaVKms: null,
    note: "Venus-2 gravity assist",
    source: "NASA/JPL Cassini trajectory timeline (docs/wow-features.md)",
    verified: true
  }),
  Object.freeze({
    kind: "flyby",
    dateISO: "1999-08-18",
    body: "Earth",
    closestApproachKm: 1166,
    deltaVKms: 5.5,
    note: "Earth gravity assist (altitude approximate)",
    source: "NASA/JPL Cassini trajectory timeline (docs/wow-features.md)",
    verified: true
  }),
  Object.freeze({
    kind: "flyby",
    dateISO: "2000-12-30",
    body: "Jupiter",
    closestApproachKm: 9700000,
    deltaVKms: null,
    note: "Jupiter gravity assist",
    source: "NASA/JPL Cassini trajectory timeline (docs/wow-features.md)",
    verified: true
  }),
  Object.freeze({
    kind: "arrival",
    dateISO: "2004-07-01",
    body: "Saturn",
    closestApproachKm: null,
    deltaVKms: null,
    note: "Saturn orbit insertion",
    source: "NASA/JPL Cassini trajectory timeline (docs/wow-features.md)",
    verified: true
  })
]);

const SLINGSHOT_SCRUB_MIN_JD = jdFromISO("1997-01-01T00:00:00Z");
const SLINGSHOT_SCRUB_MAX_JD = jdFromISO("2004-12-31T00:00:00Z");

function slingshotLedger() {
  const waypoints = SLINGSHOT_WAYPOINTS.map((w) => ({
    ...w,
    jd: jdFromISO(w.dateISO + "T00:00:00Z")
  }));

  let simJD = SLINGSHOT_SCRUB_MIN_JD;
  let playing = false;
  let playRateDaysPerSec = 30;
  let listeners = [];

  const emit = (kind) => {
    for (const fn of listeners) fn(kind, api.state());
  };

  const api = {
    waypoints() {
      return waypoints.map((w) => ({ ...w }));
    },

    scrubRange() {
      return { minJD: SLINGSHOT_SCRUB_MIN_JD, maxJD: SLINGSHOT_SCRUB_MAX_JD };
    },

    /**
     * Flyby ledger cards whose dates are <= the given JD.
     * "Speed stolen" is only shown where the brief quotes a number.
     */
    ledgerUpTo(jd) {
      return waypoints
        .filter((w) => w.jd <= jd && w.kind === "flyby")
        .map((w) => ({
          date: w.dateISO,
          body: w.body,
          closestApproachKm: w.closestApproachKm,
          deltaVKms: w.deltaVKms,
          note: w.note,
          verified: w.verified
        }));
    },

    /** The red "direct route" ghost path: a dead line, no fake numbers. */
    ghostPath() {
      return Object.freeze({
        kind: "fizzled-direct-route",
        from: waypoints[0].body,
        to: waypoints[waypoints.length - 1].body,
        status: "fizzles — no rocket could afford this route alone",
        verified: true,
        note: "Illustrative dead line only; no trajectory numbers attached."
      });
    },

    init(scene /* , data */) {
      if (scene && typeof scene.attachController === "function") {
        scene.attachController("slingshotLedger", api.state());
      }
      return api.state();
    },

    update(dtSeconds /* , simDate */) {
      if (playing && dtSeconds > 0) {
        simJD += (dtSeconds * playRateDaysPerSec) / 1;
        if (simJD > SLINGSHOT_SCRUB_MAX_JD) {
          simJD = SLINGSHOT_SCRUB_MIN_JD;
        }
        emit("tick");
      }
      return api.state();
    },

    dispose() {
      playing = false;
      listeners = [];
    },

    legend() {
      return makeLegend(
        [
          "REAL PHYSICS — Cassini launch 15 Oct 1997; Venus-1 26 Apr 1998 @ 284 km (+7 km/s); Venus-2 24 Jun 1999 @ 600 km; Earth 18 Aug 1999 @ ~1,166 km (+5.5 km/s); Jupiter 30 Dec 2000 @ 9.7M km; Saturn arrival 1 Jul 2004.",
          "REAL PHYSICS — the timeline ribbon and flyby ledger cards."
        ],
        [
          "HEIST FRAME — the sidebar asking how the crew steals a moon with the same gravity-assist trick."
        ],
        "Source strip: NASA/JPL Cassini trajectory timeline. Scrubber 1997\u21922004. The red ghost path is an illustrative dead line \u2014 no fake numbers."
      );
    },

    state() {
      return {
        simJD,
        simISO: isoFromJD(simJD),
        playing,
        ledger: api.ledgerUpTo(simJD),
        ghostPath: api.ghostPath()
      };
    },

    setJD(jd) {
      if (!Number.isFinite(jd)) throw new TypeError("setJD: jd must be finite.");
      simJD = Math.min(Math.max(jd, SLINGSHOT_SCRUB_MIN_JD), SLINGSHOT_SCRUB_MAX_JD);
      emit("scrub");
      return api.state();
    },

    setPlaying(on) {
      playing = on === true;
      emit("play");
      return playing;
    },

    setPlayRate(daysPerSec) {
      if (!Number.isFinite(daysPerSec) || daysPerSec <= 0) {
        throw new RangeError("setPlayRate: must be a positive number.");
      }
      playRateDaysPerSec = daysPerSec;
      return playRateDaysPerSec;
    },

    onEvent(fn) {
      if (typeof fn === "function") listeners.push(fn);
      return () => {
        listeners = listeners.filter((l) => l !== fn);
      };
    },

    /**
     * Builds the scrubber + ledger-card DOM panel.
     * @param {Element} container
     */
    renderPanel(container) {
      if (!hasDOM() || !container) return;
      container.innerHTML = "";
      const wrap = el("div", "wow-panel wow-slingshot");

      const slider = el("input", "wow-slider");
      slider.type = "range";
      slider.min = String(SLINGSHOT_SCRUB_MIN_JD);
      slider.max = String(SLINGSHOT_SCRUB_MAX_JD);
      slider.step = "1";
      slider.value = String(simJD);
      slider.setAttribute("aria-label", "Cassini trajectory scrubber, 1997 to 2004");

      const readout = el("p", "wow-readout");
      const cards = el("div", "wow-ledger-cards");
      const playBtn = el("button", "wow-play-btn", "\u25B6 Play");
      playBtn.type = "button";

      const paint = () => {
        const st = api.state();
        readout.textContent =
          st.simISO + " \u2014 " + st.ledger.length + " of 4 assists logged";
        cards.innerHTML = "";
        for (const card of st.ledger) {
          const c = el("div", "wow-ledger-card");
          c.appendChild(el("h4", "wow-ledger-title", card.body + " \u00B7 " + card.date));
          c.appendChild(
            el(
              "p",
              "wow-ledger-line",
              "Closest approach: " +
                (card.closestApproachKm === null
                  ? "\u2014"
                  : card.closestApproachKm.toLocaleString("en-US") + " km") +
                (card.deltaVKms === null
                  ? ""
                  : " \u00B7 speed stolen: +" + card.deltaVKms + " km/s")
            )
          );
          cards.appendChild(c);
        }
        const ghost = el("p", "wow-ghost-note");
        ghost.textContent =
          "Red ghost path (direct route): " + st.ghostPath.status + ".";
        cards.appendChild(ghost);
        playBtn.textContent = playing ? "\u23F8 Pause" : "\u25B6 Play";
      };

      slider.addEventListener("input", () => {
        api.setJD(Number(slider.value));
        paint();
      });
      playBtn.addEventListener("click", () => {
        api.setPlaying(!playing);
        paint();
      });
      const off = api.onEvent(() => {
        slider.value = String(simJD);
        paint();
      });

      wrap.appendChild(slider);
      wrap.appendChild(playBtn);
      wrap.appendChild(readout);
      wrap.appendChild(cards);
      const lg = api.legend();
      wrap.appendChild(el("p", "wow-source-strip", lg.sourceStrip));
      container.appendChild(wrap);
      paint();
      return () => off();
    }
  };

  return api;
}

/* ================================================================== */
/* 2. missingDay — Voyager day vs ring-seismology day                   */
/* ================================================================== */

/**
 * Baked inline per docs/wow-features.md. Mankovich 2019, ApJ (Cassini
 * C-ring wave patterns). The deficit arithmetic is real:
 * 10h39m22s - 10h33m38s = 5m44s; the brief quotes 5m45s/day and
 * 7 days -> 40m15s, so the deficit constant below follows the brief
 * (5m45s/day) exactly.
 */
const MISSING_DAY_DATA = Object.freeze({
  voyager: Object.freeze({
    label: "Voyager radio (1981)",
    hours: 10,
    minutes: 39,
    seconds: 22,
    totalSeconds: 10 * 3600 + 39 * 60 + 22,
    source: "Voyager 1981 radio period (docs/wow-features.md)",
    verified: true
  }),
  ringSeismology: Object.freeze({
    label: "Ring seismology (Mankovich 2019)",
    hours: 10,
    minutes: 33,
    seconds: 38,
    totalSeconds: 10 * 3600 + 33 * 60 + 38,
    uncertaintySeconds: 112, // ±1m52s
    source: "Mankovich 2019, ApJ \u2014 Cassini C-ring wave patterns (docs/wow-features.md)",
    verified: true
  }),
  skrRange: Object.freeze({
    label: "Cassini SKR",
    minLabel: "10:36",
    maxLabel: "10:48",
    source: "Cassini Saturn kilometric radiation (docs/wow-features.md)",
    verified: true
  }),
  /** Real arithmetic per the brief: 5m45s/day deficit; 7 days -> 40m15s. */
  deficitPerDaySeconds: 5 * 60 + 45,
  magneticNote:
    "Saturn's magnetic axis is nearly aligned with its spin axis, which is why radio tracking fails.",
  source: "docs/wow-features.md",
  verified: true
});

function missingDay() {
  const D = MISSING_DAY_DATA;
  let trust = "ring"; // 'ring' | 'voyager'
  let elapsedDays = 0;
  let timeLapseDaysPerSec = 1;

  const api = {
    data() {
      return D;
    },

    /** Real accumulated lag after N simulated days, in seconds. */
    lagSeconds(days) {
      if (!Number.isFinite(days) || days < 0) {
        throw new RangeError("lagSeconds: days must be a non-negative number.");
      }
      return days * D.deficitPerDaySeconds;
    },

    lagText(days) {
      return formatLag(api.lagSeconds(days));
    },

    /** Rotation angle (radians) of each globe's marker after N days. */
    markerAngles(days) {
      const a = (2 * Math.PI * days * 86400) / D.voyager.totalSeconds;
      const b = (2 * Math.PI * days * 86400) / D.ringSeismology.totalSeconds;
      return { voyager: a % (2 * Math.PI), ring: b % (2 * Math.PI) };
    },

    /** "Which clock do you trust?" slider. Defaults to ring seismology. */
    setTrust(which) {
      if (which !== "ring" && which !== "voyager") {
        throw new RangeError('setTrust: must be "ring" or "voyager".');
      }
      trust = which;
      return trust;
    },

    getTrust() {
      return trust;
    },

    init(/* scene, data */) {
      return api.state();
    },

    update(dtSeconds /* , simDate */) {
      if (dtSeconds > 0) {
        elapsedDays += (dtSeconds * timeLapseDaysPerSec) / 86400;
      }
      return api.state();
    },

    dispose() {
      elapsedDays = 0;
    },

    legend() {
      return makeLegend(
        [
          "REAL PHYSICS — Voyager 1981 radio day 10h39m22s vs ring-seismology day 10h33m38s (Mankovich 2019, ApJ).",
          "REAL PHYSICS — the ~5m45s/day deficit and its accumulation (7 days \u2192 40m15s) are real arithmetic.",
          "REAL PHYSICS — Cassini SKR ranged 10:36\u201310:48; Saturn's magnetic axis is nearly spin-aligned, which is why radio tracking fails."
        ],
        [
          "HEIST FRAME — overlay copy about the crew's heist countdown being measured in \u201Cslippery Saturn days\u201D."
        ],
        "Source strip: Voyager 1981 radio period; Mankovich 2019, ApJ (Cassini C-ring wave patterns), \u00B11m52s."
      );
    },

    state() {
      return {
        trust,
        elapsedDays,
        lagSeconds: api.lagSeconds(elapsedDays),
        lagText: api.lagText(elapsedDays),
        markerAngles: api.markerAngles(elapsedDays)
      };
    },

    setElapsedDays(days) {
      if (!Number.isFinite(days) || days < 0) {
        throw new RangeError("setElapsedDays: must be a non-negative number.");
      }
      elapsedDays = days;
      return api.state();
    },

    setTimeLapse(daysPerSec) {
      if (!Number.isFinite(daysPerSec) || daysPerSec < 0) {
        throw new RangeError("setTimeLapse: must be non-negative.");
      }
      timeLapseDaysPerSec = daysPerSec;
      return timeLapseDaysPerSec;
    },

    /**
     * Builds the two-globe + trust-slider DOM panel.
     * @param {Element} container
     */
    renderPanel(container) {
      if (!hasDOM() || !container) return;
      container.innerHTML = "";
      const wrap = el("div", "wow-panel wow-missing-day");

      const q = el("h3", "wow-question", "Which clock do you trust?");
      wrap.appendChild(q);

      const slider = el("input", "wow-slider wow-trust");
      slider.type = "range";
      slider.min = "0";
      slider.max = "1";
      slider.step = "1";
      slider.value = "1"; // default: ring seismology
      slider.setAttribute("aria-label", "Which clock do you trust? 0 = Voyager, 1 = ring seismology");

      const labels = el("p", "wow-trust-labels");
      labels.textContent = "Voyager 10:39:22  \u2194  Rings 10:33:38";
      const readout = el("p", "wow-readout");

      const paint = () => {
        const st = api.state();
        readout.textContent =
          "Elapsed: " +
          st.elapsedDays.toFixed(1) +
          "d \u00B7 drift: " +
          st.lagText +
          " \u00B7 trusting: " +
          (trust === "ring" ? "ring seismology" : "Voyager radio");
      };
      slider.addEventListener("input", () => {
        api.setTrust(slider.value === "1" ? "ring" : "voyager");
        paint();
      });

      const lapse = el("input", "wow-slider");
      lapse.type = "range";
      lapse.min = "0";
      lapse.max = "30";
      lapse.step = "1";
      lapse.value = "7";
      lapse.setAttribute("aria-label", "Simulated days");
      lapse.addEventListener("input", () => {
        api.setElapsedDays(Number(lapse.value));
        paint();
      });

      wrap.appendChild(slider);
      wrap.appendChild(labels);
      wrap.appendChild(el("p", "wow-caption", "Time-lapse (simulated days):"));
      wrap.appendChild(lapse);
      wrap.appendChild(readout);
      wrap.appendChild(el("p", "wow-source-strip", api.legend().sourceStrip));
      container.appendChild(wrap);
      api.setElapsedDays(7);
      paint();
    }
  };

  return api;
}

/* ================================================================== */
/* 3. harborLights — Titan's methane seas                               */
/* ================================================================== */

/**
 * Baked inline per docs/wow-features.md (Cassini ISS 938-nm polar maps,
 * NASA 2015 PIA17655/PIA11146 + RADAR). Only the numbers the brief gives;
 * no invented shorelines — the low-poly shoreline polygon is a build-time
 * asset, not data, and is loaded via `data`, not invented here.
 */
const TITAN_SEAS = Object.freeze([
  Object.freeze({
    name: "Kraken Mare",
    areaKm2: 400000,
    areaNote: "~400,000 km\u00B2",
    widthKm: 1200,
    widthNote: "~1,200 km wide",
    acrossKm: null,
    composition: "liquid methane/ethane",
    location: "north-polar",
    earthComparison: "\u2248 Caspian Sea",
    instrument: "Cassini ISS 938-nm + RADAR",
    source: "Cassini ISS 938-nm polar maps, NASA 2015 (PIA17655/PIA11146) + RADAR (docs/wow-features.md)",
    verified: true
  }),
  Object.freeze({
    name: "Ligeia Mare",
    areaKm2: 126000,
    areaNote: "126,000 km\u00B2",
    widthKm: 500,
    widthNote: "500 km",
    acrossKm: null,
    composition: "liquid methane/ethane",
    location: "north-polar",
    earthComparison: null,
    instrument: "Cassini ISS 938-nm + RADAR",
    source: "Cassini ISS 938-nm polar maps, NASA 2015 (PIA17655/PIA11146) + RADAR (docs/wow-features.md)",
    verified: true
  }),
  Object.freeze({
    name: "Punga Mare",
    areaKm2: null,
    areaNote: null,
    widthKm: null,
    widthNote: null,
    acrossKm: 390,
    acrossNote: "~390 km across",
    composition: "liquid methane/ethane",
    location: "north-polar",
    earthComparison: null,
    instrument: "Cassini ISS 938-nm + RADAR",
    source: "Cassini ISS 938-nm polar maps, NASA 2015 (PIA17655/PIA11146) + RADAR (docs/wow-features.md)",
    verified: true
  })
]);

function harborLights() {
  let hazeOff = false; // false = orange haze; true = 938-nm IR base map
  let selectedSea = null;

  const api = {
    seas() {
      return TITAN_SEAS.map((s) => ({ ...s }));
    },

    seaCard(name) {
      if (typeof name !== "string") return null;
      const s = TITAN_SEAS.find(
        (sea) => sea.name.toLowerCase() === name.trim().toLowerCase()
      );
      if (!s) return null;
      return Object.freeze({
        ...s,
        legend: Object.freeze({
          tag: "REAL PHYSICS",
          frame: "HEIST FRAME \u2014 \u201Crefuel depots for the getaway fleet\u201D is fictional framing only."
        })
      });
    },

    /** "Haze off" toggle: swaps to the baked 938-nm near-IR base map. */
    setHazeOff(off) {
      hazeOff = off === true;
      return hazeOff;
    },

    isHazeOff() {
      return hazeOff;
    },

    hazeLabel() {
      return hazeOff
        ? "Haze-penetrating IR (938 nm), not visible light"
        : "Visible-light haze (fresnel)";
    },

    selectSea(name) {
      const card = api.seaCard(name);
      selectedSea = card ? card.name : null;
      return card;
    },

    init(/* scene, data */) {
      return api.state();
    },

    update(/* dt, simDate */) {
      return api.state();
    },

    dispose() {
      selectedSea = null;
      hazeOff = false;
    },

    legend() {
      return makeLegend(
        [
          "REAL PHYSICS — Kraken Mare ~400,000 km\u00B2 (~1,200 km wide, \u2248 Caspian Sea); Ligeia Mare 126,000 km\u00B2 (500 km); Punga Mare ~390 km across; liquid methane/ethane; north-polar concentration.",
          "REAL PHYSICS — measured by Cassini ISS 938-nm + RADAR; \u201Chaze off\u201D shows haze-penetrating IR, not visible light."
        ],
        [
          "HEIST FRAME \u2014 the \u201Crefuel depots for the getaway fleet\u201D framing."
        ],
        "Source strip: Cassini ISS 938-nm polar maps, NASA 2015 (PIA17655/PIA11146) + RADAR. Only standing surface liquid outside Earth."
      );
    },

    state() {
      return {
        hazeOff,
        hazeLabel: api.hazeLabel(),
        selectedSea,
        selectedCard: selectedSea ? api.seaCard(selectedSea) : null
      };
    },

    renderPanel(container) {
      if (!hasDOM() || !container) return;
      container.innerHTML = "";
      const wrap = el("div", "wow-panel wow-harbor");

      const toggle = el("button", "wow-toggle", "Haze: ON (visible light)");
      toggle.type = "button";
      toggle.addEventListener("click", () => {
        api.setHazeOff(!api.isHazeOff());
        toggle.textContent = api.isHazeOff()
          ? "Haze: OFF \u2014 IR 938 nm (not visible light)"
          : "Haze: ON (visible light)";
      });

      const list = el("div", "wow-sea-list");
      const cardBox = el("div", "wow-sea-card");
      for (const s of TITAN_SEAS) {
        const b = el("button", "wow-sea-btn", s.name);
        b.type = "button";
        b.addEventListener("click", () => {
          const card = api.selectSea(s.name);
          cardBox.innerHTML = "";
          if (card) {
            cardBox.appendChild(el("h4", "wow-sea-title", card.name));
            cardBox.appendChild(el("span", "tag-real-physics", "REAL PHYSICS"));
            const facts = [
              ["Size", card.areaNote || card.acrossNote || "\u2014"],
              ["Composition", card.composition],
              ["Location", card.location],
              ["Instrument", card.instrument],
              ["Earth comparison", card.earthComparison]
            ];
            const dl = el("dl", "wow-sea-facts");
            for (const [k, v] of facts) {
              if (v === null) continue;
              dl.appendChild(el("dt", "", k));
              dl.appendChild(el("dd", "", v));
            }
            cardBox.appendChild(dl);
            cardBox.appendChild(el("p", "wow-frame-note", card.legend.frame));
          }
        });
        list.appendChild(b);
      }

      wrap.appendChild(toggle);
      wrap.appendChild(list);
      wrap.appendChild(cardBox);
      wrap.appendChild(el("p", "wow-source-strip", api.legend().sourceStrip));
      container.appendChild(wrap);
    }
  };

  return api;
}

/* ================================================================== */
/* 4. plumeClock — Enceladus plume brightness vs true anomaly           */
/* ================================================================== */

/**
 * Illustrative brightness curve B(true anomaly), peaking at 180°
 * (apocentre), 3-4x brighter than pericentre — per Hedman et al. 2013.
 *
 * This is an illustrative fit, NOT raw figure data. Labeled as such
 * everywhere it is shown.
 */
const PLUME_FIT = Object.freeze({
  peakAnomalyDeg: 180,
  peakFactor: 4, // ~3-4x brighter at apocentre than pericentre
  widthDeg: 55,
  label:
    "illustrative fit to Hedman et al. 2013, Nature 500:182\u2013184 \u2014 not raw figure data",
  source: "Hedman et al. 2013, Nature 500:182\u2013184 (252 VIMS images, 2005\u20132012) (docs/wow-features.md)",
  verified: true, // the citation and the 3-4x/peak-at-180 facts are verified
  illustrative: true
});

const ENCELADUS_MEAN_ELEMENTS = Object.freeze({
  aKm: 238400,
  e: 0.005,
  periodDays: 1.370218,
  meanAnomalyJ2000Deg: 57.0,
  source: "JPL SAT441 mean elements (data/major-moons-elements.json)",
  verified: true
});

function plumeClock() {
  const J2000 = 2451545.0;
  let anomalyDeg = 180; // true anomaly, degrees
  let autoPlay = false;
  let frozen = false;
  let playRate = 20; // degrees of anomaly per real second

  const rand = mulberry32(0xECCE1AD);

  const api = {
    fit() {
      return PLUME_FIT;
    },

    /**
     * Illustrative plume brightness B(true anomaly): 1 at pericentre,
     * ~4x at apocentre (180 deg).
     */
    brightnessAt(nuDeg) {
      if (!Number.isFinite(nuDeg)) {
        throw new TypeError("brightnessAt: anomaly must be a finite number.");
      }
      let nu = nuDeg % 360;
      if (nu < 0) nu += 360;
      const d = nu - PLUME_FIT.peakAnomalyDeg;
      const g = Math.exp(-(d * d) / (2 * PLUME_FIT.widthDeg * PLUME_FIT.widthDeg));
      return 1 + (PLUME_FIT.peakFactor - 1) * g;
    },

    /**
     * Enceladus true anomaly at a Julian date, from the baked mean
     * elements. Kepler's equation is solved with the engine's keplerSolve
     * (same Newton-iteration convention as saturnEngine.stateAtJD).
     */
    anomalyAtJD(jd) {
      if (!Number.isFinite(jd)) throw new TypeError("anomalyAtJD: jd must be finite.");
      const n = (2 * Math.PI) / (ENCELADUS_MEAN_ELEMENTS.periodDays * 86400);
      const M0 = (ENCELADUS_MEAN_ELEMENTS.meanAnomalyJ2000Deg * Math.PI) / 180;
      const e = ENCELADUS_MEAN_ELEMENTS.e;
      const M = M0 + n * (jd - J2000) * 86400;

      const E = keplerSolve(M, e);
      const nu = 2 * Math.atan2(
        Math.sqrt(1 + e) * Math.sin(E / 2),
        Math.sqrt(1 - e) * Math.cos(E / 2)
      );
      return ((nu * 180) / Math.PI + 360) % 360;
    },

    /** Plume particle fan opacity factor at the current anomaly. */
    plumeOpacity() {
      return api.brightnessAt(anomalyDeg) / PLUME_FIT.peakFactor;
    },

    /**
     * Deterministic per-particle flicker multipliers (seeded), for the
     * additive fan. count values in [0.85, 1.15).
     */
    particleFlicker(count) {
      const out = [];
      for (let i = 0; i < count; i += 1) out.push(0.85 + 0.3 * rand());
      return out;
    },

    setAnomaly(nuDeg) {
      if (!Number.isFinite(nuDeg)) throw new TypeError("setAnomaly: must be finite.");
      anomalyDeg = ((nuDeg % 360) + 360) % 360;
      frozen = false;
      return anomalyDeg;
    },

    setAutoPlay(on) {
      autoPlay = on === true;
      if (autoPlay) frozen = false;
      return autoPlay;
    },

    /** "Freeze at apoapsis": hold the bright state. */
    freezeAtApoapsis() {
      autoPlay = false;
      frozen = true;
      anomalyDeg = PLUME_FIT.peakAnomalyDeg;
      return api.state();
    },

    init(/* scene, data */) {
      return api.state();
    },

    update(dtSeconds, simDate) {
      if (typeof simDate === "number" && Number.isFinite(simDate) && !autoPlay && !frozen) {
        anomalyDeg = api.anomalyAtJD(simDate);
      } else if (autoPlay && !frozen && dtSeconds > 0) {
        anomalyDeg = (anomalyDeg + dtSeconds * playRate) % 360;
      }
      return api.state();
    },

    dispose() {
      autoPlay = false;
      frozen = false;
    },

    legend() {
      return makeLegend(
        [
          "REAL PHYSICS \u2014 plume brightness peaks near true anomaly ~180\u00B0 (apocentre), several times brighter than at pericentre; tidal stress opens/closes the four tiger-stripe fissures.",
          "REAL PHYSICS \u2014 the curve shown is an illustrative fit to Hedman et al. 2013, Nature 500:182\u2013184 (252 VIMS images, 2005\u20132012) \u2014 not raw figure data."
        ],
        [
          "HEIST FRAME \u2014 \u201Cthe crew times the heist to the geyser clock.\u201D"
        ],
        "Source strip: Hedman et al. 2013, Nature 500:182\u2013184. Enceladus ~505 km across; eccentric orbit from JPL SAT441 mean elements."
      );
    },

    state() {
      return {
        anomalyDeg,
        brightness: api.brightnessAt(anomalyDeg),
        opacity: api.plumeOpacity(),
        autoPlay,
        frozen,
        fitLabel: PLUME_FIT.label
      };
    },

    renderPanel(container) {
      if (!hasDOM() || !container) return;
      container.innerHTML = "";
      const wrap = el("div", "wow-panel wow-plume");

      const slider = el("input", "wow-slider");
      slider.type = "range";
      slider.min = "0";
      slider.max = "360";
      slider.step = "1";
      slider.value = String(Math.round(anomalyDeg));
      slider.setAttribute("aria-label", "True anomaly scrubber");

      const readout = el("p", "wow-readout");
      const fitNote = el("p", "wow-fit-note", PLUME_FIT.label);

      const paint = () => {
        const st = api.state();
        slider.value = String(Math.round(st.anomalyDeg));
        readout.textContent =
          "True anomaly " +
          st.anomalyDeg.toFixed(0) +
          "\u00B0 \u00B7 brightness " +
          st.brightness.toFixed(2) +
          "\u00D7" +
          (st.frozen ? " \u00B7 FROZEN AT APOAPSIS" : "");
      };

      slider.addEventListener("input", () => {
        api.setAutoPlay(false);
        api.setAnomaly(Number(slider.value));
        paint();
      });

      const playBtn = el("button", "wow-play-btn", "\u25B6 Auto-play");
      playBtn.type = "button";
      playBtn.addEventListener("click", () => {
        api.setAutoPlay(!autoPlay);
        playBtn.textContent = autoPlay ? "\u23F8 Stop" : "\u25B6 Auto-play";
        paint();
      });

      const freezeBtn = el("button", "wow-freeze-btn", "Freeze at apoapsis");
      freezeBtn.type = "button";
      freezeBtn.addEventListener("click", () => {
        api.freezeAtApoapsis();
        playBtn.textContent = "\u25B6 Auto-play";
        paint();
      });

      wrap.appendChild(slider);
      wrap.appendChild(playBtn);
      wrap.appendChild(freezeBtn);
      wrap.appendChild(readout);
      wrap.appendChild(fitNote);
      wrap.appendChild(el("p", "wow-source-strip", api.legend().sourceStrip));
      container.appendChild(wrap);
      paint();
    }
  };

  return api;
}

/* ================================================================== */
/* 5. threadTheGap — Cassini Division crossing                          */
/* ================================================================== */

/**
 * Cassini Division bounds, baked inline per docs/wow-features.md.
 */
const DIVISION = Object.freeze({
  innerKm: 117580,
  outerKm: 122170,
  widthKm: 122170 - 117580, // 4,590 km (~"~4,800 km of near-nothing" in the brief)
  cause: "Mimas 2:1 mean-motion resonance",
  source: "docs/wow-features.md",
  verified: true
});

/**
 * Simplified radial optical-depth profile tau(r) across the division.
 * A few hundred points, generated deterministically from a smooth shape
 * (low gap floor, edge brightening, one narrow sub-gap dip).
 *
 * Labeled honestly: "simplified profile shape" — illustrative, NOT
 * measured Cassini UVIS stellar-occultation data.
 */
const TAU_PROFILE_POINTS = 240;

function buildTauProfile() {
  const pts = [];
  const rand = mulberry32(0xD151010);
  const { innerKm, outerKm, widthKm } = DIVISION;
  for (let i = 0; i < TAU_PROFILE_POINTS; i += 1) {
    const r = innerKm + (widthKm * i) / (TAU_PROFILE_POINTS - 1);
    const x = (r - innerKm) / widthKm; // 0..1 across the gap
    // Gap floor: near-zero, slight rise toward edges.
    let tau = 0.02 + 0.10 * Math.pow(Math.abs(x - 0.5) * 2, 3);
    // Edge brightening near the B-ring (inner) and A-ring (outer) rims.
    tau += 0.55 * Math.exp(-Math.pow(x / 0.06, 2));
    tau += 0.45 * Math.exp(-Math.pow((1 - x) / 0.06, 2));
    // One narrow sub-gap dip (Huygens-Gap-like), illustrative position.
    tau *= 1 - 0.85 * Math.exp(-Math.pow((x - 0.72) / 0.012, 2));
    // Deterministic small ripple (Mimas-carved texture, illustrative).
    tau *= 1 + 0.08 * Math.sin(x * 40) * (0.5 + 0.5 * rand());
    tau = Math.max(0.005, tau);
    pts.push(Object.freeze({ rKm: r, tau }));
  }
  return Object.freeze(pts);
}

const TAU_PROFILE_DATA = Object.freeze({
  points: buildTauProfile(),
  label: "simplified profile shape \u2014 illustrative, not measured Cassini UVIS stellar-occultation data",
  source: "Profile shape simplified for the build (docs/wow-features.md); division bounds from docs/wow-features.md",
  verified: true, // the bounds are verified; the shape is declared illustrative
  illustrative: true
});

/** Shield budget constants — pure heist framing, tagged accordingly. */
const SHIELD = Object.freeze({
  max: 100,
  tauThreshold: 0.25, // shield drains only above this optical depth
  drainPerTauSecond: 40, // shield units per second per unit of excess tau
  frame: "HEIST FRAME \u2014 shield budget is a gameplay abstraction, not physics"
});

function threadTheGap() {
  let mode = "survey"; // 'survey' | 'thread'
  let probeRKm = (DIVISION.innerKm + DIVISION.outerKm) / 2;
  let shield = SHIELD.max;
  let crossed = false; // clean-escape latch

  const pts = TAU_PROFILE_DATA.points;

  const api = {
    division() {
      return DIVISION;
    },

    profile() {
      return TAU_PROFILE_DATA;
    },

    shieldSpec() {
      return SHIELD;
    },

    /** Linear interpolation of tau at radius r (km). */
    tauAt(rKm) {
      if (!Number.isFinite(rKm)) throw new TypeError("tauAt: rKm must be finite.");
      if (rKm <= pts[0].rKm) return pts[0].tau;
      if (rKm >= pts[pts.length - 1].rKm) return pts[pts.length - 1].tau;
      let lo = 0;
      let hi = pts.length - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (pts[mid].rKm <= rKm) lo = mid;
        else hi = mid;
      }
      const a = pts[lo];
      const b = pts[hi];
      const t = (rKm - a.rKm) / (b.rKm - a.rKm);
      return a.tau + (b.tau - a.tau) * t;
    },

    setMode(m) {
      if (m !== "survey" && m !== "thread") {
        throw new RangeError('setMode: must be "survey" or "thread".');
      }
      mode = m;
      if (m === "thread") {
        shield = SHIELD.max;
        crossed = false;
        probeRKm = DIVISION.innerKm;
      }
      return mode;
    },

    getMode() {
      return mode;
    },

    /** Survey mode: read tau + km at the cursor radius. */
    surveyAt(rKm) {
      const r = Math.min(Math.max(rKm, DIVISION.innerKm), DIVISION.outerKm);
      probeRKm = r;
      return { rKm: r, tau: api.tauAt(r) };
    },

    /** Thread-it mode: move the probe; shield drains above the tau threshold. */
    threadTo(rKm, dtSeconds) {
      if (mode !== "thread") api.setMode("thread");
      const r = Math.min(Math.max(rKm, DIVISION.innerKm), DIVISION.outerKm);
      probeRKm = r;
      const tau = api.tauAt(r);
      if (dtSeconds > 0 && tau > SHIELD.tauThreshold) {
        shield = Math.max(
          0,
          shield - (tau - SHIELD.tauThreshold) * SHIELD.drainPerTauSecond * dtSeconds
        );
      }
      if (r >= DIVISION.outerKm - 1 && shield > 0) crossed = true;
      return api.state();
    },

    resetThread() {
      shield = SHIELD.max;
      crossed = false;
      probeRKm = DIVISION.innerKm;
      return api.state();
    },

    init(/* scene, data */) {
      return api.state();
    },

    update(/* dt, simDate */) {
      return api.state();
    },

    dispose() {
      mode = "survey";
    },

    legend() {
      return makeLegend(
        [
          "REAL PHYSICS \u2014 Cassini Division spans 117,580\u2013122,170 km from Saturn's center.",
          "REAL PHYSICS \u2014 carved by Mimas's 2:1 mean-motion resonance.",
          "REAL PHYSICS \u2014 the radial profile shown is a simplified profile shape (illustrative), not measured UVIS data."
        ],
        [
          "HEIST FRAME \u2014 the \u201Cheist's escape corridor\u201D framing plus the shield budget."
        ],
        "Source strip: division bounds + resonance cause per docs/wow-features.md; profile shape simplified for the build."
      );
    },

    state() {
      return {
        mode,
        probeRKm,
        tau: api.tauAt(probeRKm),
        shield,
        shieldMax: SHIELD.max,
        tauThreshold: SHIELD.tauThreshold,
        crossed,
        cleanEscape: crossed && shield > 0
      };
    },

    renderPanel(container) {
      if (!hasDOM() || !container) return;
      container.innerHTML = "";
      const wrap = el("div", "wow-panel wow-gap");

      const modeBtn = el("button", "wow-mode-btn", "Mode: SURVEY");
      modeBtn.type = "button";
      const slider = el("input", "wow-slider");
      slider.type = "range";
      slider.min = String(DIVISION.innerKm);
      slider.max = String(DIVISION.outerKm);
      slider.step = "10";
      slider.value = String(Math.round(probeRKm));
      slider.setAttribute("aria-label", "Radius across the Cassini Division, km");

      const readout = el("p", "wow-readout");
      const shieldBar = el("div", "wow-shield-bar");
      const shieldFill = el("div", "wow-shield-fill");
      shieldBar.appendChild(shieldFill);
      const verdict = el("p", "wow-verdict");

      const paint = () => {
        const st = api.state();
        slider.value = String(Math.round(st.probeRKm));
        readout.textContent =
          "r = " +
          Math.round(st.probeRKm).toLocaleString("en-US") +
          " km \u00B7 \u03C4 = " +
          st.tau.toFixed(3);
        shieldFill.style.width = (100 * st.shield) / st.shieldMax + "%";
        verdict.textContent =
          st.mode === "thread"
            ? st.cleanEscape
              ? "CLEAN ESCAPE \u2014 probe crossed under budget."
              : st.shield <= 0
                ? "SHIELD DEPLETED \u2014 the gap wins this run."
                : "Threading\u2026 keep \u03C4 low."
            : "Survey mode \u2014 scrub the radius to read \u03C4.";
        modeBtn.textContent = "Mode: " + st.mode.toUpperCase();
      };

      modeBtn.addEventListener("click", () => {
        api.setMode(mode === "survey" ? "thread" : "survey");
        paint();
      });
      slider.addEventListener("input", () => {
        const r = Number(slider.value);
        if (mode === "survey") api.surveyAt(r);
        else api.threadTo(r, 0.5);
        paint();
      });

      wrap.appendChild(modeBtn);
      wrap.appendChild(slider);
      wrap.appendChild(readout);
      wrap.appendChild(el("p", "wow-caption", "Shield (HEIST FRAME):"));
      wrap.appendChild(shieldBar);
      wrap.appendChild(verdict);
      wrap.appendChild(
        el("p", "wow-fit-note", TAU_PROFILE_DATA.label)
      );
      wrap.appendChild(el("p", "wow-source-strip", api.legend().sourceStrip));
      container.appendChild(wrap);
      paint();
    }
  };

  return api;
}

/* ------------------------------------------------------------------ */
/* Exports                                                             */
/* ------------------------------------------------------------------ */

export {
  slingshotLedger,
  missingDay,
  harborLights,
  plumeClock,
  threadTheGap,
  SLINGSHOT_WAYPOINTS,
  MISSING_DAY_DATA,
  TITAN_SEAS,
  PLUME_FIT,
  DIVISION,
  TAU_PROFILE_DATA,
  SHIELD,
  jdFromISO,
  isoFromJD
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    slingshotLedger,
    missingDay,
    harborLights,
    plumeClock,
    threadTheGap,
    SLINGSHOT_WAYPOINTS,
    MISSING_DAY_DATA,
    TITAN_SEAS,
    PLUME_FIT,
    DIVISION,
    TAU_PROFILE_DATA,
    SHIELD,
    jdFromISO,
    isoFromJD
  };
}
