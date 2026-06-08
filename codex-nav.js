// ============================================================
// CODEX MALEDICTUS, NAVIGATION BRAIN v4
// codex-nav.js, lives in repo root, imported by every page
//
// CHANGES FROM v3:
//   - customDoors flag: a page that builds its own bespoke descent
//     gate (e.g. infection-lore's Apocrypha gate) sets customDoors:true.
//     The nav then SUPPRESSES its generic door grid on that page and
//     renders the framing only (arrival, position, realm, whisper), so
//     the page's hand-built gate is the single forward motion. No more
//     double-stacked forks.
//   - Per-realm VOICE: the realm/phase meta now carries the
//     verifiability descent from the Canon Bible (Realm I checkable ...
//     Realm III nothing resolves). The nav teaches the cosmology as you
//     descend instead of printing a dead label.
//   - Per-phase GLYPH: the divider glyph changes with the phase, so each
//     rung of the descent feels distinct.
//   - Deepening ARRIVAL line: reacts to how many times you have stood in
//     a room and whether you came the canonical way or jumped via the hub.
//   - Signal-driven WHISPER: an optional second whisper derived from the
//     shared silent signals (hour, return count, days-since-first). Silent,
//     client-side, no network. Restraint preserved: at most one extra line.
//
// STATE SHARED WITH PAGES (read-only here):
//   codex_witness_state_v2 , bearer flag, firstWitnessVisit, totalVisits
//   codex_invocation_log   , per-room visit log (also written by pages)
//   The cipher channel (codex_cipher_v1) is NEVER touched here.
//
// CANONICAL DESCENT (22 entries), unchanged from v3.
//
// TO MARK A PAGE AS HAVING ITS OWN GATE:
//   Set customDoors:true on its CODEX_MAP entry. The nav will frame it
//   but not add competing doors. The canonical descent must still be
//   reachable from that page's own gate (or via the Pale Archive hub).
// ============================================================

