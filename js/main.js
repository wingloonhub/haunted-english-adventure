/* main.js — boot the game */
(function () {
  "use strict";
  STORE.init();                 // load any local cache (guest by default)
  AUTH.onAuth(function () { UI.route(); });
  UI.route();                   // initial paint (login screen until ready)
  // Unlock the Web Audio context on the very first user click (browser policy).
  document.addEventListener("click", function once() {
    if (window.SOUND) SOUND.unlock();
    document.removeEventListener("click", once);
  }, { capture: true });
})();
