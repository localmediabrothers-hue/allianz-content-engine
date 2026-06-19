const { default: Anthropic } = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

const APIFY_BASE = 'https://api.apify.com/v2';
const ALLIANZ_WORKSPACE_ID = 'a0000000-0000-0000-0000-000000000001';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

async function checkApifyStatus(runId) {
  const token = process.env.APIFY_API_KEY;
  const res = await fetch(`${APIFY_BASE}/actor-runs/${runId}?token=${token}`);
  const { data } = await res.json();
  return data.status;
}

async function fetchDatasetItems(datasetId) {
  const token = process.env.APIFY_API_KEY;
  const res = await fetch(`${APIFY_BASE}/datasets/${datasetId}/items?token=${token}`);
  if (!res.ok) throw new Error(`Dataset fetch failed (${res.status})`);
  return res.json();
}

function normalizeVideoData(v, platform, url) {
  if (platform === 'tiktok') {
    return {
      platform, url,
      caption: v.text || v.desc || '',
      views: v.playCount || (v.stats && v.stats.playCount) || 0,
      likes: v.diggCount || (v.stats && v.stats.diggCount) || 0,
      comments: v.commentCount || (v.stats && v.stats.commentCount) || 0,
      shares: v.shareCount || (v.stats && v.stats.shareCount) || 0,
      hashtags: (v.hashtags || []).map(h => h.name || h),
      author: (v.authorMeta && v.authorMeta.name) || (v.author && v.author.uniqueId) || '',
      duration: `${(v.videoMeta && v.videoMeta.duration) || v.duration || 0}s`,
      topComments: [],
    };
  } else {
    return {
      platform, url,
      caption: v.caption || v.alt || '',
      views: v.videoPlayCount || v.playsCount || 0,
      likes: v.likesCount || v.likes || 0,
      comments: v.commentsCount || v.comments || 0,
      shares: 0,
      hashtags: v.hashtags || [],
      author: v.ownerUsername || (v.owner && v.owner.username) || '',
      duration: `${v.videoDuration || 0}s`,
      topComments: [],
    };
  }
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

async function saveToSupabase(runId, url, platform, videoData, rawItem, analysis) {
  try {
    const supabase = getSupabase();

    const { data: savedAnalysis, error: analysisError } = await supabase
      .from('analyses')
      .insert({
        workspace_id: ALLIANZ_WORKSPACE_ID,
        url,
        platform,
        apify_run_id: runId,
        status: 'done',
        video_data: videoData,
        raw_apify_data: rawItem,
        analysis,
      })
      .select()
      .single();

    if (analysisError) {
      console.error('Analysis save error:', analysisError.message);
      return;
    }

    if (savedAnalysis && analysis.scripts && analysis.scripts.length > 0) {
      const scriptRows = analysis.scripts.map(s => ({
        workspace_id: ALLIANZ_WORKSPACE_ID,
        analysis_id: savedAnalysis.id,
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
  } catch (err) {
    console.error('Supabase save failed (non-fatal):', err.message);
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let runId, datasetId, platform, url;
  try { ({ runId, datasetId, platform, url } = JSON.parse(event.body)); } catch (e) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  try {
    const status = await checkApifyStatus(runId);

    if (['RUNNING', 'READY', 'CREATED'].includes(status)) {
      return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ pending: true }) };
    }
    if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(status)) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: `Apify run ${status}` }) };
    }

    const items = await fetchDatasetItems(datasetId);
    if (!items.length) throw new Error('Scraper returned no results for this URL');
    const videoData = normalizeVideoData(items[0], platform, url);
    const analysis = await analyseWithClaude(videoData);

    await saveToSupabase(runId, url, platform, videoData, items[0], analysis);

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ videoData, analysis }) };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: err.message }) };
  }
};
