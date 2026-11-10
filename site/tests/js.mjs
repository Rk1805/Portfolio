import zlib from 'zlib';
const B='http://localhost:3100';
for(const r of ['/','/work','/work/pet-agents','/work/phishing-email-analyzer','/work/english-winglish','/work/tracker','/playground','/about','/blog']){
  const h=await (await fetch(B+r)).text();
  const s=[...h.matchAll(/<script[^>]*src="(\/_next\/[^"]+)"[^>]*>/g)].filter(x=>!/nomodule/.test(x[0])).map(x=>x[1]);
  let t=0;for(const u of [...new Set(s)]){const b=Buffer.from(await (await fetch(B+u)).arrayBuffer());t+=zlib.gzipSync(b).length}
  console.log(r,(t/1024).toFixed(1)+' KB gz',s.length,'scripts');
}
