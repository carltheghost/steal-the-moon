/**
 * moonExplorer.js
 *
 * Data layer + UI logic for the 293-moon explorer screen of the
 * Steal the Moon artifact rebuild.
 *
 * Vanilla JS, zero dependencies. Pure functions only for the data layer —
 * no DOM framework assumptions. DOM rendering is handled by small `render*`
 * helpers that take a container element; they no-op safely when `document`
 * is unavailable (e.g. Node smoke tests).
 *
 * Data contract (from data/moons-293.json):
 *   { name, provisional, iau_number, discovery_year, discoverer,
 *     semi_major_axis_km, orbital_period_days, mean_radius_km,
 *     orbital_group, source, verified, note }
 *
 * Honesty rule (simulation-design.md §3): any record whose elements are
 * unverified or missing is marked `propagatable: false` and must NEVER get
 * invented elements. Its card shows the ELEMENTS UNVERIFIED note.
 *
 * Determinism: no Math.random anywhere in this file. All ordering is
 * deterministic (stable sorts by explicit keys).
 */

"use strict";

/* ------------------------------------------------------------------ */
/* Internal state                                                      */
/* ------------------------------------------------------------------ */

/** Loaded, normalized catalog records. */
let CATALOG = [];

/** Lookup index: lowercased name/provisional -> record. */
let INDEX = new Map();

/** Source file this catalog was built from (informational). */
let CATALOG_SOURCE = "data/moons-293.json";

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

/**
 * Normalizes and validates one raw catalog record.
 *
 * Does NOT invent data: missing numeric elements stay null, and any record
 * with `verified !== true` or a missing semi-major axis / orbital period is
 * marked `propagatable: false`.
 *
 * @param {object} raw - One record from moons-293.json.
 * @returns {object} Normalized record (frozen).
 * @throws {TypeError} When the record is not a usable object.
 */
function validateRecord(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new TypeError("loadCatalog: each catalog record must be an object.");
  }

  const numOrNull = (v) =>
    typeof v === "number" && Number.isFinite(v) ? v : null;

  const name =
    typeof raw.name === "string" && raw.name.trim() !== ""
      ? raw.name.trim()
      : null;
  const provisional =
    typeof raw.provisional === "string" && raw.provisional.trim() !== ""
      ? raw.provisional.trim()
      : null;

  if (name === null && provisional === null) {
    throw new TypeError(
      "loadCatalog: record has neither a name nor a provisional designation."
    );
  }

  const verified = raw.verified === true;
  const aKm = numOrNull(raw.semi_major_axis_km);
  const periodDays = numOrNull(raw.orbital_period_days);

  // Propagatable only when the elements are verified AND present.
  const propagatable = verified && aKm !== null && periodDays !== null;

  return Object.freeze({
    name,
    provisional,
    displayName: name !== null ? name : provisional,
    iauNumber:
      typeof raw.iau_number === "number" && Number.isFinite(raw.iau_number)
        ? raw.iau_number
        : null,
    discoveryYear:
      typeof raw.discovery_year === "number" &&
      Number.isFinite(raw.discovery_year)
        ? Math.trunc(raw.discovery_year)
        : null,
    discoverer:
      typeof raw.discoverer === "string" && raw.discoverer.trim() !== ""
        ? raw.discoverer.trim()
        : null,
    semiMajorAxisKm: aKm,
    orbitalPeriodDays: periodDays,
    meanRadiusKm: numOrNull(raw.mean_radius_km),
    orbitalGroup:
      typeof raw.orbital_group === "string" && raw.orbital_group.trim() !== ""
        ? raw.orbital_group.trim()
        : null,
    source: typeof raw.source === "string" ? raw.source : null,
    verified,
    propagatable,
    note: typeof raw.note === "string" ? raw.note : null
  });
}

/**
 * Loads and validates the 293-moon catalog.
 *
 * @param {object|Array} json - The parsed contents of data/moons-293.json
 *   (either the full object with a `moons` array, or the array itself).
 * @returns {number} The number of records loaded.
 * @throws {TypeError} On malformed input.
 */
function loadCatalog(json) {
  const arr = Array.isArray(json) ? json : json && json.moons;
  if (!Array.isArray(arr)) {
    throw new TypeError(
      "loadCatalog: expected an array or an object with a 'moons' array."
    );
  }

  const next = arr.map(validateRecord);

  CATALOG = next;
  INDEX = new Map();
  for (const rec of CATALOG) {
    if (rec.name) INDEX.set(rec.name.toLowerCase(), rec);
    if (rec.provisional) INDEX.set(rec.provisional.toLowerCase(), rec);
  }

  return CATALOG.length;
}

