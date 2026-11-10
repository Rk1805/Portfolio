import { chromium } from '@playwright/test';
const br=await chromium.launch();const p=await (await br.newContext({viewport:{width:1280,height:800}})).newPage();
await p.goto('http://localhost:3100/playground',{waitUntil:'networkidle'});
const d=p.locator('[data-testid=dial-inline] input, input[data-testid=dial-inline]').first();console.log(await d.getAttribute('min'),await d.getAttribute('max'),await d.inputValue());
await d.focus();await p.keyboard.press('Home');await p.waitForTimeout(1500);
console.log(await d.inputValue(),await p.evaluate(()=>[...document.querySelectorAll('[data-level]')].map(e=>e.tagName+e.dataset.level).join(',')));
await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:'screenshots/dial-lowest-1280.png'});
await br.close();
