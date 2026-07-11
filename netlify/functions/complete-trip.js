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

  let tripId;
  try { ({ tripId } = JSON.parse(event.body)); } catch {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }
  if (!tripId) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'tripId required' }) };

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { error: tripErr } = await supabase
    .from('filming_trips')
    .update({ status: 'completed' })
    .eq('id', tripId)
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID);

  if (tripErr) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: tripErr.message }) };

  // Scripts that were assigned but never filmed go back to the Approved pool
  // for the next trip instead of staying stuck on a completed one.
  const { data: released, error: releaseErr } = await supabase
    .from('scripts')
    .update({ trip_id: null })
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
    .eq('trip_id', tripId)
    .eq('status', 'unused')
    .select('id');

  if (releaseErr) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: releaseErr.message }) };

  return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true, releasedCount: (released || []).length }) };
};
