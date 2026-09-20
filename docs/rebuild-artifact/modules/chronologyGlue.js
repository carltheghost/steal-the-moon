/**
 * chronologyGlue.js
 *
 * Timeline data + renderer glue for the Steal the Moon artifact rebuild.
 * Canonical source: docs/chronology-resolution.md (RESOLVED 2026-09-20).
 *
 * Vanilla JS, zero dependencies. Deterministic, no network, no Math.random.
 *
 * Canonical anchor: program day 0 ("FIRST LIGHT") = 22 May 2021;
 * capture (program day 4,200) = 20 Nov 2032.
 */

"use strict";

/* ------------------------------------------------------------------ */
/* Date utilities                                                      */
/* ------------------------------------------------------------------ */

const J2000_MS = Date.UTC(2000, 0, 1, 12, 0, 0); // JD 2451545.0

/**
 * TDB-approximate Julian date from an ISO string.
 * (UTC-based; TT-TDB differences of ~ms are out of scope for the UI.)
 *
 * CONVENTION: a bare calendar date maps to 12:00 UT (noon convention),
 * matching J2000 = JD 2451545.0 = 2000-01-01 12:00. Explicit timestamps
 * are honored as given. This keeps every calendar-date JD consistent
 * with the engine's noon-based element epoch.
 *
 * @param {string} iso - ISO 8601 date string.
 * @returns {number} Julian date.
 */
function jdFromISO(iso) {
  const stamped = /T/.test(iso) ? iso : iso + "T12:00:00Z";
  const ms = Date.parse(stamped);
  if (!Number.isFinite(ms)) {
    throw new TypeError("jdFromISO: unparseable ISO date: " + iso);
  }
  return 2451545.0 + (ms - J2000_MS) / 86400000;
}

/** Day-0 anchor: FIRST LIGHT, 22 May 2021 (Saturday), 12:00 UT. */
const DAY0_ISO = "2021-05-22";
const DAY0_JD = jdFromISO(DAY0_ISO); // 2459357.0

/** Capture: program day 4,200 = 20 Nov 2032 (Saturday). */
const CAPTURE_DAY = 4200;
const CAPTURE_JD = DAY0_JD + CAPTURE_DAY;
const CAPTURE_ISO = "2032-11-20";

/**
 * Program day -> ISO date (YYYY-MM-DD, UTC).
 *
 * @param {number} day - Program day (0 = 22 May 2021; negative allowed).
 * @returns {string} ISO date.
 */
function dayToDate(day) {
  if (!Number.isFinite(day)) throw new TypeError("dayToDate: day must be finite.");
  const ms = Date.UTC(2021, 4, 22) + Math.round(day) * 86400000;
  return new Date(ms).toISOString().slice(0, 10);
}

/**
 * ISO date (or Julian date) -> program day (fractional allowed).
 *
 * @param {string|number} jdOrISO - ISO string or Julian date.
 * @returns {number} Program day (0 = FIRST LIGHT).
 */
function dateToDay(jdOrISO) {
  if (typeof jdOrISO === "number") {
    if (!Number.isFinite(jdOrISO)) throw new TypeError("dateToDay: jd must be finite.");
    return jdOrISO - DAY0_JD;
  }
  return jdFromISO(jdOrISO) - DAY0_JD;
}

/**
 * Day-0 ISO -> program day of an ISO date, rounded to whole days.
 * @param {string} iso
 * @returns {number}
 */
function dayOf(iso) {
  return Math.round(dateToDay(iso));
}

/* ------------------------------------------------------------------ */
/* PROGRAM — canonical phase table (chronology-resolution.md §5)        */
/* ------------------------------------------------------------------ */

/**
 * The full program timeline, 22 May 2021 -> 20 Nov 2032 capture, plus
 * aftermath. Durations and dates follow the resolution doc's date
 * arithmetic exactly (all computed there, not guessed).
 *
 * `dayStart`/`dayEnd` are program days; null = open-ended/editorial.
 * Phases are fictional story framing; the arithmetic is real.
 */
