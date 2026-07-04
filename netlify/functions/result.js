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

  let runId, datasetId, platform, url, competitorId;
  try { ({ runId, datasetId, platform, url, competitorId } = JSON.parse(event.body)); } catch (e) {
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

    const supabase = getSupabase();
    const { data: savedAnalysis, error: insertErr } = await supabase
      .from('analyses')
      .insert({
        workspace_id: ALLIANZ_WORKSPACE_ID,
        url,
        platform,
        apify_run_id: runId,
        status: 'analysing',
        video_data: videoData,
        raw_apify_data: items[0],
        competitor_id: competitorId || null,
      })
      .select()
      .single();

    if (insertErr) throw new Error(`Failed to save analysis row: ${insertErr.message}`);

    await fetch(`${process.env.URL}/.netlify/functions/generate-analysis-background`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysisId: savedAnalysis.id, videoData, platform, competitorId: competitorId || null }),
    });

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ videoData, analysisId: savedAnalysis.id }) };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: err.message }) };
  }
};
