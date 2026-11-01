// Where a page asks for private things, the fiction steps aside for a person who may be hurting.
// The check is by word. It will miss some and misfire on some, and a misfire only costs a moment.
(function(global){
  'use strict';
  var WORDS = /\b(kill(ing)? myself|suicid\w*|want(ed)? to die|wanna die|wish i (was|were) dead|better off dead|end(ing)? (it all|my life)|take my (own )?life|hurt(ing)? myself|harm(ing)? myself|self[- ]?harm\w*|cut(ting)? myself|no reason to (live|go on)|(don'?t|do not) want to (live|be here|wake up)|can'?t go on)\b/i;
  global.CodexCare = {
    needed: function(text){ return WORDS.test(String(text || '').replace(/’/g, "'")); },
    show: function(host){
      host.textContent = '';
      var box = document.createElement('div');
      box.setAttribute('role', 'alert');
      box.style.cssText = 'font-family:Georgia,"Times New Roman",serif;font-style:normal;font-size:17px;line-height:1.65;color:#F2EFE8;background:#15151A;border:1px solid #6A6A72;padding:20px;text-align:left;cursor:auto;';
      box.innerHTML =
        '<p style="margin:0 0 12px;">This part isn\'t the story.</p>' +
        '<p style="margin:0 0 12px;">What you wrote sounds like it might be real, and if it is, you deserve a real person rather than a website. In the US you can call or text <a href="tel:988" style="color:#BFD9FF;">988</a> at any hour. Anywhere else, <a href="https://findahelpline.com" target="_blank" rel="noopener" style="color:#BFD9FF;">findahelpline.com</a> lists free services in your country.</p>' +
        '<p style="margin:0;">Nothing you typed left this device.</p>';
      host.appendChild(box);
    }
  };
})(window);