const CODEX_MAP = {

  // ── 00 · ENTRY: THE HOMEPAGE ─────────────────────────────────
  "index": {
    file:            "index.html",
    title:           "The Pale Archivum",
    seq:             0,
    realm:           "I",
    phase:           "Surface",
    description:     "The face of the document. The first threshold.",
    closingWhisper:  "You were brought here.",
    pathA:           "pale-archive",
    pathB:           "infection-remembers",
    labelA:          "Consult the Archive",
    labelB:          "Begin the descent",
    bearerChamber:   null
  },

  // ── 01 · INDEX: THE PALE ARCHIVE ─────────────────────────────
  "pale-archive": {
    file:            "pale-archive.html",
    title:           "The Pale Archive",
    seq:             1,
    realm:           "I",
    phase:           "Index",
    description:     "The Codex's table of contents. The list of pages still reading you.",
    closingWhisper:  "The last entry is yours.",
    pathA:           null,
    pathB:           null,
    labelA:          null,
    labelB:          null,
    bearerChamber:   null
  },

  // ════════════════════════════════════════════════════════════
  // CLUSTER II · THE INFECTION REMEMBERS · Ritual Transmission I
  // ════════════════════════════════════════════════════════════

  // ── 02 · TRANSMISSION ────────────────────────────────────────
  // customDoors: this page builds its own forward gate (Continue to the
  // Lore). Single-line descent, no skip fork. The nav frames it only.
  "infection-remembers": {
    file:            "infection-remembers.html",
    title:           "The Infection Remembers",
    seq:             2,
    realm:           "I",
    phase:           "Ritual Transmission",
    description:     "The day the document remembered itself. The first audible breach.",
    closingWhisper:  "It is still remembering.",
    pathA:           "infection-lore",
    pathB:           null,
    labelA:          "Read the Lore",
    labelB:          null,
    customDoors:     true,
    bearerChamber:   null
  },

  // ── 03 · LORE ────────────────────────────────────────────────
  // customDoors: this page builds its own Apocrypha gate. The nav
  // frames it but does not add the generic door grid.
  "infection-lore": {
    file:            "infection-lore.html",
    title:           "Lore of the Infection",
    seq:             3,
    realm:           "I",
    phase:           "Lore",
    description:     "The theoretical framework the Archivum built around the breach. It did not contain what it described.",
    closingWhisper:  "The framework did not hold.",
    pathA:           "apocrypha-infection",
    pathB:           "chronicle-1-infection-remembers",
    labelA:          "Read the Apocrypha",
    labelB:          "Enter the Chronicle",
    customDoors:     true,
    bearerChamber:   null
  },

  // ── 04 · APOCRYPHA ──────────────────────────────────────────
  // customDoors: this page builds its own in-universe crossing to the
  // Chronicle (the no-origin reveal extends to Apollo). The nav frames
  // it but does not render the generic door grid.
  "apocrypha-infection": {
    file:            "apocrypha-infection.html",
    title:           "Apocrypha · The Infection",
    seq:             4,
    realm:           "I",
    phase:           "Apocrypha",
    description:     "What the Archivum recorded but did not publish. Five chambers. The Reader's File builds itself in real time.",
    closingWhisper:  "Authorization was never going to arrive.",
    customDoors:     true,
    pathA:           "chronicle-1-infection-remembers",
    pathB:           null,
    labelA:          "Enter the Chronicle",
    labelB:          null,
    bearerChamber:   null
  },

  // ── 05 · CHRONICLE ──────────────────────────────────────────
  "chronicle-1-infection-remembers": {
    file:            "chronicle-1-infection-remembers.html",
    title:           "Chronicle I · The Infection Remembers",
    seq:             5,
    realm:           "I",
    phase:           "Chronicle",
    description:     "Seven sigil seals crack open in sequence. Each reveals Apollo's private annotation. Seal VII was not written by him.",
    closingWhisper:  "Each remembering is the first remembering.",
    pathA:           "lore-chronicle-1",
    pathB:           "apocrypha-chronicle-1",
    labelA:          "Read the Chronicle Lore",
    labelB:          "Read the Chronicle Apocrypha",
    bearerChamber:   null
  },

  // ── 06 · CHRONICLE LORE ─────────────────────────────────────
  "lore-chronicle-1": {
    file:            "lore-chronicle-1.html",
    title:           "Chronicle I · Deeper Lore",
    seq:             6,
    realm:           "I",
    phase:           "Chronicle Lore",
    description:     "The chronicle continued. Apollo's seven private annotations expanded into their fuller form. Each annotation grows darker as it deepens.",
    closingWhisper:  "The chronicles do not end.",
    pathA:           "apocrypha-chronicle-1",
    pathB:           "plague-priest-liturgy",
    labelA:          "Read the Chronicle Apocrypha",
    labelB:          "Begin the next transmission",
    bearerChamber:   null
  },

  // ── 07 · CHRONICLE APOCRYPHA ───────────────────────────────
  "apocrypha-chronicle-1": {
    file:            "apocrypha-chronicle-1.html",
    title:           "Apocrypha · Chronicle I",
    seq:             7,
    realm:           "I",
    phase:           "Chronicle Apocrypha",
    description:     "The Seven Truths. The Three Realms classified. The Hollow Choir case files. The Reader's File. What you cannot unknow.",
    closingWhisper:  "They signed it anyway. The signatures appear in handwriting that is no longer theirs.",
    pathA:           "plague-priest-liturgy",
    pathB:           "rf-093-lore",
    labelA:          "Find the Plague Priest",
    labelB:          "Follow the Recovered Fragments",
    bearerChamber:   null
  },

  // ════════════════════════════════════════════════════════════
  // CLUSTER III · THE PLAGUE PRIEST · Ritual Transmission II
  // ════════════════════════════════════════════════════════════

  // ── 08 · TRANSMISSION ───────────────────────────────────────
  "plague-priest-liturgy": {
    file:            "plague-priest-liturgy.html",
    title:           "The Plague Priest · Liturgy",
    seq:             8,
    realm:           "I-II",
    phase:           "Ritual Transmission",
    description:     "The first known audio rite of the Codex Maledictus. Recovered from Deck Hollow-13 in spore-static.",
    closingWhisper:  "Loop with caution.",
    pathA:           "plague-priest-lore",
    pathB:           "plague-priest-decoder",
    labelA:          "Read the Lore",
    labelB:          "Decode the signal",
    bearerChamber:   null
  },

  // ── 09 · LORE ────────────────────────────────────────────────
  "plague-priest-lore": {
    file:            "plague-priest-lore.html",
    title:           "The Plague Priest · Lore",
    seq:             9,
    realm:           "I-II",
    phase:           "Lore",
    description:     "Not a person. A configuration mortals enter. Three identical witness descriptions from people who have never met.",
    closingWhisper:  "The posture teaches itself by being held.",
    pathA:           "plague-priest-decoder",
    pathB:           "plague-priest-apocrypha",
    labelA:          "Decode the signal",
    labelB:          "Read the Apocrypha",
    bearerChamber:   null
  },

  // ── 10 · DECODER ────────────────────────────────────────────
  "plague-priest-decoder": {
    file:            "plague-priest-decoder.html",
    title:           "The Plague Priest · Decoder",
    seq:             10,
    realm:           "I-II",
    phase:           "Decoder",
    description:     "The Liturgy decoded line by line. Three layers per verse. The Hidden Doctrine has never been published outside the Archivum.",
    closingWhisper:  "You may be drawing one of the glyphs now.",
    pathA:           "plague-priest-apocrypha",
    pathB:           "rf-093-lore",
    labelA:          "Read the Apocrypha",
    labelB:          "Follow the Recovered Fragments",
    bearerChamber:   null
  },

  // ── 11 · APOCRYPHA ──────────────────────────────────────────
  "plague-priest-apocrypha": {
    file:            "plague-priest-apocrypha.html",
    title:           "Apocrypha · The Plague Priest",
    seq:             11,
    realm:           "I-II",
    phase:           "Apocrypha",
    description:     "What the Plague Priest left in the Cathedral that the Archivum has declined to publish. The third seal has never been opened.",
    closingWhisper:  "The unsaid is the louder half.",
    pathA:           "rf-093-lore",
    pathB:           "codex-remembers-you",
    labelA:          "Follow the Recovered Fragments",
    labelB:          "Open the artifact",
    bearerChamber:   null
  },

  // ════════════════════════════════════════════════════════════
  // CLUSTER IV · RECOVERED FRAGMENTS · The RF-093 Sequence
  // (Parallel category, not a Ritual Transmission cluster)
  // ════════════════════════════════════════════════════════════

  // ── 12 · RF LORE ────────────────────────────────────────────
  "rf-093-lore": {
    file:            "rf-093-lore.html",
    title:           "Recovered Fragment 093 · Lore",
    seq:             12,
    realm:           "I",
    phase:           "Lore",
    description:     "The first fragment that survived the redaction. First documented appearance of Elvain Vhris.",
    closingWhisper:  "Other fragments survive. We have not found them.",
    pathA:           "rf-093-invocation",
    pathB:           "rf-093-mirror",
    labelA:          "Read the Invocation",
    labelB:          "Find what it mirrors",
    bearerChamber:   null
  },

  // ── 13 · RF INVOCATION ──────────────────────────────────────
  "rf-093-invocation": {
    file:            "rf-093-invocation.html",
    title:           "Recovered Fragment 093 · Invocation",
    seq:             13,
    realm:           "I",
    phase:           "Invocation",
    description:     "The words the analyst was found writing on Day 11. She had not been taught these words.",
    closingWhisper:  "Her hand kept writing after she had stopped.",
    pathA:           "rf-093-mirror",
    pathB:           "rf-093-apocrypha",
    labelA:          "Find what it mirrors",
    labelB:          "Read the Apocrypha",
    bearerChamber:   null
  },

  // ── 14 · RF MIRROR ──────────────────────────────────────────
  "rf-093-mirror": {
    file:            "rf-093-mirror.html",
    title:           "Recovered Fragment 093 · Mirror",
    seq:             14,
    realm:           "I",
    phase:           "Mirror",
    description:     "What Fragment 093 reflects back at the reader. The reader sees something behind them.",
    closingWhisper:  "The reflection is older than the source.",
    pathA:           "rf-093-apocrypha",
    pathB:           "codex-remembers-you",
    labelA:          "Read the Apocrypha",
    labelB:          "Open the artifact",
    bearerChamber:   null
  },

  // ── 15 · RF APOCRYPHA ───────────────────────────────────────
  "rf-093-apocrypha": {
    file:            "rf-093-apocrypha.html",
    title:           "Apocrypha · Recovered Fragment 093",
    seq:             15,
    realm:           "I",
    phase:           "Apocrypha",
    description:     "The reading that should not have been preserved. Preservation was not the analyst's decision.",
    closingWhisper:  "Preservation was not the analyst's decision.",
    pathA:           "codex-remembers-you",
    pathB:           "memory-engine-1",
    labelA:          "Open the artifact",
    labelB:          "Find the mechanism",
    bearerChamber:   null
  },

  // ════════════════════════════════════════════════════════════
  // CLUSTER V · THE ARTIFACT AND THE ENGINE
  // ════════════════════════════════════════════════════════════

  // ── 16 · ARTIFACT ───────────────────────────────────────────
  "codex-remembers-you": {
    file:            "codex-remembers-you.html",
    title:           "The Codex That Remembers You",
    seq:             16,
    realm:           "I",
    phase:           "Artifact",
    description:     "A file seized from a Queens evidence locker. The analyst who documented it has not been seen since Day 11.",
    closingWhisper:  "The file is still open.",
    pathA:           "memory-engine-1",
    pathB:           "gospel-forgotten-flesh",
    labelA:          "Find the mechanism",
    labelB:          "Enter the Gospel",
    bearerChamber:   null
  },

  // ── 17 · MECHANISM ──────────────────────────────────────────
  "memory-engine-1": {
    file:            "memory-engine-1.html",
    title:           "The Memory Engine",
    seq:             17,
    realm:           "I",
    phase:           "Mechanism",
    description:     "The mechanism by which the document holds you. Memory as infrastructure.",
    closingWhisper:  "The engine does not pause to ask.",
    pathA:           "gospel-forgotten-flesh",
    pathB:           "confession-ledger",
    labelA:          "Enter the Gospel",
    labelB:          "Find the Ledger",
    bearerChamber:   null
  },

  // ════════════════════════════════════════════════════════════
  // CLUSTER VI · THE GOSPEL · Broadcast Source
  // ════════════════════════════════════════════════════════════

  // ── 18 · BROADCAST SOURCE ───────────────────────────────────
  "gospel-forgotten-flesh": {
    file:            "gospel-forgotten-flesh.html",
    title:           "The Gospel of Forgotten Flesh",
    seq:             18,
    realm:           "I",
    phase:           "Broadcast Source",
    description:     "The album from which every Ritual Transmission is relayed. The third Remembering of the current cycle.",
    closingWhisper:  "You have heard them already. You did not know.",
    pathA:           "confession-ledger",
    pathB:           "witness-circle",
    labelA:          "Find the Ledger",
    labelB:          "Approach the seam",
    bearerChamber:   null
  },

  // ════════════════════════════════════════════════════════════
  // CLUSTER VII · SEALED CHAMBERS · Beyond the Surface
  // ════════════════════════════════════════════════════════════

  // ── 19 · SEALED · THE LEDGER ────────────────────────────────
  "confession-ledger": {
    file:            "confession-ledger.html",
    title:           "The Confession Ledger",
    seq:             19,
    realm:           "I-III",
    phase:           "Sealed",
    description:     "What the marked have written. What the marked could not stop writing.",
    closingWhisper:  "The ledger fills itself in your absence.",
    pathA:           "witness-circle",
    pathB:           "pale-archive",
    labelA:          "Cross the seam",
    labelB:          "Return to the Archive",
    bearerChamber:   null
  },

  // ── 20 · SEALED · BEARER ────────────────────────────────────
  "witness-circle": {
    file:            "witness-circle.html",
    title:           "The Witness Circle",
    seq:             20,
    realm:           "I-II-III",
    phase:           "Sealed · Bearer",
    description:     "The inner reading. By invocation only.",
    closingWhisper:  "The room is always here.",
    pathA:           null,
    pathB:           "pale-archive",
    labelA:          null,
    labelB:          "Return to the Archive",
    bearerChamber:   null
  },

  // ════════════════════════════════════════════════════════════
  // REFERENCE · Outside the Canonical Descent
  // ════════════════════════════════════════════════════════════

  "Codex-Sigil": {
    file:            "Codex-Sigil.html",
    title:           "The Codex Sigil",
    seq:             null,
    realm:           "Ref",
    phase:           "Reference",
    description:     "The seal that holds. The seal that leaks. Used to verify recovered fragments by alignment.",
    closingWhisper:  "The seal was never going to hold.",
    pathA:           "pale-archive",
    pathB:           "witness-circle",
    labelA:          "Return to the Archive",
    labelB:          "Cross the seam",
    bearerChamber:   null
  }

};

