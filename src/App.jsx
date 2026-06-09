import { useState, useRef, useEffect } from "react";

// ── LazerMaze — BRIGHT version ──
const BG    = "#0a0e07";
const PANEL = "#141a0e";
const C2    = "#2a3d1a";
const C3    = "#4a7a28";
const C4    = "#7ec832";   // bright lime — primary
const C5    = "#c8f000";   // neon yellow-green — pop
const TXT   = "#e8f5c0";
const MUTED = "#7aaa48";
const pf = { fontFamily: "'Press Start 2P', monospace" };

function useInView(ref) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return v;
}

function FadeIn({ children, delay = 0, dir = "up" }) {
  const ref = useRef(); const v = useInView(ref);
  const tf = v ? "none" : dir === "left" ? "translateX(-30px)" : dir === "right" ? "translateX(30px)" : "translateY(30px)";
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: tf, transition: `opacity .7s ${delay}s, transform .7s ${delay}s` }}>{children}</div>;
}

function Typewriter({ text }) {
  const [out, setOut] = useState(""); const [i, setI] = useState(0);
  useEffect(() => {
    if (i < text.length) { const t = setTimeout(() => { setOut(p => p + text[i]); setI(n => n + 1); }, 80); return () => clearTimeout(t); }
  }, [i, text]);
  return <span>{out}<span style={{ animation: "blink 1s step-end infinite", color: C5 }}>█</span></span>;
}

function PixelBg() {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    c.width = window.innerWidth; c.height = document.documentElement.scrollHeight;
    const sz = 8;
    for (let y = 0; y < c.height; y += sz)
      for (let x = 0; x < c.width; x += sz) {
        const r = Math.random();
        ctx.fillStyle = r > 0.985 ? C5 + "55"
          : r > 0.97 ? C4 + "44"
          : r > 0.94 ? C3 + "33"
          : r > 0.5 ? "#111608"
          : BG;
        ctx.fillRect(x, y, sz, sz);
      }
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, pointerEvents: "none" }} />;
}

function STitle({ children, color = C4 }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 48 }}>
      <h2 style={{ ...pf, fontSize: "clamp(11px,2vw,16px)", color, textShadow: `0 0 20px ${color}` , letterSpacing: 3 }}>{children}</h2>
      <div style={{ width: 80, height: 3, background: color, margin: "10px auto 0", boxShadow: `0 0 12px ${color}` }} />
    </div>
  );
}

function Bar({ name, pct, color, delay }) {
  const ref = useRef(); const v = useInView(ref);
  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ ...pf, fontSize: 6, color: TXT }}>{name}</span>
        <span style={{ ...pf, fontSize: 6, color }}>{pct}%</span>
      </div>
      <div style={{ background: C2, border: `1px solid ${color}66`, height: 12, position: "relative", overflow: "hidden" }}>
        <div style={{ height: "100%", width: v ? `${pct}%` : "0%", background: color, boxShadow: `0 0 8px ${color}`, transition: `width 1.2s ${delay}s ease-out` }} />
      </div>
    </div>
  );
}

