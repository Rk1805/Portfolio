# Motion — RESOLVE

Owner: Builder. Companion to `plan/design.md`.

## Rules

1. Only `transform` and `opacity` are animated in CSS/GSAP. No animated `filter`, `width`, `height`, `top`, `clip-path`, colour of large areas, or layout.
2. Resolution changes are **discrete canvas redraws** (a few draws per resolve, never one per frame) or a shader uniform. They cost no layout and no style recalculation.
3. 60 fps target on a mid-range phone. One WebGL canvas per page at most, DPR capped at 1.5, render loop runs only while the portrait is on screen and something is changing.
4. Nothing blocks input. Links and buttons are usable from first paint; the wipe is the only moment input is briefly held (≤ 420 ms).
5. No scroll-triggered fade-ups, no parallax, no hover choreography. Sections simply are there. Motion is spent on the three moments.
6. Hover effects are gated behind `(hover: hover) and (pointer: fine)`.
7. Every moment has a reduced-motion version (below). `prefers-reduced-motion: reduce` also disables Lenis; native scrolling is used.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Entrances, wipe reveal, UI feedback |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | Wipe cover (on-screen movement) |
| `steps` | discrete | Resolution levels — never tweened |
| `--d-press` | 120 ms | Button / link press (`scale(0.97)`) |
| `--d-ui` | 200 ms | Hover colour, underline, tooltip, copy confirmation |
| `--d-block` | 180 ms | One wipe block fading |
| `--d-wipe` | 380 ms cover, 520 ms reveal | Whole page wipe incl. stagger |
| `--d-resolve` | 1100 ms | Name resolve, total |
| Lenis | `lerp: 0.1`, wheel only (touch stays native) | Smooth scroll |

## Signature moment 1 — Name resolve (hero, `/` only, once per page load)

Purpose: explanation — it states the concept in one second.

| Element | Role | Starts | Duration | Motion |
| --- | --- | --- | --- | --- |
| Name blocks | Lead | 0 ms (after fonts ready) | 1100 ms | The real name is painted from the first frame but hidden under a void-coloured cover (so it is the LCP text and never waits for JS). The first frame is server-rendered: the name as coarse blocks (10 per em) in static SVG, so the concept is on screen before any script runs. When the script arrives a canvas redraws at 10 → 16 → 28 → 48 blocks per em, then swaps to the real text. Step intervals shorten: 300, 240, 200, 180 ms. |
| Eyebrow, positioning line, nav | Static | — | — | Present and readable from first paint (LCP text). |
| Portrait | Support | when WebGL ready | 600 ms | Canvas fades in (opacity) over the identical poster; no movement. |
| Scroll hint | Decoration | 1100 ms | 200 ms | Fade in. |

What does not move: the positioning line and nav (they are the LCP and must not wait); headings on other pages (the resolve is the home page's opening, not a site-wide habit).

Interruption: scrolling or navigating away mid-resolve jumps the name straight to sharp.

Slow or missing script: the static blocks stay for at most 1.5 s, then the sharp name replaces them (CSS only). If the script lands more than 1 s after first paint the canvas steps are skipped, so there is never a sharp → blocks flash. With JavaScript off the name is sharp from the first frame. The real text is in the DOM and exposed to assistive technology throughout; blocks and canvas are `aria-hidden`.

**Reduced motion:** the name is sharp from first paint; no canvas steps. Portrait shows the static poster (no pointer refinement loop).

## Signature moment 2 — Project resolve (covers)

Purpose: state indication — the project comes into focus as you arrive at it.

- Each cover is a canvas showing its source at one of 6 levels: 12×8 → 24×16 → 48×32 → 96×64 → 192×128 → full.
- Level is a function of the cover's centre distance from the viewport centre (ScrollTrigger, `start: top bottom`, `end: bottom top`): fully sharp inside the middle band (35% of the travel either side of centre), coarsening symmetrically on the way in and out. The canvas is redrawn only when the level changes (≤ 10 redraws per pass).
- Text next to the cover does not animate.
- On the case-study page the header cover starts at 12×8 and resolves once on load (5 steps, 140 ms apart), then stays sharp.

**Reduced motion:** covers render sharp and stay sharp; no scroll linkage.

## Signature moment 3 — Pixel wipe (route change)

Purpose: prevent a jarring change, and carry the device between pages.

| Phase | Starts | Duration | Motion |
| --- | --- | --- | --- |
| Cover | on link click | 380 ms total | A fixed grid of void-coloured blocks (12×8 landscape, 6×10 portrait) goes `opacity 0 → 1`, 180 ms each, staggered by a per-block pseudo-random delay 0–200 ms (random, not a metronome sweep), `--ease-in-out`. |
| Navigate | at cover end | — | `router.push`, scroll to top. |
| Reveal | when the new route has rendered | 520 ms total | Same blocks `opacity 1 → 0`, 180 ms each, delays 0–340 ms weighted so the top-left (where the title is) clears first, `--ease-out`. |

- Uses CSS transitions on opacity (interruptible; a second click during cover is ignored, during reveal starts a new cover from current opacity).
- Not used for: in-page anchors (Contact), external links, modified clicks (cmd/ctrl/middle), browser back/forward (instant, restores scroll).
- The wipe layer is `aria-hidden`, and `visibility: hidden` + `pointer-events: none` when idle. If a navigation stalls, the cover lifts by itself after 2.5 s.

**Reduced motion:** no blocks. Navigation is immediate.

## The dial (not a fourth moment — the same levels, user-driven)

- Native range input, 6 stops. Dragging is 1:1 (direct manipulation, no easing); each stop redraws display headings, covers and the portrait at that level immediately.
- The thumb has press feedback (`scale(0.92)`, 120 ms). No momentum, no spring: the value is discrete.
- **Reduced motion:** the dial still works (the user is producing the change); changes apply instantly as they already do.

## Small UI feedback (not signature)

- Links: underline scales in from the left (`transform: scaleX`), 200 ms `--ease-out`, hover-gated.
- Buttons: `scale(0.97)` on `:active`, 120 ms.
- Copy email: label swaps to "Copied" with a 200 ms opacity cross-fade; reverts after 2 s.
- Snake: canvas game loop, fixed tick; no decorative motion around it.

## Load order: paint first, then hydrate

`npm run build` runs `scripts/paint-first.mjs` after `next build`. It rewrites the prerendered HTML so the framework's client chunks are requested when the browser reports first contentful paint (1.2 s fallback), instead of as `<script async>` in `<head>`. First paint therefore never queues behind script evaluation. Cost: hydration (and with it the name resolve) starts about one stylesheet round-trip later than stock Next.

## Budget check

| Item | Cost |
| --- | --- |
| Name resolve | 5 canvas 2D draws total |
| Project resolve | ≤ 10 canvas 2D draws per cover per scroll pass |
| Pixel wipe | 96 (or 60) composited opacity layers for < 1 s, then `visibility: hidden` |
| Portrait | 1 full-quad fragment shader, 64×80 texture, DPR ≤ 1.5, paused off-screen |
