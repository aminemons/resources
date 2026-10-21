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
 case'transport':
 s+=path('M72 188H502M72 45V188','#8aa192',2)+path('M91 166L448 61','#479363',3);
 s+=path('M92 102H437','#93b4c2',2)+path('m428 94 12 8-12 8','#93b4c2',2);
 s+=path('M428 148H92','#c28762',2)+path('m102 140-12 8 12 8','#c28762',2);
 s+=txt(314,49,'Carrier density rises')+txt(333,93,'E field →')+txt(126,143,'diffusion ←')+txt(105,216,'Position x');
 label='Illustrative carrier gradient, field and particle diffusion. Conventional current signs must be assigned separately.';break;
 case'noise':
 s+=path('M75 192H494M75 48V192','#8aa192',2)+path('M77 96H255C298 96 328 120 355 143S428 178 484 181','#3f8060',3);
 s+=path('M255 95V193','#a2bca7',1)+txt(211,213,'fc')+txt(113,78,'White-noise response')+txt(311,58,'Filter attenuation')+txt(484,217,'f');
 label='Conceptual first-order low-pass noise response; noise-equivalent bandwidth is based on integrated squared response.';break;
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
function quantitativeFigure(id){
 const W=560,H=296,left=82,right=514,top=38,bottom=243;
 const axis=(labelX,labelY,xTicks,yTicks,xMax,yMax)=>{
  let a='<rect x="16" y="16" width="528" height="263" rx="10" fill="#f9fcfa"/><path d="M'+left+' '+top+'V'+bottom+'H'+right+'" stroke="#506e5b" stroke-width="2" fill="none"/>';
  for(let i=0;i<=xTicks;i++){const v=i*xMax/xTicks,x=left+(right-left)*i/xTicks;a+='<path d="M'+x+' '+bottom+'v5" stroke="#6f8b75"/><text x="'+x+'" y="'+(bottom+20)+'" font-size="12" text-anchor="middle" fill="#3b5644">'+Number(v.toFixed(3))+'</text>';}
  for(let i=0;i<=yTicks;i++){const v=i*yMax/yTicks,y=bottom-(bottom-top)*i/yTicks;a+='<path d="M'+left+' '+y+'H'+right+'" stroke="#e3ebe5"/><text x="'+(left-9)+'" y="'+(y+4)+'" font-size="12" text-anchor="end" fill="#3b5644">'+Number(v.toFixed(3))+'</text>';}
  a+='<text x="'+((left+right)/2)+'" y="286" font-size="14" text-anchor="middle" fill="#263d2e">'+labelX+'</text><text x="30" y="29" font-size="14" fill="#263d2e">'+labelY+'</text>';
  return a;
 };
 const poly=(fn,xMax,yMax,color)=>{let pts=[];for(let i=0;i<=180;i++){const xx=i*xMax/180,yy=fn(xx);pts.push((left+(right-left)*xx/xMax).toFixed(2)+","+(bottom-(bottom-top)*Math.min(yMax,Math.max(0,yy))/yMax).toFixed(2));}return '<polyline points="'+pts.join(" ")+'" fill="none" stroke="'+color+'" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>';};
 let inner='',caption='';
 if(id==="29-mosfet-derivation"){
  inner=axis('Drain-source voltage VDS (V)','Drain current (µA)',5,4,1,40);
  const beta=200;
  const colors=['#2c6b56','#387f97','#ae7d47'];
  [0.2,0.4,0.6].forEach((ov,i)=>{inner+=poly(vds=>beta*(vds<ov?ov*vds-vds*vds/2:ov*ov/2),1,40,colors[i]);inner+='<path d="M'+(235+i*107)+' 29h21" stroke="'+colors[i]+'" stroke-width="3"/><text x="'+(259+i*107)+'" y="33" font-size="12" fill="#334f3b">'+ov.toFixed(1)+' V</text>';});
  caption="Derived long-channel NMOS I–V characteristics for β = 200 µA/V² and VOV = 0.2, 0.4, 0.6 V. Ideal model: no channel-length modulation, not a silicon measurement.";
 }else if(id==="30-tcad-validation"){
  inner=axis('Reverse-bias magnitude VR (V)','Depletion W (µm)',5,5,5,1);
  const vbi=0.7738435817,w0=0.3317798693;
  inner+=poly(vr=>w0*Math.sqrt((vbi+vr)/vbi),5,1,'#347e64');
  const y=bottom-(bottom-top)*w0;
  inner+='<circle cx="'+left+'" cy="'+y+'" r="5" fill="#276349"/><text x="100" y="'+(y-13)+'" font-size="12" fill="#285c40">W0 ≈ 0.332 µm</text>';
  caption="Abrupt-depletion approximation for silicon at 300 K, NA = 10¹⁷ cm⁻³ and ND = 10¹⁶ cm⁻³. Analytical baseline, not a TCAD result.";
 }else if(id==="31-mems-coupled"){
  inner=axis('Normalized displacement x/d','Force / (k·d)',5,4,.65,1.5);
  inner+=poly(z=>z,.65,1.5,'#377c9b');
  inner+=poly(z=>(4/27)/Math.pow(1-z,2),.65,1.5,'#af7950');
  const x=left+(right-left)*(1/3)/.65,y=bottom-(bottom-top)*(1/3)/1.5;
  inner+='<circle cx="'+x+'" cy="'+y+'" r="5" fill="#285d45"/><text x="'+(x+12)+'" y="'+(y-11)+'" font-size="12" fill="#244d37">Pull-in: x/d = 1/3</text><text x="400" y="63" fill="#377c9b" font-size="12">Spring</text><text x="400" y="79" fill="#af7950" font-size="12">Electrostatic</text>';
  caption="Ideal static force balance at the critical pull-in voltage: mechanical spring force z and electrostatic force (4/27)/(1−z)², z = x/d. Constant-voltage parallel plates only.";
 }else return "";
 return '<figure class="figure" data-quantitative="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(caption)+'" style="font-family:Outfit,system-ui,sans-serif">'+inner+'</svg><figcaption>'+esc(caption)+' The curves are generated from the equations in this lesson.</figcaption></figure>';
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
function math(){const engine=window.MathJax;if(typeof engine?.typesetPromise!=="function"){const status=$("math-status");if(status){status.hidden=false;status.textContent="Loading mathematical notation…"}return}const el=$("math-status");if(el)el.hidden=true;engine.typesetClear?.([$("content")]);engine.typesetPromise([$("content")]).catch(e=>console.error(e))}
window.addEventListener("mathjax-ready",()=>{Promise.resolve(window.MathJax?.startup?.promise).then(()=>{if(current)math()})});
window.addEventListener("mathjax-failed",()=>{const e=$("math-status");if(e){e.hidden=false;e.textContent="Equation renderer unavailable. Please check your connection."}});
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
 $("content").innerHTML='<p class="eyebrow">Original engineering study notes</p><h1>Understand the subject from the beginning.</h1><p class="lede">Read a concept, work through the equations, inspect a technical figure and solve problems without leaving the site. Chapters cover circuits, semiconductor devices, IC design, MEMS sensors, microfabrication and practical research.</p><div class="essentials"><span>'+chapters.length+' chapters · '+[...read].filter(id=>lookup.has(id)).length+' read here · '+groups.length+' units</span><a class="primary-btn" href="'+lessonUrl(chapters[0].id)+'" data-open="'+chapters[0].id+'">Start chapter 1 →</a></div><h2 class="divider-title">Subjects</h2><div class="catalog">'+groups.map(unit=>{const list=chapters.filter(c=>c.unit===unit);return '<button data-open="'+list[0].id+'"><strong>'+esc(unit)+'</strong><small>'+list.length+' lessons · '+esc(list[0].title)+'</small></button>'}).join("")+'</div><h2 class="divider-title">Upper-level study</h2><p class="intro-desc">Graduate-level device models, assumptions, derivations and quantitative engineering exercises.</p><div class="lesson-index">'+chapters.filter(c=>/^(28|29|30|31|32|33)-/.test(c.id)).map(c=>'<button class="index-row" data-open="'+c.id+'"><span class="idx">→</span><span><strong>'+esc(c.title)+'</strong><small>'+esc(c.summary)+'</small></span></button>').join("")+'</div><h2 class="divider-title">All chapters</h2>'+entries+'<p class="note">These original lessons provide a foundation and do not replace specialist textbooks, foundry rules, current software manuals or supervised laboratory safety training.</p>';
 linkNext($("content"));
}
function renderEquation(eq){
 return '<figure class="math-figure"><div class="math-display">\\['+esc(eq.tex)+'\\]</div><figcaption>'+esc(eq.caption)+'</figcaption></figure>';
}
function renderLicensedFigures(chapter){
 return (chapter.licensedFigures||[]).map(fig=>'<figure class="licensed-figure">'+
 '<img src="'+esc(fig.src)+'" alt="'+esc(fig.alt)+'" loading="lazy" decoding="async"><div class="figure-fallback" hidden>Reference illustration could not load here. <a href="'+esc(fig.source)+'" target="_blank" rel="noopener noreferrer">Open the credited original figure ↗</a></div>'+
 '<figcaption>'+esc(fig.caption)+'<span> Image: <a href="'+esc(fig.source)+'" target="_blank" rel="noopener noreferrer">'+esc(fig.creator)+'</a> · <a href="'+esc(fig.licenseURL)+'" target="_blank" rel="noopener noreferrer">'+esc(fig.license)+'</a>. Unmodified licensed educational figure.</span></figcaption></figure>').join("");
}
function renderGuidedReading(chapter){
 const items=chapter.reading||[];
 if(!items.length)return "";
 return '<section class="guided-reading"><h2>Read further—then test your understanding</h2><p>The articles and books below are study references, not substitute solutions. Each includes a specific question to investigate.</p>'+
 items.map((item,i)=>'<article class="reading-entry"><small>'+esc(item.label)+'</small><a href="'+esc(item.url)+'" target="_blank" rel="noopener noreferrer">'+esc(item.title)+' ↗</a><p>'+esc(item.task)+'</p></article>').join("")+'</section>';
}

