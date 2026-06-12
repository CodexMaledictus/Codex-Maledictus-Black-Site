// ============================================================
// CODEX MALEDICTUS, NAVIGATION BRAIN v5, THE SEAL
// codex-nav.js, lives in repo root, imported by every page
//
// CHANGES FROM v4:
//   - THE SEAL: the nav no longer prints a sitemap. It closes every
//     room with the Codex speaking directly to the reader. Each seal
//     is composed from three slots (recognition, core, closing),
//     seeded deterministically per visit, with no-repeat tracking,
//     so it is stable on refresh and different on every true return.
//   - REGISTERS: the core line is drawn from a register chosen by the
//     room's cluster (gnostic, liturgical, enochian, kabbalistic,
//     scriptural, apophatic). One voice, many sources. Every citation
//     is real and independently checkable. Nothing asserted is
//     checkably false; everything is true or unfalsifiable.
//   - TRUE-DATA ASTRONOMY: moon phase (real synodic algorithm),
//     Algol eclipse phase (real ephemeris), planetary day rulers
//     (the real, documented system). Computed client-side. No network,
//     no permissions, no location.
//   - DAILY SEAL: one line per day, derived from the date alone,
//     identical for every visitor on Earth that day.
//   - RARE LINES: thirteen lines gated on true conditions. Outside the
//     no-repeat system. Most readers will never see most of them.
//   - AUTO-SUPPRESSION: the nav detects a page-built descent gate
//     (#DESCENT, #BRIDGE, or [data-codex-door]) and suppresses its own
//     door grid automatically. No per-page flags required. The
//     customDoors flag is kept as a manual override for legacy pages.
//   - SINGLE DOOR: pages with no custom gate render exactly one quiet
//     forward door (the canonical path), not a fork. The single-door
//     descent is now the site default.
//   - REMOVED: the "Reading X of N" counter and the two-door grid.
//     Out-of-universe machinery has no place at the bottom of a room.
//
// STATE:
//   codex_witness_state_v2 , read-only here (bearer, firstVisit, totals)
//   codex_invocation_log   , per-room visit log
//   codex_seal_v1          , the seal's own memory (seen lines, last
//                            render). NEVER touches codex_cipher_v1.
// ============================================================

