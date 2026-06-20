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

/* ─── DASHBOARD HOME ─────────────────────────────────────────────────────── */
const WDAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function Home() {
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
      while (att<40) {
        await new Promise(r=>setTimeout(r,5000));
        const r = await fetch("/api/result",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId,datasetId,platform:plat,url:cu})});
        const rd = await r.json();
        if (!r.ok) throw new Error(rd.error||"Analysis failed");
        if (!rd.pending) { setPhase("analysing"); await new Promise(r=>setTimeout(r,500)); setVd(rd.videoData); setAn(rd.analysis); setPhase("done"); break; }
        att++;
      }
      if (att>=40) throw new Error("Timed out — scraper took too long");
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
function Vault() {
  const [scripts,setScripts]=useState([]);
  const [busy,setBusy]=useState(true);
  const [filter,setFilter]=useState("all");

  useEffect(()=>{
    setBusy(true);
    const q=filter!=="all"?`?status=${filter}`:"";
    fetch(`/api/get-scripts${q}`).then(r=>r.json())
      .then(d=>{setScripts(d.scripts||[]);setBusy(false);}).catch(()=>setBusy(false));
  },[filter]);

  async function markUsed(id) {
    await fetch("/api/update-script",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({scriptId:id,status:"used"})});
    setScripts(prev=>prev.map(s=>s.id===id?{...s,status:"used"}:s));
  }

  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {["all","unused","used"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?`${G.purple}18`:"transparent",border:`1px solid ${filter===f?G.purple:G.dim}`,borderRadius:20,padding:"6px 16px",fontSize:12,color:filter===f?G.purple:G.muted,cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize"}}>{f}</button>
        ))}
      </div>
      {busy && <div style={{color:G.muted,fontSize:13}}>Loading...</div>}
      {!busy && scripts.length===0 && <div style={{color:G.dim,fontSize:13,textAlign:"center",padding:"50px 0",fontFamily:"'Nunito',sans-serif"}}>no scripts yet — analyse a viral video to generate scripts</div>}
      {scripts.map(s=>(
        <Card key={s.id} style={{marginBottom:12,borderLeft:`3px solid ${s.status==="used"?G.dim:G.purple}`,borderRadius:"0 12px 12px 0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div style={{color:s.status==="used"?"#444":G.text,fontWeight:700,fontSize:14}}>{s.title}</div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0,marginLeft:12}}>
              <span style={{fontSize:10,padding:"3px 8px",borderRadius:10,border:`1px solid ${s.status==="used"?G.dim:`${G.purple}40`}`,color:s.status==="used"?"#333":G.purple,textTransform:"uppercase",letterSpacing:1}}>{s.status}</span>
              {s.status==="unused" && <button onClick={()=>markUsed(s.id)} style={{background:`${G.purple}15`,border:`1px solid ${G.purple}40`,borderRadius:7,padding:"4px 11px",fontSize:11,color:G.purple,cursor:"pointer",fontFamily:"inherit"}}>Mark Used</button>}
            </div>
          </div>
          <div style={{background:`${G.coral}0e`,border:`1px solid ${G.coral}20`,borderRadius:7,padding:"10px 13px",marginBottom:8,color:"#ddd",fontSize:14,fontStyle:"italic"}}>"{s.hook}"</div>
          <div style={{color:"#888",fontSize:13,lineHeight:1.7,marginBottom:8}}>{s.body}</div>
          <div style={{color:G.green,fontSize:12,fontWeight:700}}>{s.cta}</div>
          {s.why && <div style={{color:"#333",fontSize:11,borderTop:`1px solid ${G.border}`,paddingTop:8,marginTop:8}}>{s.why}</div>}
        </Card>
      ))}
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
function Competitors() {
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
        if (!res.ok) break;
        if (!d.pending) {
          setScraping(prev => { const n={...prev}; delete n[competitorId]; return n; });
          await load();
          if (selected && selected.id === competitorId) {
            setVideos(d.videos || []);
          }
          return;
        }
      } catch {}
    }
    setScraping(prev => { const n={...prev}; delete n[competitorId]; return n; });
  }

  async function openCompetitor(c) {
    setSelected(c); setVideos([]);
    setVideosBusy(true);
    try {
      const res = await fetch(`/api/get-competitor-videos?competitorId=${c.id}`);
      const d = await res.json();
      setVideos(d.videos || []);
    } catch {}
    setVideosBusy(false);
  }

  /* ── Detail view ── */
  if (selected) {
    const isScraping = !!scraping[selected.id];
    return (
      <div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap',gap:10}}>
          <button onClick={() => setSelected(null)} style={{background:'transparent',border:`1px solid ${G.border}`,borderRadius:8,padding:'7px 14px',color:G.muted,cursor:'pointer',fontSize:12,fontFamily:'inherit'}}>
            ← Back
          </button>
          <div style={{flex:1,minWidth:160}}>
            <div style={{fontSize:20,fontWeight:800,color:G.text}}>{selected.handle}</div>
            <div style={{fontSize:12,color:G.muted,marginTop:2,textTransform:'capitalize'}}>{selected.platform} · {videos.length} videos</div>
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
          </div>
        </div>

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
                {vd.url&&<a href={vd.url} target="_blank" rel="noopener noreferrer"
                  style={{color:G.muted,fontSize:11,border:`1px solid ${G.border}`,borderRadius:7,padding:'5px 10px',textDecoration:'none',flexShrink:0,whiteSpace:'nowrap'}}>View →</a>}
              </div>
            </Card>
          );
        })}
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
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
        ::-webkit-scrollbar{width:4px;background:${G.bg};}
        ::-webkit-scrollbar-thumb{background:${G.dim};border-radius:2px;}
      `}</style>

      <Sidebar cur={sec} go={setSec}/>

      <div style={{marginLeft:240,flex:1,display:"flex",flexDirection:"column",minHeight:"100vh"}}>
        <Header title={meta.title} sub={meta.sub}/>
        <main style={{padding:"24px 32px 60px",flex:1}}>
          {sec==="home"    && <Home/>}
          {sec==="analyse" && <Analyse/>}
          {sec==="channel" && <Placeholder color={G.green}  label="my channel"   desc={"Coming next build\nWill scrape @allianzhousinguk and score your last 30 videos"}/>}
          {sec==="intel"   && <Placeholder color={G.gold}   label="intelligence" desc={"Reconexus builds pattern memory from every video you analyse\nAnalyse more videos to feed the engine"}/>}
          {sec==="comp"    && <Competitors/>}
          {sec==="vault"   && <Vault/>}
          {sec==="chat"    && <ChatReconexus/>}
        </main>
      </div>
    </div>
  );
}
