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

  // PWA — register the service worker so the browser shows "Install" and
  // the app opens standalone (no browser chrome) when added to the home screen.
  // Only register over https/localhost; skip the in-page file:// preview case.
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("service-worker.js").catch(function (err) {
        console.warn("[PWA] service worker registration failed:", err);
      });
    });
  }
})();
