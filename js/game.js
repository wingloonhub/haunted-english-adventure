/* game.js — battle state machine + mansion progress.
   Pure logic; ui.js handles DOM, timing and animation. */
(function () {
  "use strict";
  const M = DATA.MANSION;

  const GAME = {
    mansion: M,
    battle: null,

    progress() { return STORE.mansion(M.id); },

    /* ---- can the player enter this room? ---- */
    canEnter(room) {
      if (room.type === "boss") {
        const p = GAME.progress();
        return p.keys.length >= M.keyRoomIds.length;
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
      return M.startLives + (GAME.progress().burgerBonus || 0);
    },

    /* ---- begin a battle in a monster room ---- */
    startBattle(roomId) {
      const room = DATA.room(roomId);
      const p = GAME.progress();
      if (typeof p.shieldsLeft !== "number") p.shieldsLeft = 1 + Math.floor(Math.random() * 3);
      const lives = GAME.startLives();
      GAME.battle = {
        room,
        topic: room.topic,
        monster: room.monster,
        monsterName: room.monsterName,
        monsterMax: room.hp,                    // 10 lives (boss = 15)
        monsterHp: room.hp,
        maxSteps: M.monsterSteps,               // 5 steps away at the start
        steps: M.monsterSteps,
        maxLives: lives,
        lives,
        wrongCount: 0,                          // wrong answers in THIS battle (used by loot rooms)
        wrongLimit: room.type === "loot" ? 3 : Infinity,
        pool: QUESTIONS.pool(room.topic),
        qIndex: 0,
        current: null,
        armedBlock: false,   // shield/helmet armed
        armedSling: false,   // sling armed
        status: "fighting"
      };
      GAME.nextQuestion();
      return GAME.battle;
    },

    nextQuestion() {
      const b = GAME.battle;
      if (!b) return null;
      if (b.qIndex >= b.pool.length) { b.pool = QUESTIONS.pool(b.topic); b.qIndex = 0; }
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
        p.items[itemId]--; b.lives += it.amount;
        b.maxLives = Math.max(b.maxLives, b.lives);
        STORE.save();
        return { ok: true, kind: "heal", lives: b.lives };
      }
      if (it.kind === "block") {
        if (b.armedBlock) return { ok: false, msg: "A block is already ready." };
        p.items[itemId]--; b.armedBlock = true; STORE.save();
        return { ok: true, kind: "block" };
      }
      if (it.kind === "weapon") {
        if (b.armedSling) return { ok: false, msg: "Sling is already ready." };
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
      STORE.recordAnswer(b.topic, correct, q.q);

      const res = { correct, answerIndex: q.answer, chosen: optIndex };

      if (correct) {
        const useSling = b.armedSling;
        const dmg = useSling ? (DATA.ITEMS.sling.amount || 2) : 1;
        if (useSling) b.armedSling = false;
        res.weapon = useSling ? "sling" : "torch";   // ui draws stone or beam
        res.damage = dmg;
        b.monsterHp = Math.max(0, b.monsterHp - dmg);
        b.steps = Math.min(b.maxSteps, b.steps + 1); // monster pushed back
        b.missStreak = 0;                            // attacking interrupts the approach
        res.pushedBack = true;
        if (b.monsterHp <= 0) {
          b.status = "won";
          res.won = true;
          GAME._grantWin(b);
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
      if (b.room.type === "boss") {
        if (!p.escaped) { p.escaped = true; p.coins += M.coinsPerKill; }
        if (p.cleared.indexOf(b.room.id) === -1) p.cleared.push(b.room.id);
      } else if (b.room.type === "loot") {
        // Study / Gym rooms — repeatable! Always award coins, never mark as cleared.
        p.coins += M.coinsPerKill;
      } else if (firstClear) {
        // Key rooms — only grant rewards on the first clear.
        p.coins += M.coinsPerKill;
        p.cleared.push(b.room.id);
        if (b.room.type === "key" && p.keys.indexOf(b.room.id) === -1) p.keys.push(b.room.id);
      }
      STORE.save();
    },

    // player chose to leave a room mid-fight (no rewards, no penalty)
    quitBattle() { GAME.battle = null; },

    // called by UI when the player has lost all lives in a key/boss room
    onDefeat() {
      STORE.resetMansion(M.id);
      GAME.battle = null;
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
        if (itemId === "burger" && p.burgerBonus > 0) return { ok: false, msg: "Already bought." };
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
        coins: p.coins, keys: p.keys.length, keyTotal: M.keyRoomIds.length,
        lives: b ? b.lives : 0, maxLives: b ? b.maxLives : 0,
        monsterHp: b ? b.monsterHp : 0, monsterMax: b ? b.monsterMax : 0,
        steps: b ? b.steps : 0, maxSteps: b ? b.maxSteps : 0,
        status: b ? b.status : null
      };
    }
  };

  window.GAME = GAME;
})();
