/* main.js — boot the game */
(function () {
  "use strict";
  STORE.init();                 // load any local cache (guest by default)
  AUTH.onAuth(function () { UI.route(); });
  UI.route();                   // initial paint (login screen until ready)
})();
