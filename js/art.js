/* art.js — inline SVG art. Dark, eerie, low-cartoon, deliberately scary.
   ART.monster(id) · ART.room(id) · ART.player(weapon) · ART.mansion() · ART.heart() */
(function () {
  "use strict";

  const DEFS = `
  <defs>
    <radialGradient id="eye" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff"/><stop offset="30%" stop-color="#ff2a2a"/>
      <stop offset="100%" stop-color="#4a0000"/>
    </radialGradient>
    <radialGradient id="eyeG" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f0fffb"/><stop offset="38%" stop-color="#39e0c8"/>
      <stop offset="100%" stop-color="#02201d"/>
    </radialGradient>
    <radialGradient id="eyeY" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff7d6"/><stop offset="40%" stop-color="#ffb53a"/>
      <stop offset="100%" stop-color="#3a2400"/>
    </radialGradient>
    <linearGradient id="cloak" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#352a47"/><stop offset="100%" stop-color="#0a0714"/>
    </linearGradient>
    <linearGradient id="bone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#efe8d4"/><stop offset="100%" stop-color="#8a8068"/>
    </linearGradient>
    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`;

  function svg(vb, body, pa) {
    return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="${pa || "xMidYMax meet"}">${DEFS}${body}</svg>`;
  }
  // glowing eyes
  const E = (x1, x2, y, r, g) =>
    `<circle cx="${x1}" cy="${y}" r="${r}" fill="url(#${g})" filter="url(#glow)"/>
     <circle cx="${x2}" cy="${y}" r="${r}" fill="url(#${g})" filter="url(#glow)"/>
     <circle cx="${x1}" cy="${y}" r="${r * .35}" fill="#1a0000"/>
     <circle cx="${x2}" cy="${y}" r="${r * .35}" fill="#1a0000"/>`;
  // angry slanted brows
  const BROW = (x1, x2, y, w, dir) =>
    `<path d="M${x1 - w} ${y + (dir > 0 ? -7 : 7)} L${x1 + w} ${y + (dir > 0 ? 7 : -7)}" stroke="#000" stroke-width="5" stroke-linecap="round" opacity=".85"/>
     <path d="M${x2 - w} ${y + (dir > 0 ? 7 : -7)} L${x2 + w} ${y + (dir > 0 ? -7 : 7)}" stroke="#000" stroke-width="5" stroke-linecap="round" opacity=".85"/>`;
  // jagged snarling mouth
  const FANGS = (x, y, w, n) => {
    let d = `M${x} ${y}`;
    for (let i = 0; i < n; i++) { const sx = x + (w / n) * i; d += ` L${sx + w / n / 2} ${y + 14} L${sx + w / n} ${y}`; }
    return `<path d="M${x - 4} ${y - 4} H${x + w + 4} V${y + 2} H${x - 4} Z" fill="#070205"/>
            <path d="${d}" fill="none" stroke="#efe6d0" stroke-width="3.2" stroke-linejoin="round"/>`;
  };

  /* ---------------- MONSTERS (menacing) ---------------- */
  const MON = {
    shadow_ghost: () => svg("0 0 200 250", `
      <ellipse cx="100" cy="236" rx="66" ry="13" fill="#000" opacity=".5"/>
      <path d="M100 16C54 16 42 66 42 120c0 48-12 74-22 102 18-12 30-4 38 8 9-14 20-14 28 0 10-14 22-14 32 0 10-14 22-14 32 0 8-12 20-20 38-8-10-28-22-54-22-102 0-54-12-104-58-104Z"
        fill="url(#cloak)" stroke="#2c2340" stroke-width="2"/>
      <path d="M58 96 36 70 64 86M142 96l24-26-28 16" fill="#1c1430"/>
      <ellipse cx="100" cy="98" rx="42" ry="48" fill="#040210"/>
      ${E(83, 117, 92, 10, "eyeG")}
      ${BROW(83, 117, 76, 13, 1)}
      <path d="M82 128 L90 138 L98 128 L106 138 L114 128 L118 134" fill="none" stroke="#39e0c8" stroke-width="3" opacity=".85"/>
      <path d="M44 150c-10 16-6 30 4 40M156 150c10 16 6 30-4 40" stroke="#2c2340" stroke-width="3" fill="none"/>`),

    red_eye_beast: () => svg("0 0 230 250", `
      <ellipse cx="115" cy="238" rx="84" ry="13" fill="#000" opacity=".5"/>
      <path d="M50 222c-16-44-22-104 10-142 24-30 86-30 110 0 30 38 24 98 8 142-12-10-22-4-28 8-9-14-20-14-29 0-10-14-22-14-32 0-7-12-19-18-49-8Z"
        fill="#2a1016" stroke="#3e1820" stroke-width="2"/>
      <path d="M62 66 44 18l34 30M168 66l18-48-34 30" fill="#1c0b10" stroke="#3e1820" stroke-width="2"/>
      <path d="M58 100q57 -34 114 0 -8 46 -57 52 -49-6 -57-52Z" fill="#0e0407"/>
      ${E(90, 142, 108, 13, "eye")}
      ${BROW(90, 142, 86, 18, 1)}
      ${FANGS(78, 150, 76, 6)}
      <path d="M60 176l-10 26M170 176l10 26M52 120 30 96M178 120l22-24" stroke="#3e1820" stroke-width="6" stroke-linecap="round"/>`),

    laughing_clown: () => svg("0 0 200 250", `
      <ellipse cx="100" cy="238" rx="70" ry="12" fill="#000" opacity=".5"/>
      <path d="M58 222c-8-32-14-70 0-110 -24-6-36-28-32-50 20 16 32 12 40 4 6-32 26-50 34-50s28 18 34 50c8 8 20 12 40-4 4 22-8 44-32 50 14 40 8 78 0 110-10-8-20-4-26 8-9-14-20-14-29 0-10-14-22-14-32 0-7-10-15-12-27-8Z"
        fill="#3a2342" stroke="#1a1024" stroke-width="2"/>
      <ellipse cx="100" cy="108" rx="48" ry="52" fill="#e4d8cc"/>
      <circle cx="100" cy="124" r="10" fill="#a4111f"/>
      ${E(82, 118, 98, 8, "eye")}
      <path d="M70 78l20 12M130 78l-20 12" stroke="#1a1024" stroke-width="4"/>
      <path d="M64 138q36 -10 72 0 -8 30 -36 30 -28 0 -36-30Z" fill="#4a0a12" stroke="#1a1024" stroke-width="2"/>
      <path d="M66 140 L78 152 L90 140 L100 154 L112 140 L122 152 L134 140" fill="none" stroke="#efe6d0" stroke-width="3"/>
      <path d="M52 60q48 -34 96 0" fill="none" stroke="#7a1f2c" stroke-width="3"/>`),

    dark_hall_monster: () => svg("0 0 200 256", `
      <ellipse cx="100" cy="244" rx="50" ry="11" fill="#000" opacity=".5"/>
      <path d="M100 24c-13 0-21 14-21 33 0 16 6 26 6 44l-48 66c-6 9 5 18 13 9l41-44v110h20V178l41 44c8 9 19 0 13-9l-48-66c0-18 6-28 6-44 0-19-8-33-21-33Z"
        fill="#0c0916" stroke="#241d38" stroke-width="2"/>
      <ellipse cx="100" cy="58" rx="23" ry="28" fill="#020108"/>
      <ellipse cx="91" cy="56" rx="3.4" ry="9" fill="url(#eyeG)" filter="url(#glow)"/>
      <ellipse cx="109" cy="56" rx="3.4" ry="9" fill="url(#eyeG)" filter="url(#glow)"/>
      <ellipse cx="100" cy="74" rx="7" ry="11" fill="#000"/>
      <path d="M70 150 36 210M130 150l34 60" stroke="#241d38" stroke-width="3" opacity=".7"/>`),

    mirror_ghost: () => svg("0 0 200 250", `
      <ellipse cx="100" cy="240" rx="58" ry="12" fill="#000" opacity=".5"/>
      <rect x="40" y="20" width="120" height="196" rx="10" fill="#2a2236" stroke="#5a4e74" stroke-width="6"/>
      <rect x="52" y="32" width="96" height="172" rx="5" fill="#0e1118"/>
      <path d="M86 38 70 120l22 6-16 84 56-104-26-6 16-56Z" fill="#43506a" opacity=".4"/>
      <ellipse cx="100" cy="110" rx="36" ry="46" fill="#06080e"/>
      ${E(87, 113, 102, 8, "eyeG")}
      ${BROW(87, 113, 86, 12, 1)}
      <ellipse cx="100" cy="134" rx="13" ry="18" fill="#000"/>
      <path d="M70 36 92 210M128 60 100 200M132 40 158 170M64 70 96 220" stroke="#5b6680" stroke-width="1.3" opacity=".5"/>`),

    doorway_demon: () => svg("0 0 214 252", `
      <ellipse cx="107" cy="240" rx="72" ry="12" fill="#000" opacity=".5"/>
      <path d="M42 236V70c0-30 28-52 65-52s65 22 65 52v166" fill="#120713" stroke="#3c1432" stroke-width="3"/>
      <path d="M58 232V76c0-22 22-40 49-40s49 18 49 40v156Z" fill="#030107"/>
      <path d="M70 56 50 14l34 26M144 56l20-42-34 26" fill="#2c0a16" stroke="#5c1428" stroke-width="2"/>
      ${E(86, 128, 116, 12, "eye")}
      ${BROW(86, 128, 92, 17, 1)}
      ${FANGS(78, 150, 60, 5)}
      <path d="M64 188c22 18 60 18 82 0" stroke="#5c1428" stroke-width="3" fill="none" opacity=".7"/>`),

    white_mask_ghost: () => svg("0 0 200 250", `
      <ellipse cx="100" cy="238" rx="62" ry="12" fill="#000" opacity=".5"/>
      <path d="M100 18C58 18 44 66 44 122c0 46-12 70-24 100 18-10 30-2 38 10 9-14 20-14 28 0 10-14 22-14 32 0 10-14 22-14 30 0 8-12 22-22 40-10-12-30-24-56-24-100 0-56-14-100-56-100Z"
        fill="#0e0a18" stroke="#282038" stroke-width="2"/>
      <path d="M100 60c-22 0-38 22-38 52 0 30 18 52 38 52s38-22 38-52-16-52-38-52Z" fill="#e7e2d8" stroke="#9a9488" stroke-width="2"/>
      <path d="M78 92l16 16-16 8ZM122 92l-16 16 16 8Z" fill="#080510"/>
      <path d="M86 138 L94 132 L100 138 L106 132 L114 138" fill="none" stroke="#1a1622" stroke-width="3"/>
      <path d="M100 50v118" stroke="#b6b0a4" stroke-width="1.2" opacity=".5"/>`),

    crawling_shade: () => svg("0 0 240 220", `
      <ellipse cx="120" cy="208" rx="92" ry="13" fill="#000" opacity=".5"/>
      <path d="M76 158q44 -42 88 0 -10 42 -44 46 -34-4 -44-46Z" fill="#0d0a1a" stroke="#241d38" stroke-width="2"/>
      <path d="M82 166 34 108 18 54M158 166l48-58 16-54M92 182 58 214M148 182l34 32M70 172 30 178M170 172l40 6" stroke="#181228" stroke-width="6" fill="none" stroke-linecap="round"/>
      <ellipse cx="120" cy="156" rx="32" ry="26" fill="#030108"/>
      ${E(108, 132, 152, 8, "eye")}
      ${FANGS(100, 166, 40, 4)}`),

    soap_phantom: () => svg("0 0 200 260", `
      <ellipse cx="100" cy="248" rx="64" ry="12" fill="#000" opacity=".5"/>
      <!-- bubbles drifting around -->
      <circle cx="44" cy="60" r="14" fill="#bce4ff" opacity=".55"/>
      <circle cx="156" cy="46" r="11" fill="#bce4ff" opacity=".55"/>
      <circle cx="36" cy="184" r="10" fill="#bce4ff" opacity=".45"/>
      <circle cx="172" cy="200" r="12" fill="#bce4ff" opacity=".5"/>
      <circle cx="44" cy="60" r="14" fill="none" stroke="#fff" stroke-width="1" opacity=".7"/>
      <circle cx="40" cy="56" r="3" fill="#fff" opacity=".6"/>
      <!-- ghost body (cyan-tinted) -->
      <path d="M100 28C56 28 42 70 42 122c0 50-12 72-22 100 18-10 30-2 38 10 9-14 20-14 28 0 10-14 22-14 32 0 9-14 20-14 28 0 8-12 22-22 38-10-10-28-22-50-22-100 0-52-14-94-58-94Z"
        fill="#2e4e58" stroke="#56828c" stroke-width="2"/>
      <!-- bubble crown -->
      <circle cx="100" cy="40" r="16" fill="#bce4ff" opacity=".75"/>
      <circle cx="80" cy="58" r="11" fill="#bce4ff" opacity=".65"/>
      <circle cx="120" cy="58" r="11" fill="#bce4ff" opacity=".65"/>
      <circle cx="100" cy="40" r="16" fill="none" stroke="#fff" stroke-width="1" opacity=".7"/>
      <!-- bubbles on body -->
      <circle cx="76" cy="170" r="7" fill="#bce4ff" opacity=".55"/>
      <circle cx="132" cy="190" r="8" fill="#bce4ff" opacity=".55"/>
      <circle cx="116" cy="148" r="5" fill="#bce4ff" opacity=".55"/>
      <!-- face -->
      <ellipse cx="100" cy="104" rx="42" ry="46" fill="#0e1c1f"/>
      ${E(84, 116, 100, 10, "eyeG")}
      ${BROW(84, 116, 84, 13, 1)}
      <!-- jagged frown -->
      <path d="M82 132 L92 142 L100 132 L108 142 L116 132 L120 140" fill="none" stroke="#7dd0ff" stroke-width="3"/>
      <!-- arms holding a washboard -->
      <rect x="58" y="170" width="84" height="34" rx="3" fill="#3a2a18"/>
      <rect x="62" y="174" width="76" height="26" rx="2" fill="#5a4a48"/>
      <path d="M66 178 H134 M66 184 H134 M66 190 H134 M66 196 H134" stroke="#9a8a70" stroke-width="1.5"/>`),

    masquerade_ghost: () => svg("0 0 200 260", `
      <ellipse cx="100" cy="248" rx="62" ry="12" fill="#000" opacity=".5"/>
      <!-- long elegant cape -->
      <path d="M100 76c-34 0-56 30-56 84 0 56-12 72-22 96 18-8 30-2 36 10 9-14 20-14 28 0 10-14 22-14 30 0 9-14 20-14 28 0 8-12 22-22 38-10-12-28-24-44-24-100 0-54-22-84-58-84Z"
        fill="#1a0a14" stroke="#3a1a28" stroke-width="2"/>
      <!-- collar / shoulders -->
      <path d="M60 116 L100 92 L140 116 L132 134 L68 134 Z" fill="#3a1a28"/>
      <!-- top hat -->
      <rect x="78" y="22" width="44" height="36" rx="2" fill="#0a0510"/>
      <rect x="70" y="56" width="60" height="6" rx="1" fill="#0a0510"/>
      <rect x="78" y="34" width="44" height="4" fill="#7a1f28"/>
      <!-- ornate white mask -->
      <path d="M70 92q30 -32 60 0 q0 38 -30 40 q-30 -2 -30 -40 Z" fill="#ece4d2" stroke="#9a9488" stroke-width="2"/>
      <!-- mask gilded curves -->
      <path d="M74 84 q12 -8 22 -2 m6 0 q12 -6 22 2" stroke="#f0b53a" stroke-width="2" fill="none"/>
      <path d="M82 116 q8 5 16 0 m4 0 q8 5 16 0" stroke="#f0b53a" stroke-width="1.6" fill="none"/>
      <!-- eye holes -->
      <ellipse cx="86" cy="100" rx="7" ry="10" fill="#080510"/>
      <ellipse cx="114" cy="100" rx="7" ry="10" fill="#080510"/>
      <!-- glowing eyes inside -->
      <circle cx="86" cy="102" r="3.5" fill="url(#eye)" filter="url(#glow)"/>
      <circle cx="114" cy="102" r="3.5" fill="url(#eye)" filter="url(#glow)"/>
      <!-- thin smile -->
      <path d="M88 128 q12 5 24 0" stroke="#3a1a28" stroke-width="2.4" fill="none"/>
      <!-- feathers on hat -->
      <path d="M118 30 q12 -10 22 -22" stroke="#7a1f28" stroke-width="3" fill="none"/>
      <path d="M120 28 q14 -6 24 -16" stroke="#5a1018" stroke-width="2" fill="none"/>
      <!-- black rose in hand -->
      <path d="M44 184 L60 200" stroke="#3a2a18" stroke-width="3"/>
      <circle cx="42" cy="180" r="7" fill="#5a0a14" stroke="#0a0508" stroke-width="1.4"/>
      <circle cx="42" cy="180" r="3" fill="#0a0508"/>`),

    whispering_wraith: () => svg("0 0 200 250", `
      <ellipse cx="100" cy="238" rx="60" ry="12" fill="#000" opacity=".5"/>
      <path d="M100 18C60 18 48 64 48 116c0 48-12 72-24 102 18-10 30-2 38 10 9-14 20-14 28 0 10-14 22-14 32 0 8-12 22-22 40-10-12-30-22-52-22-102 0-52-12-98-52-98Z"
        fill="url(#cloak)" stroke="#2c2340" stroke-width="2"/>
      <ellipse cx="100" cy="86" rx="36" ry="42" fill="#040210"/>
      ${E(85, 115, 80, 8, "eyeG")}
      ${BROW(85, 115, 64, 12, 1)}
      <ellipse cx="100" cy="106" rx="9" ry="15" fill="#000"/>
      <rect x="60" y="156" width="80" height="54" rx="3" fill="#cdc2ab" stroke="#766b53" stroke-width="2"/>
      <path d="M100 156v54M66 170h26M66 184h26M108 170h26M108 184h26" stroke="#766b53" stroke-width="2"/>`),

    iron_phantom: () => svg("0 0 214 250", `
      <ellipse cx="107" cy="238" rx="72" ry="12" fill="#000" opacity=".5"/>
      <path d="M107 32c-32 0-46 24-46 52 0 12 4 22 4 32l-16 100h116l-16-100c0-10 4-20 4-32 0-28-14-52-46-52Z"
        fill="#3c414c" stroke="#1a1e24" stroke-width="2"/>
      <path d="M107 32c-32 0-46 24-46 52 0 12 4 22 4 32h84c0-10 4-20 4-32 0-28-14-52-46-52Z" fill="#2b303a"/>
      <rect x="76" y="66" width="62" height="40" rx="4" fill="#070a0e"/>
      <rect x="84" y="84" width="46" height="6" fill="url(#eye)" filter="url(#glow)"/>
      <path d="M84 96l8 14M122 96l8 14M107 50v66" stroke="#1a1e24" stroke-width="3"/>
      <path d="M61 130 30 168M153 130l31 38" stroke="#2b303a" stroke-width="11" stroke-linecap="round"/>`),

    mansion_king: () => svg("0 0 300 300", `
      <ellipse cx="150" cy="284" rx="120" ry="16" fill="#000" opacity=".55"/>
      <path d="M74 268c-24-54-36-118 0-166 -12-28-8-54 6-72 9 20 20 24 28 20 7-32 26-50 42-50s35 18 42 50c8 4 19 0 28-20 14 18 18 44 6 72 36 48 24 112 0 166-16-14-28-6-36 8-11-16-24-16-34 0-12-16-26-16-38 0-9-12-24-20-44-8Z"
        fill="#281634" stroke="#0c0716" stroke-width="3"/>
      <path d="M88 56 70 12l26 24 20-32 16 32 20-32 16 32 20-24-18 48Z" fill="url(#bone)" stroke="#6a5f48" stroke-width="2"/>
      <circle cx="92" cy="34" r="6" fill="#b3122b"/><circle cx="150" cy="22" r="7" fill="#e8b23a"/><circle cx="208" cy="34" r="6" fill="#b3122b"/>
      <ellipse cx="150" cy="128" rx="60" ry="66" fill="url(#bone)"/>
      <path d="M150 128v50" stroke="#5a5040" stroke-width="3"/>
      <ellipse cx="123" cy="118" rx="17" ry="21" fill="#080406"/>
      <ellipse cx="177" cy="118" rx="17" ry="21" fill="#080406"/>
      <circle cx="123" cy="120" r="8" fill="url(#eye)" filter="url(#glow)"/>
      <circle cx="177" cy="120" r="8" fill="url(#eye)" filter="url(#glow)"/>
      <path d="M104 96 L126 108M196 96 L174 108" stroke="#0c0716" stroke-width="5" stroke-linecap="round"/>
      <path d="M138 158l12 12 12-12" fill="#080406"/>
      <path d="M118 182 L130 198 L142 182 L154 200 L166 182 L178 198 L190 182 V172 H118 Z" fill="#070205"/>
      <path d="M120 174 L132 192 L144 174 L156 194 L168 174 L180 192 L188 176" fill="none" stroke="#efe6d0" stroke-width="4"/>
      <path d="M74 208 40 252M226 208l34 44" stroke="#281634" stroke-width="15" stroke-linecap="round"/>
      <path d="M42 248l-16 24 28-8M258 248l16 24-28-8" fill="url(#bone)"/>`)
  };

  /* ---------------- HAUNTED MANSION (selection screen) ---------------- */
  function mansion() {
    return svg("0 0 520 360", `
      <rect width="520" height="360" fill="#0b0a1c"/>
      <circle cx="410" cy="78" r="46" fill="#cfc9d8" opacity=".22"/>
      <circle cx="396" cy="70" r="46" fill="#0b0a1c"/>
      ${stars()}
      <path d="M0 300 Q120 250 260 296 Q400 252 520 300 V360 H0 Z" fill="#0e0a1e"/>
      <!-- bare trees -->
      <path d="M40 360V250M40 280l-22-20M40 270l20-22M40 300l-18 14" stroke="#06040e" stroke-width="6" fill="none"/>
      <path d="M486 360V240M486 274l24-20M486 260l-22-22" stroke="#06040e" stroke-width="6" fill="none"/>
      <!-- mansion body -->
      <rect x="150" y="150" width="220" height="170" fill="#1a1430" stroke="#070512" stroke-width="2"/>
      <path d="M140 152 260 70 380 152Z" fill="#241a3e" stroke="#070512" stroke-width="2"/>
      <!-- towers -->
      <rect x="110" y="180" width="56" height="140" fill="#171128" stroke="#070512" stroke-width="2"/>
      <path d="M104 182 138 130 172 182Z" fill="#241a3e" stroke="#070512" stroke-width="2"/>
      <rect x="354" y="180" width="56" height="140" fill="#171128" stroke="#070512" stroke-width="2"/>
      <path d="M348 182 382 130 416 182Z" fill="#241a3e" stroke="#070512" stroke-width="2"/>
      <!-- glowing windows -->
      ${win(128, 206)}${win(128, 250)}
      ${win(372, 206)}${win(372, 250)}
      ${win(186, 178)}${win(310, 178)}
      ${win(186, 230)}${win(310, 230)}
      <!-- door -->
      <path d="M236 320v-44a24 24 0 0 1 48 0v44Z" fill="#0b0712" stroke="#3a2a18" stroke-width="2"/>
      <circle cx="276" cy="298" r="3" fill="#e8b23a"/>
      <path d="M260 70l4-16 4 16" fill="#241a3e"/>
      <rect width="520" height="360" fill="url(#mv)"/>
      <radialGradient id="mv" cx="50%" cy="46%" r="72%">
        <stop offset="58%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity=".66"/></radialGradient>`, "none");
  }
  function win(x, y) {
    return `<rect x="${x}" y="${y}" width="22" height="30" rx="2" fill="#f0a83a" opacity=".82" filter="url(#glow)"/>
            <path d="M${x + 11} ${y}v30M${x} ${y + 15}h22" stroke="#1a1024" stroke-width="2"/>`;
  }
  function stars() {
    let s = "";
    for (let i = 0; i < 26; i++) {
      const x = (i * 73 % 520), y = (i * 47 % 150) + 6;
      s += `<circle cx="${x}" cy="${y}" r="${i % 4 === 0 ? 1.6 : 1}" fill="#cfcfe6" opacity="${0.3 + (i % 5) * .12}"/>`;
    }
    return s;
  }

  /* ---------------- ROOMS (lighter than before) ---------------- */
  let IDC = 0;
  // corner cobweb (dir 1 = top-left, -1 = top-right)
  function web(x, dir) {
    const s = dir, g = `M${x} 0`;
    let r = "";
    for (let i = 1; i <= 4; i++) { const d = i * 26; r += `<path d="M${x} ${d} Q ${x + s * d * .55} ${d * .55} ${x + s * d} 0" stroke="#cfc6dd" stroke-width="1" fill="none" opacity=".16"/>`; }
    return `<g>${g}<path d="M${x} 0 L${x + s * 116} 0 M${x} 0 L${x + s * 90} 40 M${x} 0 L${x + s * 56} 78 M${x} 0 L${x + s * 20} 110" stroke="#cfc6dd" stroke-width="1" opacity=".18"/>${r}</g>`;
  }
  function sconce(x, ac) {
    return `<g>
      <rect x="${x - 3}" y="150" width="6" height="34" fill="#1a1320"/>
      <path d="M${x - 9} 150h18l-4 -12h-10Z" fill="#2a2230"/>
      <ellipse cx="${x}" cy="132" rx="7" ry="13" fill="${ac}" opacity=".95" filter="url(#glow)"/>
      <circle cx="${x}" cy="146" r="46" fill="${ac}" opacity=".10"/></g>`;
  }
  function planks(u) {
    let v = "";
    for (let i = 1; i < 9; i++) { const x = i * 89; v += `<path d="M${x} 220 L${380 + (x - 380) * 2.4} 360" stroke="#000" stroke-width="1.4" opacity=".22"/>`; }
    let h = "";
    [232, 252, 278, 312, 352].forEach(y => h += `<path d="M0 ${y} H800" stroke="#000" stroke-width="1.5" opacity=".18"/>`);
    return `<g>${v}${h}<path d="M0 214 H800" stroke="${u}" stroke-width="1" opacity=".12"/></g>`;
  }
  function damask(c) {
    let s = "";
    for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) {
      const x = 50 + i * 88 + (r % 2) * 44, y = 28 + r * 64;
      s += `<path d="M${x} ${y}q10 -12 20 0q-10 14 -20 18q-10 -4 -20 -18q10 -12 20 0" fill="#fff" opacity=".035"/>`;
    }
    return s;
  }
  // indoor mansion scene: pal = {wA,wB,fA,fB,ac, deco}
  function roomBase(props, pal) {
    pal = pal || {};
    const u = "x" + (IDC++);
    const wA = pal.wA || "#322a44", wB = pal.wB || "#181226",
      fA = pal.fA || "#46331f", fB = pal.fB || "#241a12",
      ac = pal.ac || "#f0b53a";
    return svg("0 0 800 360", `
      <defs>
        <linearGradient id="w${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${wA}"/><stop offset="1" stop-color="${wB}"/></linearGradient>
        <linearGradient id="f${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${fA}"/><stop offset="1" stop-color="${fB}"/></linearGradient>
        <radialGradient id="v${u}" cx="50%" cy="40%" r="82%"><stop offset="58%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".5"/></radialGradient>
        <linearGradient id="g${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cdbfe6" stop-opacity="0"/><stop offset="1" stop-color="#cdbfe6" stop-opacity=".09"/></linearGradient>
      </defs>
      <rect width="800" height="360" fill="url(#w${u})"/>
      ${damask(wA)}
      <g>
        <rect x="336" y="36" width="128" height="158" rx="64" fill="#0c1430"/>
        <circle cx="430" cy="84" r="21" fill="#e8e2cc" opacity=".5"/><circle cx="421" cy="78" r="21" fill="#0c1430" opacity=".75"/>
        <rect x="336" y="36" width="128" height="158" rx="64" fill="none" stroke="#5a4c6e" stroke-width="6"/>
        <path d="M400 36v158M336 112h128" stroke="#5a4c6e" stroke-width="3"/>
      </g>
      <path d="M362 194 438 194 566 318 234 318Z" fill="${ac}" opacity=".07"/>
      <rect y="206" width="800" height="3" fill="${ac}" opacity=".14"/>
      <rect y="209" width="800" height="7" fill="#0c0916"/>
      <path d="M0 216 H800 V360 H0 Z" fill="url(#f${u})"/>
      ${planks(ac)}
      ${sconce(108, ac)}${sconce(692, ac)}
      ${props}
      ${web(0, 1)}${web(800, -1)}
      <rect y="250" width="800" height="110" fill="url(#g${u})"/>
      <rect width="800" height="360" fill="url(#v${u})"/>`, "none");
  }
  // a wood bookshelf full of books
  function shelves(x, y) {
    let s = `<rect x="${x - 4}" y="${y - 6}" width="192" height="${6 + 3 * 70}" fill="#1b1108"/>`;
    for (let r = 0; r < 3; r++) {
      const yy = y + r * 70;
      s += `<rect x="${x}" y="${yy}" width="184" height="62" fill="#0f0905"/><rect x="${x}" y="${yy + 60}" width="184" height="4" fill="#2c1d0e"/>`;
      for (let b = 0; b < 11; b++) {
        const c = ["#7a3b54", "#5a6a3a", "#3a567a", "#7a5a32", "#52406a", "#6a3a3a"][(r * 2 + b) % 6];
        const hh = 50 - (b % 3) * 4;
        s += `<rect x="${x + 6 + b * 16}" y="${yy + 60 - hh}" width="13" height="${hh}" fill="${c}"/><rect x="${x + 6 + b * 16}" y="${yy + 60 - hh}" width="13" height="3" fill="#000" opacity=".3"/>`;
      }
    }
    return s;
  }
  function customScene(u, body) {
    return svg("0 0 800 360", `
      <defs><radialGradient id="v${u}" cx="50%" cy="40%" r="82%"><stop offset="58%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".52"/></radialGradient></defs>
      ${body}${web(0, 1)}${web(800, -1)}
      <rect width="800" height="360" fill="url(#v${u})"/>`, "none");
  }
  const ROOM = {
    garden: () => {
      const u = "g" + (IDC++);
      return customScene(u, `
        <defs>
          <linearGradient id="sky${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1640"/><stop offset="1" stop-color="#2a1c44"/></linearGradient>
          <linearGradient id="grd${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f3a26"/><stop offset="1" stop-color="#0e1c12"/></linearGradient>
        </defs>
        <rect width="800" height="360" fill="url(#sky${u})"/>
        ${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 71) % 800}" cy="${(i * 37) % 200}" r="${i % 5 ? .9 : 1.6}" fill="#dcdcf0" opacity="${.25 + (i % 4) * .14}"/>`).join("")}
        <circle cx="620" cy="78" r="40" fill="#e8e2c6" opacity=".55"/><circle cx="606" cy="70" r="40" fill="#1a1640" opacity=".7"/>
        <path d="M0 250q200 -28 400 -8 200 18 400 -6V360H0Z" fill="url(#grd${u})"/>
        <path d="M150 264q120 -22 250 -8" stroke="#0a140d" stroke-width="2" fill="none" opacity=".5"/>
        <g><path d="M90 360V210M90 270l-30 -26M90 240l28 -30M90 300l-26 22" stroke="#0c0a08" stroke-width="7" fill="none" stroke-linecap="round"/>
           <path d="M60 244q-14 -8 -22 -22M118 210q14 -10 18 -26" stroke="#0c0a08" stroke-width="5" fill="none"/></g>
        <rect x="690" y="232" width="70" height="110" rx="6" fill="#23202c"/><path d="M690 232a35 35 0 0 1 70 0Z" fill="#23202c"/>
        <path d="M714 252h22M714 270h22M725 240v52" stroke="#0e0c14" stroke-width="3"/>
        <path d="M340 314h130l-10 -150h-110Z" fill="#1d3322"/><path d="M340 314h130l-10 -150h-110Z" fill="none" stroke="#2c4a33" stroke-width="2"/>
        <ellipse cx="405" cy="160" rx="74" ry="34" fill="#27502f"/>`);
    },
    library: () => roomBase(`
      ${shelves(34, 70)}${shelves(582, 70)}
      <rect x="318" y="250" width="164" height="62" fill="#34230f"/><rect x="312" y="244" width="176" height="10" rx="2" fill="#4a3014"/>
      <rect x="326" y="312" width="12" height="40" fill="#241608"/><rect x="462" y="312" width="12" height="40" fill="#241608"/>
      <rect x="350" y="226" width="44" height="26" fill="#3a567a"/><rect x="350" y="226" width="44" height="5" fill="#000" opacity=".3"/>
      <g><rect x="436" y="232" width="7" height="20" fill="#5a3a18"/><ellipse cx="439.5" cy="226" rx="7" ry="10" fill="${"#f0b53a"}" opacity=".95" filter="url(#glow)"/></g>`,
      { wA: "#3a2c1a", wB: "#1c1208", fA: "#4a3018", fB: "#241608", ac: "#f0b53a" }),
    dining: () => roomBase(`
      <ellipse cx="400" cy="244" rx="172" ry="30" fill="#1f1208"/>
      <rect x="252" y="244" width="296" height="14" fill="#3a2410"/>
      <path d="M260 258 250 320M540 258l10 62M300 256v60M500 256v60" stroke="#28160a" stroke-width="10" stroke-linecap="round"/>
      <rect x="244" y="180" width="60" height="74" rx="4" fill="#2a1a0c"/><rect x="496" y="180" width="60" height="74" rx="4" fill="#2a1a0c"/>
      <g><rect x="392" y="150" width="16" height="84" fill="#2a1a0c"/><path d="M372 150h56l-8 -16h-40Z" fill="#4a3014"/>
         <circle cx="380" cy="142" r="6" fill="#f0b53a" opacity=".95" filter="url(#glow)"/><circle cx="400" cy="136" r="6" fill="#f0b53a" opacity=".95" filter="url(#glow)"/><circle cx="420" cy="142" r="6" fill="#f0b53a" opacity=".95" filter="url(#glow)"/></g>`,
      { wA: "#3a2a22", wB: "#1c130c", fA: "#4a3320", fB: "#241710", ac: "#f0b53a" }),
    bedroom: () => roomBase(`
      <rect x="96" y="244" width="300" height="70" rx="6" fill="#3a2a52"/>
      <rect x="96" y="180" width="46" height="134" fill="#241634"/>
      <path d="M150 244q90 -22 220 0V258H150Z" fill="#52406e"/>
      <ellipse cx="186" cy="244" rx="34" ry="12" fill="#cdbfe6" opacity=".5"/>
      <rect x="420" y="262" width="70" height="52" fill="#241634"/><rect x="428" y="270" width="54" height="18" fill="#3a2a52"/>
      <rect x="500" y="150" width="180" height="164" fill="#1d1430"/><rect x="514" y="164" width="152" height="92" fill="#0c1430"/>
      <circle cx="566" cy="196" r="15" fill="#e8e2cc" opacity=".4"/>`,
      { wA: "#332953", wB: "#170f28", fA: "#3a2c4e", fB: "#1d1430", ac: "#cdbfe6" }),
    kitchen: () => roomBase(`
      <rect x="60" y="244" width="300" height="70" fill="#2c2c32"/><rect x="60" y="238" width="300" height="8" fill="#42424a"/>
      <rect x="90" y="250" width="70" height="58" fill="#16161a"/><rect x="250" y="250" width="70" height="58" fill="#16161a"/>
      <rect x="470" y="200" width="240" height="114" fill="#26262c"/><rect x="486" y="216" width="92" height="84" fill="#0e0e12"/>
      <circle cx="532" cy="252" r="16" fill="#e2402a" opacity=".7" filter="url(#glow)"/>
      <path d="M610 150v52M590 202h40l-6 30h-28Z" fill="#3a3a42"/>
      <path d="M520 150h60M524 150l6 26M576 150l-6 26M540 150v22M560 150v22" stroke="#52525a" stroke-width="3"/>`,
      { wA: "#2e2e36", wB: "#141418", fA: "#3a3a40", fB: "#1c1c20", ac: "#9fb4c8" }),
    bathroom: () => roomBase(`
      <rect x="96" y="244" width="190" height="70" rx="34" fill="#33414e"/><ellipse cx="191" cy="248" rx="95" ry="18" fill="#1a2630"/>
      <path d="M104 244q0 -28 22 -28" stroke="#52606e" stroke-width="6" fill="none"/>
      <rect x="520" y="180" width="140" height="134" fill="#2a3640"/><rect x="536" y="196" width="108" height="78" rx="3" fill="#10181e"/>
      <path d="M548 210 590 280M620 200 600 274" stroke="#3a4a56" stroke-width="2" opacity=".5"/>
      <rect x="700" y="250" width="40" height="64" fill="#28323c"/>`,
      { wA: "#2c3a44", wB: "#141d24", fA: "#33414c", fB: "#1a242c", ac: "#8fb0c4" }),
    living: () => roomBase(`
      <rect x="90" y="252" width="280" height="62" rx="12" fill="#46283e"/><rect x="90" y="214" width="280" height="46" rx="10" fill="#52304a"/>
      <rect x="80" y="248" width="26" height="66" rx="8" fill="#3a2030"/><rect x="354" y="248" width="26" height="66" rx="8" fill="#3a2030"/>
      <rect x="150" y="232" width="60" height="30" rx="6" fill="#5e3a54"/><rect x="250" y="232" width="60" height="30" rx="6" fill="#5e3a54"/>
      <rect x="486" y="208" width="220" height="106" fill="#1f141f"/><rect x="500" y="222" width="192" height="78" fill="#120b12"/>
      <path d="M520 300q76 -70 152 0Z" fill="#e2402a" opacity=".5" filter="url(#glow)"/>
      <rect x="556" y="118" width="80" height="60" fill="#0d0a14"/><rect x="556" y="118" width="80" height="60" fill="none" stroke="#5a3a18" stroke-width="5"/>`,
      { wA: "#3a2436", wB: "#1c111c", fA: "#42283a", fB: "#1f141f", ac: "#f0a85a" }),
    master_bedroom: () => roomBase(`
      <rect x="120" y="236" width="320" height="78" rx="6" fill="#3a2c54"/>
      <rect x="120" y="120" width="20" height="194" fill="#1f1636"/><rect x="420" y="120" width="20" height="194" fill="#1f1636"/>
      <path d="M110 120h340l-26 -38H136Z" fill="#52406e"/><path d="M120 130q160 30 320 0v22q-160 26 -320 0Z" fill="#241a3c" opacity=".7"/>
      <path d="M150 236q130 -26 260 0V252H150Z" fill="#5a4878"/>
      <ellipse cx="196" cy="236" rx="38" ry="13" fill="#cdbfe6" opacity=".5"/>
      <rect x="556" y="150" width="170" height="164" fill="#1d1430"/><circle cx="641" cy="196" r="15" fill="#e8e2cc" opacity=".4"/>`,
      { wA: "#352a55", wB: "#170f2a", fA: "#3a2c52", fB: "#1d1432", ac: "#d8b86a" }),
    laundry: () => roomBase(`
      <!-- Two front-loader washing machines -->
      <rect x="44" y="178" width="116" height="128" rx="6" fill="#52525e"/>
      <rect x="44" y="178" width="116" height="22" fill="#3e3e48"/>
      <rect x="56" y="184" width="14" height="10" rx="2" fill="#161618"/>
      <rect x="76" y="184" width="14" height="10" rx="2" fill="#161618"/>
      <circle cx="96" cy="190" r="3" fill="#bce4ff"/>
      <circle cx="102" cy="248" r="36" fill="#16161c" stroke="#5a5a66" stroke-width="3"/>
      <circle cx="102" cy="248" r="28" fill="#bce4ff" opacity=".25"/>
      <circle cx="102" cy="248" r="20" fill="#0e1c1f"/>
      <circle cx="102" cy="248" r="20" fill="none" stroke="#fff" stroke-width="1" opacity=".4"/>
      <rect x="172" y="178" width="116" height="128" rx="6" fill="#52525e"/>
      <rect x="172" y="178" width="116" height="22" fill="#3e3e48"/>
      <rect x="184" y="184" width="14" height="10" rx="2" fill="#161618"/>
      <rect x="204" y="184" width="14" height="10" rx="2" fill="#161618"/>
      <circle cx="224" cy="190" r="3" fill="#bce4ff"/>
      <circle cx="230" cy="248" r="36" fill="#16161c" stroke="#5a5a66" stroke-width="3"/>
      <circle cx="230" cy="248" r="28" fill="#bce4ff" opacity=".25"/>
      <circle cx="230" cy="248" r="20" fill="#0e1c1f"/>
      <!-- Clothesline with hanging clothes -->
      <path d="M380 130 L740 138" stroke="#8a8068" stroke-width="2"/>
      <rect x="396" y="138" width="38" height="58" rx="2" fill="#c43a44"/>
      <path d="M396 138 L408 130 L420 138 L432 130 L434 138" stroke="#8a8068" stroke-width="1.5" fill="none"/>
      <rect x="448" y="142" width="40" height="62" rx="2" fill="#3a567a"/>
      <rect x="502" y="146" width="40" height="60" rx="2" fill="#5a6a3a"/>
      <rect x="556" y="148" width="38" height="64" rx="2" fill="#7a5a32"/>
      <rect x="608" y="150" width="40" height="62" rx="2" fill="#52406a"/>
      <rect x="662" y="152" width="38" height="58" rx="2" fill="#3a5a4a"/>
      <!-- Floating soap bubbles -->
      <circle cx="140" cy="100" r="10" fill="#bce4ff" opacity=".55"/>
      <circle cx="200" cy="86" r="7" fill="#bce4ff" opacity=".55"/>
      <circle cx="240" cy="120" r="6" fill="#bce4ff" opacity=".45"/>
      <circle cx="320" cy="90" r="9" fill="#bce4ff" opacity=".5"/>`,
      { wA: "#2a3a3e", wB: "#121e22", fA: "#3a4a4e", fB: "#1a2628", ac: "#7dd0ff" }),
    ballroom: () => roomBase(`
      <!-- Chandelier -->
      <path d="M400 30 V70" stroke="#3a2a14" stroke-width="3"/>
      <ellipse cx="400" cy="80" rx="68" ry="12" fill="#3a2a14"/>
      <ellipse cx="400" cy="80" rx="68" ry="12" fill="none" stroke="#f0b53a" stroke-width="2"/>
      <circle cx="360" cy="84" r="6" fill="#f0b53a" filter="url(#glow)"/>
      <circle cx="380" cy="88" r="6" fill="#f0b53a" filter="url(#glow)"/>
      <circle cx="400" cy="86" r="7" fill="#f0b53a" filter="url(#glow)"/>
      <circle cx="420" cy="88" r="6" fill="#f0b53a" filter="url(#glow)"/>
      <circle cx="440" cy="84" r="6" fill="#f0b53a" filter="url(#glow)"/>
      <path d="M340 90 L344 110 M360 92 L362 116 M400 94 L400 124 M438 92 L436 116 M460 90 L456 110" stroke="#f0b53a" stroke-width="1.5" opacity=".7"/>
      <!-- Velvet red curtains -->
      <path d="M0 60 L70 80 V310 L40 290 L20 310 L0 290 Z" fill="#7a1f28"/>
      <path d="M0 60 V310" stroke="#3a0a14" stroke-width="2" opacity=".6"/>
      <path d="M800 60 L730 80 V310 L760 290 L780 310 L800 290 Z" fill="#7a1f28"/>
      <path d="M800 60 V310" stroke="#3a0a14" stroke-width="2" opacity=".6"/>
      <!-- Tall columns -->
      <rect x="150" y="100" width="22" height="200" fill="#d8d2c0"/>
      <rect x="148" y="100" width="26" height="10" fill="#b8b2a0"/>
      <rect x="148" y="296" width="26" height="10" fill="#b8b2a0"/>
      <rect x="628" y="100" width="22" height="200" fill="#d8d2c0"/>
      <rect x="626" y="100" width="26" height="10" fill="#b8b2a0"/>
      <rect x="626" y="296" width="26" height="10" fill="#b8b2a0"/>
      <!-- Grand staircase center back -->
      <path d="M330 220 L470 220 L490 240 L310 240 Z" fill="#3a1a28"/>
      <path d="M320 240 L480 240 L500 260 L300 260 Z" fill="#4a2a38"/>
      <path d="M310 260 L490 260 L510 280 L290 280 Z" fill="#3a1a28"/>
      <!-- Two small wall sconces with flames -->
      <ellipse cx="210" cy="160" rx="6" ry="11" fill="#f0b53a" filter="url(#glow)"/>
      <ellipse cx="590" cy="160" rx="6" ry="11" fill="#f0b53a" filter="url(#glow)"/>`,
      { wA: "#3a1f2e", wB: "#1c0e1a", fA: "#52323a", fB: "#241620", ac: "#f0b53a" }),
    study: () => roomBase(`
      ${shelves(28, 86)}
      <ellipse cx="430" cy="248" rx="160" ry="28" fill="#1f1208"/><rect x="290" y="246" width="280" height="14" fill="#3a2410"/>
      <path d="M310 260v58M548 260v58" stroke="#28160a" stroke-width="10" stroke-linecap="round"/>
      <rect x="360" y="222" width="60" height="26" fill="#3a567a"/><rect x="448" y="232" width="70" height="16" fill="#5a3a18"/>
      <g><rect x="332" y="220" width="7" height="22" fill="#5a3a18"/><ellipse cx="335.5" cy="214" rx="7" ry="10" fill="#f0b53a" opacity=".95" filter="url(#glow)"/></g>`,
      { wA: "#3a2c1c", wB: "#1c1208", fA: "#4a3018", fB: "#241608", ac: "#f0b53a" }),
    gym: () => roomBase(`
      <rect x="120" y="284" width="240" height="14" rx="7" fill="#4a4a52"/>
      <circle cx="120" cy="291" r="30" fill="#1c1c22"/><circle cx="360" cy="291" r="30" fill="#1c1c22"/><circle cx="120" cy="291" r="14" fill="#2c2c34"/><circle cx="360" cy="291" r="14" fill="#2c2c34"/>
      <rect x="470" y="244" width="160" height="14" rx="7" fill="#4a4a52"/><circle cx="470" cy="251" r="22" fill="#1c1c22"/><circle cx="630" cy="251" r="22" fill="#1c1c22"/>
      <rect x="540" y="270" width="150" height="44" rx="6" fill="#2a2a32"/><rect x="556" y="258" width="6" height="56" fill="#3a3a42"/><rect x="668" y="258" width="6" height="56" fill="#3a3a42"/>
      <rect x="690" y="150" width="70" height="164" fill="#26262c"/><rect x="700" y="166" width="50" height="18" fill="#16161a"/><rect x="700" y="196" width="50" height="18" fill="#16161a"/>`,
      { wA: "#2e2e38", wB: "#15151a", fA: "#3a3a42", fB: "#1c1c22", ac: "#9fb4c8" }),
    store: () => roomBase(`
      ${shelves(28, 70)}${shelves(588, 70)}
      <rect x="250" y="252" width="300" height="62" fill="#34230f"/><rect x="244" y="246" width="312" height="10" rx="2" fill="#4a3014"/>
      <text x="400" y="120" font-size="40" fill="${"#f0b53a"}" text-anchor="middle" font-family="Georgia" opacity=".9" filter="url(#glow)">SHOP</text>
      <path d="M300 132h200" stroke="#5a3a18" stroke-width="3"/>
      <g><rect x="356" y="226" width="7" height="26" fill="#5a3a18"/><ellipse cx="359.5" cy="220" rx="7" ry="11" fill="#f0b53a" opacity=".95" filter="url(#glow)"/></g>
      <g><rect x="438" y="226" width="7" height="26" fill="#5a3a18"/><ellipse cx="441.5" cy="220" rx="7" ry="11" fill="#f0b53a" opacity=".95" filter="url(#glow)"/></g>`,
      { wA: "#3a2c1a", wB: "#1c1208", fA: "#4a3018", fB: "#241608", ac: "#f0b53a" }),
    basement: () => {
      const u = "b" + (IDC++);
      return customScene(u, `
        <defs><linearGradient id="st${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241620"/><stop offset="1" stop-color="#0e0810"/></linearGradient></defs>
        <rect width="800" height="360" fill="url(#st${u})"/>
        ${Array.from({ length: 7 }, (_, r) => Array.from({ length: 11 }, (_, c) => `<rect x="${c * 76 + (r % 2 ? 38 : 0) - 38}" y="${r * 34}" width="72" height="30" fill="none" stroke="#0a0610" stroke-width="2" opacity=".6"/>`).join("")).join("")}
        <path d="M120 360V150a40 40 0 0 1 80 0V360M600 360V150a40 40 0 0 1 80 0V360" fill="#170d14" opacity=".7"/>
        <rect y="296" width="800" height="64" fill="#0e0810"/>
        <path d="M0 300q400 -34 800 0" stroke="#000" stroke-width="2" opacity=".4" fill="none"/>
        <g><rect x="392" y="40" width="8" height="40" fill="#1a0e14"/><circle cx="396" cy="92" r="15" fill="#e2402a" opacity=".85" filter="url(#glow)"/><circle cx="396" cy="92" r="48" fill="#e2402a" opacity=".10"/></g>
        <path d="M150 60v34l-10 8M150 60v34l10 8M650 60v34l-10 8M650 60v34l10 8" stroke="#3a1a22" stroke-width="3" fill="none" opacity=".7"/>
        <path d="M120 150q40 36 0 70M680 150q-40 36 0 70" stroke="#3a1a22" stroke-width="3" fill="none" opacity=".5"/>`);
    }
  };

  /* ---------------- PLAYER: young boy (8–10) ---------------- */
  function player(weapon) {
    // a hand-held TORCH LIGHT (flashlight) casting a bright beam
    const torch = `
      <g transform="rotate(14 138 150)">
        <path d="M150 142 L220 110 L220 178 Z" fill="#fff3c0" opacity=".5"/>
        <path d="M150 142 L210 122 L210 166 Z" fill="#ffe98a" opacity=".75"/>
        <rect x="124" y="138" width="30" height="16" rx="3" fill="#2a3550"/>
        <rect x="150" y="135" width="12" height="22" rx="2" fill="#3a4868"/>
        <ellipse cx="160" cy="146" rx="5" ry="11" fill="#fff7d0" filter="url(#glow)"/>
        <rect x="118" y="141" width="10" height="10" rx="2" fill="#1c2438"/>
      </g>`;
    const sling = `
      <g transform="rotate(8 140 150)">
        <path d="M120 150 140 126 160 150" stroke="#7a5a2a" stroke-width="6" fill="none"/>
        <circle cx="140" cy="158" r="7" fill="#9a9a9a" stroke="#5a5a5a" stroke-width="2"/>
      </g>`;
    // small kid: big head, short body, t-shirt + shorts, sneakers
    return svg("0 0 200 250", `
      <ellipse cx="92" cy="244" rx="44" ry="10" fill="#000" opacity=".45"/>
      <!-- legs -->
      <rect x="74" y="188" width="15" height="44" rx="6" fill="#2c3550"/>
      <rect x="96" y="188" width="15" height="44" rx="6" fill="#2c3550"/>
      <ellipse cx="80" cy="236" rx="14" ry="8" fill="#e8e8ee"/>
      <ellipse cx="104" cy="236" rx="14" ry="8" fill="#e8e8ee"/>
      <!-- torso (t-shirt) -->
      <path d="M68 142q24 -14 48 0l6 50q-30 12 -60 0Z" fill="#c43a44"/>
      <path d="M92 132v62" stroke="#a32a34" stroke-width="2" opacity=".6"/>
      <!-- arms -->
      <path d="M70 150 50 188" stroke="#d9b08a" stroke-width="11" stroke-linecap="round"/>
      <path d="M114 150 140 150" stroke="#d9b08a" stroke-width="11" stroke-linecap="round"/>
      <!-- head -->
      <ellipse cx="92" cy="104" rx="30" ry="31" fill="#e8c19a"/>
      <path d="M62 100q4 -40 30 -40 26 0 30 40 -6 -20 -30 -20 -24 0 -30 20Z" fill="#3a2415"/>
      <path d="M64 96q10 -10 22 -6M120 96q-10 -10 -22 -6" fill="none" stroke="#3a2415" stroke-width="3"/>
      <circle cx="83" cy="106" r="3.6" fill="#241a10"/>
      <circle cx="101" cy="106" r="3.6" fill="#241a10"/>
      <circle cx="84" cy="105" r="1.2" fill="#fff"/><circle cx="102" cy="105" r="1.2" fill="#fff"/>
      <path d="M85 120q7 5 14 0" stroke="#9a6a48" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <ellipse cx="74" cy="116" rx="5" ry="3" fill="#e88a8a" opacity=".5"/>
      <ellipse cx="110" cy="116" rx="5" ry="3" fill="#e88a8a" opacity=".5"/>
      ${weapon === "sling" ? sling : torch}`);
  }

  const heart = (empty) =>
    `<svg class="heart ${empty ? "empty" : ""}" viewBox="0 0 24 24"><path d="M12 21S3 14.5 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 14.5 12 21 12 21Z" fill="#e11d36" stroke="#7a0d1c" stroke-width="1.4"/></svg>`;

  /* ---------------- GYM POSE: kid + barbell as a single integrated SVG ---------------- */
  // The barbell is a <g id="bbell"> sub-group so CSS animations can target it
  // independently (pulse / wobble / crash) without re-rendering.
  const RING_BY_W = ["#5a5a66", "#1f5588", "#1f5588", "#1f7a3a", "#1f7a3a", "#c89a30", "#c89a30", "#c84a30", "#c83a30", "#b3122b", "#f0b53a"];

  function gymPose(weight, stage) {
    weight = Math.max(0, Math.min(10, weight));

    if (stage === "flex") return _flexPose();
    if (stage === "fall") return _fallPose();

    // default: 'lift' — power stance, arms overhead, gripping the barbell
    const ps = 18 + weight * 4;                            // plate radius 18..58
    const ring = RING_BY_W[weight] || "#5a5a66";

    return svg("0 0 240 340", `
      <ellipse cx="120" cy="322" rx="68" ry="10" fill="#000" opacity=".5"/>

      <!-- Legs (slight squat stance) -->
      <path d="M92 248 L78 308" stroke="#2c3550" stroke-width="26" stroke-linecap="round"/>
      <path d="M148 248 L162 308" stroke="#2c3550" stroke-width="26" stroke-linecap="round"/>
      <ellipse cx="74" cy="314" rx="20" ry="7" fill="#e8e8ee"/>
      <path d="M62 314h24" stroke="#e2484d" stroke-width="2"/>
      <ellipse cx="166" cy="314" rx="20" ry="7" fill="#e8e8ee"/>
      <path d="M154 314h24" stroke="#e2484d" stroke-width="2"/>

      <!-- Torso (athletic tank top) -->
      <path d="M78 192 Q120 178 162 192 L168 252 Q120 264 72 252 Z" fill="#c43a44"/>
      <path d="M93 188 L105 168 M147 188 L135 168" stroke="#a32a34" stroke-width="6"/>
      <path d="M120 194 L120 252" stroke="#8a1f28" stroke-width="2" opacity=".5"/>
      <ellipse cx="100" cy="226" rx="6" ry="4" fill="#e2484d" opacity=".4"/>
      <ellipse cx="140" cy="226" rx="6" ry="4" fill="#e2484d" opacity=".4"/>

      <!-- Arms (raised overhead, curved) -->
      <path d="M85 188 Q66 138 78 80" stroke="#d9b08a" stroke-width="24" fill="none" stroke-linecap="round"/>
      <path d="M155 188 Q174 138 162 80" stroke="#d9b08a" stroke-width="24" fill="none" stroke-linecap="round"/>
      <!-- Bicep highlights -->
      <ellipse cx="68" cy="130" rx="13" ry="20" fill="#e8c19a" transform="rotate(-12 68 130)"/>
      <ellipse cx="172" cy="130" rx="13" ry="20" fill="#e8c19a" transform="rotate(12 172 130)"/>
      <path d="M76 112 Q70 134 76 154" stroke="#9a6a48" stroke-width="1.5" fill="none" opacity=".5"/>
      <path d="M164 112 Q170 134 164 154" stroke="#9a6a48" stroke-width="1.5" fill="none" opacity=".5"/>

      <!-- Fists gripping the bar -->
      <circle cx="78" cy="78" r="14" fill="#d9b08a"/>
      <circle cx="162" cy="78" r="14" fill="#d9b08a"/>
      <path d="M70 76 L86 76 M73 84 L83 84" stroke="#9a6a48" stroke-width="2.4"/>
      <path d="M154 76 L170 76 M157 84 L167 84" stroke="#9a6a48" stroke-width="2.4"/>

      <!-- Head (between arms) -->
      <ellipse cx="120" cy="160" rx="32" ry="34" fill="#e8c19a"/>
      <path d="M90 154q4 -36 30 -36 26 0 30 36 -6 -18 -30 -18 -24 0 -30 18Z" fill="#3a2415"/>
      <!-- Headband -->
      <rect x="88" y="146" width="64" height="11" rx="3" fill="#e2484d"/>
      <path d="M88 152 L152 152" stroke="#a32a34" stroke-width="1.5"/>
      <!-- Squinting eyes (focused effort) -->
      <path d="M105 162 L115 164" stroke="#241a10" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M125 164 L135 162" stroke="#241a10" stroke-width="3.4" stroke-linecap="round"/>
      <!-- Gritted teeth -->
      <rect x="108" y="180" width="24" height="7" rx="2" fill="#1a1208"/>
      <path d="M111 183 L129 183 M114 180 L114 187 M118 180 L118 187 M122 180 L122 187 M126 180 L126 187" stroke="#fff" stroke-width="1.4"/>

      <!-- Sweat drops -->
      <ellipse cx="86" cy="145" rx="3" ry="5" fill="#7dd0ff" opacity=".85"/>
      <ellipse cx="154" cy="148" rx="3" ry="5" fill="#7dd0ff" opacity=".85"/>
      <ellipse cx="100" cy="172" rx="2.4" ry="4" fill="#7dd0ff" opacity=".7"/>

      <!-- Effort lines around the lifter -->
      <path d="M50 90 L36 78 M190 90 L204 78 M32 130 L18 130 M208 130 L222 130" stroke="#e2484d" stroke-width="2.6" stroke-linecap="round" opacity=".65"/>

      <!-- BARBELL (animatable sub-group) -->
      <g id="bbell" style="transform-origin:120px 78px">
        <!-- Bar (with sleeve highlights) -->
        <rect x="-10" y="72" width="260" height="12" rx="3" fill="#3a3a44"/>
        <rect x="-10" y="72" width="260" height="3" fill="#7a7a86"/>
        <rect x="-10" y="81" width="260" height="3" fill="#1a1a22"/>
        <!-- Collars (just inside the fists) -->
        <rect x="88" y="66" width="12" height="24" rx="1.5" fill="#6a6a78"/>
        <rect x="140" y="66" width="12" height="24" rx="1.5" fill="#6a6a78"/>
        <!-- LEFT plate -->
        <circle cx="50" cy="78" r="${ps}" fill="#1a1a22" stroke="${ring}" stroke-width="5"/>
        <circle cx="50" cy="78" r="${ps * 0.42}" fill="#3a3a44"/>
        <circle cx="50" cy="78" r="${Math.max(3, ps * 0.18)}" fill="#0a0a10"/>
        <path d="M50 ${78 - ps + 7} L50 ${78 + ps - 7} M${50 - ps + 7} 78 L${50 + ps - 7} 78" stroke="${ring}" stroke-width="1.6" opacity=".55"/>
        <!-- RIGHT plate -->
        <circle cx="190" cy="78" r="${ps}" fill="#1a1a22" stroke="${ring}" stroke-width="5"/>
        <circle cx="190" cy="78" r="${ps * 0.42}" fill="#3a3a44"/>
        <circle cx="190" cy="78" r="${Math.max(3, ps * 0.18)}" fill="#0a0a10"/>
        <path d="M190 ${78 - ps + 7} L190 ${78 + ps - 7} M${190 - ps + 7} 78 L${190 + ps - 7} 78" stroke="${ring}" stroke-width="1.6" opacity=".55"/>
        <!-- Weight label above the bar -->
        <text x="120" y="56" text-anchor="middle" fill="#f0b53a" font-family="Georgia" font-size="20" font-weight="800">${weight * 10} kg</text>
      </g>
    `);
  }

  function _flexPose() {
    return svg("0 0 240 340", `
      <ellipse cx="120" cy="322" rx="74" ry="11" fill="#000" opacity=".55"/>
      <circle cx="120" cy="170" r="130" fill="#f0b53a" opacity=".10"/>
      <circle cx="120" cy="170" r="88" fill="#f0b53a" opacity=".08"/>

      <!-- Legs (confident stance) -->
      <path d="M92 252 L82 308" stroke="#2c3550" stroke-width="26" stroke-linecap="round"/>
      <path d="M148 252 L158 308" stroke="#2c3550" stroke-width="26" stroke-linecap="round"/>
      <ellipse cx="78" cy="314" rx="20" ry="7" fill="#e8e8ee"/>
      <ellipse cx="162" cy="314" rx="20" ry="7" fill="#e8e8ee"/>

      <!-- Wider torso (puffed chest) -->
      <path d="M70 188 Q120 174 170 188 L172 252 Q120 268 68 252 Z" fill="#c43a44"/>
      <path d="M90 188 L100 168 M150 188 L140 168" stroke="#a32a34" stroke-width="6"/>
      <path d="M120 192 L120 254" stroke="#8a1f28" stroke-width="2" opacity=".5"/>

      <!-- Curled arms, HUGE biceps -->
      <path d="M78 190 Q30 168 22 110 Q42 78 92 116" stroke="#d9b08a" stroke-width="22" fill="none" stroke-linecap="round"/>
      <path d="M162 190 Q210 168 218 110 Q198 78 148 116" stroke="#d9b08a" stroke-width="22" fill="none" stroke-linecap="round"/>
      <!-- Bicep bulges (oversized) -->
      <ellipse cx="40" cy="128" rx="24" ry="34" fill="#e8c19a" transform="rotate(-14 40 128)"/>
      <ellipse cx="200" cy="128" rx="24" ry="34" fill="#e8c19a" transform="rotate(14 200 128)"/>
      <path d="M28 115 Q38 138 32 158" stroke="#9a6a48" stroke-width="2" fill="none" opacity=".5"/>
      <path d="M212 115 Q202 138 208 158" stroke="#9a6a48" stroke-width="2" fill="none" opacity=".5"/>

      <!-- Fists -->
      <circle cx="90" cy="114" r="13" fill="#d9b08a"/>
      <circle cx="150" cy="114" r="13" fill="#d9b08a"/>

      <!-- Head -->
      <ellipse cx="120" cy="158" rx="32" ry="34" fill="#e8c19a"/>
      <path d="M90 152q4 -36 30 -36 26 0 30 36 -6 -18 -30 -18 -24 0 -30 18Z" fill="#3a2415"/>
      <rect x="88" y="144" width="64" height="11" rx="3" fill="#e2484d"/>
      <!-- Happy eyes ^^ -->
      <path d="M104 162 q5 -6 10 0" stroke="#241a10" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M126 162 q5 -6 10 0" stroke="#241a10" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Big victory smile -->
      <path d="M102 176 Q120 196 138 176 Q120 188 102 176 Z" fill="#fff" stroke="#241a10" stroke-width="2.2"/>
      <path d="M108 180 L132 180" stroke="#241a10" stroke-width="1.5" opacity=".4"/>

      <!-- Victory stars -->
      <g fill="#f0b53a">
        <path d="M28 60 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z" opacity=".95"/>
        <path d="M212 60 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z" opacity=".95"/>
        <path d="M18 220 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" opacity=".8"/>
        <path d="M222 220 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" opacity=".8"/>
      </g>
    `);
  }

  function _fallPose() {
    return svg("0 0 280 220", `
      <ellipse cx="140" cy="200" rx="124" ry="10" fill="#000" opacity=".55"/>
      <line x1="0" y1="190" x2="280" y2="190" stroke="#444" opacity=".25"/>

      <!-- Kid lying flat, head left -->
      <g>
        <!-- Legs -->
        <path d="M180 156 L240 144" stroke="#2c3550" stroke-width="22" stroke-linecap="round"/>
        <path d="M180 168 L240 178" stroke="#2c3550" stroke-width="22" stroke-linecap="round"/>
        <ellipse cx="244" cy="142" rx="14" ry="6" fill="#e8e8ee"/>
        <ellipse cx="244" cy="180" rx="14" ry="6" fill="#e8e8ee"/>
        <!-- Torso (sideways oval) -->
        <ellipse cx="130" cy="162" rx="56" ry="22" fill="#c43a44"/>
        <path d="M76 162 L184 162" stroke="#a32a34" stroke-width="1.5" opacity=".4"/>
        <!-- Arms limp -->
        <path d="M86 158 Q60 184 52 192" stroke="#d9b08a" stroke-width="20" stroke-linecap="round" fill="none"/>
        <path d="M86 168 Q60 148 54 132" stroke="#d9b08a" stroke-width="20" stroke-linecap="round" fill="none"/>
        <!-- Head -->
        <ellipse cx="64" cy="158" rx="30" ry="28" fill="#e8c19a"/>
        <path d="M34 160q-2 -32 26 -32 28 0 30 32 -8 -18 -30 -18 -22 0 -26 18Z" fill="#3a2415"/>
        <rect x="36" y="154" width="58" height="9" rx="3" fill="#e2484d"/>
        <!-- Bump on the head -->
        <ellipse cx="50" cy="138" rx="10" ry="6" fill="#d8a070"/>
        <path d="M44 132 L48 128 M52 130 L56 127" stroke="#a36a40" stroke-width="1.4"/>
        <!-- X-eyes -->
        <path d="M52 162 L60 170 M52 170 L60 162" stroke="#241a10" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M70 162 L78 170 M70 170 L78 162" stroke="#241a10" stroke-width="2.6" stroke-linecap="round"/>
        <!-- Dazed mouth -->
        <ellipse cx="64" cy="178" rx="7" ry="3" fill="#1a1208"/>
      </g>

      <!-- Barbell crashed on top -->
      <g transform="translate(140 96) rotate(-8)">
        <rect x="-110" y="-7" width="220" height="14" rx="4" fill="#3a3a44"/>
        <rect x="-110" y="-7" width="220" height="3" fill="#7a7a86"/>
        <circle cx="-104" cy="0" r="42" fill="#1a1a22" stroke="#b3122b" stroke-width="6"/>
        <circle cx="-104" cy="0" r="18" fill="#3a3a44"/>
        <circle cx="-104" cy="0" r="6" fill="#0a0a10"/>
        <circle cx="104" cy="0" r="42" fill="#1a1a22" stroke="#b3122b" stroke-width="6"/>
        <circle cx="104" cy="0" r="18" fill="#3a3a44"/>
        <circle cx="104" cy="0" r="6" fill="#0a0a10"/>
        <text x="0" y="-50" text-anchor="middle" fill="#e2484d" font-family="Georgia" font-size="22" font-weight="800">CRASH!</text>
      </g>

      <!-- Impact stars -->
      <g fill="#e2484d" opacity=".85">
        <path d="M30 50 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z"/>
        <path d="M250 50 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z"/>
        <path d="M20 130 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" opacity=".7"/>
      </g>
    `);
  }

  /* ---------------- STUDY POSE: kid reading at a desk with a stack of books ---------------- */
  const BOOK_COLORS = ["#7a3b54", "#5a6a3a", "#3a567a", "#7a5a32", "#52406a", "#6a3a3a", "#a05a3a", "#3a5a4a", "#3a6a7a", "#5a3a7a"];

  function _bookStackSVG(books, ox, oy) {
    if (books === 0) return "";
    let s = "";
    for (let i = 0; i < books; i++) {
      const y = oy - i * 11;
      const w = 72 - (i % 3) * 6;
      const x = ox + (i % 3) * 3;
      const c = BOOK_COLORS[i % BOOK_COLORS.length];
      s += `<rect x="${x}" y="${y - 10}" width="${w}" height="10" rx="1.5" fill="${c}"/>`;
      s += `<rect x="${x}" y="${y - 10}" width="${w}" height="3" fill="#000" opacity=".22"/>`;
      s += `<rect x="${x + 5}" y="${y - 8}" width="3" height="6" fill="#fff" opacity=".30"/>`;
    }
    return s;
  }

  function studyPose(books, stage) {
    books = Math.max(0, Math.min(10, books));
    if (stage === "jump") return _studyJump(books);
    if (stage === "fall") return _studyFall();
    if (stage === "sleep") return _studyRead(books, true);
    return _studyRead(books, false);
  }

  function _studyRead(books, sleep) {
    const headTilt = sleep ? "rotate(22 174 162)" : "";
    return svg("0 0 320 280", `
      <ellipse cx="160" cy="276" rx="120" ry="6" fill="#000" opacity=".45"/>

      <!-- DESK -->
      <rect x="30" y="188" width="260" height="16" rx="3" fill="#3a2410"/>
      <rect x="30" y="188" width="260" height="4" fill="#5a3818"/>
      <rect x="30" y="204" width="260" height="78" fill="#28160a"/>
      <rect x="42" y="204" width="9" height="78" fill="#1a0e06"/>
      <rect x="269" y="204" width="9" height="78" fill="#1a0e06"/>

      <!-- BOOK STACK (animatable) -->
      <g id="bstack">${_bookStackSVG(books, 50, 188)}</g>

      <!-- Open book in front of the kid -->
      <g transform="translate(190 178)">
        <path d="M-46 0 Q-22 -5 0 -3 Q22 -5 46 0 L46 10 Q22 7 0 10 Q-22 7 -46 10 Z" fill="#f3ead4" stroke="#8a7860" stroke-width="1.2"/>
        <path d="M0 -3 L0 10" stroke="#8a7860" stroke-width="1"/>
        <path d="M-38 2 L-10 2 M-38 5 L-10 5 M-38 8 L-14 8 M10 2 L38 2 M10 5 L38 5 M10 8 L34 8" stroke="#9a8a70" stroke-width="0.7"/>
      </g>

      <!-- Arms reaching to the book -->
      <path d="M148 178 Q165 170 180 175" stroke="#d9b08a" stroke-width="13" stroke-linecap="round" fill="none"/>
      <path d="M232 178 Q215 170 200 175" stroke="#d9b08a" stroke-width="13" stroke-linecap="round" fill="none"/>

      <!-- Shoulders / chest peeking over desk -->
      <path d="M132 172 Q190 156 248 172 L252 186 L128 186 Z" fill="#c43a44"/>
      <path d="M148 168 L160 150 M232 168 L220 150" stroke="#a32a34" stroke-width="5"/>

      <!-- HEAD (drooped onto book if sleeping) -->
      <g ${headTilt ? `transform="${headTilt}"` : ""}>
        <ellipse cx="190" cy="138" rx="30" ry="32" fill="#e8c19a"/>
        <path d="M160 134q4 -34 30 -34 26 0 30 34 -6 -16 -30 -16 -24 0 -30 16Z" fill="#3a2415"/>

        ${sleep ? `
          <!-- closed snoozing eyes -->
          <path d="M174 144 q5 -3 10 0" stroke="#241a10" stroke-width="2.6" fill="none" stroke-linecap="round"/>
          <path d="M196 144 q5 -3 10 0" stroke="#241a10" stroke-width="2.6" fill="none" stroke-linecap="round"/>
          <!-- snoring open mouth -->
          <ellipse cx="190" cy="158" rx="6" ry="4.5" fill="#1a1208"/>
          <!-- glasses askew -->
          <circle cx="178" cy="143" r="9" fill="none" stroke="#3a2415" stroke-width="2"/>
          <circle cx="202" cy="143" r="9" fill="none" stroke="#3a2415" stroke-width="2"/>
          <path d="M187 143 L193 143" stroke="#3a2415" stroke-width="2"/>
        ` : `
          <!-- glasses -->
          <circle cx="178" cy="142" r="9" fill="#0c0816" opacity=".22"/>
          <circle cx="202" cy="142" r="9" fill="#0c0816" opacity=".22"/>
          <circle cx="178" cy="142" r="9" fill="none" stroke="#3a2415" stroke-width="2"/>
          <circle cx="202" cy="142" r="9" fill="none" stroke="#3a2415" stroke-width="2"/>
          <path d="M187 142 L193 142" stroke="#3a2415" stroke-width="2"/>
          <!-- focused eyes inside glasses -->
          <circle cx="178" cy="142" r="2.8" fill="#241a10"/>
          <circle cx="202" cy="142" r="2.8" fill="#241a10"/>
          <!-- concentration mouth -->
          <path d="M180 158 L200 158" stroke="#9a6a48" stroke-width="2.4" stroke-linecap="round"/>
        `}
      </g>

      ${sleep ? `
        <!-- Floating Z's -->
        <text x="232" y="124" fill="#7dd0ff" font-size="26" font-family="Georgia" font-weight="800" opacity=".95">Z</text>
        <text x="252" y="102" fill="#7dd0ff" font-size="20" font-family="Georgia" font-weight="800" opacity=".85">z</text>
        <text x="268" y="86" fill="#7dd0ff" font-size="15" font-family="Georgia" font-weight="800" opacity=".75">z</text>
      ` : `
        <!-- Thinking sparkle next to head -->
        <circle cx="156" cy="108" r="3" fill="#f0b53a" opacity=".95"/>
        <path d="M156 100 L156 95 M150 108 L145 108 M162 108 L167 108" stroke="#f0b53a" stroke-width="1.6" opacity=".7"/>
      `}
    `);
  }

  function _studyJump(books) {
    return svg("0 0 320 300", `
      <ellipse cx="160" cy="282" rx="120" ry="9" fill="#000" opacity=".55"/>
      <circle cx="160" cy="148" r="120" fill="#f0b53a" opacity=".10"/>
      <circle cx="160" cy="148" r="80" fill="#f0b53a" opacity=".09"/>

      <!-- Desk + book stack stays in foreground at bottom -->
      <rect x="30" y="226" width="260" height="14" rx="3" fill="#3a2410"/>
      <rect x="30" y="226" width="260" height="3" fill="#5a3818"/>
      <rect x="30" y="240" width="260" height="40" fill="#28160a"/>
      <g>${_bookStackSVG(books, 50, 226)}</g>

      <!-- Player jumping mid-air, arms in V -->
      <g transform="translate(0 -12)">
        <!-- legs (mid-jump bent) -->
        <path d="M144 196 Q140 220 134 232" stroke="#2c3550" stroke-width="22" stroke-linecap="round" fill="none"/>
        <path d="M184 196 Q188 220 194 232" stroke="#2c3550" stroke-width="22" stroke-linecap="round" fill="none"/>
        <ellipse cx="132" cy="234" rx="14" ry="6" fill="#e8e8ee"/>
        <ellipse cx="196" cy="234" rx="14" ry="6" fill="#e8e8ee"/>

        <!-- torso -->
        <path d="M134 148 Q164 134 194 148 L198 200 Q164 212 130 200 Z" fill="#c43a44"/>

        <!-- arms raised in V -->
        <path d="M140 152 Q115 124 100 80" stroke="#d9b08a" stroke-width="20" stroke-linecap="round" fill="none"/>
        <path d="M188 152 Q213 124 228 80" stroke="#d9b08a" stroke-width="20" stroke-linecap="round" fill="none"/>
        <circle cx="98" cy="76" r="11" fill="#d9b08a"/>
        <circle cx="230" cy="76" r="11" fill="#d9b08a"/>

        <!-- a book triumphantly held -->
        <g transform="translate(98 76) rotate(-20)">
          <rect x="-12" y="-7" width="24" height="14" rx="1.5" fill="#3a567a"/>
          <rect x="-12" y="-7" width="24" height="3" fill="#000" opacity=".3"/>
        </g>

        <!-- head -->
        <ellipse cx="164" cy="118" rx="30" ry="32" fill="#e8c19a"/>
        <path d="M134 114q4 -32 30 -32 26 0 30 32 -6 -16 -30 -16 -24 0 -30 16Z" fill="#3a2415"/>
        <!-- glasses -->
        <circle cx="152" cy="122" r="8" fill="none" stroke="#3a2415" stroke-width="2"/>
        <circle cx="176" cy="122" r="8" fill="none" stroke="#3a2415" stroke-width="2"/>
        <path d="M160 122 L168 122" stroke="#3a2415" stroke-width="2"/>
        <!-- happy eyes -->
        <path d="M148 122 q4 -5 8 0" stroke="#241a10" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M172 122 q4 -5 8 0" stroke="#241a10" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <!-- big smile -->
        <path d="M152 138 Q164 154 176 138 Q164 148 152 138 Z" fill="#fff" stroke="#241a10" stroke-width="2"/>
      </g>

      <!-- Stars / sparkles -->
      <g fill="#f0b53a">
        <path d="M40 60 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" opacity=".95"/>
        <path d="M270 60 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" opacity=".95"/>
        <path d="M30 170 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3 z" opacity=".75"/>
        <path d="M280 170 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3 z" opacity=".75"/>
      </g>
    `);
  }

  function _studyFall() {
    return svg("0 0 320 260", `
      <ellipse cx="160" cy="240" rx="130" ry="10" fill="#000" opacity=".55"/>
      <line x1="0" y1="232" x2="320" y2="232" stroke="#444" opacity=".25"/>

      <!-- Tipped-over desk in the back -->
      <g transform="translate(230 120) rotate(78)">
        <rect x="-90" y="-7" width="180" height="14" fill="#3a2410"/>
        <rect x="-90" y="-7" width="180" height="3" fill="#5a3818"/>
        <rect x="-90" y="7" width="180" height="56" fill="#28160a"/>
      </g>

      <!-- Scattered books -->
      <g>
        <rect x="40" y="222" width="46" height="8" rx="1" fill="#7a3b54" transform="rotate(-15 63 226)"/>
        <rect x="100" y="234" width="50" height="8" rx="1" fill="#5a6a3a" transform="rotate(10 125 238)"/>
        <rect x="180" y="220" width="48" height="8" rx="1" fill="#3a567a" transform="rotate(-22 204 224)"/>
        <rect x="240" y="234" width="44" height="8" rx="1" fill="#7a5a32" transform="rotate(28 262 238)"/>
      </g>

      <!-- Player flat on floor, head left -->
      <g>
        <!-- legs -->
        <path d="M196 168 L246 156" stroke="#2c3550" stroke-width="22" stroke-linecap="round"/>
        <path d="M196 184 L246 192" stroke="#2c3550" stroke-width="22" stroke-linecap="round"/>
        <ellipse cx="250" cy="154" rx="14" ry="6" fill="#e8e8ee"/>
        <ellipse cx="250" cy="194" rx="14" ry="6" fill="#e8e8ee"/>
        <!-- body -->
        <ellipse cx="148" cy="176" rx="58" ry="22" fill="#c43a44"/>
        <!-- arms limp -->
        <path d="M104 172 Q78 198 70 206" stroke="#d9b08a" stroke-width="20" stroke-linecap="round" fill="none"/>
        <path d="M104 182 Q78 162 72 146" stroke="#d9b08a" stroke-width="20" stroke-linecap="round" fill="none"/>
        <!-- head -->
        <ellipse cx="82" cy="174" rx="30" ry="28" fill="#e8c19a"/>
        <path d="M52 174q-2 -28 28 -28 28 0 30 28 -8 -16 -30 -16 -22 0 -28 16Z" fill="#3a2415"/>
        <!-- Glasses askew (one cracked) -->
        <circle cx="72" cy="178" r="8" fill="none" stroke="#3a2415" stroke-width="1.6" transform="rotate(-20 72 178)"/>
        <circle cx="90" cy="172" r="8" fill="none" stroke="#3a2415" stroke-width="1.6" transform="rotate(-20 90 172)"/>
        <path d="M66 174 L78 182" stroke="#3a2415" stroke-width="1.2"/>
        <!-- X-eyes -->
        <path d="M68 176 L78 184 M68 184 L78 176" stroke="#241a10" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M86 170 L96 178 M86 178 L96 170" stroke="#241a10" stroke-width="2.4" stroke-linecap="round"/>
        <!-- dazed mouth -->
        <ellipse cx="82" cy="192" rx="7" ry="3" fill="#1a1208"/>
      </g>

      <!-- Sleepy Zs / dazed stars -->
      <g opacity=".8">
        <text x="100" y="120" fill="#7dd0ff" font-size="22" font-family="Georgia" font-weight="800">Z</text>
        <text x="118" y="100" fill="#7dd0ff" font-size="16" font-family="Georgia" font-weight="800">z</text>
        <path d="M250 60 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" fill="#e2484d"/>
      </g>
    `);
  }

  window.ART = {
    monster: (id) => (MON[id] || MON.shadow_ghost)(),
    room: (id) => (ROOM[id] || ROOM.basement)(),
    mansion, player, gymPose, studyPose, heart, coin: "🪙", key: "🗝️"
  };
})();