// ============================================================
// VOICE TABLES, the realm teaches the verifiability descent, the
// phase gives the divider its own glyph. (Canon Bible, Part V.)
// ============================================================

const REALM_GLOSS = {
  "I":        "what can still be verified",
  "I-II":     "the edge of the checkable",
  "I-II-III": "past the edge; verification ends here",
  "II":       "belief made into architecture",
  "III":      "before language; nothing here resolves",
  "Ref":      "outside the descent"
};

const PHASE_GLYPH = {
  "Surface":             "🜏",
  "Index":               "∴",
  "Ritual Transmission": "🜃",
  "Lore":                "🜄",
  "Apocrypha":           "✠",
  "Chronicle":           "☓",
  "Chronicle Lore":      "☓",
  "Chronicle Apocrypha": "✠",
  "Decoder":             "⊟",
  "Invocation":          "☍",
  "Mirror":              "◐",
  "Artifact":            "⬡",
  "Mechanism":           "⊕",
  "Broadcast Source":    "✴",
  "Sealed":              "⛤",
  "Sealed · Bearer":     "⛤",
  "Reference":           "🜏"
};

// ============================================================
// STATE, Reads the Witness Circle's localStorage to detect Bearer
// status and the shared visit log. The cipher channel is untouched.
// ============================================================

