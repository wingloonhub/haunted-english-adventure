/* data.js — mansions, rooms, monsters and shop items.
   Now supports multiple mansions; the haunted mansion is mansion #1, the
   zombie shopping mall is mansion #2 (unlocks after escaping #1). */
(function () {
  "use strict";

  /* =============================================================================
     MANSION 1 — Haunted Monster Mansion
     ============================================================================= */
  const HAUNTED_ROOMS = [
    { id: "garden",         name: "Garden",         type: "key",  topic: "nouns",              topicLabel: "Nouns",                monster: "shadow_ghost",      monsterName: "The Shadow Ghost",   hp: 10 },
    { id: "library",        name: "Library",        type: "key",  topic: "verbs",              topicLabel: "Verbs",                monster: "red_eye_beast",     monsterName: "The Red-Eye Beast",  hp: 10 },
    { id: "dining",         name: "Dining Room",    type: "key",  topic: "present_tense",      topicLabel: "Present Tense",        monster: "laughing_clown",    monsterName: "The Laughing Clown", hp: 10 },
    { id: "bedroom",        name: "Bedroom",        type: "key",  topic: "pronouns",           topicLabel: "Pronouns",             monster: "dark_hall_monster", monsterName: "Dark Hall Monster",  hp: 10 },
    { id: "kitchen",        name: "Kitchen",        type: "key",  topic: "adjectives",         topicLabel: "Adjectives",           monster: "mirror_ghost",      monsterName: "The Mirror Ghost",   hp: 10 },
    { id: "bathroom",       name: "Bathroom",       type: "key",  topic: "punctuation",        topicLabel: "Punctuation",          monster: "doorway_demon",     monsterName: "The Doorway Demon",  hp: 10 },
    { id: "living",         name: "Living Room",    type: "key",  topic: "sentence_order",     topicLabel: "Sentence Building",    monster: "white_mask_ghost",  monsterName: "The White Mask Ghost", hp: 10 },
    { id: "master_bedroom", name: "Master Bedroom", type: "key",  topic: "comprehension",      topicLabel: "Reading Comprehension", monster: "crawling_shade",   monsterName: "The Crawling Shade", hp: 10 },
    { id: "laundry",        name: "Laundry Room",   type: "key",  topic: "spelling",           topicLabel: "Spelling",             monster: "soap_phantom",      monsterName: "The Soap Phantom",   hp: 10 },
    { id: "ballroom",       name: "Ballroom",       type: "key",  topic: "grammar_logic",      topicLabel: "Grammar Logic",        monster: "masquerade_ghost",  monsterName: "The Masquerade Ghost", hp: 10 },
    { id: "study",          name: "Study Room",     type: "loot", topic: "sentence_order",     topicLabel: "Sentence Building",    monster: "whispering_wraith", monsterName: "The Whispering Wraith", hp: 10 },
    { id: "gym",            name: "Gym Room",       type: "loot", topic: "grammar_logic",      topicLabel: "Grammar Logic",        monster: "iron_phantom",      monsterName: "The Iron Phantom",   hp: 10 },
    { id: "store",          name: "Store Room",     type: "shop", topic: null,                 topicLabel: "Shop",                 monster: null,                monsterName: null,                 hp: 0 },
    { id: "basement",       name: "The Basement",   type: "boss", topic: "mixed",              topicLabel: "Final Boss — Everything", monster: "mansion_king",   monsterName: "The Mansion King",   hp: 15 }
  ];

  /* =============================================================================
     MANSION 2 — Zombie Shopping Mall
     ============================================================================= */
  const MALL_ROOMS = [
    { id: "mall_top_shop", name: "Cursed Top Shop", type: "key", topic: "nouns", topicLabel: "Nouns",
      monster: "z_office", monsterName: "The Fashion Victim", hp: 6,
      waveList: [
        { monster: "z_office",  monsterName: "The Fashion Victim" },
        { monster: "z_bandage", monsterName: "The Stitched Mannequin" },
        { monster: "z_jaw",     monsterName: "The Last Shopper" }
      ] },
    { id: "mall_arcade", name: "Time Trap Arcade", type: "key", topic: "present_tense", topicLabel: "Present & Past Tense",
      monster: "z_drool", monsterName: "The High Scorer", hp: 6,
      waveList: [
        { monster: "z_drool",  monsterName: "The High Scorer" },
        { monster: "z_brain",  monsterName: "The Glitched Gamer" },
        { monster: "z_hollow", monsterName: "The Forgotten Player" }
      ] },
    { id: "mall_clothes", name: "Mirror Clothes Shop", type: "key", topic: "pronouns", topicLabel: "Pronouns",
      monster: "z_bandage", monsterName: "The Stitched One", hp: 6,
      waveList: [
        { monster: "z_bandage", monsterName: "The Stitched One" },
        { monster: "z_office",  monsterName: "The Tailored Wraith" },
        { monster: "z_skull",   monsterName: "The Faceless Customer" }
      ] },
    { id: "mall_pet", name: "Zombie Pet Shop", type: "key", topic: "adjectives", topicLabel: "Adjectives",
      monster: "z_jaw", monsterName: "The Hungry Vet", hp: 6,
      waveList: [
        { monster: "z_jaw",     monsterName: "The Hungry Vet" },
        { monster: "z_drool",   monsterName: "The Bitten Owner" },
        { monster: "z_butcher", monsterName: "The Feeder" }
      ] },
    { id: "mall_cinema", name: "Screaming Cinema", type: "key", topic: "punctuation", topicLabel: "Punctuation",
      monster: "z_hollow", monsterName: "The Last Movie-Goer", hp: 6,
      waveList: [
        { monster: "z_hollow", monsterName: "The Last Movie-Goer" },
        { monster: "z_skull",  monsterName: "The Popcorn Crawler" },
        { monster: "z_old",    monsterName: "The Reel Wraith" }
      ] },
    { id: "mall_bookshop", name: "Whispering Bookshop", type: "key", topic: "sentence_order", topicLabel: "Sentence Building",
      monster: "z_old", monsterName: "The Old Librarian", hp: 6,
      waveList: [
        { monster: "z_old",    monsterName: "The Old Librarian" },
        { monster: "z_hollow", monsterName: "The Whispering Reader" },
        { monster: "z_skull",  monsterName: "The Bookworm" }
      ] },
    { id: "mall_computer", name: "Broken Computer Shop", type: "key", topic: "grammar_logic", topicLabel: "Grammar Logic",
      monster: "z_brain", monsterName: "The Tech Support", hp: 6,
      waveList: [
        { monster: "z_brain",  monsterName: "The Tech Support" },
        { monster: "z_office", monsterName: "The Help Desk Drone" },
        { monster: "z_drool",  monsterName: "The Cable Crawler" }
      ] },
    { id: "mall_food", name: "Ghost Food Court", type: "key", topic: "verbs", topicLabel: "Verbs",
      monster: "z_butcher", monsterName: "The Rotten Chef", hp: 6,
      waveList: [
        { monster: "z_butcher", monsterName: "The Rotten Chef" },
        { monster: "z_jaw",     monsterName: "The Drooling Diner" },
        { monster: "z_brain",   monsterName: "The Sticky Server" }
      ] },
    { id: "mall_watch", name: "Haunted Watch Shop", type: "key", topic: "spelling", topicLabel: "Spelling",
      monster: "z_skull", monsterName: "The Old Watchmaker", hp: 6,
      waveList: [
        { monster: "z_skull",   monsterName: "The Old Watchmaker" },
        { monster: "z_old",     monsterName: "The Time-Lost Customer" },
        { monster: "z_bandage", monsterName: "The Clock Wraith" }
      ] },
    { id: "mall_security", name: "Haunted Security Room", type: "key", topic: "comprehension", topicLabel: "Reading Comprehension",
      monster: "z_security", monsterName: "The Night Guard", hp: 6,
      waveList: [
        { monster: "z_security", monsterName: "The Night Guard" },
        { monster: "z_office",   monsterName: "The Lockdown Loiterer" },
        { monster: "z_hollow",   monsterName: "The Camera-Eye Watcher" }
      ] },
    { id: "mall_game_shop",     name: "Game Shop",              type: "loot", topic: "grammar_logic",  topicLabel: "Grammar Logic",         monster: null,         monsterName: null,                   hp: 10 },
    { id: "mall_sports",        name: "Sports Shop",            type: "loot", topic: "present_tense",  topicLabel: "Present & Past Tense",  monster: null,         monsterName: null,                   hp: 10 },
    { id: "mall_gift_wrap",     name: "Gift Wrap Zombie Shop",  type: "loot", topic: "noun_picker",    topicLabel: "Noun Picker",           monster: null,         monsterName: null,                   hp: 1, coinReward: 10 },
    { id: "mall_supermarket",   name: "Supermarket",            type: "shop", topic: null,             topicLabel: "Shop",                  monster: null,         monsterName: null,                   hp: 0 },
    { id: "mall_dead_hall",     name: "Dead Mall Hall",         type: "boss", topic: "mixed",          topicLabel: "Final Boss — Everything", monster: "zombie_hulk", monsterName: "The Zombie Hulk King", hp: 20 }
  ];

  const MANSIONS = [
    {
      id: "haunted_monster_mansion",
      name: "Haunted Monster Mansion",
      tagline: "Eight rooms, ten keys, one Mansion King.",
      rooms: HAUNTED_ROOMS,
      keyRoomIds: HAUNTED_ROOMS.filter(r => r.type === "key").map(r => r.id),
      startLives: 3,
      monsterSteps: 3,
      shieldChance: 0.14,
      coinsPerKill: 30,
      weapon: "torch",
      weaponLabel: "Torch Light",
      maxLifeItem: "burger",
      heavyWeaponItem: "sling",
      unlockedBy: null
    },
    {
      id: "zombie_mall",
      name: "Zombie Shopping Mall",
      tagline: "Grand Star Mall has gone bad. Defeat the zombies to escape.",
      rooms: MALL_ROOMS,
      keyRoomIds: MALL_ROOMS.filter(r => r.type === "key").map(r => r.id),
      startLives: 3,
      monsterSteps: 3,
      shieldChance: 0.14,
      coinsPerKill: 30,
      weapon: "bat",
      weaponLabel: "Baseball Bat",
      maxLifeItem: "pizza",
      heavyWeaponItem: "gun",
      unlockedBy: "haunted_monster_mansion"
    }
  ];

  /* ============================ ITEMS ============================ */
  const ITEMS = {
    bandage:  { name: "Bandage",       icon: "🩹", cost: 30,  desc: "Adds 1 life. Use once during a battle.",         kind: "heal",   amount: 1 },
    shield:   { name: "Shield",        icon: "🛡️", cost: 50,  desc: "Blocks 1 monster attack. Use once.",             kind: "block" },
    sling:    { name: "Sling Weapon",  icon: "🪃", cost: 100, desc: "Your next correct answer counts double toward defeating the monster.", kind: "weapon", amount: 2 },
    burger:   { name: "Burger",        icon: "🍔", cost: 200, desc: "Adds +1 starting life in every room of this mansion. One-time purchase per mansion.", kind: "maxlife", once: true },
    firstaid: { name: "First Aid Kit", icon: "🧰", cost: 100, desc: "Adds 2 lives. Use once during a battle.",        kind: "heal",   amount: 2 },
    /* zombie-mall flavoured items */
    gun:      { name: "Gun",           icon: "🔫", cost: 100, desc: "One shot per battle. Your next correct answer does 2 damage to the zombie.", kind: "weapon", amount: 2, oncePerBattle: true },
    pizza:    { name: "Pizza Slice",   icon: "🍕", cost: 200, desc: "Adds +1 starting life in every room of this mall. One-time purchase per mall.", kind: "maxlife", once: true }
  };

  /* ============================ HELPERS ============================ */
  function mansion(id) { return MANSIONS.find(m => m.id === id) || MANSIONS[0]; }
  function room(mid, rid) {
    // Backward-compat: room(id) without mansion id — search across all mansions.
    if (typeof rid === "undefined") { rid = mid; mid = null; }
    if (mid) { const m = mansion(mid); return m && m.rooms.find(r => r.id === rid); }
    for (let i = 0; i < MANSIONS.length; i++) {
      const r = MANSIONS[i].rooms.find(x => x.id === rid);
      if (r) return r;
    }
    return null;
  }
  function mansionForRoom(rid) {
    for (let i = 0; i < MANSIONS.length; i++) {
      if (MANSIONS[i].rooms.find(r => r.id === rid)) return MANSIONS[i];
    }
    return MANSIONS[0];
  }
  function isMansionUnlocked(mansionCfg, profile) {
    if (!mansionCfg.unlockedBy) return true;
    const m = profile && profile.mansions && profile.mansions[mansionCfg.unlockedBy];
    return !!(m && m.escaped);
  }

  /* =============================================================================
     EXAM PREPARATION — a separate section outside the map. No monsters, no art;
     each topic is a plain drill list. Questions are wired in later.
     ============================================================================= */
  const EXAM_PREP = [
    {
      id: "year3_sem2",
      label: "Year 3 – 2nd Semester",
      topics: [
        { id: "y3s2_pronouns",          label: "Pronouns" },
        { id: "y3s2_present_perfect",   label: "Present Perfect Tense" },
        { id: "y3s2_conjunctions",      label: "Conjunctions" },
        { id: "y3s2_prepositions",      label: "Prepositions" },
        { id: "y3s2_final_punctuation", label: "Final Punctuation" },
        { id: "y3s2_capital_letters",   label: "Capital Letters" },
        { id: "y3s2_spelling",          label: "Spelling" },
        { id: "y3s2_fantastic_mr_fox",  label: "Fantastic Mr. Fox" }
      ]
    }
  ];
  function examSet(setId)      { return EXAM_PREP.find(s => s.id === setId); }
  function examTopic(setId, topicId) {
    const s = examSet(setId);
    return s && s.topics.find(t => t.id === topicId);
  }

  // Back-compat shims: existing code that reads DATA.MANSION / DATA.ROOMS / DATA.room(id)
  // keeps working — they default to mansion #1.
  window.DATA = {
    MANSIONS, ITEMS, mansion, room, mansionForRoom, isMansionUnlocked,
    EXAM_PREP, examSet, examTopic,
    MANSION: MANSIONS[0],
    ROOMS:   MANSIONS[0].rooms
  };
})();
