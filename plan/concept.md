# Concept — three directions

Status: **waiting for Rishi's pick.** Nothing below is built yet.

## The brief, as I understood it

- **Purpose:** your own place first — you, your projects, interests, what you're learning and working towards. A blog comes later and must slot in without a redesign.
- **Vibe:** dark, bold, immersive, polished. Roughly 75% cinematic, 25% playful. Not corporate, not generic.
- **Positioning:** a software engineer and builder who turns ideas into practical products and refuses to be boxed into one domain (web, mobile, cybersecurity, blockchain).
- **Featured work:** English_Winglish, Pet_Agent, Tracker, Phishing-Email-Analyzer. Snake_Game as the fun project.
- **Interests:** gaming, music, sports & fitness, travel & mountains.
- **You on the site:** never the raw photos. A pixel treatment or a character of you.
- **Hard limits:** Lighthouse mobile Performance ≥ 90, LCP < 2 s, initial JS ≤ 180 KB gzipped, WebGL and video after first paint, static fallback without WebGL.

What I took from your reference sites: one interactive idea carried through the whole site (abhayrohit's drag-to-reveal world, vadimcarazan's fly-through), a clearly labelled playground for experiments (codeofsagar, madebyigor's lab), and very large, confident type on black.

Each concept below is one idea, not a bundle of effects.

---

## Concept A — RESOLVE

**Idea.** Everything on the site begins as chunky pixels and resolves into sharp detail. Low resolution is the idea; high resolution is the shipped product. The site's one visual device is that transition, used everywhere: your portrait, project media, page changes.

**You on the site.** A pixel-mosaic portrait generated from your photo, rendered in a single shader. It is never shown as a photograph: at rest it is coarse blocks in the site's two accent colours; near the cursor the blocks get finer, but stop well short of photographic.

**Why it fits you.** Your own line is "turning ideas into practical products" and "from concept to implementation". Pixel-to-sharp is that sentence made visible. It also covers the pixel style you asked for without turning the whole site into a retro game, which keeps the 75/25 balance. And it is domain-neutral, so web, mobile, security and blockchain projects all sit under it equally.

**Hero moment.** Black screen. Your name in huge type, built from large square blocks. Over about a second the blocks subdivide until the letters are crisp. Behind the name, the pixel portrait sits half in shadow; moving the cursor across it refines the blocks under the pointer, like focusing a lens.

**Three signature motion moments.**
1. **Name resolve** — the hero type subdividing from 8 blocks to crisp letterforms on load.
2. **Project resolve** — each case-study cover enters as a 12×8 colour grid and sharpens as it scrolls to centre; scrolling past coarsens it again.
3. **Pixel wipe** — page transitions dissolve out in a staggered block grid and resolve into the next page.

**The playful 25%.** A resolution dial in the corner that lets visitors drag the whole site between "8-bit" and "HD". Snake_Game playable in the playground at the lowest resolution.

**Risks.**
- The shader must stay cheap on phones. Mitigation: one small canvas, capped pixel ratio, pre-rendered image as fallback and as the LCP poster.
- Overuse makes it tiring. Mitigation: exactly the three moments above, nowhere else.
- Body text must never be pixelated — the device applies to display type and media only.

---

## Concept B — PLAYER ONE

**Idea.** The portfolio is the title screen and world map of a game about you. Cinematic lighting and big type, but the structure borrows from games: projects are levels, skills are a loadout, what you're learning is the quest log.

**You on the site.** A 16-bit pixel-art character of you — glasses, black tee — with idle, walk and celebrate animations. He walks along the bottom edge of the page as the visitor scrolls and reacts to what's on screen.

**Why it fits you.** Gaming is one of your interests and you've built a game. A character is the most direct answer to "make a character like me". The level structure also makes "what I'm working towards" natural: it's simply the locked level.

**Hero moment.** Dark stage, a single spotlight. "RISHI KANERIA" in heavy type, "PRESS START" blinking underneath. The pixel character drops in, lands, looks up at the name. Pressing any key or scrolling starts the walk.

**Three signature motion moments.**
1. **Drop-in** — character falls into the spotlight and lands with a small squash.
2. **Walk-along** — scroll position drives his walk cycle; he stops and turns to face each project as it arrives.
3. **Level select** — the work index is a horizontal level map; choosing a level zooms through its tile into the case study.

**The playful 25%.** Here it is closer to 50%. Snake_Game is the bonus level; a hidden cheat code changes his outfit.

**Risks.**
- "Game portfolio" is a well-worn idea; it is hard to make feel new, and juries have seen many.
- It can undercut the seriousness of the Accenture and cybersecurity work.
- The 75/25 balance is at real risk of flipping.
- Hand-quality sprite animation is the whole concept. If the generated sprite sheet is mediocre, everything is.
- A blog fits awkwardly inside a game metaphor.

---

## Concept C — BASECAMP

**Idea.** A night ascent. The site is one continuous climb through a stylised mountain range: each camp is a chapter, the summit is what you're working towards. Cinematic first, with small playful objects at each camp.

**You on the site.** A stylised low-poly 3D figure of you in the jacket from your mountain photo, seen mostly from behind or in silhouette against the peaks, with a headlamp that follows the cursor.

**Why it fits you.** Travel and mountains are a stated interest and your best photo is in the Himalayas. A climb is an honest picture of a final-year student with a PPO: clearly on the way up, with a summit still ahead. Camps give "currently learning / exploring" a real home.

**Hero moment.** Near-black sky, a ridge line, your name set huge across the peaks. Your figure stands at the bottom with a headlamp. The visitor's cursor swings the beam across the type and the slope; scrolling begins the climb and the camera rises with you.

**Three signature motion moments.**
1. **Headlamp** — the beam tracks the cursor and reveals type and terrain in the dark.
2. **The ascent** — scroll drives a continuous camera rise between camps, with parallax ridges.
3. **Summit sunrise** — at the last section the palette warms from night to first light.

**The playful 25%.** Objects around each campfire for your interests — a controller, headphones, a football — that react when poked.

**Risks.**
- Heaviest of the three: a 3D scene, a character model and a long scroll timeline against a 180 KB JS and 1.5 MB GLB budget.
- The journey-up-a-mountain metaphor is common and can read as a template.
- Projects compete with the scenery for attention; you asked for projects to stand out.
- The pixel style you mentioned is absent.
- A good static fallback is hard — without WebGL much of the idea disappears.

---

## Comparison

| | A — Resolve | B — Player One | C — Basecamp |
| --- | --- | --- | --- |
| Cinematic / playful | 75 / 25 | about 50 / 50 | 85 / 15 |
| Projects stand out | Strong — the device is applied to them | Medium — framed as levels | Weaker — scenery competes |
| Fits pixel or character request | Pixel | Character | Character |
| Blog fits later | Easily | Awkwardly | Acceptably |
| Performance risk | Low | Low–medium | High |
| Feels new | Most | Least | Medium |

## Recommendation: A — RESOLVE

It is the only one where the visual idea and your positioning are the same sentence, it hits the 75/25 split you asked for, and it has the most room inside the performance budgets. Its fallback is also the cheapest to do well, since a still pixel image already carries the idea.

One optional borrow from B, if you want more of a character: a small pixel sprite of you living in the playground only, not across the whole site.
