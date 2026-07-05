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

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data, error } = await supabase
    .from('intelligence')
    .select('*')
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
    .maybeSingle();

  if (error) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: error.message }) };

  const { count: doneCount } = await supabase
    .from('analyses')
    .select('id', { count: 'exact', head: true })
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
    .eq('status', 'done');

  return {
    statusCode: 200,
    headers: cors,
    body: JSON.stringify({
      intelligence: data || null,
      doneAnalysesCount: doneCount || 0,
    }),
  };
};
