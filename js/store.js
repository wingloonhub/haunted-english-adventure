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

    // wipe one mansion's run progress — kept for emergencies / "reset" buttons.
    resetMansion(mid) {
      const m = STORE.mansion(mid);
      m.coins = 0; m.keys = []; m.cleared = []; m.items = {}; m.burgerBonus = 0; m.shieldsLeft = rollShields();
      // keep "escaped" so a finished mansion still shows as won
      STORE.save();
    },

    // Softer death penalty: lose up to N keys (from the player's WEAKEST topics
    // for this map, so the lost rooms are the ones they need to re-practice) +
    // a coin chunk; items + burgerBonus stay.
    // Record one completed Exam Preparation session onto the active profile so
    // parents can see progress over time and Wing can see which topics need work.
    // History is capped at 50 sessions (oldest dropped first).
    recordExamSession(entry) {
      const p = STORE.active(); if (!p || !entry) return;
      if (!p.exam) p.exam = { history: [] };
      if (!p.exam.history) p.exam.history = [];
      // Ensure a timestamp — cap mistakes to 10 to keep the stored blob small.
      const clean = {
        setId:      entry.setId,
        topicId:    entry.topicId,
        ts:         entry.ts || Date.now(),
        total:      entry.total,
        correct:    entry.correct,
        pct:        entry.total ? Math.round(entry.correct / entry.total * 100) : 0,
        byCat:      entry.byCat || {},
        bySection:  entry.bySection || null,
        mistakes:   (entry.mistakes || []).slice(0, 10)
      };
      p.exam.history.unshift(clean);
      p.exam.history = p.exam.history.slice(0, 50);
      STORE.save();
    },

    applyDefeatPenalty(mid, opts) {
      const p = STORE.active();
      const m = STORE.mansion(mid);
      opts = opts || {};
      const maxKeyLoss = (opts.maxKeyLoss != null) ? opts.maxKeyLoss : 5;
      const coinLoss   = (opts.coinLoss   != null) ? opts.coinLoss   : 100;
      const coinsBefore = m.coins || 0;
      const keysBefore  = (m.keys || []).slice();

      // Per-mansion topic accuracy table (this map's difficulty matters more
      // than the aggregate — Year-4 mall topics rank separately from Year-3
      // haunted-mansion topics).
      const mStats = (p && p.stats && p.stats.byMansion && p.stats.byMansion[mid]) || { byTopic: {} };
      const tStats = mStats.byTopic || {};

      // Score each owned key by the topic accuracy of its room. Lower acc =
      // weaker topic = picked first for loss. Topics with no stats yet are
      // treated as full-accuracy (acc=1) so they're picked LAST.
      const ranked = keysBefore.map((roomId, idx) => {
        const room  = (window.DATA && DATA.room) ? (DATA.room(mid, roomId) || DATA.room(roomId)) : null;
        const topic = room && room.topic;
        const ts    = (topic && tStats[topic]) || { attempts: 0, correct: 0 };
        const acc   = ts.attempts > 0 ? ts.correct / ts.attempts : 1;
        return { roomId, roomName: room && room.name, topic, attempts: ts.attempts, correct: ts.correct, acc, idx };
      });
      // Sort: weakest first; tie-break by most-recently-won first (idx desc)
      // so a fresh win is preferred over an old one at the same accuracy.
      ranked.sort((a, b) => (a.acc - b.acc) || (b.idx - a.idx));

      const lossCount = Math.min(maxKeyLoss, ranked.length);
      const keysLostDetail = ranked.slice(0, lossCount);
      const lostIds = keysLostDetail.map(k => k.roomId);
      m.keys    = keysBefore.filter(k => lostIds.indexOf(k) === -1);
      m.cleared = (m.cleared || []).filter(id => lostIds.indexOf(id) === -1);

      const coinsLost = Math.min(coinsBefore, coinLoss);
      m.coins = Math.max(0, coinsBefore - coinLoss);
      STORE.save();

      return {
        keysLost: lostIds,
        keysLostCount: lostIds.length,
        keysLostDetail,                 // [{ roomId, roomName, topic, attempts, correct, acc }, ...]
        keysRemaining: m.keys.length,
        coinsLost,
        coinsRemaining: m.coins
      };
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
