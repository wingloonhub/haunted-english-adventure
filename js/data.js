/* data.js — mansion, rooms, monsters and shop config */
(function () {
  "use strict";

  // 12 rooms. type: "key" gives a key, "loot" gives coins only, "shop", "boss".
  const ROOMS = [
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

  const MANSION = {
    id: "haunted_monster_mansion",
    name: "Haunted Monster Mansion",
    rooms: ROOMS,
    startLives: 3,        // lives you get inside each room
    monsterSteps: 5,      // steps the monster starts away from you
    shieldChance: 0.14,   // per-hit odds, but also capped at 1-3 shields for the whole run
    coinsPerKill: 30,
    // a room with a key must be cleared to earn its key; basement needs all keyRoomIds.length keys
    keyRoomIds: ROOMS.filter(r => r.type === "key").map(r => r.id)
  };

  // Shop items. effect handled in game.js. "once": can only be owned/bought once.
  const ITEMS = {
    bandage:  { name: "Bandage",       icon: "🩹", cost: 30,  desc: "Adds 1 life. Use once during a battle.",         kind: "heal",   amount: 1 },
    shield:   { name: "Shield",        icon: "🛡️", cost: 50,  desc: "Blocks 1 monster attack. Use once.",             kind: "block" },
    sling:    { name: "Sling Weapon",  icon: "🪃", cost: 100, desc: "Your next correct answer counts double toward defeating the monster.", kind: "weapon", amount: 2 },
    burger:   { name: "Burger",        icon: "🍔", cost: 200, desc: "Adds +1 starting life in every room of this mansion. One-time purchase per mansion.", kind: "maxlife", once: true },
    firstaid: { name: "First Aid Kit", icon: "🧰", cost: 100, desc: "Adds 2 lives. Use once during a battle.",        kind: "heal",   amount: 2 }
  };

  function room(id) { return ROOMS.find(r => r.id === id); }

  window.DATA = { MANSION, ROOMS, ITEMS, room };
})();
