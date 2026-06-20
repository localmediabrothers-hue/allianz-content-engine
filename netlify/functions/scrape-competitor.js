const { createClient } = require('@supabase/supabase-js');

const APIFY_BASE = 'https://api.apify.com/v2';
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

  let competitorId, limit;
  try { ({ competitorId, limit = 20 } = JSON.parse(event.body)); } catch {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }
  if (!competitorId) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'competitorId required' }) };

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data: competitor, error: cErr } = await supabase
    .from('competitors')
    .select('*')
    .eq('id', competitorId)
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
    .single();

  if (cErr || !competitor) return { statusCode: 404, headers: cors, body: JSON.stringify({ error: 'Competitor not found' }) };

  const token = process.env.APIFY_API_KEY;
  const handle = competitor.handle.replace('@', '');
  const cap = Math.min(Math.max(parseInt(limit) || 20, 5), 50);

  let actorId, input;
  if (competitor.platform === 'tiktok') {
    actorId = 'clockworks~free-tiktok-scraper';
    input = {
      profiles: [handle],
      resultsPerPage: cap,
      shouldDownloadVideos: false,
      shouldDownloadCovers: false,
    };
  } else {
    actorId = 'apify~instagram-reel-scraper';
    input = {
      username: [handle],
      resultsLimit: cap,
    };
  }

  const res = await fetch(`${APIFY_BASE}/acts/${actorId}/runs?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const txt = await res.text();
    return { statusCode: 502, headers: cors, body: JSON.stringify({ error: `Apify start failed: ${txt}` }) };
  }

  const { data: run } = await res.json();

  return {
    statusCode: 200,
    headers: cors,
    body: JSON.stringify({
      runId: run.id,
      datasetId: run.defaultDatasetId,
      competitorId,
      platform: competitor.platform,
      handle: competitor.handle,
    }),
  };
};
