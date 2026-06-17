import { useState } from "react";

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: "#111", border: `1px solid ${color}30`,
      borderRadius: "10px", padding: "14px 18px", flex: "1", minWidth: "100px"
    }}>
      <div style={{ color, fontSize: "22px", fontWeight: "800", letterSpacing: "-0.5px" }}>{value}</div>
      <div style={{ color: "#666", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginTop: "2px" }}>{label}</div>
    </div>
  );
}

function ScoreBar({ label, score, color }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ color: "#aaa", fontSize: "13px" }}>{label}</span>
        <span style={{ color, fontSize: "13px", fontWeight: "700" }}>{score}/10</span>
      </div>
      <div style={{ background: "#222", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
        <div style={{ width: `${score * 10}%`, height: "100%", background: `linear-gradient(90deg, ${color}80, ${color})`, borderRadius: "4px" }} />
      </div>
    </div>
  );
}

function Section({ title, accent, children }) {
  return (
    <div style={{
      background: "#0d0d0d", border: "1px solid #1e1e1e",
      borderLeft: `3px solid ${accent}`, borderRadius: "12px",
      padding: "20px 24px", marginBottom: "16px"
    }}>
      <div style={{ color: accent, fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "14px" }}>{title}</div>
      {children}
    </div>
  );
}

const G = "#00ff88", B = "#4488ff", Y = "#ffcc00", R = "#ff4444";

const PHASES = [
  { key: "scraping", label: "Scraping video..." },
  { key: "analysing", label: "AI analysis..." },
  { key: "done", label: "Complete" },
];

