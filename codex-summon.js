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
      if(load().subscribed){ note.textContent = o.already; host.appendChild(note); return; }
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
        fetch(ACTION, {method:'POST', body:fd, mode:'no-cors'}).then(function(){
          var s = load(); s.subscribed = true; save(s);
          form.remove(); note.textContent = o.done;
        }, function(){
          send.disabled = false;
          note.textContent = 'It did not reach the file. Nothing was kept. Try it again.';
        });
      });
      host.appendChild(note); host.appendChild(form);
    }
  };
})(window);
