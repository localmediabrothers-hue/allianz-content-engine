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

  let tripId, tripDate, location, properties, scriptsTarget;
  try {
    ({ tripId, tripDate, location, properties, scriptsTarget } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  if (!tripId) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'tripId required' }) };

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const updates = {};
  if (tripDate !== undefined) updates.trip_date = tripDate;
  if (location !== undefined) updates.location = location;
  if (properties !== undefined) updates.properties = properties;
  if (scriptsTarget !== undefined) updates.scripts_target = scriptsTarget;

  const { data, error } = await supabase
    .from('filming_trips')
    .update(updates)
    .eq('id', tripId)
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
    .select()
    .single();

  if (error) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: error.message }) };
  return { statusCode: 200, headers: cors, body: JSON.stringify({ trip: data }) };
};
