import { chromium } from '@playwright/test';
const B='http://localhost:3100';const br=await chromium.launch();
const cases={a:'{"Classic Box":"x"}',b:'{"Classic Box":null,"Compartment":[1e21,-5,NaN]}',c:'[]',d:JSON.stringify({'Classic Box':Array.from({length:5000},(_,i)=>i*99999999)}),e:'{bad'};
for(const [k,v] of Object.entries(cases)){
  const c=await br.newContext({viewport:{width:1280,height:800}});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(([v])=>localStorage.setItem('snake-scores-v1',v),[v]);
  await p.goto(B+'/playground',{waitUntil:'networkidle'});await p.waitForTimeout(500);
  const body=await p.getByTestId('snake-scores').innerText().catch(()=> 'NO-SCORES-EL');
  console.log('storage',k,'errs',errs.slice(0,1),'scores:',body.replace(/\n/g,' ').slice(0,120),'overflow',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
  await c.close();}
// 320 and 200% font
for(const [w,fs] of [[320,'16px'],[375,'32px'],[320,'32px']]){
  const c=await br.newContext({viewport:{width:w,height:700},hasTouch:true,isMobile:true});const p=await c.newPage();
  for(const r of ['/','/work/pet-agents','/playground','/about']){await p.goto(B+r,{waitUntil:'networkidle'});await p.addStyleTag({content:`html{font-size:${fs}!important}`});await p.waitForTimeout(500);
   const o=await p.evaluate(()=>{const bad=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1&&r.width>0&&getComputedStyle(e).position!=='fixed'&&!e.closest('canvas,[aria-hidden=true]')}).slice(0,3).map(e=>e.tagName+'.'+String(e.className).slice(0,30));return {x:document.documentElement.scrollWidth>innerWidth,bad}});
   console.log(w,fs,r,JSON.stringify(o));}
  if(w===320&&fs==='32px'){await p.goto(B+'/playground');await p.screenshot({path:'screenshots/playground-320-zoom200.png'});}
  await c.close();}
// storage blocked + rapid double-click nav
{const c=await br.newContext();const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})});
await p.goto(B+'/playground',{waitUntil:'networkidle'});await p.getByTestId('snake-start').click();await p.waitForTimeout(800);
await p.goto(B+'/',{waitUntil:'networkidle'});
await p.click('a[href="/about"]');await p.click('a[href="/work"]',{force:true}).catch(()=>{});await p.waitForTimeout(2000);
console.log('blocked-storage errs',errs.slice(0,2),'url after rapid nav',p.url(),'wipe',await p.evaluate(()=>document.querySelector('.wipe')?.dataset.phase));
await p.goBack();await p.waitForTimeout(1500);console.log('back url',p.url(),await p.evaluate(()=>document.querySelector('.wipe')?.dataset.phase));}
await br.close();
