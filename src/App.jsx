import { useState, useEffect } from "react";

const GOLD   = "#FFB800";
const CYAN   = "#00C8FF";
const GREEN  = "#00FF88";
const CORAL  = "#FF4466";
const PURPLE = "#AA44FF";
const BG     = "#0a0a08";
const BG2    = "#111109";
const BG3    = "#161614";
const BORDER = "#1e1e1c";

const TABS = [
  { id: "analyse",      label: "Analyse",      color: CYAN   },
  { id: "channel",      label: "My Channel",   color: GREEN  },
  { id: "intelligence", label: "Intelligence", color: GOLD   },
  { id: "competitors",  label: "Competitors",  color: CORAL  },
  { id: "vault",        label: "Script Vault", color: PURPLE },
];

function ReconexusLogo({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4C10.5 4 6.5 8.2 6.5 13.2c0 2.2.8 4.2 2.2 5.8V22.5h14.6V19c1.4-1.6 2.2-3.6 2.2-5.8C25.5 8.2 21.5 4 16 4z" stroke={GOLD} strokeWidth="1.2" fill="none"/>
      <path d="M9 22.5h14v1.8H9z" fill={GOLD} opacity="0.15"/>
      <polygon points="16,5.5 17.2,7.8 16,10.1 14.8,7.8" fill={GOLD} opacity="0.95"/>
      <polygon points="7.5,13 9,14.8 7.5,16.6 6,14.8" fill={GOLD} opacity="0.7"/>
      <polygon points="24.5,13 26,14.8 24.5,16.6 23,14.8" fill={GOLD} opacity="0.7"/>
      <polygon points="11.5,18.5 12.8,20 11.5,21.5 10.2,20" fill={GOLD} opacity="0.6"/>
      <polygon points="20.5,18.5 21.8,20 20.5,21.5 19.2,20" fill={GOLD} opacity="0.6"/>
      <polygon points="16,13.5 17,15 16,16.5 15,15" fill="#fff" opacity="0.9"/>
      <line x1="16" y1="10.1" x2="16" y2="13.5" stroke={GOLD} strokeWidth="0.7" opacity="0.45"/>
      <line x1="9" y1="14.8" x2="15" y2="15" stroke={GOLD} strokeWidth="0.7" opacity="0.35"/>
      <line x1="23" y1="14.8" x2="17" y2="15" stroke={GOLD} strokeWidth="0.7" opacity="0.35"/>
      <line x1="12.8" y1="20" x2="15" y2="15" stroke={GOLD} strokeWidth="0.7" opacity="0.35"/>
      <line x1="19.2" y1="20" x2="17" y2="15" stroke={GOLD} strokeWidth="0.7" opacity="0.35"/>
      <line x1="14.8" y1="7.8" x2="9" y2="14.8" stroke={GOLD} strokeWidth="0.5" opacity="0.2"/>
      <line x1="17.2" y1="7.8" x2="23" y2="14.8" stroke={GOLD} strokeWidth="0.5" opacity="0.2"/>
    </svg>
  );
}

function Mono({ children, size = 13, color = "#fff", style = {} }) {
  return (
    <span style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: size, color, ...style }}>
      {children}
    </span>
  );
}

function Eyebrow({ label, color }) {
  return (
    <div style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 10, color: color + "99", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 14 }}>
      // reconexus — {label}
    </div>
  );
}

function Card({ children, accent, style = {} }) {
  return (
    <div style={{
      background: BG2, border: `1px solid ${BORDER}`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: "0 10px 10px 0",
      padding: "18px 20px", marginBottom: 12, ...style,
    }}>
      {children}
    </div>
  );
}

