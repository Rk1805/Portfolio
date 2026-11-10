# Design — RESOLVE

Owner: Builder. Source of content: `plan/story.md`. Concept: `plan/concept.md` (A).

One idea: **low resolution is the idea, high resolution is the shipped thing.** The page is a dark, quiet stage; the only loud things are the name, the four project covers and the portrait, and each of them is seen resolving.

## 1. Type — two families, self-hosted with `next/font/google`

| Role | Family | Why |
| --- | --- | --- |
| Display | **Big Shoulders** (the family formerly published as Big Shoulders Display), weight 900, uppercase; fallback Impact, whose metrics are within 2% | Tall, condensed, flat-sided poster letters. They read as a film title card (the cinematic 75%), and because the strokes are straight and vertical they survive being drawn as 6 blocks tall — the name is still legible as pixels. A round geometric face turns to mush at that size. |
| Text | **Hanken Grotesk**, variable 400–700 | Calm, slightly humanist grotesque with open apertures; holds at 15 px on a phone and at 19 px in long-form. It does not compete with the display face. Also used for labels and small numerals (tabular figures) — no third mono face. |

`next/font` downloads at build time and serves the files from our own origin (no runtime request to Google), `display: swap`, Latin subset only.

Scale (fluid, `clamp`):

| Token | Size | Use |
| --- | --- | --- |
| `--t-mega` | clamp(4.5rem, 19vw, 19rem), line-height 0.82 | Hero name only |
| `--t-h1` | clamp(3.5rem, 11vw, 10rem), lh 0.86 | Page titles (Work, Playground, About, 404, case-study title) |
| `--t-h2` | clamp(2.25rem, 5.4vw, 5rem), lh 0.92 | Section headings |
| `--t-h3` | clamp(1.5rem, 2.6vw, 2.25rem), lh 1 | Card titles, list rows |
| `--t-lead` | clamp(1.25rem, 1.9vw, 1.75rem), lh 1.35 | Positioning line, hooks, intro |
| `--t-body` | 1.0625rem (17 px), lh 1.6; long-form 1.1875rem (19 px), lh 1.65 | Body |
| `--t-small` | 0.875rem, lh 1.4, letter-spacing 0.02em | Labels, meta, captions |

Display type is always uppercase with −0.01em tracking. Text type is sentence case. Section labels (`01 — WORK` …) are copy from story.md and are set in the text face at `--t-small`; the numbers are kept because the home page really is read in that order.

## 2. Colour

Dark base, graded like film: cool shadows, one warm practical light. Two accents because the portrait is a two-colour mosaic.

| Token | Hex | Use |
| --- | --- | --- |
| `--void` | `#06070A` | Page background |
| `--stage` | `#0E1117` | Raised surfaces: cards, playground cabinets, code |
| `--line` | `#232833` | Hairlines, grid rules, borders |
| `--ink` | `#EDE9E0` | Primary text (17.6:1 on void) |
| `--mute` | `#9A9FAB` | Secondary text (7.6:1 on void) |
| `--tungsten` | `#FF9A3D` | Warm accent: links on hover, focus ring, dial thumb, portrait highlights |
| `--arc` | `#45C8E0` | Cool accent: portrait mid-tones, secondary marks |

Project hues — used **only** on that project's cover, its case-study header rule and its OG card:

| Project | Hue |
| --- | --- |
| Pet Agents | `#FF9A3D` |
| Phishing Email Analyzer | `#F0564A` |
| English Winglish | `#45C8E0` |
| Tracker | `#B5E853` |

75 / 25: everything outside covers, portrait and playground is void + ink + mute. Colour is a reward for scrolling to a project. Playground is the one place both accents and all four hues may appear together.

No gradients as decoration, no glow, no glass. Shadows are not used; depth comes from `--stage` and hairlines.

## 3. Grid and space

- Base unit **8 px = one "block"**. All spacing is a multiple of it. Corners are square everywhere (radius 0) — pixels have no rounded corners. This is the one structural quirk and it is concept-driven.
- 12 columns, max content width 1440 px, column gap 24 px (16 px under 640), side margins `clamp(20px, 4vw, 64px)`.
- Section rhythm: `clamp(96px, 14vw, 200px)` between home sections.
- Alignment: left. Nothing is centred except the 404 and the Snake cabinet.
- Breakpoints: 640 / 900 / 1200. Mobile is one column; the hero name wraps to two lines (RISHI / KANERIA) so it stays huge.

Home hero wireframe (desktop):

```
┌──────────────────────────────────────────────────────────────┐
│ RK            Work  Playground  About  Contact               │
│                                                ┌──────────┐  │
│ RISHI KANERIA — PORTFOLIO                      │ portrait │  │
│                                                │ mosaic,  │  │
│ R I S H I   K A N E R I A   (overlaps ───────▶ │ half in  │  │
│                              portrait edge)    │ shadow   │  │
│ Software engineer and builder.                 └──────────┘  │
│ I take ideas from rough to real.        Scroll to sharpen    │
│                                                   [8-BIT◄►HD]│
└──────────────────────────────────────────────────────────────┘
```

Featured work: one project per row. The cover (3:2) takes the full width, capped so a whole cover fits the viewport, and alternates left/right; title and summary sit under it. Big covers are how projects stand out; there is no card grid.

## 4. The one device: pixel → sharp

A thing is drawn as a coarse grid of flat square blocks and steps through finer grids until it is crisp. Steps are **discrete** (it snaps, it does not blur): 6 resolution levels, 0 = 8-bit … 5 = HD.