/** Returns the number of records currently loaded. */
function catalogSize() {
  return CATALOG.length;
}

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

/**
 * Case-insensitive search across names and provisional designations.
 * Ranked deterministically:
 *   0 exact name · 1 name prefix · 2 exact provisional · 3 name contains ·
 *   4 provisional prefix · 5 provisional contains · then alphabetical.
 *
 * @param {string} q - Query string.
 * @param {number} [limit=25] - Maximum results returned.
 * @returns {object[]} Ranked matching records.
 */
function search(q, limit = 25) {
  if (typeof q !== "string" || q.trim() === "") return [];
  const query = q.trim().toLowerCase();
  const hits = [];

  for (const rec of CATALOG) {
    const nm = rec.name ? rec.name.toLowerCase() : "";
    const pv = rec.provisional ? rec.provisional.toLowerCase() : "";
    let rank = -1;
    if (nm !== "" && nm === query) rank = 0;
    else if (nm !== "" && nm.startsWith(query)) rank = 1;
    else if (pv !== "" && pv === query) rank = 2;
    else if (nm !== "" && nm.includes(query)) rank = 3;
    else if (pv !== "" && pv.startsWith(query)) rank = 4;
    else if (pv !== "" && pv.includes(query)) rank = 5;
    if (rank >= 0) hits.push({ rec, rank });
  }

  hits.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    return a.rec.displayName < b.rec.displayName
      ? -1
      : a.rec.displayName > b.rec.displayName
        ? 1
        : 0;
  });

  return hits.slice(0, limit).map((h) => h.rec);
}

/* ------------------------------------------------------------------ */
/* Filtering                                                           */
/* ------------------------------------------------------------------ */

/**
 * Filters the catalog by group, discovery-year window, and propagatability.
 *
 * @param {object} [opts]
 * @param {string|string[]} [opts.group] - Orbital group(s); exact match.
 * @param {number} [opts.yearMin] - Inclusive discovery-year lower bound.
 * @param {number} [opts.yearMax] - Inclusive discovery-year upper bound.
 * @param {boolean} [opts.propagatable] - Keep only records matching this.
 * @returns {object[]} Matching records, in catalog order (deterministic).
 */
function filterBy(opts = {}) {
  const groups = opts.group == null
    ? null
    : new Set(Array.isArray(opts.group) ? opts.group : [opts.group]);
  const yearMin = opts.yearMin == null ? -Infinity : opts.yearMin;
  const yearMax = opts.yearMax == null ? Infinity : opts.yearMax;

  return CATALOG.filter((rec) => {
    if (groups !== null && !groups.has(rec.orbitalGroup)) return false;
    if (rec.discoveryYear === null) {
      if (opts.yearMin != null || opts.yearMax != null) return false;
    } else {
      if (rec.discoveryYear < yearMin || rec.discoveryYear > yearMax) {
        return false;
      }
    }
    if (opts.propagatable != null && rec.propagatable !== opts.propagatable) {
      return false;
    }
    return true;
  });
}

/* ------------------------------------------------------------------ */
/* Groups                                                              */
/* ------------------------------------------------------------------ */

/**
 * Dynamical-group membership counts.
 *
 * @returns {object} Counts for Norse / Inuit / Gallic / Phoebe (the four
 *   outer irregular groups), plus every other group present, plus `total`.
 */
function groups() {
  const counts = {};
  for (const rec of CATALOG) {
    const g = rec.orbitalGroup === null ? "(unassigned)" : rec.orbitalGroup;
    counts[g] = (counts[g] || 0) + 1;
  }
  return Object.freeze({
    Norse: counts["Norse"] || 0,
    Inuit: counts["Inuit"] || 0,
    Gallic: counts["Gallic"] || 0,
    Phoebe: counts["Phoebe group"] || 0,
    other: Object.freeze(counts),
    total: CATALOG.length
  });
}

/* ------------------------------------------------------------------ */
/* Discovery timeline                                                  */
/* ------------------------------------------------------------------ */

