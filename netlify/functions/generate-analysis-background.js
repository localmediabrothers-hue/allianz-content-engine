const { default: Anthropic } = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

const ALLIANZ_WORKSPACE_ID = 'a0000000-0000-0000-0000-000000000001';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

async function analyseWithClaude(videoData) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `You are a viral content strategist for Allianz Housing Limited — a UK supported/transitional accommodation provider. Target audience: Universal Credit (UC) and DSS claimants seeking housing across the UK. Content posted to @allianzhousinguk on TikTok and Instagram. Filming in Coventry properties.

Analyse this viral housing video data and return a JSON object — no markdown, no code fences, just raw JSON.

VIDEO DATA:
${JSON.stringify(videoData, null, 2)}

Return ONLY this JSON structure (fill in all fields):
{
  "viralScore": <number 1-10>,
  "hookScore": <number 1-10>,
  "retentionScore": <number 1-10>,
  "emotionScore": <number 1-10>,
  "ctaScore": <number 1-10>,
  "emotionTriggered": "<single emotion e.g. Hope, Relief, FOMO, Curiosity, Shock>",
  "audienceInsight": "<2-3 sentences on who resonated and why — UC/DSS claimants focus>",
  "whyItWorked": ["<reason 1>", "<reason 2>", "<reason 3>"],
  "hookFormula": "<the repeatable hook pattern from this video>",
  "scripts": [
    {
      "title": "<script title>",
      "hook": "<opening 3 seconds — stops the scroll>",
      "body": "<30-60 second script. Presenter on camera in Coventry property. Casual, direct, NOT corporate. Mention UC/DSS eligibility, no deposit, bills included where relevant.>",
      "cta": "Apply now at referrals@allianzhousing.org",
      "why": "<one sentence on why this angle works for Allianz>"
    },
    {
      "title": "<script title>",
      "hook": "<opening 3 seconds>",
      "body": "<30-60 second script>",
      "cta": "Apply now at referrals@allianzhousing.org",
      "why": "<one sentence>"
    },
    {
      "title": "<script title>",
      "hook": "<opening 3 seconds>",
      "body": "<30-60 second script>",
      "cta": "Apply now at referrals@allianzhousing.org",
      "why": "<one sentence>"
    }
  ],
  "topHooks": ["<hook 1>", "<hook 2>", "<hook 3>", "<hook 4>", "<hook 5>"],
  "hashtagStrategy": ["allianzhousing", "allianzhousinguk", "<tag3>", "<tag4>", "<tag5>", "<tag6>", "<tag7>", "<tag8>", "<tag9>", "<tag10>"],
  "warningSignals": ["<warning 1 if any>"]
}`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].text.trim();
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) throw new Error('Claude returned invalid JSON');
  return JSON.parse(text.slice(jsonStart, jsonEnd + 1));
}

exports.handler = async (event) => {
  let analysisId, videoData, platform;
  try { ({ analysisId, videoData, platform } = JSON.parse(event.body)); } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const supabase = getSupabase();

  try {
    const analysis = await analyseWithClaude(videoData);

    const { error: updateErr } = await supabase
      .from('analyses')
      .update({ status: 'done', analysis })
      .eq('id', analysisId);

    if (updateErr) {
      console.error('Analysis update error:', updateErr.message);
      return { statusCode: 500, body: updateErr.message };
    }

    if (analysis.scripts && analysis.scripts.length > 0) {
      const scriptRows = analysis.scripts.map(s => ({
        workspace_id: ALLIANZ_WORKSPACE_ID,
        analysis_id: analysisId,
        title: s.title || '',
        hook: s.hook || '',
        body: s.body || '',
        cta: s.cta || '',
        why: s.why || '',
        platform,
        status: 'unused',
      }));
      const { error: scriptsError } = await supabase.from('scripts').insert(scriptRows);
      if (scriptsError) console.error('Scripts save error:', scriptsError.message);
    }

    return { statusCode: 200, body: 'ok' };
  } catch (err) {
    await supabase.from('analyses').update({ status: 'failed' }).eq('id', analysisId);
    console.error('Background analysis failed:', err.message);
    return { statusCode: 500, body: err.message };
  }
};
