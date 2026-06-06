/* ════════════════════════════════════════════════════════════════
   CODEX CIPHER — the shared conduit for the descent-puzzle system.

   This file is deliberately boring. It is the wiring, not the fixtures.
   Each page declares its own trigger (the page-native, lore-gated act
   that earns a fragment). This layer only records that it happened,
   validates gates, and counts fragments toward the Pale Mirror.

   SAFETY: the puzzle lives in its OWN localStorage key (codex_cipher_v1),
   wholly separate from codex_witness_state_v2 (the witness/bearer state).
   Nothing here can ever read, write, or corrupt bearer/oath state.

   It is loaded on every page, exactly like codex-nav.js, and exposes a
   single global: window.Cipher.
   ════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var STORE_KEY = 'codex_cipher_v1';

  /* ── The front-door limb. Each limb is a self-contained puzzle whose
        fragments assemble into one phrase, spoken at that limb's gate.
        Additional limbs (Gospel, Infection Remembers, …) register here
        later; the Pale Mirror counts solved limbs across all of them. ── */
  var LIMBS = {
    'front-door': {
      // The three earned markers required before the gate will even listen.
      fragments: ['fragment-0', 'fragment-1', 'fragment-2'],
      // The assembled phrase, normalized (lowercase, letters+spaces only).
      // Each page reveals ONE word of this to a solver who earns its fragment.
      // Words, in descent order: index → pale archive → witness circle.
      //   index         : "unheard"   (the word the surface only says in lowercase)
      //   pale archive   : "remembers" (what the Codex does instead of recording)
      //   witness circle : "me"        (spoken from inside — Apollo's position)
      // Phrase: "the codex remembers me unheard"  — a Witness saying the true
      // recognition back to the document. Held here; pages reveal it in pieces.
      phrase: 'the codex remembers me unheard',
      // safety net: the three words in reading order also open the seam,
      // so a solver who assembled the words but not the framing still passes
      accept: ['remembers me unheard', 'codex remembers me unheard'],
      gate: 'witness-circle'
    }
  };

  /* ── persistence (isolated, defensive) ── */
  function load() {
    try {
      var r = global.localStorage.getItem(STORE_KEY);
      return r ? JSON.parse(r) : {};
    } catch (e) { return {}; }
  }
  function save(s) {
    try { global.localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {}
  }
  function normPhrase(s) {
    return String(s || '').toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim();
  }

  /* ── earn: a page calls this the moment its native trigger fires.
        Records the marker with a timestamp. Idempotent. Returns true the
        FIRST time a given fragment is earned (so callers can react). ── */
  function earn(fragmentId, meta) {
    if (!fragmentId) return false;
    var s = load();
    if (!s.earned) s.earned = {};
    var first = !s.earned[fragmentId];
    if (first) {
      s.earned[fragmentId] = { at: Date.now(), meta: meta || null };
      save(s);
    }
    return first;
  }

  /* ── has: was this fragment earned in this browser? ── */
  function has(fragmentId) {
    var s = load();
    return !!(s.earned && s.earned[fragmentId]);
  }

  /* ── earnedAt: when was it earned (ms epoch), or 0 ── */
  function earnedAt(fragmentId) {
    var s = load();
    return (s.earned && s.earned[fragmentId] && s.earned[fragmentId].at) || 0;
  }

  /* ── earnedCount / earnedList: introspection for hints & UI ── */
  function earnedList() {
    var s = load();
    return s.earned ? Object.keys(s.earned) : [];
  }

  /* ── limbState: how far along is a given limb? ── */
  function limbState(limbId) {
    var limb = LIMBS[limbId];
    if (!limb) return null;
    var got = limb.fragments.filter(has);
    return {
      id: limbId,
      total: limb.fragments.length,
      found: got.length,
      missing: limb.fragments.filter(function (f) { return !has(f); }),
      complete: got.length === limb.fragments.length,
      solved: isLimbSolved(limbId)
    };
  }

  /* ── gate validation — the heart of the lock.
        Returns a structured verdict so the gate can fail IN CHARACTER:
          ok            → all markers present AND phrase correct
          reason:'phrase'  → markers fine, words wrong
          reason:'markers' → words fine (or not), but the descent isn't complete
        We check markers first: "you have not walked far enough to speak them." ── */
  function tryGate(limbId, typedPhrase) {
    var limb = LIMBS[limbId];
    if (!limb) return { ok: false, reason: 'unknown' };
    var st = limbState(limbId);
    var typed = normPhrase(typedPhrase);
    var phraseOk = (typed === normPhrase(limb.phrase));
    // accept optional alternate phrasings (safety net for close solvers)
    if (!phraseOk && limb.accept) {
      for (var i = 0; i < limb.accept.length; i++) {
        if (typed === normPhrase(limb.accept[i])) { phraseOk = true; break; }
      }
    }

    if (!st.complete) {
      // Markers missing: the gate does not even consider the words yet.
      return { ok: false, reason: 'markers', found: st.found, total: st.total, phraseOk: phraseOk };
    }
    if (!phraseOk) {
      return { ok: false, reason: 'phrase', found: st.found, total: st.total };
    }
    // Mark the limb solved (banks the Mirror-fragment) and report success.
    markLimbSolved(limbId);
    return { ok: true, limb: limbId };
  }

  /* ── solved-limb bookkeeping → this is what the Pale Mirror will count.
        Solving a limb banks exactly one Mirror-fragment. ── */
  function isLimbSolved(limbId) {
    var s = load();
    return !!(s.solved && s.solved[limbId]);
  }
  function markLimbSolved(limbId) {
    var s = load();
    if (!s.solved) s.solved = {};
    if (!s.solved[limbId]) {
      s.solved[limbId] = { at: Date.now() };
      save(s);
    }
  }
  /* ── mirrorFragments: how many limbs solved = how many fragments banked.
        The Pale Mirror's lock will read this when we build it. ── */
  function mirrorFragments() {
    var s = load();
    return s.solved ? Object.keys(s.solved).length : 0;
  }

  /* ── word reveal helper: a page reveals its word once its fragment is
        earned. Pages decide HOW to show it; this just maps fragment→word
        so the mapping lives in one place and can't drift. ── */
  var WORD_FOR = {
    'fragment-0': 'unheard',
    'fragment-1': 'remembers',
    'fragment-2': 'me'
  };
  function wordFor(fragmentId) { return WORD_FOR[fragmentId] || null; }

  /* ── register additional limbs later (Gospel, Infection, …) ── */
  function registerLimb(limbId, def) {
    if (!LIMBS[limbId]) LIMBS[limbId] = def;
  }

  /* ── reset (dev / "clear my descent") — never touches witness state ── */
  function reset() { try { global.localStorage.removeItem(STORE_KEY); } catch (e) {} }

  global.Cipher = {
    earn: earn,
    has: has,
    earnedAt: earnedAt,
    earnedList: earnedList,
    limbState: limbState,
    tryGate: tryGate,
    isLimbSolved: isLimbSolved,
    mirrorFragments: mirrorFragments,
    wordFor: wordFor,
    registerLimb: registerLimb,
    normPhrase: normPhrase,
    reset: reset,
    _limbs: LIMBS
  };
})(window);
