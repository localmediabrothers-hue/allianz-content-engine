const { createClient } = require('@supabase/supabase-js');

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

  let scriptId, tripId;
  try {
    ({ scriptId, tripId } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  if (!scriptId) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'scriptId required' }) };

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  // tripId null = unassign
  const { error } = await supabase
    .from('scripts')
    .update({ trip_id: tripId || null })
    .eq('id', scriptId)
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID);

  if (error) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: error.message }) };
  return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true }) };
};