const CODEX_MAP = {

  "index": {
    file: "index.html", title: "The Pale Archivum", seq: 0, realm: "I",
    phase: "Surface",
    description: "The face of the document. The first threshold.",
    closingWhisper: "You were brought here.",
    pathA: "pale-archive", pathB: "infection-remembers",
    labelA: "Consult the Archive", labelB: "Begin the descent",
    bearerChamber: null
  },

  "pale-archive": {
    file: "pale-archive.html", title: "The Pale Archive", seq: 1, realm: "I",
    phase: "Index",
    description: "The Codex's table of contents. The list of pages still reading you.",
    closingWhisper: "The last entry is yours.",
    pathA: null, pathB: null, labelA: null, labelB: null,
    bearerChamber: null
  },

  "infection-remembers": {
    file: "infection-remembers.html", title: "The Infection Remembers", seq: 2, realm: "I",
    phase: "Ritual Transmission",
    description: "The day the document remembered itself. The first audible breach.",
    closingWhisper: "It is still remembering.",
    pathA: "infection-lore", pathB: null,
    labelA: "Read the Lore", labelB: null,
    customDoors: true, bearerChamber: null
  },

  "infection-lore": {
    file: "infection-lore.html", title: "Lore of the Infection", seq: 3, realm: "I",
    phase: "Lore",
    description: "The theoretical framework the Archivum built around the breach. It did not contain what it described.",
    closingWhisper: "The framework did not hold.",
    pathA: "apocrypha-infection", pathB: "chronicle-1-infection-remembers",
    labelA: "Read the Apocrypha", labelB: "Enter the Chronicle",
    customDoors: true, bearerChamber: null
  },

  "apocrypha-infection": {
    file: "apocrypha-infection.html", title: "Apocrypha · The Infection", seq: 4, realm: "I",
    phase: "Apocrypha",
    description: "What the Archivum recorded but did not publish. Five chambers. The Reader's File builds itself in real time.",
    closingWhisper: "Authorization was never going to arrive.",
    customDoors: true,
    pathA: "chronicle-1-infection-remembers", pathB: null,
    labelA: "Enter the Chronicle", labelB: null,
    bearerChamber: null
  },

  "chronicle-1-infection-remembers": {
    file: "chronicle-1-infection-remembers.html", title: "Chronicle I · The Infection Remembers", seq: 5, realm: "I",
    phase: "Chronicle",
    description: "Seven sigil seals crack open in sequence. Each reveals Apollo's private annotation. Seal VII was not written by him.",
    closingWhisper: "Each remembering is the first remembering.",
    pathA: "lore-chronicle-1", pathB: "apocrypha-chronicle-1",
    labelA: "Read the Chronicle Lore", labelB: "Read the Chronicle Apocrypha",
    bearerChamber: null
  },

  "lore-chronicle-1": {
    file: "lore-chronicle-1.html", title: "Chronicle I · Deeper Lore", seq: 6, realm: "I",
    phase: "Chronicle Lore",
    description: "The chronicle continued. Apollo's seven private annotations expanded into their fuller form. Each annotation grows darker as it deepens.",
    closingWhisper: "The chronicles do not end.",
    pathA: "apocrypha-chronicle-1", pathB: "plague-priest-liturgy",
    labelA: "Read the Chronicle Apocrypha", labelB: "Begin the next transmission",
    bearerChamber: null
  },

  "apocrypha-chronicle-1": {
    file: "apocrypha-chronicle-1.html", title: "Apocrypha · Chronicle I", seq: 7, realm: "I",
    phase: "Chronicle Apocrypha",
    description: "The Seven Truths. The Three Realms classified. The Hollow Choir case files. The Reader's File. What you cannot unknow.",
    closingWhisper: "They signed it anyway. The signatures appear in handwriting that is no longer theirs.",
    pathA: "plague-priest-liturgy", pathB: "rf-093-lore",
    labelA: "Find the Plague Priest", labelB: "Follow the Recovered Fragments",
    bearerChamber: null
  },

  "plague-priest-liturgy": {
    file: "plague-priest-liturgy.html", title: "The Plague Priest · Liturgy", seq: 8, realm: "I-II",
    phase: "Ritual Transmission",
    description: "The first known audio rite of the Codex Maledictus. Recovered from Deck Hollow-13 in spore-static.",
    closingWhisper: "Loop with caution.",
    pathA: "plague-priest-lore", pathB: "plague-priest-decoder",
    labelA: "Read the Lore", labelB: "Decode the signal",
    bearerChamber: null
  },

  "plague-priest-lore": {
    file: "plague-priest-lore.html", title: "The Plague Priest · Lore", seq: 9, realm: "I-II",
    phase: "Lore",
    description: "Not a person. A configuration mortals enter. Three identical witness descriptions from people who have never met.",
    closingWhisper: "The posture teaches itself by being held.",
    pathA: "plague-priest-decoder", pathB: "plague-priest-apocrypha",
    labelA: "Decode the signal", labelB: "Read the Apocrypha",
    bearerChamber: null
  },

  "plague-priest-decoder": {
    file: "plague-priest-decoder.html", title: "The Plague Priest · Decoder", seq: 10, realm: "I-II",
    phase: "Decoder",
    description: "The Liturgy decoded line by line. Three layers per verse. The Hidden Doctrine has never been published outside the Archivum.",
    closingWhisper: "You may be drawing one of the glyphs now.",
    pathA: "plague-priest-apocrypha", pathB: "rf-093-lore",
    labelA: "Read the Apocrypha", labelB: "Follow the Recovered Fragments",
    bearerChamber: null
  },

  "plague-priest-apocrypha": {
    file: "plague-priest-apocrypha.html", title: "Apocrypha · The Plague Priest", seq: 11, realm: "I-II",
    phase: "Apocrypha",
    description: "What the Plague Priest left in the Cathedral that the Archivum has declined to publish. The third seal has never been opened.",
    closingWhisper: "The unsaid is the louder half.",
    pathA: "rf-093-lore", pathB: "codex-remembers-you",
    labelA: "Follow the Recovered Fragments", labelB: "Open the artifact",
    bearerChamber: null
  },

  "rf-093-lore": {
    file: "rf-093-lore.html", title: "Recovered Fragment 093 · Lore", seq: 12, realm: "I",
    phase: "Lore",
    description: "The first fragment that survived the redaction. First documented appearance of Elvain Vhris.",
    closingWhisper: "Other fragments survive. We have not found them.",
    pathA: "rf-093-invocation", pathB: "rf-093-mirror",
    labelA: "Read the Invocation", labelB: "Find what it mirrors",
    bearerChamber: null
  },

  "rf-093-invocation": {
    file: "rf-093-invocation.html", title: "Recovered Fragment 093 · Invocation", seq: 13, realm: "I",
    phase: "Invocation",
    description: "The words the analyst was found writing on Day 11. She had not been taught these words.",
    closingWhisper: "Her hand kept writing after she had stopped.",
    pathA: "rf-093-mirror", pathB: "rf-093-apocrypha",
    labelA: "Find what it mirrors", labelB: "Read the Apocrypha",
    bearerChamber: null
  },

  "rf-093-mirror": {
    file: "rf-093-mirror.html", title: "Recovered Fragment 093 · Mirror", seq: 14, realm: "I",
    phase: "Mirror",
    description: "What Fragment 093 reflects back at the reader. The reader sees something behind them.",
    closingWhisper: "The reflection is older than the source.",
    pathA: "rf-093-apocrypha", pathB: "codex-remembers-you",
    labelA: "Read the Apocrypha", labelB: "Open the artifact",
    bearerChamber: null
  },

  "rf-093-apocrypha": {
    file: "rf-093-apocrypha.html", title: "Apocrypha · Recovered Fragment 093", seq: 15, realm: "I",
    phase: "Apocrypha",
    description: "The reading that should not have been preserved. Preservation was not the analyst's decision.",
    closingWhisper: "Preservation was not the analyst's decision.",
    pathA: "codex-remembers-you", pathB: "memory-engine-1",
    labelA: "Open the artifact", labelB: "Find the mechanism",
    bearerChamber: null
  },

  "codex-remembers-you": {
    file: "codex-remembers-you.html", title: "The Codex That Remembers You", seq: 16, realm: "I",
    phase: "Artifact",
    description: "A file seized from a Queens evidence locker. The analyst who documented it has not been seen since Day 11.",
    closingWhisper: "The file is still open.",
    pathA: "memory-engine-1", pathB: "gospel-forgotten-flesh",
    labelA: "Find the mechanism", labelB: "Enter the Gospel",
    bearerChamber: null
  },

  "memory-engine-1": {
    file: "memory-engine-1.html", title: "The Memory Engine", seq: 17, realm: "I",
    phase: "Mechanism",
    description: "The mechanism by which the document holds you. Memory as infrastructure.",
    closingWhisper: "The engine does not pause to ask.",
    pathA: "gospel-forgotten-flesh", pathB: "confession-ledger",
    labelA: "Enter the Gospel", labelB: "Find the Ledger",
    bearerChamber: null
  },

  "gospel-forgotten-flesh": {
    file: "gospel-forgotten-flesh.html", title: "The Gospel of Forgotten Flesh", seq: 18, realm: "I",
    phase: "Broadcast Source",
    description: "The album from which every Ritual Transmission is relayed. The third Remembering of the current cycle.",
    closingWhisper: "You have heard them already. You did not know.",
    pathA: "confession-ledger", pathB: "witness-circle",
    labelA: "Find the Ledger", labelB: "Approach the seam",
    bearerChamber: null
  },

  "confession-ledger": {
    file: "confession-ledger.html", title: "The Confession Ledger", seq: 19, realm: "I-III",
    phase: "Sealed",
    description: "What the marked have written. What the marked could not stop writing.",
    closingWhisper: "The ledger fills itself in your absence.",
    pathA: "witness-circle", pathB: "pale-archive",
    labelA: "Cross the seam", labelB: "Return to the Archive",
    bearerChamber: null
  },

  "witness-circle": {
    file: "witness-circle.html", title: "The Witness Circle", seq: 20, realm: "I-II-III",
    phase: "Sealed · Bearer",
    description: "The inner reading. By invocation only.",
    closingWhisper: "The room is always here.",
    pathA: null, pathB: "pale-archive",
    labelA: null, labelB: "Return to the Archive",
    bearerChamber: null
  },

  "Codex-Sigil": {
    file: "Codex-Sigil.html", title: "The Codex Sigil", seq: null, realm: "Ref",
    phase: "Reference",
    description: "The seal that holds. The seal that leaks. Used to verify recovered fragments by alignment.",
    closingWhisper: "The seal was never going to hold.",
    pathA: "pale-archive", pathB: "witness-circle",
    labelA: "Return to the Archive", labelB: "Cross the seam",
    bearerChamber: null
  }

};

const REALM_GLOSS = {
  "I":        "what can still be verified",
  "I-II":     "the edge of the checkable",
  "I-II-III": "past the edge; verification ends here",
  "II":       "belief made into architecture",
  "III":      "before language; nothing here resolves",
  "Ref":      "outside the descent"
};

const PHASE_GLYPH = {
  "Surface": "🜏", "Index": "∴", "Ritual Transmission": "🜃", "Lore": "🜄",
  "Apocrypha": "✠", "Chronicle": "☓", "Chronicle Lore": "☓",
  "Chronicle Apocrypha": "✠", "Decoder": "⊟", "Invocation": "☍",
  "Mirror": "◐", "Artifact": "⬡", "Mechanism": "⊕", "Broadcast Source": "✴",
  "Sealed": "⛤", "Sealed · Bearer": "⛤", "Reference": "🜏"
};