function renderConceptExplorer(c){
 if(c.id==="29-mosfet-derivation")return '<section class="concept-lab" id="moslab"><div class="concept-kicker">Interactive model · Long-channel NMOS</div><h2>Change the gate and drain voltages</h2><p>Keep the device geometry constant and move the bias point. The curve and operating region are calculated from the ideal charge-sheet model, not from a measured transistor.</p><div class="model-controls"><label for="mos-vgs">Gate voltage, VGS <output id="mos-vgs-text">0.80 V</output><input id="mos-vgs" type="range" min="0" max="1.50" value="0.80" step="0.05"></label><label for="mos-vds">Drain voltage, VDS <output id="mos-vds-text">0.40 V</output><input id="mos-vds" type="range" min="0" max="1.50" value="0.40" step="0.05"></label></div><svg viewBox="0 0 600 312" id="mos-model-svg" role="img" aria-label="Ideal MOSFET drain current versus drain source voltage"><path d="M66 20V260H569" stroke="#718b78" stroke-width="2" fill="none"/><path d="M66 210H569M66 160H569M66 110H569M66 60H569" stroke="#e3ece4" stroke-width="1"/><text x="11" y="27">ID (µA)</text><text x="290" y="303">VDS (V)</text><text x="54" y="265">0</text><text x="525" y="283">1.5</text><text x="22" y="65">100</text><path id="mos-model-curve" d="" fill="none" stroke="#2c7650" stroke-width="3"/><circle id="mos-model-point" cx="0" cy="0" r="6" fill="#215a3b" stroke="#fff" stroke-width="2"/></svg><p id="mos-model-readout" class="concept-readout" aria-live="polite"></p><p class="model-caveat">Fixed parameters: VT = 0.45 V, β = 200 µA/V². This ideal model omits subthreshold current, channel-length modulation, mobility degradation, series resistance and short-channel effects.</p></section>';
 if(c.id==="31-mems-coupled")return '<section class="concept-lab" id="memslab"><div class="concept-kicker">Interactive model · Static electrostatic actuator</div><h2>Approach the pull-in instability</h2><p>Change the applied voltage and observe the stable displacement predicted by the ideal linear-spring, parallel-plate model.</p><div class="model-controls"><label for="mems-volt">Applied voltage <output id="mems-volt-text">1.00 V</output><input id="mems-volt" type="range" min="0" max="4.50" value="1.00" step="0.05"></label></div><div class="mems-gap"><div class="plate">Moving electrode</div><div class="mems-space" id="mems-space">Vacuum / air gap</div><div class="plate">Fixed electrode</div></div><p id="mems-readout" class="concept-readout" aria-live="polite"></p><p class="model-caveat">k = 0.5 N/m, d = 2 µm and A = 10⁻⁸ m². The critical value is approximately 3.66 V, for a rigid parallel-plate actuator at fixed voltage only.</p></section>';
 return "";
}
function mountConceptExplorer(c){
 if(c.id==="29-mosfet-derivation"){
  const g=$("mos-vgs"),d=$("mos-vds");
  if(!g||!d)return;
  const beta=200,vt=0.45,xMax=1.5,yMax=120;
  const current=(vg,vd)=>{
   const ov=Math.max(0,vg-vt);
   if(ov<=0)return 0;
   return beta*(vd<ov?ov*vd-vd*vd/2:ov*ov/2);
  };
  const xy=(v,i)=>[66+503*v/xMax,260-240*i/yMax];
  const redraw=()=>{
   const vg=+g.value,vd=+d.value,ov=Math.max(0,vg-vt);
   $("mos-vgs-text").textContent=vg.toFixed(2)+" V";
   $("mos-vds-text").textContent=vd.toFixed(2)+" V";
   let curve="";
   for(let i=0;i<=150;i++){
    const v=xMax*i/150,[x,y]=xy(v,current(vg,v));
    curve+=(i?"L":"M")+x.toFixed(2)+","+y.toFixed(2);
   }
   $("mos-model-curve").setAttribute("d",curve);
   const [px,py]=xy(vd,current(vg,vd));
   $("mos-model-point").setAttribute("cx",px.toFixed(2));
   $("mos-model-point").setAttribute("cy",py.toFixed(2));
   const region=ov<=0?"Cutoff (ideal)":vd<ov?"Triode / linear":"Saturation (ideal)";
   $("mos-model-readout").textContent="ID ≈ "+current(vg,vd).toFixed(2)+" µA · VOV = "+ov.toFixed(2)+" V · "+region;
  };
  g.addEventListener("input",redraw);d.addEventListener("input",redraw);redraw();
 }
 if(c.id==="31-mems-coupled"){
  const input=$("mems-volt");if(!input)return;
  const k=0.5,d=2e-6,area=1e-8,eps=8.8541878128e-12;
  const vpi=Math.sqrt(8*k*d**3/(27*eps*area));
  const redraw=()=>{
   const v=+input.value;
   $("mems-volt-text").textContent=v.toFixed(2)+" V";
   if(v>=vpi){
    $("mems-space").style.height="16px";
    $("mems-readout").textContent="No stable static branch beyond ideal pull-in ("+vpi.toFixed(2)+" V). This does not model post-contact motion.";
    return;
   }
   let lo=0,hi=d/3;
   for(let i=0;i<65;i++){
    const x=(lo+hi)/2;
    const residual=k*x-eps*area*v*v/(2*(d-x)**2);
    if(residual<0)lo=x;else hi=x;
   }
   const displacement=(lo+hi)/2;
   $("mems-space").style.height=Math.max(20,95*(1-displacement/d))+"px";
   $("mems-readout").textContent="Stable displacement ≈ "+(displacement*1e6).toFixed(4)+" µm ("+(displacement/d*100).toFixed(1)+"% of initial gap).";
  };
  input.addEventListener("input",redraw);redraw();
 }
}
function renderCapstone(c){
 const a=c.capstone;
 if(!a)return "";
 return '<section class="capstone"><span class="concept-kicker">Independent engineering project</span><h2>'+esc(a.title)+'</h2><p>'+esc(a.brief)+'</p><h3>What you must produce</h3><ol>'+a.deliverables.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol><h3>Evidence needed to claim mastery</h3><ul>'+a.acceptance.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul><p class="capstone-note">These are assessment criteria, not a guarantee of professional expertise. Submit code, reports and data for real technical review.</p></section>';
}
function lesson(c){
 document.title=c.title+" | Micro & Nano Study Notes";
 const i=chapters.indexOf(c),done=read.has(c.id);
 const example=c.example;
 $("content").innerHTML='<p class="eyebrow">'+esc(c.unit)+' · Chapter '+String(i+1).padStart(2,"0")+'</p>'+
 '<h1>'+esc(c.title)+'</h1><p class="lede">'+esc(c.summary)+'</p>'+
 '<div class="essentials"><span>'+esc(c.level)+' · '+c.sections.length+' explanations · '+c.checks.length+' problems</span><div class="actions"><button id="print" class="plain-btn">Print</button><button id="printAnswers" class="plain-btn">Print with solutions</button><button id="read" class="plain-btn">'+(done?"✓ Read":"Mark read")+'</button></div></div>'+
 '<div class="prereqs">'+(c.prerequisites?.length?'<span>Review first</span> '+c.prerequisites.map(id=>lookup.get(id)).filter(Boolean).map(p=>'<a href="'+lessonUrl(p.id)+'" data-open="'+p.id+'">'+esc(p.title)+'</a>').join(' · '):'')+'</div>'+'<details class="article-outline"><summary>Chapter outline · '+c.sections.length+' sections</summary><ol>'+c.sections.map((part,n)=>'<li><a href="#part-'+n+'">'+esc(part.title.replace(/^[0-9]+[.] */,''))+'</a></li>').join('')+'</ol></details>'+'<details class="objectives"><summary>Learning outcomes · '+c.objectives.length+' goals</summary><ul>'+c.objectives.map(t=>'<li>'+esc(t)+'</li>').join("")+'</ul></details>'+
 c.sections.map((part,n)=>'<section class="lesson-section" id="part-'+n+'"><h2>'+(n+1)+'. '+esc(part.title.replace(/^[0-9]+[.] */, ""))+'</h2>'+part.html+'</section>'+(c.equations||[]).filter(eq=>eq.after===n).map(renderEquation).join("")).join("")+
 diagram(c.diagram)+quantitativeFigure(c.id)+renderLicensedFigures(c)+renderConceptExplorer(c)+
 '<section class="example"><span class="number">Worked example</span><h2>'+esc(example.title)+'</h2><p class="problem">'+esc(example.problem)+'</p><details><summary>Show the complete worked solution</summary><div class="solution"><ol class="steps">'+example.steps.map(s=>'<li><div>'+s+'</div></li>').join("")+'</ol></div></details></section>'+
 '<section id="exercises"><h2 class="divider-title">Practice problems</h2><p class="intro-desc">Attempt the problem without notes, open a hint only if needed, then compare your method and units to the full solution.</p>'+
 c.checks.map((q,n)=>'<div class="exercise"><h3>Exercise '+(n+1)+(q.difficulty?' · '+esc(q.difficulty):'')+'</h3><p>'+esc(q.prompt)+'</p>'+(q.hint?'<details class="hint"><summary>Show a hint</summary><div class="solution">'+esc(q.hint)+'</div></details>':'')+'<details class="answer"><summary>Reveal answer and explanation</summary><div class="solution">'+q.answer+'</div></details></div>').join("")+'</section>'+
 renderCapstone(c)+
 '<section><h2 class="divider-title">Further reading</h2><p class="note">These references support the subject. The explanatory text, examples and vector diagrams here are originally authored, not scanned or copied from the linked books or papers.</p><ul class="source-list">'+c.sources.map(s=>'<li><a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+' ↗</a></li>').join("")+'</ul></section>'+
 renderGuidedReading(c)+
 '<div class="nextprev">'+(chapters[i-1]?'<a href="'+lessonUrl(chapters[i-1].id)+'" data-open="'+chapters[i-1].id+'" class="nav-next"><small>← Previous</small>'+esc(chapters[i-1].title)+'</a>':'<span></span>')+(chapters[i+1]?'<a href="'+lessonUrl(chapters[i+1].id)+'" data-open="'+chapters[i+1].id+'" class="nav-next"><small>Next →</small>'+esc(chapters[i+1].title)+'</a>':"")+'</div>';
 $("read").onclick=()=>{read.has(c.id)?read.delete(c.id):read.add(c.id);persist();$("read").textContent=read.has(c.id)?"✓ Read":"Mark read";toc()};
 $("print").onclick=()=>window.print();
 $("printAnswers").onclick=()=>{
  const details=[...$("content").querySelectorAll("details")];
  const previous=details.map(node=>node.open);
  details.forEach(node=>node.open=true);
  window.addEventListener("afterprint",()=>details.forEach((node,i)=>node.open=previous[i]),{once:true});
  window.print();
 };
 linkNext($("content"));mountConceptExplorer(c);
 $("content").querySelectorAll(".licensed-figure img").forEach(img=>{
   const fallback=img.parentElement.querySelector(".figure-fallback");
   const unavailable=()=>{img.hidden=true;if(fallback)fallback.hidden=false};
   img.addEventListener("error",unavailable);
   if(img.complete&&img.naturalWidth===0)unavailable();
 });
 math();
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
Promise.all(["lessons-1.json","lessons-2.json","lessons-3.json","lessons-4.json","advanced-1.json","advanced-2.json","advanced-3.json","advanced-4.json","advanced-5.json","advanced-6.json"].map(url=>fetch(url,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error(url+" "+r.status);return r.json()}))).then(parts=>{
 chapters=parts.flat();lookup=new Map(chapters.map(c=>[c.id,c]));
 route(new URLSearchParams(location.search).get("lesson"),false);
}).catch(e=>{
 console.error("Lesson loading",e);
 $("content").innerHTML='<h1>Could not load chapters</h1><p class="lede">Please refresh the page or inspect the lesson files in the public GitHub repository.</p>';
 $("toc").textContent="Chapter data unavailable";
});
