/* ui.js — all screens, rendering, animation and timing */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const screen = () => document.getElementById("screen");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const ROOM_WIN = {
    garden: "The Shadow Ghost dissolves into mist…",
    library: "The Red-Eye Beast crashes through the shelves and falls!",
    dining: "The Laughing Clown stops laughing forever.",
    bedroom: "The Dark Hall Monster melts into the shadows.",
    kitchen: "The Mirror Ghost shatters into a thousand pieces!",
    bathroom: "The Doorway Demon is sealed away.",
    living: "The White Mask Ghost fades into nothing.",
    master_bedroom: "The Crawling Shade screeches and vanishes.",
    laundry: "The Soap Phantom pops in a flurry of bubbles — every spelling earned its place!",
    ballroom: "The Masquerade Ghost takes a final bow and fades away.",
    study: "The book lights up and you find the right words. Knowledge earned!",
    gym: "You hit your personal best! Your muscles grow stronger.",
    basement: "THE MANSION KING roars one last time… and falls."
  };
  const LOOT_TITLE = { gym: "💪 Workout Complete!", study: "📖 Lesson Mastered!" };
  const LOOT_EMOJI = { gym: "💪", study: "📖" };

  function toast(msg, type) {
    const host = document.getElementById("toast-host");
    const el = document.createElement("div");
    el.className = "toast " + (type || "");
    el.textContent = msg;
    host.appendChild(el);
    setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity .4s"; }, 1900);
    setTimeout(() => el.remove(), 2400);
  }

  /* ===================== AUTH SCREEN ===================== */
  let authMode = "in";
  function renderAuth() {
    const localOnly = !AUTH.configured;
    screen().innerHTML = `
      <div class="center-wrap"><div class="card">
        <div class="title">The Haunted<br/>English Adventure<small>YEAR 3 ENGLISH</small></div>
        <div class="subtitle">${authMode === "up" ? "Create your player account" : "Sign in to play and save your progress"}</div>
        <form id="authForm" autocomplete="on">
          ${authMode === "up" ? `<div class="field"><label>Player name</label><input id="dn" type="text" placeholder="e.g. Preston" required/></div>` : ""}
          <div class="field"><label>Email</label><input id="em" type="email" placeholder="you@example.com" required/></div>
          <div class="field"><label>Password</label><input id="pw" type="password" placeholder="At least 6 characters" minlength="6" required/></div>
          <button class="btn primary full" type="submit">${authMode === "up" ? "Create account & play" : "Sign in"}</button>
        </form>
        <div class="err" id="authErr"></div>
        <div class="auth-toggle">
          ${authMode === "up"
        ? `Already have an account? <a id="toIn">Sign in</a>`
        : `New player? <a id="toUp">Create an account</a> &nbsp;·&nbsp; <a id="forgot">Forgot password</a>`}
        </div>
        ${localOnly ? `<div class="fb-warn"><b>Cloud login is not set up yet.</b> The game works now and saves on this device only. To enable email login + cloud save across devices and the Parent Report syncing, follow <b>README.md → Step 2 (Firebase)</b>, then re-upload. <br/><br/><button class="btn ghost sm" id="guestBtn">Play now on this device →</button></div>` : ""}
      </div></div>`;

    if ($("#toUp")) $("#toUp").onclick = () => { authMode = "up"; renderAuth(); };
    if ($("#toIn")) $("#toIn").onclick = () => { authMode = "in"; renderAuth(); };
    if ($("#guestBtn")) $("#guestBtn").onclick = () => { AUTH.startGuest(); };
    if ($("#forgot")) $("#forgot").onclick = () => {
      const em = $("#em").value.trim();
      if (!em) { $("#authErr").textContent = "Type your email above first, then click Forgot password."; return; }
      AUTH.resetPassword(em).then(() => toast("Password reset email sent.", "good"))
        .catch(e => $("#authErr").textContent = e.message);
    };
    $("#authForm").onsubmit = (e) => {
      e.preventDefault();
      const err = $("#authErr"); err.textContent = "";
      const em = $("#em").value.trim(), pw = $("#pw").value;
      const btn = $("#authForm button"); btn.disabled = true; btn.textContent = "Please wait…";
      const done = (m) => { btn.disabled = false; err.textContent = m; renderAuth(); if (m) $("#authErr").textContent = m; };
      const p = authMode === "up"
        ? AUTH.signUp(em, pw, $("#dn").value.trim())
        : AUTH.signIn(em, pw);
      p.catch(ex => done(friendly(ex)));
    };
  }
  function friendly(ex) {
    const m = (ex && ex.code) || "";
    if (m.includes("email-already-in-use")) return "That email already has an account. Try signing in.";
    if (m.includes("invalid-email")) return "That email address looks wrong.";
    if (m.includes("weak-password")) return "Password must be at least 6 characters.";
    if (m.includes("wrong-password") || m.includes("invalid-credential")) return "Wrong email or password.";
    if (m.includes("user-not-found")) return "No account with that email. Create one first.";
    if (m.includes("too-many-requests")) return "Too many tries. Wait a minute and try again.";
    return (ex && ex.message) || "Something went wrong.";
  }

  /* ===================== MENU ===================== */
  function renderMenu() {
    const active = STORE.active();
    const name = active ? active.name : "Player";
    const p = GAME.progress();
    const accountEmail = (STORE.state.account || {}).email || "";
    screen().innerHTML = `
      <div class="center-wrap"><div class="card">
        <div class="title">The Haunted<br/>English Adventure</div>
        <div class="subtitle">Welcome back, <b>${esc(name)}</b>. ${p.escaped ? "You have escaped this mansion — but coins remain to spend." : "Ten monsters guard ten keys. Find them all to face The Mansion King."}</div>
        <div style="display:flex;flex-direction:column;gap:12px;margin-top:8px">
          <button class="btn primary full" id="play">🕯️ Enter the Mansion</button>
          <button class="btn full" id="report">📊 Parent Report</button>
          <button class="btn full" id="switch">👥 Switch Player</button>
          <button class="btn ghost full" id="how">❓ How to Play</button>
          ${AUTH.user ? `<button class="btn ghost sm" id="out" style="align-self:center">Sign out (${esc(accountEmail)})</button>` : ""}
        </div>
      </div></div>`;
    $("#play").onclick = renderMansionSelect;
    $("#report").onclick = renderReport;
    $("#switch").onclick = renderProfileSelect;
    $("#how").onclick = renderHow;
    if ($("#out")) $("#out").onclick = () => AUTH.signOut();
  }

  function renderHow() {
    screen().innerHTML = `
      <div class="topbar"><span class="back" id="bk">← Back</span><h2>How to Play</h2></div>
      <div class="page" style="max-width:680px;line-height:1.7">
        <p>🗝️ The <b>Haunted Monster Mansion</b> has 12 rooms. Pick any room from the map.</p>
        <p>🔦 Every monster has <b>10 lives</b> (the Mansion King boss has 15). Answer the question <b>right</b> to attack with your <b>Torch Light</b> beam — the monster loses 1 life and is pushed back.</p>
        <p>🪨 If you arm the <b>Sling</b>, your next correct answer <b>fires a stone</b> and does <b>2 damage</b>.</p>
        <p>👣 A <b>wrong</b> answer makes the monster <b>walk one step to the left</b> (toward you). No life is lost while it is still away. Once it is <b>right next to you</b>, every further wrong answer = <b>−1 life</b>. A <b>Shield</b> (if armed) blocks one strike.</p>
        <p>❤️ You have <b>3 lives</b> per room. At 0 lives it is <b>Game Over</b> — the whole mansion resets and you lose its coins and keys.</p>
        <p>🪙 Every monster you beat = <b>30 coins</b>. Spend them in the <b>Store Room</b> on bandages, shields, a sling and more. You choose when to use items during a battle.</p>
        <p>🔑 Beat the 10 key rooms to unlock <b>The Basement</b> and fight <b>The Mansion King</b> to escape!</p>
      </div>`;
    $("#bk").onclick = renderMenu;
  }

  /* ===================== HUD ===================== */
  function hudHTML(opts) {
    opts = opts || {};
    const p = GAME.progress();
    const b = GAME.battle;
    let hearts = "";
    if (b && opts.lives) {
      const mx = Math.max(b.maxLives, b.lives);
      for (let i = 0; i < mx; i++) hearts += ART.heart(i >= b.lives);
    }
    return `<div class="hud">
      ${b && opts.lives ? `<div class="grp"><span class="lbl">Lives</span><span class="hearts">${hearts}</span></div>` : ""}
      <div class="grp"><span class="lbl">Coins</span><span class="coin">🪙</span> ${p.coins}</div>
      <div class="grp"><span class="lbl">Keys</span><span class="key">🗝️</span> ${p.keys.length}/${DATA.MANSION.keyRoomIds.length}</div>
      <div class="hud-spacer"></div>
      ${opts.exit ? `<button class="btn ghost sm" id="hudExit">${opts.exitLabel || "Leave"}</button>` : ""}
    </div>`;
  }

  /* ===================== MANSION SELECT ===================== */
  function renderMansionSelect() {
    const p = GAME.progress();
    const done = p.escaped;
    screen().innerHTML = `
      <div class="topbar"><span class="back" id="bk">← Menu</span><h2>Choose a Mansion</h2></div>
      <div class="center-wrap">
        <div class="card" style="max-width:560px;text-align:center">
          <div class="mansion-pick" id="pick" style="cursor:pointer;border:1px solid var(--border);border-radius:16px;overflow:hidden;background:#0b0a1c">
            <div style="line-height:0">${ART.mansion()}</div>
          </div>
          <div class="title" style="font-size:30px;margin-top:18px">Haunted Monster Mansion</div>
          <div class="subtitle" style="margin:10px 0 6px">
            12 rooms · 10 monsters · 1 terrible King.<br/>
            ${done ? "★ You have escaped this mansion. Return any time to spend coins." :
        `Keys found: <b>${p.keys.length}/${DATA.MANSION.keyRoomIds.length}</b> · Coins: <b>🪙 ${p.coins}</b>`}
          </div>
          <button class="btn primary full" id="enter" style="margin-top:14px">🕯️ Enter this Mansion</button>
          <div class="muted" style="font-size:12.5px;margin-top:14px">More mansions coming soon — they will be locked until you escape this one.</div>
        </div>
      </div>`;
    $("#bk").onclick = renderMenu;
    $("#enter").onclick = renderMap;
    $("#pick").onclick = renderMap;
  }

  /* ===================== MANSION MAP ===================== */
  function renderMap() {
    const cards = DATA.ROOMS.map(r => {
      const st = GAME.roomStatus(r);
      const locked = st === "locked";
      let badge = "";
      if (st === "cleared") badge = `<span class="badge cleared">✔ Cleared</span>`;
      else if (st === "escaped") badge = `<span class="badge cleared">★ Escaped</span>`;
      else if (st === "locked") badge = `<span class="badge locked">🔒 Need ${DATA.MANSION.keyRoomIds.length} keys</span>`;
      else if (st === "shop") badge = `<span class="badge shop">Shop</span>`;
      else if (st === "loot") badge = `<span class="badge loot">Loot</span>`;
      else if (st === "boss") badge = `<span class="badge boss">☠ Boss</span>`;
      const sub = r.type === "shop" ? "Spend your coins" :
        r.type === "boss" ? "Mixed — everything" : r.topicLabel;
      return `<div class="room-card ${locked ? "locked" : ""}" data-room="${r.id}">
        <div class="art">${ART.room(r.id)}</div>
        ${badge}
        <div class="meta">
          <div class="rname">${r.type === "boss" ? "☠" : r.type === "shop" ? "🛒" : "🚪"} ${esc(r.name)}</div>
          <div class="topic">${esc(sub)}</div>
        </div>
      </div>`;
    }).join("");
    screen().innerHTML = `
      ${hudHTML({ exit: true, exitLabel: "← Mansions" })}
      <div class="page">
        <h1>Haunted Monster Mansion</h1>
        <div class="lead">Choose a room. Find all 🗝️ 10 keys to unlock The Basement.</div>
        <div class="rooms-grid">${cards}</div>
      </div>`;
    $("#hudExit").onclick = renderMansionSelect;
    screen().querySelectorAll(".room-card").forEach(c => {
      c.onclick = () => {
        const room = DATA.room(c.dataset.room);
        const st = GAME.roomStatus(room);
        if (st === "locked") { toast("The Basement is locked. Find all " + DATA.MANSION.keyRoomIds.length + " keys first!", "bad"); return; }
        if (room.type === "shop") return renderStore();
        if (st === "cleared" || st === "escaped") {
          showConfirm(`${esc(room.name)} is cleared.`, "Replay this room for practice? (No new coins or keys.)", "Replay", () => beginBattle(room.id));
          return;
        }
        beginBattle(room.id);
      };
    });
  }

  /* ===================== STORE ===================== */
  function renderStore() {
    const p = GAME.progress();
    const items = Object.keys(DATA.ITEMS).map(id => {
      const it = DATA.ITEMS[id];
      const owned = id === "burger" ? (p.burgerBonus > 0) : (p.items[id] || 0);
      const cannot = (id === "burger" && p.burgerBonus > 0);
      const afford = p.coins >= it.cost && !cannot;
      return `<div class="shop-item">
        <div class="ic">${it.icon}</div>
        <div class="nm">${esc(it.name)}</div>
        <div class="ds">${esc(it.desc)}</div>
        <div class="price">🪙 ${it.cost}</div>
        <div class="owned">${id === "burger" ? (p.burgerBonus > 0 ? "✔ Bought (+1 life/room)" : "&nbsp;") : "Owned: " + (p.items[id] || 0)}</div>
        <button class="btn ${afford ? "gold" : ""} sm" data-buy="${id}" ${afford ? "" : "disabled"}>${cannot ? "Already owned" : "Buy"}</button>
      </div>`;
    }).join("");
    screen().innerHTML = `
      ${hudHTML({ exit: true, exitLabel: "← Mansion" })}
      <div class="page">
        <h1>🛒 Store Room</h1>
        <div class="lead">Spend coins from <b>this mansion</b>. Items help you in battle — you decide when to use them.</div>
        <div class="shop-grid">${items}</div>
      </div>`;
    $("#hudExit").onclick = renderMap;
    screen().querySelectorAll("[data-buy]").forEach(btn => {
      btn.onclick = () => {
        const r = GAME.buyItem(btn.dataset.buy);
        if (r.ok) { toast("Bought " + DATA.ITEMS[btn.dataset.buy].name + "!", "gold"); renderStore(); }
        else toast(r.msg || "Cannot buy that.", "bad");
      };
    });
  }

  /* ===================== BATTLE ===================== */
  let busy = false;
  function beginBattle(roomId) {
    GAME.startBattle(roomId);
    busy = false;
    renderBattle(true);
  }

  function triesDotsHTML(wrong, limit) {
    if (!isFinite(limit)) return "";
    let out = "";
    for (let i = 0; i < limit; i++) {
      out += `<span class="try-dot${i < wrong ? " used" : ""}"></span>`;
    }
    return out;
  }

  // Computes the monster's transform so that at steps=0 it stands RIGHT NEXT TO the
  // boy with a small visible gap (not overlapping). Uses live layout when available.
  function monsterTransform() {
    const b = GAME.battle; if (!b) return "translateX(0)";
    const mon = document.getElementById("fMon");
    const pl = document.getElementById("fPlayer");
    const travel = (b.maxSteps - b.steps) / b.maxSteps; // 0 far .. 1 right beside boy
    if (!mon || !pl) return `translateX(${-travel * 100}%)`;
    const gap = 14;                                    // px between boy and monster when adjacent
    const baseLeft = mon.offsetLeft;                   // monster's natural left (no transform)
    const targetLeft = pl.offsetLeft + pl.offsetWidth + gap;
    const delta = (targetLeft - baseLeft) * travel;    // negative, monster shifts left
    return `translateX(${delta}px)`;
  }

  function renderBattle(intro) {
    const b = GAME.battle;
    const q = b.current;
    const p = GAME.progress();
    const builderWords = q.builder ? QUESTIONS.shuffle(q.words || q.target.split(/\s+/)) : null;
    const invItems = Object.keys(DATA.ITEMS).filter(id => id !== "burger" && (p.items[id] || 0) > 0);
    const inv = invItems.length
      ? `<div class="inv-bar"><span class="lbl">Items</span>${invItems.map(id => {
        const it = DATA.ITEMS[id];
        return `<button class="inv-item" data-use="${id}"><span class="ic">${it.icon}</span>${esc(it.name)} <span class="ct">×${p.items[id]}</span></button>`;
      }).join("")}${b.armedBlock ? `<span class="inv-item" style="opacity:.9">🛡️ Block ready</span>` : ""}${b.armedSling ? `<span class="inv-item" style="opacity:.9">🪃 Sling ready</span>` : ""}</div>`
      : `<div class="inv-bar"><span class="lbl">Items</span><span class="muted" style="font-size:13px;align-self:center">No items — buy some in the Store Room.</span>${b.armedBlock ? `<span class="inv-item">🛡️ Block ready</span>` : ""}</div>`;

    screen().innerHTML = `
      ${hudHTML({ lives: true, exit: true, exitLabel: "Flee →" })}
      <div class="battle">
        <div class="arena${b.room.id === "gym" || b.room.id === "study" ? " gym" : ""}">
          <div class="bg">${ART.room(b.room.id)}</div>
          <div class="vignette"></div>
          ${b.room.id === "gym" ? `
            <div class="fighters gym-fighters">
              <div class="fighter lifter" id="fLifter">
                <div class="mon-hp-label">Reps ${b.monsterMax - b.monsterHp}/${b.monsterMax} <span class="tries-inline" id="fTries" title="3 wrong answers ends the round">${triesDotsHTML(b.wrongCount, b.wrongLimit)}</span></div>
                <div class="mon-hp"><i style="width:${((b.monsterMax - b.monsterHp) / b.monsterMax) * 100}%"></i></div>
                <span class="nm">${esc((STORE.active() || {}).name || "You")}</span>
                <div class="lifter-art" id="fLifterArt">${ART.gymPose(b.monsterMax - b.monsterHp, "lift")}</div>
              </div>
            </div>` : b.room.id === "study" ? `
            <div class="fighters gym-fighters">
              <div class="fighter scholar" id="fScholar">
                <div class="mon-hp-label">Books read ${b.monsterMax - b.monsterHp}/${b.monsterMax} <span class="tries-inline" id="fTries" title="3 wrong answers ends the round">${triesDotsHTML(b.wrongCount, b.wrongLimit)}</span></div>
                <div class="mon-hp"><i style="width:${((b.monsterMax - b.monsterHp) / b.monsterMax) * 100}%"></i></div>
                <span class="nm">${esc((STORE.active() || {}).name || "You")}</span>
                <div class="scholar-art" id="fScholarArt">${ART.studyPose(b.monsterMax - b.monsterHp, "read")}</div>
              </div>
            </div>` : `
            <div class="fighters">
              <div class="fighter player" id="fPlayer"><span class="nm">${esc((STORE.active() || {}).name || "You")}</span>${ART.player(b.armedSling ? "sling" : "torch")}</div>
              <div class="fighter monster" id="fMon" style="transform:${monsterTransform()}">
                <div class="mon-hp-label">HP ${b.monsterHp}/${b.monsterMax}</div>
                <div class="mon-hp"><i style="width:${(b.monsterHp / b.monsterMax) * 100}%"></i></div>
                <span class="nm">${esc(b.monsterName)}</span>
                ${ART.monster(b.monster)}
              </div>
            </div>`}
        </div>
        <div class="qpanel"><div class="qwrap">
          <div class="qtag">${esc(b.room.topicLabel)} · ${b.room.type === "boss" ? "FINAL BOSS" : esc(b.room.name)}</div>
          ${q.passage ? `<div style="background:rgba(0,0,0,.35);border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:12px;max-height:170px;overflow:auto;font-size:14px;line-height:1.55;white-space:pre-line">${esc(q.passage)}</div>` : ""}
          <div class="qtext">${esc(q.q).replace(/___/g, '<span class="blank">?</span>')}</div>
          ${q.builder ? `<div class="builder">
            <div class="built" id="built"><span class="placeholder">Tap the words in the correct order…</span></div>
            <div class="word-bank" id="bank">${builderWords.map((w, i) => `<button class="word-chip" data-i="${i}">${esc(w)}</button>`).join("")}</div>
            <div class="builder-actions">
              <button class="btn ghost sm" id="undo" disabled>↶ Undo</button>
              <button class="btn primary sm" id="submitBuild" disabled>Submit answer</button>
            </div>
          </div>` : `<div class="opts" id="opts">
            ${q.options.map((o, i) => `<button class="opt" data-i="${i}"><span class="letter">${"ABCD"[i]}</span>${esc(o)}</button>`).join("")}
          </div>`}
          ${inv}
        </div></div>
      </div>`;

    $("#hudExit").onclick = () => showConfirm("Flee the room?", "You will leave this battle. No coins or keys are lost, but your streak resets next time.", "Flee", () => { GAME.quitBattle(); renderMap(); });

    if (intro) {
      const m = $("#fMon");
      if (m) m.animate([{ opacity: 0, transform: monsterTransform() + " scale(.4)" }, { opacity: 1, transform: monsterTransform() + " scale(1)" }], { duration: 600, easing: "cubic-bezier(.3,1.4,.5,1)" });
      const lift = $("#fLifter");
      if (lift) lift.animate([{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 500, easing: "ease-out" });
    }

    screen().querySelectorAll(".opt").forEach(btn => {
      btn.onclick = () => onAnswer(parseInt(btn.dataset.i, 10), btn);
    });
    if (q.builder) wireBuilder(builderWords, q.target);
    screen().querySelectorAll("[data-use]").forEach(btn => {
      btn.onclick = () => {
        const r = GAME.useItem(btn.dataset.use);
        if (r.ok) {
          const it = DATA.ITEMS[btn.dataset.use];
          toast(it.name + (r.kind === "heal" ? " used — +life!" : r.kind === "block" ? " ready — blocks the next hit." : " ready — big hit next!"), "good");
          renderBattle(false);
        } else toast(r.msg || "Cannot use that now.", "bad");
      };
    });
  }

  // Click chips -> append to built sentence. Undo pops last. Submit checks vs target.
  function wireBuilder(words, target) {
    const picked = [];
    const builtEl = $("#built");
    const undoBtn = $("#undo");
    const subBtn = $("#submitBuild");
    const chips = screen().querySelectorAll(".word-chip");
    function refresh() {
      builtEl.innerHTML = picked.length
        ? picked.map(i => `<span class="built-word">${esc(words[i])}</span>`).join(" ")
        : `<span class="placeholder">Tap the words in the correct order…</span>`;
      undoBtn.disabled = busy || picked.length === 0;
      subBtn.disabled = busy || picked.length !== words.length;
    }
    chips.forEach(chip => {
      chip.onclick = () => {
        if (busy || chip.classList.contains("used")) return;
        chip.classList.add("used");
        picked.push(parseInt(chip.dataset.i, 10));
        refresh();
      };
    });
    undoBtn.onclick = () => {
      if (busy || picked.length === 0) return;
      const last = picked.pop();
      const chip = screen().querySelector(`.word-chip[data-i="${last}"]`);
      if (chip) chip.classList.remove("used");
      refresh();
    };
    subBtn.onclick = () => {
      if (busy) return;
      const built = picked.map(i => words[i]).join(" ");
      const correct = built === target;
      onAnswer(0, subBtn, correct, { target, built });
    };
  }

  function fx(text, color) {
    const a = $(".arena"); if (!a) return;
    const e = document.createElement("div");
    e.className = "fx"; e.style.color = color || "#fff"; e.textContent = text;
    a.appendChild(e); setTimeout(() => e.remove(), 850);
  }

  function onAnswer(i, btn, forcedCorrect, builderInfo) {
    if (busy) return;
    busy = true;
    const isBuilder = (typeof forcedCorrect === "boolean");
    const res = GAME.answer(i, isBuilder ? forcedCorrect : undefined);
    if (!isBuilder) {
      const opts = screen().querySelectorAll(".opt");
      opts.forEach(o => o.disabled = true);
      opts[res.answerIndex].classList.add("correct");
      if (!res.correct) btn.classList.add("wrong");
    } else {
      // builder feedback: colour the built sentence, disable chips/undo/submit,
      // and on a wrong answer reveal what the correct sentence was.
      const built = $("#built"), bldr = screen().querySelector(".builder");
      if (bldr) bldr.querySelectorAll("button").forEach(b => b.disabled = true);
      if (built) built.classList.add(res.correct ? "ok" : "bad");
      if (!res.correct && bldr && builderInfo) {
        const note = document.createElement("div");
        note.className = "builder-correct";
        note.innerHTML = "Correct order: <b>" + esc(builderInfo.target) + "</b>";
        bldr.appendChild(note);
      }
    }

    const roomId = GAME.battle && GAME.battle.room.id;
    const isGym = roomId === "gym";
    const isStudy = roomId === "study";
    const mon = (isGym || isStudy) ? null : $("#fMon");
    const pl = isGym ? $("#fLifter") : isStudy ? $("#fScholar") : $("#fPlayer");
    const lifter = isGym ? $("#fLifter") : null;
    const scholar = isStudy ? $("#fScholar") : null;
    function gymFx(cls, holdMs) {
      if (!lifter) return;
      lifter.classList.remove("pulse", "wobble", "crash");
      void lifter.offsetWidth;
      lifter.classList.add(cls);
      if (holdMs) setTimeout(() => lifter.classList.remove(cls), holdMs);
    }
    function studyFx(cls, holdMs) {
      if (!scholar) return;
      scholar.classList.remove("pulse", "nod");
      void scholar.offsetWidth;
      scholar.classList.add(cls);
      if (holdMs) setTimeout(() => scholar.classList.remove(cls), holdMs);
    }

    const beam = () => {
      const a = $(".arena"); if (!a) return;
      const z = document.createElement("div"); z.className = "beam"; a.appendChild(z);
      setTimeout(() => z.remove(), 480);
    };
    const stone = () => {
      const a = $(".arena"); if (!a) return;
      const s = document.createElement("div"); s.className = "stone"; a.appendChild(s);
      setTimeout(() => s.remove(), 600);
    };

    if (res.correct) {
      if (isGym) {
        // Lifting another rep — barbell pulses bigger
        gymFx("pulse", 650);
        setTimeout(() => {
          fx("+1 REP! 💪", "#ffe98a");
          const bar = $(".mon-hp i"); if (bar) bar.style.width = ((GAME.battle.monsterMax - GAME.battle.monsterHp) / GAME.battle.monsterMax) * 100 + "%";
          const lab = $(".mon-hp-label"); if (lab) lab.textContent = "Reps " + (GAME.battle.monsterMax - GAME.battle.monsterHp) + "/" + GAME.battle.monsterMax;
        }, 200);
        if (res.won) {
          setTimeout(() => {
            const art = $("#fLifterArt"); if (art) art.innerHTML = ART.gymPose(10, "flex");
            fx("💪 MUSCLES UP! 💪", "#ffe98a");
          }, 520);
          setTimeout(() => onWin(), 1800);
          return;
        }
      } else if (isStudy) {
        // Read another book — stack grows, book pulses
        studyFx("pulse", 650);
        setTimeout(() => {
          fx("📖 +1 book read!", "#ffe98a");
          const bar = $(".mon-hp i"); if (bar) bar.style.width = ((GAME.battle.monsterMax - GAME.battle.monsterHp) / GAME.battle.monsterMax) * 100 + "%";
          const lab = $(".mon-hp-label"); if (lab) lab.textContent = "Books read " + (GAME.battle.monsterMax - GAME.battle.monsterHp) + "/" + GAME.battle.monsterMax;
        }, 200);
        if (res.won) {
          setTimeout(() => {
            const art = $("#fScholarArt"); if (art) art.innerHTML = ART.studyPose(10, "jump");
            fx("📖 STUDIED HARD! ✨", "#ffe98a");
          }, 520);
          setTimeout(() => onWin(), 1800);
          return;
        }
      } else {
        pl && pl.classList.add("lunge");
        if (res.weapon === "sling") stone(); else beam();
        setTimeout(() => {
          fx("-" + res.damage + (res.weapon === "sling" ? " 🪨" : " 🔦"), "#ffe98a");
          mon && mon.classList.add("hit");
          if (mon) mon.style.transform = monsterTransform();
          const bar = $(".mon-hp i"); if (bar) bar.style.width = (GAME.battle.monsterHp / GAME.battle.monsterMax) * 100 + "%";
          const lab = $(".mon-hp-label"); if (lab) lab.textContent = "HP " + GAME.battle.monsterHp + "/" + GAME.battle.monsterMax;
        }, 200);
        if (res.won) {
          setTimeout(() => { mon && mon.classList.add("fall"); }, 580);
          setTimeout(() => onWin(), 1520);
          return;
        }
      }
    } else if (res.hit || res.blocked) {
      if (isGym) {
        // Barbell crashes downward
        gymFx("crash");
        setTimeout(() => {
          if (res.blocked) {
            fx("🛡️ SHIELD!", "#6fe3d2");
          } else {
            $(".arena") && $(".arena").classList.add("shake");
            fx("💥 DROP! -1 ❤️", "#e2484d");
          }
        }, 260);
      } else if (isStudy) {
        // Player nods off harder — swap to the sleeping pose for the dwell
        const art = $("#fScholarArt");
        if (art) art.innerHTML = ART.studyPose(GAME.battle.monsterMax - GAME.battle.monsterHp, "sleep");
        setTimeout(() => {
          if (res.blocked) {
            fx("🛡️ SHIELD!", "#6fe3d2");
          } else {
            $(".arena") && $(".arena").classList.add("shake");
            fx("💤 Asleep! -1 ❤️", "#e2484d");
          }
        }, 260);
      } else {
        if (mon) {
          const t = monsterTransform();
          mon.animate(
            [{ transform: t }, { transform: t + " translateX(-26px)" }, { transform: t }],
            { duration: 420, easing: "ease-in-out" }
          );
        }
        setTimeout(() => {
          if (res.blocked) {
            fx("🛡️ SHIELD!", "#6fe3d2");
          } else {
            pl && pl.classList.add("shake");
            $(".arena") && $(".arena").classList.add("shake");
            fx("-1 ❤️", "#e2484d");
          }
        }, 220);
      }
      if (res.lost) {
        setTimeout(() => {
          if (isGym) {
            const art = $("#fLifterArt"); if (art) art.innerHTML = ART.gymPose(0, "fall");
          } else if (isStudy) {
            const art = $("#fScholarArt"); if (art) art.innerHTML = ART.studyPose(0, "fall");
          } else {
            pl && pl.classList.add("fall");
          }
        }, 700);
        setTimeout(() => onDefeat(), 1700);
        return;
      }
    } else {
      // monster walks one step left toward the player (or, in gym/study, the visual cue)
      setTimeout(() => {
        if (isGym) {
          gymFx("wobble", 900);
          const t = $("#fTries"); if (t) t.innerHTML = triesDotsHTML(res.wrongCount, res.wrongLimit);
          const left = Math.max(0, res.wrongLimit - res.wrongCount);
          fx(left ? `Wobble! (${left} ${left === 1 ? "try" : "tries"} left)` : "Out of tries!", left ? "#e8b23a" : "#e2484d");
        } else if (isStudy) {
          const art = $("#fScholarArt");
          if (art) art.innerHTML = ART.studyPose(GAME.battle.monsterMax - GAME.battle.monsterHp, "sleep");
          const t = $("#fTries"); if (t) t.innerHTML = triesDotsHTML(res.wrongCount, res.wrongLimit);
          const left = Math.max(0, res.wrongLimit - res.wrongCount);
          fx(left ? `Zzz… (${left} ${left === 1 ? "try" : "tries"} left)` : "Fell asleep!", left ? "#e8b23a" : "#e2484d");
        } else {
          if (mon) mon.style.transform = monsterTransform();
          fx(res.reachedPlayer ? "It's right next to you!" : "Closer…", res.reachedPlayer ? "#e2484d" : "#e8b23a");
        }
      }, 170);
      if (res.softLost) {
        setTimeout(() => {
          if (isGym) { const art = $("#fLifterArt"); if (art) art.innerHTML = ART.gymPose(0, "fall"); }
          else if (isStudy) { const art = $("#fScholarArt"); if (art) art.innerHTML = ART.studyPose(0, "fall"); }
        }, 700);
        setTimeout(() => onSoftLose(), 1700);
        return;
      }
    }
    setTimeout(() => { busy = false; renderBattle(false); }, isBuilder && !res.correct ? 2600 : 1300);
  }

  function onWin() {
    const b = GAME.battle;
    const room = b.room, p = GAME.progress();
    const isBoss = room.type === "boss";
    if (isBoss) return escapeCinematic();
    const gotKey = room.type === "key";
    const isLoot = room.type === "loot";
    const title = gotKey ? "Key Found!" : (LOOT_TITLE[room.id] || "Room Cleared!");
    const emoji = gotKey ? "🗝️" : (LOOT_EMOJI[room.id] || "✨");
    document.body.insertAdjacentHTML("beforeend", `
      <div class="overlay" id="ov"><div class="modal">
        <div class="big-emoji">${emoji}</div>
        <h2>${esc(title)}</h2>
        <p>${esc(ROOM_WIN[room.id] || "The monster falls!")}<br/><br/>
          ${gotKey ? `You earned the <b>${esc(room.name)} key</b> and ` : "You earned "}<b>+30 🪙 coins</b>.
          ${gotKey ? `<br/><b>${p.keys.length}/${DATA.MANSION.keyRoomIds.length}</b> keys collected.` : ""}
          ${isLoot ? `<br/><br/><span class="muted" style="font-size:13.5px">Come back any time — this room never runs out of coins.</span>` : ""}
          ${p.keys.length >= DATA.MANSION.keyRoomIds.length ? `<br/><br/>🔓 <b>The Basement is now unlocked!</b>` : ""}</p>
        <div class="row">
          ${isLoot ? `<button class="btn gold" id="ovAgain">Play again</button>` : ""}
          <button class="btn primary" id="ovBack">Back to Mansion</button>
        </div>
      </div></div>`);
    const roomId = room.id;
    $("#ovBack").onclick = () => { $("#ov").remove(); GAME.quitBattle(); renderMap(); };
    if (isLoot) $("#ovAgain").onclick = () => { $("#ov").remove(); GAME.quitBattle(); beginBattle(roomId); };
  }

  function onSoftLose() {
    const b = GAME.battle;
    const id = b && b.room ? b.room.id : "";
    const msg = id === "gym"
      ? "You couldn't lift that one. Catch your breath and try again."
      : id === "study"
        ? "You drifted off too many times. Wake up and have another go!"
        : "Too many wrong answers — give it another go.";
    document.body.insertAdjacentHTML("beforeend", `
      <div class="overlay" id="ov"><div class="modal">
        <div class="big-emoji">😅</div>
        <h2>Out of Tries</h2>
        <p>${esc(msg)}<br/><br/><b>No coins this time</b> — but no lives lost either.</p>
        <div class="row">
          <button class="btn primary" id="ovAgain">Try again</button>
          <button class="btn ghost" id="ovBack">Back to Mansion</button>
        </div>
      </div></div>`);
    const roomId = id;
    $("#ovBack").onclick = () => { $("#ov").remove(); GAME.onSoftDefeat(); renderMap(); };
    $("#ovAgain").onclick = () => { $("#ov").remove(); GAME.onSoftDefeat(); beginBattle(roomId); };
  }

  function onDefeat() {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="overlay" id="ov"><div class="modal">
        <div class="big-emoji">💀</div>
        <h2>Game Over</h2>
        <p>Your lives reached zero and the player falls. The Haunted Monster Mansion <b>resets</b> — all coins and keys for this mansion are lost. Be braver next time!</p>
        <div class="row"><button class="btn primary" id="ovBack">Restart Mansion</button></div>
      </div></div>`);
    $("#ovBack").onclick = () => { $("#ov").remove(); GAME.onDefeat(); renderMap(); };
  }

  function escapeCinematic() {
    const cin = document.createElement("div");
    cin.className = "cinematic";
    cin.innerHTML = `
      <div class="scene"><div class="runner">${ART.player("torch")}</div></div>
      <div class="cin-text">You unlock the great door…<br/>and run free from the Haunted Monster Mansion!</div>`;
    document.body.appendChild(cin);
    const runner = cin.querySelector(".runner");
    setTimeout(() => runner.classList.add("runner"), 30);
    setTimeout(() => {
      cin.querySelector(".cin-text").innerHTML = `🏆 <b>YOU ESCAPED!</b><br/>The Mansion King is defeated. You may still return to spend your coins here.`;
    }, 3600);
    setTimeout(() => {
      cin.remove(); GAME.quitBattle(); renderMap();
      toast("Mansion escaped! 🏆", "gold");
    }, 6200);
  }

  /* ===================== PARENT REPORT ===================== */
  function renderReport() {
    const r = REPORT.build();
    const cards = r.rows.map(row => {
      const has = row.attempts > 0;
      return `<div class="rep-card">
        <div class="t"><span>${esc(row.label)}</span>
          <span class="${has ? row.band.cls : "tag-mid"}">${has ? row.band.txt : "Not tried"}</span></div>
        <div class="acc" style="color:${has ? row.band.color : "#9a8fb3"}">${has ? row.pct + "%" : "—"}</div>
        <div class="sub">${has ? row.correct + " / " + row.attempts + " correct" : "No questions answered"}</div>
        <div class="bar"><i style="width:${row.pct}%;background:${has ? row.band.color : "#3a2a52"}"></i></div>
      </div>`;
    }).join("");
    const recent = r.recent.length
      ? `<h1 style="font-size:20px;margin:26px 0 10px">Recent mistakes</h1>
         <div class="rep-grid">${r.recent.map(m => `<div class="rep-card"><div class="t"><span>${esc(m.label)}</span><span class="sub">${esc(m.when)}</span></div><div class="sub" style="margin-top:8px;line-height:1.5">${esc(m.q)}</div></div>`).join("")}</div>`
      : "";
    screen().innerHTML = `
      <div class="topbar"><span class="back" id="bk">← Back</span><h2>📊 Parent Report — ${esc((STORE.active() || {}).name || "Player")}</h2></div>
      <div class="page">
        <div class="summary-box">${r.summary}</div>
        <h1 style="font-size:20px;margin-bottom:10px">Topic by topic</h1>
        <div class="rep-grid">${cards}</div>
        ${recent}
      </div>`;
    $("#bk").onclick = renderMenu;
  }

  /* ===================== confirm modal ===================== */
  function showConfirm(title, body, okLabel, onOk) {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="overlay" id="cf"><div class="modal">
        <h2>${esc(title)}</h2><p>${esc(body)}</p>
        <div class="row"><button class="btn ghost" id="cfNo">Cancel</button><button class="btn primary" id="cfYes">${esc(okLabel)}</button></div>
      </div></div>`);
    $("#cfNo").onclick = () => $("#cf").remove();
    $("#cfYes").onclick = () => { $("#cf").remove(); onOk(); };
  }

  /* ===================== PROFILE SELECT ===================== */
  function renderProfileSelect() {
    const profiles = STORE.profilesList();
    const cards = profiles.map(p => {
      const totalCoins = Object.values(p.mansions || {}).reduce((s, m) => s + (m.coins || 0), 0);
      const keysFound = Object.values(p.mansions || {}).reduce((s, m) => s + (m.keys ? m.keys.length : 0), 0);
      const isActive = STORE.state.activeProfileId === p.id;
      return `<div class="profile-card ${isActive ? "active" : ""}" data-pick="${p.id}">
        <div class="profile-avatar">${esc((p.name || "?").charAt(0).toUpperCase())}</div>
        <div class="profile-name">${esc(p.name)}</div>
        <div class="profile-meta">🪙 ${totalCoins} · 🗝️ ${keysFound}</div>
        <div class="profile-actions">
          <button class="btn ghost sm" data-rename="${p.id}">Rename</button>
          ${profiles.length > 1 ? `<button class="btn ghost sm" data-delete="${p.id}">Delete</button>` : ""}
        </div>
      </div>`;
    }).join("");
    const accountEmail = (STORE.state.account || {}).email || "";
    screen().innerHTML = `
      <div class="topbar">
        ${STORE.active() ? `<span class="back" id="bk">← Menu</span>` : `<span class="muted" style="padding:4px 8px;font-size:12px">${esc(accountEmail || "Local device")}</span>`}
        <h2>👥 Who's playing?</h2>
      </div>
      <div class="page" style="max-width:760px">
        <div class="lead">Pick a player or add a new one. Each player has their own coins, keys and Parent Report.</div>
        <div class="profile-grid">
          ${cards}
          <div class="profile-card add" id="addNew">
            <div class="profile-avatar plus">+</div>
            <div class="profile-name">Add new player</div>
            <div class="profile-meta">Create a fresh profile</div>
          </div>
        </div>
      </div>`;
    if ($("#bk")) $("#bk").onclick = renderMenu;

    screen().querySelectorAll("[data-pick]").forEach(card => {
      card.onclick = (ev) => {
        // ignore clicks from inner buttons (rename/delete handle themselves)
        if (ev.target.closest("button")) return;
        STORE.selectProfile(card.dataset.pick);
        renderMenu();
      };
    });
    screen().querySelectorAll("[data-rename]").forEach(b => {
      b.onclick = (ev) => {
        ev.stopPropagation();
        const id = b.dataset.rename;
        const cur = STORE.state.profiles[id];
        promptModal("Rename player", "Enter a new name:", cur ? cur.name : "", (newName) => {
          if (newName == null) return;
          STORE.renameProfile(id, newName);
          renderProfileSelect();
        });
      };
    });
    screen().querySelectorAll("[data-delete]").forEach(b => {
      b.onclick = (ev) => {
        ev.stopPropagation();
        const id = b.dataset.delete;
        const cur = STORE.state.profiles[id];
        showConfirm("Delete " + ((cur && cur.name) || "this player") + "?",
          "All of their coins, keys and Parent Report stats will be lost. The account itself stays.",
          "Delete", () => { STORE.deleteProfile(id); renderProfileSelect(); });
      };
    });
    $("#addNew").onclick = () => {
      promptModal("Add new player", "Player name (e.g. Preston):", "", (name) => {
        if (!name) return;
        STORE.createProfile(name);
        renderMenu();
      });
    };
  }

  // Simple prompt-style modal (since native prompt() is ugly).
  function promptModal(title, body, initial, onOk) {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="overlay" id="pm"><div class="modal">
        <h2>${esc(title)}</h2>
        <p class="muted" style="font-size:14px">${esc(body)}</p>
        <div class="field" style="margin-top:14px;text-align:left">
          <input id="pmInput" type="text" value="${esc(initial || "")}" maxlength="24" placeholder="Type here…"/>
        </div>
        <div class="row"><button class="btn ghost" id="pmNo">Cancel</button><button class="btn primary" id="pmYes">OK</button></div>
      </div></div>`);
    const inp = $("#pmInput"); inp.focus(); inp.select();
    function done(val) { $("#pm").remove(); onOk(val); }
    $("#pmNo").onclick = () => done(null);
    $("#pmYes").onclick = () => done(inp.value.trim());
    inp.onkeydown = (e) => { if (e.key === "Enter") done(inp.value.trim()); if (e.key === "Escape") done(null); };
  }

  /* ===================== ROUTER ===================== */
  function route() {
    const needLogin = AUTH.configured ? !AUTH.user : !AUTH.session;
    if (needLogin) { renderAuth(); return; }
    // No profiles yet -> force creation. Multiple profiles -> show picker. Otherwise menu.
    const profiles = STORE.profilesList();
    if (profiles.length === 0) {
      // first-time: just open the picker (with the +Add card)
      renderProfileSelect();
      return;
    }
    if (!STORE.active()) STORE.selectProfile(profiles[0].id);
    renderMenu();
  }

  window.UI = { route, renderMenu, toast };
})();
