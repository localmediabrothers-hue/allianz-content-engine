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

  const { competitorId } = event.queryStringParameters || {};
  if (!competitorId) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'competitorId required' }) };

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data: analyses, error } = await supabase
    .from('analyses')
    .select('id, url, platform, analysis, video_data, status, created_at')
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
    .eq('competitor_id', competitorId)
    .eq('status', 'done')
    .order('created_at', { ascending: false });

  if (error) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: error.message }) };

  return { statusCode: 200, headers: cors, body: JSON.stringify({ analyses: analyses || [] }) };
};
