// What must be read is lifted until it can be. What is hidden stays hidden.
// Brightens dim text in each room's own hue. Secrets, bars and tickers are left alone.
(function(){
  'use strict';
  var SECRET = /rdct|redact|classified|buried|egg|leak|bleed|corrupt|ghost|whisper|tick|hidden|wm\b|water|echo|glitch|fossil|seal-bar|dt-|sc-prov|\bti\b|\btl\b/i;
  var SKIP = {SCRIPT:1,STYLE:1,CANVAS:1,SVG:1,svg:1,NOSCRIPT:1,OPTION:1,TEXTAREA:1,INPUT:1,IFRAME:1};
  var COARSE = window.matchMedia && matchMedia('(pointer: coarse)').matches;
  var NARROW = window.matchMedia && matchMedia('(max-width: 768px)').matches;
  var done = new WeakSet();

  function rgb(c){ var m = c.match(/[\d.]+/g) || [0,0,0]; return [+m[0],+m[1],+m[2],m[3] === undefined ? 1 : +m[3]]; }
  function lum(c){ var a = c.slice(0,3).map(function(v){ v /= 255; return v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055,2.4); }); return .2126*a[0]+.7152*a[1]+.0722*a[2]; }
  function ground(e){ while (e) { var c = rgb(getComputedStyle(e).backgroundColor); if (c[3] > .5) return c; e = e.parentElement; } return [0,0,0,1]; }
  function secret(e){ for (var n = e; n && n !== document.body; n = n.parentElement) { if (SECRET.test((n.id || '') + ' ' + (typeof n.className === 'string' ? n.className : ''))) return true; } return false; }

  function lift(e, target){
    var s = getComputedStyle(e), c = rgb(s.color), g = ground(e), a = c[3];
    var mixed = c.slice(0,3).map(function(v,i){ return v*a + g[i]*(1-a); });
    var lg = lum(g); if (lg > .35) return;              // a light room reads by its own rules
    var lt = lum(mixed), now = (lt+.05)/(lg+.05);
    if (now >= target) return;
    var need = (target*(lg+.05)-.05) / Math.max(lt,.004);
    e.style.filter = 'brightness(' + Math.min(need, 6).toFixed(2) + ')';   // keeps hue, and keeps active states brighter than resting ones
  }

  function pass(){
    document.querySelectorAll('body *').forEach(function(e){
      if (done.has(e) || SKIP[e.tagName]) return;
      var text = ''; e.childNodes.forEach(function(n){ if (n.nodeType === 3) text += n.textContent; }); text = text.trim();
      if (text.length < 3) return;
      var s = getComputedStyle(e); if (s.display === 'none') return;
      var hit = e.closest('a,button,label,select,[role=tab],[onclick]');
      if (secret(e)) { done.add(e); return; }
      done.add(e);
      var fs = parseFloat(s.fontSize);
      if (hit) {
        if (NARROW && fs < 11) e.style.fontSize = '11px';
        if (rgb(s.backgroundColor)[3] < .5) lift(e, 4.5);
      } else {
        if (e.style.color || e.tagName === 'EM' || e.tagName === 'SPAN') return;      // a line set dark by hand is meant to be found
        if (NARROW && fs < 10) e.style.fontSize = '10px';
        if (text.length >= 20) {
          var g = ground(e), c = rgb(s.color), cr = (Math.max(lum(c),lum(g))+.05)/(Math.min(lum(c),lum(g))+.05);
          if (cr >= 1.2) lift(e, 3.5);
        }
      }
    });
  }

  function start(){
    if (COARSE) {
      var st = document.createElement('style');
      st.textContent = 'html,body,*{cursor:auto!important}#CUR,#CUR2,#CURD,#cursor,#cur,#cur2{display:none!important}';
      document.head.appendChild(st);
    }
    pass();
    var t; new MutationObserver(function(){ clearTimeout(t); t = setTimeout(pass, 250); }).observe(document.body, {childList:true, subtree:true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