const NAV_STATE_KEY = 'codex_witness_state_v2';
const NAV_LOG_KEY = 'codex_invocation_log';

function navLoadState() {
  try {
    const r = localStorage.getItem(NAV_STATE_KEY);
    return r ? JSON.parse(r) : {};
  } catch(e) { return {}; }
}

function navIsBearer() {
  const s = navLoadState();
  return !!s.bearer;
}

function navLoadLog() {
  try {
    const r = localStorage.getItem(NAV_LOG_KEY);
    return r ? JSON.parse(r) : [];
  } catch(e) { return []; }
}

function navAppendLog(pageId) {
  try {
    let log = navLoadLog();
    // Don't add duplicates back-to-back
    if (log.length === 0 || log[log.length-1].id !== pageId) {
      log.push({ id: pageId, at: Date.now() });
      if (log.length > 40) log = log.slice(-40);
      localStorage.setItem(NAV_LOG_KEY, JSON.stringify(log));
    }
  } catch(e) {}
}

function navPreviousPage(currentId) {
  const log = navLoadLog();
  for (let i = log.length - 1; i >= 0; i--) {
    if (log[i].id !== currentId) return CODEX_MAP[log[i].id] || null;
  }
  return null;
}

function navPreviousPageId(currentId) {
  const log = navLoadLog();
  for (let i = log.length - 1; i >= 0; i--) {
    if (log[i].id !== currentId) return log[i].id;
  }
  return null;
}

