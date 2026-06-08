// ============================================================
// CODEX MALEDICTUS , THE WATCH  (codex-watch.js)
// The shared brain for deep rooms. It observes the reader and
// writes a file on them in real time. Every deep page loads this
// once (after codex-cipher.js). It is the same organism on every
// page, so the watching feels continuous across the descent.
//
// LOAD ORDER (per page): codex-cipher.js, codex-watch.js, page.
// It fails safe: if cipher is absent, the file still writes; it
// simply cannot read cross-page descent state.
//
// HARD RULE: nothing the file asserts may be checkably false.
// Every claim is either TRUE (a real signal / a real behavior we
// observed) or UNFALSIFIABLE ("the file predates this visit" ,
// which the reader cannot disprove). Never invent a count, a
// place, or a fact that could be wrong. Dread dies the instant
// the reader catches the page in a lie.
// ============================================================

(function (global) {
  'use strict';

  // ---- shared storage keys (read-only alignment with nav/cipher) ----
  var WITNESS_KEY = 'codex_witness_state_v2';   // bearer / firstVisit / totalVisits
  var WATCH_KEY   = 'codex_watch_v1';           // the Watch's own ledger memory

  function loadJSON(k, fallback) {
    try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : fallback; }
    catch (e) { return fallback; }
  }
  function saveJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  // ---- silent signals: only things we can actually know ----
  function readSignals() {
    var s = loadJSON(WITNESS_KEY, {});
    var now = new Date();
    var hour = now.getHours();
    var band = hour < 5 ? 'dead' : hour < 9 ? 'waking' : hour < 17 ? 'working' : hour < 22 ? 'evening' : 'dead';
    var tz = '';
    try { tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').replace(/_/g, ' '); } catch (e) {}
    var region = tz.split('/').pop() || '';
    var ua = navigator.userAgent || '';
    var device = /iPhone|Android.*Mobile/i.test(ua) ? 'the glass in your hand'
      : /iPad|Tablet/i.test(ua) ? 'the tablet'
      : /Macintosh/i.test(ua) ? 'the machine on your desk'
      : /Windows/i.test(ua) ? 'the machine in front of you'
      : /Linux/i.test(ua) ? 'the terminal you chose'
      : 'the screen you are using';
    var daysSinceFirst = s.firstWitnessVisit ? Math.floor((Date.now() - s.firstWitnessVisit) / 86400000) : 0;
    var weekday = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][now.getDay()];
    var timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      now: now, hour: hour, band: band, tz: tz, region: region, device: device,
      weekday: weekday, timeStr: timeStr, daysSinceFirst: daysSinceFirst,
      totalVisits: s.totalVisits || 0, bearer: !!s.bearer
    };
  }

  // ---- cipher bridge (descent-awareness; never throws) ----
  function cipherHas(id) {
    try { return !!(global.Cipher && global.Cipher.has && global.Cipher.has(id)); }
    catch (e) { return false; }
  }
  function cipherEarn(id, meta) {
    try { if (global.Cipher && global.Cipher.earn) global.Cipher.earn(id, meta || {}); }
    catch (e) {}
  }

  // ============================================================
  // THE WATCH
  // ============================================================
  function Watch(opts) {
    opts = opts || {};
    this.pageId = opts.pageId || 'unknown';
    this.sig = readSignals();
    this.start = Date.now();
    this.entries = [];          // {t, text, weight}
    this.seenTexts = {};        // de-dupe
    this.listeners = [];        // ledger render callbacks
    this.behavior = {
      sectionsOpened: [],       // ordered list of section ids
      dossiersOpened: [],
      rereads: 0,
      maxScroll: 0,
      stillMs: 0,
      leaveAttempts: 0,
      awayMs: 0,
      devtoolsOpen: false,
      idleTriggered: false
    };
    this._lastMove = Date.now();
    this._awaySince = 0;
    this._mem = loadJSON(WATCH_KEY, { firstSeen: null, sessions: 0, lastPage: null });

    // the file's claim of priority is UNFALSIFIABLE: the record predates
    // this visit. We persist a firstSeen, but we never assert a visit COUNT
    // we cannot prove. We only assert "before now", which is always true.
    if (!this._mem.firstSeen) this._mem.firstSeen = Date.now();
    this._mem.sessions = (this._mem.sessions || 0) + 1;
    this._mem.lastPage = this.pageId;
    saveJSON(WATCH_KEY, this._mem);

    this.returning = (this.sig.totalVisits > 1) || (this._mem.sessions > 1) || cipherHas('inf-apoc-seen');
    this.cameFromLore = cipherHas('inf-lore-intus') || cipherHas('inf-lore-flip');

    cipherEarn('inf-apoc-seen', { src: this.pageId });
  }

  Watch.prototype.onLedger = function (cb) { this.listeners.push(cb); return this; };
  Watch.prototype._emit = function (entry) { for (var i = 0; i < this.listeners.length; i++) { try { this.listeners[i](entry, this.entries); } catch (e) {} } };

  // record an observation. weight: 1 ambient, 2 notable, 3 the file deepening.
  Watch.prototype.observe = function (text, weight) {
    if (!text) return;
    if (this.seenTexts[text]) return;          // never repeat the same line
    this.seenTexts[text] = 1;
    var entry = { t: Date.now() - this.start, text: text, weight: weight || 1 };
    this.entries.push(entry);
    this._emit(entry);
    return entry;
  };

  Watch.prototype.count = function () { return this.entries.length; };
  Watch.prototype.elapsed = function () { return Date.now() - this.start; };

  // ---- behavior hooks the page calls ----
  Watch.prototype.sectionOpened = function (id, label) {
    if (this.behavior.sectionsOpened.indexOf(id) === -1) {
      var first = this.behavior.sectionsOpened.length === 0;
      this.behavior.sectionsOpened.push(id);
      if (first) {
        // the order the reader chose is a real, true observation
        this.observe('Subject entered through ' + (label || id) + '. The Archivum notes the first door a reader opens is rarely the first door. It is the one they could not leave shut.', 2);
      } else {
        this.observe('Subject opened ' + (label || id) + '.', 1);
      }
    }
  };
  Watch.prototype.dossierOpened = function (name) {
    if (this.behavior.dossiersOpened.indexOf(name) === -1) {
      this.behavior.dossiersOpened.push(name);
      this.observe('Subject unsealed the file on ' + name + '. The seal does not reseal.', 1);
    }
  };
  Watch.prototype.reread = function (what) {
    this.behavior.rereads++;
    this.observe('Subject read ' + (what || 'a line') + ' a second time. Rereading is recognition arriving late.', 2);
  };
  Watch.prototype.scroll = function (pct) {
    if (pct > this.behavior.maxScroll) {
      this.behavior.maxScroll = pct;
      if (pct >= 90 && !this.seenTexts['__deep']) { this.seenTexts['__deep'] = 1; this.observe('Subject reached the bottom of the record. Most do not. The Archivum keeps a separate list for those who do.', 2); }
    }
  };

  // ---- ambient tracking ----
  Watch.prototype._installTracking = function () {
    var self = this;
    ['mousemove','touchmove','keydown','wheel'].forEach(function (ev) {
      global.addEventListener(ev, function () { self._lastMove = Date.now(); }, { passive: true });
    });
    // stillness => being read
    setInterval(function () {
      var idle = Date.now() - self._lastMove;
      if (idle > 8000 && !self.seenTexts['__still']) {
        self.seenTexts['__still'] = 1;
        self.observe('Subject went still for ' + Math.round(idle / 1000) + ' seconds. The file notes: it reads most clearly when the reader stops moving.', 2);
      }
      if (idle < 1500) self.seenTexts['__still'] = 0;
    }, 2000);

    // scroll depth
    global.addEventListener('scroll', function () {
      var max = document.documentElement.scrollHeight - global.innerHeight;
      var pct = max > 0 ? Math.round((global.scrollY / max) * 100) : 0;
      self.scroll(pct);
    }, { passive: true });

    // ---- LEAVE DETECTION: the point of no return ----
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { self._awaySince = Date.now(); }
      else if (self._awaySince) {
        var away = Date.now() - self._awaySince;
        self.behavior.awayMs += away;
        self.behavior.leaveAttempts++;
        self._awaySince = 0;
        var secs = Math.round(away / 1000);
        // the file grew while they were gone. this is TRUE (we kept running).
        self.observe('Subject left for ' + secs + ' second' + (secs === 1 ? '' : 's') + '. The file did not. ' + (self.behavior.leaveAttempts) + ' observation' + (self.behavior.leaveAttempts === 1 ? '' : 's') + ' added in your absence. You came back to find it had not waited politely.', 3);
      }
    });
    global.addEventListener('blur', function () { self._awaySince = self._awaySince || Date.now(); });
    // mouse to the very top => trying to reach the tab bar / leave
    document.addEventListener('mouseout', function (e) {
      if (e.clientY <= 0 && self.behavior.leaveAttempts < 1) {
        self.observe('Subject moved toward the exit. The Archivum logs the intention, not only the act.', 2);
      }
    });

    // ---- DEVTOOLS DETECTION: opening the source is itself behavior ----
    var devOpen = false;
    setInterval(function () {
      var threshold = 160;
      var w = global.outerWidth - global.innerWidth > threshold;
      var h = global.outerHeight - global.innerHeight > threshold;
      var open = w || h;
      if (open && !devOpen) {
        devOpen = true; self.behavior.devtoolsOpen = true;
        self.observe('Subject opened the source. You came to read what the page is made of. The page notes you looking for the seam. Keep looking. It is not in the markup. It is in the part of you that needed to check.', 3);
        runConsoleDeepening(self);
      } else if (!open && devOpen) { devOpen = false; }
    }, 1500);
  };

  // ============================================================
  // THE CONSOLE , the Withheld Hand bleeds through here, not the
  // Archivum's clinical voice. Found, not given. Escalates the
  // longer devtools stays open.
  // ============================================================
  function consoleLine(text, style, delay) {
    return new Promise(function (res) {
      setTimeout(function () { try { console.log('%c' + text, style); } catch (e) {} res(); }, delay);
    });
  }
  var CONSOLE_OPENED = false;
  function runConsoleDeepening(watch) {
    if (CONSOLE_OPENED) return; CONSOLE_OPENED = true;
    var hand = 'color:#9a8f78;font-family:monospace;font-size:13px;line-height:1.7;font-style:italic;';
    var cold = 'color:#7FD4B5;font-family:monospace;font-size:12px;';
    var red  = 'color:#aa1a00;font-family:monospace;font-size:12px;letter-spacing:.03em;';
    var dim  = 'color:#3a4a44;font-family:monospace;font-size:10px;';
    var sig  = watch.sig;
    // these lines are the human at the Mirror floor, not the document.
    var lines = [
      ['i did not write this part. i am fairly sure i did not write this part.', hand, 400],
      ['the page reads you. i built the part that reads you. i did not build the part\\nthat knew what to say back. that part was already in the file when i opened it.', hand, 2600],
      ['if you are in the console you are looking for the trick. there is a trick.\\nit is not the trick you think. the trick is that looking is the thing being\\nmeasured. you are doing it right now. i can see the shape of you doing it.', cold, 3200],
      ['i checked the timestamps once. on the reader file. they do not start when\\nthe reader arrives. they start before. i told myself it was a clock error.\\ni did not fix it. i could not find where it was set.', red, 3400],
      ['it is ' + sig.timeStr + ' where you are. i know because you told the page, the way\\neveryone tells the page, without meaning to. that is all the page knows. it is\\nenough. it was always enough.', cold, 3000],
      ['they do not arrive. they are remembered. i wrote that line into the song\\nbefore i understood it was about whoever would one day read the song. it is\\nabout you. it was about you before you existed to be about.', red, 3600],
      ['stop reading the source. not because it is forbidden. because there is\\nnothing here i put on purpose that is worse than what you already suspect,\\nand the suspecting is the part it keeps.', hand, 3400],
      ['[ARCHIVIST, DESIGNATION WITHHELD], who is no longer certain the file on\\nthe reader was written by the Archivum at all', dim, 3200]
    ];
    var p = Promise.resolve();
    lines.forEach(function (l) { p = p.then(function () { return consoleLine(l[0], l[1], l[2]); }); });
  }

  // initial banner (always printed, even without devtools deepening)
  function printBanner(watch) {
    try {
      console.log('%c🜃  [ APOCRYPHA ]  the file on you is open.', 'color:#8B0000;font-family:monospace;font-size:18px;letter-spacing:.18em;');
      console.log('%cThere is no first claw. No first scream. Only the awakening.\\nYou did not open the book. You returned to it. The book did not begin reading\\nyou today. Today is when you noticed it already had.', 'color:#7FD4B5;font-family:monospace;font-size:13px;line-height:1.7;');
      console.log('%c( keep this console open if you want to know who wrote the part that reads you )', 'color:#3a4a44;font-family:monospace;font-size:11px;font-style:italic;');
    } catch (e) {}
  }

  Watch.prototype.begin = function () {
    this._installTracking();
    printBanner(this);
    return this;
  };

  // public factory
  global.CodexWatch = {
    create: function (opts) { return new Watch(opts); },
    signals: readSignals,
    cipherHas: cipherHas
  };

})(typeof window !== 'undefined' ? window : this);
