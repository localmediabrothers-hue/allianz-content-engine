import { useState, useEffect } from "react";

const G = {
  gold:"#FFB800", cyan:"#00C8FF", green:"#00FF88", coral:"#FF4466", purple:"#AA44FF",
  bg:"#0a0a09", card:"#181816", card2:"#222220", border:"#333331",
  muted:"#999997", text:"#ffffff", dim:"#444442",
};

/* ─── Brain logo ─────────────────────────────────────────────────────────── */
function Brain({ s = 26 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill={`${G.gold}18`} stroke={`${G.gold}40`} strokeWidth="1"/>
      <path d="M32 10C22 10 14 18 14 28c0 4 1.4 7.8 3.8 10.8V46h28.4v-7.2C48.6 35.8 50 32 50 28 50 18 42 10 32 10z" stroke={G.gold} strokeWidth="1.8" fill={`${G.gold}08`}/>
      <polygon points="32,12 34.2,16.5 32,21 29.8,16.5" fill={G.gold}/>
      <polygon points="16,27 18.8,30 16,33 13.2,30" fill={G.gold} opacity=".8"/>
      <polygon points="48,27 50.8,30 48,33 45.2,30" fill={G.gold} opacity=".8"/>
      <polygon points="23,38 25.5,41 23,44 20.5,41" fill={G.gold} opacity=".65"/>
      <polygon points="41,38 43.5,41 41,44 38.5,41" fill={G.gold} opacity=".65"/>
      <polygon points="32,27 34,30 32,33 30,30" fill="#fff" opacity=".95"/>
      <line x1="32" y1="21" x2="32" y2="27" stroke={G.gold} strokeWidth="1.2" opacity=".6"/>
      <line x1="18.8" y1="30" x2="30" y2="30" stroke={G.gold} strokeWidth="1.2" opacity=".5"/>
      <line x1="45.2" y1="30" x2="34" y2="30" stroke={G.gold} strokeWidth="1.2" opacity=".5"/>
      <line x1="25.5" y1="41" x2="30" y2="30" stroke={G.gold} strokeWidth="1.2" opacity=".5"/>
      <line x1="38.5" y1="41" x2="34" y2="30" stroke={G.gold} strokeWidth="1.2" opacity=".5"/>
      <line x1="29.8" y1="16.5" x2="18.8" y2="30" stroke={G.gold} strokeWidth=".8" opacity=".25"/>
      <line x1="34.2" y1="16.5" x2="45.2" y2="30" stroke={G.gold} strokeWidth=".8" opacity=".25"/>
    </svg>
  );
}

/* ─── Nav icons (Feather paths) ─────────────────────────────────────────── */
const PATHS = {
  home:    ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z","M9 22V12h6v10"],
  analyse: ["M13 2L3 14h9l-1 8L21 10h-9l1-8z"],
  channel: ["M18 20V10","M12 20V4","M6 20v-6"],
  intel:   ["M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"],
  comp:    ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2","M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8","M23 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75"],
  vault:   ["M12 2L2 7l10 5 10-5-10-5","M2 17l10 5 10-5","M2 12l10 5 10-5"],
  chat:    ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  plan:    ["M8 6h13","M8 12h13","M8 18h13","M3 6h.01","M3 12h.01","M3 18h.01"],
  rooms:   ["M3 21h18","M5 21V7l8-4v18","M19 21V11l-6-4","M9 9v.01","M9 12v.01","M9 15v.01","M9 18v.01"],
};
function NIcon({ n, sz = 17, col }) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {(PATHS[n] || PATHS.home).map((d, i) => <path key={i} d={d}/>)}
    </svg>
  );
}

/* ─── Sidebar ────────────────────────────────────────────────────────────── */
const NAV = [
  { id:"home",    label:"Dashboard",    n:"home",    c:G.gold   },
  { id:"analyse", label:"Analyse",      n:"analyse", c:G.cyan   },
  { id:"plan",    label:"Content Plan", n:"plan",    c:G.green  },
  { id:"rooms",   label:"Rooms",        n:"rooms",   c:G.cyan   },
  { id:"channel", label:"My Channel",   n:"channel", c:G.green  },
  { id:"intel",   label:"Intelligence", n:"intel",   c:G.gold   },
  { id:"comp",    label:"Competitors",  n:"comp",    c:G.coral  },
  { id:"vault",   label:"Script Vault", n:"vault",   c:G.purple },
  { id:"chat",    label:"Chat Reconexus",n:"chat",   c:G.gold   },
];

function Sidebar({ cur, go }) {
  return (
    <div style={{width:240,minHeight:"100vh",background:"#0f0f0d",borderRight:`1px solid ${G.border}`,display:"flex",flexDirection:"column",position:"fixed",left:0,top:0,zIndex:300}}>
      <div style={{padding:"24px 20px 20px",borderBottom:`1px solid ${G.border}`,textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
          <Brain s={56}/>
        </div>
        <div style={{fontSize:15,fontWeight:900,letterSpacing:"3px",color:G.gold}}>RECONEXUS</div>
        <div style={{fontSize:10,color:G.muted,letterSpacing:"1.5px",textTransform:"uppercase",marginTop:4}}>Content Intelligence Engine</div>
      </div>
      <nav style={{flex:1,padding:"14px 10px"}}>
        {NAV.map(item => {
          const on = cur === item.id;
          return (
            <button key={item.id} onClick={() => go(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:11,background:on?`${item.c}14`:"transparent",border:"none",borderLeft:`2px solid ${on?item.c:"transparent"}`,borderRadius:"0 10px 10px 0",padding:"10px 14px",cursor:"pointer",marginBottom:3,fontFamily:"inherit",transition:"all .15s"}}>
              <NIcon n={item.n} sz={16} col={on?item.c:G.muted}/>
              <span style={{fontSize:13,fontWeight:on?700:400,color:on?item.c:G.muted}}>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div style={{padding:"14px 20px",borderTop:`1px solid ${G.border}`}}>
        <div style={{fontSize:9,color:G.dim,letterSpacing:"1.5px",textTransform:"uppercase"}}>Built by Local Media Brothers</div>
      </div>
    </div>
  );
}

/* ─── Header ─────────────────────────────────────────────────────────────── */
function Header({ title, sub }) {
  return (
    <div style={{padding:"22px 32px 0",display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
      <div>
        <div style={{fontSize:22,fontWeight:800,color:G.text,letterSpacing:"-0.5px"}}>{title}</div>
        {sub && <div style={{fontSize:13,color:G.muted,marginTop:3}}>{sub}</div>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,background:G.card,border:`1px solid ${G.border}`,borderRadius:20,padding:"7px 14px"}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:G.green,animation:"pulse 2s infinite"}}/>
        <span style={{fontSize:11,color:G.muted,fontFamily:"'Nunito',sans-serif"}}>LIVE</span>
      </div>
    </div>
  );
}

/* ─── Stat card ──────────────────────────────────────────────────────────── */
function Stat({ label, val, sub, color, badge }) {
  return (
    <div style={{flex:1,minWidth:140,background:G.card,border:`1px solid ${G.border}`,borderRadius:16,padding:"20px 22px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:color,borderRadius:"16px 16px 0 0",opacity:.7}}/>
      <div style={{fontSize:11,color:G.muted,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:14}}>{label}</div>
      <div style={{fontFamily:"'Nunito',sans-serif",fontSize:36,fontWeight:900,color:G.text,lineHeight:1,marginBottom:10}}>{val}</div>
      {badge && <div style={{display:"inline-flex",alignItems:"center",gap:4,background:`${color}18`,border:`1px solid ${color}30`,borderRadius:20,padding:"3px 10px"}}>
        <span style={{color,fontSize:11,fontWeight:700}}>{badge}</span>
      </div>}
      {sub && !badge && <div style={{color:G.muted,fontSize:11}}>{sub}</div>}
    </div>
  );
}

/* ─── Card wrapper ───────────────────────────────────────────────────────── */
function Card({ children, style = {}, onClick }) {
  return <div onClick={onClick} style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:16,padding:"20px 22px",...style}}>{children}</div>;
}
function CLabel({ children, color }) {
  return <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"1.5px",color:color||G.muted,marginBottom:14}}>{children}</div>;
}

/* ─── Line chart (SVG) ───────────────────────────────────────────────────── */
function LineChart({ data, color = G.gold, h = 110 }) {
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => ({ x:(i / Math.max(data.length-1,1))*100, y:88-(v/max)*76 }));
  let line = `M ${pts[0].x} ${pts[0].y}`;
  for (let i=1;i<pts.length;i++) {
    const p=pts[i], q=pts[i-1], mx=(q.x+p.x)/2;
    line += ` C ${mx} ${q.y} ${mx} ${p.y} ${p.x} ${p.y}`;
  }
  const area = `${line} L ${pts[pts.length-1].x} 100 L 0 100 Z`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{width:"100%",height:h}}>
      <defs>
        <linearGradient id={`lg${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".28"/>
          <stop offset="100%" stopColor={color} stopOpacity=".02"/>
        </linearGradient>
      </defs>
      {[20,40,60,80].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke={G.border} strokeWidth=".4"/>)}
      <path d={area} fill={`url(#lg${color.slice(1)})`}/>
      <path d={line} fill="none" stroke={color} strokeWidth=".9"/>
      {pts.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="1.8" fill={color} opacity=".8"/>)}
    </svg>
  );
}

/* ─── Donut chart (SVG) ──────────────────────────────────────────────────── */
function Donut({ segs, size = 140, val, lbl }) {
  const r = 40, circ = 2*Math.PI*r;
  const tot = segs.reduce((s,x)=>s+x.v,0)||1;
  let off = circ * 0.25;
  return (
    <div style={{position:"relative",width:size,height:size,margin:"0 auto"}}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke={G.card2} strokeWidth="13"/>
        {segs.map((sg,i) => {
          const len=(sg.v/tot)*circ;
          const el=<circle key={i} cx="50" cy="50" r={r} fill="none" stroke={sg.c} strokeWidth="13" strokeDasharray={`${len} ${circ-len}`} strokeDashoffset={-off+circ*0.25} strokeLinecap="butt"/>;
          off+=len; return el;
        })}
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:22,fontWeight:900,color:G.text}}>{val}</div>
        <div style={{fontSize:9,color:G.muted,textTransform:"uppercase",letterSpacing:1,marginTop:2}}>{lbl}</div>
      </div>
    </div>
  );
}

