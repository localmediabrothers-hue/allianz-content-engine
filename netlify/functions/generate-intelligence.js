const { createClient } = require('@supabase/supabase-js');

const ALLIANZ_WORKSPACE_ID = 'a0000000-0000-0000-0000-000000000001';
const MIN_ANALYSES = 3;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Method not allowed' }) };

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data: analyses, error } = await supabase
    .from('analyses')
    .select('id, platform, analysis, created_at')
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
    .eq('status', 'done');

  if (error) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: error.message }) };

  if ((analyses || []).length < MIN_ANALYSES) {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ error: `Need at least ${MIN_ANALYSES} completed analyses — you have ${(analyses||[]).length}. Analyse more videos first.` }),
    };
  }

  await supabase
    .from('intelligence')
    .upsert({ workspace_id: ALLIANZ_WORKSPACE_ID, status: 'generating' }, { onConflict: 'workspace_id' });

  await fetch(`${process.env.URL}/.netlify/functions/generate-intelligence-background`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  return { statusCode: 200, headers: cors, body: JSON.stringify({ status: 'generating' }) };
};