const PROGRAM = Object.freeze({
  name: "STEAL THE MOON program",
  day0Label: "FIRST LIGHT",
  day0ISO: DAY0_ISO,
  captureDay: CAPTURE_DAY,
  captureISO: CAPTURE_ISO,
  totalDays: 4200,
  scopeNote:
    "Full program: secret inception (22 May 2021) \u2192 Earth capture burn (20 Nov 2032). " +
    "The Saturn\u2192Earth transit is the final 1,147 days (chain campaign 1,030 d + transfer leg 117 d).",
  source: "docs/chronology-resolution.md (RESOLVED 2026-09-20)",
  phases: Object.freeze([
    Object.freeze({
      id: "first-light",
      name: "FIRST LIGHT (program inception)",
      startISO: "2021-05-22",
      endISO: "2029-09-29",
      dayStart: 0,
      dayEnd: 3052,
      durationDays: 3053,
      docDurationDays: 3054,
      durationNote:
        "Source doc prints 3,054; 22 May 2021 \u2192 29 Sep 2029 is 3,052 days " +
        "(3,053 inclusive). Baked day numbers follow the ISO dates exactly.",
      event:
        "Secret torch program founded; target selection; ARGUS built; shepherd fleet assembled (captured asteroids)."
    }),
    Object.freeze({
      id: "midpoint",
      name: "Midpoint beat",
      startISO: "2027-02-20",
      endISO: "2027-02-20",
      dayStart: 2100,
      dayEnd: 2100,
      durationDays: 1,
      event: "ARGUS threads the first complete Saturn\u2192Earth trajectory."
    }),
    Object.freeze({
      id: "casing-return",
      name: "THE CASING \u2192 THE RETURN (Billiards campaign)",
      startISO: "2029-09-30",
      endISO: "2032-07-26",
      dayStart: 3053,
      dayEnd: 4083,
      durationDays: 1030,
      event:
        "12-link nuclear billiards: Phoebe recon \u2192 Gary \u2192 Beautiful Miss \u2192 Three-Moon Pocket \u2192 " +
        "Ring Problem \u2192 Clean Shot \u2192 Resonance \u2192 Tethys \u2192 Rhea \u2192 Titan/Hyperion (FORBIDDEN SHOT) \u2192 " +
        "Mimas escape \u2192 Earth transfer begins."
    }),
    Object.freeze({
      id: "lucky-77",
      name: "Lucky-77 demo",
      startISO: "2031-04-18",
      endISO: "2031-04-18",
      dayStart: 3618,
      dayEnd: 3618,
      durationDays: 1,
      event: 'Public "propulsion test" \u2014 actually a rehearsal, mid-campaign cover.'
    }),
    Object.freeze({
      id: "72-hours",
      name: "THE 72 HOURS (Saturn escape)",
      startISO: "2032-02-11",
      endISO: "2032-02-13",
      dayStart: 3917,
      dayEnd: 3919,
      durationDays: 3,
      event: "LINK 10: Mimas ripped out of Saturn's system; possible first crack (C3)."
    }),
    Object.freeze({
      id: "long-fall",
      name: "THE LONG FALL",
      startISO: "2032-07-26",
      endISO: "2032-11-20",
      dayStart: 4083,
      dayEnd: 4200,
      durationDays: 117,
      event: "Jupiter flyby (~10 Sep 2032); inward fall; four months of burns and assists."
    }),
    Object.freeze({
      id: "braking-burn",
      name: "THE BRAKING BURN",
      startISO: "2032-11-13",
      endISO: "2032-11-13",
      dayStart: 4193,
      dayEnd: 4193,
      durationDays: 1,
      event: "Herschel Slip: ~40 km fracture."
    }),
    Object.freeze({
      id: "capture",
      name: "CAPTURE (program day 4,200)",
      startISO: "2032-11-20",
      endISO: "2032-11-20",
      dayStart: 4200,
      dayEnd: 4200,
      durationDays: 1,
      event: "Capture perigee burn. The heist is complete."
    }),
    Object.freeze({
      id: "parking",
      name: "PARKING",
      startISO: "2032-11-20",
      endISO: "2032-12-04",
      dayStart: 4200,
      dayEnd: 4214,
      durationDays: 14,
      event: "Parked at distant retrograde orbit, ~70,000 km."
    }),
    Object.freeze({
      id: "mining",
      name: "MINING OPS",
      startISO: "2033-02-01",
      endISO: null,
      dayStart: 4273,
      dayEnd: null,
      durationDays: null,
      event: "He-3 mining begins \u2014 \u201Cmining the crack.\u201D"
    }),
    Object.freeze({
      id: "hearing",
      name: "THE HEARING",
      startISO: "2034",
      endISO: "2034",
      dayStart: null,
      dayEnd: null,
      durationDays: null,
      note: "Year-only pin in the source doc.",
      event: "Voss testifies; reader is committee counsel."
    }),
    Object.freeze({
      id: "fracture-watch",
      name: "FRACTURE WATCH / aftermath",
      startISO: "2035-01-01",
      endISO: "2049-12-31",
      dayStart: null,
      dayEnd: null,
      durationDays: null,
      event: "Orbital economy booms; crack monitored; Ending D's 2049 propagation lives here."
    }),
    Object.freeze({
      id: "declassified",
      name: "DECLASSIFIED",
      startISO: "2049-01-01",
      endISO: "2049-12-31",
      dayStart: null,
      dayEnd: null,
      durationDays: null,
      event: "Files released (and mis-stamped \u2014 see chronology-resolution.md \u00A74)."
    }),
    Object.freeze({
      id: "inquiry",
      name: "THE MIMAS INQUIRY assembled",
      startISO: "2051-01-01",
      endISO: "2051-12-31",
      dayStart: null,
      dayEnd: null,
      durationDays: null,
      event: "Dotty's documentary; 19 years after the heist."
    })
  ])
});

