"use strict";
const $=id=>document.getElementById(id);
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const lessonUrl=id=>"?lesson="+encodeURIComponent(id);
const palette='#35664b',muted='#c4dace';
const frame='<rect x="20" y="20" width="520" height="200" rx="10" fill="#f6faf7"/>';
function diagram(type){
 const path=(d,stroke=palette,width=3)=>'<path d="'+d+'" fill="none" stroke="'+stroke+'" stroke-width="'+width+'" stroke-linecap="round" stroke-linejoin="round"/>';
 const box=(x,y,w,h,color='#d7eadc')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="4" fill="'+color+'"/>';
 const txt=(x,y,s)=>'<text x="'+x+'" y="'+y+'" fill="#294b36" font-size="15">'+s+'</text>';
 let s=frame,label='';
 switch(type){
 case'ohm':
 s+=path('M90 88H230 M310 88H469V182H90V88')+path('M230 88l12-12 13 24 13-24 13 24 13-24 16 12')+path('M72 126H108',palette,2)+path('M82 141H98',palette,2)+txt(259,54,'Resistor R')+txt(352,74,'current →')+txt(53,165,'V source');label='Simple electrical loop with supply and resistor.';break;
 case'kcl':
 s+=path('M85 122H475M280 46V203')+'<circle cx="280" cy="122" r="10" fill="#397e55"/>'+path('m198 113 18 9-18 9 m157-18-18 9 18 9 m-84-61 9 18 9-18')+txt(124,101,'I1 →')+txt(348,101,'I2 →')+txt(300,68,'I3 ↓')+txt(285,218,'Node');label='Current-conservation diagram for a node.';break;
 case'rc':
 s+=path('M76 190H500M76 190V40','#758c79',2)+path('M77 190C121 116 177 76 251 61S412 47 481 47')+path('M160 190V55',muted,1)+txt(171,206,'τ = RC')+txt(166,110,'63.2%')+txt(461,219,'t')+txt(35,49,'V');label='Exponential response of an ideal RC step circuit.';break;
 case'sampling':
 s+=path('M65 130H500M65 47V194','#758c79',2)+path('M72 130C104 26 143 26 176 130S247 235 280 130S351 26 384 130S455 235 490 130','#739bad',3);
 for(let i=0;i<15;i++){const x=77+i*28,y=130-84*Math.sin((x-72)*2*Math.PI/210);s+='<circle cx="'+x+'" cy="'+y.toFixed(1)+'" r="4.5" fill="#356e51"/>'+path('M'+x+' 130V'+y.toFixed(1),muted,1)}
 label='Analog waveform and time-discrete sample positions.';break;
 case'calibration':case'sensor':
 s+=path('M71 41V200H489','#758c79',2)+path('M85 188L468 53');
 [[113,180],[160,145],[214,148],[257,126],[310,113],[355,85],[413,75],[448,62]].forEach(a=>s+='<circle cx="'+a[0]+'" cy="'+a[1]+'" r="4.5" fill="#397250"/>');s+=txt(395,42,'Measured points');label='Line-fit calibration and experimental scatter.';break;
 case'bands':
 s+=box(90,51,385,58,'#b6d8c3')+box(90,146,385,56,'#bfd3df')+path('M90 127H475','#c19d6c',2)+txt(104,85,'Conduction band')+txt(104,183,'Valence band')+txt(292,131,'Bandgap');label='Simplified energy-band picture, not drawn to scale.';break;
 case'pn':
 s+=box(81,62,181,133,'#dce8f0')+box(262,62,78,133,'#eaf1e6')+box(340,62,143,133,'#bcdccb')+path('M262 62V195M340 62V195',muted,2)+txt(135,93,'p region')+txt(373,93,'n region')+txt(269,119,'Space')+txt(269,142,'charge');label='Stylized PN structure with a depleted space-charge zone.';break;
 case'moscap':
 s+=box(122,49,315,40,'#74998e')+box(122,90,315,24,'#e6eddc')+box(122,115,315,95,'#b7d0dc')+txt(249,75,'Gate')+txt(239,108,'Oxide')+txt(210,180,'p-type Si');label='Basic gate/oxide/semiconductor stack.';break;
 case'mosfet':
 s+=box(78,93,416,116,'#bfd3df')+box(101,94,91,52,'#8fc69e')+box(388,94,91,52,'#8fc69e')+box(209,85,163,7,'#e6ecda')+box(209,52,163,30,'#7c9f90')+path('M192 100H388','#35835d',3)+txt(127,119,'Source')+txt(411,119,'Drain')+txt(259,75,'Gate')+txt(260,137,'Channel');label='Simplified NMOS cross-section showing channel and terminals.';break;
 case'tcad':
 s+=box(88,52,385,156,'#f9fcf8');
 for(let i=0;i<=19;i++)s+=path('M'+(89+i*20)+' 52V208','#c3dbc9',1);
 for(let i=0;i<=7;i++)s+=path('M88 '+(52+i*22)+'H473','#c3dbc9',1);
 for(let i=0;i<=7;i++)s+=path('M'+(257+i*9)+' 52V208','#418359',1);
 s+=txt(119,41,'Coarse mesh')+txt(319,41,'Refined near junction');label='Device-simulation mesh refinement in high-gradient regions.';break;
 case'amplifier':
 s+=path('M301 44V74 l-10 11 20 11-20 11 20 11-10 11 V186H301M284 130V173M289 132V172M284 151H213M301 151H440')+txt(313,97,'RD')+txt(177,150,'Vin')+txt(444,153,'Vout')+txt(315,44,'VDD')+txt(312,199,'GND');label='Conceptual common-source amplifier and drain load.';break;
 case'readout':case'iot':case'asic':case'research':{
 const words=type==='readout'?['Sensor','Gain','Filter','ADC']:type==='iot'?['Sense','MCU','Radio','Cloud']:type==='asic'?['RTL','Synthesis','Place','Route']:['Question','Baseline','Test','Report'];
 words.forEach((w,i)=>{const x=32+i*132;s+=box(x,91,111,61,'#e2eee5')+txt(x+11,127,w);if(i<3)s+=path('M'+(x+112)+' 120h18')});
 label=type==='readout'?'A typical sensor analog signal chain.':type==='iot'?'Data passes from sensor to microcontroller, radio and storage.':type==='asic'?'Typical digital ASIC flow, before required physical checks.':'A responsible research workflow.';break;
 }
 case'digital':
 s+=path('M124 78H228M124 165H228M228 54H276A59 59 0 0 1 276 189H228Z')+path('M335 121H456')+txt(99,80,'A')+txt(98,169,'B')+txt(411,103,'Y')+txt(246,127,'AND');label='A two-input AND logic gate.';break;
 case'rtl':
 s+=path('M66 179H506','#8b9e8b',2)+path('M72 145H123V94H174V145H225V94H276V145H327V94H378V145H429V94H480')+txt(85,70,'Clock rising edges')+txt(145,216,'New register state on each rising edge');label='Ideal synchronous clock waveform.';break;
 case'mems':
 s+=box(109,72,348,17,'#93baa0')+box(109,170,348,17,'#7292a1')+path('M281 91V165')+txt(157,60,'Movable diaphragm')+txt(158,212,'Fixed electrode')+txt(300,131,'gap d');label='Two surfaces forming a gap-sensitive capacitor.';break;
 case'process':
 [42,172,302,432].forEach((x,i)=>{s+=box(x,132,94,43,'#bfd6df')+box(x,123,94,8,'#c5d9be')+txt(x,64,['Wafer','Deposit','Pattern','Inspect'][i]);if(i===2)s+=box(x+25,112,44,10,'#709e81')});label='Illustrative thin-film processing, not a fabrication recipe.';break;
 case'heater':
 s+=box(105,49,361,161,'#eaf2eb')+path('M128 129H174V86H239V181H303V86H369V181H439','#a36b4b',12)+txt(181,41,'Meandering resistive heater');label='Conceptual microheater layout, not a qualified design.';break;
 case'ring':
 s+=path('M60 133H496','#377a8c',12)+'<circle cx="278" cy="73" r="45" stroke="#377a8c" stroke-width="12" fill="none"/>'+txt(323,74,'Ring')+txt(67,108,'Bus waveguide');label='Microring resonator coupled to a bus waveguide.';break;
 default:
 s+=txt(120,115,'Engineering diagram');label='Original teaching diagram.';
 }
 return '<figure class="figure"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 240" role="img" aria-label="'+esc(label)+'" style="font-family:Outfit,system-ui,sans-serif">'+s+'</svg><figcaption>'+esc(label)+' Original instructional vector figure.</figcaption></figure>';
}
let chapters=[],lookup=new Map(),current=null,searchTerm="",read=new Set();
try{read=new Set(JSON.parse(localStorage.getItem("micro-nano-textbook-read")||"[]"))}catch{}
function persist(){try{localStorage.setItem("micro-nano-textbook-read",JSON.stringify([...read]))}catch{}}
function closeSide(){openSide(false)}
function openSide(v){$("sidebar").classList.toggle("open",v);$("cover").hidden=!v;$("menu").setAttribute("aria-expanded",String(v))}
function toc(){
 let previous="";
 const shown=chapters.filter(c=>(c.title+" "+c.unit+" "+c.summary).toLowerCase().includes(searchTerm));
 $("toc").innerHTML=shown.length?shown.map(c=>{
 const header=c.unit!==previous?'<div class="toc-unit">'+esc(c.unit)+'</div>':"";
 previous=c.unit;
 return header+'<button class="toc-link '+(current===c.id?"active":"")+'" data-chapter="'+c.id+'" '+(current===c.id?'aria-current="page"':'')+'><span class="num">'+String(chapters.indexOf(c)+1).padStart(2,"0")+'</span><span>'+esc(c.title)+'</span>'+(read.has(c.id)?'<span class="done" aria-label="Completed">✓</span>':"")+'</button>'
 }).join(""):'<p class="loading">No matching lesson.</p>';
 $("toc").querySelectorAll("[data-chapter]").forEach(b=>b.onclick=()=>route(b.dataset.chapter));
}
function math(){if(window.MathJax&&typeof window.MathJax.typesetPromise==="function"){window.MathJax.typesetPromise([$("content")]).catch(err=>console.error("Equation render",err))}}
function route(id,push=true){
 current=lookup.has(id)?id:null;
 if(push)history.pushState({id:current},"",current?lessonUrl(current):"./");
 toc();
 if(current)lesson(lookup.get(current));else home();
 closeSide();
 if(window.scrollTo)window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
}
function linkNext(el){el.querySelectorAll("[data-open]").forEach(a=>a.onclick=e=>{e.preventDefault();route(a.dataset.open)})}
function home(){
 document.title="Engineering Study Notes | Micro & Nano";
 const groups=[...new Set(chapters.map(c=>c.unit))];
 const entries=groups.map(unit=>'<h2 class="group-head">'+esc(unit)+'</h2><div class="lesson-index">'+chapters.filter(c=>c.unit===unit).map(c=>'<button class="index-row" data-open="'+c.id+'"><span class="idx">'+String(chapters.indexOf(c)+1).padStart(2,"0")+'</span><span><strong>'+esc(c.title)+'</strong><small>'+esc(c.summary)+'</small></span></button>').join("")+'</div>').join("");
 $("content").innerHTML='<p class="eyebrow">Original engineering study notes</p><h1>Understand the subject from the beginning.</h1><p class="lede">Read a concept, work through the equations, inspect a technical figure and solve problems without leaving the site. Chapters cover circuits, semiconductor devices, IC design, MEMS sensors, microfabrication and practical research.</p><div class="essentials"><span>'+chapters.length+' chapters · '+[...read].filter(id=>lookup.has(id)).length+' read here · '+groups.length+' units</span><a class="primary-btn" href="'+lessonUrl(chapters[0].id)+'" data-open="'+chapters[0].id+'">Start chapter 1 →</a></div><h2 class="divider-title">Subjects</h2><div class="catalog">'+groups.map(unit=>{const list=chapters.filter(c=>c.unit===unit);return '<button data-open="'+list[0].id+'"><strong>'+esc(unit)+'</strong><small>'+list.length+' lessons · '+esc(list[0].title)+'</small></button>'}).join("")+'</div><h2 class="divider-title">Contents</h2>'+entries+'<p class="note">These original lessons provide a foundation and do not replace specialist textbooks, foundry rules, current software manuals or supervised laboratory safety training.</p>';
 linkNext($("content"));
}
function lesson(c){
 document.title=c.title+" | Micro & Nano Study Notes";
 const i=chapters.indexOf(c),done=read.has(c.id);
 const example=c.example;
 $("content").innerHTML='<p class="eyebrow">'+esc(c.unit)+' · Chapter '+String(i+1).padStart(2,"0")+'</p>'+
 '<h1>'+esc(c.title)+'</h1><p class="lede">'+esc(c.summary)+'</p>'+
 '<div class="essentials"><span>'+esc(c.level)+' · '+c.sections.length+' explanations · '+c.checks.length+' problems</span><div class="actions"><button id="print" class="plain-btn">Print</button><button id="read" class="plain-btn">'+(done?"✓ Read":"Mark read")+'</button></div></div>'+
 '<section class="objectives"><h2>You will learn to</h2><ul>'+c.objectives.map(t=>'<li>'+esc(t)+'</li>').join("")+'</ul></section>'+
 c.sections.map((s,n)=>'<section class="lesson-section" id="part-'+n+'"><h2>'+(n+1)+'. '+esc(s.title)+'</h2>'+s.html+'</section>').join("")+
 diagram(c.diagram)+
 '<section class="example"><span class="number">Worked example</span><h2>'+esc(example.title)+'</h2><p class="problem">'+esc(example.problem)+'</p><details><summary>Show the complete worked solution</summary><div class="solution"><ol class="steps">'+example.steps.map(s=>'<li><div>'+s+'</div></li>').join("")+'</ol></div></details></section>'+
 '<section id="exercises"><h2 class="divider-title">Practice problems</h2><p class="intro-desc">Try each problem first, then open its solution to check your method and units.</p>'+
 c.checks.map((q,n)=>'<div class="exercise"><h3>Exercise '+(n+1)+'</h3><p>'+esc(q.prompt)+'</p><details><summary>Reveal answer and explanation</summary><div class="solution">'+q.answer+'</div></details></div>').join("")+'</section>'+
 '<section><h2 class="divider-title">Further reading</h2><p class="note">These references support the subject. The explanatory text, examples and vector diagrams here are originally authored, not scanned or copied from the linked books or papers.</p><ul class="source-list">'+c.sources.map(s=>'<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+' ↗</a></li>').join("")+'</ul></section>'+
 '<div class="nextprev">'+(chapters[i-1]?'<a href="'+lessonUrl(chapters[i-1].id)+'" data-open="'+chapters[i-1].id+'" class="nav-next"><small>← Previous</small>'+esc(chapters[i-1].title)+'</a>':'<span></span>')+(chapters[i+1]?'<a href="'+lessonUrl(chapters[i+1].id)+'" data-open="'+chapters[i+1].id+'" class="nav-next"><small>Next →</small>'+esc(chapters[i+1].title)+'</a>':"")+'</div>';
 $("read").onclick=()=>{read.has(c.id)?read.delete(c.id):read.add(c.id);persist();$("read").textContent=read.has(c.id)?"✓ Read":"Mark read";toc()};
 $("print").onclick=()=>window.print();
 linkNext($("content"));math();
}
$("menu").onclick=()=>openSide(!$("sidebar").classList.contains("open"));
$("cover").onclick=closeSide;
$("search").oninput=e=>{searchTerm=e.target.value.trim().toLowerCase();toc()};
$("topHome").onclick=e=>{e.preventDefault();route(null)};
window.addEventListener("popstate",()=>route(new URLSearchParams(location.search).get("lesson"),false));
document.addEventListener("keydown",e=>{
 if(e.key==="Escape")closeSide();
 if(e.key==="/"&&!e.ctrlKey&&!e.metaKey&&!["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)){e.preventDefault();if(window.innerWidth<=850)openSide(true);$("search").focus()}
});
Promise.all(["lessons-1.json","lessons-2.json","lessons-3.json","lessons-4.json"].map(url=>fetch(url,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error(url+" "+r.status);return r.json()}))).then(parts=>{
 chapters=parts.flat();lookup=new Map(chapters.map(c=>[c.id,c]));
 route(new URLSearchParams(location.search).get("lesson"),false);
}).catch(e=>{
 console.error("Lesson loading",e);
 $("content").innerHTML='<h1>Could not load chapters</h1><p class="lede">Please refresh the page or inspect the lesson files in the public GitHub repository.</p>';
 $("toc").textContent="Chapter data unavailable";
});
