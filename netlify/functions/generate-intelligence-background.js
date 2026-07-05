const { default: Anthropic } = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

const ALLIANZ_WORKSPACE_ID = 'a0000000-0000-0000-0000-000000000001';

exports.handler = async () => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  try {
    const { data: analyses, error } = await supabase
      .from('analyses')
      .select('platform, analysis, created_at')
      .eq('workspace_id', ALLIANZ_WORKSPACE_ID)
      .eq('status', 'done');

    if (error) throw error;

    const summaries = analyses.map(a => ({
      platform: a.platform,
      viralScore: a.analysis?.viralScore,
      hookScore: a.analysis?.hookScore,
      retentionScore: a.analysis?.retentionScore,
      emotionScore: a.analysis?.emotionScore,
      ctaScore: a.analysis?.ctaScore,
      emotionTriggered: a.analysis?.emotionTriggered,
      hookFormula: a.analysis?.hookFormula,
      whyItWorked: a.analysis?.whyItWorked,
      warningSignals: a.analysis?.warningSignals,
    }));

    const prompt = `You are analysing a batch of ${summaries.length} viral video breakdowns already generated for Allianz Housing Limited (UK supported/transitional accommodation, targeting Universal Credit/DSS claimants, posting on TikTok and Instagram).

Find the recurring PATTERNS across all of them — not a summary of any single video. Return ONLY raw JSON, no markdown, no code fences.

DATA (${summaries.length} analysed videos):
${JSON.stringify(summaries, null, 2)}

Return this exact structure:
{
  "summary": "<2-3 sentence overview of what's working across all analysed content>",
  "topHookFormulas": [
    { "formula": "<recurring hook pattern>", "frequency": <how many videos used it>, "avgViralScore": <avg score of videos using it> }
  ],
  "bestEmotion": "<single emotion that correlates with highest viral scores>",
  "emotionBreakdown": [
    { "emotion": "<name>", "avgViralScore": <number>, "count": <number> }
  ],
  "platformInsights": "<1-2 sentences on TikTok vs Instagram differences if enough data from both, otherwise note if one platform dominates the data>",
  "recommendations": ["<specific actionable recommendation 1>", "<recommendation 2>", "<recommendation 3>"],
  "recurringWarnings": ["<any warning signal that shows up more than once, if any>"]
}`;

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].text.trim();
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) throw new Error('Claude returned invalid JSON');
    const playbook = JSON.parse(text.slice(jsonStart, jsonEnd + 1));

    await supabase
      .from('intelligence')
      .upsert({
        workspace_id: ALLIANZ_WORKSPACE_ID,
        status: 'done',
        playbook,
        analyses_count: summaries.length,
        generated_at: new Date().toISOString(),
      }, { onConflict: 'workspace_id' });

    return { statusCode: 200, body: 'ok' };
  } catch (err) {
    await supabase
      .from('intelligence')
      .upsert({ workspace_id: ALLIANZ_WORKSPACE_ID, status: 'failed' }, { onConflict: 'workspace_id' });
    console.error('Intelligence generation failed:', err.message);
    return { statusCode: 500, body: err.message };
  }
};