function StatTile({ label, value, color }) {
  return (
    <div style={{
      background: BG3, border: `1px solid ${BORDER}`,
      borderTop: `2px solid ${color}`,
      borderRadius: "0 0 8px 8px",
      padding: "16px 12px", flex: 1, minWidth: 80, textAlign: "center",
    }}>
      <div style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 22, fontWeight: 900, color, letterSpacing: "-1px" }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      <div style={{ color: "#444", fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function ScoreBar({ label, score, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ color: "#777", fontSize: 12 }}>{label}</span>
        <Mono size={12} color={color}>{score}/10</Mono>
      </div>
      <div style={{ background: "#1a1a18", borderRadius: 3, height: 4, overflow: "hidden" }}>
        <div style={{ width: `${score * 10}%`, height: "100%", background: `linear-gradient(90deg, ${color}50, ${color})`, borderRadius: 3 }} />
      </div>
    </div>
  );
}

const PHASES    = [{ key: "scraping", label: "Scraping video" }, { key: "analysing", label: "Running AI" }, { key: "done", label: "Complete" }];
const PHASE_ORD = ["scraping", "analysing", "done"];

function AnalyseTab() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [videoData, setVideoData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  async function analyse() {
    if (!url.trim()) { setError("Paste a TikTok or Instagram URL first."); return; }
    if (!url.includes("tiktok.com") && !url.includes("instagram.com")) {
      setError("Only TikTok and Instagram URLs are supported."); return;
    }
    setError(""); setLoading(true); setVideoData(null); setAnalysis(null); setPhase("scraping");
    try {
      const startRes  = await fetch("/api/analyse", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const startData = await startRes.json();
      if (!startRes.ok) throw new Error(startData.error || "Failed to start analysis");
      const { runId, datasetId, platform: plat, url: cleanUrl } = startData;
      let attempts = 0;
      while (attempts < 40) {
        await new Promise(r => setTimeout(r, 5000));
        const res  = await fetch("/api/result", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ runId, datasetId, platform: plat, url: cleanUrl }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Analysis failed");
        if (!data.pending) {
          setPhase("analysing"); await new Promise(r => setTimeout(r, 600));
          setVideoData(data.videoData); setAnalysis(data.analysis); setPhase("done"); break;
        }
        attempts++;
      }
      if (attempts >= 40) throw new Error("Timed out — scraper took too long");
    } catch (err) { setError(err.message); setPhase("idle"); }
    setLoading(false);
  }

  return (
    <div>
      <Eyebrow label="analyse" color={CYAN} />

      {/* Input */}
      <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderTop: `2px solid ${CYAN}`, borderRadius: "0 0 12px 12px", padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && analyse()}
            placeholder="paste tiktok or instagram url..."
            style={{ flex: 1, minWidth: 200, background: BG3, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }}
          />
          <button onClick={analyse} disabled={loading}
            style={{ background: loading ? BG3 : GOLD, border: "none", borderRadius: 8, padding: "12px 24px", color: loading ? "#444" : "#000", fontWeight: 800, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}
          >{loading ? "Analysing..." : "Analyse →"}</button>
        </div>
        {error && <div style={{ color: CORAL, fontSize: 12, marginTop: 10, fontFamily: "'Courier New', monospace" }}>⚠ {error}</div>}
        {loading && (
          <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            {PHASES.map(p => {
              const ci = PHASE_ORD.indexOf(phase), ti = PHASE_ORD.indexOf(p.key);
              const isActive = p.key === phase, isDone = ti < ci;
              return (
                <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, background: isActive ? `${CYAN}12` : BG3, border: `1px solid ${isActive ? CYAN : BORDER}`, fontSize: 11, color: isActive ? CYAN : isDone ? "#333" : "#2a2a28", fontFamily: "'Courier New', monospace" }}>
                  {isActive && <span style={{ width: 6, height: 6, borderRadius: "50%", background: CYAN, display: "inline-block", animation: "pulse 1s infinite" }} />}
                  {isDone ? "✓ " : ""}{p.label}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Metrics */}
      {videoData && (
        <div style={{ marginBottom: 20 }}>
          <Mono size={10} color={CYAN} style={{ textTransform: "uppercase", letterSpacing: 2, display: "block", marginBottom: 8 }}>// {videoData.platform} — video metrics</Mono>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <StatTile label="Views"    value={videoData.views}    color={CYAN}   />
            <StatTile label="Likes"    value={videoData.likes}    color={GOLD}   />
            <StatTile label="Comments" value={videoData.comments} color={GREEN}  />
            <StatTile label="Shares"   value={videoData.shares}   color={PURPLE} />
            <StatTile label="Duration" value={videoData.duration} color={CORAL}  />
          </div>
          <Card accent={CYAN}>
            <div style={{ color: "#444", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>Caption</div>
            <div style={{ color: "#bbb", fontSize: 13, lineHeight: 1.6 }}>{videoData.caption}</div>
          </Card>
        </div>
      )}

      {/* Scores */}
      {analysis && (
        <>
          <Card accent={GOLD} style={{ marginBottom: 16 }}>
            <Mono size={10} color={GOLD} style={{ textTransform: "uppercase", letterSpacing: 2, display: "block", marginBottom: 14 }}>// viral performance scores</Mono>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
              <div style={{ background: `${GOLD}12`, border: `1px solid ${GOLD}35`, borderRadius: 10, padding: "18px 22px", textAlign: "center", minWidth: 110 }}>
                <div style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 46, fontWeight: 900, color: GOLD, lineHeight: 1 }}>{analysis.viralScore}</div>
                <div style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginTop: 6 }}>Viral Score</div>
              </div>
              <div style={{ flex: 1, minWidth: 180, paddingTop: 4 }}>
                <ScoreBar label="Hook Strength"    score={analysis.hookScore}      color={CYAN}   />
                <ScoreBar label="Retention Power"  score={analysis.retentionScore} color={GREEN}  />
                <ScoreBar label="Emotion Trigger"  score={analysis.emotionScore}   color={GOLD}   />
                <ScoreBar label="Call to Action"   score={analysis.ctaScore}       color={CORAL}  />
              </div>
            </div>
            <div style={{ background: BG3, borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ color: "#444", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Emotion Triggered</div>
              <div style={{ color: GOLD, fontWeight: 700, fontSize: 17 }}>{analysis.emotionTriggered}</div>
            </div>
          </Card>

          {/* Why it worked */}
          <Card accent={CYAN} style={{ marginBottom: 16 }}>
            <Mono size={10} color={CYAN} style={{ textTransform: "uppercase", letterSpacing: 2, display: "block", marginBottom: 14 }}>// why it went viral</Mono>
            <div style={{ color: "#999", fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>{analysis.audienceInsight}</div>
            {analysis.whyItWorked.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: i < analysis.whyItWorked.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                <Mono size={11} color={CYAN}>{String(i + 1).padStart(2, "0")}</Mono>
                <div style={{ color: "#ccc", fontSize: 13, lineHeight: 1.6 }}>{r}</div>
              </div>
            ))}
            <div style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}20`, borderRadius: 8, padding: "12px 16px", marginTop: 14 }}>
              <div style={{ color: GREEN, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Hook Formula</div>
              <div style={{ color: "#ccc", fontSize: 13 }}>{analysis.hookFormula}</div>
            </div>
          </Card>

          {/* Scripts */}
          <div style={{ marginBottom: 16 }}>
            <Mono size={10} color={PURPLE} style={{ textTransform: "uppercase", letterSpacing: 2, display: "block", marginBottom: 12 }}>// scripts — ready to film</Mono>
            {analysis.scripts.map((s, i) => (
              <Card key={i} accent={PURPLE} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Script {i + 1} — {s.title}</div>
                  <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 10, border: `1px solid ${PURPLE}40`, color: PURPLE, textTransform: "uppercase", letterSpacing: 1 }}>READY</div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ color: CORAL, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Hook — 0 to 3 sec</div>
                  <div style={{ background: `${CORAL}10`, border: `1px solid ${CORAL}25`, borderRadius: 6, padding: "10px 14px", color: "#fff", fontSize: 15, fontWeight: 600, lineHeight: 1.5 }}>"{s.hook}"</div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ color: CYAN, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Body — 4 to 40 sec</div>
                  <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "10px 14px", color: "#bbb", fontSize: 13, lineHeight: 1.7 }}>{s.body}</div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ color: GREEN, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>CTA — last 5 sec</div>
                  <div style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}25`, borderRadius: 6, padding: "10px 14px", color: GREEN, fontSize: 14, fontWeight: 600 }}>"{s.cta}"</div>
                </div>
                {s.why && <div style={{ color: "#444", fontSize: 11, lineHeight: 1.5, borderTop: `1px solid ${BORDER}`, paddingTop: 10 }}>{s.why}</div>}
              </Card>
            ))}
          </div>

          {/* Hooks */}
          <Card accent={GREEN} style={{ marginBottom: 16 }}>
            <Mono size={10} color={GREEN} style={{ textTransform: "uppercase", letterSpacing: 2, display: "block", marginBottom: 12 }}>// standalone hooks — swipe file</Mono>
            {analysis.topHooks.map((h, i) => (
              <div key={i} style={{ background: BG3, borderRadius: 6, padding: "12px 14px", marginBottom: 8, fontSize: 14, color: "#ddd", lineHeight: 1.5 }}>
                <Mono size={11} color={GREEN}>{String(i + 1).padStart(2, "0")}  </Mono>"{h}"
              </div>
            ))}
          </Card>

          {/* Hashtags */}
          <Card accent={PURPLE} style={{ marginBottom: 16 }}>
            <Mono size={10} color={PURPLE} style={{ textTransform: "uppercase", letterSpacing: 2, display: "block", marginBottom: 12 }}>// hashtag strategy</Mono>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {analysis.hashtagStrategy.map((t, i) => (
                <div key={i} style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "6px 14px", fontSize: 13, color: PURPLE, fontWeight: 600 }}>#{t}</div>
              ))}
            </div>
          </Card>

          {/* Warnings */}
          {analysis.warningSignals?.length > 0 && (
            <Card accent={CORAL} style={{ marginBottom: 16 }}>
              <Mono size={10} color={CORAL} style={{ textTransform: "uppercase", letterSpacing: 2, display: "block", marginBottom: 12 }}>// watch out for</Mono>
              {analysis.warningSignals.map((w, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: i < analysis.warningSignals.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                  <span style={{ color: CORAL }}>⚠</span>
                  <div style={{ color: "#999", fontSize: 13, lineHeight: 1.5 }}>{w}</div>
                </div>
              ))}
            </Card>
          )}
        </>
      )}

      {!videoData && !loading && (
        <div style={{ textAlign: "center", padding: "70px 20px" }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 64, color: GOLD, opacity: 0.06, lineHeight: 1, marginBottom: 24 }}>⬡</div>
          <div style={{ color: "#2e2e2c", fontSize: 13, lineHeight: 2, fontFamily: "'Courier New', monospace" }}>
            paste any viral tiktok or instagram url<br />
            reconexus reverse-engineers it<br />
            and writes you 3 scripts to film
          </div>
        </div>
      )}
    </div>
  );
}

