import lighthouse from 'lighthouse';
import * as cl from 'chrome-launcher';
import { chromium } from '@playwright/test';
import fs from 'fs';
const B='http://localhost:3100';
const routes=['/','/work','/work/pet-agents','/work/phishing-email-analyzer','/work/english-winglish','/work/tracker','/playground','/about'];
const chrome=await cl.launch({chromePath:chromium.executablePath(),chromeFlags:['--headless=new','--no-sandbox']});
const res={};
for(const r of routes){
  res[r]={};
  for(const m of ['simulate']){
    const x=await lighthouse(B+r,{port:chrome.port,output:'json',onlyCategories:['performance','accessibility','seo','best-practices'],throttlingMethod:m,logLevel:'error'});
    const l=x.lhr,a=l.audits;
    res[r][m]={perf:Math.round(l.categories.performance.score*100),a11y:Math.round(l.categories.accessibility.score*100),seo:Math.round(l.categories.seo.score*100),lcp:+(a['largest-contentful-paint'].numericValue/1000).toFixed(2),cls:+a['cumulative-layout-shift'].numericValue.toFixed(3),tbt:Math.round(a['total-blocking-time'].numericValue),fails:Object.values(l.audits).filter(u=>u.score===0&&u.scoreDisplayMode==='binary').map(u=>u.id)};
  }
  console.log(r,JSON.stringify(res[r]));
}
await chrome.kill();
fs.writeFileSync('lh3a.json',JSON.stringify(res,null,1));