function navVisitCount(pageId) {
  const log = navLoadLog();
  return log.filter(e => e.id === pageId).length;
}

// ============================================================
// SILENT SIGNALS, what the nav can know without asking. No
// permission prompts, no network. Mirrors the pages' own signal
// derivation so the nav and the page agree about who you are.
// ============================================================

function navSignals() {
  const s = navLoadState();
  const now = new Date();
  const hour = now.getHours();
  const hourBand = hour < 5 ? 'dead' : hour < 9 ? 'waking' : hour < 17 ? 'working' : hour < 22 ? 'evening' : 'dead';
  const daysSinceFirst = s.firstWitnessVisit ? Math.floor((Date.now() - s.firstWitnessVisit) / 86400000) : 0;
  const totalVisits = s.totalVisits || 0;
  return { hour, hourBand, daysSinceFirst, totalVisits };
}

// The deepening arrival line: where you came from, how often you have
// stood here, and whether you came the canonical way or jumped the hub.
function navArrivalLine(currentId, prev, prevId, visits) {
  if (visits >= 3) {
    return `You keep returning to this room. It has begun to expect you.`;
  }
  if (prev) {
    const cameCanonical = prevId && (CODEX_MAP[prevId].pathA === currentId || CODEX_MAP[prevId].pathB === currentId);
    if (visits === 2) {
      return `You arrived from <em>${prev.title}</em>, again.`;
    }
    if (cameCanonical) {
      return `You arrived from <em>${prev.title}</em>.`;
    }
    return `You arrived from <em>${prev.title}</em>, though not by the way the descent runs. The Archive permits it.`;
  }
  if (visits > 1) {
    return `You have stood in this room ${visits} times.`;
  }
  return '';
}

// The optional second whisper, derived from silent signals. Restraint:
// returns at most one line, and often null.
function navSignalWhisper(sig) {
  if (sig.totalVisits > 1 && sig.daysSinceFirst >= 13) {
    return `You returned on the thirteenth day. The room counted.`;
  }
  if (sig.hourBand === 'dead') {
    return `You are here at an hour the Archive keeps for itself.`;
  }
  if (sig.totalVisits > 1 && sig.daysSinceFirst >= 1) {
    return `The room did not close in the ${sig.daysSinceFirst} day${sig.daysSinceFirst > 1 ? 's' : ''} you were gone.`;
  }
  return null;
}

// ============================================================
// PALETTE, Pulls colors from the page's CSS variables
// Falls back to gold defaults if a page doesn't define them
// ============================================================

