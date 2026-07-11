const { default: Anthropic } = require('@anthropic-ai/sdk');
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

  let scriptId, roomDescription;
  try {
    ({ scriptId, roomDescription } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  if (!scriptId || !roomDescription) {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'scriptId and roomDescription required' }) };
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data: script, error: fetchErr } = await supabase
    .from('scripts')
    .select('*')
    .eq('id', scriptId)
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
    .single();

  if (fetchErr || !script) return { statusCode: 404, headers: cors, body: JSON.stringify({ error: 'Script not found' }) };

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Always customise from the untouched base script — never from a previously
  // room-customised body, otherwise re-matching this script to a different
  // room on a later trip would stack the old room's details into the new one.
  const baseBody = script.original_body || script.body;

  const prompt = `You are editing a short TikTok/Instagram script for Allianz Housing Limited. The presenter is on camera at a real property.

Your task: weave 1-2 natural sentences about the specific room into the script body. The tone is casual, direct — like the presenter is genuinely showing the viewer around. Do NOT add formal language or anything corporate.

ROOM BEING FILMED IN:
${roomDescription}

ORIGINAL SCRIPT BODY:
${baseBody}

Return ONLY the updated script body. No preamble, no explanation, no markdown. Just the script text with the room detail woven in naturally.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  });

  const updatedBody = response.content[0].text.trim();

  const { error: updateErr } = await supabase
    .from('scripts')
    .update({ body: updatedBody, property_note: roomDescription, original_body: baseBody })
    .eq('id', scriptId)
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID);

  if (updateErr) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: updateErr.message }) };

  return { statusCode: 200, headers: cors, body: JSON.stringify({ body: updatedBody }) };
};
