(() => {
"use strict";
const $ = (id) => document.getElementById(id);
const panels = {orbital: $("orbitalPanel"), memory: $("memoryPanel")};
function openGame(which) {
  for (const [name, panel] of Object.entries(panels)) panel.classList.toggle("active", name === which);
  $("games").scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto":"smooth", block:"start"});
  if (which === "orbital") drawOrbit();
}
document.querySelectorAll("[data-open]").forEach(btn => btn.addEventListener("click", () => openGame(btn.dataset.open)));
$("backToGames").addEventListener("click", () => {
  Object.values(panels).forEach(panel => panel.classList.remove("active"));
  $("games").scrollIntoView({behavior:"smooth",block:"start"});
});

/* Game 1: Orbital Drift */
const canvas = $("orbitCanvas"), ctx = canvas.getContext("2d");
let orbit = {running:false, over:false, score:0, energy:0, hull:3, shipX:450, asteroids:[], orbs:[], keys:new Set(), last:0, spawn:0, orbSpawn:0, raf:0};
const getBest = () => Number(localStorage.getItem("sujay-orbital-best") || 0);
$("orbitBest").textContent = getBest();
function resetOrbit() {
  cancelAnimationFrame(orbit.raf);
  orbit = {...orbit, running:true, over:false, score:0,energy:0,hull:3,shipX:canvas.width/2,asteroids:[],orbs:[],last:0,spawn:0,orbSpawn:0};
  $("orbitScore").textContent="0"; $("orbitEnergy").textContent="0"; $("orbitHull").textContent="♥ ♥ ♥";
  $("orbitStatus").textContent="Orbit established. Stay sharp.";
  orbit.raf=requestAnimationFrame(tickOrbit);
}
function drawOrbit() {
  const w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);
  const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"#071328");g.addColorStop(1,"#160f32");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  // starfield and faint orbital guides
  for(let i=0;i<80;i++){const x=(i*137+17)%w,y=(i*71+25)%h;ctx.fillStyle=i%5===0?"#69e9ff":"rgba(214,235,255,.48)";ctx.fillRect(x,y,i%5===0?2:1,i%5===0?2:1);}
  ctx.strokeStyle="rgba(70,202,255,.10)";ctx.lineWidth=1;
  for(let x=60;x<w;x+=90){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  ctx.beginPath();ctx.ellipse(w*.54,h*.44,w*.35,h*.19,-.16,0,Math.PI*2);ctx.stroke();
  for(const a of orbit.asteroids) drawRock(a);
  for(const o of orbit.orbs){ctx.beginPath();ctx.arc(o.x,o.y,o.r,0,Math.PI*2);ctx.fillStyle="#58f5ff";ctx.shadowColor="#58f5ff";ctx.shadowBlur=18;ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle="#e4fcff";ctx.stroke();}
  drawShip(orbit.shipX,h-62);
  if(!orbit.running){ctx.fillStyle="rgba(3,7,18,.40)";ctx.fillRect(0,0,w,h);ctx.textAlign="center";ctx.font="bold 28px system-ui";ctx.fillStyle="#eafaff";ctx.fillText(orbit.over?"SIGNAL LOST":"ORBITAL DRIFT",w/2,h/2-10);ctx.font="15px system-ui";ctx.fillStyle="#7deaff";ctx.fillText(orbit.over?"Press Start / Restart to try again":"Press Start / Restart to launch",w/2,h/2+22);}
}
function drawRock(a){ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.rot);ctx.beginPath();for(let i=0;i<7;i++){const ang=i*Math.PI*2/7;const rad=a.r*(.78+((i*17)%5)/14);const x=Math.cos(ang)*rad,y=Math.sin(ang)*rad;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.fillStyle="#35255d";ctx.strokeStyle="#bd89ff";ctx.lineWidth=2;ctx.shadowColor="#9d6cff";ctx.shadowBlur=7;ctx.fill();ctx.stroke();ctx.restore();}
function drawShip(x,y){ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.moveTo(0,-22);ctx.lineTo(18,17);ctx.lineTo(0,10);ctx.lineTo(-18,17);ctx.closePath();ctx.fillStyle="#dffcff";ctx.strokeStyle="#49eaff";ctx.lineWidth=2;ctx.shadowColor="#42dfff";ctx.shadowBlur=14;ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.beginPath();ctx.moveTo(-6,19);ctx.lineTo(0,28+Math.random()*5);ctx.lineTo(6,19);ctx.fillStyle="#9c6cff";ctx.fill();ctx.restore();}
function updateHud(){ $("orbitScore").textContent=Math.floor(orbit.score);$("orbitEnergy").textContent=orbit.energy;$("orbitHull").textContent="♥ ".repeat(Math.max(0,orbit.hull)).trim()||"—"; }
function tickOrbit(time){
  if(!orbit.running)return;
  if(!orbit.last)orbit.last=time;const dt=Math.min((time-orbit.last)/16.67,2);orbit.last=time;
  const w=canvas.width,h=canvas.height;orbit.score+=dt*.38;
  const speed=5.5*dt;
  if(orbit.keys.has("ArrowLeft")||orbit.keys.has("a"))orbit.shipX-=speed*2.1;
  if(orbit.keys.has("ArrowRight")||orbit.keys.has("d"))orbit.shipX+=speed*2.1;
  orbit.shipX=Math.max(22,Math.min(w-22,orbit.shipX));
  orbit.spawn+=dt;orbit.orbSpawn+=dt;
  if(orbit.spawn>Math.max(13,34-orbit.score/40)){orbit.spawn=0;orbit.asteroids.push({x:20+Math.random()*(w-40),y:-25,r:10+Math.random()*14,vy:(2.1+Math.random()*2.2+orbit.score/500)*dt,rot:Math.random()*4,vr:(Math.random()-.5)*.1});}
  if(orbit.orbSpawn>75){orbit.orbSpawn=0;orbit.orbs.push({x:25+Math.random()*(w-50),y:-10,r:7,vy:2.6*dt});}
  for(const a of orbit.asteroids){a.y+=a.vy;a.rot+=a.vr;a.vy=(2.1+Math.min(3,orbit.score/300))*dt;}
  for(const o of orbit.orbs)o.y+=o.vy;
  const sy=h-62;
  for(const a of orbit.asteroids){if(!a.hit&&Math.hypot(a.x-orbit.shipX,a.y-sy)<a.r+15){a.hit=true;orbit.hull--;if(orbit.hull<=0){orbit.running=false;orbit.over=true;$("orbitStatus").textContent=`Hull breached. Final score: ${Math.floor(orbit.score)}.`;if(Math.floor(orbit.score)>getBest()){localStorage.setItem("sujay-orbital-best",Math.floor(orbit.score));$("orbitBest").textContent=Math.floor(orbit.score);}break;}}}
  for(const o of orbit.orbs){if(!o.hit&&Math.hypot(o.x-orbit.shipX,o.y-sy)<o.r+19){o.hit=true;orbit.energy++;orbit.score+=25;}}
  orbit.asteroids=orbit.asteroids.filter(a=>a.y<h+40&&!a.hit);orbit.orbs=orbit.orbs.filter(o=>o.y<h+20&&!o.hit);
  updateHud();drawOrbit();if(orbit.running)orbit.raf=requestAnimationFrame(tickOrbit);
}
$("orbitStart").addEventListener("click",resetOrbit);
window.addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight"," "].includes(e.key))e.preventDefault();orbit.keys.add(e.key);});
window.addEventListener("keyup",e=>orbit.keys.delete(e.key));
window.addEventListener("blur",()=>orbit.keys.clear());
function holdButton(id,key){const b=$(id);const on=e=>{e.preventDefault();orbit.keys.add(key);};const off=e=>{e.preventDefault();orbit.keys.delete(key);};b.addEventListener("pointerdown",on);["pointerup","pointerleave","pointercancel"].forEach(type=>b.addEventListener(type,off));}
holdButton("orbitLeft","ArrowLeft");holdButton("orbitRight","ArrowRight");
canvas.addEventListener("pointermove",e=>{if(e.buttons){const r=canvas.getBoundingClientRect();orbit.shipX=(e.clientX-r.left)/r.width*canvas.width;}});
drawOrbit();

/* Game 2: Signal Memory */
const pads=[...document.querySelectorAll(".pad")];
let mem={sequence:[],input:0,level:0,accepting:false,playing:false,token:0};
const memBest=()=>Number(localStorage.getItem("sujay-memory-best")||0);
$("memBest").textContent=memBest();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function flashPad(n,duration=310){const p=pads[n];p.classList.add("lit");await sleep(duration);p.classList.remove("lit");await sleep(100);}
async function showSequence(token){mem.accepting=false;$("memStatus").textContent="Observe the signal…";await sleep(450);for(const n of mem.sequence){if(token!==mem.token)return;await flashPad(n,310);}if(token!==mem.token)return;mem.accepting=true;mem.input=0;$("memStatus").textContent="Your turn — repeat the sequence.";}
function startMemory(){mem.token++;const token=mem.token;mem.sequence=[];mem.level=0;mem.input=0;mem.playing=true;mem.accepting=false;$("memLevel").textContent="0";mem.sequence.push(Math.floor(Math.random()*4));showSequence(token);}
async function padPress(n){if(!mem.accepting||!mem.playing)return;mem.accepting=false;await flashPad(n,190);if(n!==mem.sequence[mem.input]){mem.playing=false;mem.token++;$("memStatus").textContent=`Signal mismatch. You reached level ${mem.level}. Start again to retry.`;return;}mem.input++;if(mem.input<mem.sequence.length){mem.accepting=true;$("memStatus").textContent="Signal confirmed. Continue.";return;}mem.level++;$("memLevel").textContent=mem.level;if(mem.level>memBest()){localStorage.setItem("sujay-memory-best",mem.level);$("memBest").textContent=mem.level;}const token=mem.token;mem.accepting=false;$("memStatus").textContent="Perfect match! Loading next signal…";await sleep(650);if(token!==mem.token||!mem.playing)return;mem.sequence.push(Math.floor(Math.random()*4));showSequence(token);}
pads.forEach((p,i)=>p.addEventListener("click",()=>padPress(i)));
$("memStart").addEventListener("click",startMemory);
})();