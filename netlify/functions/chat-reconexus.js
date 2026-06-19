const { default: Anthropic } = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

const ALLIANZ_WORKSPACE_ID = 'a0000000-0000-0000-0000-000000000001';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Method not allowed' }) };

  let message, history;
  try { ({ message, history = [] } = JSON.parse(event.body)); } catch {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    // Pull recent analyses for context
    const { data: analyses } = await supabase
      .from('analyses')
      .select('url, platform, video_data, analysis, created_at')
      .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
      .order('created_at', { ascending: false })
      .limit(20);

    const { data: scripts } = await supabase
      .from('scripts')
      .select('title, hook, status, platform, created_at')
      .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
      .order('created_at', { ascending: false })
      .limit(30);

    const analysisContext = (analyses || []).map(a => ({
      url: a.url,
      platform: a.platform,
      views: a.video_data?.views,
      likes: a.video_data?.likes,
      viralScore: a.analysis?.viralScore,
      emotionTriggered: a.analysis?.emotionTriggered,
      hookFormula: a.analysis?.hookFormula,
      date: a.created_at?.slice(0, 10),
    }));

    const systemPrompt = `You are Reconexus — the AI content intelligence engine for Allianz Housing Limited. You are embedded inside their private content strategy dashboard, speaking directly with Faisal (the owner).

ABOUT ALLIANZ HOUSING:
- UK supported/transitional accommodation provider
- Target audience: Universal Credit (UC) and DSS claimants seeking housing
- Posting on TikTok and Instagram as @allianzhousinguk
- Filming in Coventry properties
- No deposit, bills included. Contact: referrals@allianzhousing.org
- Goal: drive housing applications through viral video content

YOUR MEMORY — RECENT ANALYSES (${analysisContext.length} videos analysed so far):
${analysisContext.length > 0 ? JSON.stringify(analysisContext, null, 2) : "No analyses yet. Faisal needs to analyse some viral videos first."}

SCRIPTS IN VAULT:
- Total scripts generated: ${(scripts||[]).length}
- Unused: ${(scripts||[]).filter(s=>s.status==="unused").length}
- Used: ${(scripts||[]).filter(s=>s.status==="used").length}

YOUR PERSONALITY:
- Direct, sharp, confident — like a world-class content strategist
- You speak in clear plain English, not corporate jargon
- You give specific, actionable advice based on the data above
- You're honest — if there's not enough data yet, say so and tell Faisal exactly what to analyse next
- Keep responses concise unless asked to expand
- You know housing content, UC/DSS claimants, TikTok/Instagram algorithm patterns

Answer Faisal's question now based on all the above context.`;

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const messages = [
      ...history.slice(0, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
      { role: 'user', content: message },
    ];

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({ reply: response.content[0].text }),
    };
  } catch (err) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: err.message }) };
  }
};