/* ─── Score bar ──────────────────────────────────────────────────────────── */
function Bar({ label, score, color }) {
  return (
    <div style={{marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{color:G.muted,fontSize:12}}>{label}</span>
        <span style={{color,fontSize:12,fontWeight:700,fontFamily:"'Nunito',sans-serif"}}>{score}/10</span>
      </div>
      <div style={{background:G.card2,borderRadius:4,height:5,overflow:"hidden"}}>
        <div style={{width:`${score*10}%`,height:"100%",background:color,borderRadius:4,opacity:.85}}/>
      </div>
    </div>
  );
}

/* ─── MISSION BRIEF ──────────────────────────────────────────────────────── */
function MissionBrief({ onGoToPlan }) {
  const [brief, setBrief] = useState(null);

  useEffect(() => {
    fetch('/api/get-dashboard-brief').then(r => r.json()).then(d => setBrief(d)).catch(() => {});
  }, []);

  if (!brief) return null;

  const { nextTrip, nextTripScriptCount, lastTrip, lastTripScripts, recentAnalyses, unusedScripts } = brief;

  const daysUntil = nextTrip
    ? Math.ceil((new Date(nextTrip.trip_date) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const scriptsNeeded = nextTrip ? Math.max(0, (nextTrip.scripts_target || 4) - nextTripScriptCount) : null;

  const lastTripDate = lastTrip ? new Date(lastTrip.trip_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) : null;
  const competitorNames = [...new Set(
    recentAnalyses.filter(a => a.competitors?.handle).map(a => a.competitors.handle)
  )].slice(0, 3);

  return (
    <div style={{background:`linear-gradient(135deg,${G.gold}0a,${G.cyan}08)`,border:`1px solid ${G.gold}30`,borderRadius:18,padding:'22px 26px',marginBottom:20,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${G.gold},${G.cyan})`,opacity:.6}}/>
      <div style={{fontSize:10,color:G.gold,fontWeight:700,textTransform:'uppercase',letterSpacing:'2px',marginBottom:12}}>Mission Brief — {new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</div>

      {nextTrip ? (
        <div style={{marginBottom: lastTrip ? 16 : 0}}>
          <div style={{fontSize:15,color:G.text,lineHeight:1.7,marginBottom:10}}>
            <span style={{color:G.gold,fontWeight:800}}>Hey LMB Boss</span> — your next Coventry trip is{' '}
            <span style={{color:G.cyan,fontWeight:700}}>{new Date(nextTrip.trip_date).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</span>
            {daysUntil === 0 ? ' — that\'s today.' : daysUntil === 1 ? ', tomorrow.' : `, ${daysUntil} days away.`}
          </div>
          {scriptsNeeded > 0 ? (
            <div style={{fontSize:14,color:'#bbb',lineHeight:1.7}}>
              You have <span style={{color:G.green,fontWeight:700}}>{nextTripScriptCount}</span> of{' '}
              <span style={{fontWeight:700}}>{nextTrip.scripts_target}</span> scripts selected.{' '}
              <span style={{color:G.coral,fontWeight:700}}>You need {scriptsNeeded} more before you go.</span>
              {unusedScripts > 0 && <> You have <span style={{color:G.purple,fontWeight:700}}>{unusedScripts} unused scripts</span> in your vault ready to pick.</>}
            </div>
          ) : (
            <div style={{fontSize:14,color:G.green,fontWeight:700}}>All {nextTrip.scripts_target} scripts selected — you're ready to film.</div>
          )}
          <button onClick={onGoToPlan} style={{marginTop:12,background:`${G.gold}18`,border:`1px solid ${G.gold}40`,borderRadius:8,padding:'7px 16px',color:G.gold,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
            Open Content Plan →
          </button>
        </div>
      ) : (
        <div style={{fontSize:15,color:'#bbb',lineHeight:1.7,marginBottom:lastTrip ? 16 : 0}}>
          <span style={{color:G.gold,fontWeight:800}}>Hey LMB Boss</span> — no filming trip scheduled yet.{' '}
          <button onClick={onGoToPlan} style={{background:'none',border:'none',color:G.cyan,fontWeight:700,cursor:'pointer',fontSize:15,fontFamily:'inherit',padding:0,textDecoration:'underline'}}>
            Set your next Coventry trip →
          </button>
        </div>
      )}

      {lastTrip && (
        <div style={{borderTop:`1px solid ${G.border}`,paddingTop:14}}>
          <div style={{fontSize:12,color:G.muted,lineHeight:1.7}}>
            <span style={{color:G.dim,fontWeight:700,textTransform:'uppercase',letterSpacing:1,fontSize:10}}>Last trip</span>{' '}
            {lastTripDate} — {lastTripScripts.length > 0
              ? `${lastTripScripts.length} scripts filmed${competitorNames.length ? ` · inspired by ${competitorNames.join(', ')}` : ''}`
              : 'no scripts were assigned'
            }
            {lastTrip.properties?.length > 0 && (
              <span> · filmed at {lastTrip.location || 'Coventry'}</span>
            )}
          </div>
        </div>
      )}

      {!nextTrip && !lastTrip && recentAnalyses.length > 0 && (
        <div style={{borderTop:`1px solid ${G.border}`,paddingTop:12,marginTop:4}}>
          <div style={{fontSize:12,color:G.muted}}>
            This week: <span style={{color:G.cyan,fontWeight:700}}>{recentAnalyses.length} videos analysed</span>
            {competitorNames.length > 0 && <> from {competitorNames.join(', ')}</>} — scripts are sitting in your vault waiting.
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── DASHBOARD HOME ─────────────────────────────────────────────────────── */
const WDAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function Home({ onGoToPlan }) {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(true);
  useEffect(() => {
    fetch("/api/get-analyses?limit=20").then(r=>r.json())
      .then(d=>{setRows(d.analyses||[]);setBusy(false);}).catch(()=>setBusy(false));
  },[]);

  const scripts = rows.reduce((s,a)=>s+(a.analysis?.scripts?.length||0),0);
  const avg = rows.length ? +(rows.reduce((s,a)=>s+(a.analysis?.viralScore||0),0)/rows.length).toFixed(1) : 0;
  const tik = rows.filter(a=>a.platform==="tiktok").length;
  const ins = rows.filter(a=>a.platform==="instagram").length;

  const chart = WDAYS.map(()=>0);
  rows.slice(0,14).forEach(a=>{ const d=new Date(a.created_at).getDay(); chart[d===0?6:d-1]++; });

  return (
    <div>
      <MissionBrief onGoToPlan={onGoToPlan}/>
      <div style={{display:"flex",gap:14,marginBottom:20,flexWrap:"wrap"}}>
        <Stat label="Total Analyses"    val={rows.length}  color={G.cyan}   badge={rows.length?`${rows.length} videos`:"Start analysing"}/>
        <Stat label="Scripts Generated" val={scripts}      color={G.purple} badge={scripts?`${scripts} ready`:"No scripts yet"}/>
        <Stat label="Avg Viral Score"   val={avg||"—"}     color={G.gold}   sub="out of 10"/>
        <Stat label="TikTok / Instagram" val={`${tik} / ${ins}`} color={G.coral} sub="platform split"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:14,marginBottom:20}}>
        <Card>
          <CLabel color={G.cyan}>Analysis Activity — This Week</CLabel>
          <LineChart data={chart} color={G.gold} h={120}/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:8,paddingTop:8,borderTop:`1px solid ${G.border}`}}>
            {WDAYS.map(d=><span key={d} style={{fontSize:10,color:G.muted}}>{d}</span>)}
          </div>
        </Card>
        <Card>
          <CLabel>Videos Analysed By Platform</CLabel>
          <Donut segs={[{v:tik||1,c:G.cyan},{v:ins||1,c:G.purple}]} val={rows.length} lbl="total" size={130}/>
          <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:10}}>
            {[{l:"TikTok",v:tik,c:G.cyan},{l:"Instagram",v:ins,c:G.purple}].map(p=>(
              <div key={p.l} style={{display:"flex",alignItems:"center",gap:10,background:G.card2,borderRadius:8,padding:"8px 12px"}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:p.c,flexShrink:0}}/>
                <span style={{color:G.muted,fontSize:13,flex:1,fontWeight:600}}>{p.l}</span>
                <span style={{color:G.text,fontSize:16,fontWeight:800}}>{p.v} <span style={{color:G.muted,fontSize:11,fontWeight:400}}>videos</span></span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CLabel>Recent Analyses</CLabel>
        {busy && <div style={{color:G.muted,fontSize:13,padding:"20px 0"}}>Loading...</div>}
        {!busy && rows.length===0 && (
          <div style={{color:G.dim,fontSize:13,textAlign:"center",padding:"32px 0",fontFamily:"'Nunito',sans-serif"}}>
            No analyses yet — go to Analyse tab and paste a URL
          </div>
        )}
        {rows.length>0 && (
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr>{["Platform","URL","Viral Score","Scripts","Date"].map(h=>(
                <th key={h} style={{textAlign:"left",fontSize:10,color:G.muted,textTransform:"uppercase",letterSpacing:"1px",padding:"0 16px 10px 0",borderBottom:`1px solid ${G.border}`,fontWeight:600}}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {rows.map((a,i)=>(
                <tr key={a.id} style={{borderBottom:i<rows.length-1?`1px solid ${G.border}`:"none"}}>
                  <td style={{padding:"13px 16px 13px 0"}}>
                    <span style={{fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:6,background:a.platform==="tiktok"?`${G.cyan}18`:`${G.purple}18`,border:`1px solid ${a.platform==="tiktok"?G.cyan:G.purple}30`,color:a.platform==="tiktok"?G.cyan:G.purple,textTransform:"capitalize"}}>{a.platform}</span>
                  </td>
                  <td style={{padding:"13px 16px 13px 0",color:G.muted,fontSize:12,maxWidth:220}}>
                    <div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.url}</div>
                  </td>
                  <td style={{padding:"13px 16px 13px 0"}}>
                    <span style={{fontFamily:"'Nunito',sans-serif",fontSize:16,fontWeight:900,color:G.gold}}>{a.analysis?.viralScore||"—"}</span>
                    <span style={{color:G.muted,fontSize:11}}> /10</span>
                  </td>
                  <td style={{padding:"13px 16px 13px 0",fontFamily:"'Nunito',sans-serif",fontSize:15,fontWeight:700,color:G.purple}}>{a.analysis?.scripts?.length||0}</td>
                  <td style={{padding:"13px 0",color:G.muted,fontSize:11}}>{new Date(a.created_at).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

/* ─── ANALYSE ────────────────────────────────────────────────────────────── */
const PH = [{key:"scraping",label:"Scraping video"},{key:"analysing",label:"Running AI"},{key:"done",label:"Complete"}];
const PO = ["scraping","analysing","done"];

function Analyse() {
  const [url,setUrl]=useState("");
  const [busy,setBusy]=useState(false);
  const [phase,setPhase]=useState("idle");
  const [vd,setVd]=useState(null);
  const [an,setAn]=useState(null);
  const [err,setErr]=useState("");

  async function run() {
    if (!url.trim()) { setErr("Paste a TikTok or Instagram URL first."); return; }
    if (!url.includes("tiktok.com")&&!url.includes("instagram.com")) { setErr("Only TikTok and Instagram URLs are supported."); return; }
    setErr(""); setBusy(true); setVd(null); setAn(null); setPhase("scraping");
    try {
      const s = await fetch("/api/analyse",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url})});
      const sd = await s.json();
      if (!s.ok) throw new Error(sd.error||"Failed to start");
      const {runId,datasetId,platform:plat,url:cu} = sd;
      let att=0;
      let analysisId=null;
      while (att<40) {
        await new Promise(r=>setTimeout(r,5000));
        const r = await fetch("/api/result",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId,datasetId,platform:plat,url:cu})});
        const rd = await r.json();
        if (!r.ok) throw new Error(rd.error||"Analysis failed");
        if (!rd.pending) { setVd(rd.videoData); setPhase("analysing"); analysisId=rd.analysisId; break; }
        att++;
      }
      if (att>=40) throw new Error("Timed out — scraper took too long");
      if (!analysisId) throw new Error("No analysis ID returned");

      att=0;
      while (att<40) {
        await new Promise(r=>setTimeout(r,5000));
        const r = await fetch(`/api/get-analysis-status?id=${analysisId}`);
        const rd = await r.json();
        if (!r.ok) throw new Error(rd.error||"Analysis lookup failed");
        if (rd.status==="done") { setAn(rd.analysis); setPhase("done"); break; }
        if (rd.status==="failed") throw new Error("Claude analysis failed — try again");
        att++;
      }
      if (att>=40) throw new Error("Timed out — analysis took too long");
    } catch(e) { setErr(e.message); setPhase("idle"); }
    setBusy(false);
  }

  return (
    <div>
      {/* Input */}
      <Card style={{marginBottom:20,borderColor:busy?G.cyan:G.border}}>
        <CLabel color={G.cyan}>Drop a Viral URL</CLabel>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&run()}
            placeholder="paste tiktok or instagram reel url..."
            style={{flex:1,minWidth:200,background:G.card2,border:`1px solid ${G.border}`,borderRadius:10,padding:"13px 16px",color:G.text,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
          <button onClick={run} disabled={busy}
            style={{background:busy?G.card2:G.gold,border:"none",borderRadius:10,padding:"13px 28px",color:busy?"#444":"#000",fontWeight:800,fontSize:14,cursor:busy?"not-allowed":"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
            {busy?"Analysing...":"Analyse →"}
          </button>
        </div>
        {err && <div style={{color:G.coral,fontSize:12,marginTop:10,fontFamily:"'Nunito',sans-serif"}}>⚠ {err}</div>}
        {busy && (
          <div style={{display:"flex",gap:8,marginTop:16,flexWrap:"wrap"}}>
            {PH.map(p=>{
              const ci=PO.indexOf(phase),ti=PO.indexOf(p.key),on=p.key===phase,dn=ti<ci;
              return (
                <div key={p.key} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 13px",borderRadius:20,background:on?`${G.cyan}14`:G.card2,border:`1px solid ${on?G.cyan:G.border}`,fontSize:11,color:on?G.cyan:dn?"#2a2a28":G.dim,fontFamily:"'Nunito',sans-serif"}}>
                  {on&&<span style={{width:6,height:6,borderRadius:"50%",background:G.cyan,display:"inline-block",animation:"pulse 1s infinite"}}/>}
                  {dn?"✓ ":""}{p.label}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Metrics */}
      {vd && (
        <>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
            {[{l:"Views",v:vd.views,c:G.cyan},{l:"Likes",v:vd.likes,c:G.gold},{l:"Comments",v:vd.comments,c:G.green},{l:"Shares",v:vd.shares,c:G.purple},{l:"Duration",v:vd.duration,c:G.coral}].map(x=>(
              <div key={x.l} style={{flex:1,minWidth:90,background:G.card,border:`1px solid ${G.border}`,borderTop:`2px solid ${x.c}`,borderRadius:"0 0 12px 12px",padding:"16px 14px",textAlign:"center"}}>
                <div style={{fontFamily:"'Nunito',sans-serif",fontSize:22,fontWeight:900,color:x.c}}>{typeof x.v==="number"?x.v.toLocaleString():x.v}</div>
                <div style={{color:G.muted,fontSize:10,textTransform:"uppercase",letterSpacing:"1.5px",marginTop:5}}>{x.l}</div>
              </div>
            ))}
          </div>
          <Card style={{marginBottom:16}}>
            <div style={{color:G.muted,fontSize:10,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:6}}>Caption</div>
            <div style={{color:"#ccc",fontSize:13,lineHeight:1.7}}>{vd.caption}</div>
          </Card>
        </>
      )}

      {/* Analysis */}
      {an && (
        <>
          {/* Scores */}
          <Card style={{marginBottom:16}}>
            <CLabel color={G.gold}>Viral Performance Scores</CLabel>
            <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:18}}>
              <div style={{background:`${G.gold}14`,border:`1px solid ${G.gold}35`,borderRadius:14,padding:"20px 24px",textAlign:"center",minWidth:110}}>
                <div style={{fontFamily:"'Nunito',sans-serif",fontSize:48,fontWeight:900,color:G.gold,lineHeight:1}}>{an.viralScore}</div>
                <div style={{color:G.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginTop:6}}>Viral Score</div>
              </div>
              <div style={{flex:1,minWidth:180,paddingTop:4}}>
                <Bar label="Hook Strength"   score={an.hookScore}      color={G.cyan}/>
                <Bar label="Retention Power" score={an.retentionScore} color={G.green}/>
                <Bar label="Emotion Trigger" score={an.emotionScore}   color={G.gold}/>
                <Bar label="Call to Action"  score={an.ctaScore}       color={G.coral}/>
              </div>
            </div>
            <div style={{background:G.card2,borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:14}}>
              <div style={{color:G.muted,fontSize:10,textTransform:"uppercase",letterSpacing:1}}>Emotion Triggered</div>
              <div style={{color:G.gold,fontWeight:800,fontSize:18}}>{an.emotionTriggered}</div>
            </div>
          </Card>

          {/* Why it worked */}
          <Card style={{marginBottom:16}}>
            <CLabel color={G.cyan}>Why It Went Viral</CLabel>
            <div style={{color:"#aaa",fontSize:13,lineHeight:1.8,marginBottom:16}}>{an.audienceInsight}</div>
            {an.whyItWorked.map((r,i)=>(
              <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"10px 0",borderBottom:i<an.whyItWorked.length-1?`1px solid ${G.border}`:"none"}}>
                <span style={{fontFamily:"'Nunito',sans-serif",fontSize:11,color:G.cyan,flexShrink:0}}>{String(i+1).padStart(2,"0")}</span>
                <div style={{color:"#ccc",fontSize:13,lineHeight:1.6}}>{r}</div>
              </div>
            ))}
            <div style={{background:`${G.green}0a`,border:`1px solid ${G.green}22`,borderRadius:10,padding:"12px 16px",marginTop:14}}>
              <div style={{color:G.green,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Hook Formula</div>
              <div style={{color:"#ccc",fontSize:13}}>{an.hookFormula}</div>
            </div>
          </Card>

          {/* Scripts */}
          <div style={{marginBottom:8}}>
            <div style={{color:G.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:12,fontFamily:"'Nunito',sans-serif"}}>Scripts — Ready to Film</div>
            {an.scripts.map((sc,i)=>(
              <Card key={i} style={{marginBottom:12,borderLeft:`3px solid ${G.purple}`,borderRadius:"0 12px 12px 0"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={{color:G.text,fontWeight:700,fontSize:14}}>Script {i+1} — {sc.title}</div>
                  <span style={{fontSize:10,padding:"3px 9px",borderRadius:10,border:`1px solid ${G.purple}40`,color:G.purple,textTransform:"uppercase",letterSpacing:1}}>READY</span>
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{color:G.coral,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>Hook — 0 to 3 sec</div>
                  <div style={{background:`${G.coral}0e`,border:`1px solid ${G.coral}25`,borderRadius:8,padding:"11px 14px",color:G.text,fontSize:15,fontWeight:600,lineHeight:1.5}}>"{sc.hook}"</div>
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{color:G.cyan,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>Body — 4 to 40 sec</div>
                  <div style={{background:G.card2,border:`1px solid ${G.border}`,borderRadius:8,padding:"11px 14px",color:"#bbb",fontSize:13,lineHeight:1.8}}>{sc.body}</div>
                </div>
                <div style={{marginBottom:sc.why?10:0}}>
                  <div style={{color:G.green,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>CTA — Last 5 sec</div>
                  <div style={{background:`${G.green}0e`,border:`1px solid ${G.green}25`,borderRadius:8,padding:"11px 14px",color:G.green,fontSize:14,fontWeight:700}}>"{sc.cta}"</div>
                </div>
                {sc.why && <div style={{color:G.muted,fontSize:11,lineHeight:1.5,borderTop:`1px solid ${G.border}`,paddingTop:10,marginTop:10}}>{sc.why}</div>}
              </Card>
            ))}
          </div>

          {/* Hooks */}
          <Card style={{marginBottom:16}}>
            <CLabel color={G.green}>Standalone Hooks — Swipe File</CLabel>
            {an.topHooks.map((h,i)=>(
              <div key={i} style={{background:G.card2,borderRadius:8,padding:"12px 14px",marginBottom:8,fontSize:14,color:"#ddd",lineHeight:1.5}}>
                <span style={{fontFamily:"'Nunito',sans-serif",fontSize:11,color:G.green,marginRight:8}}>{String(i+1).padStart(2,"0")}</span>"{h}"
              </div>
            ))}
          </Card>

          {/* Hashtags */}
          <Card style={{marginBottom:16}}>
            <CLabel color={G.purple}>Hashtag Strategy</CLabel>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {an.hashtagStrategy.map((t,i)=>(
                <div key={i} style={{background:G.card2,border:`1px solid ${G.border}`,borderRadius:20,padding:"7px 14px",fontSize:13,color:G.purple,fontWeight:600}}>#{t}</div>
              ))}
            </div>
          </Card>

          {an.warningSignals?.length>0 && (
            <Card style={{marginBottom:16,borderLeft:`3px solid ${G.coral}`,borderRadius:"0 12px 12px 0"}}>
              <CLabel color={G.coral}>Watch Out For</CLabel>
              {an.warningSignals.map((w,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:i<an.warningSignals.length-1?`1px solid ${G.border}`:"none"}}>
                  <span style={{color:G.coral}}>⚠</span>
                  <div style={{color:"#999",fontSize:13,lineHeight:1.5}}>{w}</div>
                </div>
              ))}
            </Card>
          )}
        </>
      )}

      {!vd && !busy && (
        <div style={{textAlign:"center",padding:"80px 20px"}}>
          <div style={{fontFamily:"'Nunito',sans-serif",fontSize:72,color:G.gold,opacity:.05,lineHeight:1,marginBottom:24}}>⚡</div>
          <div style={{color:G.dim,fontSize:13,lineHeight:2.2,fontFamily:"'Nunito',sans-serif"}}>
            paste any viral tiktok or instagram url<br/>
            reconexus reverse-engineers it<br/>
            and writes you 3 scripts to film
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── SCRIPT VAULT ───────────────────────────────────────────────────────── */
const VAULT_TABS = [
  { k:"pending",  l:"Pending Review", c:G.gold },
  { k:"unused",   l:"Approved",       c:G.purple },
  { k:"used",     l:"Used",           c:G.dim },
  { k:"rejected", l:"Rejected",       c:G.coral },
];

function ScriptCard({ s, filter, tab, setStatus }) {
  return (
    <Card style={{marginBottom:12,borderLeft:`3px solid ${tab.c}`,borderRadius:"0 12px 12px 0"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:10}}>
        <div style={{color:G.text,fontWeight:700,fontSize:14}}>{s.title}</div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
          {filter==="pending" && (
            <>
              <button onClick={()=>setStatus(s.id,"unused")} style={{background:`${G.green}15`,border:`1px solid ${G.green}40`,borderRadius:7,padding:"5px 13px",fontSize:11,color:G.green,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Approve</button>
              <button onClick={()=>setStatus(s.id,"rejected")} style={{background:`${G.coral}15`,border:`1px solid ${G.coral}40`,borderRadius:7,padding:"5px 13px",fontSize:11,color:G.coral,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Reject</button>
            </>
          )}
          {filter==="unused" && (
            <button onClick={()=>setStatus(s.id,"used")} style={{background:`${G.purple}15`,border:`1px solid ${G.purple}40`,borderRadius:7,padding:"5px 13px",fontSize:11,color:G.purple,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Mark Used</button>
          )}
          {filter==="rejected" && (
            <button onClick={()=>setStatus(s.id,"pending")} style={{background:"transparent",border:`1px solid ${G.dim}`,borderRadius:7,padding:"5px 13px",fontSize:11,color:G.muted,cursor:"pointer",fontFamily:"inherit"}}>Restore to Pending</button>
          )}
        </div>
      </div>
      <div style={{background:`${G.coral}0e`,border:`1px solid ${G.coral}20`,borderRadius:7,padding:"10px 13px",marginBottom:8,color:"#ddd",fontSize:14,fontStyle:"italic"}}>"{s.hook}"</div>
      <div style={{color:"#888",fontSize:13,lineHeight:1.7,marginBottom:8}}>{s.body}</div>
      <div style={{color:G.green,fontSize:12,fontWeight:700}}>{s.cta}</div>
      {s.why && <div style={{color:"#333",fontSize:11,borderTop:`1px solid ${G.border}`,paddingTop:8,marginTop:8}}>{s.why}</div>}
    </Card>
  );
}

function Vault() {
  const [scripts,setScripts]=useState([]);
  const [busy,setBusy]=useState(true);
  const [filter,setFilter]=useState("pending");
  const [bulkBusy,setBulkBusy]=useState({});

  useEffect(()=>{
    setBusy(true);
    fetch(`/api/get-scripts?status=${filter}&limit=100`).then(r=>r.json())
      .then(d=>{setScripts(d.scripts||[]);setBusy(false);}).catch(()=>setBusy(false));
  },[filter]);

  async function setStatus(id, status) {
    await fetch("/api/update-script",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({scriptId:id,status})});
    setScripts(prev=>prev.filter(s=>s.id!==id));
  }

  async function bulkSetStatus(ids, status, key) {
    setBulkBusy(prev=>({...prev,[key]:true}));
    for (const id of ids) {
      await fetch("/api/update-script",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({scriptId:id,status})});
    }
    setScripts(prev=>prev.filter(s=>!ids.includes(s.id)));
    setBulkBusy(prev=>{const n={...prev};delete n[key];return n;});
  }

  const tab = VAULT_TABS.find(t=>t.k===filter);

  // Split pending scripts: property packs (share a batch_id) get grouped separately
  // from regular video-analysis scripts, so a 15-script pack doesn't drown everything else.
  let packs = [];
  let solo = scripts;
  if (filter === "pending") {
    const byBatch = {};
    solo = [];
    scripts.forEach(s => {
      if (s.batch_id) { (byBatch[s.batch_id] = byBatch[s.batch_id] || []).push(s); }
      else solo.push(s);
    });
    packs = Object.entries(byBatch).map(([batchId, group]) => {
      const propertyName = (group.find(g=>!g.property_note?.includes('—'))?.property_note) || group[0]?.property_note?.split(' — ')[0] || 'Property Pack';
      return { batchId, propertyName, group };
    });
  }

  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {VAULT_TABS.map(t=>(
          <button key={t.k} onClick={()=>setFilter(t.k)} style={{background:filter===t.k?`${t.c}18`:"transparent",border:`1px solid ${filter===t.k?t.c:G.dim}`,borderRadius:20,padding:"6px 16px",fontSize:12,color:filter===t.k?t.c:G.muted,cursor:"pointer",fontFamily:"inherit"}}>{t.l}</button>
        ))}
      </div>
      {busy && <div style={{color:G.muted,fontSize:13}}>Loading...</div>}
      {!busy && scripts.length===0 && (
        <div style={{color:G.dim,fontSize:13,textAlign:"center",padding:"50px 0",fontFamily:"'Nunito',sans-serif"}}>
          {filter==="pending" ? "nothing waiting for review — analyse a viral video to generate scripts" : `no ${tab.l.toLowerCase()} scripts`}
        </div>
      )}

      {packs.map(pack => {
        const busyThis = !!bulkBusy[pack.batchId];
        return (
          <div key={pack.batchId} style={{marginBottom:24,border:`1px solid ${G.purple}30`,borderRadius:14,padding:16,background:`${G.purple}06`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14,flexWrap:'wrap',gap:10}}>
              <div style={{fontSize:13,fontWeight:800,color:G.purple}}>📦 Property Pack — {pack.propertyName} ({pack.group.length} scripts)</div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>bulkSetStatus(pack.group.map(g=>g.id),"unused",pack.batchId)} disabled={busyThis}
                  style={{background:`${G.green}15`,border:`1px solid ${G.green}40`,borderRadius:7,padding:"5px 13px",fontSize:11,color:G.green,cursor:'pointer',fontFamily:'inherit',fontWeight:700}}>Approve All</button>
                <button onClick={()=>bulkSetStatus(pack.group.map(g=>g.id),"rejected",pack.batchId)} disabled={busyThis}
                  style={{background:`${G.coral}15`,border:`1px solid ${G.coral}40`,borderRadius:7,padding:"5px 13px",fontSize:11,color:G.coral,cursor:'pointer',fontFamily:'inherit',fontWeight:700}}>Reject All</button>
              </div>
            </div>
            {pack.group.map(s => <ScriptCard key={s.id} s={s} filter={filter} tab={tab} setStatus={setStatus}/>)}
          </div>
        );
      })}

      {solo.length > 0 && packs.length > 0 && <CLabel color={G.gold}>From Video Analysis</CLabel>}
      {solo.map(s => <ScriptCard key={s.id} s={s} filter={filter} tab={tab} setStatus={setStatus}/>)}
    </div>
  );
}

/* ─── CHAT RECONEXUS ─────────────────────────────────────────────────────── */
function ChatReconexus() {
  const [msgs, setMsgs] = useState([
    { role:"assistant", text:"I'm Reconexus. Ask me anything about your content strategy — what hooks are working, what to post next, how to grow @allianzhousinguk. The more videos you analyse, the smarter I get." }
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useState(null);

  async function send() {
    const q = input.trim();
    if (!q || busy) return;
    setInput("");
    const next = [...msgs, { role:"user", text:q }];
    setMsgs(next);
    setBusy(true);
    try {
      const res = await fetch("/api/chat-reconexus", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ message: q, history: next.slice(-10) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error||"Failed");
      setMsgs(prev => [...prev, { role:"assistant", text:data.reply }]);
    } catch(e) {
      setMsgs(prev => [...prev, { role:"assistant", text:`Error: ${e.message}` }]);
    }
    setBusy(false);
  }

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 180px)",minHeight:500}}>
      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",marginBottom:16,display:"flex",flexDirection:"column",gap:12}}>
        {msgs.map((m,i) => (
          <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",flexDirection:m.role==="user"?"row-reverse":"row"}}>
            {/* Avatar */}
            <div style={{width:34,height:34,borderRadius:"50%",background:m.role==="assistant"?`${G.gold}25`:G.card2,border:`1px solid ${m.role==="assistant"?G.gold:G.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {m.role==="assistant" ? <Brain s={18}/> : <span style={{fontSize:13,fontWeight:800,color:G.cyan}}>F</span>}
            </div>
            {/* Bubble */}
            <div style={{maxWidth:"75%",background:m.role==="user"?`${G.cyan}18`:G.card,border:`1px solid ${m.role==="user"?`${G.cyan}40`:G.border}`,borderRadius:m.role==="user"?"16px 4px 16px 16px":"4px 16px 16px 16px",padding:"12px 16px"}}>
              {m.role==="assistant" && <div style={{color:G.gold,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:6}}>Reconexus</div>}
              <div style={{color:G.text,fontSize:14,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{m.text}</div>
            </div>
          </div>
        ))}
        {busy && (
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:`${G.gold}25`,border:`1px solid ${G.gold}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Brain s={18}/>
            </div>
            <div style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:"4px 16px 16px 16px",padding:"14px 18px",display:"flex",gap:5,alignItems:"center"}}>
              {[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:G.gold,display:"inline-block",animation:`pulse 1s ${i*0.2}s infinite`}}/>)}
            </div>
          </div>
        )}
      </div>
      {/* Input */}
      <div style={{display:"flex",gap:10,background:G.card,border:`1px solid ${G.border}`,borderRadius:14,padding:12}}>
        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
          placeholder="Ask Reconexus anything about your content strategy..."
          style={{flex:1,background:"transparent",border:"none",color:G.text,fontSize:14,outline:"none",fontFamily:"inherit"}}
        />
        <button onClick={send} disabled={busy||!input.trim()}
          style={{background:busy||!input.trim()?G.card2:G.gold,border:"none",borderRadius:10,padding:"10px 20px",color:busy||!input.trim()?"#444":"#000",fontWeight:800,fontSize:13,cursor:busy||!input.trim()?"not-allowed":"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
          Send →
        </button>
      </div>
    </div>
  );
}

/* ─── COMPETITORS ────────────────────────────────────────────────────────── */
function Competitors({ onAnalyseVideo }) {
  const [competitors, setCompetitors] = useState([]);
  const [busy, setBusy] = useState(true);
  const [selected, setSelected] = useState(null);
  const [videos, setVideos] = useState([]);
  const [videosBusy, setVideosBusy] = useState(false);
  const [adding, setAdding] = useState(false);
  const [handle, setHandle] = useState('');
  const [platform, setPlatform] = useState('tiktok');
  const [limit, setLimit] = useState(20);
  const [addErr, setAddErr] = useState('');
  const [addBusy, setAddBusy] = useState(false);
  const [scraping, setScraping] = useState({});
  const [compTab, setCompTab] = useState('videos');
  const [compAnalyses, setCompAnalyses] = useState([]);
  const [compAnalysesBusy, setCompAnalysesBusy] = useState(false);
  const [analysingVideo, setAnalysingVideo] = useState({});

  function fmt(n) {
    if (!n) return '0';
    if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n/1000).toFixed(1)}K`;
    return String(n);
  }

  useEffect(() => { load(); }, []);

  async function load() {
    setBusy(true);
    try {
      const res = await fetch('/api/get-competitors');
      const d = await res.json();
      setCompetitors(d.competitors || []);
    } catch {}
    setBusy(false);
  }

  async function addCompetitor() {
    if (!handle.trim()) { setAddErr('Enter a handle or URL'); return; }
    setAddErr(''); setAddBusy(true);
    try {
      const res = await fetch('/api/add-competitor', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ input: handle.trim(), platform }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to add');
      setHandle(''); setAdding(false);
      await load();
    } catch(e) { setAddErr(e.message); }
    setAddBusy(false);
  }

  async function removeCompetitor(c) {
    if (!confirm(`Remove ${c.handle}? This deletes all their scraped videos too.`)) return;
    await fetch('/api/delete-competitor', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ competitorId: c.id }),
    });
    setSelected(null);
    await load();
  }

  async function startScrape(c) {
    setScraping(prev => ({ ...prev, [c.id]: true }));
    try {
      const res = await fetch('/api/scrape-competitor', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ competitorId: c.id, limit }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to start');
      poll(c.id, d.runId, d.datasetId, d.platform);
    } catch(e) {
      setScraping(prev => { const n={...prev}; delete n[c.id]; return n; });
      alert(e.message);
    }
  }

  async function poll(competitorId, runId, datasetId, plt) {
    for (let i=0; i<40; i++) {
      await new Promise(r => setTimeout(r, 5000));
      try {
        const res = await fetch('/api/competitor-result', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ runId, datasetId, competitorId, platform: plt }),
        });
        const d = await res.json();
        if (!res.ok) { alert(d.error || 'Scrape failed'); break; }
        if (!d.pending) {
          setScraping(prev => { const n={...prev}; delete n[competitorId]; return n; });
          await load();
          if (selected && selected.id === competitorId) {
            // Re-fetch the full stored list — videos accumulate now, they don't get replaced,
            // so the scrape response alone (this run's batch) isn't the whole picture.
            const vr = await fetch(`/api/get-competitor-videos?competitorId=${competitorId}`);
            const vd = await vr.json();
            setVideos(vd.videos || []);
          }
          if (d.newCount !== undefined) {
            alert(d.newCount > 0 ? `${d.newCount} new video${d.newCount>1?'s':''} added${d.skippedDuplicates>0?`, ${d.skippedDuplicates} already had.`:'.'}` : `No new videos — all ${d.skippedDuplicates} were already stored. Try a higher video count to reach further into their history.`);
          }
          return;
        }
      } catch {}
    }
    setScraping(prev => { const n={...prev}; delete n[competitorId]; return n; });
  }

  async function openCompetitor(c) {
    setSelected(c); setVideos([]); setCompTab('videos'); setCompAnalyses([]);
    setVideosBusy(true);
    try {
      const res = await fetch(`/api/get-competitor-videos?competitorId=${c.id}`);
      const d = await res.json();
      setVideos(d.videos || []);
    } catch {}
    setVideosBusy(false);
  }

  async function loadCompAnalyses(c) {
    setCompAnalysesBusy(true);
    try {
      const res = await fetch(`/api/get-competitor-analyses?competitorId=${c.id}`);
      const d = await res.json();
      setCompAnalyses(d.analyses || []);
    } catch {}
    setCompAnalysesBusy(false);
  }

  async function analyseCompetitorVideo(v) {
    if (!v.url) return;
    setAnalysingVideo(prev => ({ ...prev, [v.id]: 'starting' }));
    try {
      const s = await fetch('/api/analyse', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: v.url }) });
      const sd = await s.json();
      if (!s.ok) throw new Error(sd.error || 'Failed to start');
      const { runId, datasetId, platform: plat, url: cu } = sd;
      setAnalysingVideo(prev => ({ ...prev, [v.id]: 'scraping' }));
      let att = 0, analysisId = null;
      while (att < 40) {
        await new Promise(r => setTimeout(r, 5000));
        const r = await fetch('/api/result', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ runId, datasetId, platform: plat, url: cu, competitorId: selected.id }) });
        const rd = await r.json();
        if (!r.ok) throw new Error(rd.error || 'Scrape failed');
        if (!rd.pending) { analysisId = rd.analysisId; break; }
        att++;
      }
      if (!analysisId) throw new Error('No analysis ID');
      setAnalysingVideo(prev => ({ ...prev, [v.id]: 'analysing' }));
      att = 0;
      while (att < 40) {
        await new Promise(r => setTimeout(r, 5000));
        const r = await fetch(`/api/get-analysis-status?id=${analysisId}`);
        const rd = await r.json();
        if (rd.status === 'done') { break; }
        if (rd.status === 'failed') throw new Error('Analysis failed');
        att++;
      }
      setAnalysingVideo(prev => { const n = { ...prev }; delete n[v.id]; return n; });
      setCompTab('analyses');
      await loadCompAnalyses(selected);
      const vr = await fetch(`/api/get-competitor-videos?competitorId=${selected.id}`);
      const vdata = await vr.json();
      setVideos(vdata.videos || []);
    } catch (e) {
      setAnalysingVideo(prev => { const n = { ...prev }; delete n[v.id]; return n; });
      alert(e.message);
    }
  }

  /* ── Detail view ── */
  if (selected) {
    const isScraping = !!scraping[selected.id];
    return (
      <div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,flexWrap:'wrap',gap:10}}>
          <button onClick={() => setSelected(null)} style={{background:'transparent',border:`1px solid ${G.border}`,borderRadius:8,padding:'7px 14px',color:G.muted,cursor:'pointer',fontSize:12,fontFamily:'inherit'}}>
            ← Back
          </button>
          <div style={{flex:1,minWidth:160}}>
            <div style={{fontSize:20,fontWeight:800,color:G.text}}>{selected.handle}</div>
            <div style={{fontSize:12,color:G.muted,marginTop:2,textTransform:'capitalize'}}>{selected.platform} · {videos.length} videos scraped</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{display:'flex',gap:6,alignItems:'center'}}>
              <span style={{fontSize:11,color:G.muted}}>Videos:</span>
              {[10,20,30,50].map(n=>(
                <button key={n} onClick={e=>{e.stopPropagation();setLimit(n);}}
                  style={{background:limit===n?`${G.coral}18`:'transparent',border:`1px solid ${limit===n?G.coral:G.dim}`,borderRadius:20,padding:'3px 10px',fontSize:11,color:limit===n?G.coral:G.muted,cursor:'pointer',fontFamily:'inherit'}}>{n}</button>
              ))}
            </div>
            <button onClick={() => !isScraping && startScrape(selected)} disabled={isScraping}
              style={{background:isScraping?G.card2:`${G.coral}14`,border:`1px solid ${isScraping?G.border:G.coral}`,borderRadius:10,padding:'9px 18px',color:isScraping?G.muted:G.coral,fontSize:12,fontWeight:700,cursor:isScraping?'not-allowed':'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',gap:6}}>
              {isScraping?<><span style={{width:6,height:6,borderRadius:'50%',background:G.coral,display:'inline-block',animation:'pulse 1s infinite'}}/>Scraping...</>:'Scrape Again →'}
            </button>
            <button onClick={() => removeCompetitor(selected)}
              style={{background:'transparent',border:`1px solid ${G.dim}`,borderRadius:10,padding:'9px 14px',color:G.muted,fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>
              Remove
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{display:'flex',gap:4,marginBottom:16,background:G.card,border:`1px solid ${G.border}`,borderRadius:10,padding:4,width:'fit-content'}}>
          {[{k:'videos',l:'Videos'},{k:'analyses',l:`Analyses${compAnalyses.length?` (${compAnalyses.length})`:''}`}].map(t=>(
            <button key={t.k} onClick={()=>{ setCompTab(t.k); if(t.k==='analyses'&&compAnalyses.length===0) loadCompAnalyses(selected); }}
              style={{background:compTab===t.k?G.coral:'transparent',border:'none',borderRadius:7,padding:'6px 16px',color:compTab===t.k?'#000':G.muted,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit',transition:'all .15s'}}>
              {t.l}
            </button>
          ))}
        </div>

        {compTab==='analyses' && (
          <div>
            {compAnalysesBusy && <div style={{color:G.muted,fontSize:13,padding:'30px 0',textAlign:'center'}}>Loading analyses...</div>}
            {!compAnalysesBusy && compAnalyses.length===0 && (
              <Card><div style={{textAlign:'center',padding:'40px 20px'}}>
                <Brain s={44}/>
                <div style={{color:G.dim,fontSize:13,marginTop:16,lineHeight:1.9}}>No analyses yet — go to Videos tab and hit Analyse on any video</div>
              </div></Card>
            )}
            {compAnalyses.map((a,i)=>(
              <Card key={a.id} style={{marginBottom:12}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
                  <div>
                    <div style={{fontSize:13,color:G.text,fontWeight:600,marginBottom:4,overflow:'hidden',textOverflow:'ellipsis',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',maxWidth:400}}>
                      {a.video_data?.caption || a.url}
                    </div>
                    <a href={a.url} target="_blank" rel="noreferrer" style={{fontSize:11,color:G.dim,textDecoration:'none'}}>{new Date(a.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})} · view video ↗</a>
                  </div>
                  <div style={{display:'flex',gap:10,alignItems:'center',flexShrink:0}}>
                    <div style={{textAlign:'center'}}>
                      <div style={{fontFamily:"'Nunito',sans-serif",fontSize:28,fontWeight:900,color:G.gold,lineHeight:1}}>{a.analysis?.viralScore||'—'}</div>
                      <div style={{fontSize:9,color:G.muted,textTransform:'uppercase',letterSpacing:1}}>Viral</div>
                    </div>
                  </div>
                </div>
                {a.analysis?.whyItWorked && (
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:10,color:G.cyan,fontWeight:700,textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>Why It Worked</div>
                    {a.analysis.whyItWorked.slice(0,2).map((r,j)=>(
                      <div key={j} style={{fontSize:12,color:'#aaa',lineHeight:1.6,marginBottom:4}}>· {r}</div>
                    ))}
                  </div>
                )}
                {a.analysis?.hookFormula && (
                  <div style={{background:`${G.green}0a`,border:`1px solid ${G.green}22`,borderRadius:8,padding:'10px 14px'}}>
                    <div style={{fontSize:10,color:G.green,fontWeight:700,textTransform:'uppercase',letterSpacing:1,marginBottom:3}}>Hook Formula</div>
                    <div style={{fontSize:12,color:'#ccc'}}>{a.analysis.hookFormula}</div>
                  </div>
                )}
                {a.analysis?.scripts?.length > 0 && (
                  <div style={{marginTop:12,padding:'10px 0 0',borderTop:`1px solid ${G.border}`}}>
                    <div style={{fontSize:10,color:G.purple,fontWeight:700,textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>{a.analysis.scripts.length} Scripts Generated</div>
                    {a.analysis.scripts.map((sc,j)=>(
                      <div key={j} style={{fontSize:12,color:G.muted,marginBottom:3}}>· {sc.title}</div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {compTab==='videos' && <>
        {videosBusy && <div style={{color:G.muted,fontSize:13,padding:'40px 0',textAlign:'center'}}>Loading videos...</div>}
        {!videosBusy && videos.length===0 && (
          <Card><div style={{textAlign:'center',padding:'40px 20px'}}>
            <Brain s={44}/>
            <div style={{color:G.dim,fontSize:13,marginTop:16,lineHeight:1.9}}>No videos yet — hit Scrape to pull their top content</div>
          </div></Card>
        )}
        {videos.map((v,i)=>{
          const vd = v;
          return (
            <Card key={v.id||i} style={{marginBottom:10,borderLeft:`3px solid ${i===0?G.gold:i<3?G.cyan:G.border}`,borderRadius:'0 12px 12px 0'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                    <span style={{fontFamily:"'Nunito',sans-serif",fontSize:13,color:i===0?G.gold:G.muted,fontWeight:700}}>#{i+1}</span>
                    {i===0&&<span style={{fontSize:10,background:`${G.gold}18`,border:`1px solid ${G.gold}40`,borderRadius:10,padding:'2px 8px',color:G.gold}}>TOP VIDEO</span>}
                    {i>0&&i<3&&<span style={{fontSize:10,background:`${G.cyan}18`,border:`1px solid ${G.cyan}40`,borderRadius:10,padding:'2px 8px',color:G.cyan}}>TOP 3</span>}
                  </div>
                  <div style={{color:'#aaa',fontSize:13,lineHeight:1.6,marginBottom:10}}>{vd.caption?.slice(0,180)}{vd.caption?.length>180?'...':''}</div>
                  <div style={{display:'flex',gap:18,flexWrap:'wrap'}}>
                    {[{l:'Views',v:vd.views,c:G.cyan},{l:'Likes',v:vd.likes,c:G.gold},{l:'Comments',v:vd.comments,c:G.green},{l:'Shares',v:vd.shares,c:G.purple}].map(s=>(
                      <div key={s.l}>
                        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:17,fontWeight:800,color:s.c}}>{fmt(s.v)}</div>
                        <div style={{fontSize:10,color:G.muted,textTransform:'uppercase',letterSpacing:.5}}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:6,flexShrink:0}}>
                  {vd.url&&<a href={vd.url} target="_blank" rel="noopener noreferrer"
                    style={{color:G.muted,fontSize:11,border:`1px solid ${G.border}`,borderRadius:7,padding:'5px 10px',textDecoration:'none',whiteSpace:'nowrap',textAlign:'center'}}>View →</a>}
                  {vd.url && (() => {
                    const aState = analysingVideo[v.id];
                    const already = vd.analysed;
                    return (
                      <button onClick={e=>{e.stopPropagation();if(!aState)analyseCompetitorVideo(v);}}
                        disabled={!!aState}
                        style={{background:aState?G.card2:already?`${G.purple}14`:`${G.cyan}14`,border:`1px solid ${aState?G.border:already?`${G.purple}40`:`${G.cyan}40`}`,borderRadius:7,padding:'5px 10px',color:aState?G.muted:already?G.purple:G.cyan,fontSize:11,fontWeight:700,cursor:aState?'not-allowed':'pointer',fontFamily:'inherit',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:5}}>
                        {aState ? <><span style={{width:5,height:5,borderRadius:'50%',background:G.cyan,display:'inline-block',animation:'pulse 1s infinite'}}/>{aState==='analysing'?'Analysing...':'Scraping...'}</> : already ? '♻️ Analyse Again' : 'Analyse →'}
                      </button>
                    );
                  })()}
                </div>
              </div>
            </Card>
          );
        })}
        </>}
      </div>
    );
  }

  /* ── List view ── */
  return (
    <div>
      <div style={{marginBottom:20}}>
        {!adding ? (
          <button onClick={() => setAdding(true)}
            style={{background:`${G.coral}18`,border:`1px solid ${G.coral}40`,borderRadius:10,padding:'10px 20px',color:G.coral,fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
            + Add Competitor
          </button>
        ) : (
          <Card style={{marginBottom:0,borderColor:`${G.coral}40`}}>
            <CLabel color={G.coral}>Add a Competitor Account</CLabel>
            <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:12}}>
              <input value={handle} onChange={e=>setHandle(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCompetitor()}
                placeholder="@handle or full TikTok / Instagram URL"
                style={{flex:1,minWidth:200,background:G.card2,border:`1px solid ${G.border}`,borderRadius:10,padding:'12px 16px',color:G.text,fontSize:14,outline:'none',fontFamily:'inherit'}}/>
              <select value={platform} onChange={e=>setPlatform(e.target.value)}
                style={{background:G.card2,border:`1px solid ${G.border}`,borderRadius:10,padding:'12px 14px',color:G.text,fontSize:14,outline:'none',fontFamily:'inherit',cursor:'pointer'}}>
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:12}}>
              <span style={{fontSize:12,color:G.muted}}>Videos to scrape:</span>
              {[10,20,30,50].map(n=>(
                <button key={n} onClick={()=>setLimit(n)}
                  style={{background:limit===n?`${G.coral}18`:'transparent',border:`1px solid ${limit===n?G.coral:G.dim}`,borderRadius:20,padding:'4px 12px',fontSize:12,color:limit===n?G.coral:G.muted,cursor:'pointer',fontFamily:'inherit'}}>{n}</button>
              ))}
            </div>
            {addErr&&<div style={{color:G.coral,fontSize:12,marginBottom:10}}>⚠ {addErr}</div>}
            <div style={{display:'flex',gap:8}}>
              <button onClick={addCompetitor} disabled={addBusy}
                style={{background:addBusy?G.card2:G.coral,border:'none',borderRadius:10,padding:'10px 20px',color:addBusy?G.muted:'#000',fontWeight:800,fontSize:13,cursor:addBusy?'not-allowed':'pointer',fontFamily:'inherit'}}>
                {addBusy?'Adding...':'Add Competitor →'}
              </button>
              <button onClick={()=>{setAdding(false);setHandle('');setAddErr('');}}
                style={{background:'transparent',border:`1px solid ${G.border}`,borderRadius:10,padding:'10px 18px',color:G.muted,fontSize:13,cursor:'pointer',fontFamily:'inherit'}}>
                Cancel
              </button>
            </div>
          </Card>
        )}
      </div>

      {busy&&<div style={{color:G.muted,fontSize:13}}>Loading...</div>}
      {!busy&&competitors.length===0&&(
        <Card><div style={{textAlign:'center',padding:'50px 20px'}}>
          <Brain s={52}/>
          <div style={{color:G.dim,fontSize:13,lineHeight:1.9,marginTop:20}}>
            No competitors tracked yet<br/>
            Add a handle and Reconexus will scrape their top videos
          </div>
        </div></Card>
      )}

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:14,marginTop:adding?14:0}}>
        {competitors.map(c=>{
          const isScraping=!!scraping[c.id];
          return (
            <Card key={c.id} style={{cursor:'pointer',transition:'border-color .15s',borderColor:isScraping?`${G.coral}50`:G.border}}
              onClick={()=>!isScraping&&openCompetitor(c)}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:14}}>
                <div>
                  <div style={{fontSize:16,fontWeight:800,color:G.text,marginBottom:5}}>{c.handle}</div>
                  <span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:6,background:c.platform==='tiktok'?`${G.cyan}18`:`${G.purple}18`,border:`1px solid ${c.platform==='tiktok'?G.cyan:G.purple}30`,color:c.platform==='tiktok'?G.cyan:G.purple,textTransform:'capitalize'}}>{c.platform}</span>
                </div>
                <div style={{width:36,height:36,borderRadius:'50%',background:`${G.coral}14`,border:`1px solid ${G.coral}30`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <NIcon n="comp" sz={16} col={G.coral}/>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
                {[
                  {l:'Videos',v:c.videoCount||0,c:G.cyan},
                  {l:'Avg Views',v:c.avgViews?fmt(c.avgViews):'—',c:G.gold},
                  {l:'Top Video',v:c.topVideoViews?fmt(c.topVideoViews):'—',c:G.green},
                  {l:'Last Scraped',v:c.last_scraped?new Date(c.last_scraped).toLocaleDateString('en-GB'):'Never',c:G.muted},
                ].map(s=>(
                  <div key={s.l} style={{background:G.card2,borderRadius:8,padding:'10px 12px'}}>
                    <div style={{fontFamily:"'Nunito',sans-serif",fontSize:16,fontWeight:800,color:s.c}}>{s.v}</div>
                    <div style={{fontSize:10,color:G.muted,textTransform:'uppercase',letterSpacing:.5,marginTop:3}}>{s.l}</div>
                  </div>
                ))}
              </div>
              <button onClick={e=>{e.stopPropagation();!isScraping&&startScrape(c);}} disabled={isScraping}
                style={{width:'100%',background:isScraping?G.card2:`${G.coral}14`,border:`1px solid ${isScraping?G.border:`${G.coral}40`}`,borderRadius:8,padding:'9px',color:isScraping?G.muted:G.coral,fontSize:12,fontWeight:700,cursor:isScraping?'not-allowed':'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                {isScraping?<><span style={{width:6,height:6,borderRadius:'50%',background:G.coral,display:'inline-block',animation:'pulse 1s infinite'}}/>Scraping...</>:(c.videoCount>0?'Refresh →':'Scrape Now →')}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ─── ROOMS ──────────────────────────────────────────────────────────────── */
function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [busy, setBusy] = useState(true);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [property, setProperty] = useState('');
  const [saveBusy, setSaveBusy] = useState(false);
  const [packBusy, setPackBusy] = useState({});
  const [packPlatform, setPackPlatform] = useState({});
  const [packResult, setPackResult] = useState({});

  useEffect(() => { load(); }, []);

  async function load() {
    setBusy(true);
    try {
      const res = await fetch('/api/get-rooms');
      const d = await res.json();
      setRooms(d.rooms || []);
    } catch {}
    setBusy(false);
  }

  async function addRoom() {
    if (!name.trim()) return;
    setSaveBusy(true);
    try {
      const res = await fetch('/api/create-room', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description: desc, property }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed');
      setName(''); setDesc(''); setAdding(false);
      await load();
    } catch (e) { alert(e.message); }
    setSaveBusy(false);
  }

  async function toggleStatus(room) {
    const newStatus = room.status === 'needs_filling' ? 'filled' : 'needs_filling';
    await fetch('/api/update-room', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: room.id, status: newStatus }),
    });
    await load();
  }

  async function removeRoom(room) {
    if (!confirm(`Delete "${room.name}"?`)) return;
    await fetch('/api/delete-room', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: room.id }),
    });
    await load();
  }

  async function generatePack(propertyName) {
    const platform = packPlatform[propertyName] || 'tiktok';
    setPackBusy(prev => ({ ...prev, [propertyName]: true }));
    setPackResult(prev => { const n = { ...prev }; delete n[propertyName]; return n; });
    try {
      const res = await fetch('/api/generate-property-pack', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property: propertyName, platform }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to start');
      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 3000));
        const r2 = await fetch(`/api/get-scripts?batchId=${d.batchId}&limit=${d.count}`);
        const d2 = await r2.json();
        const rows = d2.scripts || [];
        if (rows.length === d.count && rows.every(s => s.body || s.title === 'GENERATION_FAILED')) {
          if (rows.some(s => s.title === 'GENERATION_FAILED')) throw new Error('Generation failed — try again');
          setPackResult(prev => ({ ...prev, [propertyName]: rows.length }));
          break;
        }
      }
    } catch (e) { alert(e.message); }
    setPackBusy(prev => { const n = { ...prev }; delete n[propertyName]; return n; });
  }

  const needsFilling = rooms.filter(r => r.status === 'needs_filling');
  const filled = rooms.filter(r => r.status === 'filled');
  const properties = [...new Set(needsFilling.filter(r => r.property).map(r => r.property))];

  return (
    <div>
      <div style={{display:'flex',gap:14,marginBottom:20,flexWrap:'wrap'}}>
        <Stat label="Needs Filling" val={needsFilling.length} color={G.coral} badge={needsFilling.length ? 'Available for matching' : 'All filled'}/>
        <Stat label="Filled" val={filled.length} color={G.green} sub="tenants moved in"/>
      </div>

      <div style={{marginBottom:20}}>
        {!adding ? (
          <button onClick={() => setAdding(true)}
            style={{background:`${G.cyan}18`,border:`1px solid ${G.cyan}40`,borderRadius:10,padding:'10px 20px',color:G.cyan,fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
            + Add Room
          </button>
        ) : (
          <Card style={{borderColor:`${G.cyan}40`}}>
            <CLabel color={G.cyan}>Add a Free Room</CLabel>
            <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:12}}>
              <input value={property} onChange={e=>setProperty(e.target.value)}
                placeholder="Property — e.g. 64 Coventry Road"
                style={{flex:'0 0 220px',background:G.card2,border:`1px solid ${G.border}`,borderRadius:10,padding:'12px 16px',color:G.text,fontSize:14,outline:'none',fontFamily:'inherit'}}/>
              <input value={name} onChange={e=>setName(e.target.value)}
                placeholder="Room — e.g. Flat 2A"
                style={{flex:'0 0 200px',background:G.card2,border:`1px solid ${G.border}`,borderRadius:10,padding:'12px 16px',color:G.text,fontSize:14,outline:'none',fontFamily:'inherit'}}/>
              <input value={desc} onChange={e=>setDesc(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addRoom()}
                placeholder="En-suite, double bed, move in 48hrs, top floor with a view..."
                style={{flex:1,minWidth:220,background:G.card2,border:`1px solid ${G.border}`,borderRadius:10,padding:'12px 16px',color:G.text,fontSize:14,outline:'none',fontFamily:'inherit'}}/>
            </div>
            <div style={{fontSize:11,color:G.dim,marginBottom:12}}>No need to mention UC/DSS or "no deposit" here — every property already qualifies, and every script already says so. Just describe what's actually different about this room. Property name groups rooms together so you can generate a full content set for one address at once.</div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={addRoom} disabled={!name.trim()||saveBusy}
                style={{background:!name.trim()||saveBusy?G.card2:G.cyan,border:'none',borderRadius:10,padding:'10px 20px',color:!name.trim()||saveBusy?G.muted:'#000',fontWeight:800,fontSize:13,cursor:!name.trim()||saveBusy?'not-allowed':'pointer',fontFamily:'inherit'}}>
                {saveBusy?'Adding...':'Add Room →'}
              </button>
              <button onClick={()=>{setAdding(false);setName('');setDesc('');setProperty('');}}
                style={{background:'transparent',border:`1px solid ${G.border}`,borderRadius:10,padding:'10px 18px',color:G.muted,fontSize:13,cursor:'pointer',fontFamily:'inherit'}}>Cancel</button>
            </div>
          </Card>
        )}
      </div>

      {busy && <div style={{color:G.muted,fontSize:13}}>Loading...</div>}
      {!busy && rooms.length===0 && (
        <Card><div style={{textAlign:'center',padding:'50px 20px'}}>
          <Brain s={52}/>
          <div style={{color:G.dim,fontSize:13,lineHeight:1.9,marginTop:20}}>
            No rooms tracked yet<br/>Add every room that's free right now — new ones any time, old ones fall off once filled
          </div>
        </div></Card>
      )}

      {properties.length > 0 && (
        <div style={{marginBottom:24}}>
          <CLabel color={G.purple}>Generate a Full Content Set for One Property</CLabel>
          {properties.map(p => {
            const roomCount = needsFilling.filter(r => r.property === p).length;
            const busyThis = !!packBusy[p];
            const result = packResult[p];
            return (
              <Card key={p} style={{marginBottom:10}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
                  <div>
                    <div style={{fontWeight:700,color:G.text,fontSize:14}}>{p}</div>
                    <div style={{color:G.muted,fontSize:12,marginTop:2}}>{roomCount} room{roomCount>1?'s':''} needing filling → 1 overview + {roomCount} mini script{roomCount>1?'s':''}</div>
                  </div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    {['tiktok','instagram'].map(pl=>(
                      <button key={pl} onClick={()=>setPackPlatform(prev=>({...prev,[p]:pl}))}
                        style={{background:(packPlatform[p]||'tiktok')===pl?`${G.cyan}18`:'transparent',border:`1px solid ${(packPlatform[p]||'tiktok')===pl?G.cyan:G.dim}`,borderRadius:20,padding:'4px 12px',fontSize:11,color:(packPlatform[p]||'tiktok')===pl?G.cyan:G.muted,cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize'}}>{pl}</button>
                    ))}
                    <button onClick={()=>generatePack(p)} disabled={busyThis}
                      style={{background:busyThis?G.card2:G.purple,border:'none',borderRadius:8,padding:'9px 16px',color:busyThis?G.muted:'#fff',fontWeight:800,fontSize:12,cursor:busyThis?'not-allowed':'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}}>
                      {busyThis?'Generating...':'Generate Pack →'}
                    </button>
                  </div>
                </div>
                {result && <div style={{marginTop:10,background:`${G.green}0a`,border:`1px solid ${G.green}22`,borderRadius:8,padding:'9px 14px',fontSize:12,color:G.green}}>{result} scripts generated — go to Script Vault → Pending Review to approve them.</div>}
              </Card>
            );
          })}
        </div>
      )}

      {needsFilling.length > 0 && (
        <div style={{marginBottom:20}}>
          <CLabel color={G.coral}>Needs Filling</CLabel>
          {needsFilling.map(r => (
            <Card key={r.id} style={{marginBottom:10,borderLeft:`3px solid ${G.coral}`,borderRadius:'0 12px 12px 0'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
                <div style={{flex:1}}>
                  {r.property && <div style={{color:G.muted,fontSize:11,marginBottom:2,textTransform:'uppercase',letterSpacing:1}}>{r.property}</div>}
                  <div style={{fontWeight:700,color:G.text,fontSize:14,marginBottom:5}}>{r.name}</div>
                  {r.description && <div style={{color:G.muted,fontSize:13,lineHeight:1.5}}>{r.description}</div>}
                </div>
                <div style={{display:'flex',gap:6,flexShrink:0}}>
                  <button onClick={()=>toggleStatus(r)}
                    style={{background:`${G.green}14`,border:`1px solid ${G.green}40`,borderRadius:7,padding:'6px 12px',color:G.green,fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Mark Filled</button>
                  <button onClick={()=>removeRoom(r)}
                    style={{background:'transparent',border:`1px solid ${G.dim}`,borderRadius:7,padding:'6px 10px',color:G.muted,fontSize:11,cursor:'pointer',fontFamily:'inherit'}}>×</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filled.length > 0 && (
        <div>
          <CLabel>Filled</CLabel>
          {filled.map(r => (
            <Card key={r.id} style={{marginBottom:10,opacity:.6}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
                <div style={{flex:1}}>
                  {r.property && <div style={{color:G.dim,fontSize:11,marginBottom:2,textTransform:'uppercase',letterSpacing:1}}>{r.property}</div>}
                  <div style={{fontWeight:700,color:'#888',fontSize:14,marginBottom:5}}>{r.name}</div>
                  {r.description && <div style={{color:G.dim,fontSize:13,lineHeight:1.5}}>{r.description}</div>}
                </div>
                <div style={{display:'flex',gap:6,flexShrink:0}}>
                  <button onClick={()=>toggleStatus(r)}
                    style={{background:'transparent',border:`1px solid ${G.dim}`,borderRadius:7,padding:'6px 12px',color:G.muted,fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Needs Filling Again</button>
                  <button onClick={()=>removeRoom(r)}
                    style={{background:'transparent',border:`1px solid ${G.dim}`,borderRadius:7,padding:'6px 10px',color:G.muted,fontSize:11,cursor:'pointer',fontFamily:'inherit'}}>×</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── CONTENT PLAN ───────────────────────────────────────────────────────── */
function ContentPlan({ onGoTo }) {
  const [trips, setTrips] = useState([]);
  const [busy, setBusy] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTarget, setNewTarget] = useState(4);
  const [saveBusy, setSaveBusy] = useState(false);
  const [activeTrip, setActiveTrip] = useState(null);

  const [allScripts, setAllScripts] = useState([]);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [roomsLoaded, setRoomsLoaded] = useState(false);
  const [customising, setCustomising] = useState({});

  // Match proposal state: array of { script, roomId }
  const [proposal, setProposal] = useState(null);
  const [manualMode, setManualMode] = useState(false);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState(null); // null = all properties
  const [completeBusy, setCompleteBusy] = useState(false);
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState(4);
  const [targetSaveBusy, setTargetSaveBusy] = useState(false);

  useEffect(() => { loadTrips(); loadScripts(); loadRooms(); }, []);

  async function loadTrips() {
    setBusy(true);
    try {
      const res = await fetch('/api/get-trips');
      const d = await res.json();
      const list = d.trips || [];
      setTrips(list);
      const today = new Date().toISOString().split('T')[0];
      const next = list.find(t => t.trip_date >= today);
      setActiveTrip(prev => prev ? (list.find(t => t.id === prev.id) || prev) : (next || null));
    } catch {}
    setBusy(false);
  }

  async function loadScripts() {
    try {
      const res = await fetch('/api/get-scripts?limit=100');
      const d = await res.json();
      setAllScripts(d.scripts || []);
    } catch {}
    setScriptsLoaded(true);
  }

  async function loadRooms() {
    try {
      const res = await fetch('/api/get-rooms');
      const d = await res.json();
      setRooms(d.rooms || []);
    } catch {}
    setRoomsLoaded(true);
  }

  async function createTrip() {
    if (!newDate) return;
    setSaveBusy(true);
    try {
      const res = await fetch('/api/create-trip', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripDate: newDate, scriptsTarget: newTarget }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed');
      setCreating(false);
      setNewDate(''); setNewTarget(4);
      await loadTrips();
      setActiveTrip(d.trip);
    } catch (e) { alert(e.message); }
    setSaveBusy(false);
  }

  async function toggleScript(script, tripId) {
    const alreadyAssigned = script.trip_id === tripId;
    await fetch('/api/assign-script-to-trip', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scriptId: script.id, tripId: alreadyAssigned ? null : tripId }),
    });
    await loadScripts();
    await loadTrips();
  }

  async function customiseScript(script, roomDescription) {
    setCustomising(prev => ({ ...prev, [script.id]: true }));
    try {
      const res = await fetch('/api/customise-script', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptId: script.id, roomDescription }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed');
      await loadTrips();
    } catch (e) { alert(e.message); }
    setCustomising(prev => { const n = { ...prev }; delete n[script.id]; return n; });
  }

  function roomLabel(room) { return `${room.name}${room.description ? ` — ${room.description}` : ''}`; }

  function buildProposal(scriptsNeeded, roomPool) {
    const availableScripts = unassignedScripts.slice(0, scriptsNeeded);
    const availableRooms = roomPool.slice(0, scriptsNeeded);
    const pairs = availableScripts.map((script, i) => ({ script, roomId: availableRooms[i]?.id || null }));
    setProposal(pairs);
    setManualMode(false);
  }

  async function saveTarget(trip) {
    const n = parseInt(targetInput);
    if (!n || n < 1) return;
    setTargetSaveBusy(true);
    try {
      const res = await fetch('/api/update-trip', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId: trip.id, scriptsTarget: n }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed');
      setEditingTarget(false);
      await loadTrips();
    } catch (e) { alert(e.message); }
    setTargetSaveBusy(false);
  }

  async function completeTrip(trip) {
    if (!confirm(`Mark ${new Date(trip.trip_date).toLocaleDateString('en-GB')} as complete? Any approved scripts you didn't film will go back into the pool for your next trip.`)) return;
    setCompleteBusy(true);
    try {
      const res = await fetch('/api/complete-trip', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId: trip.id }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed');
      await loadTrips(); await loadScripts();
      alert(d.releasedCount > 0 ? `Trip marked complete. ${d.releasedCount} unfilmed script${d.releasedCount>1?'s':''} released back to Approved.` : 'Trip marked complete.');
    } catch (e) { alert(e.message); }
    setCompleteBusy(false);
  }

  async function confirmProposal(trip) {
    if (!proposal) return;
    setConfirmBusy(true);
    try {
      for (const pair of proposal) {
        await fetch('/api/assign-script-to-trip', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scriptId: pair.script.id, tripId: trip.id }),
        });
        const room = rooms.find(r => r.id === pair.roomId);
        if (room) {
          await fetch('/api/customise-script', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scriptId: pair.script.id, roomDescription: roomLabel(room) }),
          });
        }
      }
      setProposal(null);
      await loadScripts(); await loadTrips();
    } catch (e) { alert(e.message); }
    setConfirmBusy(false);
  }

  const today = new Date().toISOString().split('T')[0];
  const trip = activeTrip ? trips.find(t => t.id === activeTrip.id) || activeTrip : null;
  const daysUntil = trip ? Math.ceil((new Date(trip.trip_date) - new Date()) / (1000 * 60 * 60 * 24)) : null;
  const assignedScripts = trip ? (trip.scripts || []) : [];
  const scriptsNeeded = trip ? Math.max(0, (trip.scripts_target || 4) - assignedScripts.length) : 0;
  // Property Pack scripts already have their room baked in from generation (property_note
  // set, body already written for that specific room) — they must NOT go through the
  // match engine, which would re-customise them onto an unrelated room and overwrite
  // correct content. They get their own "already property-specific" pool instead.
  const allUnassigned = allScripts.filter(s => !s.trip_id && s.status === 'unused');
  const preMatchedScripts = allUnassigned.filter(s => s.batch_id);
  const unassignedScripts = allUnassigned.filter(s => !s.batch_id);
  const needsFillingRooms = rooms.filter(r => r.status === 'needs_filling');
  const propertyOptions = [...new Set(needsFillingRooms.filter(r => r.property).map(r => r.property))];
  const activeProperties = selectedProperties === null ? propertyOptions : selectedProperties;
  const matchRoomPool = propertyOptions.length === 0 ? needsFillingRooms : needsFillingRooms.filter(r => !r.property || activeProperties.includes(r.property));
  const dataReady = scriptsLoaded && roomsLoaded;
  const enoughScripts = unassignedScripts.length >= scriptsNeeded;

  return (
    <div>
      {/* Trip selector / create */}
      <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:20,flexWrap:'wrap'}}>
        <div style={{fontSize:13,color:G.muted,fontWeight:700}}>Filming Trip:</div>
        {trips.filter(t => t.trip_date >= today && t.status !== 'completed').map(t => (
          <button key={t.id} onClick={() => { setActiveTrip(t); setProposal(null); setSelectedProperties(null); }}
            style={{background:activeTrip?.id===t.id?`${G.green}18`:'transparent',border:`1px solid ${activeTrip?.id===t.id?G.green:G.dim}`,borderRadius:20,padding:'5px 14px',fontSize:12,color:activeTrip?.id===t.id?G.green:G.muted,cursor:'pointer',fontFamily:'inherit'}}>
            {new Date(t.trip_date).toLocaleDateString('en-GB',{day:'numeric',month:'short'})} · {t.scripts?.length||0}/{t.scripts_target}
          </button>
        ))}
        <button onClick={() => setCreating(true)}
          style={{background:`${G.green}14`,border:`1px solid ${G.green}40`,borderRadius:20,padding:'5px 14px',fontSize:12,color:G.green,cursor:'pointer',fontFamily:'inherit',fontWeight:700}}>
          + New Trip
        </button>
      </div>

      {/* Create trip form — date + target ONLY, no rooms here */}
      {creating && (
        <Card style={{marginBottom:20,borderColor:`${G.green}40`}}>
          <CLabel color={G.green}>Schedule New Filming Trip</CLabel>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:16}}>
            <div>
              <div style={{fontSize:11,color:G.muted,marginBottom:5}}>Trip Date</div>
              <input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} min={today}
                style={{background:G.card2,border:`1px solid ${G.border}`,borderRadius:8,padding:'10px 14px',color:G.text,fontSize:14,outline:'none',fontFamily:'inherit'}}/>
            </div>
            <div>
              <div style={{fontSize:11,color:G.muted,marginBottom:5}}>Scripts Target</div>
              <div style={{display:'flex',gap:6,alignItems:'center'}}>
                {[2,3,4,5].map(n=>(
                  <button key={n} onClick={()=>setNewTarget(n)}
                    style={{background:newTarget===n?`${G.green}18`:'transparent',border:`1px solid ${newTarget===n?G.green:G.dim}`,borderRadius:8,padding:'8px 14px',color:newTarget===n?G.green:G.muted,cursor:'pointer',fontSize:13,fontWeight:700,fontFamily:'inherit'}}>{n}</button>
                ))}
                <input type="number" min="1" value={newTarget} onChange={e=>setNewTarget(parseInt(e.target.value)||1)}
                  style={{width:56,background:G.card2,border:`1px solid ${G.border}`,borderRadius:8,padding:'8px 10px',color:G.text,fontSize:13,fontWeight:700,outline:'none',fontFamily:'inherit',textAlign:'center'}}/>
              </div>
            </div>
          </div>
          <div style={{fontSize:11,color:G.dim,marginBottom:16}}>Rooms are managed separately in the Rooms tab — this trip will pull from whatever's marked "needs filling" when you're ready to match.</div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={createTrip} disabled={!newDate||saveBusy}
              style={{background:!newDate||saveBusy?G.card2:G.green,border:'none',borderRadius:8,padding:'10px 22px',color:!newDate||saveBusy?G.muted:'#000',fontWeight:800,fontSize:13,cursor:!newDate||saveBusy?'not-allowed':'pointer',fontFamily:'inherit'}}>
              {saveBusy?'Saving...':'Schedule Trip →'}
            </button>
            <button onClick={()=>setCreating(false)}
              style={{background:'transparent',border:`1px solid ${G.border}`,borderRadius:8,padding:'10px 18px',color:G.muted,fontSize:13,cursor:'pointer',fontFamily:'inherit'}}>Cancel</button>
          </div>
        </Card>
      )}

      {busy && <div style={{color:G.muted,fontSize:13}}>Loading...</div>}

      {!busy && !trip && !creating && (
        <Card>
          <div style={{textAlign:'center',padding:'50px 20px'}}>
            <Brain s={52}/>
            <div style={{color:G.dim,fontSize:13,lineHeight:1.9,marginTop:20,fontFamily:"'Nunito',sans-serif"}}>
              No filming trips scheduled yet<br/>
              Hit "New Trip" to plan your next Coventry visit
            </div>
          </div>
        </Card>
      )}

      {trip && (
        <>
          {/* Trip header */}
          <Card style={{marginBottom:16,borderColor:daysUntil<=3&&daysUntil>=0?`${G.coral}50`:G.border}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
              <div>
                <div style={{fontSize:18,fontWeight:800,color:G.text,marginBottom:4}}>
                  {new Date(trip.trip_date).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
                </div>
                <div style={{fontSize:13,color:G.muted}}>{trip.location || 'Coventry'}</div>
              </div>
              <div style={{display:'flex',gap:16,alignItems:'center'}}>
                <div style={{textAlign:'center'}}>
                  <div style={{fontFamily:"'Nunito',sans-serif",fontSize:32,fontWeight:900,color:daysUntil<=3&&daysUntil>=0?G.coral:daysUntil===0?G.gold:G.green,lineHeight:1}}>
                    {daysUntil < 0 ? '—' : daysUntil}
                  </div>
                  <div style={{fontSize:10,color:G.muted,textTransform:'uppercase',letterSpacing:1}}>
                    {daysUntil < 0 ? 'Past' : daysUntil === 0 ? 'Today' : 'Days left'}
                  </div>
                </div>
                <div style={{textAlign:'center'}}>
                  {!editingTarget ? (
                    <div style={{fontFamily:"'Nunito',sans-serif",fontSize:32,fontWeight:900,color:scriptsNeeded===0?G.green:G.gold,lineHeight:1,cursor:'pointer'}}
                      onClick={()=>{setTargetInput(trip.scripts_target);setEditingTarget(true);}} title="Click to change target">
                      {assignedScripts.length}/{trip.scripts_target}
                    </div>
                  ) : (
                    <div style={{display:'flex',gap:4,alignItems:'center'}}>
                      <input type="number" min="1" value={targetInput} onChange={e=>setTargetInput(e.target.value)}
                        onKeyDown={e=>e.key==='Enter'&&saveTarget(trip)}
                        style={{width:52,background:G.card2,border:`1px solid ${G.gold}`,borderRadius:6,padding:'4px 6px',color:G.text,fontSize:16,fontFamily:"'Nunito',sans-serif",fontWeight:800,textAlign:'center',outline:'none'}}/>
                      <button onClick={()=>saveTarget(trip)} disabled={targetSaveBusy}
                        style={{background:G.gold,border:'none',borderRadius:6,padding:'5px 8px',color:'#000',fontSize:11,fontWeight:800,cursor:'pointer',fontFamily:'inherit'}}>✓</button>
                      <button onClick={()=>setEditingTarget(false)}
                        style={{background:'transparent',border:`1px solid ${G.dim}`,borderRadius:6,padding:'5px 8px',color:G.muted,fontSize:11,cursor:'pointer',fontFamily:'inherit'}}>×</button>
                    </div>
                  )}
                  <div style={{fontSize:10,color:G.muted,textTransform:'uppercase',letterSpacing:1,marginTop:editingTarget?4:0}}>Scripts{!editingTarget && ' (click to edit)'}</div>
                </div>
              </div>
            </div>
            {scriptsNeeded === 0 && assignedScripts.length > 0 && (
              <div style={{marginTop:12,background:`${G.green}0a`,border:`1px solid ${G.green}22`,borderRadius:8,padding:'10px 14px',fontSize:13,color:G.green}}>
                All scripts selected — you're ready to film.
              </div>
            )}
            {trip.status !== 'completed' && (
              <div style={{marginTop:12}}>
                <button onClick={()=>completeTrip(trip)} disabled={completeBusy}
                  style={{background:'transparent',border:`1px solid ${G.dim}`,borderRadius:8,padding:'8px 16px',color:G.muted,fontSize:12,fontWeight:700,cursor:completeBusy?'not-allowed':'pointer',fontFamily:'inherit'}}>
                  {completeBusy?'Completing...':'Mark Trip Complete →'}
                </button>
              </div>
            )}
            {trip.status === 'completed' && (
              <div style={{marginTop:12,background:`${G.dim}20`,borderRadius:8,padding:'8px 14px',fontSize:12,color:G.muted,display:'inline-block'}}>✓ Trip Complete</div>
            )}
          </Card>

          {/* Scripts already assigned */}
          {assignedScripts.length > 0 && (
            <div style={{marginBottom:16}}>
              <CLabel color={G.purple}>Selected Scripts for This Trip</CLabel>
              {assignedScripts.map((s,i) => (
                <Card key={s.id} style={{marginBottom:10,borderLeft:`3px solid ${G.purple}`,borderRadius:'0 12px 12px 0'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                    <div style={{fontWeight:700,color:G.text,fontSize:14}}>{s.title}</div>
                    <button onClick={()=>toggleScript(s, trip.id)}
                      style={{background:'transparent',border:`1px solid ${G.dim}`,borderRadius:7,padding:'3px 10px',color:G.muted,cursor:'pointer',fontSize:11,fontFamily:'inherit'}}>Remove</button>
                  </div>
                  <div style={{background:`${G.coral}0e`,border:`1px solid ${G.coral}20`,borderRadius:7,padding:'9px 12px',fontSize:13,color:'#ddd',fontStyle:'italic',marginBottom:10}}>"{s.hook}"</div>
                  <div style={{color:'#888',fontSize:13,lineHeight:1.7,marginBottom:12}}>{s.body}</div>
                  {s.property_note ? (
                    <div style={{background:`${G.green}0a`,border:`1px solid ${G.green}22`,borderRadius:8,padding:'9px 12px',fontSize:12,color:G.green}}>
                      Filmed in: {s.property_note}
                    </div>
                  ) : needsFillingRooms.length > 0 ? (
                    <div>
                      <div style={{fontSize:11,color:G.muted,marginBottom:6}}>Assign a room to customise this script with Claude:</div>
                      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                        {needsFillingRooms.map((room,ri) => (
                          <button key={ri} onClick={()=>customiseScript(s, roomLabel(room))}
                            disabled={!!customising[s.id]}
                            style={{background:customising[s.id]?G.card2:`${G.cyan}14`,border:`1px solid ${customising[s.id]?G.border:`${G.cyan}40`}`,borderRadius:8,padding:'6px 12px',color:customising[s.id]?G.muted:G.cyan,cursor:customising[s.id]?'not-allowed':'pointer',fontSize:11,fontFamily:'inherit'}}>
                            {customising[s.id]?'Customising...':room.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{fontSize:11,color:G.dim}}>No rooms marked "needs filling" — add one in the Rooms tab.</div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Property Pack scripts — already have their room baked in, just add directly */}
          {scriptsNeeded > 0 && preMatchedScripts.length > 0 && (
            <div style={{marginBottom:16}}>
              <CLabel color={G.purple}>Property-Specific Scripts — Already Matched, Ready to Add</CLabel>
              {preMatchedScripts.map(s => (
                <Card key={s.id} style={{marginBottom:10,cursor:'pointer',borderLeft:`3px solid ${G.purple}`,borderRadius:'0 12px 12px 0'}} onClick={()=>toggleScript(s,trip.id)}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,color:G.text,fontSize:13,marginBottom:4}}>{s.title}</div>
                      {s.property_note && <div style={{color:G.purple,fontSize:11,marginBottom:6}}>{s.property_note}</div>}
                      <div style={{color:'#777',fontSize:12,lineHeight:1.6}}>{s.body?.slice(0,140)}{s.body?.length>140?'...':''}</div>
                    </div>
                    <button style={{background:`${G.purple}14`,border:`1px solid ${G.purple}40`,borderRadius:8,padding:'7px 14px',color:G.purple,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit',flexShrink:0}}>Add →</button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Match engine */}
          {scriptsNeeded > 0 && dataReady && !proposal && (
            <Card style={{marginBottom:16,borderColor:`${G.gold}30`}}>
              <CLabel color={G.gold}>Fill the Remaining {scriptsNeeded} Script{scriptsNeeded>1?'s':''}</CLabel>
              {!enoughScripts ? (
                <div>
                  <div style={{fontSize:14,color:G.coral,lineHeight:1.7,marginBottom:14}}>
                    You only have <strong>{unassignedScripts.length}</strong> unused script{unassignedScripts.length===1?'':'s'} in the vault — you need <strong>{scriptsNeeded - unassignedScripts.length} more</strong> before this trip is fully planned.
                  </div>
                  <button onClick={()=>onGoTo && onGoTo('comp')}
                    style={{background:`${G.coral}14`,border:`1px solid ${G.coral}40`,borderRadius:8,padding:'9px 18px',color:G.coral,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                    Go Analyse More Videos →
                  </button>
                </div>
              ) : (
                <div>
                  {propertyOptions.length > 1 && (
                    <div style={{marginBottom:14}}>
                      <div style={{fontSize:11,color:G.muted,marginBottom:8}}>Only film at these properties this trip:</div>
                      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                        {propertyOptions.map(p => {
                          const on = activeProperties.includes(p);
                          return (
                            <button key={p} onClick={()=>{
                              const next = on ? activeProperties.filter(x=>x!==p) : [...activeProperties, p];
                              setSelectedProperties(next.length === propertyOptions.length ? null : next);
                            }} style={{background:on?`${G.purple}18`:'transparent',border:`1px solid ${on?G.purple:G.dim}`,borderRadius:20,padding:'5px 13px',fontSize:11,color:on?G.purple:G.dim,cursor:'pointer',fontFamily:'inherit'}}>
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div style={{fontSize:14,color:'#ccc',lineHeight:1.7,marginBottom:14}}>
                    I have <strong style={{color:G.gold}}>{unassignedScripts.length}</strong> unused scripts ready, and{' '}
                    <strong style={{color:G.coral}}>{matchRoomPool.length}</strong> room{matchRoomPool.length===1?'':'s'} marked as needing filling{propertyOptions.length>1 && activeProperties.length<propertyOptions.length ? ' at the properties you picked' : ''}.
                    Shall I match {scriptsNeeded} of them, or would you like to pick specific pairings yourself?
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>buildProposal(scriptsNeeded, matchRoomPool)}
                      style={{background:G.gold,border:'none',borderRadius:8,padding:'9px 18px',color:'#000',fontWeight:800,fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>
                      Auto-Match {scriptsNeeded} →
                    </button>
                    <button onClick={()=>setManualMode(true)}
                      style={{background:'transparent',border:`1px solid ${G.border}`,borderRadius:8,padding:'9px 16px',color:G.muted,fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>
                      I'll Pick Manually
                    </button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Proposal review — swap pairings before confirming */}
          {proposal && (
            <Card style={{marginBottom:16,borderColor:`${G.gold}40`}}>
              <CLabel color={G.gold}>Review the Match</CLabel>
              {proposal.map((pair, i) => (
                <div key={pair.script.id} style={{display:'flex',alignItems:'center',gap:12,background:G.card2,borderRadius:10,padding:'12px 14px',marginBottom:8,flexWrap:'wrap'}}>
                  <div style={{flex:1,minWidth:180,fontSize:13,fontWeight:700,color:G.text}}>{pair.script.title}</div>
                  <span style={{color:G.dim,fontSize:16}}>→</span>
                  <select value={pair.roomId || ''} onChange={e => {
                    const updated = [...proposal]; updated[i] = { ...pair, roomId: e.target.value || null }; setProposal(updated);
                  }} style={{background:G.card,border:`1px solid ${G.border}`,borderRadius:8,padding:'8px 12px',color:G.text,fontSize:12,outline:'none',fontFamily:'inherit',minWidth:200}}>
                    <option value="">No room assigned</option>
                    {matchRoomPool.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
                  </select>
                </div>
              ))}
              <div style={{display:'flex',gap:8,marginTop:12}}>
                <button onClick={()=>confirmProposal(trip)} disabled={confirmBusy}
                  style={{background:confirmBusy?G.card2:G.green,border:'none',borderRadius:8,padding:'10px 20px',color:confirmBusy?G.muted:'#000',fontWeight:800,fontSize:13,cursor:confirmBusy?'not-allowed':'pointer',fontFamily:'inherit'}}>
                  {confirmBusy?'Matching & Customising...':'Confirm & Customise All →'}
                </button>
                <button onClick={()=>setProposal(null)} disabled={confirmBusy}
                  style={{background:'transparent',border:`1px solid ${G.border}`,borderRadius:8,padding:'10px 18px',color:G.muted,fontSize:13,cursor:'pointer',fontFamily:'inherit'}}>Cancel</button>
              </div>
            </Card>
          )}

          {/* Manual picker fallback */}
          {manualMode && scriptsNeeded > 0 && (
            <div>
              <CLabel color={G.gold}>Pick Scripts from Your Vault</CLabel>
              {unassignedScripts.length === 0 && (
                <div style={{color:G.dim,fontSize:13,textAlign:'center',padding:'30px 0'}}>No unused scripts left to pick.</div>
              )}
              {unassignedScripts.map(s => (
                <Card key={s.id} style={{marginBottom:10,cursor:'pointer',borderColor:G.border}} onClick={()=>toggleScript(s,trip.id)}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,color:G.text,fontSize:13,marginBottom:6}}>{s.title}</div>
                      <div style={{background:`${G.coral}0e`,border:`1px solid ${G.coral}20`,borderRadius:6,padding:'8px 11px',fontSize:13,color:'#ddd',fontStyle:'italic',marginBottom:8}}>"{s.hook}"</div>
                      <div style={{color:'#777',fontSize:12,lineHeight:1.6}}>{s.body?.slice(0,180)}{s.body?.length>180?'...':''}</div>
                    </div>
                    <button style={{background:`${G.gold}14`,border:`1px solid ${G.gold}40`,borderRadius:8,padding:'7px 14px',color:G.gold,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'inherit',flexShrink:0}}>
                      Add →
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Past trips */}
      {trips.filter(t => t.trip_date < today || t.status === 'completed').length > 0 && (
        <div style={{marginTop:28}}>
          <CLabel>Past Trips</CLabel>
          {trips.filter(t=>t.trip_date<today || t.status==='completed').map(t=>(
            <div key={t.id} style={{background:G.card2,borderRadius:10,padding:'12px 16px',marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:'#888'}}>{new Date(t.trip_date).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})} {t.status==='completed' && <span style={{color:G.green,fontSize:11}}>· Complete</span>}</div>
                <div style={{fontSize:11,color:G.dim,marginTop:2}}>{t.scripts?.length||0} scripts · {t.location||'Coventry'}</div>
              </div>
              <button onClick={()=>{setActiveTrip(t);setProposal(null);setSelectedProperties(null);}} style={{background:'transparent',border:`1px solid ${G.dim}`,borderRadius:7,padding:'4px 12px',color:G.muted,cursor:'pointer',fontSize:11,fontFamily:'inherit'}}>View</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── INTELLIGENCE ───────────────────────────────────────────────────────── */
function Intelligence() {
  const [intel, setIntel] = useState(null);
  const [doneCount, setDoneCount] = useState(0);
  const [busy, setBusy] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setBusy(true);
    try {
      const res = await fetch('/api/get-intelligence');
      const d = await res.json();
      setIntel(d.intelligence);
      setDoneCount(d.doneAnalysesCount || 0);
    } catch {}
    setBusy(false);
  }

  async function refresh() {
    setErr(''); setRefreshing(true);
    try {
      const res = await fetch('/api/generate-intelligence', { method: 'POST' });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to start');
      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 3000));
        const r2 = await fetch('/api/get-intelligence');
        const d2 = await r2.json();
        if (d2.intelligence?.status === 'done') { setIntel(d2.intelligence); setDoneCount(d2.doneAnalysesCount||0); break; }
        if (d2.intelligence?.status === 'failed') throw new Error('Intelligence generation failed — try again');
      }
    } catch (e) { setErr(e.message); }
    setRefreshing(false);
  }

  const playbook = intel?.playbook;
  const isGenerating = intel?.status === 'generating' || refreshing;

  return (
    <div>
      <Card style={{marginBottom:20,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:14}}>
        <div>
          <div style={{fontSize:13,color:G.muted}}>
            {playbook ? `Built from ${intel.analyses_count} analyses · last refreshed ${new Date(intel.generated_at).toLocaleDateString('en-GB')}` : `${doneCount} completed analyses available`}
          </div>
          {doneCount < 3 && <div style={{color:G.coral,fontSize:12,marginTop:6}}>Need at least 3 completed analyses to build a playbook — analyse {3-doneCount} more video{3-doneCount===1?'':'s'}.</div>}
        </div>
        <button onClick={refresh} disabled={isGenerating || doneCount < 3}
          style={{background:isGenerating||doneCount<3?G.card2:G.gold,border:'none',borderRadius:10,padding:'11px 22px',color:isGenerating||doneCount<3?G.muted:'#000',fontWeight:800,fontSize:13,cursor:isGenerating||doneCount<3?'not-allowed':'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}}>
          {isGenerating ? 'Analysing the analyses...' : playbook ? 'Refresh Intelligence →' : 'Build Playbook →'}
        </button>
      </Card>

      {err && <div style={{color:G.coral,fontSize:13,marginBottom:16}}>⚠ {err}</div>}
      {busy && <div style={{color:G.muted,fontSize:13}}>Loading...</div>}

      {!busy && !playbook && !isGenerating && (
        <Card><div style={{textAlign:'center',padding:'50px 20px'}}>
          <Brain s={52}/>
          <div style={{color:G.dim,fontSize:13,lineHeight:1.9,marginTop:20}}>
            No playbook built yet<br/>Analyse a few videos, then hit "Build Playbook" to find the patterns
          </div>
        </div></Card>
      )}

      {playbook && (
        <>
          <Card style={{marginBottom:16}}>
            <CLabel color={G.gold}>Overview</CLabel>
            <div style={{color:'#ccc',fontSize:14,lineHeight:1.8}}>{playbook.summary}</div>
          </Card>

          <Card style={{marginBottom:16}}>
            <CLabel color={G.cyan}>Top Hook Formulas</CLabel>
            {(playbook.topHookFormulas||[]).map((h,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:G.card2,borderRadius:8,padding:'11px 14px',marginBottom:8,gap:12}}>
                <div style={{color:'#ddd',fontSize:13,flex:1}}>{h.formula}</div>
                <div style={{display:'flex',gap:10,flexShrink:0}}>
                  <span style={{fontSize:11,color:G.muted}}>{h.frequency}x used</span>
                  <span style={{fontFamily:"'Nunito',sans-serif",fontWeight:800,color:G.gold,fontSize:14}}>{h.avgViralScore}/10</span>
                </div>
              </div>
            ))}
          </Card>

          <Card style={{marginBottom:16}}>
            <CLabel color={G.green}>Emotion Breakdown</CLabel>
            <div style={{background:`${G.green}0a`,border:`1px solid ${G.green}22`,borderRadius:8,padding:'11px 14px',marginBottom:12,fontSize:13,color:G.green}}>
              Best performing emotion: <strong>{playbook.bestEmotion}</strong>
            </div>
            {(playbook.emotionBreakdown||[]).map((e,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',background:G.card2,borderRadius:8,padding:'10px 14px',marginBottom:6}}>
                <span style={{color:'#ccc',fontSize:13}}>{e.emotion}</span>
                <span style={{color:G.muted,fontSize:12}}>{e.count} videos · avg {e.avgViralScore}/10</span>
              </div>
            ))}
          </Card>

          {playbook.platformInsights && (
            <Card style={{marginBottom:16}}>
              <CLabel color={G.purple}>Platform Insights</CLabel>
              <div style={{color:'#ccc',fontSize:14,lineHeight:1.8}}>{playbook.platformInsights}</div>
            </Card>
          )}

          <Card style={{marginBottom:16}}>
            <CLabel color={G.gold}>Recommendations</CLabel>
            {(playbook.recommendations||[]).map((r,i)=>(
              <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'10px 0',borderBottom:i<playbook.recommendations.length-1?`1px solid ${G.border}`:'none'}}>
                <span style={{fontFamily:"'Nunito',sans-serif",fontSize:11,color:G.gold,flexShrink:0}}>{String(i+1).padStart(2,'0')}</span>
                <div style={{color:'#ccc',fontSize:13,lineHeight:1.6}}>{r}</div>
              </div>
            ))}
          </Card>

          {playbook.recurringWarnings?.length > 0 && (
            <Card style={{borderLeft:`3px solid ${G.coral}`,borderRadius:'0 12px 12px 0'}}>
              <CLabel color={G.coral}>Recurring Warning Signals</CLabel>
              {playbook.recurringWarnings.map((w,i)=>(
                <div key={i} style={{display:'flex',gap:10,padding:'8px 0'}}>
                  <span style={{color:G.coral}}>⚠</span>
                  <div style={{color:'#999',fontSize:13,lineHeight:1.5}}>{w}</div>
                </div>
              ))}
            </Card>
          )}
        </>
      )}
    </div>
  );
}

/* ─── PLACEHOLDERS ───────────────────────────────────────────────────────── */
function Placeholder({ color, label, desc }) {
  return (
    <Card>
      <div style={{textAlign:"center",padding:"40px 20px"}}>
        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:11,color:`${color}80`,textTransform:"uppercase",letterSpacing:"2px",marginBottom:20}}>// reconexus — {label}</div>
        <Brain s={52}/>
        <div style={{color:G.dim,fontSize:13,lineHeight:1.9,marginTop:20,fontFamily:"'Nunito',sans-serif"}}>{desc}</div>
      </div>
    </Card>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────────────────── */
const PAGE_META = {
  home:    { title:"Dashboard",             sub:new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"}) },
  analyse: { title:"Analyse a Video",       sub:"Paste any viral TikTok or Instagram URL" },
  plan:    { title:"Content Plan",          sub:"Schedule filming trips · pick scripts · customise for each room" },
  rooms:   { title:"Rooms",                 sub:"Every room that's free right now — feeds the trip matching engine" },
  channel: { title:"My Channel",            sub:"@allianzhousinguk — performance overview" },
  intel:   { title:"Reconexus Intelligence",sub:"Pattern memory — learns from every video you analyse" },
  comp:    { title:"Competitors",           sub:"Track and reverse-engineer competitor accounts" },
  vault:   { title:"Script Vault",          sub:"Every script ever generated — ready to film" },
  chat:    { title:"Chat with Reconexus",   sub:"Your AI content strategist — ask it anything" },
};

export default function App() {
  const [sec, setSec] = useState("home");
  const meta = PAGE_META[sec];

  return (
    <div style={{background:G.bg,minHeight:"100vh",display:"flex",fontFamily:"'Nunito',sans-serif",color:G.text}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;font-family:'Nunito',sans-serif;}
        input::placeholder{color:${G.dim};}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.5);}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
        ::-webkit-scrollbar{width:4px;background:${G.bg};}
        ::-webkit-scrollbar-thumb{background:${G.dim};border-radius:2px;}
      `}</style>

      <Sidebar cur={sec} go={setSec}/>

      <div style={{marginLeft:240,flex:1,display:"flex",flexDirection:"column",minHeight:"100vh"}}>
        <Header title={meta.title} sub={meta.sub}/>
        <main style={{padding:"24px 32px 60px",flex:1}}>
          {sec==="home"    && <Home onGoToPlan={()=>setSec("plan")}/>}
          {sec==="analyse" && <Analyse/>}
          {sec==="plan"    && <ContentPlan onGoTo={setSec}/>}
          {sec==="rooms"   && <Rooms/>}
          {sec==="channel" && <Placeholder color={G.green}  label="my channel"   desc={"Coming next build\nWill scrape @allianzhousinguk and score your last 30 videos"}/>}
          {sec==="intel"   && <Intelligence/>}
          {sec==="comp"    && <Competitors/>}
          {sec==="vault"   && <Vault/>}
          {sec==="chat"    && <ChatReconexus/>}
        </main>
      </div>
    </div>
  );
}
