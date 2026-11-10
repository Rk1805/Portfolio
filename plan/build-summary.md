# Build summary

Written by the lead on 2026-11-10 from the teammates' reports, `plan/qa.md`, and the lead's own checks (typecheck, production build, route status codes, screenshots).

## Status

- **Site:** built, compiles clean, typechecks, serving at <http://localhost:3000>.
- **QA:** 0 open P0, 0 open P1, every budget passing (`plan/qa.md`, passes 2 and 3).
- **Design quality:** QA scores every section 8 or above, about 8 / 10 overall — "strong and fast, and not guaranteed Site of the Day".
- **Final changes confirmed.** After pass 2 the Builder reworked the hero's pre-load state and the two weaker sections; QA's pass 3 re-tested `/` and `/about` on a fresh production build. The other routes were last measured in pass 2.

## What was built

Concept **RESOLVE**: everything starts as chunky pixels and resolves to sharp — rough idea to shipped product.

| Route | What it is |
| --- | --- |
| `/` | Hero (name resolves from blocks, pixel portrait), intro, four featured projects, Now, Experience, Off-screen, playground teaser, contact |
| `/work` | Four case studies plus the "Also built" list |
| `/work/[slug]` | `pet-agents`, `phishing-email-analyzer`, `english-winglish`, `tracker` — MDX, Hook → Problem → Insight → Build → Result |
| `/playground` | Playable Snake (a web re-implementation of the C original), the resolution dial, the pixel portrait |
| `/about` | Story, experience, campus roles, interests, links |
| `/blog`, `/blog/[slug]` | Wired up but return 404 until a post exists; not in nav or sitemap |
| 404 | "This page didn't resolve." |

**Stack:** Next.js 16 (App Router), React 19, TypeScript strict, Tailwind, GSAP + ScrollTrigger, Lenis, React Three Fiber, MDX.

**Layout of `site/`**
- `app/` routes · `components/` UI · `content/work/*.mdx` case studies · `content/blog/` (template only) · `lib/` content, pixel drawing, Snake logic (with a unit test) · `scripts/paint-first.mjs` · `public/media/portrait/`, `public/og/` · `tests/` QA tooling and screenshots.

**Assets** (`plan/assets.md`): a 64×80 pixel-portrait source and a poster, plus five 1200×630 share cards. All made locally; **0 Higgsfield and 0 Canva credits spent**. No hero video and no 3D model — the design did not call for them.

## Key decisions

1. **Concept A (Resolve)**, chosen by Rishi over Player One and Basecamp.
2. **Fonts:** Big Shoulders Display (headlines) and Hanken Grotesk (text), self-hosted.
3. **Colour:** near-black `#06070A`, off-white `#EDE9E0`, accents orange `#FF9A3D` and cyan `#45C8E0`; one hue per project. Square corners, 8 px block unit.
4. **Three motion moments only:** name resolve, project-cover resolve, pixel-wipe page transition. Each has a reduced-motion version (`plan/motion.md`).
5. **Rishi's photos are never shown.** The portrait is a pixel mosaic derived from one photo; the raw photo is not in `site/`.
6. **No fake project imagery.** Each case-study cover is drawn in code and specific to the project (pixel pets; "8,612" with a hook; Latin A beside Gujarati અ; a four-stop route). Real recordings replace or join them later (`plan/pending.md`).
7. **`/blog` is a real 404 until the first post**, so there is no empty or non-indexable page.
8. **Paint-first build step** — see below. This is the one decision with a real trade-off.
9. **Left off the site on Rishi's instruction or for privacy:** PPO, phone number, CGPA, school marks, Facebook, RL Website, the blockchain project, Infer Scale, the English Winglish admin-panel link.
10. **Library docs:** context7 needed a login in this session, so the Builder used the docs bundled in the installed packages (Next.js 16 ships its docs) instead.

### The paint-first step

`npm run build` runs `next build` and then `scripts/paint-first.mjs`, which rewrites the prerendered HTML so the framework JavaScript is requested only after the browser's first paint.

