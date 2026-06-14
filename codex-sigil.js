/* ════════════════════════════════════════════════════════════════
   CODEX SIGIL , The Returning Mark drawing engine.

   A self-contained, drop-in gate where a solver draws the six-stroke
   original Codex glyph in the correct order. Hybrid feel: ghost-guided
   on first solve, freeform afterward. Validates SHAPE + ORDER with
   forgiving tolerance. Pairs with codex-cipher.js: the gate opens only
   when the six device-earned markers are present AND the glyph is drawn.

   Exposes: window.CodexSigil.mount(hostEl, opts)
     opts.onSolve()      , called when glyph drawn correctly in order
     opts.forceGhost     , true to always ghost (testing)
     opts.markersPresent , function -> bool (the 6 earned markers check)

   The glyph geometry is The Returning Mark (see below). Original to the
   Codex. It resolves to nothing but the Codex; that is the point.
   ════════════════════════════════════════════════════════════════ */
(function(global){
  'use strict';

  var BOX=100;
  // The Returning Mark. Doctrine in stroke order: vessel (1,2), return
  // seal (3), then the three already-inside marks (4,5,6) drawn last and
  // inward, because the inside was always there.
  var STROKES=[
    {id:1,role:'vessel-left', pts:[[50,12],[30,24],[22,46],[28,70],[42,84]]},
    {id:2,role:'vessel-right',pts:[[50,12],[70,24],[78,46],[72,70],[58,84]]},
    {id:3,role:'return-seal', pts:[[42,84],[50,88],[58,84]]},
    {id:4,role:'inside-i',    pts:[[50,40],[50,62]]},
    {id:5,role:'inside-ii',   pts:[[40,54],[50,58]]},
    {id:6,role:'inside-iii',  pts:[[60,54],[50,58]]}
  ];
  // in-character refusals keyed to common ordering errors
  var REFUSALS={
    insideBeforeVessel:'You marked the inside before the vessel was closed. Nothing is inside a thing that is not yet sealed. Begin with the descent.',
    returnBeforeVessel:'You sealed the return before the vessel had walls to return to. The base cannot close on nothing.',
    wrongStroke:'That is not the next stroke. The Mark is not drawn in the order the hand prefers. It is drawn in the order it happened.',
    offShape:'The line strayed from the Mark. The Returning Mark does not forgive a wandering hand, only an uncertain one. Again.',
    noMarkers:'The Mark is correct. The device that draws it has not walked the descent. Six rooms must be entered before the seal will read a hand it does not know.'
  };

  function dist(a,b){var dx=a[0]-b[0],dy=a[1]-b[1];return Math.sqrt(dx*dx+dy*dy);}
  // resample a polyline to N points for shape comparison
  function resample(pts,n){
    if(pts.length<2)return pts.slice();
    var total=0,seg=[];
    for(var i=1;i<pts.length;i++){var d=dist(pts[i-1],pts[i]);seg.push(d);total+=d;}
    if(total===0)return pts.slice(0,1);
    var step=total/(n-1),out=[pts[0].slice()],acc=0,idx=0,cur=pts[0].slice();
    for(var k=1;k<n;k++){
      var target=step;
      while(target>0&&idx<seg.length){
        var remain=seg[idx]-acc;
        if(remain>target){
          var t=( (acc+target)/seg[idx] );
          cur=[pts[idx][0]+(pts[idx+1][0]-pts[idx][0])*t, pts[idx][1]+(pts[idx+1][1]-pts[idx][1])*t];
          acc+=target;target=0;
        }else{target-=remain;idx++;acc=0;cur=pts[Math.min(idx,pts.length-1)].slice();}
      }
      out.push(cur.slice());
    }
    return out;
  }
  // compare a drawn stroke against a template stroke; return avg point error (lower=better)
  // tolerant to direction reversal (a stroke drawn backwards still counts)
  function shapeError(drawn,template){
    var N=16;
    var a=resample(drawn,N), b=resample(template,N);
    if(a.length<N||b.length<N)return 999;
    var fwd=0,rev=0;
    for(var i=0;i<N;i++){fwd+=dist(a[i],b[i]);rev+=dist(a[i],b[N-1-i]);}
    return Math.min(fwd,rev)/N;
  }

  var TOL=14; // avg per-point error allowed (0..100 box). forgiving but real.

  function mount(host,opts){
    opts=opts||{};
    host.innerHTML='';
    var solved=(function(){try{return localStorage.getItem('codex_sigil_solved')==='1';}catch(e){return false;}})();
    var ghost=opts.forceGhost||!solved;

    var wrap=document.createElement('div');
    wrap.className='csigil-wrap';
    wrap.innerHTML=
      '<div class="csigil-head">THE RETURNING MARK</div>'
      +'<div class="csigil-sub">'+(ghost?'Trace the six strokes in the order they are given. The Mark teaches itself once.':'Draw the Mark from memory. Six strokes. The order is the doctrine.')+'</div>'
      +'<div class="csigil-stage"><canvas class="csigil-ghost"></canvas><canvas class="csigil-ink"></canvas></div>'
      +'<div class="csigil-note" id="csigil-note">'+(ghost?'Stroke 1 of 6 , the descent begins at the crown.':'Begin.')+'</div>'
      +'<div class="csigil-controls"><button class="csigil-btn" id="csigil-undo">Undo Last Stroke</button><button class="csigil-btn" id="csigil-reset">Start Over</button></div>';
    host.appendChild(wrap);

    var stage=wrap.querySelector('.csigil-stage');
    var gcv=wrap.querySelector('.csigil-ghost'), icv=wrap.querySelector('.csigil-ink');
    var noteEl=wrap.querySelector('#csigil-note');
    var SIZE=Math.min(360, host.clientWidth-8||360);
    [gcv,icv].forEach(function(c){c.width=SIZE;c.height=SIZE;c.style.width=SIZE+'px';c.style.height=SIZE+'px';});
    var gctx=gcv.getContext('2d'), ictx=icv.getContext('2d');
    var S=SIZE/BOX;

    var current=0;            // index of next stroke to draw
    var locked=[];            // committed strokes (drawn polylines, box coords)
    var drawing=false, raw=[];

    function px(p){return [p[0]*S,p[1]*S];}
    function drawGhost(){
      gctx.clearRect(0,0,SIZE,SIZE);
      if(!ghost)return;
      if(current>=STROKES.length)return;
      var t=STROKES[current];
      gctx.lineWidth=2.4*S/1; gctx.strokeStyle='rgba(155,111,232,0.0)';
      // pulse the next ghost stroke
      var a=0.35+Math.sin(Date.now()/400)*0.18;
      gctx.strokeStyle='rgba(95,196,176,'+a+')';
      gctx.lineWidth=3; gctx.lineCap='round'; gctx.lineJoin='round';
      gctx.setLineDash([5,6]);
      gctx.beginPath();
      t.pts.forEach(function(p,i){var q=px(p); i?gctx.lineTo(q[0],q[1]):gctx.moveTo(q[0],q[1]);});
      gctx.stroke(); gctx.setLineDash([]);
      // crown dot at stroke start
      var s=px(t.pts[0]);
      gctx.fillStyle='rgba(95,196,176,'+(a+0.2)+')';
      gctx.beginPath();gctx.arc(s[0],s[1],4,0,Math.PI*2);gctx.fill();
    }
    function drawLocked(){
      ictx.clearRect(0,0,SIZE,SIZE);
      locked.forEach(function(stroke,i){
        var isVessel=STROKES[i].role.indexOf('vessel')===0||STROKES[i].role==='return-seal';
        ictx.strokeStyle=isVessel?'rgba(200,40,24,0.92)':'rgba(95,196,176,0.92)';
        ictx.lineWidth=3.4;ictx.lineCap='round';ictx.lineJoin='round';
        ictx.shadowColor=isVessel?'rgba(200,40,24,0.6)':'rgba(95,196,176,0.6)';ictx.shadowBlur=8;
        ictx.beginPath();
        stroke.forEach(function(p,j){var q=px(p);j?ictx.lineTo(q[0],q[1]):ictx.moveTo(q[0],q[1]);});
        ictx.stroke();ictx.shadowBlur=0;
      });
      // live stroke
      if(drawing&&raw.length){
        ictx.strokeStyle='rgba(216,210,200,0.7)';ictx.lineWidth=2.6;ictx.lineCap='round';ictx.lineJoin='round';
        ictx.beginPath();
        raw.forEach(function(p,j){var q=px(p);j?ictx.lineTo(q[0],q[1]):ictx.moveTo(q[0],q[1]);});
        ictx.stroke();
      }
    }
    var ghostRAF;
    function loop(){drawGhost();ghostRAF=requestAnimationFrame(loop);}
    loop();

    function evt(e){
      var r=icv.getBoundingClientRect();
      var cx=(e.touches?e.touches[0].clientX:e.clientX)-r.left;
      var cy=(e.touches?e.touches[0].clientY:e.clientY)-r.top;
      return [cx/S, cy/S];
    }
    function start(e){if(current>=STROKES.length)return;e.preventDefault();drawing=true;raw=[evt(e)];}
    function move(e){if(!drawing)return;e.preventDefault();raw.push(evt(e));drawLocked();}
    function end(e){
      if(!drawing)return;drawing=false;
      if(raw.length<2){raw=[];drawLocked();return;}
      commitStroke(raw.slice());raw=[];
    }
    icv.addEventListener('mousedown',start);icv.addEventListener('mousemove',move);
    global.addEventListener('mouseup',end);
    icv.addEventListener('touchstart',start,{passive:false});icv.addEventListener('touchmove',move,{passive:false});
    icv.addEventListener('touchend',end);

    function commitStroke(stroke){
      var err=shapeError(stroke,STROKES[current].pts);
      if(err>TOL){
        // wrong shape for the EXPECTED stroke , check if it matches a LATER inside stroke (ordering error)
        var hint=REFUSALS.offShape;
        if(current<3){
          // tried an inside/return mark too early?
          for(var k=3;k<6;k++){if(shapeError(stroke,STROKES[k].pts)<=TOL){hint=REFUSALS.insideBeforeVessel;break;}}
          if(hint===REFUSALS.offShape&&shapeError(stroke,STROKES[2].pts)<=TOL&&current<2)hint=REFUSALS.returnBeforeVessel;
        }
        refuse(hint);drawLocked();return;
      }
      locked.push(stroke);current++;
      drawLocked();
      if(current>=STROKES.length){finish();}
      else{
        var msgs=[
          'The crown is set. Now the other wall of the vessel.',
          'The vessel has two walls. Close it at the base, where the return happens.',
          'The vessel is sealed. What was always inside may now be marked. The first.',
          'The seed. Two marks remain, one to each side, low.',
          'One mark remains. The Returning Mark is almost itself.'
        ];
        note(msgs[current-1]||('Stroke '+(current+1)+' of 6.'));
      }
    }

    function refuse(msg){
      noteEl.classList.add('refuse');
      note(msg);
      setTimeout(function(){noteEl.classList.remove('refuse');},2200);
    }
    function note(m){noteEl.textContent=m;}

    function finish(){
      // shape+order correct. Now the device-marker gate.
      var ok=true;
      if(typeof opts.markersPresent==='function'){try{ok=!!opts.markersPresent();}catch(e){ok=false;}}
      if(!ok){refuse(REFUSALS.noMarkers);return;}
      try{localStorage.setItem('codex_sigil_solved','1');}catch(e){}
      noteEl.classList.add('solved');
      note('The Mark is drawn. The vessel remembers being closed. The Codex remembers being read.');
      cancelAnimationFrame(ghostRAF);gctx.clearRect(0,0,SIZE,SIZE);
      // bloom the completed sigil
      var bloom=0;(function b(){bloom+=0.04;if(bloom>1)bloom=1;ictx.save();ictx.globalAlpha=bloom*0.5;drawLocked();ictx.restore();if(bloom<1)requestAnimationFrame(b);})();
      if(typeof opts.onSolve==='function'){setTimeout(function(){opts.onSolve();},900);}
    }

    wrap.querySelector('#csigil-undo').onclick=function(){
      if(current===0)return;current--;locked.pop();drawLocked();note(ghost?('Stroke '+(current+1)+' of 6.'):'Stroke removed.');
    };
    wrap.querySelector('#csigil-reset').onclick=function(){
      current=0;locked=[];raw=[];drawLocked();note(ghost?'Stroke 1 of 6 , the descent begins at the crown.':'Begin.');
    };

    drawLocked();
    return {reset:function(){current=0;locked=[];drawLocked();}};
  }

  global.CodexSigil={mount:mount, STROKES:STROKES, shapeError:shapeError, resample:resample, _refusals:REFUSALS};
})(typeof window!=='undefined'?window:globalThis);
