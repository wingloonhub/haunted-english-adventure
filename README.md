# The Haunted English Adventure 🕯️

A browser game that teaches the **Year 3 international English syllabus**
(nouns, verbs, tenses, pronouns, adjectives, punctuation, sentence
structure, reading comprehension and more) by fighting monsters in a
haunted mansion. Built from the exam papers in the `Materials` folder,
with many extra question variations so questions don't repeat in a battle.

- **No build step.** Plain HTML/CSS/JavaScript — same approach as your
  trading dashboard. Upload to GitHub → Vercel hosts it → Firebase saves
  progress and powers email login + the Parent Report.
- Works **right now on this device** even before you set up Firebase
  (it shows a "Play now on this device" button). Email login + cloud
  save + cross-device Parent Report turn on once you do **Step 2**.

---

## What to upload

Upload **the contents of this `game` folder only** (the folder that has
`index.html`). Do **not** upload the `Materials` folder or `server.pl`
(that file is only used for previewing on the PC and is not needed
online).

```
game/
  index.html
  vercel.json
  firestore.rules
  css/style.css
  js/...
```

---

## Step 1 — Put the game on GitHub

1. Go to <https://github.com/new> and create a new repository, e.g.
   `haunted-english-mansion`. Make it **Public** (or Private — both work
   with Vercel). Click **Create repository**.
2. On the new repo page click **uploading an existing file**.
3. Open the `game` folder on your PC, select **everything inside it**
   (the `index.html`, the `css` folder, the `js` folder, etc.) and drag
   them into the GitHub upload box.
4. Click **Commit changes**.

## Step 2 — Firebase (email login + cloud save + Parent Report sync)

You can reuse your Google/Firebase account.

1. Go to <https://console.firebase.google.com> → **Add project**
   (e.g. `haunted-mansion`). You can skip Google Analytics.
2. **Authentication** → *Get started* → **Sign-in method** → enable
   **Email/Password** → Save.
3. **Build → Firestore Database** → *Create database* → **Start in
   production mode** → pick a location → *Enable*.
4. Firestore → **Rules** tab → delete what's there, paste the contents
   of `firestore.rules` (in this folder) → **Publish**.
5. **Project settings** (gear icon, top-left) → scroll to **Your apps**
   → click the **`</>`** (Web) icon → give it a nickname → **Register
   app**. Firebase shows a `firebaseConfig = { ... }` block.
6. Open `js/firebase-config.js` on your PC and paste the 6 values
   between the quotes (apiKey, authDomain, projectId, storageBucket,
   messagingSenderId, appId). Save the file.
7. Re-upload **`js/firebase-config.js`** to GitHub (open the file on
   GitHub → pencil icon → paste → Commit), **or** just re-drag the whole
   `js` folder.

> Until Step 2 is done the game still works, but it only saves on the
> one device and there's no login.

## Step 3 — Deploy on Vercel

1. Go to <https://vercel.com> → **Add New… → Project**.
2. **Import** the GitHub repo you created in Step 1.
3. Leave all settings default (Framework Preset: *Other*, no build
   command). Click **Deploy**.
4. After ~30 seconds you get a live URL like
   `https://haunted-english-mansion.vercel.app`.

### One last Firebase setting (so login works on the live site)

Firebase console → **Authentication → Settings → Authorized domains →
Add domain** → paste your Vercel domain (e.g.
`haunted-english-mansion.vercel.app`). Without this, login is blocked on
the live site.

## Step 4 — Play & test

Open the Vercel URL. Create an account with any email + a password
(6+ characters), then **Enter the Mansion**. Sign in with the same email
on a phone — your coins, keys and Parent Report follow you.

---

## How the game works (quick reference)

- **Menu → Choose a Mansion → Room map.** Pick any room. The **Basement**
  (final boss, *The Mansion King*) unlocks only after you have all **10
  keys**.
- **In a room:** 3 lives. The monster stands on the right with **10
  lives** (the Mansion King boss has 15) and creeps toward the boy on the
  left. Answer the English question:
  - **Correct** → your boy fires his **Torch Light** beam — the monster
    loses 1 life and is pushed back. If the **Sling** is armed, he throws
    a stone instead and the monster loses **2 lives**.
  - **Wrong** → the monster **walks one step to the left** (toward the
    boy). No life is lost while it is still away. Once it is **right next
    to you**, every further wrong answer = **−1 life**. A
    **Shield** (if armed) blocks one strike.
  - Beat the monster (HP = 0) → it falls, you get the room **key** + **30
    coins**.
- **0 lives → Game Over** → the whole mansion resets: all coins and keys
  for this mansion are lost.
- **Store Room:** spend coins on Bandage, Shield, Sling, First Aid Kit,
  Burger. You choose when to use items during a battle.
- **Escape:** beat The Mansion King to escape. Coins stay available in
  that mansion afterwards.
- **Parent Report** (on the main menu): per-topic accuracy, weak topics
  highlighted in red, and recent mistakes — so you can see exactly which
  English topics need practice.

## Adding more mansions later

Everything for one mansion lives in `js/data.js` (`ROOMS` + `MANSION`).
A second mansion = another rooms list with its own monsters/topics; the
mansion-select screen and per-mansion coin wallet are already built to
support it.

## Editing or adding questions

All questions are in `js/questions.js`, grouped by topic. Each is
`{ q, options:[...], answer:indexOfCorrectOption }`. Add more to any
topic array and re-upload the file — no other changes needed.
