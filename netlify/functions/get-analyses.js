const { createClient } = require('@supabase/supabase-js');

const ALLIANZ_WORKSPACE_ID = 'a0000000-0000-0000-0000-000000000001';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders, body: '' };
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const params = event.queryStringParameters || {};
    const limit = Math.min(parseInt(params.limit || '20'), 100);
    const offset = parseInt(params.offset || '0');

    const { data, error, count } = await supabase
      .from('analyses')
      .select('id, url, platform, status, video_data, analysis, created_at', { count: 'exact' })
      .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ analyses: data, total: count }),
    };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: err.message }) };
  }
};
