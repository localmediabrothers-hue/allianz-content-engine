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

  const { data: trips, error } = await supabase
    .from('filming_trips')
    .select('*')
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
    .order('trip_date', { ascending: false });

  if (error) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: error.message }) };

  const tripsWithCounts = await Promise.all((trips || []).map(async (trip) => {
    const { data: scripts } = await supabase
      .from('scripts')
      .select('id, title, status, property_note')
      .eq('trip_id', trip.id);
    return { ...trip, scripts: scripts || [] };
  }));

  return { statusCode: 200, headers: cors, body: JSON.stringify({ trips: tripsWithCounts }) };
};
