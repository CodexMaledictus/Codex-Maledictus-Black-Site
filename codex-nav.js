// ============================================================
// CODEX MALEDICTUS — NAVIGATION BRAIN
// codex-nav.js — lives in repo root, imported by every page
//
// TO ADD A NEW PAGE:
// 1. Add one entry to CODEX_MAP below
// 2. That's it. Every page that imports this file knows about it.
//
// PATH LOGIC:
// pathA = deeper into the current thread (follow the signal)
// pathB = sideways into a related thread (cross the threshold)
// If a path is null, that door is hidden on that page.
// ============================================================
 
const CODEX_MAP = {
 
  // ── ENTRY POINT ─────────────────────────────────────────────
  "infection-remembers": {
    file:   "infection-remembers.html",
    title:  "The Infection Remembers",
    realm:  "I",
    type:   "lore",
    labelA: "Follow the signal",
    labelB: "Read the first record",
    pathA:  "infection-lore",
    pathB:  "codex-remembers-you"
  },
 
  // ── REALM I — MUNDIS OBSCURA ─────────────────────────────────
  "infection-lore": {
    file:   "infection-lore.html",
    title:  "Lore of the Infection",
    realm:  "I",
    type:   "lore",
    labelA: "Trace the origin",
    labelB: "Enter the chronicle",
    pathA:  "rf-093-lore",
    pathB:  "lore-chronicle-1"
  },
 
  "codex-remembers-you": {
    file:   "codex-remembers-you.html",
    title:  "The Codex Remembers You",
    realm:  "I",
    type:   "lore",
    labelA: "Read what it left behind",
    labelB: "Find the fragment",
    pathA:  "memory-engine-1",
    pathB:  "rf-093-mirror"
  },
 
  "memory-engine-1": {
    file:   "memory-engine-1.html",
    title:  "The Memory Engine",
    realm:  "I",
    type:   "lore",
    labelA: "Trace the recursion",
    labelB: "Enter the invocation",
    pathA:  "rf-093-lore",
    pathB:  "rf-093-invocation"
  },
 
  // ── CHRONICLE THREAD ─────────────────────────────────────────
  "lore-chronicle-1": {
    file:   "lore-chronicle-1.html",
    title:  "Chronicle I",
    realm:  "I",
    type:   "chronicle",
    labelA: "Continue the chronicle",
    labelB: "See where it remembers",
    pathA:  "chronicle-1-infection-remembers",
    pathB:  "infection-remembers"
  },
 
  "chronicle-1-infection-remembers": {
    file:   "chronicle-1-infection-remembers.html",
    title:  "Chronicle I — The Infection Remembers",
    realm:  "I",
    type:   "chronicle",
    labelA: "Read the apocrypha",
    labelB: "Find the recovered fragment",
    pathA:  "apocrypha-chronicle-1",
    pathB:  "rf-093-apocrypha"
  },
 
  "apocrypha-chronicle-1": {
    file:   "apocrypha-chronicle-1.html",
    title:  "Apocrypha — Chronicle I",
    realm:  "I",
    type:   "apocrypha",
    labelA: "Enter the deeper apocrypha",
    labelB: "Hear the invocation",
    pathA:  "apocrypha-infection",
    pathB:  "rf-093-invocation"
  },
 
  // ── APOCRYPHA THREAD ─────────────────────────────────────────
  "apocrypha-infection": {
    file:   "apocrypha-infection.html",
    title:  "Apocrypha — The Infection",
    realm:  "I",
    type:   "apocrypha",
    labelA: "Read the mirror",
    labelB: "Enter the Plague liturgy",
    pathA:  "rf-093-mirror",
    pathB:  "plague-priest-liturgy"
  },
 
  // ── RF-093 CLUSTER ───────────────────────────────────────────
  "rf-093-lore": {
    file:   "rf-093-lore.html",
    title:  "Recovered Fragment 093 — Lore",
    realm:  "I",
    type:   "fragment",
    labelA: "Read the invocation",
    labelB: "Find what it mirrors",
    pathA:  "rf-093-invocation",
    pathB:  "rf-093-mirror"
  },
 
  "rf-093-invocation": {
    file:   "rf-093-invocation.html",
    title:  "Recovered Fragment 093 — Invocation",
    realm:  "I",
    type:   "fragment",
    labelA: "Enter the apocrypha",
    labelB: "Read the memory engine",
    pathA:  "rf-093-apocrypha",
    pathB:  "memory-engine-1"
  },
 
  "rf-093-mirror": {
    file:   "rf-093-mirror.html",
    title:  "Recovered Fragment 093 — Mirror",
    realm:  "I",
    type:   "fragment",
    labelA: "Read the full fragment",
    labelB: "Enter the chronicle",
    pathA:  "rf-093-lore",
    pathB:  "lore-chronicle-1"
  },
 
  "rf-093-apocrypha": {
    file:   "rf-093-apocrypha.html",
    title:  "Recovered Fragment 093 — Apocrypha",
    realm:  "I",
    type:   "apocrypha",
    labelA: "Find the Plague Priest",
    labelB: "Return to the origin",
    pathA:  "plague-priest-lore",
    pathB:  "infection-remembers"
  },
 
  // ── PLAGUE PRIEST CLUSTER — REALM I / SHATTERREALM BORDER ───
  "plague-priest-lore": {
    file:   "plague-priest-lore.html",
    title:  "The Plague Priest — Lore",
    realm:  "I-II",
    type:   "lore",
    labelA: "Decode the signal",
    labelB: "Enter the liturgy",
    pathA:  "plague-priest-decoder",
    pathB:  "plague-priest-liturgy"
  },
 
  "plague-priest-decoder": {
    file:   "plague-priest-decoder.html",
    title:  "The Plague Priest — Decoder",
    realm:  "I-II",
    type:   "fragment",
    labelA: "Read the apocrypha",
    labelB: "Enter the liturgy",
    pathA:  "plague-priest-apocrypha",
    pathB:  "plague-priest-liturgy"
  },
 
  "plague-priest-liturgy": {
    file:   "plague-priest-liturgy.html",
    title:  "The Plague Priest — Liturgy",
    realm:  "I-II",
    type:   "lore",
    labelA: "Read the full apocrypha",
    labelB: "Find the confession",
    pathA:  "plague-priest-apocrypha",
    pathB:  "confession-ledger"
  },
 
  "plague-priest-apocrypha": {
    file:   "plague-priest-apocrypha.html",
    title:  "The Plague Priest — Apocrypha",
    realm:  "I-II",
    type:   "apocrypha",
    labelA: "The ledger found you",
    labelB: "Return to the first signal",
    pathA:  "confession-ledger",
    pathB:  "infection-remembers"
  },
 
  // ── THE HIDDEN ROOM — found only through the maze ───────────
  "confession-ledger": {
    file:   "confession-ledger.html",
    title:  "The Confession Ledger",
    realm:  "∞",
    type:   "hidden",
    labelA: null,
    labelB: null,
    pathA:  null,
    pathB:  null
  },
 
  // ── MUSIC ────────────────────────────────────────────────────
  "gospel-forgotten-flesh": {
    file:   "gospel-forgotten-flesh.html",
    title:  "The Gospel of Forgotten Flesh",
    realm:  "I",
    type:   "music",
    labelA: null,
    labelB: null,
    pathA:  null,
    pathB:  null
  }
 
};
 