function navResolvePalette() {
  const isBearer = navIsBearer();
  const path = window.location.pathname.toLowerCase();
  const isWitnessPage = (document.body && document.body.classList.contains('witness-page')) ||
                        path.includes('witness-circle');
  const isPaleArchivePage = path.includes('pale-archive');

  // Pale Archive parchment palette, ink-on-bone aesthetic
  if (isPaleArchivePage) {
    return {
      accent: '#8A6520', accentDim: 'rgba(138,101,32,0.45)',
      cross: '#7A1C12', crossDim: 'rgba(122,28,18,0.35)',
      bearer: '#9A6B1C', bearerDim: 'rgba(154,107,28,0.5)',
      whisper: 'rgba(74,58,40,0.55)'
    };
  }

  // Witness Circle override: teal pre-Oath, amber post-Oath
  if (isWitnessPage && isBearer) {
    return {
      accent: '#E0C878', accentDim: 'rgba(224,200,120,0.45)',
      cross: '#7A1212', crossDim: 'rgba(122,18,18,0.35)',
      bearer: '#E0C878', bearerDim: 'rgba(224,200,120,0.45)',
      whisper: 'rgba(224,200,120,0.45)'
    };
  }
  if (isWitnessPage) {
    return {
      accent: '#8FF0E5', accentDim: 'rgba(143,240,229,0.45)',
      cross: '#7A1212', crossDim: 'rgba(122,18,18,0.35)',
      bearer: '#E0C878', bearerDim: 'rgba(224,200,120,0.45)',
      whisper: 'rgba(143,240,229,0.4)'
    };
  }

  // Bearer-aware default for dark pages: amber tint
  if (isBearer) {
    return {
      accent: '#E0C878', accentDim: 'rgba(224,200,120,0.4)',
      cross: '#7A1212', crossDim: 'rgba(122,18,18,0.4)',
      bearer: '#E0C878', bearerDim: 'rgba(224,200,120,0.5)',
      whisper: 'rgba(224,200,120,0.4)'
    };
  }

  // Default: gold and crimson on dark
  return {
    accent: '#C9A84C', accentDim: 'rgba(201,168,76,0.35)',
    cross: '#7A1212', crossDim: 'rgba(122,18,18,0.35)',
    bearer: '#E0C878', bearerDim: 'rgba(224,200,120,0.5)',
    whisper: 'rgba(201,168,76,0.32)'
  };
}

// ============================================================
// NAV RENDERER
// ============================================================

function initCodexNav(currentId) {
  const page = CODEX_MAP[currentId];
  if (!page) return;

  // Log the visit for every page
  navAppendLog(currentId);

  // SUPPRESSION: the Pale Archive page IS the navigation.
  if (currentId === 'pale-archive') return;

  const a = page.pathA ? CODEX_MAP[page.pathA] : null;
  const b = page.pathB ? CODEX_MAP[page.pathB] : null;
  const isBearer = navIsBearer();
  const chamber = (isBearer && page.bearerChamber) ? page.bearerChamber : null;
  const prevId = navPreviousPageId(currentId);
  const prev = navPreviousPage(currentId);
  const visits = navVisitCount(currentId);
  const sig = navSignals();
  const pal = navResolvePalette();

  const nav = document.getElementById('codex-nav');
  if (!nav) return;

  // customDoors: the page builds its own bespoke gate. Suppress the
  // generic door grid; render the framing only so nothing competes.
  const showDoors = !page.customDoors && (!!a || !!b || !!chamber);

  // If there is genuinely nothing to render, bail.
  if (!showDoors && !page.closingWhisper && !page.realm && !prev && visits <= 1) return;

  // Arrival + position + realm voice + whispers (always available)
  const arrivalLine = navArrivalLine(currentId, prev, prevId, visits);

  let seqLine = '';
  if (typeof page.seq === 'number') {
    const total = Object.values(CODEX_MAP).filter(p => typeof p.seq === 'number').length;
    seqLine = `Reading ${page.seq + 1} of ${total} in the canonical descent`;
  } else if (page.phase === 'Reference') {
    seqLine = 'Reference · Outside the descent';
  }

  const glyph = PHASE_GLYPH[page.phase] || '🜏';
  const realmGloss = REALM_GLOSS[page.realm] || '';
  const signalWhisper = navSignalWhisper(sig);

  // Resolve the bearer chamber destination
  let chamberHref = null, chamberTitle = null, chamberDesc = null;
  if (chamber) {
    if (typeof chamber === 'string' && CODEX_MAP[chamber]) {
      chamberHref = CODEX_MAP[chamber].file;
      chamberTitle = CODEX_MAP[chamber].title;
      chamberDesc = CODEX_MAP[chamber].description;
    } else if (typeof chamber === 'string') {
      chamberHref = chamber;
      chamberTitle = 'The Deeper Reading';
      chamberDesc = 'A chamber accessible only to those who have taken the Oath.';
    } else if (typeof chamber === 'object') {
      chamberHref = chamber.href;
      chamberTitle = chamber.title || 'The Deeper Reading';
      chamberDesc = chamber.description || 'A chamber accessible only to those who have taken the Oath.';
    }
  }

  const doorsHTML = showDoors ? `
      <div class="cnav-doors">
        ${a ? `
        <a class="cnav-door cnav-a" href="${a.file}">
          <span class="cnav-door-label">${page.labelA || 'Follow the signal'}</span>
          <span class="cnav-door-dest">${a.title}</span>
          ${a.description ? `<span class="cnav-door-hint">${a.description}</span>` : ''}
        </a>` : ''}
        ${b ? `
        <a class="cnav-door cnav-b" href="${b.file}">
          <span class="cnav-door-label">${page.labelB || 'Cross the threshold'}</span>
          <span class="cnav-door-dest">${b.title}</span>
          ${b.description ? `<span class="cnav-door-hint">${b.description}</span>` : ''}
        </a>` : ''}
        ${chamberHref ? `
        <a class="cnav-door cnav-chamber" href="${chamberHref}">
          <span class="cnav-door-label">Enter the Chamber</span>
          <span class="cnav-door-dest">${chamberTitle}</span>
          ${chamberDesc ? `<span class="cnav-door-hint">${chamberDesc}</span>` : ''}
        </a>` : ''}
      </div>` : `
      <div class="cnav-gatenote">The descent continues through the gate above.</div>`;

  nav.innerHTML = `
    <div class="cnav-inner${showDoors ? '' : ' cnav-framed'}">

      ${arrivalLine ? `<div class="cnav-arrival">${arrivalLine}</div>` : ''}

      <div class="cnav-divider">
        <div class="cnav-line"></div>
        <span class="cnav-glyph">${glyph}</span>
        <div class="cnav-line r"></div>
      </div>

      <div class="cnav-current">
        <div class="cnav-current-title">${page.title}</div>
        ${seqLine ? `<div class="cnav-current-seq">${seqLine}</div>` : ''}
      </div>

      ${doorsHTML}

      <div class="cnav-meta">
        <span class="cnav-realm">Realm ${page.realm} · ${page.phase}</span>
        ${realmGloss ? `<span class="cnav-realm-gloss">${realmGloss}</span>` : ''}
      </div>

      ${page.closingWhisper ? `<div class="cnav-whisper">${page.closingWhisper}</div>` : ''}
      ${signalWhisper ? `<div class="cnav-signal-whisper">${signalWhisper}</div>` : ''}

    </div>
  `;

  applyNavPalette(nav, pal);
}

