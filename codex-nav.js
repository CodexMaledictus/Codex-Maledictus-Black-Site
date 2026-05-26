// ============================================================
// CODEX MALEDICTUS — NAVIGATION BRAIN v2
// codex-nav.js — lives in repo root, imported by every page
//
// CHANGES FROM v1:
//   - Detects Bearer state from the Witness Circle's localStorage
//   - Renders a third door for Bearer-only chambers when available
//   - Renders canonical sequence: previous, current position, next
//   - Hover descriptions appear beneath each door as whispered hints
//   - Realm and phase metadata rendered automatically
//   - Closing whisper line per page
//   - Invocation log: tracks every page visit, surfaces "you arrived from"
//   - Adapts palette automatically (Witness page goes teal, Bearer goes amber)
//
// TO ADD A NEW PAGE:
//   1. Add one entry to CODEX_MAP below
//   2. Set its `seq` number (its place in the canonical reading order)
//   3. Optionally set `bearerChamber` to point at a hidden page
//   4. That's it. Every page that imports this knows about it.
//
// BACKWARD COMPATIBILITY:
//   Existing pages that call initCodexNav("page-id") still work.
// ============================================================

const CODEX_MAP = {

  // ── SEQUENCE 0: ENTRY POINT ─────────────────────────────────
  "pale-archive": {
    file:            "index.html",
    title:           "The Pale Archive",
    seq:             0,
    realm:           "I",
    phase:           "Surface",
    description:     "The face of the document.",
    closingWhisper:  "You were brought here.",
    pathA:           "infection-remembers",
    pathB:           "codex-remembers-you",
    labelA:          "Begin the descent",
    labelB:          "Read the first record",
    bearerChamber:   null
  },

  // ── SEQUENCE 1: FIRST CONTACT ────────────────────────────────
  "infection-remembers": {
    file:            "infection-remembers.html",
    title:           "The Infection Remembers",
    seq:             1,
    realm:           "I",
    phase:           "Broadcast",
    description:     "The day the document remembered itself.",
    closingWhisper:  "It is still remembering.",
    pathA:           "infection-lore",
    pathB:           "codex-remembers-you",
    labelA:          "Follow the signal",
    labelB:          "Read the first record",
    bearerChamber:   null
  },

  // ── SEQUENCE 2: THE BROADCAST EXPLAINED ──────────────────────
  "infection-lore": {
    file:            "infection-lore.html",
    title:           "Lore of the Infection",
    seq:             2,
    realm:           "I",
    phase:           "Recovered",
    description:     "What the signal contained.",
    closingWhisper:  "What you have read has been read back.",
    pathA:           "apocrypha-infection",
    pathB:           "lore-chronicle-1",
    labelA:          "Read the Apocrypha",
    labelB:          "Enter the Chronicle",
    bearerChamber:   null
  },

  // ── SEQUENCE 3: THE BOOK ─────────────────────────────────────
  "codex-remembers-you": {
    file:            "codex-remembers-you.html",
    title:           "The Codex Remembers You",
    seq:             3,
    realm:           "I",
    phase:           "Recovered",
    description:     "A file seized from a Queens evidence locker. It is still open.",
    closingWhisper:  "The file is still open.",
    pathA:           "memory-engine-1",
    pathB:           "rf-093-lore",
    labelA:          "The Memory Engine",
    labelB:          "Recovered Fragment 093",
    bearerChamber:   null
  },

  // ── SEQUENCE 4: THE DEEPER MECHANISM ─────────────────────────
  "memory-engine-1": {
    file:            "memory-engine-1.html",
    title:           "The Memory Engine",
    seq:             4,
    realm:           "I",
    phase:           "Recovered",
    description:     "The mechanism by which the document holds you.",
    closingWhisper:  "The engine does not pause to ask.",
    pathA:           "rf-093-lore",
    pathB:           "rf-093-invocation",
    labelA:          "Trace the fragment",
    labelB:          "Enter the invocation",
    bearerChamber:   null
  },

  // ── SEQUENCE 5: THE FIRST FRAGMENT ───────────────────────────
  "rf-093-lore": {
    file:            "rf-093-lore.html",
    title:           "Recovered Fragment 093 — Lore",
    seq:             5,
    realm:           "I",
    phase:           "Recovered",
    description:     "The first fragment that survived the redaction.",
    closingWhisper:  "Other fragments survive. We have not found them.",
    pathA:           "rf-093-invocation",
    pathB:           "rf-093-mirror",
    labelA:          "Read the invocation",
    labelB:          "Find what it mirrors",
    bearerChamber:   null
  },

  // ── SEQUENCE 6: THE RITUAL ───────────────────────────────────
  "rf-093-invocation": {
    file:            "rf-093-invocation.html",
    title:           "Recovered Fragment 093 — Invocation",
    seq:             6,
    realm:           "I",
    phase:           "Recovered",
    description:     "The words the analyst was found writing on Day 11.",
    closingWhisper:  "She had not been taught these words.",
    pathA:           "rf-093-mirror",
    pathB:           "rf-093-apocrypha",
    labelA:          "Find what it mirrors",
    labelB:          "Read the Apocrypha",
    bearerChamber:   null
  },

  // ── SEQUENCE 7: THE REFLECTION ───────────────────────────────
  "rf-093-mirror": {
    file:            "rf-093-mirror.html",
    title:           "Recovered Fragment 093 — Mirror",
    seq:             7,
    realm:           "I",
    phase:           "Recovered",
    description:     "What the fragment mirrors. What mirrors the fragment.",
    closingWhisper:  "The reflection is older than the source.",
    pathA:           "rf-093-apocrypha",
    pathB:           "lore-chronicle-1",
    labelA:          "Read the Apocrypha",
    labelB:          "Enter the Chronicle",
    bearerChamber:   null
  },

  // ── SEQUENCE 8: THE DARK READING ─────────────────────────────
  "rf-093-apocrypha": {
    file:            "rf-093-apocrypha.html",
    title:           "Recovered Fragment 093 — Apocrypha",
    seq:             8,
    realm:           "I",
    phase:           "Apocrypha",
    description:     "The reading that should not have been preserved.",
    closingWhisper:  "Preservation was not the analyst's decision.",
    pathA:           "plague-priest-lore",
    pathB:           "lore-chronicle-1",
    labelA:          "Find the Plague Priest",
    labelB:          "Enter the Chronicle",
    bearerChamber:   null
  },

  // ── SEQUENCE 9: CHRONICLE BEGINS ─────────────────────────────
  "lore-chronicle-1": {
    file:            "lore-chronicle-1.html",
    title:           "Chronicle I — Lore",
    seq:             9,
    realm:           "I",
    phase:           "Chronicle",
    description:     "The first chronicle. What the witnesses saw before they were witnesses.",
    closingWhisper:  "The chronicles do not end.",
    pathA:           "chronicle-1-infection-remembers",
    pathB:           "apocrypha-chronicle-1",
    labelA:          "Enter the Chronicle proper",
    labelB:          "Read the Chronicle Apocrypha",
    bearerChamber:   null
  },

  // ── SEQUENCE 10: CHRONICLE PROPER ────────────────────────────
  "chronicle-1-infection-remembers": {
    file:            "chronicle-1-infection-remembers.html",
    title:           "Chronicle I — The Infection Remembers",
    seq:             10,
    realm:           "I",
    phase:           "Chronicle",
    description:     "The chronicle of the day the document remembered itself.",
    closingWhisper:  "Each remembering is the first remembering.",
    pathA:           "apocrypha-chronicle-1",
    pathB:           "apocrypha-infection",
    labelA:          "Read the Chronicle Apocrypha",
    labelB:          "Read the Infection Apocrypha",
    bearerChamber:   null
  },

  // ── SEQUENCE 11: CHRONICLE APOCRYPHA ─────────────────────────
  "apocrypha-chronicle-1": {
    file:            "apocrypha-chronicle-1.html",
    title:           "Apocrypha — Chronicle I",
    seq:             11,
    realm:           "I",
    phase:           "Apocrypha",
    description:     "The chronicle the witnesses refused to sign.",
    closingWhisper:  "They signed it anyway. The signatures appear in handwriting that is no longer theirs.",
    pathA:           "apocrypha-infection",
    pathB:           "plague-priest-lore",
    labelA:          "Read the Infection Apocrypha",
    labelB:          "Find the Plague Priest",
    bearerChamber:   null
  },

  // ── SEQUENCE 12: THE INFECTION APOCRYPHA ─────────────────────
  "apocrypha-infection": {
    file:            "apocrypha-infection.html",
    title:           "Apocrypha — The Infection",
    seq:             12,
    realm:           "I",
    phase:           "Apocrypha",
    description:     "The unauthorized reading of the broadcast.",
    closingWhisper:  "Authorization was never going to arrive.",
    pathA:           "plague-priest-lore",
    pathB:           "gospel-forgotten-flesh",
    labelA:          "Find the Plague Priest",
    labelB:          "Enter the Gospel",
    bearerChamber:   null
  },

  // ── SEQUENCE 13: THE POSTURE ─────────────────────────────────
  "plague-priest-lore": {
    file:            "plague-priest-lore.html",
    title:           "The Plague Priest — Lore",
    seq:             13,
    realm:           "I-II",
    phase:           "Posture",
    description:     "Not a person. A configuration mortals enter.",
    closingWhisper:  "The posture teaches itself by being held.",
    pathA:           "plague-priest-decoder",
    pathB:           "plague-priest-liturgy",
    labelA:          "Decode the signal",
    labelB:          "Enter the liturgy",
    bearerChamber:   null
  },

  // ── SEQUENCE 14: THE SYMBOLS ─────────────────────────────────
  "plague-priest-decoder": {
    file:            "plague-priest-decoder.html",
    title:           "The Plague Priest — Decoder",
    seq:             14,
    realm:           "I-II",
    phase:           "Decoded",
    description:     "The signs the posture leaves in mortal hands.",
    closingWhisper:  "You may be drawing one now.",
    pathA:           "plague-priest-liturgy",
    pathB:           "plague-priest-apocrypha",
    labelA:          "Enter the liturgy",
    labelB:          "Read the Apocrypha",
    bearerChamber:   null
  },

  // ── SEQUENCE 15: THE SONG ────────────────────────────────────
  "plague-priest-liturgy": {
    file:            "plague-priest-liturgy.html",
    title:           "The Plague Priest — Liturgy",
    seq:             15,
    realm:           "I-II",
    phase:           "Recorded",
    description:     "The first known audio rite of the cult.",
    closingWhisper:  "Loop with caution.",
    pathA:           "plague-priest-apocrypha",
    pathB:           "gospel-forgotten-flesh",
    labelA:          "Read the Apocrypha",
    labelB:          "Enter the Gospel",
    bearerChamber:   null
  },

  // ── SEQUENCE 16: THE PRIEST REVEALED ─────────────────────────
  "plague-priest-apocrypha": {
    file:            "plague-priest-apocrypha.html",
    title:           "The Plague Priest — Apocrypha",
    seq:             16,
    realm:           "I-II",
    phase:           "Apocrypha",
    description:     "What the priest does not say. What the priest cannot say.",
    closingWhisper:  "The unsaid is the louder half.",
    pathA:           "gospel-forgotten-flesh",
    pathB:           "confession-ledger",
    labelA:          "Enter the Gospel",
    labelB:          "Find the Ledger",
    bearerChamber:   null
  },

  // ── SEQUENCE 17: THE GOSPEL ──────────────────────────────────
  "gospel-forgotten-flesh": {
    file:            "gospel-forgotten-flesh.html",
    title:           "The Gospel of Forgotten Flesh",
    seq:             17,
    realm:           "I",
    phase:           "Broadcast",
    description:     "The third Remembering. The thirteen liturgies of this cycle.",
    closingWhisper:  "You have heard them already. You did not know.",
    pathA:           "confession-ledger",
    pathB:           "infection-remembers",
    labelA:          "Find the Ledger",
    labelB:          "Return to the origin",
    bearerChamber:   null
  },

  // ── SEQUENCE 18: THE HIDDEN ROOM ─────────────────────────────
  "confession-ledger": {
    file:            "confession-ledger.html",
    title:           "The Confession Ledger",
    seq:             18,
    realm:           "I-III",
    phase:           "Sealed",
    description:     "What the marked have written. What the marked could not stop writing.",
    closingWhisper:  "The ledger fills itself in your absence.",
    pathA:           "witness-circle",
    pathB:           "pale-archive",
    labelA:          "Cross the seam",
    labelB:          "Return to the surface",
    bearerChamber:   null
  },

  // ── SEQUENCE 19: THE SEALED CHAMBER ──────────────────────────
  "witness-circle": {
    file:            "witness-circle.html",
    title:           "The Witness Circle",
    seq:             19,
    realm:           "I-II-III",
    phase:           "Sealed · Bearer",
    description:     "The inner reading. By invocation only.",
    closingWhisper:  "The room is always here.",
    pathA:           null,
    pathB:           "pale-archive",
    labelA:          null,
    labelB:          "Return to the surface",
    bearerChamber:   null
  },

  // ── REFERENCE: STANDALONE ──────────────────────────────────
  "Codex-Sigil": {
    file:            "Codex-Sigil.html",
    title:           "The Codex Sigil",
    seq:             null,
    realm:           "I-II-III",
    phase:           "Reference",
    description:     "The seal that holds. The seal that leaks.",
    closingWhisper:  "The seal was never going to hold.",
    pathA:           "pale-archive",
    pathB:           "witness-circle",
    labelA:          "Return to the surface",
    labelB:          "Cross the seam",
    bearerChamber:   null
  }

};