/* ------------------------------------------------------------------ */
/* Pinned events                                                       */
/* ------------------------------------------------------------------ */

/**
 * Pinned (editorial, non-locked) dates from chronology-resolution.md §7 Q3.
 * `day` is the program day (rounded); null where the pin is year-only.
 */
const PINNED_EVENTS = Object.freeze([
  Object.freeze({
    id: "jupiter-flyby",
    name: "Jupiter flyby",
    iso: "2032-09-10",
    day: 4129,
    note: "pinned, approximate"
  }),
  Object.freeze({
    id: "lucky-77",
    name: "Lucky-77 demo",
    iso: "2031-04-18",
    day: 3618,
    note: "pinned"
  }),
  Object.freeze({
    id: "braking-burn",
    name: "Braking burn",
    iso: "2032-11-13",
    day: 4193,
    note: "pinned"
  }),
  Object.freeze({
    id: "hearing",
    name: "The hearing",
    iso: "2034",
    day: null,
    note: "pinned, year only"
  }),
  Object.freeze({
    id: "mining",
    name: "Mining ops begin",
    iso: "2033-02",
    day: 4273,
    note: "pinned, month granularity"
  }),
  Object.freeze({
    id: "midpoint",
    name: "Program midpoint",
    iso: "2027-02-20",
    day: 2100,
    note: "day 2,100 of 4,200"
  }),
  Object.freeze({
    id: "ending-d",
    name: "Ending D (fracture propagation)",
    iso: "2049",
    day: null,
    note: "pinned, year only"
  }),
  Object.freeze({
    id: "capture",
    name: "Capture",
    iso: "2032-11-20",
    day: 4200,
    note: "program day 4,200 \u2014 locked"
  })
]);

/* ------------------------------------------------------------------ */
/* Slider + formatting                                                 */
/* ------------------------------------------------------------------ */

/**
 * Trajectory-map slider range: the final 117 days (transfer leg) up to
 * capture, per chronology-resolution.md §7 Q2 (the T\u2212117 option).
 *
 * @returns {{min:number, max:number, captureDay:number, captureJD:number, captureISO:string}}
 */
function sliderRange() {
  return {
    min: -117,
    max: 0,
    captureDay: CAPTURE_DAY,
    captureJD: CAPTURE_JD,
    captureISO: CAPTURE_ISO
  };
}

