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
    basement: "THE MANSION KING roars one last time… and falls.",
    mall_sports: "Ten perfect kicks straight at the target. Your football game is unstoppable!",
    mall_game_shop: "Ten perfect hits on the target — your aim is legendary!"
  };
  const LOOT_TITLE = {
    gym: "💪 Workout Complete!",
    study: "📖 Lesson Mastered!",
    mall_sports: "⚽ Goal Master!",
    mall_game_shop: "🎯 Sharp Shooter!"
  };
  const LOOT_EMOJI = { gym: "💪", study: "📖", mall_sports: "⚽", mall_game_shop: "🎯" };

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
          <button class="btn primary full" id="play">🕯️ Choose Your Adventure</button>
          <button class="btn full" id="report">📊 Parent Report</button>
          <button class="btn full" id="switch">👥 Switch Player</button>
          <button class="btn ghost full" id="how">❓ How to Play</button>
          <button class="btn ghost sm" id="snd" style="align-self:center">${SOUND.isMuted() ? "🔇 Sound: OFF" : "🔊 Sound: ON"}</button>
          ${AUTH.user ? `<button class="btn ghost sm" id="out" style="align-self:center">Sign out (${esc(accountEmail)})</button>` : ""}
        </div>
      </div></div>`;
    $("#play").onclick = renderMansionSelect;
    $("#report").onclick = renderReport;
    $("#switch").onclick = renderProfileSelect;
    $("#how").onclick = renderHow;
    $("#snd").onclick = () => { SOUND.toggleMute(); if (!SOUND.isMuted()) SOUND.play("click"); renderMenu(); };
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
      <div class="grp"><span class="lbl">Keys</span><span class="key">🗝️</span> ${p.keys.length}/${GAME.mansion.keyRoomIds.length}</div>
      <div class="hud-spacer"></div>
      ${opts.exit ? `<button class="btn ghost sm" id="hudExit">${opts.exitLabel || "Leave"}</button>` : ""}
    </div>`;
  }

  /* ===================== MANSION INTRO (one-time story) ===================== */
  const HAUNTED_INTRO = [
    { text: "You are walking home when the sky suddenly turns dark…", sound: "step" },
    { text: "A strong wind blows through the trees.", sound: "wrong" },
    { text: "Then, you see an old mansion standing at the end of the road.", sound: "step" },
    { text: "The windows are broken.<br/>The front gate is rusty.<br/>The lights inside flicker on and off.", sound: null },
    { text: "You hear a strange sound from inside…<br/><br/><em>“Help me…”</em>", sound: "snore" },
    { text: "You step closer.<br/>Suddenly, the gate shuts behind you with a loud <b>BANG!</b>", sound: "strike", shake: true },
    { text: "You are <b>trapped</b>.", sound: null },
    { text: "A ghostly voice whispers:<br/><br/><em>“To escape this mansion, you must defeat the English Monsters.”</em>", sound: "wrong" },
    { text: "The front door slowly opens by itself…", sound: "step" },
    { text: "Inside, every room is guarded by a monster.<br/>Each monster will test your English.", sound: null },
    { text: "Answer correctly to unlock doors, earn coins, and find the missing <b>English Keys</b>.", sound: "key" },
    { title: "Your Mission", text: "Explore the Haunted Monster Mansion.<br/>Defeat the monsters in every room.<br/><br/><b>Collect all the keys to escape!</b>", sound: "win" }
  ];

  const ZOMBIE_INTRO = [
    { text: "You leave the old haunted mansion and see a giant shopping mall in the distance.", sound: "step" },
    { text: "The mall lights are flickering.<br/>The main glass door is half open.", sound: null },
    { text: "A broken sign above the entrance says:<br/><br/><em>“Welcome to Grand Star Mall”</em>", sound: null },
    { text: "But something feels wrong.<br/>No shoppers. No music. No security.<br/>Only slow footsteps echoing inside.", sound: "step" },
    { text: "Suddenly, the mall speaker turns on by itself.<br/><br/><em>“Attention shoppers… the mall is now closed… forever.”</em>", sound: "wrong" },
    { text: "A cold wind blows from inside.<br/>You hear a low groaning sound:<br/><br/><em>“Urrrrghhh…”</em>", sound: "snore" },
    { text: "You see shadows moving behind the glass doors.<br/>They are <b>not monsters</b>.<br/>They are <b>zombies</b>.", sound: "wrong" },
    { text: "You pick up a <b>Baseball Bat</b> for protection.", sound: "key" },
    { text: "A message slowly appears on the glass door:<br/><br/><em>“Only a grammar hero may enter.”</em>", sound: null },
    { title: "Your Mission", text: "Find the missing <b>Grammar Keys</b> hidden across the mall.<br/>Defeat the zombies blocking the shops, escalators, lifts and exits.<br/><br/><b>Every correct answer brings you closer to escape!</b>", sound: "win" }
  ];

  const BOSS_INTRO_MALL = [
    { text: "You have collected all the Grammar Keys.<br/>The final exit door at the end of the mall begins to glow.", sound: "key" },
    { text: "One by one, the keys fly out of your bag and enter the lock.<br/><br/><em>Click. Click. Click. Click. Click.</em>", sound: "key" },
    { text: "The giant exit door slowly opens.<br/>Cold air rushes in.<br/>You can see the outside world.<br/><br/><b>You are almost free.</b>", sound: "step" },
    { text: "Suddenly, the mall lights turn red.<br/>The exit door slams shut.<br/><br/><b>BANG!</b>", sound: "strike", shake: true },
    { text: "The whole mall starts shaking.<br/>The speaker turns on by itself:<br/><br/><em>“Warning… final customer detected.”</em>", sound: "wrong" },
    { text: "Heavy footsteps from the middle of the mall…<br/><br/><b>BOOM. BOOM. BOOM.</b>", sound: "strike", shake: true },
    { text: "The floor cracks. A huge zombie creature walks into the Dead Mall Hall.<br/>Bigger than all the others. Massive arms. Glowing green eyes.", sound: "monsterFall" },
    { text: "It smashes the floor and roars:<br/><br/><em>“NO ONE LEAVES MY MALL!”</em>", sound: "strike", shake: true },
    { title: "The Zombie Hulk King", text: "<b>Final boss appeared.</b><br/>Answer the English questions correctly to weaken him.<br/><br/><b>Defeat The Zombie Hulk King and escape!</b>", sound: "wrong" }
  ];

  const ENDING_MALL = [
    { text: "The Zombie Hulk King roars one last time… and falls.<br/>The floor stops shaking.", sound: "monsterFall" },
    { text: "The mall lights flicker back to normal.<br/>The exit door slowly opens — for real this time.", sound: "key" },
    { text: "You step into the cool night air.<br/><b>You are free.</b>", sound: "step" },
    { title: "🏆 You Escaped!", text: "You have defeated the Zombie Shopping Mall.<br/>The coins you earned here will stay safe.<br/><br/><b>Well done, grammar hero!</b>", sound: "escape" }
  ];

  function shouldShowIntro(mansionId) {
    const p = STORE.active(); if (!p) return false;
    const flags = p.intros || {};
    if (flags[mansionId]) return false;
    const m = (p.mansions || {})[mansionId];
    if (m && ((m.keys && m.keys.length) || (m.cleared && m.cleared.length))) return false;
    return true;
  }
  function markIntroSeen(mansionId) {
    const p = STORE.active(); if (!p) return;
    p.intros = p.intros || {};
    p.intros[mansionId] = true;
    // Back-compat for the legacy single flag.
    if (mansionId === "haunted_monster_mansion") p.introSeen = true;
    STORE.save();
  }

  function getIntroSlides(mansionId) {
    return mansionId === "zombie_mall" ? ZOMBIE_INTRO : HAUNTED_INTRO;
  }

  function renderIntro(onComplete, mansionId) {
    const slides = getIntroSlides(mansionId || GAME.mansionId);
    return renderStoryCinematic(slides, () => {
      markIntroSeen(mansionId || GAME.mansionId);
      onComplete();
    });
  }

  function renderStoryCinematic(slides, onComplete) {
    let idx = 0;
    document.body.insertAdjacentHTML("beforeend", `
      <div class="cinematic-overlay" id="introOv">
        <div class="cinematic-bg">${ART.mansion()}</div>
        <div class="cinematic-vignette"></div>
        <div class="cinematic-content" id="cinContent">
          <div class="cinematic-text" id="cinText"></div>
          <div class="cinematic-controls">
            <button class="btn ghost sm" id="skipIntro">Skip the story ▸</button>
            <button class="btn primary" id="nextIntro">Next →</button>
          </div>
          <div class="cinematic-progress" id="cinProgress"></div>
        </div>
      </div>`);

    function paint() {
      const slide = slides[idx];
      const txt = document.getElementById("cinText");
      txt.innerHTML = (slide.title ? `<h3>${esc(slide.title)}</h3>` : "") + slide.text;
      // restart the fade-in animation
      txt.style.animation = "none"; void txt.offsetWidth; txt.style.animation = "";
      if (slide.sound && window.SOUND) SOUND.play(slide.sound);
      if (slide.shake) {
        const c = document.getElementById("cinContent");
        c.classList.add("shake");
        setTimeout(() => c.classList.remove("shake"), 500);
      }
      document.getElementById("cinProgress").innerHTML =
        slides.map((_, i) => `<span class="cin-dot${i === idx ? " active" : ""}${i < idx ? " done" : ""}"></span>`).join("");
      document.getElementById("nextIntro").textContent =
        idx === slides.length - 1 ? "🕯️ Continue" : "Next →";
    }
    function finish() {
      const ov = document.getElementById("introOv"); if (ov) ov.remove();
      onComplete();
    }

    paint();
    document.getElementById("nextIntro").onclick = () => {
      idx += 1;
      if (idx >= slides.length) finish();
      else paint();
    };
    document.getElementById("skipIntro").onclick = finish;
  }

  /* ===================== MANSION SELECT ===================== */
  function renderMansionSelect() {
    const profile = STORE.active() || {};
    const cards = DATA.MANSIONS.map(m => {
      const prog = (profile.mansions || {})[m.id] || {};
      const keys = (prog.keys || []).length;
      const coins = prog.coins || 0;
      const escaped = !!prog.escaped;
      const locked = !DATA.isMansionUnlocked(m, profile);
      const summary = locked
        ? `🔒 Locked — escape <b>${esc((DATA.mansion(m.unlockedBy) || {}).name || "the previous mansion")}</b> first.`
        : escaped
          ? "★ You have escaped! Come back any time to spend coins."
          : `Keys found: <b>${keys}/${m.keyRoomIds.length}</b> · Coins: <b>🪙 ${coins}</b>`;
      return `<div class="card mansion-choice${locked ? " locked" : ""}" data-mid="${m.id}" style="max-width:560px;text-align:center">
        <div class="mansion-pick" style="cursor:${locked ? "not-allowed" : "pointer"};border:1px solid var(--border);border-radius:16px;overflow:hidden;background:#0b0a1c">
          <div style="line-height:0">${m.id === "zombie_mall" ? ART.mallExterior() : ART.mansion()}</div>
        </div>
        <div class="title" style="font-size:26px;margin-top:14px">${esc(m.name)}</div>
        <div class="subtitle" style="margin:8px 0 4px">${esc(m.tagline)}<br/>${summary}</div>
        ${locked
          ? `<button class="btn ghost full" disabled style="margin-top:12px">🔒 Locked</button>`
          : `<button class="btn primary full" data-enter="${m.id}" style="margin-top:12px">🕯️ Enter this Adventure</button>`}
      </div>`;
    }).join("");
    screen().innerHTML = `
      <div class="topbar"><span class="back" id="bk">← Menu</span><h2>Choose a Horror Adventure</h2></div>
      <div class="page" style="display:flex;flex-direction:column;gap:18px;align-items:center;max-width:580px;margin:0 auto">
        ${cards}
      </div>`;
    $("#bk").onclick = renderMenu;
    screen().querySelectorAll("[data-enter]").forEach(b => {
      b.onclick = () => {
        const mid = b.dataset.enter;
        GAME.setMansion(mid);
        if (shouldShowIntro(mid)) renderIntro(renderMap, mid);
        else renderMap();
      };
    });
    screen().querySelectorAll(".mansion-choice.locked").forEach(c => {
      c.onclick = () => toast("Locked! Escape the previous mansion to unlock.", "bad");
    });
  }

  /* ===================== MANSION MAP ===================== */
  function renderMap() {
    const cards = GAME.mansion.rooms.map(r => {
      const st = GAME.roomStatus(r);
      const locked = st === "locked";
      let badge = "";
      if (st === "cleared") badge = `<span class="badge cleared">✔ Cleared</span>`;
      else if (st === "escaped") badge = `<span class="badge cleared">★ Escaped</span>`;
      else if (st === "locked") badge = `<span class="badge locked">🔒 Need ${GAME.mansion.keyRoomIds.length} keys</span>`;
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
        if (st === "locked") { toast("The Basement is locked. Find all " + GAME.mansion.keyRoomIds.length + " keys first!", "bad"); return; }
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
    const mid = GAME.mansionId;
    const mlmax = GAME.mansion.maxLifeItem;     // "burger" or "pizza"
    const itemIds = Object.keys(DATA.ITEMS).filter(id => {
      // Each mansion has its own themed weapon + max-life item.
      if (id === "sling" || id === "burger") return mid === "haunted_monster_mansion";
      if (id === "gun"   || id === "pizza")  return mid === "zombie_mall";
      return true;
    });
    const items = itemIds.map(id => {
      const it = DATA.ITEMS[id];
      const owned = (id === mlmax) ? (p.burgerBonus > 0) : (p.items[id] || 0);
      const cannot = (id === mlmax && p.burgerBonus > 0);
      const afford = p.coins >= it.cost && !cannot;
      return `<div class="shop-item">
        <div class="ic">${it.icon}</div>
        <div class="nm">${esc(it.name)}</div>
        <div class="ds">${esc(it.desc)}</div>
        <div class="price">🪙 ${it.cost}</div>
        <div class="owned">${id === mlmax ? (p.burgerBonus > 0 ? "✔ Bought (+1 life/room)" : "&nbsp;") : "Owned: " + (p.items[id] || 0)}</div>
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
    // Boss fights in the Zombie Mall get a cinematic intro before the fight (first time only).
    const room = DATA.room(GAME.mansionId, roomId) || DATA.room(roomId);
    if (room && room.type === "boss" && GAME.mansionId === "zombie_mall") {
      const p = STORE.active() || {};
      const flags = p.intros || {};
      if (!flags.zombie_mall_boss) {
        renderStoryCinematic(BOSS_INTRO_MALL, () => {
          p.intros = p.intros || {}; p.intros.zombie_mall_boss = true; STORE.save();
          GAME.startBattle(roomId); busy = false; renderBattle(true);
        });
        return;
      }
    }
    GAME.startBattle(roomId);
    busy = false;
    renderBattle(true);
  }

  // Registry for the four loot-room mini-games (no monster — player is the focus).
  // Each entry tells renderBattle how to render the fighter card and how onAnswer
  // should animate / play sounds / swap poses for correct, wrong and won states.
  const MINI_GAMES = {
    gym: {
      className: "lifter", fighterId: "fLifter",
      artClass: "lifter-art", artId: "fLifterArt",
      pose: (n, s, g) => ART.gymPose(n, s, g),
      idle: "lift", winPose: "flex", failPose: "fall",
      label: "Reps",
      correctClass: "pulse", wrongClass: "wobble", crashClass: "crash",
      sndCorrect: "rep", sndWrong: "step", sndLose: "drop",
      fxCorrect: { text: "+1 REP! 💪", color: "#ffe98a" },
      fxWin:     { text: "💪 MUSCLES UP! 💪", color: "#ffe98a" },
      fxWrong:   (left) => ({ text: left ? `Wobble! (${left} ${left === 1 ? "try" : "tries"} left)` : "Out of tries!", color: left ? "#e8b23a" : "#e2484d" })
    },
    study: {
      className: "scholar", fighterId: "fScholar",
      artClass: "scholar-art", artId: "fScholarArt",
      pose: (n, s, g) => ART.studyPose(n, s, g),
      idle: "read", winPose: "jump", failPose: "fall",
      label: "Books read",
      correctClass: "pulse", wrongClass: null, crashClass: null,    // study uses a sleep-pose swap instead of a class
      wrongPose: "sleep",                                            // ← swap pose on wrong
      sndCorrect: "book", sndWrong: "snore", sndLose: "snore",
      fxCorrect: { text: "📖 +1 book read!", color: "#ffe98a" },
      fxWin:     { text: "📖 STUDIED HARD! ✨", color: "#ffe98a" },
      fxWrong:   (left) => ({ text: left ? `Zzz… (${left} ${left === 1 ? "try" : "tries"} left)` : "Fell asleep!", color: left ? "#e8b23a" : "#e2484d" })
    },
    mall_sports: {
      className: "kicker", fighterId: "fKicker",
      artClass: "kicker-art", artId: "fKickerArt",
      pose: (n, s, g) => ART.footballPose(n, s, g),
      idle: "kick", winPose: "flex", failPose: "fall",
      wrongPose: "miss",
      shootPose: "shoot",        // ← pose during the kick swing (no ball at foot)
      flyVisual: "soccer",       // ← ball flies from foot to target on correct
      // Foot + target positions inside the footballPose viewBox (used by soccerFly).
      flyStart: { xPct: 180/460, yPct: 256/320 },
      flyEnd:   { xPct: 380/460, yPct: 150/320 },
      label: "Goals",
      correctClass: "pulse", wrongClass: null, crashClass: null,
      sndCorrect: "stone", sndWrong: "wrong", sndLose: "drop",
      fxCorrect: { text: "⚽ GOAL!", color: "#ffe98a" },
      fxWin:     { text: "⚽ STRONG LEGS! 💪", color: "#ffe98a" },
      fxWrong:   (left) => ({ text: left ? `Missed! (${left} ${left === 1 ? "try" : "tries"} left)` : "Ball deflated!", color: left ? "#e8b23a" : "#e2484d" })
    },
    mall_game_shop: {
      className: "shooter", fighterId: "fShooter",
      artClass: "shooter-art", artId: "fShooterArt",
      pose: (n, s, g) => ART.shooterPose(n, s, g),
      idle: "aim", winPose: "jump", failPose: "fall",
      wrongPose: "miss",
      label: "Hits",
      // Bullet trace: gun barrel (svg coords) → either target centre (hit) or overshoot above (miss).
      bulletStart:  { xPct: 196/460, yPct: 179/320 },
      bulletHit:    { xPct: 380/460, yPct: 130/320 },
      bulletMiss:   { xPct: 432/460, yPct:  60/320 },
      correctClass: "pulse", wrongClass: null, crashClass: null,
      sndCorrect: "stone", sndWrong: "wrong", sndLose: "drop",
      fxCorrect: { text: "🎯 BULLSEYE!", color: "#ffe98a" },
      fxWin:     { text: "🎯 PRO SHOOTER! 🏆", color: "#ffe98a" },
      fxWrong:   (left) => ({ text: left ? `Missed! (${left} ${left === 1 ? "try" : "tries"} left)` : "Gun broke!", color: left ? "#e8b23a" : "#e2484d" })
    }
  };

  function triesDotsHTML(wrong, limit) {
    if (!isFinite(limit)) return "";
    let out = `<span class="tries-lbl">Tries</span>`;
    for (let i = 0; i < limit; i++) {
      out += `<span class="try-dot${i < wrong ? " used" : ""}">${i < wrong ? "✗" : ""}</span>`;
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
        const fullLives = it.kind === "heal" && b.lives >= b.maxLives;
        return `<button class="inv-item" data-use="${id}"${fullLives ? ` disabled title="Lives are already full!"` : ""}><span class="ic">${it.icon}</span>${esc(it.name)} <span class="ct">×${p.items[id]}</span></button>`;
      }).join("")}${b.armedBlock ? `<span class="inv-item" style="opacity:.9">🛡️ Block ready</span>` : ""}${b.armedSling ? `<span class="inv-item" style="opacity:.9">🪃 Sling ready</span>` : ""}</div>`
      : `<div class="inv-bar"><span class="lbl">Items</span><span class="muted" style="font-size:13px;align-self:center">No items — buy some in the Store Room.</span>${b.armedBlock ? `<span class="inv-item">🛡️ Block ready</span>` : ""}</div>`;

    // Mini-game loot rooms (no monster — the player is the focus).
    // Map: room id -> { className, artId, pose(progress), label }.
    const mini = MINI_GAMES[b.room.id];
    const isMini = !!mini;
    const progress = b.monsterMax - b.monsterHp;
    const gender = (STORE.active() || {}).gender;
    const playerName = (STORE.active() || {}).name || "You";

    screen().innerHTML = `
      ${hudHTML({ lives: true, exit: true, exitLabel: "Flee →" })}
      <div class="battle">
        <div class="arena${isMini ? " gym" : ""}">
          <div class="bg">${ART.room(b.room.id)}</div>
          <div class="vignette"></div>
          ${isMini ? `<div class="tries-banner" id="fTries">${triesDotsHTML(b.wrongCount, b.wrongLimit)}</div>` : ""}
          ${isMini ? `
            <div class="fighters gym-fighters">
              <div class="fighter ${mini.className}" id="${mini.fighterId}">
                <div class="mon-hp-label">${esc(mini.label)} ${progress}/${b.monsterMax}</div>
                <div class="mon-hp"><i style="width:${(progress / b.monsterMax) * 100}%"></i></div>
                <span class="nm">${esc(playerName)}</span>
                <div class="${mini.artClass}" id="${mini.artId}">${mini.pose(progress, mini.idle, gender)}</div>
              </div>
            </div>` : `
            <div class="fighters">
              <div class="fighter player" id="fPlayer"><span class="nm">${esc((STORE.active() || {}).name || "You")}</span>${ART.player(b.armedSling ? (GAME.mansion.heavyWeaponItem || "sling") : GAME.mansion.weapon, (STORE.active() || {}).gender)}</div>
              <div class="fighter monster${b.room.type === "boss" ? " boss" : ""}" id="fMon" style="transform:${monsterTransform()}">
                <div class="mon-hp-label">HP ${b.monsterHp}/${b.monsterMax}${b.totalWaves > 1 ? `  ·  Zombie ${b.wave}/${b.totalWaves}` : ""}</div>
                <div class="mon-hp"><i style="width:${(b.monsterHp / b.monsterMax) * 100}%"></i></div>
                <span class="nm">${esc(b.monsterName)}${b.totalWaves > 1 ? ` <span class="wave-tag">#${b.wave}</span>` : ""}</span>
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

  // Tap a bank chip → it moves into the built sentence (in order). Tap a placed
  // tile → it returns to the bank. Undo pops the last placement. Submit checks
  // against the target sentence.
  function wireBuilder(words, target) {
    const picked = [];                       // array of indices into `words[]`
    const builtEl = $("#built");
    const undoBtn = $("#undo");
    const subBtn  = $("#submitBuild");

    function refresh() {
      // Render the built area — each tile is its own button so kids can tap to
      // remove an individual word (not just the most recent one).
      if (picked.length === 0) {
        builtEl.innerHTML = `<span class="placeholder">Tap the words in the correct order. Tap a placed word to send it back.</span>`;
      } else {
        builtEl.innerHTML = picked.map((wi, pos) =>
          `<button type="button" class="built-word" data-pos="${pos}">${esc(words[wi])}</button>`
        ).join(" ");
      }
      // Sync the bank — chips for already-placed words are dimmed/disabled.
      screen().querySelectorAll(".word-chip").forEach(chip => {
        const i = parseInt(chip.dataset.i, 10);
        chip.classList.toggle("used", picked.indexOf(i) > -1);
      });
      undoBtn.disabled = busy || picked.length === 0;
      subBtn.disabled  = busy || picked.length !== words.length;
      // Bind tap-to-remove on every placed tile.
      builtEl.querySelectorAll(".built-word").forEach(btn => {
        btn.onclick = () => {
          if (busy) return;
          const pos = parseInt(btn.dataset.pos, 10);
          if (isNaN(pos)) return;
          picked.splice(pos, 1);
          refresh();
        };
      });
    }

    // Tap a bank chip → place the word.
    screen().querySelectorAll(".word-chip").forEach(chip => {
      chip.onclick = () => {
        if (busy) return;
        const i = parseInt(chip.dataset.i, 10);
        if (picked.indexOf(i) > -1) return;   // already in the built area
        picked.push(i);
        refresh();
      };
    });

    undoBtn.onclick = () => {
      if (busy || picked.length === 0) return;
      picked.pop();
      refresh();
    };
    subBtn.onclick = () => {
      if (busy) return;
      const built = picked.map(i => words[i]).join(" ");
      const correct = built === target;
      onAnswer(0, subBtn, correct, { target, built });
    };

    refresh();
  }

  function answerFlash(correct) {
    const a = $(".arena"); if (!a) return;
    const f = document.createElement("div");
    f.className = "answer-flash " + (correct ? "ok" : "bad");
    f.innerHTML = correct ? "✓ CORRECT!" : "❌ WRONG!";
    a.appendChild(f);
    setTimeout(() => f.remove(), 1400);
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
      // Disable buttons so the player can't double-click, but do NOT reveal which
      // option was correct — they should learn from the consequence, not the colour.
      const opts = screen().querySelectorAll(".opt");
      opts.forEach(o => o.disabled = true);
    } else {
      // Same for the builder — lock the controls but don't show the answer.
      const bldr = screen().querySelector(".builder");
      if (bldr) bldr.querySelectorAll("button").forEach(b => b.disabled = true);
    }
    // Big centered banner so the result is unmistakable before the next question.
    answerFlash(res.correct);

    const roomId = GAME.battle && GAME.battle.room.id;
    const miniCfg = MINI_GAMES[roomId] || null;
    const isMini  = !!miniCfg;
    const mon = isMini ? null : $("#fMon");
    const pl  = isMini ? $("#" + miniCfg.fighterId) : $("#fPlayer");
    const miniEl  = isMini ? $("#" + miniCfg.fighterId) : null;
    const miniArt = isMini ? $("#" + miniCfg.artId)     : null;
    const gender  = (STORE.active() || {}).gender;
    function miniFx(cls, holdMs) {
      if (!miniEl || !cls) return;
      miniEl.classList.remove("pulse", "wobble", "crash", "nod");
      void miniEl.offsetWidth;
      miniEl.classList.add(cls);
      if (holdMs) setTimeout(() => miniEl.classList.remove(cls), holdMs);
    }
    function miniSwapPose(state) {
      if (!miniArt || !miniCfg) return;
      const p = GAME.battle.monsterMax - GAME.battle.monsterHp;
      miniArt.innerHTML = miniCfg.pose(p, state, gender);
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
    const bullet = () => {
      const a = $(".arena"); if (!a) return;
      const b = document.createElement("div"); b.className = "bullet"; a.appendChild(b);
      setTimeout(() => b.remove(), 380);
    };
    // Soccer ball that arcs from the player's foot to the target on a goal.
    const soccerFly = (cfg) => {
      const a = $(".arena"); if (!a) return;
      const k = miniEl; if (!k || !cfg || !cfg.flyStart || !cfg.flyEnd) return;
      const aRect = a.getBoundingClientRect();
      const kRect = k.getBoundingClientRect();
      const sx = kRect.left - aRect.left + kRect.width  * cfg.flyStart.xPct;
      const sy = kRect.top  - aRect.top  + kRect.height * cfg.flyStart.yPct;
      const ex = kRect.left - aRect.left + kRect.width  * cfg.flyEnd.xPct;
      const ey = kRect.top  - aRect.top  + kRect.height * cfg.flyEnd.yPct;
      const ball = document.createElement("div");
      ball.className = "soccer-fly";
      ball.textContent = "⚽";
      ball.style.left = sx + "px";
      ball.style.top  = sy + "px";
      ball.style.setProperty("--dx", (ex - sx) + "px");
      ball.style.setProperty("--dy", (ey - sy) + "px");
      ball.style.setProperty("--peak", ((ey + sy) / 2 - Math.abs(ex - sx) * 0.18 - sy) + "px");
      a.appendChild(ball);
      // After the ball lands, show an impact burst at the target.
      const onLand = () => {
        const ib = document.createElement("div");
        ib.className = "impact-burst";
        ib.style.left = ex + "px"; ib.style.top = ey + "px";
        ib.innerHTML = `<div class="ib-star">⚽</div>
          <span class="ib-ray r1"></span><span class="ib-ray r2"></span>
          <span class="ib-ray r3"></span><span class="ib-ray r4"></span>
          <span class="ib-ray r5"></span><span class="ib-ray r6"></span>`;
        a.appendChild(ib);
        setTimeout(() => ib.remove(), 700);
      };
      setTimeout(onLand, 480);
      setTimeout(() => ball.remove(), 520);
    };
    // Bullet trace from the gun toward either the target (hit) or past it (miss).
    const bulletShot = (cfg, hit) => {
      const a = $(".arena"); if (!a) return;
      const k = miniEl; if (!k || !cfg || !cfg.bulletStart) return;
      const dest = hit ? cfg.bulletHit : cfg.bulletMiss;
      if (!dest) return;
      const aRect = a.getBoundingClientRect();
      const kRect = k.getBoundingClientRect();
      const sx = kRect.left - aRect.left + kRect.width  * cfg.bulletStart.xPct;
      const sy = kRect.top  - aRect.top  + kRect.height * cfg.bulletStart.yPct;
      const ex = kRect.left - aRect.left + kRect.width  * dest.xPct;
      const ey = kRect.top  - aRect.top  + kRect.height * dest.yPct;
      const ang = Math.atan2(ey - sy, ex - sx) * 180 / Math.PI;
      const trace = document.createElement("div");
      trace.className = "bullet-trace";
      trace.style.left = sx + "px";
      trace.style.top  = sy + "px";
      trace.style.setProperty("--dx", (ex - sx) + "px");
      trace.style.setProperty("--dy", (ey - sy) + "px");
      trace.style.setProperty("--ang", ang + "deg");
      a.appendChild(trace);
      setTimeout(() => trace.remove(), 320);
      // On a miss, drop a small smoky-puff next to the bullet's overshoot point so
      // the kid can clearly see the bullet missed the target.
      if (!hit) {
        setTimeout(() => {
          const puff = document.createElement("div");
          puff.className = "bullet-miss-mark";
          puff.style.left = ex + "px"; puff.style.top = ey + "px";
          puff.innerHTML = `<span class="ib-star">·</span><span class="ib-label">MISS!</span>`;
          a.appendChild(puff);
          setTimeout(() => puff.remove(), 700);
        }, 240);
      }
    };
    // Burst that pops on top of the PLAYER when the enemy strikes them.
    // Red claw-slash effect for a direct hit; shield burst when blocked.
    const enemyHitBurst = (blocked) => {
      const a = $(".arena"); if (!a) return;
      const pEl = document.getElementById("fPlayer"); if (!pEl) return;
      const aRect = a.getBoundingClientRect();
      const pRect = pEl.getBoundingClientRect();
      const cx = pRect.left - aRect.left + pRect.width * 0.5;
      const cy = pRect.top  - aRect.top  + pRect.height * 0.42;
      const el = document.createElement("div");
      el.className = "enemy-hit-burst" + (blocked ? " blocked" : "");
      el.style.left = cx + "px";
      el.style.top  = cy + "px";
      el.innerHTML = blocked
        ? `<div class="ehb-star">🛡️</div>`
        : `<div class="ehb-star">💢</div>
           <span class="ehb-claw c1"></span>
           <span class="ehb-claw c2"></span>
           <span class="ehb-claw c3"></span>`;
      a.appendChild(el);
      setTimeout(() => el.remove(), 700);
    };
    // Burst that pops on top of the monster when an attack connects.
    const impactBurst = (label) => {
      const a = $(".arena"); if (!a) return;
      const m = document.getElementById("fMon"); if (!m) return;
      const aRect = a.getBoundingClientRect();
      const mRect = m.getBoundingClientRect();
      const cx = mRect.left - aRect.left + mRect.width * 0.5;
      const cy = mRect.top - aRect.top + mRect.height * 0.45;
      const el = document.createElement("div");
      el.className = "impact-burst";
      el.style.left = cx + "px";
      el.style.top  = cy + "px";
      el.innerHTML = `
        <div class="ib-star">${label || "💥"}</div>
        <span class="ib-ray r1"></span><span class="ib-ray r2"></span>
        <span class="ib-ray r3"></span><span class="ib-ray r4"></span>
        <span class="ib-ray r5"></span><span class="ib-ray r6"></span>`;
      a.appendChild(el);
      setTimeout(() => el.remove(), 700);
    };

    if (res.correct) {
      SOUND.play(isMini ? miniCfg.sndCorrect : "correct");
      if (isMini) {
        miniFx(miniCfg.correctClass, 650);
        // Football: swap to the kick-swing pose, fly the ball, then restore idle with +1 goal.
        if (miniCfg.shootPose) {
          miniSwapPose(miniCfg.shootPose);
          if (miniCfg.flyVisual === "soccer") soccerFly(miniCfg);
          // Hold the swing for ~520ms, then snap back to idle (with the new goal mark on the target).
          setTimeout(() => miniSwapPose(miniCfg.idle), 520);
        } else {
          miniSwapPose(miniCfg.idle);
        }
        // Shooter: fire a bullet trace that hits the target.
        if (miniCfg.bulletStart) bulletShot(miniCfg, true);
        setTimeout(() => {
          fx(miniCfg.fxCorrect.text, miniCfg.fxCorrect.color);
          const bar = $(".mon-hp i"); if (bar) bar.style.width = ((GAME.battle.monsterMax - GAME.battle.monsterHp) / GAME.battle.monsterMax) * 100 + "%";
          const lab = $(".mon-hp-label"); if (lab) lab.textContent = miniCfg.label + " " + (GAME.battle.monsterMax - GAME.battle.monsterHp) + "/" + GAME.battle.monsterMax;
        }, 200);
        if (res.won) {
          setTimeout(() => {
            miniSwapPose(miniCfg.winPose);
            fx(miniCfg.fxWin.text, miniCfg.fxWin.color);
          }, 520);
          setTimeout(() => onWin(), 1800);
          return;
        }
      } else {
        // Each weapon gets its own swing animation + projectile/effect + sound.
        const w = res.weapon;
        if (w === "bat")        pl && pl.classList.add("swing-bat");
        else if (w === "gun")   pl && pl.classList.add("swing-gun");
        else                    pl && pl.classList.add("lunge");
        if (w === "sling")      { SOUND.play("stone");  stone();  }
        else if (w === "bat")   { SOUND.play("strike"); }
        else if (w === "gun")   { SOUND.play("stone");  bullet(); }
        else                    { SOUND.play("attack"); beam();   }
        const wEmoji = w === "sling" ? "🪨" : w === "bat" ? "🥎" : w === "gun" ? "🔫" : "🔦";
        const burstIcon = w === "bat" ? "💥" : w === "gun" ? "💢" : w === "sling" ? "💥" : "✨";
        setTimeout(() => {
          SOUND.play("monsterHit");
          impactBurst(burstIcon);                       // visible attack-landed effect
          fx("-" + res.damage + " " + wEmoji, "#ffe98a");
          mon && mon.classList.add("hit");
          if (mon) mon.style.transform = monsterTransform();
          const bar = $(".mon-hp i"); if (bar) bar.style.width = (GAME.battle.monsterHp / GAME.battle.monsterMax) * 100 + "%";
          const lab = $(".mon-hp-label"); if (lab) lab.textContent = "HP " + GAME.battle.monsterHp + "/" + GAME.battle.monsterMax;
        }, 200);
        if (res.won) {
          setTimeout(() => { SOUND.play("monsterFall"); mon && mon.classList.add("fall"); }, 580);
          setTimeout(() => onWin(), 1520);
          return;
        }
        // Wave cleared — drop the current zombie, fade the next one in from the right.
        if (res.waveCleared) {
          setTimeout(() => { SOUND.play("monsterFall"); mon && mon.classList.add("fall"); }, 580);
          setTimeout(() => {
            const left = res.totalWaves - res.nextWave + 1;
            fx(`Zombie ${res.nextWave - 1} down! ${left} left.`, "#7adf9a");
          }, 900);
          setTimeout(() => {
            if (res.nextMonsterName) toast(`${res.nextMonsterName} appears!`, "bad");
          }, 1300);
          // Re-render the battle so the next zombie spawns (full HP, far away).
          setTimeout(() => { busy = false; renderBattle(true); }, 1700);
          return;
        }
      }
    } else if (res.hit || res.blocked) {
      SOUND.play("wrong");
      if (isMini) {
        // Loot-room mini-games never call hit/blocked because they don't cost lives,
        // but keep the branch for symmetry if a future room re-enables it.
        if (miniCfg.crashClass) miniFx(miniCfg.crashClass);
        if (miniCfg.wrongPose)  miniSwapPose(miniCfg.wrongPose);
        SOUND.play(miniCfg.sndLose);
        setTimeout(() => {
          if (res.blocked) fx("🛡️ SHIELD!", "#6fe3d2");
          else { $(".arena") && $(".arena").classList.add("shake"); fx("-1 ❤️", "#e2484d"); }
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
            enemyHitBurst(true);
            fx("🛡️ SHIELD!", "#6fe3d2");
          } else {
            SOUND.play("strike");
            SOUND.play("lifeLost");
            enemyHitBurst(false);                 // claw-slash burst on the player
            pl && pl.classList.add("shake");
            $(".arena") && $(".arena").classList.add("shake");
            fx("-1 ❤️", "#e2484d");
          }
        }, 220);
      }
      if (res.lost) {
        setTimeout(() => {
          if (isMini) miniSwapPose(miniCfg.failPose);
          else pl && pl.classList.add("fall");
        }, 700);
        setTimeout(() => onDefeat(), 1700);
        return;
      }
    } else {
      // wrong answer (still away from the player, or a loot-room wobble)
      SOUND.play(isMini ? miniCfg.sndWrong : "wrong");
      setTimeout(() => {
        if (isMini) {
          SOUND.play("step");
          if (miniCfg.wrongClass) miniFx(miniCfg.wrongClass, 900);
          if (miniCfg.wrongPose)  miniSwapPose(miniCfg.wrongPose);
          // Shooter: fire a bullet that visibly OVERSHOOTS the target.
          if (miniCfg.bulletStart) bulletShot(miniCfg, false);
          const t = $("#fTries"); if (t) t.innerHTML = triesDotsHTML(res.wrongCount, res.wrongLimit);
          const left = Math.max(0, res.wrongLimit - res.wrongCount);
          const w = miniCfg.fxWrong(left);
          fx(w.text, w.color);
        } else {
          SOUND.play("step");
          if (mon) mon.style.transform = monsterTransform();
          fx(res.reachedPlayer ? "It's right next to you!" : "Closer…", res.reachedPlayer ? "#e2484d" : "#e8b23a");
        }
      }, 170);
      if (res.softLost) {
        setTimeout(() => { if (isMini) miniSwapPose(miniCfg.failPose); }, 700);
        setTimeout(() => onSoftLose(), 1700);
        return;
      }
      // After a non-fatal wrong, restore the idle pose for the next question.
      // (Study's sleep + shooter's miss are temporary cues — fade them out.)
      if (isMini && miniCfg.wrongPose) {
        setTimeout(() => { if (GAME.battle && GAME.battle.status === "fighting") miniSwapPose(miniCfg.idle); }, 1500);
      }
    }
    setTimeout(() => { busy = false; renderBattle(false); }, res.correct ? 1300 : 1900);
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
    SOUND.play("win");
    if (gotKey) setTimeout(() => SOUND.play("key"), 220);
    setTimeout(() => SOUND.play("coin"), gotKey ? 440 : 220);
    document.body.insertAdjacentHTML("beforeend", `
      <div class="overlay" id="ov"><div class="modal">
        <div class="big-emoji">${emoji}</div>
        <h2>${esc(title)}</h2>
        <p>${esc(ROOM_WIN[room.id] || "The monster falls!")}<br/><br/>
          ${gotKey ? `You earned the <b>${esc(room.name)} key</b> and ` : "You earned "}<b>+30 🪙 coins</b>.
          ${gotKey ? `<br/><b>${p.keys.length}/${GAME.mansion.keyRoomIds.length}</b> keys collected.` : ""}
          ${isLoot ? `<br/><br/><span class="muted" style="font-size:13.5px">Come back any time — this room never runs out of coins.</span>` : ""}
          ${p.keys.length >= GAME.mansion.keyRoomIds.length ? `<br/><br/>🔓 <b>The Basement is now unlocked!</b>` : ""}</p>
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
    SOUND.play("wrong");
    const b = GAME.battle;
    const id = b && b.room ? b.room.id : "";
    const msg = id === "gym"
      ? "You couldn't lift that one. Catch your breath and try again."
      : id === "study"
        ? "You drifted off too many times. Wake up and have another go!"
        : id === "mall_sports"
          ? "Three misses and the ball deflated. Grab a fresh ball and have another go!"
          : id === "mall_game_shop"
            ? "You missed too many shots and the toy gun broke. Grab a new one and try again!"
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
    SOUND.play("gameOver");
    // Apply the soft penalty NOW (before showing the modal) so we can report
    // the exact loss to the player. Items + the +1-life buff are preserved.
    const penalty = GAME.onDefeat();
    const keysLost  = (penalty && penalty.keysLostCount) || 0;
    const coinsLost = (penalty && penalty.coinsLost) || 0;
    const mansionName = (GAME.mansion && GAME.mansion.name) || "this map";
    const lines = [];

    if (keysLost > 0) {
      // Build a "Topic (N%)" list so the kid sees exactly which topics they
      // need more practice on. Topics with no stats yet show as "new".
      const tLabels = (window.REPORT && REPORT.LABELS) || {};
      const detail = (penalty.keysLostDetail || []).map(d => {
        const label = (d.topic && tLabels[d.topic]) || d.topic || "—";
        const pct   = d.attempts > 0 ? Math.round(d.acc * 100) + "%" : "new";
        return `${esc(d.roomName || d.roomId)} <span class="muted" style="font-size:13px">· ${esc(label)} (${pct})</span>`;
      });
      lines.push(`🗝️ Lost <b>${keysLost} key${keysLost === 1 ? "" : "s"}</b> from your weakest topics — those rooms are open again:`);
      lines.push(`<ul style="margin:6px 0 8px 22px;padding:0;line-height:1.6">${detail.map(d => `<li>${d}</li>`).join("")}</ul>`);
    } else {
      lines.push(`🗝️ No keys lost (you didn't have any yet).`);
    }
    if (coinsLost > 0) {
      lines.push(`🪙 Lost <b>${coinsLost} coin${coinsLost === 1 ? "" : "s"}</b>${penalty.coinsRemaining === 0 ? " (purse is now empty)" : ""}.`);
    } else {
      lines.push(`🪙 No coins lost.`);
    }
    lines.push(`🎒 Your items are safe.`);

    document.body.insertAdjacentHTML("beforeend", `
      <div class="overlay" id="ov"><div class="modal" style="max-width:520px">
        <div class="big-emoji">💀</div>
        <h2>Game Over</h2>
        <p>Your lives reached zero in <b>${esc(mansionName)}</b>. Here's what happened:</p>
        <div style="text-align:left;line-height:1.8">${lines.join("<br/>")}</div>
        <div class="row" style="margin-top:14px"><button class="btn primary" id="ovBack">Back to Map</button></div>
      </div></div>`);
    $("#ovBack").onclick = () => { $("#ov").remove(); renderMap(); };
  }

  function escapeCinematic() {
    SOUND.play("escape");
    if (GAME.mansionId === "zombie_mall") {
      renderStoryCinematic(ENDING_MALL, () => {
        GAME.quitBattle();
        renderMap();
        toast("Mall escaped! 🏆", "gold");
      });
      return;
    }
    const cin = document.createElement("div");
    cin.className = "cinematic";
    cin.innerHTML = `
      <div class="scene"><div class="runner">${ART.player("torch", (STORE.active() || {}).gender)}</div></div>
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
    function topicCard(row) {
      const has = row.attempts > 0;
      return `<div class="rep-card">
        <div class="t"><span>${esc(row.label)}</span>
          <span class="${has ? row.band.cls : "tag-mid"}">${has ? row.band.txt : "Not tried"}</span></div>
        <div class="acc" style="color:${has ? row.band.color : "#9a8fb3"}">${has ? row.pct + "%" : "—"}</div>
        <div class="sub">${has ? row.correct + " / " + row.attempts + " correct" : "No questions answered"}</div>
        <div class="bar"><i style="width:${row.pct}%;background:${has ? row.band.color : "#3a2a52"}"></i></div>
      </div>`;
    }
    const aggregateCards = r.rows.map(topicCard).join("");

    // Per-mansion sections — collapsible (default collapsed). Different maps have
    // different difficulty so parents can drill into a specific map when needed.
    const mansionSections = (r.byMansion || []).map(m => {
      const weakLabel = m.weakest.length
        ? `<span class="rep-weak-tag">Weakest: ${m.weakest.map(w => esc(w.label)).join(", ")}</span>`
        : `<span class="rep-weak-tag muted-tag">No clear weak topic yet</span>`;
      return `<details class="mansion-report-section">
        <summary>
          <span class="rep-chevron">▸</span>
          <span class="rep-mansion-name">${esc(m.name)}</span>
          <span class="rep-mansion-pct">${m.pct}% over ${m.totalQ} questions</span>
          ${weakLabel}
        </summary>
        <div class="rep-grid" style="margin-top:12px">${m.rows.map(topicCard).join("")}</div>
      </details>`;
    }).join("");

    const recent = r.recent.length
      ? `<h1 style="font-size:20px;margin:26px 0 10px">Recent mistakes</h1>
         <div class="rep-grid">${r.recent.map(m => `<div class="rep-card">
           <div class="t"><span>${esc(m.label)}</span><span class="sub">${esc(m.when)}</span></div>
           ${m.mansion ? `<div class="sub" style="font-size:12px;color:#9a8fb3">📍 ${esc(m.mansion)}</div>` : ""}
           <div class="sub" style="margin-top:8px;line-height:1.5">${esc(m.q)}</div>
         </div>`).join("")}</div>`
      : "";

    screen().innerHTML = `
      <div class="topbar"><span class="back" id="bk">← Back</span><h2>📊 Parent Report — ${esc((STORE.active() || {}).name || "Player")}</h2></div>
      <div class="page">
        <div class="summary-box">${r.summary}</div>
        <h1 style="font-size:20px;margin-bottom:10px">Overall — all maps combined</h1>
        <div class="rep-grid">${aggregateCards}</div>
        ${mansionSections ? `<div class="muted" style="margin-top:18px;font-size:13px">Different maps have different difficulty. The breakdown below shows how your child is doing in <b>each map separately</b>.</div>${mansionSections}` : ""}
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
        <div class="profile-mini">${ART.player("torch", p.gender)}</div>
        <div class="profile-name">${esc(p.name)}</div>
        <div class="profile-meta">🪙 ${totalCoins} · 🗝️ ${keysFound}</div>
        <div class="profile-actions">
          <button class="btn ghost sm" data-edit="${p.id}">Edit</button>
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
    screen().querySelectorAll("[data-edit]").forEach(b => {
      b.onclick = (ev) => {
        ev.stopPropagation();
        const id = b.dataset.edit;
        const cur = STORE.state.profiles[id]; if (!cur) return;
        editProfileModal("Edit player", cur.name, cur.gender, (name, gender) => {
          if (name == null) return;
          STORE.updateProfile(id, { name, gender });
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
      editProfileModal("Add new player", "", "boy", (name, gender) => {
        if (!name) return;
        STORE.createProfile(name, gender);
        renderMenu();
      });
    };
  }

  // Profile create / edit modal — name input + boy/girl character picker.
  function editProfileModal(title, initialName, initialGender, onOk) {
    let gender = initialGender === "girl" ? "girl" : "boy";
    document.body.insertAdjacentHTML("beforeend", `
      <div class="overlay" id="pm"><div class="modal" style="max-width:480px">
        <h2>${esc(title)}</h2>
        <div class="field" style="margin-top:14px;text-align:left">
          <label>Player name</label>
          <input id="pmInput" type="text" value="${esc(initialName || "")}" maxlength="24" placeholder="e.g. Preston, Jenny…"/>
        </div>
        <div class="muted" style="font-size:13px;text-align:left;margin:6px 2px 8px">Choose your character:</div>
        <div class="char-picker">
          <div class="char-card ${gender === "boy" ? "active" : ""}" data-g="boy">
            <div class="char-art">${ART.player("torch", "boy")}</div>
            <div class="char-label">Boy</div>
          </div>
          <div class="char-card ${gender === "girl" ? "active" : ""}" data-g="girl">
            <div class="char-art">${ART.player("torch", "girl")}</div>
            <div class="char-label">Girl</div>
          </div>
        </div>
        <div class="row" style="margin-top:14px"><button class="btn ghost" id="pmNo">Cancel</button><button class="btn primary" id="pmYes">OK</button></div>
      </div></div>`);
    const inp = $("#pmInput"); inp.focus(); inp.select();
    screen().parentElement.querySelectorAll(".char-card").forEach(c => {
      c.onclick = () => {
        gender = c.dataset.g;
        document.querySelectorAll(".char-card").forEach(x => x.classList.toggle("active", x.dataset.g === gender));
      };
    });
    function done(val) { $("#pm").remove(); onOk(val, gender); }
    $("#pmNo").onclick = () => done(null);
    $("#pmYes").onclick = () => done(inp.value.trim());
    inp.onkeydown = (e) => { if (e.key === "Enter") done(inp.value.trim()); if (e.key === "Escape") done(null); };
  }

  // Single-input prompt (kept for misc uses).
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
