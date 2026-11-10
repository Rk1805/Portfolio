import { chromium } from '@playwright/test';import AxeBuilder from '@axe-core/playwright';
const B='http://localhost:3100';const br=await chromium.launch();
// slow JS: delay /_next/static chunks 2.2s
{const c=await br.newContext({viewport:{width:1280,height:800}});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text().slice(0,100)));
 await p.route('**/_next/static/**/*.js',async r=>{await new Promise(s=>setTimeout(s,2200));r.continue()});
 await p.addInitScript(()=>{window.__cls=0;new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__cls+=e.value}).observe({type:'layout-shift',buffered:true})});
 await p.goto(B+'/',{waitUntil:'commit'});
 for(const t of [700,1500,2600]){await p.waitForTimeout(t===700?700:t===1500?800:1100);
  const s=await p.evaluate(()=>{const h=document.querySelector('h1');const pre=h.querySelector('.pre');return {text:h.textContent.replace(/\s+/g,' ').trim().slice(0,40),preVisible:pre?getComputedStyle(pre).visibility+'/'+getComputedStyle(pre).opacity+'/'+(pre.getBoundingClientRect().width>0):'none',lvl:document.querySelector('[data-level]')?.dataset.level}});
  console.log('slowJS t~',t,JSON.stringify(s));await p.screenshot({path:`screenshots/slow-${t}.png`,clip:{x:0,y:0,width:1280,height:500}});}
 await p.waitForTimeout(3000);
 console.log('after hydrate level',await p.evaluate(()=>document.querySelector('[data-level]')?.dataset.level),'cls',(await p.evaluate(()=>window.__cls)).toFixed(4),'errs',errs);
 const snap=await p.accessibility?.snapshot?.().catch(()=>null);const h=await p.locator('h1').first().evaluate(e=>e.getAttribute('aria-label')||e.textContent.replace(/\s+/g,' ').trim());console.log('h1 name',h);
 await c.close();}
for(const r of ['/','/about']){const c=await br.newContext({viewport:{width:1280,height:800}});const p=await c.newPage();await p.goto(B+r,{waitUntil:'networkidle'});await p.waitForTimeout(2000);
 console.log('axe',r,(await new AxeBuilder({page:p}).analyze()).violations.map(v=>v.id+' x'+v.nodes.length).join()||'none');await c.close();}
{const c=await br.newContext({javaScriptEnabled:false,viewport:{width:1280,height:800}});const p=await c.newPage();await p.goto(B+'/');console.log('NOJS pre hidden',await p.evaluate(()=>{const e=document.querySelector('h1 .pre');return e?getComputedStyle(e).display+'/'+getComputedStyle(e).visibility:'none'}),'h1',await p.evaluate(()=>document.querySelector('h1').textContent.replace(/\s+/g,' ').trim()));await c.close();}
for(const w of [375,1280,1920]){const c=await br.newContext({viewport:{width:w,height:900}});const p=await c.newPage();const e=[];p.on('pageerror',x=>e.push(x.message));await p.goto(B+'/about',{waitUntil:'networkidle'});await p.waitForTimeout(2000);await p.screenshot({path:`screenshots/about-${w}.png`,fullPage:true});console.log('about',w,'overflow',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),e);await c.close();}
await br.close();
