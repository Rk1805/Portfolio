import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
const B='http://localhost:3100';
const routes=['/','/work','/work/pet-agents','/work/phishing-email-analyzer','/work/english-winglish','/work/tracker','/playground','/about','/blog','/nope'];
const bad=[/\bPPO\b/i,/CGPA/i,/\+?\d[\d\s-]{9,}\d/];
fs.mkdirSync('screenshots',{recursive:true});
const br=await chromium.launch();
const out={};
for(const r of routes){
  const name=r==='/'?'home':r.slice(1).replace(/\//g,'_');
  out[r]={};
  for(const w of [375,1280,1920]){
    const ctx=await br.newContext({viewport:{width:w,height:w===375?812:900}});
    const p=await ctx.newPage();
    const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
    await p.goto(B+r,{waitUntil:'networkidle'});await p.waitForTimeout(2500);
    // scroll through to trigger lazy
    const h=await p.evaluate(()=>document.documentElement.scrollHeight);
    for(let y=0;y<h;y+=500){await p.mouse.wheel(0,500);await p.waitForTimeout(60);}
    await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(1500);
    await p.screenshot({path:`screenshots/${name}-${w}.png`,fullPage:true});
    const o=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,text:document.body.innerText}));
    out[r][w]={overflowX:o.sw>o.cw,errs,badText:bad.map(b=>(o.text.match(b)||[])[0]).filter(Boolean)};
    if(w===1280){const a=await new AxeBuilder({page:p}).analyze();out[r].axe=a.violations.map(v=>`${v.id}(${v.impact}) x${v.nodes.length}`);}
    await ctx.close();
  }
}
await br.close();
fs.writeFileSync('results1.json',JSON.stringify(out,null,1));
console.log(JSON.stringify(out,null,1));
