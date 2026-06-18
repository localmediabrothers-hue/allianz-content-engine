const APIFY_BASE = 'https://api.apify.com/v2';

function detectPlatform(url) {
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('instagram.com')) return 'instagram';
  throw new Error('Unsupported URL. Paste a TikTok or Instagram link.');
}

async function startApifyRun(actorId, input) {
  const token = process.env.APIFY_API_KEY;
  const res = await fetch(`${APIFY_BASE}/acts/${actorId}/runs?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Apify start failed (${res.status}): ${await res.text()}`);
  const { data } = await res.json();
  return data;
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

  let url;
  try { ({ url } = JSON.parse(event.body)); } catch (e) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }
  if (!url || typeof url !== 'string') {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Missing url field' }) };
  }

  try {
    const platform = detectPlatform(url.trim());
    let run;
    if (platform === 'tiktok') {
      run = await startApifyRun('clockworks~free-tiktok-scraper', {
        postURLs: [url.trim()],
        maxPostsPerPage: 1,
        shouldDownloadVideos: false,
        shouldDownloadCovers: false,
      });
    } else {
      run = await startApifyRun('apify~instagram-reel-scraper', {
        directUrls: [url.trim()],
        resultsLimit: 1,
      });
    }
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ runId: run.id, datasetId: run.defaultDatasetId, platform, url: url.trim() }),
    };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: err.message }) };
  }
};
