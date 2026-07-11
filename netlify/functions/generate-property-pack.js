const { randomUUID } = require('crypto');
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

  let property, platform;
  try { ({ property, platform = 'tiktok' } = JSON.parse(event.body)); } catch {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }
  if (!property || !property.trim()) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'property required' }) };

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data: rooms, error: roomsErr } = await supabase
    .from('rooms')
    .select('id, name, description')
    .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
    .eq('property', property)
    .eq('status', 'needs_filling');

  if (roomsErr) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: roomsErr.message }) };
  if (!rooms || rooms.length === 0) {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: `No rooms marked "needs filling" under "${property}"` }) };
  }

  const batchId = randomUUID();

  // One overview script + one script per room, all placeholders until the background job fills them in
  const placeholders = [
    { workspace_id: ALLIANZ_WORKSPACE_ID, batch_id: batchId, title: `Generating overview — ${property}`, hook: '', body: '', original_body: '', cta: '', why: '', platform, status: 'pending', property_note: property },
    ...rooms.map(r => ({
      workspace_id: ALLIANZ_WORKSPACE_ID, batch_id: batchId, title: `Generating — ${r.name}`, hook: '', body: '', original_body: '', cta: '', why: '', platform, status: 'pending',
      property_note: `${r.name}${r.description ? ` — ${r.description}` : ''}`,
    })),
  ];

  const { data: inserted, error: insertErr } = await supabase.from('scripts').insert(placeholders).select('id');
  if (insertErr) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: insertErr.message }) };

  // inserted[0] is the overview row, inserted[1..] map 1:1 to `rooms` in order
  const overviewId = inserted[0].id;
  const roomAssignments = rooms.map((r, i) => ({ scriptId: inserted[i + 1].id, room: r }));

  await fetch(`${process.env.URL}/.netlify/functions/generate-property-pack-background`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ overviewId, roomAssignments, property, platform }),
  });

  return { statusCode: 200, headers: cors, body: JSON.stringify({ batchId, count: inserted.length }) };
};