// ============================================================
// NAVIGATION RENDERER
// Call initCodexNav("this-page-id") at the bottom of any page.
// It finds the current page in the map and renders its two doors.
// ============================================================
 
function initCodexNav(currentId) {
  const page = CODEX_MAP[currentId];
  if (!page) return;
 
  const a = page.pathA ? CODEX_MAP[page.pathA] : null;
  const b = page.pathB ? CODEX_MAP[page.pathB] : null;
 
  // Don't render nav if both paths are null (hidden room, music pages)
  if (!a && !b) return;
 
  const nav = document.getElementById('codex-nav');
  if (!nav) return;
 
  nav.innerHTML = `
    <div class="cnav-inner">
      <div class="cnav-divider">
        <div class="cnav-line"></div>
        <span class="cnav-glyph">🜏</span>
        <div class="cnav-line r"></div>
      </div>
      <div class="cnav-doors">
        ${a ? `
        <a class="cnav-door cnav-a" href="${a.file}">
          <span class="cnav-door-label">${page.labelA}</span>
          <span class="cnav-door-dest">${a.title}</span>
        </a>` : ''}
        ${b ? `
        <a class="cnav-door cnav-b" href="${b.file}">
          <span class="cnav-door-label">${page.labelB}</span>
          <span class="cnav-door-dest">${b.title}</span>
        </a>` : ''}
      </div>
      <div class="cnav-realm">Realm ${page.realm} &nbsp;·&nbsp; ${page.type}</div>
    </div>
  `;
}
 
