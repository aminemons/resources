import fs from "node:fs";
import assert from "node:assert/strict";
import vm from "node:vm";
const read=p=>fs.readFileSync(new URL(p,import.meta.url),"utf8");
const paths=["lessons-1.json","lessons-2.json","lessons-3.json","lessons-4.json","advanced-1.json","advanced-2.json","advanced-3.json","advanced-4.json","advanced-5.json","advanced-6.json"];
const lessons=paths.flatMap(p=>JSON.parse(read(p)));
const ids=new Set();
const allowed=new Set(["Advanced semiconductor physics","Device simulation and verification","Sensors and intelligent microsystems","Analog IC and instrumentation","Engineering laboratories","Core foundations","Semiconductor devices","IC design and digital systems","Sensors and smart systems","Photonics and quantum","Research methods"]);
const shapes=["ohm","kcl","rc","sampling","calibration","bands","pn","moscap","mosfet","tcad","amplifier","readout","digital","rtl","asic","sensor","mems","process","heater","iot","ring","research","transport","noise"];
const html=read("index.html"),css=read("notes.css"),script=read("notes.js");
assert(lessons.length>=33,"All introductory lessons must be retained");
assert(html.includes('src="./notes.js"')&&html.includes('href="./notes.css"'));
assert(html.includes("MathJax")&&html.includes('id="toc"'));
assert(css.includes("@media print")&&css.includes("prefers-reduced-motion"));
new vm.Script(script,{filename:"notes.js"});
for(const l of lessons){
 if(l.id.startsWith("28-")||l.id.startsWith("29-")||l.id.startsWith("30-")||l.id.startsWith("31-")||l.id.startsWith("32-")||l.id.startsWith("33-")){
   assert(l.sections.length>=7&&l.checks.length>=6&&l.example.steps.length>=5,"Advanced study material too short: "+l.id);
   assert(l.checks.every(c=>c.hint&&c.difficulty),"Advanced practice must provide graded difficulty and hints: "+l.id);
 }

 assert(l.id&&typeof l.id==="string"&&!ids.has(l.id),"Duplicate or missing ID "+l.id);ids.add(l.id);
 assert(allowed.has(l.unit),"Unknown unit "+l.unit);
 assert(l.title.length>=10&&l.summary.length>=35&&l.objectives.length>=3,l.id+" metadata");
 assert(shapes.includes(l.diagram),l.id+" figure missing");
 assert(l.sections.length>=3,l.id+" needs substantial teaching");
 assert(l.example.steps.length>=3&&l.checks.length>=2,l.id+" missing practice");
 assert(l.sources.every(s=>s.url.startsWith("https://")&&s.title),l.id+" needs source credits");
 const all=l.sections.map(x=>x.html).join("\n")+" "+l.example.steps.join(" ")+" "+l.checks.map(q=>q.answer).join("\n");
 assert(!/<script|onerror\s*=|javascript:/i.test(all),"Unsafe lesson markup "+l.id);
 assert((all.match(/\\\(/g)||[]).length===(all.match(/\\\)/g)||[]).length,"Unclosed inline TeX in "+l.id);
 assert(l.sections.every(s=>s.html.length>230&&s.title.length>8),"Trivial section "+l.id);
}
assert.equal(new Set(lessons.map(x=>x.title.toLowerCase())).size,lessons.length);
const near=(a,b,tol=1e-5)=>assert(Math.abs(a-b)<tol,"Expected "+b+", got "+a);
near(3.3/4096*1000,.8056640625,.00001);
near(1/(2*Math.PI*.1),1.5915494309189535);
near(1.55**2/(4*2*Math.PI*10)*1000,9.5594,.004);
near(8.854e-12*1e-6/1e-5*1e12,.8854,.0001);
near((20-15)/20*100,25);
near((1.01-1)/1.01*100,.990099,.0001);
near((10e3)*(10e-6),.1);

// Independently recompute numerical quantities appearing in the advanced worked examples.
const q=1.602176634e-19;
const drift=q*1350*2e15*(-25);
const diffusion=q*35*2e18;
near(drift,-10.8146922795,1e-8);
near(diffusion,11.215236438,1e-8);
near(drift+diffusion,0.4005441585,1e-8);
near(0.5*200*(0.2**2),4,1e-10); // MOS current in microamperes
near(200*0.2,40,1e-10);          // MOS gm in microsiemens
const epsSi=11.7*8.8541878128e-14;
const na=1e17,nd=1e16,ni=1e10,vt=0.0258519998;
const vbi=vt*Math.log(na*nd/(ni**2));
const wUm=Math.sqrt(2*epsSi/q*(1/na+1/nd)*vbi)*1e4;
near(vbi,.7738435817,1e-8);
near(wUm,.3317798693,1e-8);
near(wUm*nd/(na+nd),.0301618063,1e-8);
const epsAir=8.8541878128e-12,area=1e-8,d=2e-6,k=.5;
const vPi=Math.sqrt(8*k*d**3/(27*epsAir*area));
near(vPi,3.6586321141,1e-8);
near(epsAir*area/d*1e15,44.270939064,1e-7); // fF
const kb=1.380649e-23;
near(Math.sqrt(4*kb*300*10000*1000)*1e6,.4070354776,1e-8);
near(Math.sqrt(Math.PI/2*1000)*10e-9*1e6,.3963327298,1e-8);
near(3.3/4096/Math.sqrt(12)*1e6,232.5751817,1e-6);
near(30/12,2.5);
near((30-12)/30,.60);
near(1/(0.02*50+0.10),.9090909091,1e-8);
const used =new Set([...script.matchAll(/case'([^']+)'/g)].map(m=>m[1]));
for(const l of lessons)assert(used.has(l.diagram)||l.diagram==="sensor","Missing SVG "+l.diagram);
console.log("Textbook tests PASS:",lessons.length,"lessons,",lessons.reduce((s,x)=>s+x.sections.length,0),"sections,",lessons.reduce((s,x)=>s+x.checks.length,0),"exercises,",lessons.length,"worked examples and",new Set(lessons.map(x=>x.diagram)).size,"diagrams.");
