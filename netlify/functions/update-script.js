const { createClient } = require('@supabase/supabase-js');

const ALLIANZ_WORKSPACE_ID = 'a0000000-0000-0000-0000-000000000001';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let scriptId, status, viewsAfterUse;
  try {
    ({ scriptId, status, viewsAfterUse } = JSON.parse(event.body));
  } catch (e) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  if (!scriptId || !status) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'scriptId and status are required' }) };
  }

  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const updates = { status };
    if (viewsAfterUse !== undefined) updates.views_after_use = viewsAfterUse;

    const { data, error } = await supabase
      .from('scripts')
      .update(updates)
      .eq('id', scriptId)
      .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
      .select()
      .single();

    if (error) throw error;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ script: data }),
    };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: err.message }) };
  }
};
