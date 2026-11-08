// An address left in a room goes to the same list as the front door. It remembers that you already left one.
(function(global){
  'use strict';
  var KEY = 'codex_summons_v1', ACTION = 'https://app.kit.com/forms/9535977/subscriptions';
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; } }
  function save(o){ try{ localStorage.setItem(KEY, JSON.stringify(o)); }catch(e){} }
  global.CodexSummon = {
    // o: {invite, button, done, already}. Style with .csm-form, .csm-input, .csm-send, .csm-note
    mount: function(host, o){
      if(!host) return;
      var note = document.createElement('p');
      note.className = 'csm-note';
      if(load().subscribed && !o.again){
        note.textContent = o.already; host.appendChild(note);
        // a second address, or a first one that never arrived, is always allowed
        var again = document.createElement('button');
        again.type = 'button'; again.className = 'csm-again'; again.textContent = 'Leave a different address';
        again.style.cssText = 'background:none;border:0;padding:0;color:inherit;font:inherit;font-size:.9em;text-decoration:underline;opacity:.75;cursor:pointer;';
        again.addEventListener('click', function(){
          host.removeChild(note); host.removeChild(again);
          var p = {}; for(var k in o) p[k] = o[k]; p.again = true;
          global.CodexSummon.mount(host, p);
        });
        host.appendChild(again); return;
      }
      note.textContent = o.invite;
      var form = document.createElement('form');
      form.className = 'csm-form';
      var input = document.createElement('input');
      input.className = 'csm-input'; input.type = 'email'; input.required = true;
      input.placeholder = 'your email'; input.setAttribute('aria-label', 'your email');
      var send = document.createElement('button');
      send.className = 'csm-send'; send.type = 'submit'; send.textContent = o.button;
      form.appendChild(input); form.appendChild(send);
      form.addEventListener('submit', function(e){
        e.preventDefault();
        var fd = new FormData(); fd.append('email_address', input.value.trim());
        // only a send that left this device counts as an address on file
        send.disabled = true;
        // Kit answers in JSON and allows any origin, so read what it actually said
        fetch(ACTION, {method:'POST', body:fd, headers:{'Accept':'application/json'}}).then(function(r){ return r.json(); }).then(function(j){
          if(!j || j.status !== 'success'){
            send.disabled = false;
            var why = j && j.errors && j.errors.messages && j.errors.messages[0];
            note.textContent = why ? (why + '. Nothing was kept. Try it again.') : 'It did not reach the file. Nothing was kept. Try it again.';
            return;
          }
          var s = load(); s.subscribed = true; save(s);
          form.remove(); note.textContent = o.done;
        }).catch(function(){
          send.disabled = false;
          note.textContent = 'It did not reach the file. Nothing was kept. Try it again.';
        });
      });
      host.appendChild(note); host.appendChild(form);
    }
  };
})(window);
