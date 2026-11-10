import { chromium } from '@playwright/test';
const B='http://localhost:3100';
const br=await chromium.launch();
const log=(...a)=>console.log(...a);
// Keyboard
{const p=await (await br.newContext({viewport:{width:1280,height:800}})).newPage();
await p.goto(B+'/',{waitUntil:'networkidle'});
const seq=[];
for(let i=0;i<45;i++){await p.keyboard.press('Tab');const d=await p.evaluate(()=>{const e=document.activeElement;const cs=getComputedStyle(e);const r=e.getBoundingClientRect();return {t:(e.tagName+' '+(e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,25)),out:cs.outlineStyle+' '+cs.outlineWidth,box:cs.boxShadow!=='none',vis:r.width>0&&r.top<innerHeight&&r.bottom>0}});seq.push(d);}
log('KEY',JSON.stringify(seq.map(s=>s.t+(s.out.startsWith('none')&&!s.box?' [NOFOCUSRING]':'')+(s.vis?'':' [offscreen]'))));}
// Reduced motion
{const c=await br.newContext({viewport:{width:1280,height:800},reducedMotion:'reduce'});const p=await c.newPage();
const reqs=[];p.on('request',r=>reqs.push(r.url()));
await p.goto(B+'/',{waitUntil:'networkidle'});await p.waitForTimeout(2500);
log('RM levels',await p.evaluate(()=>[...document.querySelectorAll('[data-level]')].map(e=>e.dataset.level).join(',')));
log('RM webgl/three chunks requested',reqs.filter(u=>/three|r3f|gsap|lenis/i.test(u)).length, 'wipe', await p.evaluate(()=>document.querySelector('.wipe')?.dataset.phase));
const t0=Date.now();await p.click('a[href="/about"]');await p.waitForURL('**/about');log('RM nav ms',Date.now()-t0);
await p.goto(B+'/playground',{waitUntil:'networkidle'});
log('RM snake',await p.locator('[data-testid=snake]').count(), await p.locator('[data-testid=dial-inline]').count());}
// No WebGL
{const c=await br.newContext({viewport:{width:1280,height:800}});const p=await c.newPage();
await p.addInitScript(()=>{const g=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(t,...a){if(/webgl/.test(t))return null;return g.call(this,t,...a)}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.goto(B+'/',{waitUntil:'networkidle'});await p.waitForTimeout(4000);
await p.screenshot({path:'screenshots/nowebgl-home-1280.png'});
log('NOWEBGL errs',errs,'portrait visible',await p.locator('[data-testid=portrait]').isVisible());}
// Webgl/video after first paint, initial requests
{const c=await br.newContext({viewport:{width:1280,height:800}});const p=await c.newPage();
const reqs=[];p.on('request',r=>reqs.push([Date.now(),r.url()]));
const t0=Date.now();await p.goto(B+'/',{waitUntil:'load'});
log('LOAD',Date.now()-t0,'reqs by load', reqs.filter(r=>/three|r3f|\.mp4|\.webm/i.test(r[1])).map(r=>r[1].slice(-50)));
await p.waitForTimeout(3000);
log('after 3s heavy', reqs.filter(r=>/\.mp4|\.webm|gsap/i.test(r[1])).length, 'transfer sizes of chunks in /_next');
}
// Dial + snake
{const p=await (await br.newContext({viewport:{width:1280,height:800}})).newPage();
await p.goto(B+'/playground',{waitUntil:'networkidle'});
const d=p.locator('[data-testid=dial-inline] input[type=range], input[type=range]').first();
await d.focus();await p.keyboard.press('ArrowLeft');await p.keyboard.press('ArrowLeft');
log('dial val',await d.inputValue(),'h1 level',await p.evaluate(()=>document.querySelector('h1')?.closest('[data-level]')?.dataset.level||document.querySelector('h1[data-level]')?.dataset.level),'body font intact', await p.evaluate(()=>getComputedStyle(document.querySelector('p')).fontFamily.slice(0,30)));
await p.locator('[data-testid=snake-start]').focus();await p.keyboard.press('Enter');
await p.keyboard.press('ArrowDown');await p.waitForTimeout(500);
const y0=await p.evaluate(()=>scrollY);await p.keyboard.press('ArrowDown');await p.keyboard.press('Space');
log('snake scrollY stays while playing',y0===await p.evaluate(()=>scrollY));
await p.keyboard.press('Escape');
await p.keyboard.press('Tab');log('focus after esc', await p.evaluate(()=>document.activeElement.tagName+' '+document.activeElement.textContent.slice(0,20)));
await p.screenshot({path:'screenshots/playground-dial-1280.png'});}
await br.close();