function ChannelTab() {
  return (
    <div>
      <Eyebrow label="my channel" color={GREEN} />
      <Card accent={GREEN}>
        <div style={{ color: "#333", fontSize: 13, fontFamily: "'Courier New', monospace", marginBottom: 20 }}>@allianzhousinguk</div>
        <div style={{ color: "#2a2a28", fontSize: 13 }}>Channel scraper coming in the next build. Will pull your last 30 videos, score each one, and show you your best-performing hooks and patterns.</div>
      </Card>
    </div>
  );
}

function IntelligenceTab() {
  return (
    <div>
      <Eyebrow label="reconexus intelligence" color={GOLD} />
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
        <div style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}20`, borderRadius: "50%", width: 90, height: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ReconexusLogo size={50} />
        </div>
      </div>
      <Card accent={GOLD}>
        <Mono size={10} color={GOLD} style={{ textTransform: "uppercase", letterSpacing: 2, display: "block", marginBottom: 10 }}>// pattern memory</Mono>
        <div style={{ color: "#2e2e2c", fontSize: 13, lineHeight: 1.8 }}>
          Reconexus builds intelligence from every video you analyse. Hook formulas, emotion triggers, engagement patterns — it accumulates over time and surfaces what consistently works for your audience.
          <br /><br />
          Analyse more videos to feed the engine.
        </div>
      </Card>
    </div>
  );
}

function CompetitorsTab() {
  return (
    <div>
      <Eyebrow label="competitors" color={CORAL} />
      <Card accent={CORAL}>
        <div style={{ color: "#2a2a28", fontSize: 13, lineHeight: 1.8 }}>
          Add competitor accounts — Reconexus scrapes their top videos, analyses what works, and surfaces patterns you can adapt. Coming in the next build.
        </div>
      </Card>
    </div>
  );
}

function ScriptVaultTab() {
  const [scripts, setScripts]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");

  useEffect(() => {
    setLoading(true);
    const q = filter !== "all" ? `?status=${filter}` : "";
    fetch(`/api/get-scripts${q}`)
      .then(r => r.json())
      .then(d => { setScripts(d.scripts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  async function markUsed(id) {
    await fetch("/api/update-script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scriptId: id, status: "used" }),
    });
    setScripts(prev => prev.map(s => s.id === id ? { ...s, status: "used" } : s));
  }

  return (
    <div>
      <Eyebrow label="script vault" color={PURPLE} />
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "unused", "used"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? `${PURPLE}18` : "transparent", border: `1px solid ${filter === f ? PURPLE : "#2a2a28"}`, borderRadius: 20, padding: "5px 14px", fontSize: 12, color: filter === f ? PURPLE : "#555", cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>{f}</button>
        ))}
      </div>
      {loading && <div style={{ color: "#2a2a28", fontSize: 13, fontFamily: "'Courier New', monospace" }}>loading scripts...</div>}
      {!loading && scripts.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#2a2a28", fontSize: 13, fontFamily: "'Courier New', monospace" }}>
          no scripts yet — analyse a viral video to generate scripts
        </div>
      )}
      {scripts.map(s => (
        <Card key={s.id} accent={s.status === "used" ? "#2a2a28" : PURPLE}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ color: s.status === "used" ? "#444" : "#fff", fontWeight: 700, fontSize: 14 }}>{s.title}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0, marginLeft: 12 }}>
              <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 10, border: `1px solid ${s.status === "used" ? "#2a2a28" : `${PURPLE}40`}`, color: s.status === "used" ? "#333" : PURPLE, textTransform: "uppercase", letterSpacing: 1 }}>{s.status}</div>
              {s.status === "unused" && (
                <button onClick={() => markUsed(s.id)} style={{ background: `${PURPLE}15`, border: `1px solid ${PURPLE}40`, borderRadius: 6, padding: "4px 10px", fontSize: 11, color: PURPLE, cursor: "pointer", fontFamily: "inherit" }}>Mark Used</button>
              )}
            </div>
          </div>
          <div style={{ background: `${CORAL}10`, border: `1px solid ${CORAL}20`, borderRadius: 6, padding: "10px 12px", marginBottom: 8, color: "#ddd", fontSize: 14, fontStyle: "italic" }}>"{s.hook}"</div>
          <div style={{ color: "#888", fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>{s.body}</div>
          <div style={{ color: GREEN, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{s.cta}</div>
          {s.why && <div style={{ color: "#333", fontSize: 11, borderTop: `1px solid ${BORDER}`, paddingTop: 8 }}>{s.why}</div>}
        </Card>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("analyse");

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: "#fff" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #2e2e2c; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }
        ::-webkit-scrollbar { width: 4px; background: ${BG}; }
        ::-webkit-scrollbar-thumb { background: #2a2a28; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: BG, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ReconexusLogo size={28} />
          <div>
            <div style={{ fontWeight: 900, fontSize: 14, letterSpacing: "2px", color: GOLD, textTransform: "uppercase" }}>Reconexus</div>
            <div style={{ color: "#2e2e2c", fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 1 }}>Allianz Housing Intelligence</div>
          </div>
        </div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#222" }}>// by LMB</div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "0 20px", display: "flex", overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "transparent", border: "none", borderBottom: tab === t.id ? `2px solid ${t.color}` : "2px solid transparent", padding: "13px 16px", fontSize: 13, fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? t.color : "#3a3a38", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", transition: "color 0.15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 60px" }}>
        {tab === "analyse"      && <AnalyseTab />}
        {tab === "channel"      && <ChannelTab />}
        {tab === "intelligence" && <IntelligenceTab />}
        {tab === "competitors"  && <CompetitorsTab />}
        {tab === "vault"        && <ScriptVaultTab />}
      </div>
    </div>
  );
}
