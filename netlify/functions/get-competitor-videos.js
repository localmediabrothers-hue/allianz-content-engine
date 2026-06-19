const { createClient } = require('@supabase/supabase-js');

const ALLIANZ_WORKSPACE_ID = 'a0000000-0000-0000-0000-000000000001';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors, body: '' };

  const params = event.queryStringParameters || {};
  const { competitorId } = params;
  if (!competitorId) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'competitorId required' }) };

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data, error } = await supabase
    .from('competitor_videos')
    .select('id, platform, url, video_data, created_at')
    .eq('competitor_id', competitorId)
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
    .order('created_at', { ascending: false });

  if (error) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: error.message }) };

  const sorted = (data || []).sort((a, b) => (b.video_data?.views || 0) - (a.video_data?.views || 0));

  return { statusCode: 200, headers: cors, body: JSON.stringify({ videos: sorted }) };
};