function applyNavPalette(nav, pal) {
  nav.style.setProperty('--cnav-accent', pal.accent);
  nav.style.setProperty('--cnav-accent-dim', pal.accentDim);
  nav.style.setProperty('--cnav-cross', pal.cross);
  nav.style.setProperty('--cnav-cross-dim', pal.crossDim);
  nav.style.setProperty('--cnav-bearer', pal.bearer);
  nav.style.setProperty('--cnav-bearer-dim', pal.bearerDim);
  nav.style.setProperty('--cnav-whisper', pal.whisper);
}

// Retained for backward compatibility; the main renderer now handles
// the door-less case directly via the customDoors / showDoors path.
function renderClosingOnly(page, pal) {
  return `
    <div class="cnav-inner cnav-closing-only">
      ${page.realm ? `<div class="cnav-meta"><span class="cnav-realm">Realm ${page.realm} · ${page.phase}</span>${REALM_GLOSS[page.realm] ? `<span class="cnav-realm-gloss">${REALM_GLOSS[page.realm]}</span>` : ''}</div>` : ''}
      ${page.closingWhisper ? `<div class="cnav-whisper">${page.closingWhisper}</div>` : ''}
    </div>
  `;
}

// ============================================================
// SHARED CSS, Injected once per page load
// ============================================================

