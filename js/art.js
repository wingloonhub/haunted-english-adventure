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

  // Shared shell for zombie variants — rotten green skin, tattered, slumped
  // posture. The `extra` markup paints the costume/colour on top.
  function zombieBody(shirt, shirtDark, extra) {
    return svg("0 0 200 250", `
      <ellipse cx="100" cy="236" rx="64" ry="12" fill="#000" opacity=".5"/>
      <!-- legs (uneven, shambling) -->
      <path d="M86 200 L74 232" stroke="#3a5a3a" stroke-width="18" stroke-linecap="round"/>
      <path d="M114 200 L126 234" stroke="#3a5a3a" stroke-width="18" stroke-linecap="round"/>
      <ellipse cx="72" cy="236" rx="12" ry="6" fill="#1a1a22"/>
      <ellipse cx="128" cy="236" rx="12" ry="6" fill="#1a1a22"/>
      <!-- arms outstretched -->
      <path d="M70 150 Q50 174 56 196" stroke="#5a8a5a" stroke-width="14" stroke-linecap="round" fill="none"/>
      <path d="M130 150 Q150 174 144 196" stroke="#5a8a5a" stroke-width="14" stroke-linecap="round" fill="none"/>
      <!-- claws on hands -->
      <path d="M52 196 L48 206 M58 198 L56 210 M64 196 L66 208" stroke="#3a5a3a" stroke-width="2"/>
      <path d="M148 196 L152 206 M142 198 L144 210 M136 196 L134 208" stroke="#3a5a3a" stroke-width="2"/>
      <!-- torso shirt -->
      <path d="M62 132 Q100 122 138 132 L140 200 L60 200 Z" fill="${shirt}"/>
      <!-- tatters on shirt -->
      <path d="M70 180 L74 200 M88 188 L84 200 M106 184 L110 200 M124 186 L122 200" stroke="${shirtDark}" stroke-width="1.5"/>
      ${extra}`);
  }

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

    /* ---------------- ZOMBIE SHOPPING MALL MONSTERS (generic decaying zombies) ---------------- */
    /* Each variant uses zombieBody() and adds a distinct rotting head + extra detail. */
    z_brain: () => zombieBody("#5a4a3a", "#3a2a1c", `
      <!-- bald rotten head with exposed brain on top -->
      <ellipse cx="100" cy="104" rx="40" ry="44" fill="#7a9a6a"/>
      <!-- bulging exposed brain -->
      <path d="M68 76 Q100 50 132 76 Q130 92 110 90 Q100 96 90 90 Q70 92 68 76 Z" fill="#d28aa6" stroke="#7a3a48" stroke-width="2"/>
      <path d="M80 70 Q88 60 96 70 M104 70 Q112 60 120 70 M92 84 Q100 76 108 84" stroke="#7a3a48" stroke-width="1.5" fill="none"/>
      <!-- rot patches -->
      <ellipse cx="78" cy="118" rx="5" ry="3" fill="#3a5a3a"/>
      <ellipse cx="124" cy="118" rx="6" ry="3.5" fill="#3a5a3a"/>
      <!-- one drooping eye, one closed/scarred -->
      <ellipse cx="84" cy="106" rx="7" ry="9" fill="#fff"/>
      <circle cx="84" cy="108" r="3" fill="#000"/>
      <path d="M108 106 L120 106" stroke="#000" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M112 100 L118 112" stroke="#7a1818" stroke-width="2"/>
      <!-- gaping mouth with drool -->
      <path d="M82 130 Q100 148 118 130 L118 134 L82 134 Z" fill="#1a0a10"/>
      <path d="M88 134 L92 142 L96 134 L100 144 L104 134 L108 142 L112 134" fill="none" stroke="#d8c9a8" stroke-width="2.2"/>
      <path d="M100 142 Q100 162 92 178" stroke="#cdf0a8" stroke-width="3" fill="none" stroke-linecap="round"/>`),
    z_jaw: () => zombieBody("#3a3a44", "#1a1a22", `
      <!-- intact head top, exposed bone-jaw bottom -->
      <ellipse cx="100" cy="100" rx="40" ry="44" fill="#7a9a6a"/>
      <!-- exposed lower jaw bone -->
      <path d="M70 124 Q100 152 130 124 L132 138 Q100 158 68 138 Z" fill="#d8d0b8"/>
      <path d="M76 138 L78 154 L86 138 L92 156 L100 138 L108 156 L114 138 L122 154 L124 138" fill="none" stroke="#1a1208" stroke-width="2.2"/>
      <!-- rotten skin patches -->
      <ellipse cx="82" cy="86" rx="6" ry="4" fill="#3a5a3a"/>
      <ellipse cx="120" cy="92" rx="7" ry="4" fill="#3a5a3a"/>
      <!-- straggly hair on top -->
      <path d="M70 70 Q100 50 130 70 Q126 60 116 56 Q100 50 84 56 Q74 60 70 70 Z" fill="#1a1208"/>
      <path d="M70 64 Q78 58 80 70 M126 60 Q120 54 116 70" stroke="#1a1208" stroke-width="2" fill="none"/>
      <!-- glowing eyes -->
      ${E(86, 114, 98, 8, "eyeG")}
      ${BROW(86, 114, 80, 12, 1)}`),
    z_hollow: () => zombieBody("#0e0e16", "#000", `
      <!-- gaunt grey face, hollow black eye sockets -->
      <ellipse cx="100" cy="100" rx="38" ry="44" fill="#a8b0a8"/>
      <!-- sunken cheek shadows -->
      <ellipse cx="76" cy="116" rx="6" ry="10" fill="#5a6660" opacity=".55"/>
      <ellipse cx="124" cy="116" rx="6" ry="10" fill="#5a6660" opacity=".55"/>
      <!-- big hollow black eye sockets with green glow -->
      <ellipse cx="86" cy="98" rx="9" ry="13" fill="#000"/>
      <ellipse cx="114" cy="98" rx="9" ry="13" fill="#000"/>
      <circle cx="86" cy="100" r="3.4" fill="url(#eyeG)" filter="url(#glow)"/>
      <circle cx="114" cy="100" r="3.4" fill="url(#eyeG)" filter="url(#glow)"/>
      <!-- nose (hollow) -->
      <path d="M100 108 L96 124 L104 124 Z" fill="#000"/>
      <!-- thin slit mouth -->
      <path d="M84 138 L96 134 L116 138" stroke="#1a1a22" stroke-width="3" fill="none"/>
      <!-- stitched neck -->
      <path d="M80 158 L120 158 M84 152 L84 164 M92 152 L92 164 M100 152 L100 164 M108 152 L108 164 M116 152 L116 164" stroke="#5a3a18" stroke-width="1.4"/>`),
    z_drool: () => zombieBody("#3a5a3a", "#1a2a1a", `
      <ellipse cx="100" cy="100" rx="40" ry="44" fill="#6a8a6a"/>
      <!-- bald top with rot -->
      <ellipse cx="100" cy="76" rx="32" ry="10" fill="#5a8a5a" opacity=".6"/>
      <ellipse cx="84" cy="84" rx="6" ry="4" fill="#3a5a3a"/>
      <ellipse cx="118" cy="88" rx="7" ry="4" fill="#3a5a3a"/>
      <!-- one big bulging eye, one missing (X scar) -->
      <ellipse cx="86" cy="100" rx="10" ry="11" fill="#fff"/>
      <circle cx="86" cy="102" r="5" fill="#fff7d0" filter="url(#glow)"/>
      <circle cx="86" cy="102" r="2.4" fill="#000"/>
      <path d="M106 92 L122 108 M106 108 L122 92" stroke="#7a1818" stroke-width="3" stroke-linecap="round"/>
      <!-- huge drooling open mouth -->
      <path d="M76 128 Q100 158 124 128 L124 132 L76 132 Z" fill="#1a0a10"/>
      <path d="M82 132 L86 144 L92 132 L98 148 L104 132 L110 146 L116 132 L120 144 L124 132" fill="none" stroke="#d8c9a8" stroke-width="2.4"/>
      <!-- thick drool drip -->
      <path d="M100 146 Q102 178 88 200" stroke="#cdf0a8" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="86" cy="200" r="4" fill="#cdf0a8"/>`),
    z_bandage: () => zombieBody("#a0a098", "#5a5a52", `
      <!-- bandaged head -->
      <ellipse cx="100" cy="100" rx="40" ry="44" fill="#d8d0b8"/>
      <!-- bandage wrapping lines -->
      <path d="M62 78 Q100 70 138 78 M58 92 Q100 82 142 92 M58 110 Q100 100 142 110 M62 128 Q100 122 138 128" stroke="#9a9080" stroke-width="2" fill="none"/>
      <!-- blood stain on bandage -->
      <ellipse cx="92" cy="92" rx="7" ry="4" fill="#7a1818" opacity=".75"/>
      <!-- one eye showing through bandage gap -->
      <ellipse cx="100" cy="100" rx="11" ry="6" fill="#000"/>
      <circle cx="92" cy="100" r="3" fill="url(#eye)" filter="url(#glow)"/>
      <circle cx="108" cy="100" r="3" fill="url(#eye)" filter="url(#glow)"/>
      <!-- mouth slit visible -->
      <path d="M86 124 L114 124" stroke="#1a1208" stroke-width="3"/>
      <path d="M86 124 L86 130 M94 124 L94 130 M102 124 L102 130 M110 124 L110 130" stroke="#7a1818" stroke-width="1.5"/>`),
    z_skull: () => zombieBody("#1a1a22", "#000", `
      <!-- half-skin half-skull face -->
      <ellipse cx="100" cy="100" rx="40" ry="44" fill="#5a8a5a"/>
      <!-- right half exposed skull -->
      <path d="M100 56 Q140 56 140 100 Q140 144 100 144 Z" fill="#d8d0b8"/>
      <!-- left rotting flesh eye -->
      <ellipse cx="84" cy="98" rx="7" ry="9" fill="#fff"/>
      <circle cx="84" cy="100" r="3.4" fill="#000"/>
      <!-- right hollow skull eye -->
      <ellipse cx="116" cy="98" rx="8" ry="11" fill="#000"/>
      <circle cx="116" cy="100" r="3.4" fill="url(#eye)" filter="url(#glow)"/>
      <!-- nose (hollow on skull side) -->
      <path d="M104 114 L100 126 L108 126 L114 114 Z" fill="#000"/>
      <!-- half mouth + skull teeth -->
      <path d="M80 134 L100 134" stroke="#1a1a22" stroke-width="3"/>
      <rect x="100" y="130" width="22" height="10" fill="#000"/>
      <path d="M104 130 L104 140 M110 130 L110 140 M116 130 L116 140" stroke="#d8d0b8" stroke-width="2.4"/>
      <!-- exposed skull crack -->
      <path d="M120 60 L110 80 L122 88 L116 100" stroke="#9a9080" stroke-width="1.4" fill="none"/>`),
    z_butcher: () => zombieBody("#cfc8b8", "#7a7060", `
      <!-- blood-splattered apron over the body -->
      <path d="M60 130 Q100 122 140 130 L142 200 L58 200 Z" fill="#dcd2c0"/>
      <ellipse cx="80" cy="170" rx="6" ry="9" fill="#7a1818" opacity=".85"/>
      <ellipse cx="116" cy="158" rx="7" ry="10" fill="#7a1818" opacity=".85"/>
      <ellipse cx="100" cy="184" rx="10" ry="6" fill="#7a1818" opacity=".75"/>
      <!-- pale rotten head with blood splatter -->
      <ellipse cx="100" cy="100" rx="38" ry="42" fill="#6a8a6a"/>
      <ellipse cx="92" cy="92" rx="6" ry="4" fill="#7a1818" opacity=".8"/>
      <ellipse cx="120" cy="118" rx="7" ry="3" fill="#7a1818" opacity=".75"/>
      <!-- white chef-style hat askew -->
      <ellipse cx="100" cy="58" rx="26" ry="12" fill="#dcd2c0" stroke="#9a9080" stroke-width="2"/>
      <rect x="74" y="58" width="52" height="14" fill="#dcd2c0" stroke="#9a9080" stroke-width="2"/>
      <ellipse cx="120" cy="64" rx="6" ry="3" fill="#7a1818" opacity=".7"/>
      ${E(86, 114, 100, 8, "eye")}
      ${BROW(86, 114, 84, 12, 1)}
      <!-- gritted bloody teeth -->
      <path d="M82 128 L88 138 L94 128 L100 140 L106 128 L112 138 L118 128" fill="none" stroke="#d8c9a8" stroke-width="2.4"/>`),
    z_office: () => zombieBody("#3a3a4e", "#1a1a26", `
      <!-- torn collared shirt with crooked tie -->
      <path d="M62 130 Q100 122 138 130 L140 200 L60 200 Z" fill="#cdc4b8"/>
      <path d="M76 130 L100 152 L124 130 L120 144 L100 200 L80 144 Z" fill="#3a3a4e"/>
      <!-- tie (red zigzag) -->
      <path d="M96 142 L104 142 L106 156 L102 200 L98 200 L94 156 Z" fill="#7a1820"/>
      <!-- gaunt office-worker head with thin combed hair -->
      <ellipse cx="100" cy="100" rx="38" ry="42" fill="#7a9a6a"/>
      <path d="M68 76 Q100 60 132 76 Q124 70 100 70 Q76 70 68 76 Z" fill="#3a2415"/>
      <!-- broken glasses -->
      <circle cx="86" cy="100" r="9" fill="none" stroke="#1a1a22" stroke-width="2"/>
      <circle cx="114" cy="100" r="9" fill="none" stroke="#1a1a22" stroke-width="2"/>
      <path d="M95 100 L105 100" stroke="#1a1a22" stroke-width="2"/>
      <path d="M82 96 L92 104 M80 102 L94 100" stroke="#1a1a22" stroke-width="0.8"/>
      ${E(86, 114, 100, 7, "eye")}
      <!-- crooked unhappy mouth -->
      <path d="M84 128 L98 132 L116 128" stroke="#1a1a22" stroke-width="2.6" fill="none"/>`),
    z_security: () => zombieBody("#1a2a3a", "#0a141c", `
      <!-- security uniform with badge -->
      <path d="M62 130 Q100 120 138 130 L140 200 L60 200 Z" fill="#2a3a52"/>
      <rect x="76" y="148" width="14" height="18" fill="#e8b23a" stroke="#9a6a20" stroke-width="1.2"/>
      <text x="83" y="160" font-size="9" fill="#3a2a14" text-anchor="middle" font-family="Georgia" font-weight="800">★</text>
      <!-- security cap -->
      <path d="M68 78 L132 78 L130 90 L70 90 Z" fill="#1a2a3a"/>
      <ellipse cx="100" cy="80" rx="34" ry="6" fill="#1a2a3a"/>
      <rect x="84" y="82" width="32" height="6" fill="#0a141c"/>
      <!-- rotting face -->
      <ellipse cx="100" cy="106" rx="36" ry="38" fill="#7a9a6a"/>
      <ellipse cx="84" cy="120" rx="5" ry="3" fill="#3a5a3a"/>
      <ellipse cx="116" cy="124" rx="6" ry="3" fill="#3a5a3a"/>
      <!-- shaded sunglasses (cracked) -->
      <rect x="74" y="100" width="22" height="10" rx="2" fill="#0a0a10"/>
      <rect x="104" y="100" width="22" height="10" rx="2" fill="#0a0a10"/>
      <path d="M82 100 L92 110" stroke="#fff" stroke-width="0.7"/>
      <!-- snarling mouth -->
      <path d="M82 130 L88 140 L94 130 L100 142 L106 130 L112 140 L118 130" fill="none" stroke="#d8c9a8" stroke-width="2.4"/>`),
    z_old: () => zombieBody("#5a3a3a", "#3a1f1f", `
      <!-- pale wrinkled head with wispy grey hair -->
      <ellipse cx="100" cy="100" rx="38" ry="44" fill="#bcb0a8"/>
      <path d="M62 70 Q100 50 138 70 Q126 56 100 56 Q74 56 62 70 Z" fill="#7a7468" opacity=".7"/>
      <!-- wrinkle lines -->
      <path d="M70 84 Q86 80 100 84 M100 84 Q116 80 130 84 M70 124 Q86 120 100 122 M100 122 Q114 120 130 124" stroke="#7a7468" stroke-width="1.2" fill="none" opacity=".7"/>
      <!-- rot patches -->
      <ellipse cx="80" cy="116" rx="5" ry="3" fill="#3a5a3a"/>
      <ellipse cx="118" cy="118" rx="6" ry="3" fill="#3a5a3a"/>
      <!-- droopy eyes -->
      <ellipse cx="86" cy="102" rx="7" ry="5" fill="#0a0a10"/>
      <ellipse cx="114" cy="102" rx="7" ry="5" fill="#0a0a10"/>
      <circle cx="86" cy="104" r="2.4" fill="url(#eye)" filter="url(#glow)"/>
      <circle cx="114" cy="104" r="2.4" fill="url(#eye)" filter="url(#glow)"/>
      <!-- open toothless mouth -->
      <ellipse cx="100" cy="132" rx="13" ry="6" fill="#1a0a10"/>
      <path d="M93 130 L93 134 M107 130 L107 134" stroke="#d8c9a8" stroke-width="2"/>`),

    /* Boss — Zombie Hulk King */
    zombie_hulk: () => svg("0 0 360 380", `
      <!-- ground shadow -->
      <ellipse cx="180" cy="368" rx="140" ry="14" fill="#000" opacity=".55"/>

      <!-- ===== LEGS (massive thighs + calves) ===== -->
      <!-- Left leg -->
      <path d="M118 272 Q92 318 102 360 L150 360 Q146 336 152 300 Q142 280 130 272 Z"
            fill="#9bce8c" stroke="#1a3a1a" stroke-width="3"/>
      <!-- Right leg -->
      <path d="M204 272 Q236 318 226 360 L182 360 Q186 336 184 300 Q196 282 210 272 Z"
            fill="#9bce8c" stroke="#1a3a1a" stroke-width="3"/>
      <!-- Knee shading -->
      <path d="M114 314 Q124 318 134 314 M218 314 Q208 318 198 314" stroke="#5a9a5a" stroke-width="2" fill="none" opacity=".7"/>

      <!-- Bare FEET (big, broad) -->
      <ellipse cx="120" cy="360" rx="30" ry="8" fill="#cfe5b5" stroke="#1a3a1a" stroke-width="2"/>
      <ellipse cx="218" cy="360" rx="30" ry="8" fill="#cfe5b5" stroke="#1a3a1a" stroke-width="2"/>
      <!-- Toes -->
      <circle cx="98"  cy="360" r="3.6" fill="#a8c98a"/>
      <circle cx="106" cy="360" r="3.6" fill="#a8c98a"/>
      <circle cx="114" cy="360" r="3.6" fill="#a8c98a"/>
      <circle cx="240" cy="360" r="3.6" fill="#a8c98a"/>
      <circle cx="232" cy="360" r="3.6" fill="#a8c98a"/>
      <circle cx="224" cy="360" r="3.6" fill="#a8c98a"/>

      <!-- ===== TORN PURPLE SHORTS ===== -->
      <path d="M104 244 Q166 232 228 244 L236 286 Q224 296 206 290 L196 296 L184 282 L172 296 L160 282 L148 296 L138 290 Q116 296 100 286 Z"
            fill="#7a3aa0" stroke="#3a1a52" stroke-width="3"/>
      <!-- Tear highlights -->
      <path d="M120 270 L128 286 M200 268 L210 288" stroke="#3a1a52" stroke-width="2" opacity=".7"/>
      <!-- Shorts speckles -->
      <circle cx="135" cy="260" r="2" fill="#5a2080" opacity=".7"/>
      <circle cx="200" cy="262" r="2" fill="#5a2080" opacity=".7"/>
      <circle cx="170" cy="270" r="2" fill="#5a2080" opacity=".7"/>

      <!-- ===== TORSO (broad, muscular) ===== -->
      <path d="M90 154 Q140 124 180 124 Q220 124 270 154 L262 252 Q220 268 180 268 Q140 268 98 252 Z"
            fill="#9bce8c" stroke="#1a3a1a" stroke-width="3"/>
      <!-- Pec separation + ab lines -->
      <path d="M180 154 L180 250" stroke="#3a5a3a" stroke-width="3"/>
      <path d="M120 200 Q180 218 240 200" stroke="#5a8a5a" stroke-width="2.5" fill="none" opacity=".75"/>
      <path d="M152 224 L208 224 M148 244 L212 244" stroke="#5a8a5a" stroke-width="2" fill="none" opacity=".55"/>
      <!-- Pec highlight -->
      <ellipse cx="146" cy="178" rx="22" ry="10" fill="#bde3ad" opacity=".5"/>
      <ellipse cx="214" cy="178" rx="22" ry="10" fill="#bde3ad" opacity=".5"/>

      <!-- ===== ARMS (oversized, ending in HUGE fists) ===== -->
      <!-- Left arm -->
      <path d="M96 168 Q56 218 64 270" stroke="#9bce8c" stroke-width="38" fill="none" stroke-linecap="round"/>
      <!-- Right arm -->
      <path d="M264 168 Q312 218 300 282" stroke="#9bce8c" stroke-width="42" fill="none" stroke-linecap="round"/>
      <!-- Bicep bulges -->
      <ellipse cx="76"  cy="200" rx="20" ry="28" fill="#bde3ad" opacity=".55" transform="rotate(-14 76 200)"/>
      <ellipse cx="282" cy="200" rx="22" ry="30" fill="#bde3ad" opacity=".55" transform="rotate(14 282 200)"/>

      <!-- LEFT FIST (huge, clenched) -->
      <g>
        <circle cx="62" cy="288" r="34" fill="#9bce8c" stroke="#1a3a1a" stroke-width="3"/>
        <!-- Knuckles -->
        <path d="M40 274 Q48 268 56 274 M60 270 Q68 264 76 270 M80 274 Q86 270 92 276"
              stroke="#3a5a3a" stroke-width="2.4" fill="none"/>
        <!-- Finger creases -->
        <path d="M44 296 Q56 304 70 298 M74 300 Q82 306 88 300" stroke="#3a5a3a" stroke-width="2" fill="none" opacity=".7"/>
        <!-- Thumb -->
        <ellipse cx="92" cy="294" rx="9" ry="7" fill="#9bce8c" stroke="#1a3a1a" stroke-width="2"/>
      </g>

      <!-- RIGHT FIST (even bigger, thrust forward) -->
      <g>
        <circle cx="308" cy="306" r="40" fill="#9bce8c" stroke="#1a3a1a" stroke-width="3"/>
        <!-- Knuckles -->
        <path d="M282 288 Q292 282 302 288 M306 284 Q316 278 326 284 M330 288 Q336 286 340 290"
              stroke="#3a5a3a" stroke-width="2.6" fill="none"/>
        <!-- Finger creases -->
        <path d="M286 316 Q302 326 320 318 M322 320 Q330 326 336 320" stroke="#3a5a3a" stroke-width="2.2" fill="none" opacity=".7"/>
        <!-- Thumb -->
        <ellipse cx="276" cy="312" rx="10" ry="8" fill="#9bce8c" stroke="#1a3a1a" stroke-width="2"/>
        <!-- Knuckle highlight -->
        <circle cx="306" cy="290" r="6" fill="#bde3ad" opacity=".6"/>
      </g>

      <!-- ===== HEAD ===== -->
      <!-- BLACK HAIR (slicked back / spiky top) -->
      <path d="M108 34 Q150 6 180 8 Q210 6 252 34 Q260 60 252 92 Q230 70 200 60 Q180 58 160 60 Q130 70 108 92 Q100 60 108 34 Z"
            fill="#1a1014" stroke="#0a0608" stroke-width="2"/>
      <!-- Hair spike up top -->
      <path d="M158 12 L168 -2 L178 14 L188 -4 L196 12 Z" fill="#1a1014"/>
      <!-- Hair shine -->
      <path d="M150 30 Q170 22 198 30" stroke="#3a2a30" stroke-width="2" fill="none" opacity=".7"/>

      <!-- FACE (broad, big jaw) -->
      <path d="M110 88 Q108 60 132 50 Q160 38 180 38 Q200 38 228 50 Q252 60 250 88 Q254 138 230 156 Q200 168 180 168 Q160 168 130 156 Q106 138 110 88 Z"
            fill="#9bce8c" stroke="#1a3a1a" stroke-width="3"/>

      <!-- BROW RIDGE (heavy, angry) -->
      <path d="M122 82 L160 78 M200 78 L238 82" stroke="#1a3a1a" stroke-width="6" stroke-linecap="round"/>

      <!-- EYES (white + glowing, no pupils) -->
      <ellipse cx="148" cy="98" rx="16" ry="12" fill="#fff" filter="url(#glow)"/>
      <ellipse cx="212" cy="98" rx="16" ry="12" fill="#fff" filter="url(#glow)"/>
      <!-- Eye shadow / sunken sockets -->
      <path d="M132 88 Q148 84 164 88 M196 88 Q212 84 228 88" stroke="#3a5a3a" stroke-width="1.5" fill="none" opacity=".7"/>

      <!-- SNARLING MOUTH with TEETH -->
      <path d="M124 128 Q180 154 236 128 L236 134 L124 134 Z" fill="#0a0508"/>
      <!-- Upper + lower teeth -->
      <path d="M130 130 L134 144 L140 130 L146 148 L152 130 L158 152 L164 130 L170 154 L176 130 L182 156 L188 130 L194 154 L200 130 L206 152 L212 130 L218 148 L224 130 L230 144 L236 132"
            stroke="#efe6d0" stroke-width="3.4" fill="#efe6d0"/>
      <!-- One pointy fang -->
      <path d="M196 130 L202 156 L208 130 Z" fill="#efe6d0" stroke="#1a3a1a" stroke-width="1"/>
      <!-- Drool drop -->
      <path d="M186 156 Q184 168 188 174 Q192 168 188 156 Z" fill="#9bce8c" opacity=".85"/>

      <!-- ===== GREEN WOUND MARKS scattered (the radioactive cuts) ===== -->
      <!-- Forehead lightning cut -->
      <path d="M170 56 L184 74 L176 76 L188 92" stroke="#2a7a2a" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M170 56 L184 74 L176 76 L188 92" stroke="#7adf9a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <!-- Cheek cut -->
      <path d="M138 120 L150 130 L142 134" stroke="#2a7a2a" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <!-- Chest gash + drip -->
      <path d="M150 180 L162 200 L156 204" stroke="#2a7a2a" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M156 204 L160 220" stroke="#7adf9a" stroke-width="2.2" fill="none"/>
      <!-- Side wound -->
      <path d="M222 200 L236 210 L228 218" stroke="#2a7a2a" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <!-- Bicep wound left -->
      <path d="M68 230 L80 244 L74 248" stroke="#2a7a2a" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <!-- Shoulder cut -->
      <path d="M236 168 L252 178 L246 184" stroke="#2a7a2a" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <!-- Thigh wound left -->
      <path d="M114 300 L126 314 L118 318" stroke="#2a7a2a" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <!-- Thigh wound right -->
      <path d="M208 304 L222 318 L214 322" stroke="#2a7a2a" stroke-width="3.4" fill="none" stroke-linecap="round"/>

      <!-- Skin decay spots -->
      <ellipse cx="120" cy="156" rx="5" ry="3" fill="#5a9a5a" opacity=".55"/>
      <ellipse cx="244" cy="158" rx="4" ry="3" fill="#5a9a5a" opacity=".55"/>
      <ellipse cx="200" cy="240" rx="4" ry="3" fill="#5a9a5a" opacity=".55"/>
      <ellipse cx="160" cy="252" rx="3" ry="2" fill="#5a9a5a" opacity=".55"/>
    `),

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

  /* Mall exterior — abandoned shopping mall (used as the mansion-select tile for the zombie map) */
  function mallExterior() {
    // Helper for a small storefront sign
    const shopSign = (x, y, w, label, color) =>
      `<rect x="${x}" y="${y}" width="${w}" height="14" rx="2" fill="${color}" opacity=".85"/>
       <text x="${x + w/2}" y="${y + 10}" text-anchor="middle" fill="#0b0a1c" font-family="Georgia" font-size="9" font-weight="800" letter-spacing="1">${label}</text>`;
    // Lit / dim storefront window
    const sfWin = (x, y, lit) =>
      `<rect x="${x}" y="${y}" width="46" height="28" rx="1" fill="${lit ? "#f0a83a" : "#3a2a52"}" opacity="${lit ? .82 : .55}" ${lit ? `filter="url(#glow)"` : ""}/>
       <path d="M${x + 23} ${y}v28" stroke="#0b0a1c" stroke-width="1.4"/>`;

    return svg("0 0 520 360", `
      <rect width="520" height="360" fill="#0b0a1c"/>
      <!-- Sickly green moon -->
      <circle cx="430" cy="64" r="34" fill="#7adf9a" opacity=".22"/>
      <circle cx="430" cy="64" r="28" fill="#5fbd80" opacity=".35"/>
      ${stars()}
      <!-- Cracked parking-lot ground -->
      <path d="M0 310 Q120 296 260 304 Q400 296 520 310 V360 H0 Z" fill="#0e0a1e"/>
      <path d="M70 326 L130 322 M180 332 L250 326 M300 330 L380 324 M420 332 L490 328"
            stroke="#1a1430" stroke-width="2" opacity=".55"/>
      <!-- Scattered shopping bags -->
      <path d="M104 326 L100 338 L116 338 L112 326 Z M104 326 q4 -4 8 0" fill="#3a2a52" stroke="#1a1024" stroke-width="1"/>
      <path d="M410 322 L406 334 L422 334 L418 322 Z M410 322 q4 -4 8 0" fill="#3a2a52" stroke="#1a1024" stroke-width="1"/>

      <!-- MALL BUILDING — wide rectangular box, 3 storeys -->
      <rect x="38" y="118" width="444" height="202" fill="#1a1430" stroke="#070512" stroke-width="2"/>
      <!-- Roofline trim -->
      <rect x="34" y="112" width="452" height="12" fill="#241a3e" stroke="#070512" stroke-width="2"/>

      <!-- Big top sign: GRAND STAR MALL -->
      <rect x="146" y="74" width="228" height="34" rx="4" fill="#241a3e" stroke="#070512" stroke-width="2"/>
      <rect x="146" y="74" width="228" height="34" rx="4" fill="url(#mallSignGrad)" opacity=".75"/>
      <text x="260" y="98" text-anchor="middle" fill="#f0b53a" font-family="Georgia" font-size="20" font-weight="800" letter-spacing="2" filter="url(#glow)">GRAND STAR MALL</text>
      <!-- Broken neon star next to the sign -->
      <path d="M110 92 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z" fill="#f0b53a" opacity=".9" filter="url(#glow)"/>
      <path d="M410 92 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="#7a5a32" opacity=".5"/>

      <!-- Floor divider lines -->
      <path d="M38 184 L482 184 M38 244 L482 244" stroke="#070512" stroke-width="2"/>

      <!-- Storefront row (top floor) — lit windows -->
      ${sfWin(60, 138, true)} ${sfWin(120, 138, false)} ${sfWin(180, 138, true)}
      ${sfWin(280, 138, false)} ${sfWin(340, 138, true)} ${sfWin(400, 138, false)}
      <!-- Storefront row (middle floor) -->
      ${shopSign(56, 198, 60, "TOP SHOP", "#e2484d")}
      ${shopSign(126, 198, 70, "CINEMA",   "#3a567a")}
      ${shopSign(206, 198, 64, "ARCADE",   "#7a5a3a")}
      ${shopSign(282, 198, 60, "PETS",     "#5a6a3a")}
      ${shopSign(352, 198, 64, "BOOKS",    "#7a3b54")}
      ${shopSign(426, 198, 50, "FOOD",     "#a05a3a")}

      ${sfWin(60, 218, false)} ${sfWin(120, 218, true)} ${sfWin(180, 218, true)}
      ${sfWin(280, 218, true)} ${sfWin(340, 218, false)} ${sfWin(400, 218, true)}

      <!-- Ground floor: two big glass entrance doors -->
      <rect x="220" y="252" width="80" height="68" fill="#0b0712" stroke="#3a2a18" stroke-width="2"/>
      <path d="M260 252 L260 320" stroke="#3a2a18" stroke-width="2"/>
      <!-- Broken glass crack pattern in left door -->
      <path d="M228 264 L246 288 L238 308 M232 258 L256 304" stroke="#cfc6dd" stroke-width="0.8" opacity=".7"/>
      <!-- Crack in right door -->
      <path d="M280 270 L296 296 L286 314" stroke="#cfc6dd" stroke-width="0.8" opacity=".7"/>
      <!-- Door handles -->
      <circle cx="254" cy="288" r="2" fill="#e8b23a"/>
      <circle cx="266" cy="288" r="2" fill="#e8b23a"/>
      <!-- 'WELCOME' mat / sign by the door (knocked over) -->
      <rect x="208" y="318" width="34" height="6" rx="1" fill="#3a2a52" opacity=".7" transform="rotate(-8 225 321)"/>

      <!-- Storefront glass windows flanking the doors -->
      <rect x="78" y="252" width="124" height="68" fill="#0e1220" stroke="#3a2a18" stroke-width="2"/>
      <path d="M80 268 L200 320 M90 256 L180 318" stroke="#cfc6dd" stroke-width="0.6" opacity=".55"/>
      <!-- Shadowy zombie silhouette behind the left glass -->
      <ellipse cx="124" cy="284" rx="14" ry="22" fill="#3a2a52" opacity=".55"/>
      <ellipse cx="124" cy="262" rx="8" ry="9" fill="#3a2a52" opacity=".7"/>
      <circle cx="120" cy="262" r="1.6" fill="#7adf9a" opacity=".9"/>
      <circle cx="128" cy="262" r="1.6" fill="#7adf9a" opacity=".9"/>

      <rect x="318" y="252" width="124" height="68" fill="#0e1220" stroke="#3a2a18" stroke-width="2"/>
      <path d="M320 268 L440 320 M330 256 L420 318" stroke="#cfc6dd" stroke-width="0.6" opacity=".55"/>
      <!-- Slumped figure in the right window -->
      <ellipse cx="380" cy="298" rx="18" ry="10" fill="#3a2a52" opacity=".55"/>
      <ellipse cx="372" cy="282" rx="6" ry="7" fill="#3a2a52" opacity=".7"/>

      <!-- 'CLOSED' / 'WARNING' sign in front -->
      <rect x="64" y="296" width="44" height="14" rx="2" fill="#e2484d" stroke="#070512" stroke-width="1" transform="rotate(-4 86 303)"/>
      <text x="86" y="306" text-anchor="middle" fill="#fff" font-family="Georgia" font-size="9" font-weight="800" transform="rotate(-4 86 303)">CLOSED</text>

      <!-- Dim flickering rooftop lamp -->
      <rect x="252" y="58" width="16" height="6" fill="#3a2a52"/>
      <ellipse cx="260" cy="58" rx="14" ry="6" fill="#f0a83a" opacity=".45" filter="url(#glow)"/>

      <!-- Vignette overlay -->
      <defs>
        <linearGradient id="mallSignGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#5a3a82" stop-opacity=".6"/>
          <stop offset="100%" stop-color="#241a3e" stop-opacity=".9"/>
        </linearGradient>
        <radialGradient id="mallVignette" cx="50%" cy="50%" r="70%">
          <stop offset="58%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000" stop-opacity=".68"/>
        </radialGradient>
      </defs>
      <rect width="520" height="360" fill="url(#mallVignette)"/>
    `, "none");
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
    /* ---------------- ZOMBIE SHOPPING MALL ROOMS ---------------- */
    mall_top_shop: () => roomBase(`
      <rect x="80" y="100" width="640" height="40" fill="#a32a34"/>
      <text x="400" y="128" font-size="22" fill="#fff" text-anchor="middle" font-family="Georgia" font-weight="800">TOP SHOP</text>
      ${shelves(60, 158)}${shelves(556, 158)}
      <rect x="260" y="158" width="280" height="154" fill="#28160a"/>
      <rect x="280" y="200" width="80" height="100" fill="#3a567a"/>
      <rect x="440" y="200" width="80" height="100" fill="#5a6a3a"/>`,
      { wA: "#3a1f2e", wB: "#1c0e1a", fA: "#42323a", fB: "#241620", ac: "#a32a34" }),
    mall_arcade: () => roomBase(`
      <rect x="80" y="110" width="160" height="190" fill="#241634"/>
      <rect x="100" y="130" width="120" height="80" fill="#0e1c3a"/>
      <circle cx="120" cy="170" r="6" fill="#7dd0ff" filter="url(#glow)"/>
      <circle cx="160" cy="170" r="6" fill="#e2484d" filter="url(#glow)"/>
      <circle cx="200" cy="170" r="6" fill="#f0b53a" filter="url(#glow)"/>
      <rect x="320" y="110" width="160" height="190" fill="#241634"/>
      <rect x="340" y="130" width="120" height="80" fill="#0e1c3a"/>
      <rect x="560" y="110" width="160" height="190" fill="#241634"/>
      <rect x="580" y="130" width="120" height="80" fill="#0e1c3a"/>
      <text x="400" y="78" font-size="22" fill="#7dd0ff" text-anchor="middle" font-family="Georgia" filter="url(#glow)">★ ARCADE ★</text>`,
      { wA: "#1a1430", wB: "#0a071a", fA: "#26203e", fB: "#100a22", ac: "#7dd0ff" }),
    mall_clothes: () => roomBase(`
      ${shelves(30, 70)}${shelves(588, 70)}
      <rect x="280" y="120" width="240" height="180" fill="#28160a"/>
      <rect x="300" y="140" width="50" height="130" fill="#a32a34"/>
      <rect x="370" y="140" width="50" height="130" fill="#3a567a"/>
      <rect x="440" y="140" width="50" height="130" fill="#5a6a3a"/>
      <text x="400" y="106" font-size="20" fill="#e2484d" text-anchor="middle" font-family="Georgia" font-weight="800">CLOTHES</text>`,
      { wA: "#3a2c1a", wB: "#1c1208", fA: "#42321a", fB: "#241608", ac: "#e2484d" }),
    mall_gift_wrap: () => roomBase(`
      <!-- Gift Wrap Shop — wrapped presents stacked on shelves, ribbons hanging -->
      <rect x="60" y="92" width="680" height="40" fill="#a02050"/>
      <text x="400" y="120" font-size="22" fill="#fff" text-anchor="middle" font-family="Georgia" font-weight="800">🎁 GIFT WRAP 🎁</text>
      <!-- Hanging ribbon swag -->
      <path d="M60 132 Q200 168 340 138 Q480 168 620 138 Q700 152 740 132" stroke="#f0b53a" stroke-width="3" fill="none" opacity=".85"/>
      <!-- Stacks of wrapped presents -->
      <!-- Left stack -->
      <rect x="80"  y="220" width="80"  height="70" fill="#7a3aa0" stroke="#3a1a52" stroke-width="2"/>
      <rect x="116" y="220" width="8"   height="70" fill="#f0b53a"/>
      <rect x="80"  y="250" width="80"  height="6"  fill="#f0b53a"/>
      <path d="M100 220 q20 -12 40 0" stroke="#f0b53a" stroke-width="3" fill="none"/>
      <rect x="92"  y="160" width="56"  height="58" fill="#3a567a" stroke="#1a2a3a" stroke-width="2"/>
      <rect x="116" y="160" width="8"   height="58" fill="#e2484d"/>
      <rect x="92"  y="184" width="56"  height="6"  fill="#e2484d"/>
      <!-- Middle stack -->
      <rect x="340" y="230" width="120" height="60" fill="#3a8a3a" stroke="#1a4a1a" stroke-width="2"/>
      <rect x="394" y="230" width="12"  height="60" fill="#f0b53a"/>
      <rect x="340" y="256" width="120" height="6"  fill="#f0b53a"/>
      <path d="M376 230 q24 -16 48 0" stroke="#f0b53a" stroke-width="3" fill="none"/>
      <rect x="364" y="170" width="72"  height="56" fill="#a02050" stroke="#5a1030" stroke-width="2"/>
      <rect x="396" y="170" width="8"   height="56" fill="#fff"/>
      <rect x="364" y="194" width="72"  height="6"  fill="#fff"/>
      <!-- Right stack -->
      <rect x="640" y="220" width="80"  height="70" fill="#7a5a32" stroke="#3a2a18" stroke-width="2"/>
      <rect x="676" y="220" width="8"   height="70" fill="#7adf9a"/>
      <rect x="640" y="250" width="80"  height="6"  fill="#7adf9a"/>
      <path d="M660 220 q20 -12 40 0" stroke="#7adf9a" stroke-width="3" fill="none"/>
      <rect x="652" y="158" width="56"  height="60" fill="#5a3aa0" stroke="#2a1a5a" stroke-width="2"/>
      <rect x="676" y="158" width="8"   height="60" fill="#f0b53a"/>
      <rect x="652" y="182" width="56"  height="6"  fill="#f0b53a"/>
      <!-- Sparkle stars -->
      <g fill="#f0b53a" opacity=".85">
        <path d="M240 156 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z"/>
        <path d="M540 168 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z"/>
      </g>`,
      { wA: "#3a1f4e", wB: "#1c0e26", fA: "#42263a", fB: "#241224", ac: "#a02050" }),
    mall_pet: () => roomBase(`
      <rect x="80" y="150" width="160" height="150" fill="#28160a"/>
      <rect x="100" y="170" width="120" height="110" fill="#1a1a22"/>
      <path d="M120 200 Q140 180 160 200 Q180 220 200 200" stroke="#9a8aff" stroke-width="3" fill="none" opacity=".6"/>
      <text x="160" y="140" font-size="14" fill="#5a6a3a" text-anchor="middle" font-family="Georgia">CAGES</text>
      <rect x="320" y="150" width="160" height="150" fill="#28160a"/>
      <rect x="340" y="170" width="120" height="110" fill="#1a1a22"/>
      <rect x="560" y="150" width="160" height="150" fill="#28160a"/>
      <rect x="580" y="170" width="120" height="110" fill="#1a1a22"/>
      <text x="400" y="106" font-size="22" fill="#5a8a5a" text-anchor="middle" font-family="Georgia" font-weight="800">PET SHOP</text>`,
      { wA: "#2a3a2a", wB: "#0e1a0e", fA: "#3a3a22", fB: "#1c1c10", ac: "#5a8a5a" }),
    mall_cinema: () => roomBase(`
      <rect x="60" y="60" width="680" height="220" fill="#0a0a14"/>
      <rect x="80" y="78" width="640" height="180" fill="#3a0a14"/>
      <rect x="100" y="98" width="600" height="142" fill="#0a0508"/>
      <text x="400" y="180" font-size="22" fill="#e2484d" text-anchor="middle" font-family="Georgia" font-weight="800" filter="url(#glow)">SCREAMING CINEMA</text>
      ${Array.from({ length: 20 }, (_, i) => `<rect x="${60 + i * 36}" y="282" width="22" height="20" fill="#5a1018"/>`).join("")}`,
      { wA: "#1c0612", wB: "#0a020a", fA: "#28161c", fB: "#10080c", ac: "#a32a34" }),
    mall_bookshop: () => roomBase(`
      ${shelves(28, 64)}${shelves(220, 64)}${shelves(412, 64)}${shelves(604, 64)}
      <text x="400" y="64" font-size="20" fill="#e8b23a" text-anchor="middle" font-family="Georgia" filter="url(#glow)">📖 BOOKS</text>`,
      { wA: "#2a201a", wB: "#10080a", fA: "#3a2a1a", fB: "#1a1208", ac: "#e8b23a" }),
    mall_computer: () => roomBase(`
      <rect x="80" y="160" width="160" height="100" fill="#1c1c24"/>
      <rect x="92" y="172" width="136" height="74" fill="#0a0a10"/>
      <text x="160" y="216" font-size="18" fill="#e2484d" text-anchor="middle" font-family="Georgia">ERROR</text>
      <rect x="320" y="160" width="160" height="100" fill="#1c1c24"/>
      <rect x="332" y="172" width="136" height="74" fill="#0a0a10"/>
      <path d="M340 200 L460 200 M380 180 L420 220" stroke="#5a5a66" stroke-width="2"/>
      <rect x="560" y="160" width="160" height="100" fill="#1c1c24"/>
      <rect x="572" y="172" width="136" height="74" fill="#0a0a10"/>
      <text x="640" y="216" font-size="18" fill="#7dd0ff" text-anchor="middle" font-family="Georgia">404</text>
      <text x="400" y="110" font-size="22" fill="#7dd0ff" text-anchor="middle" font-family="Georgia" font-weight="800">⌨ COMPUTER SHOP</text>`,
      { wA: "#1a2a3a", wB: "#0a121a", fA: "#26303a", fB: "#10181c", ac: "#7dd0ff" }),
    mall_food: () => roomBase(`
      <rect x="60" y="120" width="200" height="180" fill="#3a2410"/>
      <rect x="80" y="140" width="160" height="40" fill="#7a1f28"/>
      <text x="160" y="166" font-size="14" fill="#fff" text-anchor="middle" font-family="Georgia">PIZZA</text>
      <rect x="300" y="120" width="200" height="180" fill="#3a2410"/>
      <rect x="320" y="140" width="160" height="40" fill="#1a3a7a"/>
      <text x="400" y="166" font-size="14" fill="#fff" text-anchor="middle" font-family="Georgia">BURGERS</text>
      <rect x="540" y="120" width="200" height="180" fill="#3a2410"/>
      <rect x="560" y="140" width="160" height="40" fill="#5a8a5a"/>
      <text x="640" y="166" font-size="14" fill="#fff" text-anchor="middle" font-family="Georgia">NOODLES</text>
      <text x="400" y="98" font-size="22" fill="#f0b53a" text-anchor="middle" font-family="Georgia" font-weight="800">👻 FOOD COURT</text>`,
      { wA: "#3a2c1a", wB: "#1c1208", fA: "#42321a", fB: "#241608", ac: "#f0b53a" }),
    mall_watch: () => roomBase(`
      ${[120, 280, 440, 600].map((x, i) => `
        <circle cx="${x}" cy="180" r="50" fill="#0a0a10" stroke="#dcdce0" stroke-width="3"/>
        <circle cx="${x}" cy="180" r="44" fill="#1a1a22"/>
        <path d="M${x} 180 L${x} ${146 + i * 4}" stroke="#dcdce0" stroke-width="2"/>
        <path d="M${x} 180 L${x + 22 - i * 6} 180" stroke="#dcdce0" stroke-width="2"/>
        <circle cx="${x}" cy="180" r="3" fill="#dcdce0"/>`).join("")}
      <text x="400" y="100" font-size="22" fill="#dcdce0" text-anchor="middle" font-family="Georgia" font-weight="800">⌚ WATCH SHOP</text>`,
      { wA: "#2c2c2e", wB: "#121214", fA: "#3a3a3e", fB: "#1c1c1e", ac: "#dcdce0" }),
    mall_security: () => roomBase(`
      <rect x="60" y="120" width="680" height="180" fill="#0e0e16"/>
      ${Array.from({ length: 6 }, (_, i) => `
        <rect x="${80 + i * 110}" y="140" width="100" height="70" fill="#0a0a10" stroke="#3a3a44" stroke-width="2"/>
        <circle cx="${130 + i * 110}" cy="175" r="6" fill="${i % 2 ? "#e2484d" : "#5a8a5a"}" filter="url(#glow)"/>
        <text x="${130 + i * 110}" y="200" font-size="9" fill="#5a6a78" text-anchor="middle" font-family="monospace">CAM ${i + 1}</text>`).join("")}
      <text x="400" y="100" font-size="22" fill="#e2484d" text-anchor="middle" font-family="Georgia" font-weight="800">🔒 SECURITY</text>`,
      { wA: "#1a1f26", wB: "#080a0e", fA: "#262a30", fB: "#10141a", ac: "#e2484d" }),
    mall_game_shop: () => roomBase(`
      <rect x="80" y="120" width="220" height="190" fill="#241036"/>
      <rect x="100" y="140" width="180" height="100" fill="#0a0510"/>
      <text x="190" y="200" font-size="32" fill="#f0b53a" text-anchor="middle" font-family="Georgia">🎯</text>
      <rect x="340" y="120" width="220" height="190" fill="#241036"/>
      <rect x="360" y="140" width="180" height="100" fill="#0a0510"/>
      <text x="450" y="200" font-size="32" fill="#7dd0ff" text-anchor="middle" font-family="Georgia">🕹️</text>
      <rect x="580" y="120" width="160" height="190" fill="#241036"/>
      <text x="400" y="100" font-size="22" fill="#f0b53a" text-anchor="middle" font-family="Georgia" font-weight="800">🎮 GAME SHOP</text>`,
      { wA: "#2a1840", wB: "#0e0820", fA: "#3a2c54", fB: "#1c1432", ac: "#f0b53a" }),
    mall_sports: () => roomBase(`
      <rect x="80" y="220" width="200" height="80" rx="8" fill="#3a3a44"/>
      <rect x="86" y="226" width="188" height="14" fill="#1a1a22"/>
      <rect x="120" y="160" width="20" height="60" fill="#3a3a44"/>
      <rect x="220" y="160" width="20" height="60" fill="#3a3a44"/>
      <rect x="115" y="155" width="130" height="10" fill="#3a3a44"/>
      <rect x="360" y="220" width="100" height="80" rx="50" fill="#7a5a32"/>
      <text x="410" y="270" font-size="20" fill="#fff" text-anchor="middle" font-family="Georgia">⚽</text>
      <rect x="520" y="180" width="200" height="120" fill="#26262c"/>
      <rect x="540" y="200" width="50" height="80" fill="#16161a"/>
      <rect x="600" y="200" width="50" height="80" fill="#16161a"/>
      <rect x="660" y="200" width="50" height="80" fill="#16161a"/>
      <text x="400" y="100" font-size="22" fill="#5a8a5a" text-anchor="middle" font-family="Georgia" font-weight="800">🏃 SPORTS SHOP</text>`,
      { wA: "#2a302e", wB: "#101414", fA: "#3a3a42", fB: "#1c1c22", ac: "#5a8a5a" }),
    mall_supermarket: () => roomBase(`
      ${shelves(28, 74)}${shelves(220, 74)}${shelves(412, 74)}${shelves(604, 74)}
      <text x="400" y="60" font-size="24" fill="#f0b53a" text-anchor="middle" font-family="Georgia" font-weight="800" filter="url(#glow)">🛒 SUPERMARKET</text>`,
      { wA: "#3a2c1a", wB: "#1c1208", fA: "#4a3018", fB: "#241608", ac: "#f0b53a" }),
    mall_dead_hall: () => {
      const u = "d" + (IDC++);
      return customScene(u, `
        <defs><linearGradient id="dr${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a0a14"/><stop offset="1" stop-color="#0a0306"/></linearGradient></defs>
        <rect width="800" height="360" fill="url(#dr${u})"/>
        ${Array.from({ length: 26 }, (_, i) => `<circle cx="${(i * 71) % 800}" cy="${(i * 41) % 80}" r="${i % 4 === 0 ? 2 : 1.2}" fill="#e2484d" opacity="${.4 + (i % 4) * .14}"/>`).join("")}
        <path d="M120 360V120a40 40 0 0 1 80 0V360M600 360V120a40 40 0 0 1 80 0V360" fill="#1a0508" opacity=".7"/>
        <rect y="296" width="800" height="64" fill="#0a0306"/>
        <rect x="340" y="80" width="120" height="220" fill="#0a0508" stroke="#7a1820" stroke-width="3"/>
        <text x="400" y="84" font-size="14" fill="#e2484d" text-anchor="middle" font-family="Georgia" filter="url(#glow)">EXIT</text>
        <circle cx="400" cy="60" r="14" fill="#e2484d" opacity=".85" filter="url(#glow)"/>
        <circle cx="400" cy="60" r="50" fill="#e2484d" opacity=".12"/>`);
    },

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
  function player(weapon, gender) {
    const isGirl = gender === "girl";
    const shirt      = isGirl ? "#e2659d" : "#c43a44";
    const shirtSeam  = isGirl ? "#a83972" : "#a32a34";

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
    // Baseball bat — wielded for the Zombie Shopping Mall mansion.
    // Held in the right hand at (140, 150), tilted up-right so the barrel
    // sits past the shoulder and never crosses the player's face/head.
    const bat = `
      <g transform="rotate(34 140 150)">
        <!-- knob at the bottom of the handle (in the hand) -->
        <ellipse cx="140" cy="156" rx="9" ry="5" fill="#7a5424" stroke="#3a2010" stroke-width="1"/>
        <!-- handle -->
        <rect x="135" y="118" width="10" height="40" fill="#b08148" stroke="#7a5424" stroke-width="1"/>
        <!-- grip tape (black bands) -->
        <rect x="134" y="124" width="12" height="3" fill="#1a1208"/>
        <rect x="134" y="130" width="12" height="3" fill="#1a1208"/>
        <rect x="134" y="136" width="12" height="3" fill="#1a1208"/>
        <rect x="134" y="142" width="12" height="3" fill="#1a1208"/>
        <!-- taper from handle to barrel -->
        <path d="M135 118 L128 110 L152 110 L145 118 Z" fill="#cda176"/>
        <!-- barrel -->
        <path d="M126 44 L154 44 L152 110 L128 110 Z" fill="#d2a578" stroke="#7a5424" stroke-width="1.4"/>
        <!-- rounded top of the bat -->
        <ellipse cx="140" cy="44" rx="14" ry="6" fill="#e2b88a" stroke="#7a5424" stroke-width="1.2"/>
        <!-- wood grain lines -->
        <path d="M132 56 L132 104 M140 50 L140 106 M148 56 L148 104" stroke="#9a6c3a" stroke-width="0.9" opacity=".55"/>
        <!-- small logo -->
        <ellipse cx="140" cy="78" rx="5" ry="2" fill="#7a1f28"/>
      </g>`;
    // Toy gun for the zombie mall (replaces sling visual when armed).
    const gun = `
      <g transform="rotate(-6 140 150)">
        <rect x="118" y="142" width="44" height="14" rx="3" fill="#3a3a44"/>
        <rect x="118" y="142" width="44" height="4" fill="#5a5560"/>
        <rect x="116" y="150" width="8" height="20" rx="2" fill="#3a3a44"/>
        <circle cx="124" cy="152" r="3" fill="#e2484d" filter="url(#glow)"/>
        <rect x="158" y="146" width="8" height="6" fill="#1a1a22"/>
      </g>`;
    // Long hair behind the head (girl only) — rendered BEFORE the head so it never covers the face.
    const backHair = isGirl
      ? `<ellipse cx="64" cy="124" rx="9" ry="22" fill="#3a2415"/>
         <ellipse cx="120" cy="124" rx="9" ry="22" fill="#3a2415"/>`
      : "";
    // Crown / top-of-head hair — same shape for both, so the face skin colour shows the same.
    const crownHair = `<path d="M62 100q4 -40 30 -40 26 0 30 40 -6 -20 -30 -20 -24 0 -30 20Z" fill="#3a2415"/>`;
    const accent = isGirl
      ? `<path d="M82 62 q4 -10 12 0 q4 -10 -12 0 Z" fill="${shirt}"/>
         <circle cx="88" cy="62" r="2" fill="${shirtSeam}"/>`
      : `<path d="M64 96q10 -10 22 -6M120 96q-10 -10 -22 -6" fill="none" stroke="#3a2415" stroke-width="3"/>`;

    return svg("0 0 200 250", `
      <ellipse cx="92" cy="244" rx="44" ry="10" fill="#000" opacity=".45"/>
      <rect x="74" y="188" width="15" height="44" rx="6" fill="#2c3550"/>
      <rect x="96" y="188" width="15" height="44" rx="6" fill="#2c3550"/>
      <ellipse cx="80" cy="236" rx="14" ry="8" fill="#e8e8ee"/>
      <ellipse cx="104" cy="236" rx="14" ry="8" fill="#e8e8ee"/>
      <path d="M68 142q24 -14 48 0l6 50q-30 12 -60 0Z" fill="${shirt}"/>
      <path d="M92 132v62" stroke="${shirtSeam}" stroke-width="2" opacity=".6"/>
      <path d="M70 150 50 188" stroke="#d9b08a" stroke-width="11" stroke-linecap="round"/>
      <path d="M114 150 140 150" stroke="#d9b08a" stroke-width="11" stroke-linecap="round"/>
      ${backHair}
      <ellipse cx="92" cy="104" rx="30" ry="31" fill="#e8c19a"/>
      ${crownHair}
      ${accent}
      <circle cx="83" cy="106" r="3.6" fill="#241a10"/>
      <circle cx="101" cy="106" r="3.6" fill="#241a10"/>
      <circle cx="84" cy="105" r="1.2" fill="#fff"/><circle cx="102" cy="105" r="1.2" fill="#fff"/>
      <path d="M85 120q7 5 14 0" stroke="#9a6a48" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <ellipse cx="74" cy="116" rx="5" ry="3" fill="#e88a8a" opacity=".5"/>
      <ellipse cx="110" cy="116" rx="5" ry="3" fill="#e88a8a" opacity=".5"/>
      ${weapon === "sling" ? sling : weapon === "bat" ? bat : weapon === "gun" ? gun : torch}`);
  }

  const heart = (empty) =>
    `<svg class="heart ${empty ? "empty" : ""}" viewBox="0 0 24 24"><path d="M12 21S3 14.5 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 14.5 12 21 12 21Z" fill="#e11d36" stroke="#7a0d1c" stroke-width="1.4"/></svg>`;

  /* ---------------- GYM POSE: kid + barbell as a single integrated SVG ---------------- */
  // The barbell is a <g id="bbell"> sub-group so CSS animations can target it
  // independently (pulse / wobble / crash) without re-rendering.
  const RING_BY_W = ["#5a5a66", "#1f5588", "#1f5588", "#1f7a3a", "#1f7a3a", "#c89a30", "#c89a30", "#c84a30", "#c83a30", "#b3122b", "#f0b53a"];

  function gymPose(weight, stage, gender) {
    weight = Math.max(0, Math.min(10, weight));
    const isGirl = gender === "girl";

    if (stage === "flex") return _flexPose(isGirl);
    if (stage === "fall") return _fallPose(isGirl);

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

      <!-- Ponytail BEHIND the head so it never covers the face. Drawn before head. -->
      ${isGirl ? `<ellipse cx="158" cy="170" rx="9" ry="22" fill="#3a2415" transform="rotate(25 158 170)"/>
                  <ellipse cx="158" cy="158" rx="4" ry="3" fill="#e2484d"/>` : ""}
      <!-- Head (between arms) -->
      <ellipse cx="120" cy="160" rx="32" ry="34" fill="#e8c19a"/>
      <!-- Same crown hair as boy so the face skin shows the same -->
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

  function _flexPose(isGirl) {
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

      ${isGirl ? `<ellipse cx="156" cy="170" rx="9" ry="22" fill="#3a2415" transform="rotate(25 156 170)"/>` : ""}
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

  function _fallPose(isGirl) {
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
        ${isGirl ? `<ellipse cx="34" cy="178" rx="8" ry="20" fill="#3a2415" transform="rotate(50 34 178)"/>` : ""}
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

  function studyPose(books, stage, gender) {
    books = Math.max(0, Math.min(10, books));
    const isGirl = gender === "girl";
    if (stage === "jump") return _studyJump(books, isGirl);
    if (stage === "fall") return _studyFall(isGirl);
    if (stage === "sleep") return _studyRead(books, true, isGirl);
    return _studyRead(books, false, isGirl);
  }

  function _studyRead(books, sleep, isGirl) {
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
        ${isGirl ? `<ellipse cx="226" cy="152" rx="8" ry="20" fill="#3a2415" transform="rotate(22 226 152)"/>` : ""}
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

  function _studyJump(books, isGirl) {
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

        ${isGirl ? `<ellipse cx="128" cy="130" rx="8" ry="18" fill="#3a2415" transform="rotate(-25 128 130)"/>
                    <ellipse cx="200" cy="130" rx="8" ry="18" fill="#3a2415" transform="rotate(25 200 130)"/>` : ""}
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

  function _studyFall(isGirl) {
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
        ${isGirl ? `<ellipse cx="54" cy="196" rx="8" ry="18" fill="#3a2415" transform="rotate(45 54 196)"/>` : ""}
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

  /* ---------------- FOOTBALL POSE: kid kicking ball at a target ---------------- */
  function footballPose(goals, stage, gender) {
    goals = Math.max(0, Math.min(10, goals));
    const isGirl = gender === "girl";
    if (stage === "flex")  return _legFlexPose(isGirl);
    if (stage === "fall")  return _footballFallPose(isGirl);
    if (stage === "shoot") return _footballKick(goals, false, isGirl, true);
    if (stage === "miss")  return _footballKick(goals, true,  isGirl, false);
    return _footballKick(goals, false, isGirl, false);
  }

  function _footballKick(goals, missed, isGirl, shooting) {
    // Target board on the far right (with goal posts + net behind it).
    // Player on the left in a mid-kick stance with the ball at his foot.
    const TARGET_CX = 380, TARGET_CY = 150, TARGET_R = 42;
    // Each previous goal leaves a little soccer-ball mark on the target.
    let goalMarks = "";
    for (let i = 0; i < goals; i++) {
      const ang = i * 0.9;
      const rad = Math.min(TARGET_R - 6, 4 + i * 4);
      const hx = TARGET_CX + Math.cos(ang) * rad;
      const hy = TARGET_CY + Math.sin(ang) * rad;
      goalMarks += `
        <circle cx="${hx}" cy="${hy}" r="5" fill="#fff" stroke="#1a1208" stroke-width="1"/>
        <path d="M${hx} ${hy - 3} L${hx - 2.4} ${hy - 1} L${hx - 1.4} ${hy + 2.4} L${hx + 1.4} ${hy + 2.4} L${hx + 2.4} ${hy - 1} Z" fill="#1a1208"/>`;
    }
    // Miss shot — ball flying past above the goal
    const miss = missed
      ? `<g>
           <circle cx="${TARGET_CX + 28}" cy="${TARGET_CY - 78}" r="9" fill="#fff" stroke="#1a1208" stroke-width="1.6"/>
           <path d="M${TARGET_CX + 28} ${TARGET_CY - 83} L${TARGET_CX + 24} ${TARGET_CY - 78} L${TARGET_CX + 25.5} ${TARGET_CY - 73} L${TARGET_CX + 30.5} ${TARGET_CY - 73} L${TARGET_CX + 32} ${TARGET_CY - 78} Z" fill="#1a1208"/>
           <text x="${TARGET_CX + 46}" y="${TARGET_CY - 88}" fill="#e2484d" font-family="Georgia" font-size="14" font-weight="800">MISS!</text>
         </g>` : "";

    return svg("0 0 460 320", `
      <ellipse cx="230" cy="298" rx="200" ry="10" fill="#000" opacity=".45"/>

      <!-- Grass field stripe -->
      <rect x="0" y="274" width="460" height="14" fill="#2a5a32" opacity=".55"/>
      <rect x="0" y="282" width="460" height="3" fill="#3a7a44" opacity=".45"/>
      <!-- Perspective grass lines suggesting distance -->
      <path d="M120 286 L300 274 M180 296 L330 280 M60 296 L260 282"
            stroke="#3a7a44" stroke-width="1.4" opacity=".6"/>
      <!-- Penalty-spot dot in front of the player -->
      <circle cx="180" cy="282" r="3" fill="#fff" opacity=".75"/>
      <!-- Distance label -->
      <text x="270" y="262" text-anchor="middle" fill="#9a8fb3" font-family="Georgia" font-size="11" font-weight="700" opacity=".75">— 10 metres —</text>

      <!-- GOAL POSTS (white frame) -->
      <rect x="${TARGET_CX - 70}" y="${TARGET_CY - 100}" width="6" height="200" fill="#eee" stroke="#222" stroke-width="1"/>
      <rect x="${TARGET_CX + 64}" y="${TARGET_CY - 100}" width="6" height="200" fill="#eee" stroke="#222" stroke-width="1"/>
      <rect x="${TARGET_CX - 70}" y="${TARGET_CY - 106}" width="140" height="6" fill="#eee" stroke="#222" stroke-width="1"/>
      <!-- Net (subtle grid behind the target board) -->
      <g stroke="#aaa" stroke-width="0.8" fill="none" opacity=".55">
        <path d="M${TARGET_CX - 60} ${TARGET_CY - 100} L${TARGET_CX - 60} ${TARGET_CY + 100}
                 M${TARGET_CX - 40} ${TARGET_CY - 100} L${TARGET_CX - 40} ${TARGET_CY + 100}
                 M${TARGET_CX - 20} ${TARGET_CY - 100} L${TARGET_CX - 20} ${TARGET_CY + 100}
                 M${TARGET_CX}      ${TARGET_CY - 100} L${TARGET_CX}      ${TARGET_CY + 100}
                 M${TARGET_CX + 20} ${TARGET_CY - 100} L${TARGET_CX + 20} ${TARGET_CY + 100}
                 M${TARGET_CX + 40} ${TARGET_CY - 100} L${TARGET_CX + 40} ${TARGET_CY + 100}
                 M${TARGET_CX + 60} ${TARGET_CY - 100} L${TARGET_CX + 60} ${TARGET_CY + 100}
                 M${TARGET_CX - 60} ${TARGET_CY - 70}  L${TARGET_CX + 60} ${TARGET_CY - 70}
                 M${TARGET_CX - 60} ${TARGET_CY - 40}  L${TARGET_CX + 60} ${TARGET_CY - 40}
                 M${TARGET_CX - 60} ${TARGET_CY - 10}  L${TARGET_CX + 60} ${TARGET_CY - 10}
                 M${TARGET_CX - 60} ${TARGET_CY + 20}  L${TARGET_CX + 60} ${TARGET_CY + 20}
                 M${TARGET_CX - 60} ${TARGET_CY + 50}  L${TARGET_CX + 60} ${TARGET_CY + 50}
                 M${TARGET_CX - 60} ${TARGET_CY + 80}  L${TARGET_CX + 60} ${TARGET_CY + 80}"/>
      </g>

      <!-- TARGET BOARD mounted in the goal -->
      <circle cx="${TARGET_CX}" cy="${TARGET_CY}" r="${TARGET_R}"      fill="#f4f4f4" stroke="#222" stroke-width="2"/>
      <circle cx="${TARGET_CX}" cy="${TARGET_CY}" r="${TARGET_R*.78}"  fill="#3a567a" stroke="#222" stroke-width="1"/>
      <circle cx="${TARGET_CX}" cy="${TARGET_CY}" r="${TARGET_R*.55}"  fill="#f4f4f4" stroke="#222" stroke-width="1"/>
      <circle cx="${TARGET_CX}" cy="${TARGET_CY}" r="${TARGET_R*.34}"  fill="#e2484d" stroke="#222" stroke-width="1"/>
      <circle cx="${TARGET_CX}" cy="${TARGET_CY}" r="${TARGET_R*.14}"  fill="#f0b53a" stroke="#7a5424" stroke-width="1"/>
      ${goalMarks}
      ${miss}
      <!-- Goals counter -->
      <text x="${TARGET_CX}" y="${TARGET_CY - 116}" text-anchor="middle" fill="#f0b53a" font-family="Georgia" font-size="18" font-weight="800">GOALS ${goals}/10</text>

      <!-- PLAYER on the left, mid-kick -->
      <!-- Planted (back) leg -->
      <rect x="74" y="222" width="14" height="56" rx="6" fill="#2c3550"/>
      <ellipse cx="80" cy="282" rx="14" ry="6" fill="#e8e8ee"/>
      <!-- Kicking (front) leg: cocked-back when idle, fully-extended when shooting -->
      ${shooting
        ? `<path d="M100 222 Q160 218 210 222" stroke="#2c3550" stroke-width="20" fill="none" stroke-linecap="round"/>
           <ellipse cx="216" cy="222" rx="18" ry="7" fill="#e8e8ee" transform="rotate(2 216 222)"/>
           <!-- Follow-through swoosh -->
           <path d="M110 232 Q150 226 200 228" stroke="#fff" stroke-width="1.4" fill="none" opacity=".55"/>`
        : `<path d="M100 222 Q140 222 156 246" stroke="#2c3550" stroke-width="20" fill="none" stroke-linecap="round"/>
           <ellipse cx="162" cy="252" rx="16" ry="7" fill="#e8e8ee" transform="rotate(18 162 252)"/>`}

      <!-- Torso (leaning slightly back for the kick) -->
      <g transform="rotate(-6 82 196)">
        <path d="M52 168 Q82 158 110 168 L106 226 Q82 234 56 226 Z" fill="#c43a44"/>
        <path d="M82 166 L82 230" stroke="#8a1f28" stroke-width="2" opacity=".5"/>
      </g>

      <!-- Arms (out for balance) -->
      <path d="M58 176 Q26 196 22 218" stroke="#d9b08a" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="M104 174 Q138 184 134 212" stroke="#d9b08a" stroke-width="14" fill="none" stroke-linecap="round"/>

      <!-- FOOTBALL at the kicking foot (hidden during the shoot frame — ball is in flight) -->
      ${shooting ? "" : `<g>
        <!-- Motion swoosh -->
        <path d="M150 256 Q156 252 162 256" stroke="#fff" stroke-width="1.6" fill="none" opacity=".6"/>
        <path d="M148 262 Q156 258 164 262" stroke="#fff" stroke-width="1.2" fill="none" opacity=".4"/>
        <!-- Ball -->
        <circle cx="180" cy="258" r="11" fill="#fff" stroke="#1a1208" stroke-width="1.5"/>
        <path d="M180 250 L173.6 254.6 L176 262 L184 262 L186.4 254.6 Z" fill="#1a1208"/>
        <path d="M173.6 254.6 L168 258 M186.4 254.6 L192 258 M176 262 L173 268 M184 262 L187 268 M180 250 L180 246" stroke="#1a1208" stroke-width="1"/>
        <!-- Aim arc from ball toward target -->
        <path d="M190 256 Q280 ${TARGET_CY - 60} ${TARGET_CX - TARGET_R - 4} ${TARGET_CY}"
              stroke="#f0b53a" stroke-width="1.4" fill="none" stroke-dasharray="3 5" opacity=".55"/>
      </g>`}

      <!-- HEAD -->
      ${isGirl ? `<ellipse cx="106" cy="138" rx="8" ry="20" fill="#3a2415" transform="rotate(25 106 138)"/>
                  <ellipse cx="106" cy="124" rx="4" ry="2.5" fill="#e2484d"/>` : ""}
      <ellipse cx="82" cy="130" rx="26" ry="28" fill="#e8c19a"/>
      <path d="M56 126q4 -32 26 -32 22 0 26 32 -6 -16 -26 -16 -20 0 -26 16Z" fill="#3a2415"/>
      <!-- Focused eyes (both open, fixed on target) -->
      <circle cx="76" cy="132" r="3" fill="#241a10"/>
      <circle cx="92" cy="132" r="3" fill="#241a10"/>
      <!-- Determined mouth -->
      <path d="M76 146 q6 4 12 0" stroke="#241a10" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <!-- Sweat drop -->
      <ellipse cx="58" cy="124" rx="2.4" ry="4" fill="#7dd0ff" opacity=".85"/>
    `);
  }

  function _footballFallPose(isGirl) {
    return svg("0 0 460 280", `
      <ellipse cx="230" cy="260" rx="200" ry="10" fill="#000" opacity=".55"/>
      <rect x="0" y="244" width="460" height="14" fill="#2a5a32" opacity=".5"/>

      <!-- Broken / leaning goal post on the right -->
      <g>
        <rect x="310" y="60" width="6" height="180" fill="#eee" stroke="#222" stroke-width="1" transform="rotate(-22 313 150)"/>
        <rect x="430" y="60" width="6" height="180" fill="#eee" stroke="#222" stroke-width="1"/>
        <path d="M260 70 L436 60" stroke="#eee" stroke-width="6"/>
        <text x="360" y="50" text-anchor="middle" fill="#e2484d" font-family="Georgia" font-size="18" font-weight="800">GAME OVER!</text>
      </g>

      <!-- Deflated football near the kid -->
      <g transform="translate(220 232)">
        <ellipse cx="0" cy="0" rx="18" ry="5" fill="#cfcfcf" stroke="#1a1208" stroke-width="1.4"/>
        <path d="M-9 -1 L-3 1 L3 -1 L9 1" stroke="#1a1208" stroke-width="1"/>
        <text x="0" y="-12" text-anchor="middle" fill="#e2484d" font-family="Georgia" font-size="13" font-weight="800">POP!</text>
      </g>

      <!-- Sad kid sitting on the grass -->
      <g>
        <path d="M86 196 L186 200" stroke="#2c3550" stroke-width="22" stroke-linecap="round"/>
        <ellipse cx="190" cy="200" rx="14" ry="6" fill="#e8e8ee"/>
        <path d="M58 132 Q92 124 116 132 L120 196 Q88 204 56 196 Z" fill="#c43a44"/>
        <path d="M68 140 Q56 178 76 200" stroke="#d9b08a" stroke-width="16" fill="none" stroke-linecap="round"/>
        <path d="M108 140 Q132 168 124 196" stroke="#d9b08a" stroke-width="16" fill="none" stroke-linecap="round"/>
        ${isGirl ? `<ellipse cx="106" cy="98" rx="8" ry="20" fill="#3a2415" transform="rotate(25 106 98)"/>` : ""}
        <ellipse cx="86" cy="98" rx="26" ry="28" fill="#e8c19a"/>
        <path d="M60 94q4 -32 26 -32 22 0 26 32 -6 -16 -26 -16 -20 0 -26 16Z" fill="#3a2415"/>
        <path d="M76 104 q4 3 8 0" stroke="#241a10" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <path d="M92 104 q4 3 8 0" stroke="#241a10" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <path d="M78 122 Q86 116 94 122" stroke="#241a10" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        <ellipse cx="78" cy="114" rx="2.4" ry="4" fill="#7dd0ff"/>
      </g>
    `);
  }

  /* (Legacy — kept for reference; no longer used by mall_sports) */
  function _treadmillRun(speed, isGirl) {
    // Speed dial: 1..10 → arc fill colour; faster speed = more motion lines.
    const speedColor = speed >= 8 ? "#e2484d" : speed >= 5 ? "#f0b53a" : "#6fe3d2";
    const dialAngle = -120 + (speed / 10) * 240;     // -120° .. +120°
    const mphLabel  = (3 + speed * 1.4).toFixed(1);  // 3.0 .. 17.0 mph
    // Pre-build motion lines based on speed
    let motion = "";
    const lines = Math.min(8, 1 + speed);
    for (let i = 0; i < lines; i++) {
      const y = 188 + i * 6;
      const len = 18 + (speed * 2) + (i % 2 === 0 ? 6 : 0);
      motion += `<line x1="${24 - len}" y1="${y}" x2="24" y2="${y}" stroke="#7dd0ff" stroke-width="2.5" opacity="${0.35 + i * 0.06}"/>`;
    }

    // Arms — pumping (front/back). Run-cycle alternation based on speed parity.
    const armBack = speed % 2 === 0;
    const lFront = armBack ? "M88 184 Q72 200 70 222" : "M88 184 Q104 196 110 218";
    const rFront = armBack ? "M124 184 Q140 196 144 218" : "M124 184 Q108 200 106 222";

    return svg("0 0 280 320", `
      <ellipse cx="140" cy="298" rx="120" ry="10" fill="#000" opacity=".45"/>

      <!-- Treadmill base / belt -->
      <rect x="36" y="232" width="208" height="36" rx="6" fill="#1f2436" stroke="#3a4868" stroke-width="2"/>
      <rect x="42" y="238" width="196" height="24" rx="3" fill="#0e1220"/>
      <!-- Belt rollers (front/back) -->
      <circle cx="44" cy="250" r="8" fill="#5a6478" stroke="#222" stroke-width="1"/>
      <circle cx="236" cy="250" r="8" fill="#5a6478" stroke="#222" stroke-width="1"/>
      <!-- Belt tread marks (scrolling lines) -->
      <g id="bbelt">
        <path d="M58 250 L70 250 M82 250 L96 250 M108 250 L124 250 M138 250 L156 250 M170 250 L186 250 M200 250 L218 250" stroke="#3a4868" stroke-width="2"/>
      </g>
      <!-- Side rails -->
      <rect x="34" y="226" width="6" height="60" rx="2" fill="#3a4868"/>
      <rect x="240" y="226" width="6" height="60" rx="2" fill="#3a4868"/>

      <!-- Treadmill console (vertical post + screen) -->
      <rect x="148" y="86" width="8" height="148" fill="#3a4868"/>
      <rect x="100" y="68" width="104" height="48" rx="6" fill="#1a2030" stroke="#5a6478" stroke-width="1.5"/>
      <rect x="106" y="74" width="92" height="22" rx="2" fill="#0e1220"/>
      <text x="152" y="91" text-anchor="middle" fill="${speedColor}" font-family="Georgia" font-size="14" font-weight="800">${mphLabel} mph</text>
      <!-- Mini speed dial -->
      <circle cx="152" cy="106" r="6" fill="#0e1220" stroke="#5a6478" stroke-width="1"/>
      <line x1="152" y1="106" x2="${152 + Math.cos(dialAngle * Math.PI / 180) * 5}" y2="${106 + Math.sin(dialAngle * Math.PI / 180) * 5}" stroke="${speedColor}" stroke-width="2"/>

      <!-- Motion lines BEHIND the kid -->
      ${motion}

      <!-- LEGS (mid-stride) -->
      <path d="M100 224 Q92 244 84 232" stroke="#2c3550" stroke-width="20" fill="none" stroke-linecap="round"/>
      <path d="M116 224 Q120 250 134 234" stroke="#2c3550" stroke-width="20" fill="none" stroke-linecap="round"/>
      <ellipse cx="80" cy="234" rx="14" ry="6" fill="#e8e8ee"/>
      <ellipse cx="138" cy="236" rx="14" ry="6" fill="#e8e8ee"/>
      <path d="M68 234h22" stroke="#e2484d" stroke-width="2"/>
      <path d="M126 236h22" stroke="#e2484d" stroke-width="2"/>

      <!-- Torso (tank top) -->
      <path d="M86 156 Q108 146 132 156 L130 218 Q108 226 88 218 Z" fill="#c43a44"/>
      <path d="M108 152 L108 222" stroke="#8a1f28" stroke-width="2" opacity=".5"/>
      <path d="M94 152 L102 138 M122 152 L114 138" stroke="#a32a34" stroke-width="5"/>

      <!-- ARMS (pumping run) -->
      <path d="${lFront}" stroke="#d9b08a" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="${rFront}" stroke="#d9b08a" stroke-width="14" fill="none" stroke-linecap="round"/>

      <!-- Ponytail behind head -->
      ${isGirl ? `<ellipse cx="138" cy="142" rx="8" ry="20" fill="#3a2415" transform="rotate(35 138 142)"/>
                  <ellipse cx="138" cy="128" rx="4" ry="2.5" fill="#e2484d"/>` : ""}
      <!-- Head -->
      <ellipse cx="108" cy="124" rx="26" ry="28" fill="#e8c19a"/>
      <path d="M82 120q4 -32 26 -32 22 0 26 32 -6 -16 -26 -16 -20 0 -26 16Z" fill="#3a2415"/>
      <!-- Headband -->
      <rect x="80" y="116" width="56" height="9" rx="3" fill="#e2484d"/>
      <!-- Focused eyes -->
      <circle cx="100" cy="128" r="3" fill="#241a10"/>
      <circle cx="118" cy="128" r="3" fill="#241a10"/>
      <!-- Open mouth (panting) -->
      <ellipse cx="108" cy="142" rx="6" ry="3.5" fill="#1a1208"/>

      <!-- Sweat drops -->
      <ellipse cx="80" cy="116" rx="2.8" ry="4.5" fill="#7dd0ff" opacity=".85"/>
      <ellipse cx="136" cy="118" rx="2.8" ry="4.5" fill="#7dd0ff" opacity=".85"/>

      <!-- Speed label above console -->
      <text x="152" y="62" text-anchor="middle" fill="${speedColor}" font-family="Georgia" font-size="18" font-weight="800">SPEED ${speed}/10</text>
    `);
  }

  function _legFlexPose(isGirl) {
    return svg("0 0 280 320", `
      <ellipse cx="140" cy="298" rx="110" ry="11" fill="#000" opacity=".55"/>
      <circle cx="140" cy="180" r="140" fill="#f0b53a" opacity=".10"/>
      <circle cx="140" cy="180" r="92" fill="#f0b53a" opacity=".08"/>

      <!-- Power stance — wide legs, fists on hips, calf + thigh muscles popping -->
      <!-- LEFT leg (player-left, viewer-left) with thick muscles -->
      <path d="M108 198 Q86 240 88 296" stroke="#d9b08a" stroke-width="34" fill="none" stroke-linecap="round"/>
      <ellipse cx="84" cy="246" rx="20" ry="30" fill="#e8c19a" transform="rotate(-12 84 246)"/>   <!-- thigh -->
      <ellipse cx="80" cy="280" rx="14" ry="20" fill="#e8c19a" transform="rotate(-8 80 280)"/>   <!-- calf -->
      <path d="M70 256 Q72 276 70 290" stroke="#9a6a48" stroke-width="2" fill="none" opacity=".55"/>

      <!-- RIGHT leg -->
      <path d="M152 198 Q174 240 172 296" stroke="#d9b08a" stroke-width="34" fill="none" stroke-linecap="round"/>
      <ellipse cx="176" cy="246" rx="20" ry="30" fill="#e8c19a" transform="rotate(12 176 246)"/>
      <ellipse cx="180" cy="280" rx="14" ry="20" fill="#e8c19a" transform="rotate(8 180 280)"/>
      <path d="M190 256 Q188 276 190 290" stroke="#9a6a48" stroke-width="2" fill="none" opacity=".55"/>

      <!-- Sneakers -->
      <ellipse cx="72" cy="298" rx="20" ry="7" fill="#e8e8ee"/>
      <ellipse cx="188" cy="298" rx="20" ry="7" fill="#e8e8ee"/>

      <!-- Shorts -->
      <path d="M88 180 Q130 172 172 180 L168 218 Q130 226 92 218 Z" fill="#2c3550"/>

      <!-- Torso -->
      <path d="M92 132 Q130 122 168 132 L172 188 Q130 198 88 188 Z" fill="#c43a44"/>
      <path d="M130 130 L130 196" stroke="#8a1f28" stroke-width="2" opacity=".5"/>

      <!-- Arms (fists on hips, biceps showing) -->
      <path d="M96 134 Q70 158 88 188" stroke="#d9b08a" stroke-width="18" fill="none" stroke-linecap="round"/>
      <path d="M164 134 Q190 158 172 188" stroke="#d9b08a" stroke-width="18" fill="none" stroke-linecap="round"/>
      <ellipse cx="76" cy="156" rx="14" ry="20" fill="#e8c19a" transform="rotate(-18 76 156)"/>
      <ellipse cx="184" cy="156" rx="14" ry="20" fill="#e8c19a" transform="rotate(18 184 156)"/>
      <circle cx="92" cy="188" r="10" fill="#d9b08a"/>
      <circle cx="168" cy="188" r="10" fill="#d9b08a"/>

      ${isGirl ? `<ellipse cx="158" cy="118" rx="8" ry="20" fill="#3a2415" transform="rotate(25 158 118)"/>` : ""}
      <!-- Head -->
      <ellipse cx="130" cy="100" rx="28" ry="30" fill="#e8c19a"/>
      <path d="M102 96q4 -34 28 -34 24 0 28 34 -6 -18 -28 -18 -22 0 -28 18Z" fill="#3a2415"/>
      <rect x="98" y="90" width="64" height="11" rx="3" fill="#e2484d"/>
      <!-- Happy ^^ eyes -->
      <path d="M114 106 q5 -6 10 0" stroke="#241a10" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M136 106 q5 -6 10 0" stroke="#241a10" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Big smile -->
      <path d="M112 118 Q130 138 148 118 Q130 130 112 118 Z" fill="#fff" stroke="#241a10" stroke-width="2.2"/>

      <!-- Victory stars + emoji -->
      <g fill="#f0b53a">
        <path d="M28 60 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z"/>
        <path d="M242 60 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z"/>
        <path d="M18 200 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" opacity=".7"/>
        <path d="M252 200 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" opacity=".7"/>
      </g>
      <text x="140" y="44" text-anchor="middle" fill="#f0b53a" font-family="Georgia" font-size="20" font-weight="800">STRONG LEGS!</text>
    `);
  }

  function _treadmillFallPose(isGirl) {
    return svg("0 0 280 260", `
      <ellipse cx="140" cy="240" rx="124" ry="10" fill="#000" opacity=".55"/>

      <!-- Broken treadmill in the background -->
      <rect x="36" y="180" width="208" height="40" rx="6" fill="#1f2436" stroke="#3a4868" stroke-width="2"/>
      <!-- Belt torn / split -->
      <rect x="42" y="186" width="92" height="28" rx="2" fill="#0e1220"/>
      <rect x="148" y="186" width="90" height="28" rx="2" fill="#0e1220" transform="rotate(8 193 200)"/>
      <path d="M134 188 L150 214 M138 184 L156 210" stroke="#e2484d" stroke-width="3"/>
      <!-- Sparks -->
      <g fill="#f0b53a">
        <path d="M140 174 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z"/>
        <circle cx="156" cy="180" r="3" opacity=".85"/>
        <circle cx="130" cy="184" r="2.5" opacity=".75"/>
      </g>
      <text x="140" y="166" text-anchor="middle" fill="#e2484d" font-family="Georgia" font-size="18" font-weight="800">BROKEN!</text>

      <!-- Kid lying flat (sliding off) -->
      <g>
        <path d="M170 144 L228 134" stroke="#2c3550" stroke-width="22" stroke-linecap="round"/>
        <path d="M170 156 L228 166" stroke="#2c3550" stroke-width="22" stroke-linecap="round"/>
        <ellipse cx="232" cy="132" rx="14" ry="6" fill="#e8e8ee"/>
        <ellipse cx="232" cy="168" rx="14" ry="6" fill="#e8e8ee"/>
        <ellipse cx="120" cy="150" rx="56" ry="22" fill="#c43a44"/>
        <path d="M76 146 Q52 168 46 184" stroke="#d9b08a" stroke-width="18" stroke-linecap="round" fill="none"/>
        <path d="M76 156 Q50 134 50 118" stroke="#d9b08a" stroke-width="18" stroke-linecap="round" fill="none"/>
        ${isGirl ? `<ellipse cx="32" cy="162" rx="8" ry="20" fill="#3a2415" transform="rotate(50 32 162)"/>` : ""}
        <ellipse cx="60" cy="146" rx="28" ry="26" fill="#e8c19a"/>
        <path d="M32 148q-2 -30 26 -30 28 0 28 30 -8 -16 -28 -16 -22 0 -26 16Z" fill="#3a2415"/>
        <rect x="34" y="142" width="54" height="9" rx="3" fill="#e2484d"/>
        <!-- Bump -->
        <ellipse cx="48" cy="126" rx="9" ry="5" fill="#d8a070"/>
        <!-- X eyes -->
        <path d="M48 150 L56 158 M48 158 L56 150" stroke="#241a10" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M64 150 L72 158 M64 158 L72 150" stroke="#241a10" stroke-width="2.6" stroke-linecap="round"/>
        <ellipse cx="60" cy="166" rx="7" ry="3" fill="#1a1208"/>
      </g>
    `);
  }

  /* ---------------- SHOOTER POSE: kid with toy gun + target board ---------------- */
  function shooterPose(hits, stage, gender) {
    hits = Math.max(0, Math.min(10, hits));
    const isGirl = gender === "girl";
    if (stage === "jump") return _shooterJump(hits, isGirl);
    if (stage === "fall") return _shooterFall(isGirl);
    return _shooterAim(hits, stage === "miss", isGirl);
  }

  function _shooterAim(hits, missed, isGirl) {
    // Wider viewBox + smaller target — clearly further from the player.
    // Player is on the left (head ~x=82). Target sits far to the right with
    // a long aim line and perspective floor lines between them.
    const TARGET_CX = 380, TARGET_CY = 130, TARGET_R = 38;
    let holes = "";
    for (let i = 0; i < hits; i++) {
      const ang  = i * 0.9;
      const rad  = Math.min(TARGET_R - 6, 3 + i * 4);
      const hx   = TARGET_CX + Math.cos(ang) * rad;
      const hy   = TARGET_CY + Math.sin(ang) * rad;
      holes += `<circle cx="${hx}" cy="${hy}" r="2.4" fill="#1a1208"/>
                <circle cx="${hx}" cy="${hy}" r="4" fill="none" stroke="#fff" stroke-width="1" opacity=".7"/>`;
    }
    const miss = missed
      ? `<g>
           <circle cx="${TARGET_CX + 52}" cy="${TARGET_CY - 14}" r="2.6" fill="#1a1208"/>
           <text x="${TARGET_CX + 66}" y="${TARGET_CY - 18}" fill="#e2484d" font-family="Georgia" font-size="14" font-weight="800">MISS!</text>
         </g>` : "";

    return svg("0 0 460 320", `
      <ellipse cx="230" cy="298" rx="200" ry="10" fill="#000" opacity=".45"/>

      <!-- Shooting range floor stripe -->
      <rect x="0" y="276" width="460" height="6" fill="#3a2a52" opacity=".5"/>
      <!-- Perspective floor lines suggesting distance from player to target -->
      <path d="M120 282 L300 270 M120 290 L300 274 M180 296 L320 278"
            stroke="#5a4a82" stroke-width="1.6" opacity=".55"/>
      <!-- 'Far' divider stripe near the target wall -->
      <rect x="${TARGET_CX - 80}" y="260" width="160" height="3" fill="#3a2a52" opacity=".45"/>

      <!-- TARGET BOARD on the FAR right -->
      <!-- Stand -->
      <rect x="${TARGET_CX - 4}" y="${TARGET_CY + TARGET_R}" width="8" height="92" fill="#5a4a32"/>
      <rect x="${TARGET_CX - 22}" y="${TARGET_CY + TARGET_R + 88}" width="44" height="6" rx="2" fill="#3a2a18"/>
      <!-- Concentric rings -->
      <circle cx="${TARGET_CX}" cy="${TARGET_CY}" r="${TARGET_R}"      fill="#f4f4f4" stroke="#222" stroke-width="2"/>
      <circle cx="${TARGET_CX}" cy="${TARGET_CY}" r="${TARGET_R*.78}"  fill="#3a567a" stroke="#222" stroke-width="1"/>
      <circle cx="${TARGET_CX}" cy="${TARGET_CY}" r="${TARGET_R*.55}"  fill="#f4f4f4" stroke="#222" stroke-width="1"/>
      <circle cx="${TARGET_CX}" cy="${TARGET_CY}" r="${TARGET_R*.34}"  fill="#e2484d" stroke="#222" stroke-width="1"/>
      <circle cx="${TARGET_CX}" cy="${TARGET_CY}" r="${TARGET_R*.14}"  fill="#f0b53a" stroke="#7a5424" stroke-width="1"/>
      <!-- Bullet holes -->
      ${holes}
      ${miss}
      <!-- Hits counter above target -->
      <text x="${TARGET_CX}" y="${TARGET_CY - TARGET_R - 14}" text-anchor="middle" fill="#f0b53a" font-family="Georgia" font-size="18" font-weight="800">HITS ${hits}/10</text>
      <!-- Distance label between player and target -->
      <text x="270" y="252" text-anchor="middle" fill="#9a8fb3" font-family="Georgia" font-size="11" font-weight="700" opacity=".75">— 10 metres —</text>

      <!-- PLAYER on the left, aiming right -->
      <!-- Legs -->
      <rect x="62" y="222" width="14" height="56" rx="6" fill="#2c3550"/>
      <rect x="86" y="222" width="14" height="56" rx="6" fill="#2c3550"/>
      <ellipse cx="68" cy="282" rx="14" ry="6" fill="#e8e8ee"/>
      <ellipse cx="92" cy="282" rx="14" ry="6" fill="#e8e8ee"/>

      <!-- Torso -->
      <path d="M52 168 Q82 158 110 168 L106 226 Q82 234 56 226 Z" fill="#c43a44"/>
      <path d="M82 166 L82 230" stroke="#8a1f28" stroke-width="2" opacity=".5"/>

      <!-- Arms — both forward, holding the gun toward the target -->
      <path d="M70 178 Q120 184 158 178" stroke="#d9b08a" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="M94 184 Q130 188 158 184" stroke="#d9b08a" stroke-width="12" fill="none" stroke-linecap="round"/>
      <circle cx="158" cy="180" r="10" fill="#d9b08a"/>

      <!-- TOY GUN held forward -->
      <g>
        <rect x="148" y="172" width="40" height="14" rx="3" fill="#e2484d"/>
        <rect x="148" y="172" width="40" height="4" fill="#ff7a82"/>
        <rect x="146" y="180" width="8" height="18" rx="2" fill="#a32a34"/>
        <rect x="186" y="176" width="10" height="6" fill="#1a1a22"/>
        <circle cx="190" cy="179" r="2.5" fill="#f0b53a" filter="url(#glow)"/>
        <!-- Aim line -->
        <path d="M196 179 L${TARGET_CX - TARGET_R - 4} ${TARGET_CY}" stroke="#f0b53a" stroke-width="1" stroke-dasharray="3 4" opacity=".5"/>
      </g>

      ${isGirl ? `<ellipse cx="106" cy="138" rx="8" ry="20" fill="#3a2415" transform="rotate(25 106 138)"/>
                  <ellipse cx="106" cy="124" rx="4" ry="2.5" fill="#e2484d"/>` : ""}
      <!-- Head -->
      <ellipse cx="82" cy="130" rx="26" ry="28" fill="#e8c19a"/>
      <path d="M56 126q4 -32 26 -32 22 0 26 32 -6 -16 -26 -16 -20 0 -26 16Z" fill="#3a2415"/>
      <!-- Aiming eye + closed eye -->
      <path d="M70 134 q4 -3 8 0" stroke="#241a10" stroke-width="3" fill="none" stroke-linecap="round"/>  <!-- closed eye -->
      <circle cx="94" cy="134" r="3.6" fill="#241a10"/>                                                  <!-- open aiming eye -->
      <!-- Focused mouth -->
      <path d="M76 146 q6 3 12 0" stroke="#241a10" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <!-- Brow -->
      <path d="M68 124 L78 122 M90 122 L100 124" stroke="#241a10" stroke-width="2.4" stroke-linecap="round"/>
    `);
  }

  function _shooterJump(hits, isGirl) {
    return svg("0 0 320 320", `
      <ellipse cx="160" cy="294" rx="50" ry="6" fill="#000" opacity=".45"/>
      <circle cx="160" cy="160" r="150" fill="#f0b53a" opacity=".10"/>
      <circle cx="160" cy="160" r="100" fill="#f0b53a" opacity=".08"/>

      <!-- Confetti / stars -->
      <g fill="#f0b53a">
        <path d="M40 60 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z"/>
        <path d="M276 60 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z"/>
        <path d="M22 200 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" opacity=".7"/>
        <path d="M286 200 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" opacity=".7"/>
        <circle cx="80" cy="90" r="4" opacity=".7"/>
        <circle cx="240" cy="100" r="4" opacity=".7"/>
        <circle cx="60" cy="240" r="3" opacity=".7"/>
        <circle cx="260" cy="240" r="3" opacity=".7"/>
      </g>

      <!-- JUMP: feet off the ground, arms up -->
      <!-- Legs tucked -->
      <path d="M142 210 Q126 240 130 268" stroke="#2c3550" stroke-width="22" fill="none" stroke-linecap="round"/>
      <path d="M178 210 Q194 240 190 268" stroke="#2c3550" stroke-width="22" fill="none" stroke-linecap="round"/>
      <ellipse cx="128" cy="270" rx="16" ry="6" fill="#e8e8ee"/>
      <ellipse cx="192" cy="270" rx="16" ry="6" fill="#e8e8ee"/>

      <!-- Torso -->
      <path d="M124 144 Q160 134 196 144 L192 206 Q160 214 128 206 Z" fill="#c43a44"/>
      <path d="M160 142 L160 210" stroke="#8a1f28" stroke-width="2" opacity=".5"/>

      <!-- Arms raised V -->
      <path d="M130 146 Q90 96 78 56"  stroke="#d9b08a" stroke-width="16" fill="none" stroke-linecap="round"/>
      <path d="M190 146 Q230 96 242 56" stroke="#d9b08a" stroke-width="16" fill="none" stroke-linecap="round"/>
      <circle cx="76" cy="54" r="11" fill="#d9b08a"/>
      <circle cx="244" cy="54" r="11" fill="#d9b08a"/>
      <!-- Victory fingers -->
      <rect x="70" y="36" width="4" height="14" rx="1.5" fill="#d9b08a"/>
      <rect x="78" y="34" width="4" height="16" rx="1.5" fill="#d9b08a"/>
      <rect x="238" y="36" width="4" height="14" rx="1.5" fill="#d9b08a"/>
      <rect x="246" y="34" width="4" height="16" rx="1.5" fill="#d9b08a"/>

      ${isGirl ? `<ellipse cx="184" cy="110" rx="8" ry="22" fill="#3a2415" transform="rotate(25 184 110)"/>` : ""}
      <!-- Head -->
      <ellipse cx="160" cy="108" rx="28" ry="30" fill="#e8c19a"/>
      <path d="M132 104q4 -34 28 -34 24 0 28 34 -6 -18 -28 -18 -22 0 -28 18Z" fill="#3a2415"/>
      <!-- ^^ eyes -->
      <path d="M144 114 q5 -6 10 0" stroke="#241a10" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M166 114 q5 -6 10 0" stroke="#241a10" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Big smile -->
      <path d="M142 126 Q160 146 178 126 Q160 138 142 126 Z" fill="#fff" stroke="#241a10" stroke-width="2.2"/>

      <text x="160" y="44" text-anchor="middle" fill="#f0b53a" font-family="Georgia" font-size="20" font-weight="800">PRO SHOOTER!</text>
      <text x="160" y="294" text-anchor="middle" fill="#fff" font-family="Georgia" font-size="14" font-weight="800" opacity=".85">${hits}/10 HITS</text>
    `);
  }

  function _shooterFall(isGirl) {
    return svg("0 0 320 260", `
      <ellipse cx="160" cy="240" rx="120" ry="10" fill="#000" opacity=".55"/>

      <!-- Broken toy gun on the floor -->
      <g transform="translate(170 196) rotate(-18)">
        <rect x="-20" y="-7" width="38" height="12" rx="3" fill="#e2484d"/>
        <rect x="-20" y="-7" width="38" height="3" fill="#ff7a82"/>
        <rect x="-22" y="-1" width="8" height="14" rx="2" fill="#a32a34"/>
        <!-- Cracks -->
        <path d="M-6 -7 L-2 6 L4 -3 L10 6" stroke="#1a1208" stroke-width="1.8" fill="none"/>
        <path d="M-14 -2 L14 -2" stroke="#1a1208" stroke-width="1" opacity=".6"/>
      </g>
      <text x="200" y="166" fill="#e2484d" font-family="Georgia" font-size="18" font-weight="800">BROKEN!</text>
      <g fill="#f0b53a">
        <path d="M212 184 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z"/>
        <circle cx="190" cy="180" r="2.5" opacity=".8"/>
      </g>

      <!-- Sad target board -->
      <g transform="translate(252 110)">
        <circle r="40" fill="#f4f4f4" stroke="#222" stroke-width="2"/>
        <circle r="30" fill="#3a567a"/>
        <circle r="20" fill="#f4f4f4"/>
        <circle r="12" fill="#e2484d"/>
        <circle r="5"  fill="#f0b53a"/>
        <!-- No holes — disappointed -->
      </g>

      <!-- Kid sitting dejected on the left -->
      <g>
        <!-- Legs out -->
        <path d="M86 196 L156 200" stroke="#2c3550" stroke-width="22" stroke-linecap="round"/>
        <ellipse cx="160" cy="200" rx="14" ry="6" fill="#e8e8ee"/>
        <!-- Torso slumped -->
        <path d="M58 132 Q92 124 116 132 L120 196 Q88 204 56 196 Z" fill="#c43a44"/>
        <!-- Arms slack -->
        <path d="M68 140 Q56 178 76 200" stroke="#d9b08a" stroke-width="16" fill="none" stroke-linecap="round"/>
        <path d="M108 140 Q132 168 124 196" stroke="#d9b08a" stroke-width="16" fill="none" stroke-linecap="round"/>

        ${isGirl ? `<ellipse cx="106" cy="98" rx="8" ry="20" fill="#3a2415" transform="rotate(25 106 98)"/>` : ""}
        <ellipse cx="86" cy="98" rx="26" ry="28" fill="#e8c19a"/>
        <path d="M60 94q4 -32 26 -32 22 0 26 32 -6 -16 -26 -16 -20 0 -26 16Z" fill="#3a2415"/>
        <!-- Sad eyes -->
        <path d="M76 104 q4 3 8 0" stroke="#241a10" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <path d="M92 104 q4 3 8 0" stroke="#241a10" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <!-- Frown -->
        <path d="M78 122 Q86 116 94 122" stroke="#241a10" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        <!-- Tear -->
        <ellipse cx="78" cy="114" rx="2.4" ry="4" fill="#7dd0ff"/>
      </g>
    `);
  }

  window.ART = {
    monster: (id) => (MON[id] || MON.shadow_ghost)(),
    room: (id) => (ROOM[id] || ROOM.basement)(),
    mansion, mallExterior, player, gymPose, studyPose, footballPose, shooterPose, heart, coin: "🪙", key: "🗝️"
  };
})();
