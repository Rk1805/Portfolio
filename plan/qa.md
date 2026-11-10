# QA log

Owner: QA. Tooling: site/tests/ (Playwright, @axe-core/playwright, Lighthouse). Test target: production build on port 3100 (`NEXT_DIST_DIR=.next-qa`).

## Budgets (ship blockers)
| Budget | Target |
|---|---|
| Lighthouse mobile Performance | >= 90 |
| Lighthouse Accessibility | >= 95 |
| Lighthouse SEO | 100 |
| LCP | < 2 s |
| CLS | < 0.05 |
| Initial JS (gzip) | <= 180 KB |
| WebGL / video load | only after first paint |
| Animation | transform and opacity only, 60 fps |
| No WebGL | static fallback renders |

## Per-route budgets (pass 2, rebuilt with `npm run build` incl. paint-first)
Method: Lighthouse 12 mobile, default simulated throttling, prod build on :3100, three runs per route, worst recorded, machine otherwise idle. (A first pass-2 run on a build before Builder's last change was discarded and redone.)

| Route | Perf (min of 3) | A11y | SEO | LCP worst of 3 (<2.0) | CLS | JS gz (<=180) | axe | Result |
|---|---|---|---|---|---|---|---|---|
| / | 92 (100/100/92) | 100 | 100 | 1.51 | 0 | ~140 | 0 | PASS |
| /work | 100 | 100 | 100 | 1.36 | 0 | ~138 | 0 | PASS |
| /work/pet-agents | 100 | 100 | 100 | 1.36 | 0 | ~138 | 0 | PASS |
| /work/phishing-email-analyzer | 100 | 100 | 100 | 1.35 | 0 | ~138 | 0 | PASS |
| /work/english-winglish | 100 | 100 | 100 | 1.36 | 0 | ~138 | 0 | PASS |
| /work/tracker | 100 | 100 | 100 | 1.37 | 0 | ~138 | 0 | PASS |
| /playground | 100 | 100 | 100 | 1.43 | 0 | ~142 | 0 | PASS |
| /about | 100 | 100 | 100 | 1.50 | 0 | ~140 | 0 | PASS |
| /blog | 404 (verified: /blog, /blog/x 404; not in nav; not in sitemap) | | | | | | | PASS |

JS sizes are from pass 1 (re-measure not repeated; build chunking unchanged apart from paint-first which only reorders loading). One home run scored 92 (TBT noise), still above 90.

## Re-test checks requested by the lead
1. LCP < 2.0 s simulated, every route, 3 runs, worst 1.51 s: PASS.
2. JavaScript disabled (all 8 routes): every h1 present, no element with opacity 0 or visibility hidden outside sr-only/aria-hidden, nav links all return 200: PASS.
3. JS on: no console errors/page errors on any route; CLS 0.0000 on every route from a layout-shift observer; resolve data-level reaches 5 on all; page wipe enters `cover` phase on nav click; Snake starts and plays; dial works; copy button switches to "Copied" and the clipboard holds the correct address; keyboard focus on the logo link survives hydration (Tab pressed before hydration on slow 4G + 4x CPU, still on same element after): PASS. Only console noise: a THREE.Clock deprecation warning (logged as P2, Q10) and headless-GL driver stall messages that are environment noise.
4. Slow 4G + 4x CPU, home: FCP 588 ms; the dial responds 1016 ms after FCP; nav click shows the wipe 98 ms after click once hydrated.
5. English Winglish cover: the Gujarati letter is drawn in a canvas via Path2D, no Gujarati text in the DOM, only Big Shoulders and Hanken Grotesk loaded: PASS.
6. /blog 404 and absent from nav and sitemap: PASS. Snake with corrupted localStorage (`{"Classic Box":"x"}`): renders, no crash: PASS.

## Findings
| ID | Sev | Route | Viewport | Repro | Expected vs actual | Status |
|---|---|---|---|---|---|---|
| Q1 | P0 | all | mobile LH | simulated LCP | was 2.2-2.4 s; now 1.35-1.51 s worst of 3 | verified |
| Q2 | P0 | /blog | | | 404, not in nav or sitemap | verified |
| Q3 | P1 | /playground | any | corrupted snake-scores-v1 | page renders, scores empty | verified |
| Q4 | P2 | all | all | axe | region violations gone, axe clean on all 8 routes | verified |
| Q5 | P2 | /playground | 1280x800 | | corner dial no longer rendered on /playground | verified |
| Q6 | P2 | /work/* | | | covers are now one composition per project | verified |
| Q7 | P2 | all | | | colour transition removed | verified (not re-grepped) |
| Q8 | note | build | | | tsconfig include is re-added by Next with a custom dist dir; harmless | closed |
| Q9 | closed | all | | | skip link only visible in full-page captures; off-screen in a real viewport | not a bug |
| Q10 | P2 | /, /playground, /about | 1280 | open page with console | `THREE.Clock: This module has been deprecated` console warning from three; upgrade/replace Clock with Timer or silence | open |
| Q10b | note | / | | | Builder declines to silence the THREE.Clock warning (raised inside R3F, not site code). Accepted as P2, closed | closed |
| Q11 | note | build | | | LCP depends on scripts/paint-first.mjs: a bare `next build` regresses LCP to ~2.3 s; deploy pipeline must run `npm run build` | open (process risk) |

Open P0: 0. Open P1: 0.

## Taste scores (1-10), pass 2
- Home hero: 8. Name resolves, pixel portrait and block-ramp divider; strong single idea. Portrait still small on desktop.
- Home work list: 8. Full-width code-drawn compositions with a live readout (12 x 8 to HD) make the RESOLVE concept legible; alternating layout still conventional.
- Home now / experience / off-screen: 8 (pass 3). Full-width display-title rows, big-figure numbers and block dividers/icons break the standard grid.
- Home contact footer: 8. Big type, plain copy.
- Case studies: 8. The Pet Agents, Phishing ("8,612"), Winglish (A / અ) and Tracker (route) covers each tell their story; copy is strong; still no real product imagery by design.
- Playground: 8. Snake in page plus dial is the memorable bit, no longer overlapped.
- About: 8 (pass 3). Experience rows plus 2375 / 8 / 1409 as large figures close the idle gap; copy and facts match story.md.
- Overall: ~8. Fast and coherent, would place at honourable-mention level; SOTD would need a standout moment below the fold and real imagery.

## Standing P0 checks
No invented facts or numbers about Rishi, no raw photo of him, no phone number, no CGPA, no PPO mention.

## Pass 3 confirm (/ and /about, rebuilt with `npm run build`)
Lighthouse x3 each: / Perf 100, A11y 100, SEO 100, LCP 1.58-1.66, CLS 0; /about Perf 100, A11y 100, SEO 100, LCP 1.50-1.51, CLS 0. axe clean on both. Slow JS (chunks delayed 2.2 s): coarse name blocks visible at 0.7 s, h1 text stays "Rishi Kaneria", real text shown by 1.5 s, data-level 5 after hydration, CLS 0.0000, no console errors. JS off: blocks layer not displayed, name sharp. /about no overflow at 375/1280/1920. Open P0: 0, open P1: 0.
