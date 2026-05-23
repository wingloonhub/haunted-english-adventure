/* store.js — single source of truth. localStorage cache + cloud hook.
   Now supports MULTIPLE PROFILES (Netflix-style) under one account. */
(function () {
  "use strict";
  const LS_PREFIX = "hem_save_";
  let uidKey = "guest";
  let cloudWriter = null;        // set by firebase.js
  let saveTimer = null;
  const listeners = [];

  function rollShields() { return 1 + Math.floor(Math.random() * 3); } // 1..3 per run
  function blankMansion() {
    return { coins: 0, keys: [], cleared: [], items: {}, burgerBonus: 0, escaped: false, shieldsLeft: rollShields() };
  }
  function newProfileId() { return "p_" + Math.random().toString(36).slice(2, 10); }
  function blankProfile(name, gender) {
    return {
      id: newProfileId(),
      name: (name || "Player").trim() || "Player",
      gender: gender === "girl" ? "girl" : "boy",
      createdAt: Date.now(),
      lastPlayed: Date.now(),
      mansions: {},
      stats: { byTopic: {}, recentWrong: [] }
    };
  }
  function blankState() {
    return {
      account: { uid: null, email: null, createdAt: Date.now() },
      profiles: {},          // { [profileId]: { id, name, mansions, stats, ... } }
      activeProfileId: null
    };
  }

  // If we find an old-shape save ({profile, mansions, stats}), wrap it into a
  // single profile so existing kids don't lose their progress.
  function migrate(data) {
    if (!data || typeof data !== "object") return blankState();
    if (data.profiles && typeof data.profiles === "object") {
      // already in the new shape
      return Object.assign(blankState(), data, {
        account: Object.assign(blankState().account, data.account || {}),
        profiles: data.profiles,
        activeProfileId: data.activeProfileId || Object.keys(data.profiles)[0] || null
      });
    }
    // old shape: { profile, mansions, stats }
    const p = blankProfile((data.profile && data.profile.displayName) || "Player");
    p.mansions = (data.mansions && typeof data.mansions === "object") ? data.mansions : {};
    p.stats = (data.stats && typeof data.stats === "object") ? data.stats : { byTopic: {}, recentWrong: [] };
    p.createdAt = (data.profile && data.profile.createdAt) || Date.now();
    p.lastPlayed = (data.profile && data.profile.lastPlayed) || Date.now();
    const out = blankState();
    out.account = {
      uid: (data.profile && data.profile.uid) || null,
      email: (data.profile && data.profile.email) || null,
      createdAt: (data.profile && data.profile.createdAt) || Date.now()
    };
    out.profiles[p.id] = p;
    out.activeProfileId = p.id;
    return out;
  }

  const STORE = {
    state: blankState(),

    init() {
      try {
        const raw = localStorage.getItem(LS_PREFIX + uidKey);
        if (raw) STORE.state = migrate(JSON.parse(raw));
        else STORE.state = blankState();
      } catch (e) { STORE.state = blankState(); }
      return STORE.state;
    },

    // Called by firebase.js with the auth account info.
    setUser(account) {
      uidKey = account && account.uid ? account.uid : "guest";
      STORE.init();
      STORE.state.account = Object.assign(STORE.state.account, account || {});
    },

    // Replace local state with the cloud copy.
    hydrate(data) {
      if (!data) return;
      STORE.state = migrate(data);
      STORE.persistLocal();
      STORE.emit();
    },

    /* ---------------- PROFILE MANAGEMENT ---------------- */
    profilesList() {
      return Object.values(STORE.state.profiles || {})
        .sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0));
    },
    active() {
      const id = STORE.state.activeProfileId;
      return id ? STORE.state.profiles[id] : null;
    },
    createProfile(name, gender) {
      const p = blankProfile(name, gender);
      STORE.state.profiles[p.id] = p;
      STORE.state.activeProfileId = p.id;
      STORE.save();
      return p;
    },
    updateProfile(id, patch) {
      const p = STORE.state.profiles[id]; if (!p) return false;
      if (patch.name != null) p.name = String(patch.name).trim() || "Player";
      if (patch.gender === "boy" || patch.gender === "girl") p.gender = patch.gender;
      STORE.save();
      return true;
    },
    selectProfile(id) {
      if (!STORE.state.profiles[id]) return false;
      STORE.state.activeProfileId = id;
      STORE.state.profiles[id].lastPlayed = Date.now();
      STORE.save();
      return true;
    },
    renameProfile(id, name) {
      const p = STORE.state.profiles[id]; if (!p) return false;
      p.name = (name || "Player").trim() || "Player";
      STORE.save();
      return true;
    },
    deleteProfile(id) {
      if (!STORE.state.profiles[id]) return false;
      delete STORE.state.profiles[id];
      if (STORE.state.activeProfileId === id) {
        const next = Object.keys(STORE.state.profiles)[0] || null;
        STORE.state.activeProfileId = next;
      }
      STORE.save();
      return true;
    },

    /* ---------------- ACTIVE-PROFILE SCOPED ---------------- */
    mansion(mid) {
      const p = STORE.active(); if (!p) return blankMansion();
      if (!p.mansions[mid]) p.mansions[mid] = blankMansion();
      return p.mansions[mid];
    },

    // wipe one mansion's run progress (player died) — coins & keys lost
    resetMansion(mid) {
      const m = STORE.mansion(mid);
      m.coins = 0; m.keys = []; m.cleared = []; m.items = {}; m.burgerBonus = 0; m.shieldsLeft = rollShields();
      // keep "escaped" so a finished mansion still shows as won
      STORE.save();
    },

    recordAnswer(topic, correct, qtext, mansionId) {
      if (!topic) return;
      const p = STORE.active(); if (!p) return;
      if (!p.stats) p.stats = { byTopic: {}, byMansion: {}, recentWrong: [] };
      // Aggregate across all mansions (kept for back-compat with existing report code)
      const t = p.stats.byTopic;
      if (!t[topic]) t[topic] = { attempts: 0, correct: 0 };
      t[topic].attempts++;
      if (correct) t[topic].correct++;
      // Per-mansion split — each map has different difficulty, so parents can see weaknesses by map.
      if (mansionId) {
        if (!p.stats.byMansion) p.stats.byMansion = {};
        if (!p.stats.byMansion[mansionId]) p.stats.byMansion[mansionId] = { byTopic: {} };
        const mt = p.stats.byMansion[mansionId].byTopic;
        if (!mt[topic]) mt[topic] = { attempts: 0, correct: 0 };
        mt[topic].attempts++;
        if (correct) mt[topic].correct++;
      }
      if (!correct) {
        p.stats.recentWrong = p.stats.recentWrong || [];
        p.stats.recentWrong.unshift({ topic, q: qtext, ts: Date.now(), mansionId });
        p.stats.recentWrong = p.stats.recentWrong.slice(0, 60);
      }
      STORE.save();
    },

    persistLocal() {
      try { localStorage.setItem(LS_PREFIX + uidKey, JSON.stringify(STORE.state)); } catch (e) { }
    },

    save() {
      const p = STORE.active(); if (p) p.lastPlayed = Date.now();
      STORE.persistLocal();
      STORE.emit();
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        if (cloudWriter) cloudWriter(STORE.state);
      }, 900);
    },

    setCloudWriter(fn) { cloudWriter = fn; },
    onChange(fn) { listeners.push(fn); },
    emit() { listeners.forEach(fn => { try { fn(STORE.state); } catch (e) { } }); }
  };

  window.STORE = STORE;
})();
