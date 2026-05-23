/* report.js — parent report analytics (which topics the child is weak in) */
(function () {
  "use strict";
  const LABELS = {
    nouns: "Nouns", verbs: "Verbs", present_tense: "Present Tense",
    pronouns: "Pronouns", adjectives: "Adjectives", punctuation: "Punctuation",
    sentence_order: "Sentence Building", comprehension: "Reading Comprehension",
    spelling: "Spelling", grammar_logic: "Grammar Logic"
  };

  function band(acc, attempts) {
    if (attempts < 4) return { tag: "mid", txt: "Needs more practice", cls: "tag-mid", color: "#e8b23a" };
    if (acc >= 0.8) return { tag: "strong", txt: "Strong", cls: "tag-strong", color: "#46c46a" };
    if (acc >= 0.55) return { tag: "mid", txt: "Improving", cls: "tag-mid", color: "#e8b23a" };
    return { tag: "weak", txt: "Weak — focus here", cls: "tag-weak", color: "#e2484d" };
  }

  // Builds rows[] for a `byTopic` map (used both for the aggregate and each mansion split).
  function rowsFor(byTopic) {
    return Object.keys(LABELS).map(topic => {
      const s = (byTopic || {})[topic] || { attempts: 0, correct: 0 };
      const acc = s.attempts ? s.correct / s.attempts : 0;
      return {
        topic, label: LABELS[topic],
        attempts: s.attempts, correct: s.correct,
        acc, pct: Math.round(acc * 100), band: band(acc, s.attempts)
      };
    });
  }

  function build() {
    const active = STORE.active();
    const stats = (active && active.stats) || { byTopic: {}, byMansion: {}, recentWrong: [] };
    const rows = rowsFor(stats.byTopic);
    const played = rows.filter(r => r.attempts > 0);
    const totalQ = played.reduce((a, r) => a + r.attempts, 0);
    const totalC = played.reduce((a, r) => a + r.correct, 0);
    const weakest = played
      .filter(r => r.attempts >= 3)
      .sort((a, b) => a.acc - b.acc)
      .slice(0, 3)
      .filter(r => r.acc < 0.7);

    let summary;
    if (!totalQ) {
      summary = "No questions answered yet. Play a few rooms and the report will fill in automatically.";
    } else if (weakest.length) {
      summary = `Overall accuracy is <b>${Math.round(totalC / totalQ * 100)}%</b> over <b>${totalQ}</b> questions. ` +
        `The child needs the most help with: <b>${weakest.map(w => w.label).join(", ")}</b>.`;
    } else {
      summary = `Overall accuracy is <b>${Math.round(totalC / totalQ * 100)}%</b> over <b>${totalQ}</b> questions. ` +
        `No clear weak topic yet — performance is fairly even. Keep playing for sharper insights.`;
    }

    // Per-mansion breakdowns (different maps have different difficulty).
    // Order them by the canonical DATA.MANSIONS order so the easier map shows first.
    const byMansion = [];
    const mansionList = (window.DATA && DATA.MANSIONS) ? DATA.MANSIONS : [];
    const seen = {};
    mansionList.forEach(m => {
      seen[m.id] = true;
      const mStats = (stats.byMansion || {})[m.id];
      if (!mStats || !mStats.byTopic) return;
      const mRows = rowsFor(mStats.byTopic);
      const mPlayed = mRows.filter(r => r.attempts > 0);
      if (!mPlayed.length) return;
      const mQ = mPlayed.reduce((a, r) => a + r.attempts, 0);
      const mC = mPlayed.reduce((a, r) => a + r.correct, 0);
      const mWeak = mPlayed.filter(r => r.attempts >= 3).sort((a, b) => a.acc - b.acc).slice(0, 3).filter(r => r.acc < 0.7);
      byMansion.push({
        id: m.id, name: m.name, rows: mRows, played: mPlayed,
        totalQ: mQ, totalC: mC, pct: mQ ? Math.round(mC / mQ * 100) : 0,
        weakest: mWeak
      });
    });
    // Any orphan mansion ids still in stats (e.g. removed mansions) — append at the end.
    Object.keys((stats.byMansion || {})).forEach(mid => {
      if (seen[mid]) return;
      const mStats = stats.byMansion[mid];
      const mRows = rowsFor(mStats.byTopic);
      const mPlayed = mRows.filter(r => r.attempts > 0);
      if (!mPlayed.length) return;
      const mQ = mPlayed.reduce((a, r) => a + r.attempts, 0);
      const mC = mPlayed.reduce((a, r) => a + r.correct, 0);
      byMansion.push({ id: mid, name: mid, rows: mRows, played: mPlayed, totalQ: mQ, totalC: mC, pct: mQ ? Math.round(mC / mQ * 100) : 0, weakest: [] });
    });

    const recent = (stats.recentWrong || []).slice(0, 12).map(r => ({
      label: LABELS[r.topic] || r.topic,
      q: r.q,
      when: timeAgo(r.ts),
      mansion: r.mansionId ? ((window.DATA && DATA.mansion(r.mansionId) || {}).name || r.mansionId) : ""
    }));

    return { rows, played, totalQ, totalC, weakest, summary, recent, byMansion };
  }

  function timeAgo(ts) {
    const s = (Date.now() - ts) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return Math.floor(s / 60) + "m ago";
    if (s < 86400) return Math.floor(s / 3600) + "h ago";
    return Math.floor(s / 86400) + "d ago";
  }

  window.REPORT = { build, LABELS };
})();