- **Why:** without it, Lighthouse mobile LCP on localhost is about 2.2–2.4 s, over the 2 s budget. With it, 1.35–1.51 s.
- **Cost:** interactivity starts slightly later. QA measured, on slow 4G with 4× CPU slowdown, first paint at 588 ms and the dial responding 1,016 ms after that.
- **Safety:** with JavaScript off the site is a complete static page. The script fails the build if it finds nothing to rewrite.
- **Fragility:** it edits Next.js's own output. Re-check after any Next.js upgrade. A bare `next build` skips it.

## Measured results (QA, production build, Lighthouse mobile, worst of three runs)

| Budget | Target | Result |
| --- | --- | --- |
| Performance | ≥ 90 | 100 on every route; one home run at 92 |
| Accessibility | ≥ 95 | 100 |
| SEO | 100 | 100 |
| LCP | < 2 s | 1.35–1.66 s (home 1.58–1.66 s in pass 3) |
| CLS | < 0.05 | 0 |
| Initial JS (gzip) | ≤ 180 KB | about 138–142 KB (measured in pass 1, not re-measured after the last changes) |
| axe | — | 0 violations on all 8 routes |
| No-WebGL fallback, reduced motion, keyboard-only | — | Pass |

## How to run it

```bash
cd site
npm install

npm run dev          # development, http://localhost:3000

npm run build        # production build — always this, never bare `next build`
npm run start        # serves the production build on http://localhost:3000
```

Other scripts: `npm run typecheck`, `npm test` (Snake logic).

A development server is currently running on port 3000. Stop it before `npm run start`.

QA tooling lives in `site/tests/` with its own `package.json`.

## How to deploy to Vercel

1. Push the repository to GitHub.
2. In Vercel, **Add New → Project**, import the repo.
3. Set **Root Directory** to `site`.
4. Framework preset: Next.js. Set **Build Command** explicitly to `npm run build` so the paint-first step runs.
5. Add one environment variable: `NEXT_PUBLIC_SITE_URL` = your live address (e.g. `https://your-domain.com`). Without it the sitemap, canonical links and share cards point to `http://localhost:3000`.
6. Deploy.

**Check after the first deploy** (the paint-first step is **unverified on Vercel**): view the page source of the live URL. It should contain `first-contentful-paint` and have no `<script src="/_next/static/chunks/….js" async>` tags. If it doesn't, the site still works normally; only LCP is slower. Then run Lighthouse on the live URL — real-host numbers will differ from localhost either way.

## Not finished

- **The portrait** is small on desktop and, as a mosaic of a photo with sunglasses, not very recognisable. Options: a tighter crop, a better source photo, or a generated pixel character (costs credits). Rishi's call.
- **No real project imagery.** Covers are code-drawn until Rishi adds recordings. QA's view is that Site-of-the-Day would need real imagery and a standout moment below the fold.
- **Console warning (closed as accepted P2):** `THREE.Clock` deprecation on `/`, `/playground`, `/about`. It is raised inside React Three Fiber; silencing it would mean patching `console.warn`.
- **Everything in `plan/pending.md`:** project recordings, Nikunj Sir's YouTube link, Play Store link, mountain place names, "working towards" items.

## Maintenance notes

- The hero's first-frame block pattern is a stored bitmap measured from the display font (`site/lib/pix.ts`). Regenerate it if the name, the font or its letter spacing changes.
- The Gujarati અ on the English Winglish cover is drawn from an embedded outline of Noto Sans Gujarati (SIL Open Font License), credited in `site/lib/pix.ts`.

## Unverified

- **Routes other than `/` and `/about` after the final changes.** Pass 3 re-measured only those two; the rest rely on pass 2. Initial JS size was measured in pass 1 only.
- **Vercel** behaviour of the paint-first step, as above.
- **Real-device performance.** All numbers are from localhost; nothing was tested on a real phone.
- **60 fps.** Frame rate was not measured. Animations are limited to transform and opacity, with two instant state switches on the hero.
- **Snake maps.** The three web layouts (Classic Box, Compartment, Apartment) are the Builder's interpretation of the map names, not a port of the original C layouts.
- **Not a formal agent team.** The session could not create named teammates, so the three roles ran as background agents messaging each other by address, with no shared task list.
