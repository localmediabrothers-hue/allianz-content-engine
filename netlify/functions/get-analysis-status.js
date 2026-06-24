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

  const { id } = event.queryStringParameters || {};
  if (!id) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'id required' }) };

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data, error } = await supabase
    .from('analyses')
    .select('status, analysis')
    .eq('id', id)
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
    .single();

  if (error) return { statusCode: 404, headers: cors, body: JSON.stringify({ error: 'Analysis not found' }) };

  return { statusCode: 200, headers: cors, body: JSON.stringify({ status: data.status, analysis: data.analysis }) };
};
