// Post-build step: make every prerendered page paint before it evaluates the framework JS.
//
// Next emits its client chunks as <script async> in <head>. On a fast connection they evaluate
// before the first frame is presented, so first paint (and LCP) waits behind ~145 KB of JS.
// This rewrites the static HTML so the chunks are requested once the browser reports first paint.
// Trade-off, on purpose: hydration starts roughly one stylesheet round-trip later than stock Next,
// in exchange for a first paint that never queues behind script. (Preloading them was measured and
// puts them back in front of the paint, so they are deliberately not preloaded.)
//
// RE-CHECK AFTER ANY NEXT.JS UPGRADE. This edits Next's prerendered .html files in place and depends on
// Next emitting `<script src async>` tags and serving those files. If it finds nothing to rewrite it fails
// the build on purpose. To verify a build or a deploy: the page HTML must contain "first-contentful-paint"
// and no `<script src="/_next/static/chunks/….js" async>` tags.
// Without this step the site still works; simulated Lighthouse LCP on localhost goes back to ~2.2–2.4 s.
// shortcut: post-processing build output instead of a framework option (none exists); remove if Next adds one.
import fs from 'node:fs'
import path from 'node:path'

// every prerendered .html under server/ (app/, pages/ and the route-cache copies that `next start` actually serves)
const dist = path.join(process.cwd(), process.env.NEXT_DIST_DIR || '.next', 'server')
const TAG = /<script src="([^"]+)" async=""><\/script>/g

// Runs the chunks after first contentful paint; 1.2 s fallback covers background tabs and old browsers.
const loader = (urls) =>
  `<script>(function(u){var d=0;function go(){if(d)return;d=1;u.forEach(function(s){var e=document.createElement("script");e.async=true;e.src=s;document.head.appendChild(e)})}` +
  `try{new PerformanceObserver(function(l){if(l.getEntriesByName("first-contentful-paint").length)go()}).observe({type:"paint",buffered:true})}catch(e){go()}` +
  `setTimeout(go,1200)})(${JSON.stringify(urls)})</script>`

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.html') ? [path.join(dir, e.name)] : []))
}

let pages = 0
for (const file of walk(dist)) {
  const html = fs.readFileSync(file, 'utf8')
  const urls = [...html.matchAll(TAG)].map((m) => m[1])
  if (!urls.length) continue
  const out = html.replace(TAG, '').replace('</body>', `${loader(urls)}</body>`)
  if (!out.includes('first-contentful-paint')) throw new Error(`paint-first: could not rewrite ${file}`)
  fs.writeFileSync(file, out)
  pages++
}
if (!pages) throw new Error('paint-first: no prerendered pages with async scripts found; Next output format changed?')
console.log(`paint-first: ${pages} pages now paint before hydrating`)
