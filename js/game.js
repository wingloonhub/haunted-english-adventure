/* game.js — battle state machine + mansion progress.
   Pure logic; ui.js handles DOM, timing and animation. */
(function () {
  "use strict";
  // Active mansion id. UI calls GAME.setMansion(id) before opening rooms.
  let mansionId = DATA.MANSIONS[0].id;
  function M() { return DATA.mansion(mansionId); }

  const GAME = {
    get mansion() { return M(); },        // back-compat getter
    get mansionId() { return mansionId; },
    setMansion(id) {
      if (DATA.mansion(id)) mansionId = id;
    },
    battle: null,

    progress() { return STORE.mansion(mansionId); },

    /* ---- can the player enter this room? ---- */
    canEnter(room) {
      if (room.type === "boss") {
        const p = GAME.progress();
        return p.keys.length >= M().keyRoomIds.length;
      }
      return true;
    },
    roomStatus(room) {
      const p = GAME.progress();
      if (room.type === "shop") return "shop";
      if (room.type === "boss") {
        if (p.escaped) return "escaped";
        return GAME.canEnter(room) ? "boss" : "locked";
      }
      if (p.cleared.indexOf(room.id) > -1) return "cleared";
      return room.type === "loot" ? "loot" : "open";
    },

    startLives() {
      return M().startLives + (GAME.progress().burgerBonus || 0);
    },

    /* ---- begin a battle in a monster room ---- */
    startBattle(roomId) {
      const room = DATA.room(mansionId, roomId) || DATA.room(roomId);
      const p = GAME.progress();
      if (typeof p.shieldsLeft !== "number") p.shieldsLeft = 1 + Math.floor(Math.random() * 3);
      const lives = GAME.startLives();
      // waveList (if provided) defines a distinct zombie for each wave; otherwise
      // we fall back to a single-wave fight or N copies of the room's primary monster.
      const waveList = (Array.isArray(room.waveList) && room.waveList.length)
        ? room.waveList
        : [{ monster: room.monster, monsterName: room.monsterName }];
      const totalWaves = Math.max(1, room.waveList ? waveList.length : (room.waves || 1));
      const firstWave = waveList[0];
      GAME.battle = {
        room,
        topic: room.topic,
        waveList,
        monster: firstWave.monster,
        monsterName: firstWave.monsterName,
        monsterMax: room.hp,
        monsterHp: room.hp,
        maxSteps: M().monsterSteps,
        steps: M().monsterSteps,
        maxLives: lives,
        lives,
        wrongCount: 0,                          // wrong answers in THIS battle (used by loot rooms)
        wrongLimit: room.type === "loot" ? 3 : Infinity,
        // Wave system — `totalWaves` enemies appear one after another. Player
        // must clear every wave to win the room. Lives carry over between waves.
        totalWaves,
        wave: 1,
        pool: QUESTIONS.pool(room.topic, mansionId),
        qIndex: 0,
        current: null,
        armedBlock: false,    // shield/helmet armed
        armedSling: false,    // sling/gun armed
        heavyUsed: false,     // an `oncePerBattle` heavy weapon was already armed this fight
        status: "fighting"
      };
      GAME.nextQuestion();
      return GAME.battle;
    },

    nextQuestion() {
      const b = GAME.battle;
      if (!b) return null;
      if (b.qIndex >= b.pool.length) { b.pool = QUESTIONS.pool(b.topic, mansionId); b.qIndex = 0; }
      b.current = b.pool[b.qIndex++];
      return b.current;
    },

    /* ---- arm an item the player chose to use ---- */
    useItem(itemId) {
      const b = GAME.battle; if (!b || b.status !== "fighting") return { ok: false };
      const p = GAME.progress();
      if (!p.items[itemId] || p.items[itemId] <= 0) return { ok: false };
      const it = DATA.ITEMS[itemId];
      if (it.kind === "heal") {
        if (b.lives >= b.maxLives) return { ok: false, msg: "Lives are already full!" };
        p.items[itemId]--;
        b.lives = Math.min(b.maxLives, b.lives + it.amount);
        STORE.save();
        return { ok: true, kind: "heal", lives: b.lives };
      }
      if (it.kind === "block") {
        if (b.armedBlock) return { ok: false, msg: "A block is already ready." };
        p.items[itemId]--; b.armedBlock = true; STORE.save();
        return { ok: true, kind: "block" };
      }
      if (it.kind === "weapon") {
        if (b.armedSling) return { ok: false, msg: it.name + " is already ready." };
        if (it.oncePerBattle && b.heavyUsed) {
          return { ok: false, msg: "Only one " + it.name + " shot per battle." };
        }
        p.items[itemId]--; b.armedSling = true; STORE.save();
        return { ok: true, kind: "weapon" };
      }
      return { ok: false };
    },

    /* ---- answer the current question (optIndex), or pass forcedCorrect for builder questions ---- */
    answer(optIndex, forcedCorrect) {
      const b = GAME.battle;
      if (!b || b.status !== "fighting") return null;
      const q = b.current;
      const correct = (typeof forcedCorrect === "boolean") ? forcedCorrect : (optIndex === q.answer);
      STORE.recordAnswer(b.topic, correct, q.q, mansionId);

      const res = { correct, answerIndex: q.answer, chosen: optIndex };

      if (correct) {
        const useSling = b.armedSling;
        const heavyId = M().heavyWeaponItem || "sling";
        const heavyItem = DATA.ITEMS[heavyId] || {};
        const heavyDmg = heavyItem.amount || 2;
        const dmg = useSling ? heavyDmg : 1;
        if (useSling) {
          b.armedSling = false;
          // Lock the heavy weapon for the rest of this battle if it's a once-per-battle item.
          if (heavyItem.oncePerBattle) b.heavyUsed = true;
        }
        // res.weapon names which visual/sound the UI should play.
        // Mansion 1: torch (default) or sling (armed heavy).
        // Mansion 2: bat (default) or gun (armed heavy).
        res.weapon = useSling ? heavyId : (M().weapon || "torch");
        res.damage = dmg;
        b.monsterHp = Math.max(0, b.monsterHp - dmg);
        b.steps = Math.min(b.maxSteps, b.steps + 1); // monster pushed back
        b.missStreak = 0;                            // attacking interrupts the approach
        res.pushedBack = true;
        if (b.monsterHp <= 0) {
          if (b.wave < b.totalWaves) {
            // Wave cleared — the next zombie spawns far away. Lives carry over.
            // Armed items (shield / heavyUsed flag) carry over too.
            b.wave += 1;
            b.monsterHp = b.monsterMax;
            b.steps = b.maxSteps;
            // Swap to the next zombie in the wave list (different art + name).
            const next = b.waveList[b.wave - 1] || { monster: b.monster, monsterName: b.monsterName };
            b.monster = next.monster;
            b.monsterName = next.monsterName;
            res.waveCleared = true;
            res.nextWave = b.wave;
            res.totalWaves = b.totalWaves;
            res.nextMonsterName = next.monsterName;
          } else {
            b.status = "won";
            res.won = true;
            GAME._grantWin(b);
          }
        }
      } else if (b.room.type === "loot") {
        // Study / Gym — wrong answers don't cost lives, but 3 wrongs
        // in this single battle ends it without any coins (soft-lose).
        b.wrongCount += 1;
        res.stepCloser = true;
        res.wrongCount = b.wrongCount;
        res.wrongLimit = b.wrongLimit;
        if (b.wrongCount >= b.wrongLimit) {
          b.status = "lost";
          res.lost = true;
          res.softLost = true;                  // UI: gentle modal, no mansion reset
        }
      } else {
        // wrong answer: monster moves one step left toward the player.
        // The player only loses lives once the monster is RIGHT NEXT to them.
        if (b.steps > 0) {
          b.steps -= 1;
          res.stepCloser = true;
          res.reachedPlayer = (b.steps === 0);     // just arrived next to the player
        } else {
          // monster is already next to the player — every wrong answer is a strike
          if (b.armedBlock) {
            b.armedBlock = false;
            res.blocked = true;                    // shield/helmet absorbs the strike
          } else {
            b.lives = Math.max(0, b.lives - 1);
            res.hit = true;
            res.lifeLost = true;
            if (b.lives <= 0) { b.status = "lost"; res.lost = true; }
          }
        }
      }
      res.state = GAME.snapshot();
      if (b.status === "fighting") GAME.nextQuestion();
      return res;
    },

    _grantWin(b) {
      const p = GAME.progress();
      const firstClear = p.cleared.indexOf(b.room.id) === -1;
      // Per-room coin override (e.g. Gift Wrap pays only 10) — falls back to mansion default.
      const reward = (b.room.coinReward != null) ? b.room.coinReward : M().coinsPerKill;
      if (b.room.type === "boss") {
        if (!p.escaped) { p.escaped = true; p.coins += reward; }
        if (p.cleared.indexOf(b.room.id) === -1) p.cleared.push(b.room.id);
      } else if (b.room.type === "loot") {
        // Study / Gym / Gift Wrap rooms — repeatable! Always award coins, never mark as cleared.
        p.coins += reward;
      } else if (firstClear) {
        // Key rooms — only grant rewards on the first clear.
        p.coins += reward;
        p.cleared.push(b.room.id);
        if (b.room.type === "key" && p.keys.indexOf(b.room.id) === -1) p.keys.push(b.room.id);
      }
      STORE.save();
    },

    // player chose to leave a room mid-fight (no rewards, no penalty)
    quitBattle() { GAME.battle = null; },

    // called by UI when the player has lost all lives in a key/boss room.
    // Softer penalty (not a full mansion reset): lose up to 5 most-recent keys
    // + 100 coins (clamped to 0); items + the +1-life buff stay.
    onDefeat() {
      const penalty = STORE.applyDefeatPenalty(mansionId);
      GAME.battle = null;
      return penalty;
    },

    // called by UI when a loot-room battle ended without coins (3 wrongs).
    // No mansion reset, no lives lost — player can just try again.
    onSoftDefeat() {
      GAME.battle = null;
    },

    /* ---- shop ---- */
    buyItem(itemId) {
      const it = DATA.ITEMS[itemId];
      const p = GAME.progress();
      if (!it) return { ok: false };
      if (it.once) {
        if (it.kind === "maxlife" && p.burgerBonus > 0) return { ok: false, msg: "Already bought." };
      }
      if (p.coins < it.cost) return { ok: false, msg: "Not enough coins." };
      p.coins -= it.cost;
      if (it.kind === "maxlife") {
        p.burgerBonus = (p.burgerBonus || 0) + 1;
        if (GAME.battle && GAME.battle.status === "fighting") { GAME.battle.lives++; GAME.battle.maxLives++; }
      } else {
        p.items[itemId] = (p.items[itemId] || 0) + 1;
      }
      STORE.save();
      return { ok: true };
    },

    snapshot() {
      const b = GAME.battle, p = GAME.progress();
      return {
        coins: p.coins, keys: p.keys.length, keyTotal: M().keyRoomIds.length,
        lives: b ? b.lives : 0, maxLives: b ? b.maxLives : 0,
        monsterHp: b ? b.monsterHp : 0, monsterMax: b ? b.monsterMax : 0,
        steps: b ? b.steps : 0, maxSteps: b ? b.maxSteps : 0,
        status: b ? b.status : null
      };
    }
  };

  window.GAME = GAME;
})();
