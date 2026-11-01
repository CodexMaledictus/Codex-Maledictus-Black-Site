// THE RETURNING MARK: six rooms, six strokes, six words.
// The hand is taught whether or not it notices. Each room gives one, once, and the device keeps it.
(function(global){
  'use strict';
  var STROKES = [
    [[50,12],[30,24],[22,46],[28,70],[42,84]],
    [[50,12],[70,24],[78,46],[72,70],[58,84]],
    [[42,84],[50,88],[58,84]],
    [[50,40],[50,62]],
    [[40,54],[50,58]],
    [[60,54],[50,58]]
  ];
  var ROMAN = ['I','II','III','IV','V','VI'];
  var ROOMS = [
    ['Infection Remembers','infection-remembers.html'],
    ['Infection Lore','infection-lore.html'],
    ['Apocrypha: Infection','apocrypha-infection.html'],
    ['Chronicle I','chronicle-1-infection-remembers.html'],
    ['Case File CM-1','lore-chronicle-1.html'],
    ['The Sealed File','apocrypha-chronicle-1.html']
  ];
  var REDUCED = global.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function has(i){ try { return !!(global.Cipher && Cipher.has('inf-' + i)); } catch(e){ return false; } }
  function count(){ var n = 0; for (var i = 0; i < 6; i++) if (has(i)) n++; return n; }
  function missing(){ var out = []; for (var i = 0; i < 6; i++) if (!has(i)) out.push({ name: ROOMS[i][0], href: ROOMS[i][1] }); return out; }

  function path(p){ return 'M' + p.map(function(q){ return q[0] + ' ' + q[1]; }).join(' L'); }
  function drawing(fresh){
    var out = '<svg viewBox="10 4 80 92" width="74" height="85" aria-hidden="true">';
    STROKES.forEach(function(p, i){
      if (!has(i)) return;
      var hot = i === fresh;
      out += '<path d="' + path(p) + '" fill="none" stroke="' + (hot ? '#E0C878' : '#8A7330') + '" stroke-width="' + (hot ? 3 : 2) + '" stroke-linecap="round" stroke-linejoin="round"' + (hot && !REDUCED ? ' pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" class="cmk-draw"' : '') + '/>';
    });
    return out + '</svg>';
  }
  function words(fresh){
    var out = [];
    for (var i = 0; i < 6; i++) {
      var w = null; try { w = Cipher.wordFor('inf-' + i); } catch(e){}
      if (!has(i) || !w) out.push('<span class="cmk-gap">∴</span>');
      else out.push(i === fresh ? '<b>' + w + '</b>' : '<span>' + w + '</span>');
    }
    return out.join(' ');
  }
  function closing(n){
    if (n === 1) return 'Six rooms each give one. Keep walking.';
    if (n === 5) return 'One room is still holding its stroke.';
    if (n === 6) return 'The hand has all of it. Draw what you were taught.';
    return (6 - n) + ' rooms are still holding theirs.';
  }
  function style(){
    if (document.getElementById('cmk-style')) return;
    var s = document.createElement('style'); s.id = 'cmk-style';
    s.textContent =
      '#cmk{position:fixed;left:50%;bottom:22px;transform:translate(-50%,12px);z-index:2147483000;width:min(420px,calc(100vw - 32px));box-sizing:border-box;display:flex;gap:16px;align-items:center;padding:14px 16px;background:rgba(5,4,9,.96);border:1px solid #8A7330;box-shadow:0 0 34px rgba(0,0,0,.8);color:#E4DDD0;opacity:0;transition:opacity 1s ease,transform 1s ease;pointer-events:none;cursor:auto;}' +
      '#cmk.on{opacity:1;transform:translate(-50%,0);}' +
      '#cmk .cmk-e{font-family:"Share Tech Mono",monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#C9A84C;}' +
      '#cmk .cmk-w{font-family:"IM Fell English","Crimson Text",Georgia,serif;font-style:italic;font-size:17px;line-height:1.35;margin:.3rem 0;color:#8E8778;}' +
      '#cmk .cmk-w b{color:#F0E6C8;font-weight:400;}#cmk .cmk-gap{opacity:.45;}' +
      '#cmk .cmk-s{font-family:"Share Tech Mono",monospace;font-size:11px;line-height:1.5;color:#A89E90;}' +
      '.cmk-draw{animation:cmkdraw 2.4s ease .5s forwards;}@keyframes cmkdraw{to{stroke-dashoffset:0;}}' +
      '@media(prefers-reduced-motion:reduce){#cmk{transition:none;}}';
    document.head.appendChild(s);
  }
  function show(i){
    style();
    var old = document.getElementById('cmk'); if (old) old.remove();
    var n = count(), d = document.createElement('div'); d.id = 'cmk'; d.setAttribute('role','status');
    d.innerHTML = drawing(i) + '<div><div class="cmk-e">Stroke ' + ROMAN[i] + ' of VI ∴ the hand keeps it</div><div class="cmk-w">' + words(i) + '</div><div class="cmk-s">' + closing(n) + '</div></div>';
    document.body.appendChild(d); void d.offsetWidth; d.classList.add('on');
    setTimeout(function(){ d.classList.remove('on'); setTimeout(function(){ d.remove(); }, 1200); }, 11000);
  }
  function give(i, delay){
    try {
      if (!global.Cipher || !Cipher.earn('inf-' + i, { src: ROOMS[i][1] })) return false;
    } catch(e){ return false; }
    setTimeout(function(){ try { show(i); } catch(e){} }, delay || 0);
    return true;
  }
  // readers who solved these before the strokes existed keep what they earned
  function honor(){
    try {
      if (!global.Cipher) return;
      if (Cipher.has('inf-inscription-restored')) Cipher.earn('inf-0', { src: 'earlier' });
      if (Cipher.has('inf-lore-intus')) Cipher.earn('inf-1', { src: 'earlier' });
    } catch(e){}
  }
  honor();
  global.CodexMark = { give: give, count: count, missing: missing, has: has };
})(window);
