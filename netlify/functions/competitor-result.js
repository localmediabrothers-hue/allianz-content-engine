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
    };
  } else {
    const sc = v.shortCode || v.shortcode || '';
    return {
      url: v.url || (sc ? `https://instagram.com/reel/${sc}` : ''),
      caption: v.caption || v.alt || '',
      views: v.videoViewCount || v.videoPlayCount || 0,
      likes: v.likesCount || v.likes || 0,
      comments: v.commentsCount || v.comments || 0,
      shares: v.sharesCount || 0,
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
  const rawItems = await itemsRes.json();

  const errorItem = rawItems.find(item => item.error);
  const items = rawItems.filter(item => !item.error);

  if (!items.length) {
    if (errorItem) return { statusCode: 404, headers: cors, body: JSON.stringify({ error: errorItem.error || 'Profile not found' }) };
    return { statusCode: 200, headers: cors, body: JSON.stringify({ videos: [], total: 0 }) };
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const scrapedAt = new Date().toISOString();

  // Skip anything already stored for this competitor — never re-insert a video we already have.
  const { data: existing } = await supabase
    .from('competitor_videos')
    .select('url')
    .eq('competitor_id', competitorId)
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID);
  const existingUrls = new Set((existing || []).map(r => r.url));

  const normalized = items.map(item => normalizeVideo(item, platform));
  const newIndexes = normalized.map((n, i) => (n.url && !existingUrls.has(n.url)) ? i : -1).filter(i => i !== -1);

  const rows = newIndexes.map(i => ({
    workspace_id: ALLIANZ_WORKSPACE_ID,
    competitor_id: competitorId,
    url: normalized[i].url,
    caption: normalized[i].caption,
    views: normalized[i].views,
    likes: normalized[i].likes,
    comments: normalized[i].comments,
    shares: normalized[i].shares,
    raw_data: items[i],
    scraped_at: scrapedAt,
  }));

  if (rows.length) {
    const { error: insertErr } = await supabase.from('competitor_videos').insert(rows);
    if (insertErr) {
      return { statusCode: 500, headers: cors, body: JSON.stringify({ error: `Save failed: ${insertErr.message}` }) };
    }
  }

  const { count: totalCount } = await supabase
    .from('competitor_videos')
    .select('id', { count: 'exact', head: true })
    .eq('competitor_id', competitorId)
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID);

  await supabase.from('competitors')
    .update({ last_scraped: scrapedAt, total_videos_scraped: totalCount || 0 })
    .eq('id', competitorId);

  const videos = normalized.sort((a, b) => (b.views || 0) - (a.views || 0));

  return { statusCode: 200, headers: cors, body: JSON.stringify({ videos, total: videos.length, newCount: rows.length, skippedDuplicates: normalized.length - rows.length }) };
};
