/* sound.js — tiny synthesizer for game SFX. No external audio files needed.
   Browsers require a user gesture before audio plays — ensureCtx() handles that. */
(function () {
  "use strict";
  let ctx = null;
  let masterGain = null;
  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.55;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === "suspended") { try { ctx.resume(); } catch (e) { } }
    return ctx;
  }

  // Single tone with optional pitch glide and ADSR-style envelope.
  function tone(opts) {
    const c = ensureCtx(); if (!c) return;
    const now = c.currentTime + (opts.delay || 0);
    const dur = opts.duration || 0.2;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = opts.type || "sine";
    osc.frequency.setValueAtTime(opts.freq, now);
    if (opts.freqEnd) osc.frequency.exponentialRampToValueAtTime(opts.freqEnd, now + dur);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(opts.vol || 0.2, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(g).connect(masterGain);
    osc.start(now);
    osc.stop(now + dur + 0.05);
  }

  // White-noise burst with low-pass filter — used for "soft" thuds (footsteps, hits).
  function noise(opts) {
    const c = ensureCtx(); if (!c) return;
    const now = c.currentTime + (opts.delay || 0);
    const dur = opts.duration || 0.12;
    const bufferSize = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);
    const src = c.createBufferSource(); src.buffer = buf;
    const filt = c.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.value = opts.cutoff || 1200;
    const g = c.createGain();
    g.gain.setValueAtTime(opts.vol || 0.18, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    src.connect(filt).connect(g).connect(masterGain);
    src.start(now); src.stop(now + dur + 0.05);
  }

  const SOUNDS = {
    // UI
    click()    { tone({ type: "square",   freq: 520, duration: 0.05, vol: 0.08 }); },

    // Battle outcomes
    correct()  {
      tone({ type: "triangle", freq: 660,  duration: 0.10, vol: 0.20 });
      tone({ type: "triangle", freq: 880,  duration: 0.12, vol: 0.20, delay: 0.08 });
      tone({ type: "triangle", freq: 1175, duration: 0.18, vol: 0.20, delay: 0.18 });
    },
    wrong()    {
      tone({ type: "square",   freq: 220, freqEnd: 110, duration: 0.30, vol: 0.18 });
    },

    // Combat actions
    attack()   {
      tone({ type: "sawtooth", freq: 1400, freqEnd: 300, duration: 0.16, vol: 0.16 });
    },
    stone()    {
      noise({ duration: 0.18, vol: 0.20, cutoff: 800 });
      tone({ type: "square", freq: 140, freqEnd: 70, duration: 0.18, vol: 0.16, delay: 0.04 });
    },
    monsterHit() {
      tone({ type: "square",   freq: 110, freqEnd: 55, duration: 0.18, vol: 0.20 });
      noise({ duration: 0.10, vol: 0.10, cutoff: 600, delay: 0.02 });
    },
    monsterFall() {
      tone({ type: "sawtooth", freq: 380, freqEnd: 60, duration: 0.55, vol: 0.20 });
    },
    step()     { noise({ duration: 0.08, vol: 0.10, cutoff: 400 }); },
    strike()   {
      noise({ duration: 0.14, vol: 0.22, cutoff: 1500 });
      tone({ type: "square", freq: 180, freqEnd: 60, duration: 0.20, vol: 0.18, delay: 0.02 });
    },
    lifeLost() {
      tone({ type: "square",   freq: 440, freqEnd: 110, duration: 0.35, vol: 0.18 });
      tone({ type: "sine",     freq: 130, duration: 0.30, vol: 0.14, delay: 0.18 });
    },

    // Win / lose / pickups
    win() {
      [523.25, 659.26, 783.99, 1046.50].forEach((f, i) =>
        tone({ type: "triangle", freq: f, duration: 0.22, vol: 0.18, delay: i * 0.10 }));
    },
    key() {
      tone({ type: "triangle", freq: 1318, duration: 0.10, vol: 0.20 });
      tone({ type: "triangle", freq: 1760, duration: 0.18, vol: 0.20, delay: 0.08 });
    },
    coin() {
      tone({ type: "square", freq: 988,  duration: 0.07, vol: 0.16 });
      tone({ type: "square", freq: 1318, duration: 0.12, vol: 0.16, delay: 0.06 });
    },
    gameOver() {
      const notes = [392.00, 349.23, 311.13, 261.63, 220.00];
      notes.forEach((f, i) =>
        tone({ type: "sawtooth", freq: f, duration: 0.35, vol: 0.18, delay: i * 0.18 }));
    },
    escape() {
      [523.25, 659.26, 783.99, 1046.50, 1318.51, 1567.98].forEach((f, i) =>
        tone({ type: "triangle", freq: f, duration: 0.28, vol: 0.20, delay: i * 0.13 }));
    },

    // Gym + Study mini-game cues
    rep()      { tone({ type: "triangle", freq: 880, duration: 0.10, vol: 0.18 }); tone({ type: "triangle", freq: 1175, duration: 0.14, vol: 0.18, delay: 0.08 }); },
    drop()     { noise({ duration: 0.25, vol: 0.25, cutoff: 600 }); tone({ type: "sawtooth", freq: 200, freqEnd: 50, duration: 0.30, vol: 0.18, delay: 0.04 }); },
    snore()    { tone({ type: "sine", freq: 220, freqEnd: 110, duration: 0.45, vol: 0.16 }); },
    book()     { tone({ type: "triangle", freq: 988, duration: 0.10, vol: 0.16 }); }
  };

  let muted = false;
  try { muted = localStorage.getItem("hem_muted") === "1"; } catch (e) { }

  window.SOUND = {
    play(name) { if (muted) return; if (SOUNDS[name]) SOUNDS[name](); },
    isMuted() { return muted; },
    toggleMute() {
      muted = !muted;
      try { localStorage.setItem("hem_muted", muted ? "1" : "0"); } catch (e) { }
      if (!muted) ensureCtx();   // unlock audio on the first user gesture
      return muted;
    },
    // Call once on any early user gesture so subsequent plays don't get blocked.
    unlock() { ensureCtx(); }
  };
})();
