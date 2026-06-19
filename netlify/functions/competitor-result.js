const { createClient } = require('@supabase/supabase-js');

const APIFY_BASE = 'https://api.apify.com/v2';
const ALLIANZ_WORKSPACE_ID = 'a0000000-0000-0000-0000-000000000001';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function normalizeVideo(v, platform) {
  if (platform === 'tiktok') {
    return {
      url: v.webVideoUrl || v.videoUrl || '',
      caption: v.text || v.desc || '',
      views: v.playCount || (v.stats && v.stats.playCount) || 0,
      likes: v.diggCount || (v.stats && v.stats.diggCount) || 0,
      comments: v.commentCount || (v.stats && v.stats.commentCount) || 0,
      shares: v.shareCount || (v.stats && v.stats.shareCount) || 0,
      hashtags: (v.hashtags || []).map(h => h.name || h),
      duration: `${(v.videoMeta && v.videoMeta.duration) || v.duration || 0}s`,
      posted_at: v.createTime ? new Date(v.createTime * 1000).toISOString() : null,
    };
  } else {
    const sc = v.shortCode || v.shortcode || '';
    return {
      url: v.url || (sc ? `https://instagram.com/p/${sc}` : ''),
      caption: v.caption || v.alt || '',
      views: v.videoPlayCount || v.playsCount || 0,
      likes: v.likesCount || v.likes || 0,
      comments: v.commentsCount || v.comments || 0,
      shares: 0,
      hashtags: v.hashtags || [],
      duration: `${v.videoDuration || 0}s`,
      posted_at: v.timestamp || null,
    };
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Method not allowed' }) };

  let runId, datasetId, competitorId, platform;
  try { ({ runId, datasetId, competitorId, platform } = JSON.parse(event.body)); } catch {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const token = process.env.APIFY_API_KEY;

  const statusRes = await fetch(`${APIFY_BASE}/actor-runs/${runId}?token=${token}`);
  const { data: runData } = await statusRes.json();
  const status = runData.status;

  if (['RUNNING', 'READY', 'CREATED'].includes(status)) {
    return { statusCode: 200, headers: cors, body: JSON.stringify({ pending: true }) };
  }
  if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(status)) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: `Apify run ${status}` }) };
  }

  const itemsRes = await fetch(`${APIFY_BASE}/datasets/${datasetId}/items?token=${token}`);
  if (!itemsRes.ok) return { statusCode: 502, headers: cors, body: JSON.stringify({ error: 'Dataset fetch failed' }) };
  const items = await itemsRes.json();

  if (!items.length) return { statusCode: 200, headers: cors, body: JSON.stringify({ videos: [], total: 0 }) };

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const rows = items.map(item => ({
    workspace_id: ALLIANZ_WORKSPACE_ID,
    competitor_id: competitorId,
    platform,
    url: normalizeVideo(item, platform).url,
    video_data: normalizeVideo(item, platform),
    raw_apify_data: item,
  }));

  await supabase.from('competitor_videos').delete()
    .eq('competitor_id', competitorId)
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID);

  const { error: insertErr } = await supabase.from('competitor_videos').insert(rows);
  if (insertErr) console.error('competitor_videos insert error:', insertErr.message);

  await supabase.from('competitors')
    .update({ last_scraped_at: new Date().toISOString() })
    .eq('id', competitorId);

  const videos = items
    .map(item => normalizeVideo(item, platform))
    .sort((a, b) => (b.views || 0) - (a.views || 0));

  return { statusCode: 200, headers: cors, body: JSON.stringify({ videos, total: videos.length }) };
};