function comma(n) {
  return String(Math.trunc(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Formats a program day for the timeline UI.
 *
 * Days within the final-117-day window use T-scale ("T\u2212117" .. "T+0");
 * everything else uses program-day form ("DAY 2,100").
 *
 * @param {number} day - Program day.
 * @returns {string}
 */
function formatDay(day) {
  if (!Number.isFinite(day)) throw new TypeError("formatDay: day must be finite.");
  const d = Math.round(day);
  const fromCapture = d - CAPTURE_DAY;
  if (fromCapture <= 0 && fromCapture >= -117) {
    if (fromCapture === 0) return "T+0";
    return "T\u2212" + -fromCapture;
  }
  if (d < 0) return "DAY " + d; // pre-inception
  return "DAY " + comma(d);
}

/**
 * Phase containing a program day (or null outside all phases).
 * Point events (midpoint, Lucky-77, braking burn) sit inside longer phases,
 * so the most specific (shortest-span) match wins.
 *
 * @param {number} day
 * @returns {object|null}
 */
function phaseAt(day) {
  if (!Number.isFinite(day)) return null;
  let best = null;
  let bestSpan = Infinity;
  for (const p of PROGRAM.phases) {
    if (p.dayStart !== null && day >= p.dayStart &&
        (p.dayEnd === null || day <= p.dayEnd)) {
      const span = p.dayEnd === null ? Infinity : p.dayEnd - p.dayStart;
      if (span < bestSpan) {
        best = p;
        bestSpan = span;
      }
    }
  }
  return best;
}

/* ------------------------------------------------------------------ */
/* renderTimeline                                                      */
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

/**
 * Builds the scrubber DOM for the program timeline.
 *
 * @param {Element} container - Element to fill.
 * @param {object} [opts]
 * @param {function} [opts.onScrub] - Called with {day, iso, label} on input.
 * @param {number} [opts.min=-117] - Slider min (program days).
 * @param {number} [opts.max=4200] - Slider max (program days).
 * @returns {function|undefined} Cleanup function (removes listeners).
 */
function renderTimeline(container, opts = {}) {
  if (!hasDOM() || !container) return undefined;
  container.innerHTML = "";

  const min = opts.min != null ? opts.min : -117;
  const max = opts.max != null ? opts.max : CAPTURE_DAY;

  const wrap = el("div", "chrono-timeline");

  const slider = el("input", "chrono-slider");
  slider.type = "range";
  slider.min = String(min);
  slider.max = String(max);
  slider.step = "1";
  slider.value = String(max);
  slider.setAttribute("aria-label", "Program timeline scrubber");

  const readout = el("p", "chrono-readout");
  const phaseLine = el("p", "chrono-phase");

  // Pinned-event ticks.
  const ticks = el("div", "chrono-ticks");
  const tickEvents = PINNED_EVENTS.filter(
    (e) => e.day !== null && e.day >= min && e.day <= max
  );
  for (const e of tickEvents) {
    const t = el("button", "chrono-tick", e.name);
    t.type = "button";
    t.title = e.iso + " \u00B7 " + e.note;
    t.style.left =
      (100 * (e.day - min)) / Math.max(1, max - min) + "%";
    t.addEventListener("click", () => {
      slider.value = String(e.day);
      paint();
    });
    ticks.appendChild(t);
  }

  const paint = () => {
    const day = Number(slider.value);
    const iso = dayToDate(day);
    const label = formatDay(day);
    const phase = phaseAt(day);
    readout.textContent = label + " \u00B7 " + iso;
    phaseLine.textContent = phase ? phase.name + " \u2014 " + phase.event : "";
    if (typeof opts.onScrub === "function") {
      opts.onScrub({ day, iso, label, phase });
    }
  };
  slider.addEventListener("input", paint);

  wrap.appendChild(slider);
  wrap.appendChild(ticks);
  wrap.appendChild(readout);
  wrap.appendChild(phaseLine);
  container.appendChild(wrap);
  paint();

  return () => {
    slider.removeEventListener("input", paint);
  };
}

/* ------------------------------------------------------------------ */
/* Exports                                                             */
/* ------------------------------------------------------------------ */

export {
  PROGRAM,
  PINNED_EVENTS,
  DAY0_ISO,
  DAY0_JD,
  CAPTURE_DAY,
  CAPTURE_JD,
  CAPTURE_ISO,
  jdFromISO,
  dayToDate,
  dateToDay,
  dayOf,
  sliderRange,
  formatDay,
  phaseAt,
  renderTimeline
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PROGRAM,
    PINNED_EVENTS,
    DAY0_ISO,
    DAY0_JD,
    CAPTURE_DAY,
    CAPTURE_JD,
    CAPTURE_ISO,
    jdFromISO,
    dayToDate,
    dateToDay,
    dayOf,
    sliderRange,
    formatDay,
    phaseAt,
    renderTimeline
  };
}
