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
  const today = new Date().toISOString().split('T')[0];

  const [
    { data: nextTrip },
    { data: lastTrip },
    { data: recentAnalyses },
    { count: unusedScripts },
    { count: totalAnalyses },
  ] = await Promise.all([
    supabase.from('filming_trips').select('*').eq('workspace_id', ALLIANZ_WORKSPACE_ID)
      .gte('trip_date', today).order('trip_date', { ascending: true }).limit(1).maybeSingle(),
    supabase.from('filming_trips').select('*').eq('workspace_id', ALLIANZ_WORKSPACE_ID)
      .lt('trip_date', today).order('trip_date', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('analyses').select('id, url, platform, created_at, competitor_id, competitors(handle)')
      .eq('workspace_id', ALLIANZ_WORKSPACE_ID).eq('status', 'done')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false }).limit(10),
    supabase.from('scripts').select('id', { count: 'exact', head: true })
      .eq('workspace_id', ALLIANZ_WORKSPACE_ID).eq('status', 'unused').is('trip_id', null),
    supabase.from('analyses').select('id', { count: 'exact', head: true })
      .eq('workspace_id', ALLIANZ_WORKSPACE_ID).eq('status', 'done'),
  ]);

  let nextTripScriptCount = 0;
  let lastTripScripts = [];

  if (nextTrip) {
    const { count } = await supabase.from('scripts')
      .select('id', { count: 'exact', head: true }).eq('trip_id', nextTrip.id);
    nextTripScriptCount = count || 0;
  }

  if (lastTrip) {
    const { data: scripts } = await supabase.from('scripts')
      .select('id, title, platform, analysis_id, analyses(competitor_id, competitors(handle))')
      .eq('trip_id', lastTrip.id);
    lastTripScripts = scripts || [];
  }

  return {
    statusCode: 200,
    headers: cors,
    body: JSON.stringify({
      nextTrip: nextTrip || null,
      nextTripScriptCount,
      lastTrip: lastTrip || null,
      lastTripScripts,
      recentAnalyses: recentAnalyses || [],
      unusedScripts: unusedScripts || 0,
      totalAnalyses: totalAnalyses || 0,
    }),
  };
};
