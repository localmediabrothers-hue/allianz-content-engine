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

  const { data: competitors, error } = await supabase
    .from('competitors')
    .select('*')
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
    .order('created_at', { ascending: false });

  if (error) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: error.message }) };

  const withStats = await Promise.all((competitors || []).map(async (c) => {
    const { data: videos } = await supabase
      .from('competitor_videos')
      .select('video_data')
      .eq('competitor_id', c.id)
      .eq('workspace_id', ALLIANZ_WORKSPACE_ID);

    const count = (videos || []).length;
    const avgViews = count > 0
      ? Math.round((videos || []).reduce((s, v) => s + (v.video_data?.views || 0), 0) / count)
      : 0;
    const topVideoViews = count > 0
      ? Math.max(...(videos || []).map(v => v.video_data?.views || 0))
      : 0;

    return { ...c, videoCount: count, avgViews, topVideoViews };
  }));

  return { statusCode: 200, headers: cors, body: JSON.stringify({ competitors: withStats }) };
};
