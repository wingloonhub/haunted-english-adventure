/* firebase.js — email/password auth + Firestore cloud save.
   If firebase-config.js still has PASTE_... placeholders, the game
   runs in LOCAL-ONLY mode (saves on this device, no login). */
(function () {
  "use strict";
  const cfg = window.FIREBASE_CONFIG || {};
  const configured = cfg.apiKey && cfg.apiKey.indexOf("PASTE") === -1 && cfg.projectId && cfg.projectId.indexOf("PASTE") === -1;

  const AUTH = {
    enabled: false,        // true once firebase initialises
    configured,
    user: null,
    session: false,        // true once signed in OR playing as local guest
    _cb: null,
    onAuth(fn) { AUTH._cb = fn; },
    _emit() { if (AUTH._cb) AUTH._cb(AUTH.user); }
  };

  if (!configured) {
    // Local-only fallback: act as a guest, never block the game.
    AUTH.enabled = false;
    AUTH.signUp = AUTH.signIn = function () {
      return Promise.reject(new Error("Cloud login is not set up yet. See README.md → Step 2."));
    };
    AUTH.signOut = function () { return Promise.resolve(); };
    AUTH.startGuest = function () {
      STORE.setUser({ uid: null, email: null });
      AUTH.user = null; AUTH.session = true; AUTH._emit();
    };
    window.AUTH = AUTH;
    return;
  }

  let db = null, fbAuth = null;
  try {
    const app = firebase.initializeApp(cfg);
    fbAuth = firebase.auth();
    db = firebase.firestore();
    try { fbAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); } catch (e) { }
    AUTH.enabled = true;
  } catch (e) {
    console.error("Firebase init failed:", e);
    AUTH.enabled = false;
    AUTH.signUp = AUTH.signIn = () => Promise.reject(new Error("Firebase failed to start. Check firebase-config.js."));
    AUTH.signOut = () => Promise.resolve();
    AUTH.startGuest = function () { STORE.setUser({ uid: null }); AUTH.session = true; AUTH._emit(); };
    window.AUTH = AUTH;
    return;
  }

  const docRef = (uid) => db.collection("users").doc(uid);

  function cloudWriter(state) {
    if (!AUTH.user) return;
    docRef(AUTH.user.uid).set(state).catch(err => console.warn("Cloud save failed:", err.message));
  }

  async function loadCloud(uid) {
    try {
      const snap = await docRef(uid).get();
      return snap.exists ? snap.data() : null;
    } catch (e) { console.warn("Cloud load failed:", e.message); return null; }
  }

  AUTH.signUp = function (email, password, displayName) {
    return fbAuth.createUserWithEmailAndPassword(email, password).then(cred => {
      if (displayName) return cred.user.updateProfile({ displayName }).then(() => cred);
      return cred;
    });
  };
  AUTH.signIn = (email, password) => fbAuth.signInWithEmailAndPassword(email, password);
  AUTH.resetPassword = (email) => fbAuth.sendPasswordResetEmail(email);
  AUTH.signOut = () => fbAuth.signOut();

  STORE.setCloudWriter(cloudWriter);

  fbAuth.onAuthStateChanged(async (user) => {
    if (user) {
      const account = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || (user.email ? user.email.split("@")[0] : null)
      };
      STORE.setUser(account);                  // loads this uid's local cache
      const cloud = await loadCloud(user.uid);
      if (cloud) {
        STORE.hydrate(cloud);                  // cloud is source of truth across devices
        STORE.state.account = Object.assign(STORE.state.account, account);
      } else {
        STORE.state.account = Object.assign(STORE.state.account, account, { createdAt: Date.now() });
        STORE.save();                           // first login → push local/blank up
      }
      AUTH.user = user;
      AUTH.session = true;
    } else {
      AUTH.user = null;
      AUTH.session = false;
    }
    AUTH._emit();
  });

  window.AUTH = AUTH;
})();