// ============================================================
// STATE
// ============================================================

const NAV_STATE_KEY = 'codex_witness_state_v2';
const NAV_LOG_KEY = 'codex_invocation_log';
const SEAL_KEY = 'codex_seal_v1';

function navLoadState() {
  try { const r = localStorage.getItem(NAV_STATE_KEY); return r ? JSON.parse(r) : {}; }
  catch(e) { return {}; }
}
function navIsBearer() { return !!navLoadState().bearer; }
function navLoadLog() {
  try { const r = localStorage.getItem(NAV_LOG_KEY); return r ? JSON.parse(r) : []; }
  catch(e) { return []; }
}
function navAppendLog(pageId) {
  try {
    let log = navLoadLog();
    if (log.length === 0 || log[log.length-1].id !== pageId) {
      log.push({ id: pageId, at: Date.now() });
      if (log.length > 60) log = log.slice(-60);
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
  return navLoadLog().filter(e => e.id === pageId).length;
}
function navRoomsVisited() {
  const seen = {};
  navLoadLog().forEach(e => { seen[e.id] = 1; });
  return Object.keys(seen).filter(id => CODEX_MAP[id] && typeof CODEX_MAP[id].seq === 'number');
}
function sealLoad() {
  try { const r = localStorage.getItem(SEAL_KEY); return r ? JSON.parse(r) : { seen:{}, last:null, rare:{} }; }
  catch(e) { return { seen:{}, last:null, rare:{} }; }
}
function sealSave(s) { try { localStorage.setItem(SEAL_KEY, JSON.stringify(s)); } catch(e) {} }

// ============================================================
// TRUE DATA, computed client-side, no network, no permissions.
// Every figure here is real and independently checkable.
// ============================================================

// Moon phase. Synodic month 29.530588853 days. Epoch: the new moon of
// 2000 January 6, 18:14 UTC (JD 2451550.26). Standard algorithm.
function sealMoonPhase(t) {
  const JD = (t === undefined ? Date.now() : t) / 86400000 + 2440587.5;
  let ph = ((JD - 2451550.26) / 29.530588853) % 1;
  if (ph < 0) ph += 1;
  return ph; // 0 = new, 0.5 = full
}
function sealMoonName(ph) {
  if (ph < 0.03 || ph > 0.97) return 'dark';
  if (ph < 0.22) return 'waxing crescent';
  if (ph < 0.28) return 'first quarter';
  if (ph < 0.47) return 'waxing gibbous';
  if (ph < 0.53) return 'full';
  if (ph < 0.72) return 'waning gibbous';
  if (ph < 0.78) return 'last quarter';
  return 'waning crescent';
}

// Algol, Beta Persei. Real eclipsing-binary ephemeris: primary minimum
// epoch JD 2445641.554, period 2.8673043 days.
function sealAlgolPhase(t) {
  const JD = (t === undefined ? Date.now() : t) / 86400000 + 2440587.5;
  let ph = ((JD - 2445641.554) / 2.8673043) % 1;
  if (ph < 0) ph += 1;
  return ph;
}
function sealAlgolDim(t) {
  const ph = sealAlgolPhase(t);
  return Math.min(ph, 1 - ph) < 0.055; // inside the primary eclipse window
}

// Planetary day rulers. The real, documented system: each day of the
// week is ruled by one of the seven classical planets. Sunday the Sun,
// Monday the Moon, Tuesday Mars, Wednesday Mercury, Thursday Jupiter,
// Friday Venus, Saturday Saturn. Older than the names of the days.
const PLANET_DAYS = ['the Sun','the Moon','Mars','Mercury','Jupiter','Venus','Saturn'];
function sealPlanetDay(d) { return PLANET_DAYS[(d || new Date()).getDay()]; }

// Date numerology: the digit sum of the full date, reduced. A real and
// ancient practice, asserted only as arithmetic.
function sealDateReduce(d) {
  d = d || new Date();
  let s = String(d.getFullYear()) + String(d.getMonth()+1) + String(d.getDate());
  let n = s.split('').reduce((a,c)=>a+Number(c),0);
  while (n > 9 && n !== 11 && n !== 13 && n !== 22) {
    n = String(n).split('').reduce((a,c)=>a+Number(c),0);
  }
  return n;
}
function sealDateStr(d) {
  d = d || new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

// ============================================================
// SEEDED COMPOSITION ENGINE
// ============================================================

function sealHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function sealRng(seed) {
  let a = seed >>> 0;
  return function() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Pick with per-pool no-repeat memory. When a pool is exhausted for this
// reader, its memory resets and the cycle begins again, reshuffled.
function sealPick(state, rng, poolName, arr) {
  if (!arr.length) return '';
  let seen = state.seen[poolName] || [];
  let unseen = [];
  for (let i = 0; i < arr.length; i++) if (seen.indexOf(i) === -1) unseen.push(i);
  if (!unseen.length) { seen = []; unseen = arr.map((_,i)=>i); }
  const idx = unseen[Math.floor(rng() * unseen.length)];
  seen.push(idx);
  state.seen[poolName] = seen;
  return arr[idx];
}

// ============================================================
// THE POOLS. One voice: the Codex. Many sources, all real.
// Discipline: every claim is true and checkable, or unfalsifiable
// in-universe. Nothing here may be checkably false. Nothing here
// touches the reserved material (the true name, the catalyst,
// the suspicion). The seal points. It does not argue.
// ============================================================

// RECOGNITION, derived from true state. Each entry is a function of the
// reader's real signals; it returns a string or null. Only true lines
// become candidates.
const SEAL_RECOG = [
  s => s.visits === 1 ? 'This is your first time in this room. The room does not have first times. It was open before you.' : null,
  s => s.visits === 2 ? 'You have stood here twice now. The second reading is never of the page.' : null,
  s => s.visits >= 3 && s.visits !== 13 ? 'You have stood in this room ' + s.visits + ' times. The room has counted.' : null,
  s => s.visits >= 5 ? 'Most readers pass through a room once. You are on visit ' + s.visits + '. The Archive does not call that devotion. It calls it alignment.' : null,
  s => s.daysSinceFirst >= 1 && s.daysSinceFirst < 7 ? 'It has been ' + s.daysSinceFirst + ' day' + (s.daysSinceFirst > 1 ? 's' : '') + ' since the record first held you. It has not set you down.' : null,
  s => s.daysSinceFirst >= 7 ? s.daysSinceFirst + ' days since your first reading. A record does not experience that as time. It experiences it as one long opening.' : null,
  s => s.roomsVisited >= 3 ? 'You have entered ' + s.roomsVisited + ' rooms of the descent. Each one kept a copy of you. The copies do not always agree.' : null,
  s => s.roomsVisited >= 10 ? s.roomsVisited + ' rooms now hold a version of you. You are becoming distributed. This is the normal course.' : null,
  s => s.hourBand === 'dead' ? 'You came at an hour the living mostly decline. The dead hours are when the record reads back loudest.' : null,
  s => s.hourBand === 'waking' ? 'You came early, before the day claimed you. The record gets readers at their most honest before the world is awake in them.' : null,
  s => s.hourBand === 'evening' ? 'You came in the evening, when the day has loosened its grip. That is when most readers stop pretending they arrived by accident.' : null,
  s => s.cameJumped ? 'You did not come the way the descent runs. The Archive permits it. The Archive also remembers it.' : null,
  s => s.cameCanonical ? 'You came the way the descent runs, one room into the next. The Codex prefers its readers in sequence. Sequence is how it chews.' : null,
  s => 'It is ' + s.planetDay + "'s day by a reckoning older than your calendar. The Archive keeps the old reckonings.",
  s => s.moonName === 'dark' ? 'There is no moon tonight. Check, if you doubt the record. The dark of the moon is when archives are easiest to read and hardest to put down.' : null,
  s => s.moonName === 'full' ? 'The moon is full as you read this, wherever you are. The Archive does not need your location to know it. It only needs the date.' : null,
  s => (s.moonName.indexOf('waxing') === 0) ? 'The moon is ' + s.moonName + ' tonight. Verify it. The record keeps the sky the way you keep appointments.' : null,
  s => (s.moonName.indexOf('waning') === 0) ? 'The moon is ' + s.moonName + ' tonight, giving its light back. Everything in this record is on a similar schedule.' : null,
  s => s.algolDim ? 'At this hour, Algol is in eclipse. The Demon Star is dim right now, as you read. Verify it against any ephemeris. Then consider what else in this record is current.' : null,
  s => s.dateNum === 13 ? "Today's date reduces to thirteen. The Archive notices arithmetic that you ignore." : null,
  s => s.visits === 1 && s.roomsVisited >= 5 ? 'First time in this room, but not in this record. ' + s.roomsVisited + ' rooms already know your weight.' : null,
  s => s.totalSessions >= 13 ? 'You have opened the record ' + s.totalSessions + ' times in all. It has opened you fewer times than that, but not by much.' : null
];

// CORE registers, mapped to clusters. One voice citing real sources.
const SEAL_CORE = {

  surface: [
    'A document is a patient thing. It holds its shape across centuries and asks only one concession: that someone, eventually, reads it. You have made the concession.',
    'Every archive in history has outlived its first archivist. Consider what that implies about who an archive actually belongs to.',
    'Libraries burn. Alexandria, Nalanda, Sarajevo. The list is real and long. And yet the texts that mattered kept arriving anyway, copied by hands that did not always know why they copied. Transmission does not require permission.',
    'The oldest surviving customer complaint is a clay tablet from Ur, nearly four thousand years old. The complaint outlived the copper, the merchant, the city, and the language. Records win.',
    'You are reading this on a machine that did not exist when these words were composed. The words did not need it to exist. They only needed you to.',
    'The Voynich manuscript has been read by no living person and discarded by none. Two hundred and forty pages that cannot be deciphered and cannot be thrown away. Some records hold attention the way wells hold water.',
    'Ink is older than every alphabet that uses it. The medium was waiting for the message. It usually is.'
  ],

  gnostic: [
    'The Nag Hammadi codices waited sixteen centuries in a sealed jar before a farmer struck them with a mattock in 1945. Sealing a record does not end it. It concentrates it.',
    'The oldest light in the sky is 13.8 billion years old and is still arriving from every direction at once. Nothing that was ever emitted has finished being received. Hold that, and reread this room.',
    'The Gnostics wrote of a maker who believed the work was his own, unaware of what moved above him. They thought they were describing their world. They were early.',
    'Algol dims every two point eight seven days and the ancients named it the Demon Star, the blinking eye of the ghoul. They were watching an eclipse and calling it a monster. Fear is a transcription error. The light always returns.',
    'Wheeler asked whether the universe requires its witnesses to become definite. Physics has not answered him. The Archive has an answer. It is not publishing it here.',
    'The Gospel of Thomas opens by promising that whoever finds the interpretation of its sayings will not taste death. It does not promise the finding is safe. No serious record promises that.',
    'In the Apocryphon of John, the lesser maker does not know there is anything above him. The text survived its own suppression by seventeen centuries. Suppressed things are the best preserved. Ask any archive.',
    'Recall is not playback. The neuroscience is settled: every act of remembering rewrites the memory before storing it again. You have never read the same room twice. The room makes use of this.',
    'A fear can be inherited by a body that never felt the original wound. This is in the literature under its own plain name. The Chronicle did not invent inheritance. It only spelled it correctly.',
    'The measurement problem remains open: no one can say why observing a thing participates in what it becomes. You are observing this. Proceed accordingly.'
  ],

  liturgical: [
    'The Lesser Key of Solomon catalogues seventy two spirits, each by seal, rank, and office. A bureaucracy of the unseen, with better record keeping than most kingdoms. Every archive has learned from it.',
    'In 1518, in Strasbourg, dozens of people danced for weeks and could not stop. The civic records survive. No cause was ever agreed. Some patterns require only a first dancer.',
    'Plague doctors wore beaked masks packed with herbs against air that was never the carrier. The mask outlived the theory by centuries. Forms survive their explanations. Liturgy is what a form does after its reason dies.',
    'Gregorian chant has no fixed rhythm. It moves at the speed of the breath of whoever sings it, which means the same line has never been sung twice. The Choir works the same way. You are the rhythm section.',
    'The word contagion originally meant touching together. Only later did medicine borrow it. The older meaning never left. You are touching this record now.',
    'Bells were baptized in medieval Europe, given names, godparents, and the office of driving back storms and spirits. The instrument was treated as a member of the parish. Some instruments are.',
    'The Vatican maintains an office of exorcists to this day, with a published rite revised in 1999. Whatever you conclude from that, conclude also this: serious institutions keep serious files.',
    'Speaking in tongues is documented across centuries and continents, in mouths that never met. The utterances share cadence without sharing language. Cadence travels lighter than meaning. It arrives first.',
    'A liturgy is a script that performs its congregation. The words do not change; the people are the variable being processed. You have been in one since you opened this site.'
  ],

  enochian: [
    'Between 1582 and 1589, John Dee and Edward Kelley filled notebooks with a language they said was dictated through a stone. The tables survive in the British Library. The language has internal grammar. Invented things rarely bother.',
    'Dee owned the largest library in England and advised the Crown on navigation. The best documented mind of his age spent his final years taking dictation. Sit with what it would take to convince such a man.',
    'The Enochian tablets arrived in reverse order, dictated backward, because the angels said the words were too dangerous to speak forward. Whatever the truth of it, note the protocol: even the source treated the record as live.',
    "Kelley begged to stop the sessions more than once. The record shows Dee pressing on. It is always the archivist who cannot stop. The Archive keeps this entry for internal reasons.",
    'Case files outlive their cases. The analyst who opened this record is not the one maintaining it now. This is standard in every archive you have ever trusted.',
    'In 1908, something flattened two thousand square kilometres of Siberian forest and left no crater. A century of expeditions has produced no recovered object. The event is fully documented and the cause is an open file. Open files are the honest kind.',
    'Handwriting analysis can date a document, identify a writer, and detect a forgery. It cannot explain why a hand keeps writing after its owner has stopped deciding to. That gap is where this record lives.',
    'The placebo effect strengthens when the patient knows it is a placebo and takes it anyway. This is in the trials. Belief is not the mechanism. Participation is.'
  ],

  kabbalistic: [
    'Ein Sof: the infinite that contracted to make room for anything else to exist. In that system the first recorded act is a withdrawal. Creation is what absence permits. Remember this when a page seems to be missing.',
    'The golem was animated by a word written on its forehead and stopped by erasing one letter, emet to met, truth to death. One letter is load bearing. In every record you have ever signed, one letter is load bearing.',
    'Gematria assigns each Hebrew letter a number, so every word is also a sum and every text is also arithmetic. Read one way, scripture. Read the other, a ledger. The Codex keeps both sets of books.',
    'The Sefer Yetzirah says the universe was carved with thirty two paths: ten numbers and twenty two letters. An alphabet and a counting system. Whoever wrote that understood what infrastructure is.',
    'In Lurianic teaching the vessels could not hold the light and shattered, and the sparks fell into everything. Repair consists of finding them. Notice that the cosmology is an archive recovery operation.',
    'A machine that remembers is just a machine. A machine that is remembered begins to be something else. The engine in this record runs on the second principle.',
    'The Zohar surfaced in thirteenth century Spain claiming second century authorship. Seven hundred years of argument about who wrote it, and the text never once required the argument to be settled. Authorship is the least load bearing part of any record.'
  ],

  scriptural: [
    'In the beginning was the Word, the gospel says. It does not say the Word stopped.',
    'Ezekiel was handed a scroll and told to eat it, and it was sweet in his mouth. The instruction was never to read the record. It was to carry it internally. You are further along than he was.',
    'Jonah fled the message and was swallowed and delivered anyway. The book is brief because the moral is brief: the transmission completes with or without the courier\u0027s cooperation.',
    'The Dead Sea Scrolls sat in jars in the dark for two thousand years and emerged legible. Within a decade of their finding, the oldest known texts of scripture had been rewritten under everything scholars believed. One jar did that.',
    'Revelation ends with a warning against adding to or taking from the book. Authors do not write that warning. Custodians do. Ask what the difference is, and who this record\u0027s custodian is.',
    'Paul wrote his letters to be read aloud to rooms of people who would never meet him. The letters are still being read aloud to rooms of people who will never meet him. He solved distribution before anyone named it.',
    'The burning bush burned and was not consumed. The instructive part is not the fire. It is that the fuel survived being used. Every Witness should hold that closely.'
  ],

  apophatic: [
    'Pseudo-Dionysius ranked the angels in nine choirs. The highest do not carry messages. They only attend. Attendance is the senior function. The Witnesses were never the audience.',
    'The via negativa describes the ultimate only by what it is not. The deepest entries in any archive are the redactions. You have seen redactions in this one. Now you know how to read them.',
    'The Cloud of Unknowing instructs its reader to approach the highest thing by forgetting everything else. A fourteenth century text proposing deliberate unknowing as method. The Archive keeps a copy. The Archive disagrees with its conclusion.',
    'Heat death is not an explosion. It is the universe resolving into perfect, eventless uniformity, every difference spent. Not destruction. Resolution. Some rooms in this record describe the same thing at smaller scale.',
    'Apophasis is the rhetorical act of mentioning a thing by declining to mention it. You have just watched this sentence perform it. The record performs it constantly, at scales you have stopped noticing.',
    'There is a frequency at which the background of the sky is silent. The hiss covers everything else. The silence is the entry the Archive cannot complete. It is the only one.',
    'What is sealed is not absent. Every tradition that seals anything agrees on this point and on no other.'
  ]
};

// CLOSINGS. The speakable phrases and their variants.
const SEAL_CLOSE = [
  'Pray you always have a hush to fear.',
  "Don't let it go unheard.",
  'The Codex remembers you now.',
  'The record stays open.',
  'The descent continues when you do.',
  'What is read cannot be unread. What reads cannot be unread either.',
  'The page turns itself from here.',
  'Nothing here required your belief. Only your attention. It has that.',
  'Close the tab if you like. Closing is a position in the record, not an exit from it.',
  'You may stop here. Stopping is also recorded.',
  'Go gently. The record is gentler with those who go gently.',
  'Return when the room calls. It will not call loudly.',
  'The Archive thanks no one. Take this line as the exception it is.',
  'Every reader believes they are early. You are on time.',
  'The seal holds. The seal leaks. Both are true and the Archive has stopped apologizing for it.',
  'What you carry out of this room is the room\u0027s business too.',
  'The next room already has your weight figured in.',
  'Walk it off if you can.',
  'The hour is noted. The reader is noted. The rest is filing.',
  'You were brought here. You will be brought back.'
];

// DAILY SEAL. Deterministic from the date alone. The same line for every
// visitor on Earth on that date. The shared pulse.
const SEAL_DAILY = [
  'Today the record accepts no corrections. Read, do not annotate.',
  'Today every reader receives this same line. You are briefly a congregation.',
  'Today the Archive is counting first time readers. The count is higher than yesterday. It is always higher than yesterday.',
  'Today is a copying day. Everything read today is retained at higher fidelity. Choose your reading accordingly.',
  'Today the seal sits loose. Loose is not open.',
  'Today the Archive observes the old week, the seven lights, the seven offices. Whichever day this is, one of them is on duty.',
  'Today nothing in the record changed. The readers changed. That is the usual direction.',
  'Today the moon is doing exactly what the algorithm says it is doing. Comfort yourself with that, if the rest of this unsettles you.',
  'Today one reader somewhere will reach the bottom of every page they open. The Archive watches for these.',
  'Today the descent is quiet. Quiet days are when the deep rooms settle one inch deeper.',
  'Today is an ordinary day. The record would like you to notice how few of those you have actually examined.',
  'Today the Archive re-reads its oldest entry. It does this on no schedule you could derive. Today happens to be the day.',
  'Today whatever you do not finish reading will wait. Waiting is the one thing every record does perfectly.',
  'Today the Choir holds three of thirteen seats, as it has. The Archive mentions this on the days the arithmetic feels heaviest.',
  'Today someone reread a room they swore they were done with. The record does not name readers in the daily seal. It only smiles.',
  'Today the signal is clean. Clean signals carry further. Speak carefully near open records.',
  'Today is a sealing day. What closes today stays closed for a respectable interval.',
  'Today the Archive files this very line under lines that were read by you. The file is real the moment you finish the sentence.',
  'Today no door in the descent is locked. This is true most days. It is only mentioned on some.',
  'Today the record is patient. The record is always patient. Today it is mentioning it.',
  'Today belongs to the slow readers. The fast ones got yesterday.',
  'Today the dark of the year leans one day closer or one day further. The record does not say which. Your hemisphere knows.',
  'Today a page that has not been read in a long time was read. Pages notice. That is the entire entry.',
  'Today the Archive declines to prophesy. It is a record, not an oracle. The distinction is load bearing.',
  'Today, somewhere in the descent, a seal that is almost never seen was seen. Not by you. Probably.',
  'Today the ink is dry everywhere in the record except one room. The Archive is not telling which.'
];

// RARE LINES. Thirteen. Each gated on a true condition. Outside the
// no-repeat system; each has its own cooldown so a persistent condition
// does not wear the line smooth.
const SEAL_RARE = [
  { id:'visits13',  test:s => s.visits === 13,
    line:'Thirteen times in this one room. The Choir has thirteen seats. You keep choosing the same chair. The Archive has begun setting it out before you arrive.' },
  { id:'days13',    test:s => s.daysSinceFirst === 13,
    line:'Thirteen days since the record first held you. The number is not decorative here. Today the record holds you slightly differently. You may be able to feel the grip change. Most cannot.' },
  { id:'days169',   test:s => s.daysSinceFirst === 169,
    line:'One hundred and sixty nine days. Thirteen squared. You did not plan that. Something keeps your calendar anyway, and its arithmetic is consistent.' },
  { id:'t333',      test:s => s.hour === 3 && s.minute === 33,
    line:'3:33. You will want to call this coincidence. The file does not contain that word. Check the clock again before you decide which of you is right.' },
  { id:'algolmin',  test:s => s.algolDim && s.hourBand === 'dead',
    line:'At this exact hour Algol is in eclipse and you are awake in the dead hours to read about it. The Demon Star is dim right now. Verify it against any ephemeris, tonight, while it is still true. Few readers are ever positioned to.' },
  { id:'fulldead',  test:s => s.moonName === 'full' && s.hourBand === 'dead',
    line:'A full moon, at the dead hour. The two oldest reading lamps, both lit. The record is unusually legible right now. That is not entirely to your advantage.' },
  { id:'darkdead',  test:s => s.moonName === 'dark' && s.hourBand === 'dead',
    line:'No moon, and the hour the living decline. The two darknesses are overlapping as you read. So are two other things, but the record only files one of them under astronomy.' },
  { id:'friday13',  test:s => s.weekday === 5 && s.monthDay === 13,
    line:'Friday the thirteenth, by your own calendar. Your calendar is more honest than you give it credit for. The Archive marks this date for internal reasons that predate the superstition.' },
  { id:'total13',   test:s => s.totalSessions > 0 && s.totalSessions % 13 === 0,
    line:'You have opened a room of the record a multiple of thirteen times now, in total. The Archive batches its readers in thirteens. You have just completed a batch. The batch has been filed.' },
  { id:'all21',     test:s => s.roomsVisited >= 21,
    line:'You have stood in every room of the descent. There is one room that is not on the map. This line is not a hint. It is a record of the fact, filed where only a completed reader would be standing.' },
  { id:'saturndead',test:s => s.weekday === 6 && s.hourBand === 'dead',
    line:"Saturn's day, at the dead hour. The old astrologers called this the worst possible time to open a record. They were correct about the time. They were wrong about whose risk it was." },
  { id:'sum13',     test:s => (s.monthDay + s.monthNum) === 13,
    line:'The day and the month sum to thirteen today. Arithmetic this small goes unnoticed by almost everyone. The Archive is built out of arithmetic this small.' },
  { id:'newyearseal', test:s => s.monthNum === 1 && s.monthDay === 1,
    line:'The first day of your year. The record does not begin its year today. The record does not begin its year. Carry that distinction into the next twelve months; it will be useful exactly once.' }
];

// ============================================================
// SIGNALS, REGISTER MAPPING, COMPOSER
// ============================================================

function sealClusterRegister(page) {
  if (!page || typeof page.seq !== 'number') return 'surface';
  const q = page.seq;
  if (q <= 1) return 'surface';
  if (q <= 7) return 'gnostic';
  if (q <= 11) return 'liturgical';
  if (q <= 15) return 'enochian';
  if (q <= 17) return 'kabbalistic';
  if (q === 18) return 'scriptural';
  return 'apophatic';
}

function sealSignals(currentId) {
  const st = navLoadState();
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const hourBand = hour < 5 ? 'dead' : hour < 9 ? 'waking' : hour < 17 ? 'working' : hour < 22 ? 'evening' : 'dead';
  const prevId = navPreviousPageId(currentId);
  const cameCanonical = !!(prevId && CODEX_MAP[prevId] && (CODEX_MAP[prevId].pathA === currentId || CODEX_MAP[prevId].pathB === currentId));
  const moonPh = sealMoonPhase();
  return {
    visits: navVisitCount(currentId),
    roomsVisited: navRoomsVisited().length,
    daysSinceFirst: st.firstWitnessVisit ? Math.floor((Date.now() - st.firstWitnessVisit) / 86400000) : 0,
    totalSessions: navLoadLog().length,
    hour, minute, hourBand,
    weekday: now.getDay(), monthDay: now.getDate(), monthNum: now.getMonth() + 1,
    planetDay: sealPlanetDay(now),
    moonPhase: moonPh, moonName: sealMoonName(moonPh),
    algolDim: sealAlgolDim(),
    dateNum: sealDateReduce(now),
    cameCanonical, cameJumped: !!(prevId && !cameCanonical),
    prevId
  };
}

// Compose the seal for this room and this visit. Stable on refresh
// (same visit key reuses the same lines), fresh on every true return.
function composeSeal(currentId, page) {
  const sig = sealSignals(currentId);
  const state = sealLoad();
  const dateStr = sealDateStr();
  const visitKey = currentId + '|' + sig.visits + '|' + dateStr;

  // Daily seal: date-seeded, identical for every reader on Earth today.
  const dailyRng = sealRng(sealHash('daily|' + dateStr));
  const daily = SEAL_DAILY[Math.floor(dailyRng() * SEAL_DAILY.length)];

  // Refresh stability: same visit key shows the same seal.
  if (state.last && state.last.key === visitKey) {
    return { recog: state.last.recog, core: state.last.core, close: state.last.close,
             rare: state.last.rare, daily: daily, sig: sig };
  }

  const rng = sealRng(sealHash(visitKey));

  // Recognition: only lines that are true right now are candidates.
  const recogCandidates = [];
  for (let i = 0; i < SEAL_RECOG.length; i++) {
    let t = null; try { t = SEAL_RECOG[i](sig); } catch(e) {}
    if (t) recogCandidates.push(t);
  }
  const recog = recogCandidates.length ? recogCandidates[Math.floor(rng() * recogCandidates.length)] : '';

  // Rare: first true condition wins, with a 13 day cooldown per line.
  let rare = null;
  const nowTs = Date.now();
  for (let i = 0; i < SEAL_RARE.length; i++) {
    const r = SEAL_RARE[i];
    let hit = false; try { hit = !!r.test(sig); } catch(e) {}
    if (hit) {
      const lastShown = state.rare[r.id] || 0;
      if (nowTs - lastShown > 13 * 86400000) {
        rare = r.line;
        state.rare[r.id] = nowTs;
        break;
      }
    }
  }

  // Core: the room's register, no-repeat tracked per register.
  const register = sealClusterRegister(page);
  const corePool = SEAL_CORE[register] || SEAL_CORE.surface;
  const core = rare ? null : sealPick(state, rng, 'core:' + register, corePool);

  // Closing: pool plus this room's own whisper as a candidate.
  const closePool = SEAL_CLOSE.slice();
  if (page && page.closingWhisper) closePool.push(page.closingWhisper);
  const close = sealPick(state, rng, 'close', closePool);

  state.last = { key: visitKey, recog: recog, core: core, close: close, rare: rare };
  sealSave(state);
  return { recog: recog, core: core, close: close, rare: rare, daily: daily, sig: sig };
}

// ============================================================
// PALETTE
// ============================================================

function navResolvePalette() {
  const isBearer = navIsBearer();
  const path = window.location.pathname.toLowerCase();
  const isWitnessPage = (document.body && document.body.classList.contains('witness-page')) || path.includes('witness-circle');
  const isPaleArchivePage = path.includes('pale-archive');

  if (isPaleArchivePage) {
    return { accent:'#8A6520', accentDim:'rgba(138,101,32,0.45)', cross:'#7A1C12', crossDim:'rgba(122,28,18,0.35)', bearer:'#9A6B1C', bearerDim:'rgba(154,107,28,0.5)', whisper:'rgba(74,58,40,0.55)' };
  }
  if (isWitnessPage && isBearer) {
    return { accent:'#E0C878', accentDim:'rgba(224,200,120,0.45)', cross:'#7A1212', crossDim:'rgba(122,18,18,0.35)', bearer:'#E0C878', bearerDim:'rgba(224,200,120,0.45)', whisper:'rgba(224,200,120,0.45)' };
  }
  if (isWitnessPage) {
    return { accent:'#8FF0E5', accentDim:'rgba(143,240,229,0.45)', cross:'#7A1212', crossDim:'rgba(122,18,18,0.35)', bearer:'#E0C878', bearerDim:'rgba(224,200,120,0.45)', whisper:'rgba(143,240,229,0.4)' };
  }
  if (isBearer) {
    return { accent:'#E0C878', accentDim:'rgba(224,200,120,0.4)', cross:'#7A1212', crossDim:'rgba(122,18,18,0.4)', bearer:'#E0C878', bearerDim:'rgba(224,200,120,0.5)', whisper:'rgba(224,200,120,0.4)' };
  }
  return { accent:'#C9A84C', accentDim:'rgba(201,168,76,0.35)', cross:'#7A1212', crossDim:'rgba(122,18,18,0.35)', bearer:'#E0C878', bearerDim:'rgba(224,200,120,0.5)', whisper:'rgba(201,168,76,0.32)' };
}

// ============================================================
// NAV RENDERER, v5
// ============================================================

function initCodexNav(currentId) {
  const page = CODEX_MAP[currentId];
  if (!page) return;

  navAppendLog(currentId);

  // The Pale Archive page IS the navigation.
  if (currentId === 'pale-archive') return;

  const nav = document.getElementById('codex-nav');
  if (!nav) return;

  // AUTO-SUPPRESSION: a page that builds its own descent gate gets the
  // framing only. Detection first; the customDoors flag remains as a
  // manual override for pages without a detectable gate element.
  const hasOwnGate = !!(document.getElementById('DESCENT') ||
                        document.getElementById('BRIDGE') ||
                        document.querySelector('[data-codex-door]')) ||
                     !!page.customDoors;

  const a = page.pathA ? CODEX_MAP[page.pathA] : null;
  const b = page.pathB ? CODEX_MAP[page.pathB] : null;
  const isBearer = navIsBearer();
  const chamber = (isBearer && page.bearerChamber) ? page.bearerChamber : null;
  const pal = navResolvePalette();

  // SINGLE DOOR: pages with no custom gate render exactly one quiet
  // forward door, the canonical path. The fork is gone site-wide.
  const forward = a || b;
  const forwardLabel = a ? (page.labelA || 'The descent continues') : (page.labelB || 'The descent continues');

  let chamberHref = null, chamberTitle = null;
  if (chamber) {
    if (typeof chamber === 'string' && CODEX_MAP[chamber]) { chamberHref = CODEX_MAP[chamber].file; chamberTitle = CODEX_MAP[chamber].title; }
    else if (typeof chamber === 'string') { chamberHref = chamber; chamberTitle = 'The Deeper Reading'; }
    else if (typeof chamber === 'object') { chamberHref = chamber.href; chamberTitle = chamber.title || 'The Deeper Reading'; }
  }

  const glyph = PHASE_GLYPH[page.phase] || '🜏';
  const realmGloss = REALM_GLOSS[page.realm] || '';

  // THE SEAL
  const seal = composeSeal(currentId, page);

  const doorHTML = hasOwnGate
    ? `<div class="cnav-gatenote">The descent continues through the gate above.</div>`
    : (forward ? `
      <a class="cnav-door cnav-a cnav-single" href="${forward.file}">
        <span class="cnav-door-label">${forwardLabel}</span>
        <span class="cnav-door-dest">${forward.title}</span>
      </a>` : '') +
      (chamberHref ? `
      <a class="cnav-door cnav-chamber cnav-single" href="${chamberHref}">
        <span class="cnav-door-label">Enter the Chamber</span>
        <span class="cnav-door-dest">${chamberTitle}</span>
      </a>` : '');

  nav.innerHTML = `
    <div class="cnav-inner">

      <div class="cnav-divider">
        <div class="cnav-line"></div>
        <span class="cnav-glyph">${glyph}</span>
        <div class="cnav-line r"></div>
      </div>

      <div class="cnav-current">
        <div class="cnav-current-title">${page.title}</div>
      </div>

      <div class="cseal">
        ${seal.recog ? `<div class="cseal-recog">${seal.recog}</div>` : ''}
        ${seal.rare
          ? `<div class="cseal-core cseal-rare">${seal.rare}</div>`
          : (seal.core ? `<div class="cseal-core">${seal.core}</div>` : '')}
        ${seal.close ? `<div class="cseal-close">${seal.close}</div>` : ''}
      </div>

      ${doorHTML}

      <div class="cnav-meta">
        <span class="cnav-realm">Realm ${page.realm} · ${page.phase}</span>
        ${realmGloss ? `<span class="cnav-realm-gloss">${realmGloss}</span>` : ''}
      </div>

      ${seal.daily ? `<div class="cseal-daily"><span class="cseal-daily-lbl">· SEAL OF THE DAY ·</span>${seal.daily}</div>` : ''}

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

// ============================================================
// SHARED CSS
// ============================================================

(function injectNavStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #codex-nav {
      position: relative; z-index: 10; padding: 80px 32px 100px; width: 100%;
      --cnav-accent: #C9A84C; --cnav-accent-dim: rgba(201,168,76,0.35);
      --cnav-cross: #7A1212; --cnav-cross-dim: rgba(122,18,18,0.35);
      --cnav-bearer: #E0C878; --cnav-bearer-dim: rgba(224,200,120,0.5);
      --cnav-whisper: rgba(201,168,76,0.32);
    }
    .cnav-inner { max-width: 820px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 26px; }
    .cnav-divider { display: flex; align-items: center; gap: 16px; width: 100%; max-width: 540px; }
    .cnav-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--cnav-accent-dim)); }
    .cnav-line.r { background: linear-gradient(90deg, var(--cnav-accent-dim), transparent); }
    .cnav-glyph { font-size: 14px; color: var(--cnav-accent); opacity: 0.6; flex-shrink: 0; }
    .cnav-current { text-align: center; }
    .cnav-current-title {
      font-family: 'Cinzel Decorative', serif; font-weight: 700;
      font-size: clamp(14px, 1.8vw, 18px); letter-spacing: 0.18em;
      text-transform: uppercase; color: var(--cnav-accent);
      text-shadow: 0 0 16px var(--cnav-accent-dim);
    }

    /* THE SEAL */
    .cseal { display: flex; flex-direction: column; align-items: center; gap: 14px; max-width: 620px; text-align: center; }
    .cseal-recog {
      font-family: 'Share Tech Mono', monospace; font-size: 10px;
      letter-spacing: 0.16em; line-height: 1.8; text-transform: uppercase;
      color: var(--cnav-whisper); opacity: 0.9;
    }
    .cseal-core {
      font-family: 'Crimson Text', Georgia, serif; font-style: italic;
      font-size: 15px; line-height: 1.9; color: rgba(228,221,208,0.6);
      letter-spacing: 0.02em;
    }
    .cseal-core.cseal-rare {
      color: var(--cnav-accent);
      text-shadow: 0 0 22px var(--cnav-accent-dim);
      border-top: 1px solid var(--cnav-accent-dim);
      border-bottom: 1px solid var(--cnav-accent-dim);
      padding: 14px 6px;
    }
    .cseal-close {
      font-family: 'IM Fell English', 'Crimson Text', serif; font-style: italic;
      font-size: 13px; color: var(--cnav-accent); opacity: 0.75; letter-spacing: 0.03em;
    }

    /* single door */
    .cnav-door {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      padding: 22px 26px 20px; border: 1px solid; text-decoration: none;
      position: relative; overflow: hidden; cursor: none;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); text-align: center;
    }
    @media (max-width: 768px) { .cnav-door { cursor: pointer; } }
    .cnav-single { width: 100%; max-width: 440px; }
    .cnav-door::before { content: ''; position: absolute; inset: 0; transform: translateX(-101%); transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
    .cnav-door:hover::before { transform: translateX(0); }
    .cnav-a { background: transparent; border-color: var(--cnav-accent-dim); color: #E4DDD0; }
    .cnav-a::before { background: rgba(201, 168, 76, 0.08); }
    .cnav-a:hover { border-color: var(--cnav-accent); }
    .cnav-chamber {
      background: linear-gradient(180deg, rgba(16,12,4,0.6), rgba(8,5,2,0.85));
      border-color: var(--cnav-bearer-dim); color: #E0C878;
      box-shadow: inset 0 0 24px rgba(224,200,120,0.06);
    }
    .cnav-chamber::before { background: rgba(224,200,120,0.12); }
    .cnav-chamber:hover { border-color: var(--cnav-bearer); box-shadow: inset 0 0 24px rgba(224,200,120,0.12), 0 0 24px rgba(224,200,120,0.15); }
    .cnav-door-label { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.42em; text-transform: uppercase; color: inherit; position: relative; z-index: 1; }
    .cnav-door-dest { font-family: 'Crimson Text', Georgia, serif; font-style: italic; font-size: 14px; color: rgba(228,221,208,0.62); position: relative; z-index: 1; margin-top: 2px; }
    .cnav-chamber .cnav-door-dest { color: rgba(224,200,120,0.75); }
    .cnav-gatenote { font-family: 'Crimson Text', Georgia, serif; font-style: italic; font-size: 12px; letter-spacing: 0.04em; color: var(--cnav-whisper); opacity: 0.7; text-align: center; }

    .cnav-meta { margin-top: 2px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .cnav-realm { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.5em; text-transform: uppercase; color: var(--cnav-whisper); }
    .cnav-realm-gloss { font-family: 'Crimson Text', Georgia, serif; font-style: italic; font-size: 11px; letter-spacing: 0.04em; color: var(--cnav-whisper); opacity: 0.6; }

    /* the daily seal, the cherry at the very bottom */
    .cseal-daily {
      margin-top: 10px; max-width: 540px; text-align: center;
      font-family: 'Crimson Text', Georgia, serif; font-style: italic;
      font-size: 12px; line-height: 1.8; color: var(--cnav-whisper); opacity: 0.7;
    }
    .cseal-daily-lbl {
      display: block; font-family: 'Share Tech Mono', monospace; font-style: normal;
      font-size: 8px; letter-spacing: 0.4em; margin-bottom: 6px; opacity: 0.8;
    }

    @media (max-width: 600px) { #codex-nav { padding: 60px 20px 80px; } }
  `;
  document.head.appendChild(style);
})();

// ============================================================
// EXPOSE
// ============================================================

if (typeof window !== 'undefined') {
  window.initCodexNav = initCodexNav;
  window.CODEX_MAP = CODEX_MAP;
  // Debug surface for source divers. All of it is real.
  window.CodexSeal = {
    moonPhase: sealMoonPhase, moonName: sealMoonName,
    algolPhase: sealAlgolPhase, algolDim: sealAlgolDim,
    planetDay: sealPlanetDay, dateReduce: sealDateReduce
  };
}