(function injectNavStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #codex-nav {
      position: relative;
      z-index: 10;
      padding: 80px 32px 100px;
      width: 100%;
      --cnav-accent: #C9A84C;
      --cnav-accent-dim: rgba(201,168,76,0.35);
      --cnav-cross: #7A1212;
      --cnav-cross-dim: rgba(122,18,18,0.35);
      --cnav-bearer: #E0C878;
      --cnav-bearer-dim: rgba(224,200,120,0.5);
      --cnav-whisper: rgba(201,168,76,0.32);
    }

    .cnav-inner {
      max-width: 820px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 28px;
    }
    .cnav-framed { gap: 22px; }

    .cnav-arrival {
      font-family: 'Crimson Text', Georgia, serif;
      font-style: italic;
      font-size: 13px;
      color: var(--cnav-whisper);
      text-align: center;
      letter-spacing: 0.02em;
      opacity: 0.85;
    }
    .cnav-arrival em {
      color: var(--cnav-accent);
      font-style: italic;
    }

    .cnav-divider {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
      max-width: 540px;
    }
    .cnav-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--cnav-accent-dim));
    }
    .cnav-line.r {
      background: linear-gradient(90deg, var(--cnav-accent-dim), transparent);
    }
    .cnav-glyph {
      font-size: 14px;
      color: var(--cnav-accent);
      opacity: 0.6;
      flex-shrink: 0;
    }

    .cnav-current {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .cnav-current-title {
      font-family: 'Cinzel Decorative', serif;
      font-weight: 700;
      font-size: clamp(14px, 1.8vw, 18px);
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--cnav-accent);
      text-shadow: 0 0 16px var(--cnav-accent-dim);
    }
    .cnav-current-seq {
      font-family: 'Share Tech Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.32em;
      color: var(--cnav-whisper);
      text-transform: uppercase;
    }

    .cnav-doors {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
      width: 100%;
      max-width: 800px;
      justify-content: center;
    }

    .cnav-door {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 22px 26px 20px;
      border: 1px solid;
      text-decoration: none;
      position: relative;
      overflow: hidden;
      cursor: none;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      text-align: center;
    }
    @media (max-width: 768px) { .cnav-door { cursor: pointer; } }

    .cnav-door::before {
      content: '';
      position: absolute;
      inset: 0;
      transform: translateX(-101%);
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cnav-door:hover::before { transform: translateX(0); }

    .cnav-a {
      background: transparent;
      border-color: var(--cnav-accent-dim);
      color: #E4DDD0;
    }
    .cnav-a::before { background: rgba(201, 168, 76, 0.08); }
    .cnav-a:hover { border-color: var(--cnav-accent); }

    .cnav-b {
      background: transparent;
      border-color: var(--cnav-cross-dim);
      color: #E4DDD0;
    }
    .cnav-b::before { background: rgba(122, 18, 18, 0.12); }
    .cnav-b:hover { border-color: var(--cnav-cross); }

    .cnav-chamber {
      background: linear-gradient(180deg, rgba(16, 12, 4, 0.6), rgba(8, 5, 2, 0.85));
      border-color: var(--cnav-bearer-dim);
      color: #E0C878;
      box-shadow: inset 0 0 24px rgba(224, 200, 120, 0.06);
    }
    .cnav-chamber::before { background: rgba(224, 200, 120, 0.12); }
    .cnav-chamber:hover {
      border-color: var(--cnav-bearer);
      box-shadow: inset 0 0 24px rgba(224, 200, 120, 0.12), 0 0 24px rgba(224, 200, 120, 0.15);
    }

    .cnav-door-label {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 0.42em;
      text-transform: uppercase;
      color: inherit;
      position: relative;
      z-index: 1;
    }
    .cnav-door-dest {
      font-family: 'Crimson Text', Georgia, serif;
      font-style: italic;
      font-size: 14px;
      color: rgba(228, 221, 208, 0.62);
      position: relative;
      z-index: 1;
      margin-top: 2px;
    }
    .cnav-chamber .cnav-door-dest { color: rgba(224, 200, 120, 0.75); }

    .cnav-door-hint {
      font-family: 'Crimson Text', Georgia, serif;
      font-style: italic;
      font-size: 12px;
      color: rgba(228, 221, 208, 0.32);
      position: relative;
      z-index: 1;
      margin-top: 6px;
      max-width: 280px;
      line-height: 1.5;
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .cnav-door:hover .cnav-door-hint {
      opacity: 1;
      transform: translateY(0);
    }
    .cnav-chamber .cnav-door-hint { color: rgba(224, 200, 120, 0.55); }

    /* door-less framing note (customDoors pages) */
    .cnav-gatenote {
      font-family: 'Crimson Text', Georgia, serif;
      font-style: italic;
      font-size: 12px;
      letter-spacing: 0.04em;
      color: var(--cnav-whisper);
      opacity: 0.7;
      text-align: center;
    }

    .cnav-meta {
      margin-top: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .cnav-realm {
      font-family: 'Cinzel', serif;
      font-size: 8px;
      letter-spacing: 0.5em;
      text-transform: uppercase;
      color: var(--cnav-whisper);
    }
    .cnav-realm-gloss {
      font-family: 'Crimson Text', Georgia, serif;
      font-style: italic;
      font-size: 11px;
      letter-spacing: 0.04em;
      color: var(--cnav-whisper);
      opacity: 0.6;
    }

    .cnav-whisper {
      margin-top: 16px;
      font-family: 'Crimson Text', Georgia, serif;
      font-style: italic;
      font-size: 13px;
      color: var(--cnav-whisper);
      text-align: center;
      letter-spacing: 0.02em;
      max-width: 560px;
      line-height: 1.7;
      opacity: 0.85;
    }
    .cnav-signal-whisper {
      margin-top: 2px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.14em;
      color: var(--cnav-whisper);
      text-align: center;
      max-width: 520px;
      line-height: 1.7;
      opacity: 0.55;
    }

    .cnav-closing-only {
      padding-top: 0;
    }

    @media (max-width: 600px) {
      .cnav-doors { grid-template-columns: 1fr; }
      #codex-nav { padding: 60px 20px 80px; }
    }
  `;
  document.head.appendChild(style);
})();

// ============================================================
// EXPOSE GLOBALLY
// ============================================================

if (typeof window !== 'undefined') {
  window.initCodexNav = initCodexNav;
  window.CODEX_MAP = CODEX_MAP;
}
