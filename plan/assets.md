# Assets: shot list and delivery log

Owner: Assets. All 7 files were made locally (Python/OpenCV/Pillow, cwebp). **Higgsfield credits: estimated 0, spent 0. Canva: not used.** Builder's specs need no paid tool (no hero video, no GLB, no stock imagery), so no approval was required.

Source photo: `material/images/WhatsApp Image 2026-11-10 at 19.23.24.jpeg` (front-lit, frontal). Process: crop head-and-shoulders (eyes ~40% from top), GrabCut figure mask with a hand ellipse for the head, contrast stretch + CLAHE, body darkened so the face leads, down-sample to 64x80, posterise to 6 levels, background = level 0. The raw photo is never copied into `site/`.

| # | Path | Size / format | Bytes | Limit | Purpose | Alt text |
|---|------|---------------|-------|-------|---------|----------|
| 1 | `site/public/media/portrait/portrait-src.png` | 64x80, 8-bit grayscale PNG, levels 0/51/102/153/204/255, no metadata | 817 | 4 KB | Shader texture | (not rendered; texture only) |
| 2 | `site/public/media/portrait/portrait-poster.webp` | 640x800, lossless WebP, 16x20 mosaic, 40 px blocks, palette #06070A #0F2A33 #1F6F80 #45C8E0 #FF9A3D #EDE9E0 | 344 | 25 KB | No-WebGL / reduced-motion / pre-canvas fallback | "Pixel-mosaic portrait of Rishi Kaneria, head and shoulders, in coarse teal and amber blocks." |
| 3 | `site/public/og/default.png` | 1200x630 PNG | ~23 KB | 200 KB | Site OG card | "Rishi Kaneria. From rough to real." |
| 4 | `site/public/og/pet-agents.png` | 1200x630 PNG | ~29 KB | 200 KB | OG card | "Pet Agents: desktop pets that double as an on-device assistant for your Mac." |
| 5 | `site/public/og/phishing-email-analyzer.png` | 1200x630 PNG | ~41 KB | 200 KB | OG card | "Phishing Email Analyzer: first-pass phishing triage with a verdict you can audit, tested on 8,612 real emails." |
| 6 | `site/public/og/english-winglish.png` | 1200x630 PNG | ~37 KB | 200 KB | OG card | "English Winglish: bilingual exam-prep app for students, with an admin panel for the teacher." |
| 7 | `site/public/og/tracker.png` | 1200x630 PNG | ~29 KB | 200 KB | OG card | "Tracker: one field-tracking app with four roles: admin, driver, salesman, customer." |

OG cards: void background, Big Shoulders Display 900 title (ink), Hanken Grotesk subtitle (mute), 80 px left margin, right-edge column of square blocks that shrink toward the text. Copy is verbatim from `plan/story.md`.

## Not produced (waiting on Rishi, see plan/pending.md)
Real project covers/demos/stills: `site/public/media/work/<slug>/cover.webp` (1800x1200, <=180 KB), `demo.mp4` (1280 w, H.264, no audio, <=2.5 MB) + `demo-poster.webp` (<=60 KB), `NN.webp` (1600 w, <=150 KB). No stand-ins generated. Free local encoding when supplied; 0 credits.

## Notes
- The 16x20 poster is a coarse reading of the figure (light comes from the left in the source). Tune levels if Builder's shader rest-state differs.
- Fonts used for OG cards were fetched from google/fonts (OFL).

## Revision 1 (Builder request)
Portrait re-cropped tight: face ear-to-ear ~34-37 px of 64, hair top ~6 px from top, chin ~70% height, collar/shoulders at bottom. Hair forced to darker levels than forehead, glasses dark against skin, top level only on ~57 highlight pixels. Same paths/formats/palette. Credits: 0.