// ============================================================
// SHARED CSS
// Inject navigation styles into any page that imports this file.
// No need to copy CSS into each page manually.
// ============================================================
 
(function injectNavStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #codex-nav {
      position: relative;
      z-index: 10;
      padding: 60px 32px 80px;
      width: 100%;
    }
 
    .cnav-inner {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 32px;
    }
 
    .cnav-divider {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
    }
 
    .cnav-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(201,168,76,0.35));
    }
 
    .cnav-line.r {
      background: linear-gradient(90deg, rgba(201,168,76,0.35), transparent);
    }
 
    .cnav-glyph {
      font-size: 13px;
      color: rgba(201,168,76,0.5);
      flex-shrink: 0;
    }
 
    .cnav-doors {
      display: flex;
      gap: 16px;
      width: 100%;
      justify-content: center;
      flex-wrap: wrap;
    }
 
    .cnav-door {
      flex: 1;
      min-width: 200px;
      max-width: 340px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 7px;
      padding: 20px 28px;
      border: 1px solid;
      text-decoration: none;
      position: relative;
      overflow: hidden;
      cursor: none;
      transition: all 0.5s cubic-bezier(0.16,1,0.3,1);
    }
 
    .cnav-door::before {
      content: '';
      position: absolute;
      inset: 0;
      transform: translateX(-101%);
      transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
    }
 
    .cnav-door:hover::before {
      transform: translateX(0);
    }
 
    .cnav-a {
      background: transparent;
      border-color: rgba(201,168,76,0.25);
      color: #E4DDD0;
    }
 
    .cnav-a::before {
      background: rgba(201,168,76,0.07);
    }
 
    .cnav-a:hover {
      border-color: rgba(201,168,76,0.6);
    }
 
    .cnav-b {
      background: transparent;
      border-color: rgba(122,18,18,0.35);
      color: #E4DDD0;
    }
 
    .cnav-b::before {
      background: rgba(122,18,18,0.1);
    }
 
    .cnav-b:hover {
      border-color: rgba(122,18,18,0.8);
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
      font-size: 13px;
      color: rgba(228,221,208,0.45);
      position: relative;
      z-index: 1;
      text-align: center;
    }
 
    .cnav-realm {
      font-family: 'Cinzel', serif;
      font-size: 8px;
      letter-spacing: 0.48em;
      text-transform: uppercase;
      color: rgba(201,168,76,0.28);
    }
 
    @media (max-width: 600px) {
      .cnav-doors {
        flex-direction: column;
        align-items: center;
      }
      .cnav-door {
        width: 100%;
        max-width: 100%;
      }
    }
  `;
  document.head.appendChild(style);
})();
