import lighthouse from 'lighthouse';import * as cl from 'chrome-launcher';import { chromium } from '@playwright/test';
const ch=await cl.launch({chromePath:chromium.executablePath(),chromeFlags:['--headless=new','--no-sandbox']});
for(const r of ['/','/about','/','/about','/','/about']){const x=await lighthouse('http://localhost:3100'+r,{port:ch.port,output:'json',onlyCategories:['performance','accessibility','seo'],logLevel:'error'});const l=x.lhr;console.log(r,Math.round(l.categories.performance.score*100),Math.round(l.categories.accessibility.score*100),Math.round(l.categories.seo.score*100),'lcp',(l.audits['largest-contentful-paint'].numericValue/1000).toFixed(2),'cls',l.audits['cumulative-layout-shift'].numericValue)}
await ch.kill();