export default function App() {
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
    setError(""); setLoading(true); setVideoData(null); setAnalysis(null);
    setPhase("scraping");

    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      setPhase("analysing");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setVideoData(data.videoData);
      setAnalysis(data.analysis);
      setPhase("done");
    } catch (err) {
      setError(err.message);
      setPhase("idle");
    }
    setLoading(false);
  }

  const phaseOrder = ["scraping", "analysing", "done"];

  return (
    <div style={{ background: "#080808", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", color: "#fff" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#080808", zIndex: 100 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: `linear-gradient(135deg, ${G}, ${B})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>⚡</div>
            <span style={{ fontWeight: "800", fontSize: "16px", letterSpacing: "-0.3px" }}>Content Intelligence</span>
          </div>
          <div style={{ color: "#444", fontSize: "11px", marginTop: "2px", marginLeft: "38px" }}>Allianz Housing — Viral Strategy Engine</div>
        </div>
        <div style={{ background: "#111", border: "1px solid #222", borderRadius: "20px", padding: "6px 14px", fontSize: "11px", color: G, fontWeight: "600" }}>POWERED BY CLAUDE AI</div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "28px 20px" }}>

        {/* URL Input */}
        <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
          <div style={{ color: "#888", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px" }}>Drop a viral video URL</div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && analyse()}
              placeholder="https://www.tiktok.com/@user/video/... or instagram.com/reel/..."
              style={{ flex: "1", minWidth: "200px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "10px", padding: "13px 16px", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "inherit" }}
            />
            <button
              onClick={analyse}
              disabled={loading}
              style={{ background: loading ? "#1a1a1a" : `linear-gradient(135deg, ${G}, ${B})`, border: "none", borderRadius: "10px", padding: "13px 24px", color: loading ? "#444" : "#000", fontWeight: "800", fontSize: "14px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}
            >{loading ? "Analysing..." : "Analyse →"}</button>
          </div>
          {error && <div style={{ color: R, fontSize: "13px", marginTop: "10px" }}>{error}</div>}

          {loading && (
            <div style={{ marginTop: "18px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {PHASES.map(p => {
                const ci = phaseOrder.indexOf(phase), ti = phaseOrder.indexOf(p.key);
                const isActive = p.key === phase, isDone = ti < ci;
                return (
                  <div key={p.key} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "20px", background: isActive ? `${G}15` : "#111", border: `1px solid ${isActive ? G : "#1a1a1a"}`, fontSize: "12px", color: isActive ? G : isDone ? "#444" : "#333" }}>
                    <span>{isDone ? "✓" : isActive ? "◉" : "○"}</span>{p.label}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Video Stats */}
        {videoData && (
          <Section title={`${videoData.platform} — Video Metrics`} accent={B}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
              <StatCard label="Views" value={videoData.views} color={G} />
              <StatCard label="Likes" value={videoData.likes} color={B} />
              <StatCard label="Comments" value={videoData.comments} color={Y} />
              <StatCard label="Shares" value={videoData.shares} color="#ff88aa" />
              <StatCard label="Duration" value={videoData.duration} color="#aa88ff" />
            </div>
            <div style={{ background: "#111", borderRadius: "10px", padding: "14px 16px", marginBottom: "12px" }}>
              <div style={{ color: "#555", fontSize: "11px", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>Caption</div>
              <div style={{ color: "#ccc", fontSize: "13px", lineHeight: "1.5" }}>{videoData.caption}</div>
            </div>
            {videoData.topComments?.length > 0 && (
              <div>
                <div style={{ color: "#555", fontSize: "11px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Top Comments</div>
                {videoData.topComments.map((c, i) => (
                  <div key={i} style={{ background: "#111", borderRadius: "8px", padding: "10px 14px", marginBottom: "6px", fontSize: "13px", color: "#aaa", borderLeft: `2px solid ${Y}40` }}>💬 {c}</div>
                ))}
              </div>
            )}
          </Section>
        )}

        {/* Analysis */}
        {analysis && (
          <>
            <Section title="Viral Performance Scores" accent={G}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
                <div style={{ flex: "1", minWidth: "120px", background: `${G}20`, border: `1px solid ${G}40`, borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "36px", fontWeight: "900", color: G, letterSpacing: "-2px" }}>{analysis.viralScore}</div>
                  <div style={{ color: "#666", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>Viral Score</div>
                  <div style={{ color: "#444", fontSize: "10px" }}>out of 10</div>
                </div>
                <div style={{ flex: "2", minWidth: "200px" }}>
                  <ScoreBar label="Hook Strength" score={analysis.hookScore} color={G} />
                  <ScoreBar label="Retention Power" score={analysis.retentionScore} color={B} />
                  <ScoreBar label="Emotion Trigger" score={analysis.emotionScore} color={Y} />
                  <ScoreBar label="Call to Action" score={analysis.ctaScore} color="#ff88aa" />
                </div>
              </div>
              <div style={{ background: "#111", borderRadius: "10px", padding: "14px 16px" }}>
                <div style={{ color: "#555", fontSize: "11px", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>Primary Emotion Triggered</div>
                <div style={{ color: Y, fontSize: "18px", fontWeight: "700" }}>{analysis.emotionTriggered}</div>
              </div>
            </Section>

            <Section title="Why It Went Viral" accent={Y}>
              <div style={{ color: "#bbb", fontSize: "13px", lineHeight: "1.7", marginBottom: "16px" }}>{analysis.audienceInsight}</div>
              {analysis.whyItWorked.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px 0", borderBottom: i < analysis.whyItWorked.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: `${Y}20`, border: `1px solid ${Y}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: Y, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ color: "#ccc", fontSize: "14px", lineHeight: "1.6" }}>{r}</div>
                </div>
              ))}
              <div style={{ background: `${G}10`, border: `1px solid ${G}30`, borderRadius: "10px", padding: "14px 16px", marginTop: "16px" }}>
                <div style={{ color: G, fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Hook Formula</div>
                <div style={{ color: "#ccc", fontSize: "13px" }}>{analysis.hookFormula}</div>
              </div>
            </Section>

            <Section title="Your Scripts — Ready to Film" accent={G}>
              <div style={{ color: "#555", fontSize: "12px", marginBottom: "16px" }}>Adapted for Allianz Housing. Nationwide operation. Universal Credit audience.</div>
              {analysis.scripts.map((s, i) => (
                <div key={i} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "18px", marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <div style={{ color: "#fff", fontWeight: "700", fontSize: "15px" }}>Script {i + 1}: {s.title}</div>
                    <div style={{ background: `${G}15`, border: `1px solid ${G}30`, borderRadius: "20px", padding: "4px 10px", fontSize: "10px", color: G, fontWeight: "600", textTransform: "uppercase" }}>READY</div>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <div style={{ color: R, fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>🎯 Hook (0–3 sec)</div>
                    <div style={{ background: `${R}10`, border: `1px solid ${R}30`, borderRadius: "8px", padding: "12px 14px", color: "#fff", fontSize: "15px", fontWeight: "600", lineHeight: "1.5" }}>"{s.hook}"</div>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <div style={{ color: B, fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>📢 Body (4–40 sec)</div>
                    <div style={{ background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: "8px", padding: "12px 14px", color: "#ccc", fontSize: "13px", lineHeight: "1.7" }}>{s.body}</div>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <div style={{ color: G, fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>✅ CTA (last 5 sec)</div>
                    <div style={{ background: `${G}10`, border: `1px solid ${G}30`, borderRadius: "8px", padding: "12px 14px", color: G, fontSize: "14px", fontWeight: "600" }}>"{s.cta}"</div>
                  </div>
                  <div style={{ background: "#0d0d0d", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#666", lineHeight: "1.5", borderLeft: `2px solid ${Y}50` }}>💡 {s.why}</div>
                </div>
              ))}
            </Section>

            <Section title="Standalone Hooks — Swipe File" accent={B}>
              {analysis.topHooks.map((h, i) => (
                <div key={i} style={{ background: "#111", borderRadius: "8px", padding: "14px 16px", marginBottom: "8px", fontSize: "14px", color: "#fff", borderLeft: `3px solid ${B}`, lineHeight: "1.5" }}>
                  <span style={{ color: B, fontWeight: "700", marginRight: "8px" }}>{i + 1}.</span>"{h}"
                </div>
              ))}
            </Section>

            <Section title="Hashtag Strategy" accent="#aa88ff">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {analysis.hashtagStrategy.map((t, i) => (
                  <div key={i} style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "20px", padding: "8px 14px", fontSize: "13px", color: "#aa88ff", fontWeight: "600" }}>#{t}</div>
                ))}
              </div>
            </Section>

            {analysis.warningSignals?.length > 0 && (
              <Section title="Watch Out For" accent={R}>
                {analysis.warningSignals.map((w, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "10px 0", borderBottom: i < analysis.warningSignals.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                    <span style={{ color: R }}>⚠</span>
                    <div style={{ color: "#aaa", fontSize: "13px", lineHeight: "1.5" }}>{w}</div>
                  </div>
                ))}
              </Section>
            )}
          </>
        )}

        {!videoData && !loading && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎯</div>
            <div style={{ color: "#333", fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>Paste any TikTok or Instagram URL</div>
            <div style={{ color: "#222", fontSize: "13px", lineHeight: "1.6" }}>Scrapes the video, pulls the transcript,<br />scores why it went viral, writes you 3 scripts to film.</div>
          </div>
        )}

        <div style={{ textAlign: "center", padding: "24px 0", color: "#222", fontSize: "11px" }}>Allianz Housing · Content Intelligence Engine · Built by LMB</div>
      </div>
    </div>
  );
}
