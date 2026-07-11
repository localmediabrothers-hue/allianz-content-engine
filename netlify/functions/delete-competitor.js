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

  let competitorId;
  try { ({ competitorId } = JSON.parse(event.body)); } catch {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }
  if (!competitorId) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'competitorId required' }) };

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  await supabase.from('competitor_videos').delete().eq('competitor_id', competitorId).eq('workspace_id', ALLIANZ_WORKSPACE_ID);
  await supabase.from('analyses').update({ competitor_id: null }).eq('competitor_id', competitorId).eq('workspace_id', ALLIANZ_WORKSPACE_ID);

  const { error } = await supabase
    .from('competitors')
    .delete()
    .eq('id', competitorId)
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID);

  if (error) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: error.message }) };
  return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true }) };
};
