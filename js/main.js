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

  // ===== Phone / browser back button — navigate inside the app instead of exiting =====
  // Priorities:
  //   1. If a modal overlay is open → close it.
  //   2. If we're in a battle (fMon exists) → tap the HUD "Flee" button.
  //   3. If the current screen has a top-bar back button (id="bk") → click it.
  //   4. Otherwise we're at the app root (menu / auth) — double-tap-to-exit:
  //      show a toast and only actually exit if the user taps back again
  //      within 2 seconds.
  (function () {
    var lastRootBackTs = 0;
    function pushState() { try { history.pushState({ app: true }, "", location.href); } catch (e) {} }
    pushState();   // prime one state on boot so the first back press hits our handler

    window.addEventListener("popstate", function () {
      // 1. Modal open? Close it.
      var modal = document.querySelector(".overlay");
      if (modal) {
        pushState();
        var cancel = modal.querySelector("#cfNo, #ovBack, #pmNo, #ovAgain, #bkBtn");
        if (cancel) cancel.click(); else modal.remove();
        return;
      }
      // 2. In-battle Flee button (opens its own confirm modal — better than losing progress).
      var hudExit = document.getElementById("hudExit");
      if (hudExit) { pushState(); hudExit.click(); return; }
      // 3. Top-bar back button.
      var bk = document.getElementById("bk");
      if (bk) { pushState(); bk.click(); return; }
      // 4. Root screen — double-tap-to-exit within 2 seconds.
      var now = Date.now();
      if (now - lastRootBackTs < 2000) {
        // Let this back press through — browser will close the tab / go back.
        return;
      }
      lastRootBackTs = now;
      pushState();
      if (window.UI && window.UI.toast) UI.toast("Press back again to exit", "");
    });
  })();
})();