function ContactModal({ type, onClose }) {
  const [copied, setCopied] = useState(false);
  const val = type === "email" ? "mustafa.ch.mudasser@gmail.com" : "+44 7770 200851";
  const copy = () => { navigator.clipboard.writeText(val); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "#000d", zIndex: 20000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: PANEL, border: `2px solid ${C5}`, boxShadow: `0 0 32px ${C5}88`, padding: 28, minWidth: 320, textAlign: "center" }}>
        <p style={{ ...pf, fontSize: 7, color: MUTED, marginBottom: 12 }}>{type === "email" ? "EMAIL" : "PHONE"}</p>
        <div style={{ background: BG, border: `1px solid ${C4}66`, padding: "10px 14px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <span style={{ ...pf, fontSize: type === "email" ? 6 : 8, color: C5 }}>{val}</span>
          <button onClick={copy} style={{ ...pf, fontSize: 6, background: copied ? C3 : PANEL, border: `1px solid ${C4}`, color: C4, cursor: "pointer", padding: "5px 9px" }}>
            {copied ? "COPIED!" : "COPY"}
          </button>
        </div>
        {type === "email" && (
          <a href="https://mail.google.com/mail/?view=cm&to=mustafa.ch.mudasser@gmail.com" target="_blank" rel="noreferrer"
            style={{ ...pf, fontSize: 7, color: BG, background: C5, padding: "10px 20px", textDecoration: "none", display: "block", marginBottom: 10, boxShadow: `0 0 12px ${C5}` }}>
            OPEN IN GMAIL ↗
          </a>
        )}
        {type === "phone" && (
          <a href="tel:+447770200851"
            style={{ ...pf, fontSize: 7, color: BG, background: C5, padding: "10px 20px", textDecoration: "none", display: "block", marginBottom: 10, boxShadow: `0 0 12px ${C5}` }}>
            CALL NOW ↗
          </a>
        )}
        <button onClick={onClose} style={{ ...pf, fontSize: 6, background: "none", border: `1px solid ${C3}`, color: C3, cursor: "pointer", padding: "6px 14px" }}>CLOSE</button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
//  PAC-MAN  — fixed: autofocus, no respawn,
//  proper ghost wall-aware movement
// ────────────────────────────────────────────
const PAC_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:#0a0e07;height:100%}
body{display:flex;flex-direction:column;align-items:center;padding:6px;font-family:'Courier New',monospace;color:#c8f000;outline:none}
#hud{display:flex;justify-content:space-between;width:420px;font-size:11px;padding:3px 0 5px}
#board{display:grid;grid-template-columns:repeat(21,20px);grid-template-rows:repeat(21,20px);width:420px;height:420px;position:relative;border:2px solid #4a7a28}
.cell{width:20px;height:20px;background:#0a0e07;position:relative}
.wall{background:#1a2e10;border:1px solid #2a4a18;box-shadow:inset 0 0 4px #4a7a2844}
.dot::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:5px;height:5px;border-radius:50%;background:#c8f000;box-shadow:0 0 5px #c8f000}
.power::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:11px;height:11px;border-radius:50%;background:#7ec832;box-shadow:0 0 10px #7ec832;animation:pu .5s infinite alternate}
@keyframes pu{from{opacity:1;transform:translate(-50%,-50%) scale(1)}to{opacity:.3;transform:translate(-50%,-50%) scale(.7)}}
.pac::after,.pac-r::after,.pac-l::after,.pac-u::after,.pac-d::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#c8f000;box-shadow:0 0 8px #c8f000aa}
.pac-r::after{clip-path:polygon(50% 50%,100% 20%,100% 0,0 0,0 100%,100% 100%,100% 80%)}
.pac-l::after{clip-path:polygon(50% 50%,0 20%,0 0,100% 0,100% 100%,0 100%,0 80%)}
.pac-u::after{clip-path:polygon(50% 50%,20% 0,0 0,0 100%,100% 100%,100% 0,80% 0)}
.pac-d::after{clip-path:polygon(50% 50%,20% 100%,0 100%,0 0,100% 0,100% 100%,80% 100%)}
.ghost{position:absolute;top:1px;left:1px;width:18px;height:18px;border-radius:9px 9px 0 0;box-shadow:0 0 8px currentColor}
.ghost::after{content:'';position:absolute;bottom:-5px;left:0;width:100%;height:6px;background:inherit;clip-path:polygon(0 0,17% 100%,33% 0,50% 100%,67% 0,83% 100%,100% 0)}
.sc{background:#2a3d1a!important;box-shadow:none!important}.sc::after{background:#2a3d1a!important}
#ov{position:absolute;top:0;left:0;width:420px;height:420px;background:#0a0e07cc;display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px}
#ov h2{color:#7ec832;font-size:20px;font-family:inherit;text-shadow:0 0 14px #7ec832}
#ov p{color:#c8f000;font-size:12px}
#ov button{background:#141a0e;border:2px solid #7ec832;color:#7ec832;padding:10px 20px;cursor:pointer;font-size:11px;font-family:inherit}
.dp{display:grid;grid-template-areas:'. u .' 'l d r';grid-template-columns:repeat(3,46px);gap:4px;justify-content:center;margin-top:8px}
.dp button{background:#141a0e;border:2px solid #4a7a28;color:#7ec832;cursor:pointer;font-size:16px;padding:8px;line-height:1;transition:background .1s}
.dp button:active{background:#2a3d1a}
</style></head><body tabindex="0" id="root">
<div id="hud"><span>SCORE: <b id="sc">0</b></span><span>LIVES: <b id="lv">♥♥♥</b></span></div>
<div style="position:relative;width:420px"><div id="board"></div>
<div id="ov"><h2 id="ot"></h2><p id="op"></p><button onclick="init()">▶ PLAY AGAIN</button></div></div>
<div class="dp">
<div></div><button style="grid-area:u" onmousedown="nd=-21">▲</button><div></div>
<button style="grid-area:l" onmousedown="nd=-1">◀</button>
<button style="grid-area:d" onmousedown="nd=21">▼</button>
<button style="grid-area:r" onmousedown="nd=1">▶</button>
</div>
<script>
const W=21,P0=219;
const MAP=[
1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1,
1,2,1,1,2,1,1,1,2,2,1,2,2,1,1,1,2,1,1,2,1,
1,3,1,1,2,1,1,1,2,2,1,2,2,1,1,1,2,1,1,3,1,
1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
1,2,1,1,2,1,2,1,1,1,1,1,1,1,2,1,2,1,1,2,1,
1,2,2,2,2,1,2,2,2,1,1,1,2,2,2,1,2,2,2,2,1,
1,1,1,1,2,1,1,4,4,4,4,4,4,4,1,1,2,1,1,1,1,
1,1,1,1,2,1,4,4,4,4,4,4,4,4,4,1,2,1,1,1,1,
1,1,1,1,2,1,4,1,1,4,4,4,1,1,4,1,2,1,1,1,1,
0,0,0,0,2,0,4,1,4,4,4,4,4,1,4,0,2,0,0,0,0,
1,1,1,1,2,1,4,1,1,1,1,1,1,1,4,1,2,1,1,1,1,
1,1,1,1,2,1,4,4,4,4,4,4,4,4,4,1,2,1,1,1,1,
1,1,1,1,2,1,4,1,1,1,1,1,1,1,4,1,2,1,1,1,1,
1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1,
1,2,1,1,2,1,1,1,2,2,1,2,2,1,1,1,2,1,1,2,1,
1,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,1,
1,1,2,1,2,1,2,1,1,1,1,1,1,1,2,1,2,1,2,1,1,
1,2,2,2,2,1,2,2,2,1,1,1,2,2,2,1,2,2,2,2,1,
1,2,1,1,1,1,1,1,2,2,1,2,2,1,1,1,1,1,1,2,1,
1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
];
const ORIG_MAP=[...MAP];
const GC=['#ff4466','#44ddff','#ff8800','#ff66cc'];
const GS=[{i:121,d:-W},{i:122,d:1},{i:142,d:-1},{i:143,d:W}];
let cells,score,lives,pac,pd,nd,ghosts,dots,powers,running,mt,gt;

function ok(f,d){
  const t=f+d;
  if(t<0||t>=MAP.length)return false;
  if(d===1&&f%W===W-1)return false;
  if(d===-1&&f%W===0)return false;
  return MAP[t]!==1;
}
function pcls(d){return d===1?'pac-r':d===-1?'pac-l':d===-W?'pac-u':d===W?'pac-d':'pac';}
function upd(id,v){document.getElementById(id).textContent=v;}

function col(){
  ghosts.forEach(g=>{
    if(g.i!==pac)return;
    if(g.scared){
      g.scared=false;g.el.classList.remove('sc');g.el.style.background=g.col;
      score+=200;upd('sc',score);
      cells[g.i].removeChild(g.el);
      const idx=ghosts.indexOf(g);g.i=GS[idx].i;g.d=GS[idx].d;
      cells[g.i].appendChild(g.el);
    } else {
      lives--;upd('lv','♥'.repeat(Math.max(0,lives)));
      if(lives<=0){end(false);return;}
      cells[pac].classList.remove('pac','pac-r','pac-l','pac-u','pac-d');
      pac=P0;pd=0;nd=0;cells[pac].classList.add('pac');
      ghosts.forEach((g2,i)=>{cells[g2.i].removeChild(g2.el);g2.i=GS[i].i;g2.d=GS[i].d;cells[g2.i].appendChild(g2.el);});
    }
  });
}

function end(win){
  running=false;clearInterval(mt);clearInterval(gt);
  document.getElementById('ot').textContent=win?'YOU WIN!':'GAME OVER';
  document.getElementById('op').textContent='Score: '+score;
  document.getElementById('ov').style.display='flex';
}

function init(){
  document.getElementById('board').innerHTML='';
  cells=[];score=0;lives=3;pac=P0;pd=0;nd=0;dots=0;powers=0;running=false;
  document.getElementById('ov').style.display='none';
  upd('sc',0);upd('lv','♥♥♥');

  for(let i=0;i<MAP.length;i++){
    MAP[i]=ORIG_MAP[i];
    const c=document.createElement('div');c.className='cell';
    if(MAP[i]===1)c.classList.add('wall');
    else if(MAP[i]===2){c.classList.add('dot');dots++;}
    else if(MAP[i]===3){c.classList.add('power');powers++;}
    document.getElementById('board').appendChild(c);
    cells.push(c);
  }

  ghosts=GS.map((s,idx)=>({i:s.i,d:s.d,col:GC[idx],scared:false,el:null}));
  ghosts.forEach(g=>{
    const el=document.createElement('div');el.className='ghost';
    el.style.background=g.col;cells[g.i].appendChild(el);g.el=el;
  });
  cells[pac].classList.add('pac');
  clearInterval(mt);clearInterval(gt);

  mt=setInterval(()=>{
    if(!running)return;
    if(nd&&ok(pac,nd)){pd=nd;nd=0;}
    if(!pd||!ok(pac,pd))return;
    cells[pac].classList.remove('pac','pac-r','pac-l','pac-u','pac-d');
    pac+=pd;
    const c=cells[pac];
    if(c.classList.contains('dot')){c.classList.remove('dot');MAP[pac]=0;score+=10;dots--;upd('sc',score);}
    else if(c.classList.contains('power')){
      c.classList.remove('power');MAP[pac]=0;score+=50;powers--;upd('sc',score);
      ghosts.forEach(g=>{g.scared=true;g.el.classList.add('sc');g.el.style.background='';});
      clearTimeout(window._st);
      window._st=setTimeout(()=>{ghosts.forEach(g=>{if(g.scared){g.scared=false;g.el.classList.remove('sc');g.el.style.background=g.col;}});},7000);
    }
    c.classList.add(pcls(pd));
    if(dots+powers===0)end(true);
    col();
  },150);

  gt=setInterval(()=>{
    if(!running)return;
    ghosts.forEach(g=>{
      cells[g.i].removeChild(g.el);
      const allDirs=[1,-1,W,-W];
      const fwd=allDirs.filter(d=>d!==-g.d&&ok(g.i,d));
      const any=allDirs.filter(d=>ok(g.i,d));
      const choices=fwd.length?fwd:any;
      if(choices.length)g.d=choices[Math.floor(Math.random()*choices.length)];
      if(ok(g.i,g.d))g.i+=g.d;
      cells[g.i].appendChild(g.el);
    });
    col();
  },200);

  running=true;
  document.getElementById('root').focus();
}

document.getElementById('root').addEventListener('keydown',e=>{
  const m={ArrowLeft:-1,ArrowRight:1,ArrowUp:-W,ArrowDown:W};
  if(m[e.key]!==undefined){e.preventDefault();nd=m[e.key];}
});
document.getElementById('root').addEventListener('click',()=>{
  document.getElementById('root').focus();
});

init();
</script></body></html>`;

// ── Data ──
const SKILLS = [
  { name:"Python",                                 pct:94, color:C5 },
  { name:"JavaScript / TypeScript",                pct:80, color:C4 },
  { name:"SQL",                                    pct:82, color:C3 },
  { name:"Ruby",                                   pct:65, color:C5 },
  { name:"Java",                                   pct:60, color:C4 },
  { name:"Bash / Shell",                           pct:68, color:C3 },
  { name:"HTML / CSS",                             pct:78, color:C5 },
  { name:"YAML / JSON",                            pct:85, color:C4 },
  { name:"C / C++",                                pct:55, color:C3 },
  { name:"Django / FastAPI / DRF",                 pct:90, color:C5 },
  { name:"AWS / Azure / Docker / K8s",             pct:72, color:C4 },
  { name:"PostgreSQL / Redis / Elasticsearch",     pct:78, color:C3 },
  { name:"Microservices & Event-Driven (SQS/SNS)", pct:70, color:C5 },
  { name:"AI & LLM Integration (OpenAI / RAG)",   pct:75, color:C4 },
  { name:"Explainable AI — SHAP / LIME / XAI",    pct:80, color:C3 },
  { name:"CI/CD — GitHub Actions / Terraform",    pct:68, color:C5 },
  { name:"TDD & pytest",                           pct:74, color:C4 },
  { name:"Pinecone / Vector Search",               pct:65, color:C3 },
  { name:"React / TypeScript",                     pct:78, color:C5 },
  { name:"REST & GraphQL APIs",                    pct:88, color:C4 },
];

const EXP = [
  { company:"JPMorganChase", role:"Python Software Engineer – Industry Programme", dates:"Jan 2026 – May 2026", color:C5,
    bullets:["Production-grade Python banking app built on-site with JP Morgan engineers over 10 weeks","Independently architected Night-Mode Savings, Round-Up Savings & Savings Goals features","Django REST backend · full delivery pipeline · Bournemouth on-site"] },
  { company:"Grand Digitals Pvt Ltd", role:"Python Full-Stack Engineer (Part-time)", dates:"Jan 2025 – Dec 2025", color:C4,
    bullets:["Python/Django & Ruby on Rails backends for B2B and education clients","React/TypeScript frontends · REST & GraphQL API integrations","Systems design, database architecture and third-party service integrations"] },
  { company:"Visnext Software Solutions", role:"Python Backend Engineer", dates:"Jan 2023 – Nov 2024", color:C3,
    bullets:["Architected Python/Django backend systems for B2B and education clients","REST API endpoints · third-party integrations · 2 yrs 5 months (remote)","Delivered scalable full-stack applications across multiple concurrent projects"] },
  { company:"Airlift Technologies", role:"Python Data Engineer (Part-time)", dates:"Jul 2021 – Jul 2022", color:C5,
    bullets:["Analysed large operational datasets using Python and SQL","Automated reporting pipelines · reduced manual reporting time by 40%","High-growth logistics platform · remote"] },
];

const PROJECTS = [
  { title:"NEURAL BANKING ENGINE", org:"JPMorganChase Industry Programme", color:C5,
    desc:"Production-grade Python banking platform. Django REST backend with Night-Mode Savings, Round-Up Savings and Savings Goals — independently designed and shipped on-site.",
    tags:["Python","Django","REST API","Banking"] },
  { title:"MULTI-HOP PATHFINDER", org:"Bournemouth University", color:C4,
    desc:"Complex algorithm design solving multi-hop routing optimisation across a 100-node smart bin Wireless Sensor Network. Awarded 90% grade.",
    tags:["Python","Graph Algorithms","WSN","Optimisation"] },
  { title:"XAI AUDIT ENGINE", org:"MSc Dissertation · Bournemouth", color:C3,
    desc:"Explainable AI pipeline using SHAP and LIME producing auditable, interpretable ML outputs for regulated sectors — aligned with EU AI Act governance principles.",
    tags:["XAI","SHAP","LIME","Python","ML"] },
  { title:"LIFT-OFF ANALYTICS", org:"British Airways · Forage", color:C5,
    desc:"Data Science simulation for British Airways. Applied PyTorch and cross-validation on real airline datasets to surface predictive operational insights.",
    tags:["PyTorch","Data Science","Cross-Val"] },
];

export default function Portfolio() {
  const [game, setGame] = useState(false);
  const [contact, setContact] = useState(null);
  const scroll = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: BG, color: TXT, minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:6px;background:${BG}}
        ::-webkit-scrollbar-thumb{background:${C4}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 12px ${C5}}50%{box-shadow:0 0 30px ${C5},0 0 55px ${C5}99}}
        @keyframes glitch{0%,100%{text-shadow:2px 0 ${C3},-2px 0 ${C2}}50%{text-shadow:-3px 0 ${C3},3px 0 ${C2}}}
        @keyframes ticker{0%{transform:translateX(100vw)}100%{transform:translateX(-120%)}}
      `}</style>

      <PixelBg />
      <div style={{ position:"fixed", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:9998,
        background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)" }} />

      {/* NAV */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, background:`${BG}f0`, backdropFilter:"blur(6px)", borderBottom:`2px solid ${C4}66`, padding:"10px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ ...pf, fontSize:9, color:C5, textShadow:`0 0 16px ${C5}` }}>MM.EXE</span>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
          {["about","skills","experience","projects","contact"].map(s => (
            <button key={s} onClick={() => scroll(s)} style={{ ...pf, fontSize:7, background:"none", border:"none", color:MUTED, cursor:"pointer" }}
              onMouseEnter={e => e.target.style.color = C5} onMouseLeave={e => e.target.style.color = MUTED}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>

      {/* TICKER */}
      <div style={{ position:"fixed", top:42, left:0, right:0, zIndex:999, background:C4, height:18, overflow:"hidden", display:"flex", alignItems:"center" }}>
        <span style={{ ...pf, fontSize:6, color:BG, whiteSpace:"nowrap", animation:"ticker 25s linear infinite", fontWeight:"bold" }}>
          ★ AVAILABLE FOR HIRE · PYTHON BACKEND · AI/ML ENGINEER · DJANGO · FASTAPI · REACT · BOURNEMOUTH UK ★ MUSTAFA MUDASSER ★
        </span>
      </div>

      {/* HERO */}
      <section id="hero" style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"140px 24px 60px", textAlign:"center", position:"relative", zIndex:1 }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C4}12 1px,transparent 1px),linear-gradient(90deg,${C4}12 1px,transparent 1px)`, backgroundSize:"32px 32px", pointerEvents:"none" }} />
        <FadeIn>
          <p style={{ ...pf, fontSize:8, color:C4, marginBottom:16, letterSpacing:5 }}>PLAYER ONE · READY</p>
          <h1 style={{ ...pf, fontSize:"clamp(22px,4.5vw,44px)", color:C5, textShadow:`0 0 30px ${C5}`, animation:"glitch 4s infinite", lineHeight:1.7, marginBottom:20 }}>
            MUSTAFA<br />MUDASSER
          </h1>
          <p style={{ ...pf, fontSize:"clamp(7px,1.4vw,10px)", color:C4, marginBottom:16, lineHeight:2.5 }}>
            <Typewriter text="PYTHON ENGINEER · FINTECH · AI/ML" />
          </p>
          <p style={{ ...pf, fontSize:7, color:MUTED, marginBottom:36, lineHeight:2 }}>MSc Data Science &amp; AI · Bournemouth University</p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <a href="https://www.linkedin.com/in/mustafa-mudasser/" target="_blank" rel="noreferrer"
              style={{ ...pf, fontSize:7, color:BG, background:C3, padding:"10px 18px", textDecoration:"none", boxShadow:`0 0 14px ${C3}` }}>LINKEDIN</a>
            <a href="https://github.com/MustafaMudasser99/" target="_blank" rel="noreferrer"
              style={{ ...pf, fontSize:7, color:BG, background:C4, padding:"10px 18px", textDecoration:"none", boxShadow:`0 0 14px ${C4}` }}>GITHUB</a>
            <button onClick={() => scroll("contact")}
              style={{ ...pf, fontSize:7, color:BG, background:C5, border:"none", padding:"10px 18px", cursor:"pointer", boxShadow:`0 0 14px ${C5}` }}>HIRE ME</button>
          </div>
        </FadeIn>
        <div style={{ position:"absolute", bottom:28, animation:"float 2s infinite" }}>
          <span style={{ ...pf, fontSize:8, color:C3 }}>▼ SCROLL ▼</span>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding:"80px 24px", maxWidth:960, margin:"0 auto", position:"relative", zIndex:1 }}>
        <STitle color={C4}>ABOUT.EXE</STitle>

        <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:28 }}>
          <FadeIn dir="left">
            <div style={{ border:`1px solid ${C4}55`, padding:28, background:PANEL }}>

              <p style={{ fontSize:13, color:TXT, lineHeight:2, marginBottom:16, fontFamily:"'Courier New',monospace" }}>
                Fintech and banking teams don't struggle to find Python developers.{" "}
                <span style={{ color:C5 }}>They struggle to find those who understand the domain.</span>
              </p>
              <p style={{ fontSize:12, color:TXT, lineHeight:2, marginBottom:16, fontFamily:"'Courier New',monospace" }}>
                I'm a Python Engineer with <span style={{ color:C4 }}>4+ years</span> building backend systems inside fintech and banking — mainly JP Morgan — where reliability isn't optional and clean code isn't a luxury.
              </p>
              <div style={{ borderLeft:`3px solid ${C4}`, paddingLeft:16, marginBottom:16 }}>
                {[
                  "Production-grade APIs with FastAPI & Django — built for real financial load, not demos",
                  "Backend systems designed for regulated environments: auditability, correctness, uptime",
                  "Measurable delivery: reduced latency, lower infrastructure cost, faster processing",
                  "Fits in quickly, causes no drama, and ships.",
                ].map((pt, i) => (
                  <p key={i} style={{ ...pf, fontSize:6, color:TXT, lineHeight:2.5, marginBottom:8 }}>
                    <span style={{ color:C5 }}>→ </span>{pt}
                  </p>
                ))}
              </div>
              <p style={{ fontSize:12, color:MUTED, lineHeight:2, fontFamily:"'Courier New',monospace" }}>
                UK-wide. Flexible on location and hybrid.{" "}
                <span style={{ color:C4 }}>I respond as fast as I code.</span>
              </p>
            </div>
          </FadeIn>
          <FadeIn dir="right" delay={0.2}>
            <div style={{ border:`1px solid ${C4}55`, padding:24, background:PANEL }}>
              <p style={{ ...pf, fontSize:8, color:C5, marginBottom:18, textShadow:`0 0 10px ${C5}` }}>PLAYER STATS</p>
              {[
                ["EXP",      "4+ YRS"],
                ["DOMAIN",   "FINTECH / BANKING"],
                ["LOCATION", "BOURNEMOUTH, UK"],
                ["STATUS",   "OPEN TO WORK"],
                ["MSc",      "DATA SCI & AI"],
                ["STACK",    "PYTHON · DJANGO · FASTAPI"],
                ["LANGUAGES","EN / URDU"],
              ].map(([k, v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:12, borderBottom:`1px solid ${C2}`, paddingBottom:8 }}>
                  <span style={{ ...pf, fontSize:6, color:MUTED }}>{k}</span>
                  <span style={{ ...pf, fontSize:6, color:C5, textAlign:"right" }}>{v}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ padding:"80px 24px", maxWidth:960, margin:"0 auto", position:"relative", zIndex:1 }}>
        <STitle color={C5}>SKILLS.DAT</STitle>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 56px" }}>
          {SKILLS.map((s, i) => <Bar key={i} {...s} delay={i * 0.04} />)}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" style={{ padding:"80px 24px", maxWidth:900, margin:"0 auto", position:"relative", zIndex:1 }}>
        <STitle color={C4}>XP.LOG</STitle>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:14, top:0, bottom:0, width:2, background:`linear-gradient(${C5},${C4},${C3})`, boxShadow:`0 0 8px ${C4}` }} />
          {EXP.map((ex, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div style={{ marginLeft:44, marginBottom:36, position:"relative" }}>
                <div style={{ position:"absolute", left:-38, top:8, width:16, height:16, background:ex.color, boxShadow:`0 0 14px ${ex.color}` }} />
                <div style={{ border:`1px solid ${ex.color}66`, padding:20, background:PANEL }}>
                  <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:6, marginBottom:8 }}>
                    <span style={{ ...pf, fontSize:9, color:ex.color, textShadow:`0 0 10px ${ex.color}` }}>{ex.company}</span>
                    <span style={{ ...pf, fontSize:6.5, color:MUTED }}>{ex.dates}</span>
                  </div>
                  <p style={{ ...pf, fontSize:7, color:C5, marginBottom:12 }}>{ex.role}</p>
                  {ex.bullets.map((b, j) => <p key={j} style={{ ...pf, fontSize:6.5, color:TXT, lineHeight:2.2, marginBottom:4 }}>▸ {b}</p>)}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding:"80px 24px", maxWidth:960, margin:"0 auto", position:"relative", zIndex:1 }}>
        <STitle color={C3}>PROJECTS.ROM</STitle>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:24 }}>
          {PROJECTS.map((p, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <div style={{ border:`2px solid ${p.color}55`, background:PANEL, padding:24, display:"flex", flexDirection:"column", minHeight:240, transition:"border-color .3s,transform .3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=p.color; e.currentTarget.style.transform="translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=`${p.color}55`; e.currentTarget.style.transform="none"; }}>
                <div style={{ ...pf, fontSize:6, color:p.color, marginBottom:8, opacity:.9 }}>{p.org}</div>
                <h3 style={{ ...pf, fontSize:8, color:TXT, marginBottom:12, lineHeight:1.8 }}>{p.title}</h3>
                <p style={{ fontSize:11, color:MUTED, lineHeight:1.8, marginBottom:14, flex:1, fontFamily:"'Courier New',monospace" }}>{p.desc}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:"auto" }}>
                  {p.tags.map(t => <span key={t} style={{ ...pf, fontSize:6, color:p.color, border:`1px solid ${p.color}`, padding:"3px 7px" }}>{t}</span>)}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" style={{ padding:"80px 24px", maxWidth:900, margin:"0 auto", position:"relative", zIndex:1 }}>
        <STitle color={C4}>EDU.SAVE</STitle>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
          {[
            { school:"Bournemouth University", degree:"MSc Data Science & AI", dates:"Jan 2025 – Jun 2026", color:C4, detail:"AI · Explainable AI · NLP · Blockchain & Digital Futures" },
            { school:"Univ. of Central Punjab", degree:"BSc Computer Science", dates:"2018 – 2022", color:C3, detail:"CGPA 3.41 · Systems Design · Software Engineering" },
          ].map((e, i) => (
            <FadeIn key={i} delay={i * 0.2}>
              <div style={{ border:`2px solid ${e.color}66`, padding:24, background:PANEL, textAlign:"center" }}>
                <div style={{ fontSize:28, marginBottom:12 }}>🎓</div>
                <p style={{ ...pf, fontSize:8, color:e.color, marginBottom:8, textShadow:`0 0 10px ${e.color}` }}>{e.school}</p>
                <p style={{ ...pf, fontSize:7, color:C5, marginBottom:8 }}>{e.degree}</p>
                <p style={{ ...pf, fontSize:6, color:MUTED, marginBottom:12 }}>{e.dates}</p>
                <p style={{ ...pf, fontSize:6, color:TXT, lineHeight:2.2 }}>{e.detail}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding:"80px 24px 140px", maxWidth:560, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
        <STitle color={C5}>CONTACT.INI</STitle>
        <FadeIn>
          <div style={{ border:`1px solid ${C5}55`, padding:32, background:PANEL }}>
            <p style={{ ...pf, fontSize:7, color:MUTED, lineHeight:2.8, marginBottom:28 }}>
              OPEN TO ROLES IN THE UK<br />
              <span style={{ color:C4 }}>PYTHON · AI/ML · BACKEND · FULLSTACK</span>
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <button onClick={() => setContact("email")} style={{ ...pf, fontSize:8, color:BG, background:C5, border:"none", padding:"13px 24px", cursor:"pointer", boxShadow:`0 0 16px ${C5}` }}>EMAIL ME</button>
              <button onClick={() => setContact("phone")} style={{ ...pf, fontSize:8, color:BG, background:C4, border:"none", padding:"13px 24px", cursor:"pointer", boxShadow:`0 0 16px ${C4}` }}>CALL / TEXT</button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <div style={{ textAlign:"center", padding:"16px 0", borderTop:`1px solid ${C2}`, position:"relative", zIndex:1 }}>
        <p style={{ ...pf, fontSize:6, color:C3 }}>© 2026 MUSTAFA MUDASSER · INSERT COIN TO CONTINUE</p>
      </div>

      {/* FLOATING PAC-MAN */}
      <button onClick={() => setGame(true)} title="Play Pac-Man!"
        style={{ position:"fixed", bottom:24, right:24, zIndex:5000, width:64, height:64, borderRadius:"50%", background:PANEL, border:`3px solid ${C5}`, cursor:"pointer", fontSize:26, animation:"float 2.5s infinite,pulse 2.5s infinite", display:"flex", alignItems:"center", justifyContent:"center", outline:"none" }}>
        🕹️
      </button>

      {/* PAC-MAN MODAL */}
      {game && (
        <div onClick={e => e.target === e.currentTarget && setGame(false)}
          style={{ position:"fixed", inset:0, background:"#000d", zIndex:10000, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:BG, border:`3px solid ${C4}`, boxShadow:`0 0 40px ${C4}99`, padding:16, display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ ...pf, color:C5, fontSize:9, textShadow:`0 0 10px ${C5}` }}>👾 PAC-MAN</span>
              <button onClick={() => setGame(false)} style={{ ...pf, background:"none", border:`1px solid ${C3}`, color:C3, cursor:"pointer", padding:"4px 10px", fontSize:7 }}>✕ CLOSE</button>
            </div>
            <iframe srcDoc={PAC_HTML} width="444" height="590" style={{ border:"none", display:"block" }} title="Pac-Man" sandbox="allow-scripts" />
            <p style={{ ...pf, fontSize:6, color:MUTED, textAlign:"center" }}>ARROW KEYS OR BUTTONS · CLICK BOARD FIRST · CLICK OUTSIDE TO CLOSE</p>
          </div>
        </div>
      )}

      {contact && <ContactModal type={contact} onClose={() => setContact(null)} />}
    </div>
  );
}
