import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser=await chromium.launch({headless:true});
try {
 for(const viewport of [{width:1365,height:900,name:"desktop"},{width:390,height:844,name:"mobile"}]){
   const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
   const pageErrors=[];
   page.on("pageerror",error=>pageErrors.push(String(error)));
   await page.goto("http://127.0.0.1:8765/?lesson=29-mosfet-derivation",{waitUntil:"domcontentloaded"});
   await page.locator(".lesson-section").first().waitFor({timeout:15000});
   await page.waitForFunction(()=>document.querySelectorAll("mjx-container").length>20,{timeout:20000});
   const result=await page.evaluate(()=>{
     const content=document.getElementById("content");
     const math=[...content.querySelectorAll("mjx-container")];
     const displays=[...content.querySelectorAll("mjx-container[display='true']")];
     const status=document.getElementById("math-status");
     const figures=[...content.querySelectorAll(".math-figure")];
     return {math:math.length,displays:displays.length,figures:figures.length,
       rawTeX:content.innerText.includes("\\\\("),
       status:status?.hidden?"":status?.textContent,
       chapter:content.querySelector("h1")?.textContent,
       externalIllustrations:content.querySelectorAll(".licensed-figure img").length,
       bodyWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth};
   });
   assert.match(result.chapter,/MOSFET/i);
   assert(result.math>20,"Less than 20 rendered TeX expressions: "+JSON.stringify(result));
   assert(result.displays>=4,"Missing typeset display equations: "+JSON.stringify(result));
   assert(result.figures>=4,"Missing annotated mathematics figures: "+JSON.stringify(result));
   assert.equal(result.status,"","Math error: "+JSON.stringify(result));
   assert.equal(result.externalIllustrations,1,"No licensed MOSFET figure");
   const img=await page.locator(".licensed-figure img").first().evaluate(el=>({loaded:el.complete&&el.naturalWidth>0,width:el.naturalWidth}));
   console.log("LICENSED FIGURE",viewport.name,JSON.stringify(img));
   const imageFallback=await page.locator(".licensed-figure .figure-fallback").first().evaluate(el=>({hidden:el.hidden}));
   assert(img.loaded||!imageFallback.hidden,"Figure failed but credited fallback did not appear");

   const interactive=await page.locator("#mos-vgs").evaluate(el=>{el.value="1.10";el.dispatchEvent(new Event("input",{bubbles:true}));return document.getElementById("mos-model-readout")?.textContent});
   assert.match(interactive,/VOV = 0\.65 V/,"MOSFET model slider failed");

   assert.equal(pageErrors.length,0,"Browser errors: "+pageErrors.join(" | "));
   if(viewport.name==="mobile"){
    const offenders=await page.evaluate(()=>[...document.querySelectorAll("body *")].filter(el=>{const b=el.getBoundingClientRect();return b.right>innerWidth+2&&b.width>0&&getComputedStyle(el).position!=="fixed"}).slice(0,20).map(el=>({tag:el.tagName,id:el.id,cls:String(el.className).slice(0,90),right:el.getBoundingClientRect().right,width:el.getBoundingClientRect().width})));
    console.log("MOBILE OVERFLOW ANALYSIS",JSON.stringify(offenders));
    assert(result.bodyWidth<=result.viewportWidth+2,"Mobile page overflow: "+JSON.stringify(result));
   }
   await page.screenshot({path:"notes-"+viewport.name+".png",fullPage:false});
   console.log(viewport.name.toUpperCase()+" MathJax PASS",JSON.stringify(result));
   await page.close();
 }

 const extra=await browser.newPage({viewport:{width:1024,height:820}});
 for(const id of ["28-carrier-transport","29-mosfet-derivation","30-tcad-validation","31-mems-coupled","32-low-noise-frontends","33-gas-sensor-chemistry"]){
   await extra.goto("http://127.0.0.1:8765/?lesson="+id,{waitUntil:"domcontentloaded"});
   await extra.locator(".lesson-section").first().waitFor({timeout:15000});
   await extra.waitForFunction(()=>document.querySelectorAll(".math-figure mjx-container").length>=4,{timeout:20000});
   const x=await extra.evaluate(()=>({
     errors:document.querySelectorAll("mjx-merror").length,
     formulas:document.querySelectorAll("mjx-container").length,
     displayEquations:document.querySelectorAll(".math-figure mjx-container[display='true']").length,
     capstone:!!document.querySelector(".capstone"),
     readingEntries:document.querySelectorAll(".reading-entry").length,
     chapter:document.querySelector("h1")?.textContent
   }));
   assert.equal(x.errors,0,"Invalid TeX in "+id+": "+JSON.stringify(x));
   assert(x.displayEquations>=4,"Display equations missing in "+id);
   assert(x.capstone&&x.readingEntries>=2,"Advanced study/support sections absent: "+id);
   console.log("CHAPTER PASS",id,JSON.stringify(x));
 }
 await extra.close();
}finally{
 await browser.close();
}