/**
 * Cumulative discovery timeline for the scrubber.
 *
 * @param {object} [opts]
 * @param {number} [opts.from=1789] - First year (1789: first Herschel-era
 *   discoveries, per the screen brief). Earlier years exist in the data
 *   (e.g. Titan, 1655) and are included in cumulative counts.
 * @param {number} [opts.to=2026] - Last year.
 * @returns {Array<{year:number, cumulative:number, discovered:number}>}
 *   One entry per year, ascending.
 */
function discoveryTimeline(opts = {}) {
  const from = opts.from != null ? Math.trunc(opts.from) : 1789;
  const to = opts.to != null ? Math.trunc(opts.to) : 2026;

  const perYear = new Map();
  for (const rec of CATALOG) {
    if (rec.discoveryYear === null) continue;
    perYear.set(rec.discoveryYear, (perYear.get(rec.discoveryYear) || 0) + 1);
  }

  const out = [];
  // Seed cumulative with discoveries before the scrubber window
  // (e.g. Titan 1655), so the total always reconciles to the catalog.
  let cumulative = 0;
  for (const rec of CATALOG) {
    if (rec.discoveryYear !== null && rec.discoveryYear < from) cumulative += 1;
  }
  for (let year = from; year <= to; year += 1) {
    const discovered = perYear.get(year) || 0;
    cumulative += discovered;
    out.push({ year, cumulative, discovered });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Fact cards                                                          */
/* ------------------------------------------------------------------ */

/**
 * Fact card for one moon, looked up by name or provisional designation
 * (case-insensitive).
 *
 * Unverifiable/unknown records carry an honest note instead of invented
 * elements.
 *
 * @param {string} name - Moon name or provisional designation.
 * @returns {object|null} Card object, or null when not found.
 */
function moonCard(name) {
  if (typeof name !== "string") return null;
  const rec = INDEX.get(name.trim().toLowerCase());
  if (!rec) return null;

  const card = {
    displayName: rec.displayName,
    provisional: rec.provisional,
    discoveryYear: rec.discoveryYear,
    discoverer: rec.discoverer,
    orbitalGroup: rec.orbitalGroup,
    meanRadiusKm: rec.meanRadiusKm,
    semiMajorAxisKm: rec.semiMajorAxisKm,
    orbitalPeriodDays: rec.orbitalPeriodDays,
    propagatable: rec.propagatable,
    verified: rec.verified,
    source: rec.source,
    legend: {
      tag: "REAL PHYSICS",
      elementsNote: rec.propagatable
        ? null
        : "ELEMENTS UNVERIFIED \u2014 position shown at catalog epoch, " +
          "not propagated. No elements were invented for this record."
    }
  };

  if (rec.note) card.catalogNote = rec.note;

  return Object.freeze(card);
}

/* ------------------------------------------------------------------ */
/* render* helpers (vanilla DOM, container-element based)              */
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

function fmtNum(v, digits) {
  if (v === null || v === undefined) return "\u2014";
  return Number(v).toLocaleString("en-US", {
    maximumFractionDigits: digits == null ? 1 : digits
  });
}

/**
 * Renders ranked search results into a container.
 *
 * @param {Element} container - Element to fill.
 * @param {object[]} results - Records from search().
 * @param {function} [onSelect] - Called with the record on click.
 */
function renderSearchResults(container, results, onSelect) {
  if (!hasDOM() || !container) return;
  container.innerHTML = "";
  const list = el("ul", "moon-explorer-results");
  for (const rec of results) {
    const li = el("li", "moon-explorer-result");
    const btn = el("button", "moon-explorer-result-btn");
    btn.type = "button";
    btn.textContent =
      rec.displayName +
      (rec.name && rec.provisional ? " (" + rec.provisional + ")" : "") +
      (rec.discoveryYear ? " \u00B7 " + rec.discoveryYear : "") +
      (rec.propagatable ? "" : " \u00B7 ELEMENTS UNVERIFIED");
    btn.addEventListener("click", () => {
      if (typeof onSelect === "function") onSelect(rec);
    });
    li.appendChild(btn);
    list.appendChild(li);
  }
  if (results.length === 0) {
    list.appendChild(el("li", "moon-explorer-empty", "No moons match."));
  }
  container.appendChild(list);
}

/**
 * Renders a moon fact card (from moonCard()) into a container.
 *
 * @param {Element} container - Element to fill.
 * @param {object} card - Card object from moonCard().
 */
function renderMoonCard(container, card) {
  if (!hasDOM() || !container || !card) return;
  container.innerHTML = "";

  const wrap = el("article", "moon-card");
  wrap.appendChild(el("h3", "moon-card-title", card.displayName));

  const tag = el("span", "moon-card-tag tag-real-physics", card.legend.tag);
  wrap.appendChild(tag);

  const dl = el("dl", "moon-card-facts");
  const rows = [
    ["Designation", card.provisional],
    [
      "Discovered",
      card.discoveryYear === null
        ? "\u2014"
        : card.discoveryYear +
          (card.discoverer ? " \u00B7 " + card.discoverer : "")
    ],
    ["Group", card.orbitalGroup],
    [
      "Mean radius",
      card.meanRadiusKm === null ? "\u2014" : fmtNum(card.meanRadiusKm, 2) + " km"
    ],
    [
      "Semi-major axis",
      card.semiMajorAxisKm === null ? "\u2014" : fmtNum(card.semiMajorAxisKm, 1) + " km"
    ],
    [
      "Orbital period",
      card.orbitalPeriodDays === null
        ? "\u2014"
        : fmtNum(card.orbitalPeriodDays, 5) + " days"
    ],
    ["Propagatable", card.propagatable ? "yes" : "no"]
  ];
  for (const [k, v] of rows) {
    dl.appendChild(el("dt", "moon-card-dt", k));
    dl.appendChild(el("dd", "moon-card-dd", v === null ? "\u2014" : String(v)));
  }
  wrap.appendChild(dl);

  if (card.legend.elementsNote) {
    wrap.appendChild(el("p", "moon-card-warning", card.legend.elementsNote));
  }
  if (card.catalogNote) {
    wrap.appendChild(el("p", "moon-card-note", "Catalog note: " + card.catalogNote));
  }
  if (card.source) {
    wrap.appendChild(el("p", "moon-card-source", "Source: " + card.source));
  }

  container.appendChild(wrap);
}

/**
 * Renders the discovery-timeline scrubber (from discoveryTimeline()).
 *
 * @param {Element} container - Element to fill.
 * @param {Array} timeline - Output of discoveryTimeline().
 * @param {object} [opts]
 * @param {function} [opts.onScrub] - Called with the timeline entry on input.
 */
function renderTimelineScrubber(container, timeline, opts = {}) {
  if (!hasDOM() || !container || !Array.isArray(timeline)) return;
  container.innerHTML = "";

  const wrap = el("div", "moon-timeline");
  const input = el("input", "moon-timeline-slider");
  input.type = "range";
  input.min = String(timeline.length ? timeline[0].year : 1789);
  input.max = String(timeline.length ? timeline[timeline.length - 1].year : 2026);
  input.step = "1";
  input.value = input.max;

  const readout = el("p", "moon-timeline-readout");
  const paint = () => {
    const year = Number(input.value);
    const entry = timeline.find((e) => e.year === year);
    readout.textContent = entry
      ? year + " \u2014 " + entry.cumulative + " moons known"
      : String(year);
    if (typeof opts.onScrub === "function") opts.onScrub(entry || null);
  };
  input.addEventListener("input", paint);
  wrap.appendChild(input);
  wrap.appendChild(readout);
  container.appendChild(wrap);
  paint();
}

/**
 * Renders group counts (from groups()) into a container.
 *
 * @param {Element} container - Element to fill.
 * @param {object} groupCounts - Output of groups().
 */
function renderGroupCounts(container, groupCounts) {
  if (!hasDOM() || !container || !groupCounts) return;
  container.innerHTML = "";
  const dl = el("dl", "moon-groups");
  for (const g of ["Norse", "Inuit", "Gallic", "Phoebe"]) {
    dl.appendChild(el("dt", "moon-groups-dt", g + " group"));
    dl.appendChild(el("dd", "moon-groups-dd", String(groupCounts[g])));
  }
  dl.appendChild(el("dt", "moon-groups-dt", "Total catalog"));
  dl.appendChild(el("dd", "moon-groups-dd", String(groupCounts.total)));
  container.appendChild(dl);
}

export {
  loadCatalog,
  catalogSize,
  search,
  filterBy,
  groups,
  discoveryTimeline,
  moonCard,
  renderSearchResults,
  renderMoonCard,
  renderTimelineScrubber,
  renderGroupCounts
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    loadCatalog,
    catalogSize,
    search,
    filterBy,
    groups,
    discoveryTimeline,
    moonCard,
    renderSearchResults,
    renderMoonCard,
    renderTimelineScrubber,
    renderGroupCounts
  };
}
