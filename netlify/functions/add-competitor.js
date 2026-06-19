const { createClient } = require('@supabase/supabase-js');

const ALLIANZ_WORKSPACE_ID = 'a0000000-0000-0000-0000-000000000001';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

function extractHandle(input, defaultPlatform) {
  const cleaned = input.trim();
  const tiktokMatch = cleaned.match(/tiktok\.com\/@([\w.]+)/);
  if (tiktokMatch) return { handle: `@${tiktokMatch[1]}`, platform: 'tiktok' };
  const instaMatch = cleaned.match(/instagram\.com\/([\w.]+)/);
  if (instaMatch) return { handle: `@${instaMatch[1]}`, platform: 'instagram' };
  const bare = cleaned.startsWith('@') ? cleaned : `@${cleaned}`;
  return { handle: bare, platform: defaultPlatform };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Method not allowed' }) };

  let input, platform;
  try { ({ input, platform = 'tiktok' } = JSON.parse(event.body)); } catch {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }
  if (!input) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'handle or URL required' }) };

  const extracted = extractHandle(input, platform);
  const handle = extracted.handle;
  const finalPlatform = extracted.platform;

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data: existing } = await supabase
    .from('competitors')
    .select('id')
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
    .eq('handle', handle)
    .eq('platform', finalPlatform)
    .maybeSingle();

  if (existing) return { statusCode: 409, headers: cors, body: JSON.stringify({ error: `${handle} is already being tracked` }) };

  const { data, error } = await supabase
    .from('competitors')
    .insert({ workspace_id: ALLIANZ_WORKSPACE_ID, handle, platform: finalPlatform })
    .select()
    .single();

  if (error) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: error.message }) };

  return { statusCode: 200, headers: cors, body: JSON.stringify({ competitor: data }) };
};