**Where it may appear (complete list)**

1. **Name resolve** — hero name on first load of `/`.
2. **Project resolve** — the four project covers (home, `/work`, and the case-study header cover), tied to scroll position.
3. **Pixel wipe** — route changes.
4. **Resolution dial** — the visitor's manual control over the same levels; it re-coarsens display headings, covers and the portrait. It is the device handed to the user, not a fourth effect.
5. **Pixel portrait** — the standing image of Rishi (hero, about, playground "Pixel me"). It is always a mosaic and never reaches level 5.

**Where it may never appear**

- Body text, labels, nav, links, buttons, form controls, meta rows, footers — at any dial setting. Body copy is real DOM text and is never rasterised, blurred, masked or delayed.
- Long-form MDX content (case-study and blog bodies), including inline images there once real media exists: those load plainly.
- Hover states. Nothing pixelates on hover except the portrait refining under the pointer.
- Section headings on scroll. Headings other than the hero name only change with the dial.
- Loading states, focus rings, cursor, scrollbars. No pixel fonts, no CRT scanlines, no glitch, no noise overlays.

**Rules**

- Blocks are square, flat-filled, hard-edged, aligned to a grid whose origin is the element's top-left.
- Display type as pixels: the real heading stays in the DOM (it is what screen readers, search engines and copy/paste see); a canvas on top draws the block version and is `aria-hidden`.
- Coarsest state must still hint at the final form (name at 6 blocks tall is readable as a word shape).
- A resolve always ends fully sharp unless the dial says otherwise. Nothing is left half-resolved by default. One exception: the 404 heading is held at level 1, because that page "didn't resolve".

## 5. Imagery

- **Rishi** appears only as the mosaic portrait: luminance from a 64×80 grayscale source mapped to a 6-step ramp (`#06070A → #0F2A33 → #1F6F80 → #45C8E0 → #FF9A3D → #EDE9E0`). 16 columns at rest, up to 64 under the pointer. The left third falls into shadow. No raw photo is ever in `site/`.
- **Project covers** (until real recordings arrive, `plan/pending.md`): one composition per project, drawn in code on a 24×16 cell grid in the project's hue + void + ink. Typographic or abstract, never a screenshot, device frame or invented UI:
  - Pet Agents — two block-built ninja pets standing on the bottom edge of a screen.
  - Phishing Email Analyzer — the number the case study turns on, `8,612`, with a hook hanging over it.
  - English Winglish — a Latin `A` and a Gujarati `અ` on split fields: the two languages of the app.
  - Tracker — one route with four stops on a dot grid: the four roles.
  As a 12×8 grid each is abstract colour; resolved, it is specific. A live readout under every cover (`12 × 8` … `HD`) names the moment. When real media arrives it replaces the generated source (`cover` in the MDX meta) and the same resolve runs on it.
- **Block marks below the fold** (static images of the idea, not effects): a section divider where coarse blocks halve into a hairline (`public/ramp.svg`), and four small block icons on the Off-screen tiles.
- No stock photos, no illustrations, no icons library. The few glyphs needed (arrow, copy tick) are drawn from blocks.

## 6. Long-form reading layout (case studies and blog share it)

One component, `Longform`, one MDX component map.

```
┌───────────────────────────────────────────────────────────┐
│ ← Work                                                     │
│ PET AGENTS                         (display, --t-h1)       │
│ ─────────────── project-hue rule, 8 px ───────────────     │
│ Role      Year     Stack                    Links          │
│ ┌───────────────────────────────────────────────────────┐ │
│ │ cover 3:2 (project resolve)                           │ │
│ └───────────────────────────────────────────────────────┘ │
│            Hook — set as lead, 32ch–40ch lines             │
│                                                            │
│  The problem    │  body column, 62–68ch, 19 px / 1.65      │
│  (sticky h2     │  lists with block bullets                │
│   rail ≥1200)   │  figures break out to 10 columns         │
│                                                            │
│ Next project → NAME (display, full-width link)             │
└───────────────────────────────────────────────────────────┘
```

- Measure 62–68 characters; paragraphs spaced 1.25em; headings are display `--t-h2` in a left rail on wide screens, above the text otherwise.
- Numbers in results use tabular figures in the text face at weight 700 — emphasised by weight, not colour.
- Blog posts use the same layout with: title, date, reading column, no cover required, "Next note" footer. Frontmatter differs; layout does not.
- Media slots (`<Figure>`, `<Video>`) exist in the MDX component map and render nothing until a file is referenced, so real media drops in without layout work.

## 7. Components (kept small)

Header (wordmark + 4 links) · Footer/Contact · ResolveText (display heading + block canvas) · Cover (project resolve canvas) · Portrait (poster image + lazy WebGL) · Dial · PixelWipe + TransitionLink · Longform + MDX map · Snake.

## 8. Accessibility and performance guards

- Skip link, landmarks, one `h1` per page, visible 2 px tungsten focus ring with 2 px offset on everything focusable.
- All canvases are `aria-hidden`; their content exists as real text or `alt`.
- Dial is a native range input (keyboard, touch and screen-reader support for free).
- Hero LCP is text (positioning line / name); portrait poster is a 640×800 WebP under 25 KB; WebGL, GSAP and Lenis load after first paint.
- Contrast: all text ≥ 7:1 on void; text over covers sits on void, never on the hue.
