import fs from "node:fs";
import assert from "node:assert/strict";
import vm from "node:vm";

const load=name=>fs.readFileSync(new URL(name,import.meta.url),"utf8");
const store=new Map(),nodes=new Map();
const required=["sidebar","cover","menu","search","toc","content","topHome","read","print","printAnswers"];
function makeNode(id){
 return {id,innerHTML:"",textContent:"",value:"",hidden:true,
   classList:{open:false,toggle(name,val){this.open=val??!this.open;return this.open},contains(name){return this.open}},
   setAttribute(){},addEventListener(){},querySelectorAll(){return[]},focus(){},onclick:null,oninput:null};
}
for(const id of required)nodes.set(id,makeNode(id));
const document={getElementById:id=>nodes.get(id)||null,activeElement:{tagName:"BODY"},addEventListener(){}};
const context={document,console,URLSearchParams,window:null,history:{pushState(){}},
 location:{search:"?lesson=01-electricity"},localStorage:{getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value)},
 fetch:async name=>({ok:true,status:200,json:async()=>JSON.parse(load(name))}),
 setTimeout,clearTimeout,Promise};
context.window=context;context.addEventListener=()=>{};context.scrollTo=()=>{};context.matchMedia=()=>({matches:false});context.innerWidth=1300;context.print=()=>{};
vm.createContext(context);
vm.runInContext(load("notes.js"),context,{filename:"notes.js",timeout:8000});
for(let i=0;i<5;i++)await new Promise(resolve=>setImmediate(resolve));
assert(nodes.get("content").innerHTML.includes("Voltage, current, resistance and power"),"Deep-linked chapter did not render");
assert(nodes.get("content").innerHTML.includes("Show the complete worked solution"),"Worked steps not available");
assert(nodes.get("content").innerHTML.includes("Print with solutions"),"Solution printing is unavailable");
assert(nodes.get("content").innerHTML.includes("Reveal answer and explanation"),"Exercise solutions not available");
assert(nodes.get("content").innerHTML.includes("Original instructional vector figure"),"Figure not present");
assert(nodes.get("toc").innerHTML.includes("Engineering laboratories"),"Lab table of contents missing");
vm.runInContext('route("25-verilog-lab")',context);
assert(nodes.get("content").innerHTML.includes("self-checking testbench"),"Lab did not render");
assert(nodes.get("content").innerHTML.includes("iverilog"),"Lab code absent");
vm.runInContext('route("27-xrd")',context);
assert(nodes.get("content").innerHTML.includes("Bragg"),"XRD lesson did not render");
assert(nodes.get("content").innerHTML.includes("0.2976"),"Calculation steps absent");
nodes.get("read").onclick();
assert(JSON.parse(store.get("micro-nano-textbook-read")).includes("27-xrd"),"Progress not saved");
vm.runInContext('route(null)',context);
assert(nodes.get("content").innerHTML.includes("Complete table")===false,"Unexpected legacy content");
assert(nodes.get("content").innerHTML.includes("All chapters"),"Textbook home missing chapter directory");
assert(nodes.get("content").innerHTML.includes("Upper-level study"),"Advanced module directory missing");
vm.runInContext('route("28-carrier-transport")',context);
assert(nodes.get("content").innerHTML.includes("Show a hint"),"Graded practice hints not rendered");
assert(nodes.get("content").innerHTML.includes("Continuity")||nodes.get("content").innerHTML.includes("continuity"),"Advanced lesson material missing");
nodes.get("search").oninput({target:{value:"TCAD"}});
assert(nodes.get("toc").innerHTML.includes("TCAD"),"Search failed");
assert(!nodes.get("toc").innerHTML.includes("The MOS capacitor"),"Search did not filter unrelated chapters");
console.log("Reader UI tests PASS: deep link, worked solutions, diagrams, labs, completion, home and search");
