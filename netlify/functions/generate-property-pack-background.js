const { default: Anthropic } = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

const ALLIANZ_WORKSPACE_ID = 'a0000000-0000-0000-0000-000000000001';
const FAILED_MARKER = 'GENERATION_FAILED';

exports.handler = async (event) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  let overviewId, roomAssignments, property, platform;
  try { ({ overviewId, roomAssignments, property, platform } = JSON.parse(event.body)); } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const allIds = [overviewId, ...roomAssignments.map(a => a.scriptId)];

  try {
    const { data: intel } = await supabase
      .from('intelligence')
      .select('playbook, analyses_count')
      .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
      .eq('status', 'done')
      .maybeSingle();
    const playbookContext = intel?.playbook ? `

LEARNED PATTERNS FROM ${intel.analyses_count} PAST ANALYSES — apply where relevant:
${JSON.stringify(intel.playbook, null, 2)}
` : '';

    const roomList = roomAssignments.map((a, i) => `${i + 1}. ${a.room.name}${a.room.description ? ` — ${a.room.description}` : ''}`).join('\n');

    const prompt = `You are a viral content strategist for Allianz Housing Limited — a UK supported/transitional accommodation provider. Target audience: Universal Credit (UC) and DSS claimants seeking housing across the UK. Every property already accepts UC/DSS, no deposit, bills included — this is a given, don't treat it as a differentiator. Content posted to @allianzhousinguk on ${platform}.
${playbookContext}
You're filming at ONE property: "${property}", which has ${roomAssignments.length} individual room(s) available:
${roomList}

Generate a coordinated content SET for this single filming trip:
1. ONE "overview" script — a walkthrough of the whole property, presenter on camera, showing the general vibe/location/communal feel. 30-60 seconds.
2. ONE short "mini" script PER ROOM listed above — quick, punchy, 15-25 seconds each, focused specifically on that one room's own features (the ones actually listed for it, don't invent details).

IMPORTANT — several of these rooms may have near-identical descriptions (e.g. all "double bed, en-suite, fully furnished"). Do NOT let that produce near-identical scripts. Every room script must open with a DIFFERENT hook angle and lead with a DIFFERENT emphasis, even when the underlying features overlap — vary across things like: speed of move-in, price/affordability framing, a specific detail about that room's position in the building (e.g. "the corner room", "upstairs", "the quiet one at the back"), a different emotional angle (relief, excitement, FOMO, curiosity), or a different opening visual beat (start on the bed, start on the window, start walking in the door). If two rooms truly have nothing distinguishing them, invent a small, plausible, non-fabricated-fact way to differentiate the FRAMING (not the specs) — e.g. describing it as "room two of the tour" with a callback to the previous room, or a different rhetorical question to open with. Read back your ${roomAssignments.length} room scripts before finalizing — if any two feel copy-pasted, rewrite one.

Casual, direct tone — NOT corporate. Presenter genuinely showing the viewer around.

Return ONLY raw JSON, no markdown, no code fences, in this exact structure:
{
  "overview": { "title": "<title>", "hook": "<opening 3 sec>", "body": "<30-60 sec script>", "cta": "Apply now at referrals@allianzhousing.org", "why": "<one sentence>" },
  "rooms": [
    { "roomIndex": 1, "title": "<title>", "hook": "<opening 3 sec>", "body": "<15-25 sec script>", "cta": "Apply now at referrals@allianzhousing.org", "why": "<one sentence>" }
  ]
}
"rooms" must have exactly ${roomAssignments.length} entries, one per numbered room above, with "roomIndex" matching the room's number in the list.`;

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].text.trim();
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) throw new Error('Claude returned invalid JSON');
    const result = JSON.parse(text.slice(jsonStart, jsonEnd + 1));

    const updates = [];
    if (result.overview) {
      updates.push(supabase.from('scripts').update({
        title: result.overview.title || `Overview — ${property}`,
        hook: result.overview.hook || '',
        body: result.overview.body || '',
        original_body: result.overview.body || '',
        cta: result.overview.cta || '',
        why: result.overview.why || '',
      }).eq('id', overviewId));
    }
    (result.rooms || []).forEach(r => {
      const assignment = roomAssignments[r.roomIndex - 1];
      if (!assignment) return;
      updates.push(supabase.from('scripts').update({
        title: r.title || assignment.room.name,
        hook: r.hook || '',
        body: r.body || '',
        original_body: r.body || '',
        cta: r.cta || '',
        why: r.why || '',
      }).eq('id', assignment.scriptId));
    });

    await Promise.all(updates);
    return { statusCode: 200, body: 'ok' };
  } catch (err) {
    console.error('Property pack generation failed:', err.message);
    await supabase.from('scripts').update({ title: FAILED_MARKER, body: err.message }).in('id', allIds);
    return { statusCode: 500, body: err.message };
  }
};
