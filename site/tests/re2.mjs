import { chromium } from '@playwright/test';
const B='http://localhost:3100';const br=await chromium.launch();
// skip earlier parts
// focus kept across hydration: tab immediately after DOMContentLoaded on throttled
{const c=await br.newContext({viewport:{width:1280,height:800}});const p=await c.newPage();const cdp=await c.newCDPSession(p);
 await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await p.goto(B+'/',{waitUntil:'domcontentloaded'});await p.keyboard.press('Tab');await p.keyboard.press('Tab');
 const before=await p.evaluate(()=>document.activeElement.textContent.trim().slice(0,20));
 await p.waitForLoadState('networkidle');await p.waitForTimeout(3000);
 const after=await p.evaluate(()=>document.activeElement.textContent.trim().slice(0,20)+'|'+document.activeElement.tagName);
 console.log('FOCUS before hydrate:',before,'after:',after);
 // 4. interaction timing
 const t=await p.evaluate(()=>performance.getEntriesByName('first-contentful-paint')[0]?.startTime);
 console.log('FCP',Math.round(t));await c.close();}
{ // time to responsive: reload throttled, poll until dial change or nav wipe responds
 const c=await br.newContext({viewport:{width:1280,height:800}});const p=await c.newPage();const cdp=await c.newCDPSession(p);
 await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await p.addInitScript(()=>{window.__t={};const poll=()=>{const w=document.querySelector('.wipe');const d=document.querySelector('[data-testid=dial] input');const h=document.querySelector('h1[data-level],[data-level]');
   if(h&&h.dataset.level==='5'&&!window.__t.sharp)window.__t.sharp=performance.now();requestAnimationFrame(poll)};requestAnimationFrame(poll)});
 await p.goto(B+'/',{waitUntil:'commit'});
 await p.waitForFunction(()=>performance.getEntriesByName('first-contentful-paint').length>0,null,{timeout:60000});
 const fcp=await p.evaluate(()=>performance.getEntriesByName('first-contentful-paint')[0].startTime);
 // dial responsive: set value and see data-level on covers/portrait change
 const t0=Date.now();let dialMs=null,navMs=null;
 const dialIn=p.locator('input[aria-label^="Site resolution"]').first();await dialIn.waitFor({state:'attached'});
 const ts=await p.evaluate(()=>performance.now());
 for(let i=0;i<200;i++){await dialIn.focus().catch(()=>{});await p.keyboard.press('Home');const v=await dialIn.inputValue();const lv=await p.evaluate(()=>document.querySelector('h1')?.closest('[data-level]')?.dataset.level||document.querySelector('[data-level]')?.dataset.level);if(v==='0'&&lv==='0'){dialMs=Math.round(await p.evaluate(()=>performance.now())-fcp);break}await p.waitForTimeout(100)}
 console.log('THROTTLED FCP ms',Math.round(fcp),'dial responds ms after FCP',dialMs);
 await p.keyboard.press('End');
 const n0=await p.evaluate(()=>performance.now());await p.click('a[href="/about"]');
 await p.waitForFunction(()=>document.querySelector('.wipe')?.dataset.phase!=='idle'||location.pathname==='/about',null,{timeout:30000});
 console.log('nav reacts ms after click',Math.round(await p.evaluate(()=>performance.now())-n0));
 await c.close();}
// 6. corrupted storage
{const p=await (await br.newContext()).newPage();await p.addInitScript(()=>localStorage.setItem('snake-scores-v1','{"Classic Box":"x"}'));
 await p.goto(B+'/playground',{waitUntil:'networkidle'});console.log('CORRUPT snake present',await p.getByTestId('snake').count(),(await p.evaluate(()=>document.body.innerText)).includes("couldn")?'CRASH':'ok');}
// wipe + snake + copy
{const p=await (await br.newContext({viewport:{width:1280,height:800}})).newPage();await p.goto(B+'/',{waitUntil:'networkidle'});await p.waitForTimeout(2000);
 await p.click('a[href="/about"]');await p.waitForTimeout(150);const ph=await p.evaluate(()=>document.querySelector('.wipe')?.dataset.phase);await p.waitForURL('**/about');console.log('WIPE mid-phase',ph);
 await p.goto(B+'/playground',{waitUntil:'networkidle'});await p.getByTestId('snake-start').click();await p.keyboard.press('ArrowDown');await p.waitForTimeout(600);console.log('snake status text',(await p.getByTestId('snake').innerText()).replace(/\n/g,' ').slice(0,80));
 await p.goto(B+'/',{waitUntil:'networkidle'});await p.context().grantPermissions(['clipboard-read','clipboard-write']);await p.getByTestId('copy-email').click();console.log('copy label',await p.getByTestId('copy-email').innerText());}
// 5. Gujarati
{const p=await (await br.newContext({viewport:{width:1280,height:800}})).newPage();await p.goto(B+'/work/english-winglish',{waitUntil:'networkidle'});await p.waitForTimeout(2000);
 console.log('GUJ in DOM text:',/[઀-૿]/.test(await p.evaluate(()=>document.body.innerText)),'font-face gujarati',await p.evaluate(()=>[...document.fonts].map(f=>f.family).join(',')));
 await p.getByTestId('cover').first().screenshot({path:'screenshots/ew-cover.png'}).catch(()=>{});
 const src=await p.evaluate(()=>[...document.querySelectorAll('[data-testid=cover]')].map(e=>e.tagName+(e.querySelector('canvas')?'+canvas':'')).join());console.log(src)}
await br.close();