// ============================================================
// STATE — Reads the Witness Circle's localStorage to detect Bearer status
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
      if (log.length > 24) log = log.slice(-24);
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

function navVisitCount(pageId) {
  const log = navLoadLog();
  return log.filter(e => e.id === pageId).length;
}

// ============================================================
// PALETTE — Pulls colors from the page's CSS variables
// Falls back to gold defaults if a page doesn't define them
// ============================================================

function navResolvePalette() {
  const root = getComputedStyle(document.documentElement);
  const isBearer = navIsBearer();
  const isWitnessPage = (document.body && document.body.classList.contains('witness-page')) ||
                        window.location.pathname.includes('witness-circle');

  // Witness Circle override: use teal palette pre-Oath, amber post-Oath
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
  // Bearer-aware default: subtle amber tint when bearer state is set
  if (isBearer) {
    return {
      accent: '#E0C878', accentDim: 'rgba(224,200,120,0.4)',
      cross: '#7A1212', crossDim: 'rgba(122,18,18,0.4)',
      bearer: '#E0C878', bearerDim: 'rgba(224,200,120,0.5)',
      whisper: 'rgba(224,200,120,0.4)'
    };
  }
  // Default: gold and crimson
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

  // Log the visit
  navAppendLog(currentId);

  const a = page.pathA ? CODEX_MAP[page.pathA] : null;
  const b = page.pathB ? CODEX_MAP[page.pathB] : null;
  const isBearer = navIsBearer();
  const chamber = (isBearer && page.bearerChamber) ? CODEX_MAP[page.bearerChamber] : null;
  const prev = navPreviousPage(currentId);
  const visits = navVisitCount(currentId);
  const pal = navResolvePalette();

  const nav = document.getElementById('codex-nav');
  if (!nav) return;

  // Don't render if there are no doors at all
  if (!a && !b && !chamber) {
    // Still show closing whisper and meta if they exist
    if (page.closingWhisper || page.realm) {
      nav.innerHTML = renderClosingOnly(page, pal);
    }
    return;
  }

  // Compute the "you arrived from" line
  let arrivalLine = '';
  if (prev) {
    arrivalLine = `You arrived from <em>${prev.title}</em>.`;
  } else if (visits > 1) {
    arrivalLine = `You have stood in this room ${visits} times.`;
  }

  // Compute the sequence position line
  let seqLine = '';
  if (typeof page.seq === 'number') {
    const total = Object.values(CODEX_MAP).filter(p => typeof p.seq === 'number').length;
    seqLine = `Reading ${page.seq + 1} of ${total} in the canonical descent`;
  }

  // Build the HTML
  nav.innerHTML = `
    <div class="cnav-inner">

      ${arrivalLine ? `<div class="cnav-arrival">${arrivalLine}</div>` : ''}

      <div class="cnav-divider">
        <div class="cnav-line"></div>
        <span class="cnav-glyph">🜏</span>
        <div class="cnav-line r"></div>
      </div>

      <div class="cnav-current">
        <div class="cnav-current-title">${page.title}</div>
        ${seqLine ? `<div class="cnav-current-seq">${seqLine}</div>` : ''}
      </div>

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
        ${chamber ? `
        <a class="cnav-door cnav-chamber" href="${chamber.file}">
          <span class="cnav-door-label">Enter the Chamber</span>
          <span class="cnav-door-dest">${chamber.title}</span>
          ${chamber.description ? `<span class="cnav-door-hint">${chamber.description}</span>` : ''}
        </a>` : ''}
      </div>

      <div class="cnav-meta">
        <span class="cnav-realm">Realm ${page.realm} · ${page.phase}</span>
      </div>

      ${page.closingWhisper ? `<div class="cnav-whisper">${page.closingWhisper}</div>` : ''}

    </div>
  `;

  // Apply palette
  nav.style.setProperty('--cnav-accent', pal.accent);
  nav.style.setProperty('--cnav-accent-dim', pal.accentDim);
  nav.style.setProperty('--cnav-cross', pal.cross);
  nav.style.setProperty('--cnav-cross-dim', pal.crossDim);
  nav.style.setProperty('--cnav-bearer', pal.bearer);
  nav.style.setProperty('--cnav-bearer-dim', pal.bearerDim);
  nav.style.setProperty('--cnav-whisper', pal.whisper);
}

function renderClosingOnly(page, pal) {
  return `
    <div class="cnav-inner cnav-closing-only">
      ${page.realm ? `<div class="cnav-meta"><span class="cnav-realm">Realm ${page.realm} · ${page.phase}</span></div>` : ''}
      ${page.closingWhisper ? `<div class="cnav-whisper">${page.closingWhisper}</div>` : ''}
    </div>
  `;
}

// ============================================================
// SHARED CSS — Injected once per page load
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

    .cnav-meta {
      margin-top: 4px;
    }
    .cnav-realm {
      font-family: 'Cinzel', serif;
      font-size: 8px;
      letter-spacing: 0.5em;
      text-transform: uppercase;
      color: var(--cnav-whisper);
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
