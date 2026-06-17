import Anthropic from '@anthropic-ai/sdk';
import fetch from 'node-fetch';

const APIFY_BASE = 'https://api.apify.com/v2';

function detectPlatform(url) {
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('instagram.com')) return 'instagram';
  throw new Error('Unsupported URL. Paste a TikTok or Instagram link.');
}

async function startApifyRun(actorId, input) {
  const token = process.env.APIFY_API_KEY;
  const res = await fetch(`${APIFY_BASE}/acts/${actorId}/runs?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Apify start failed (${res.status}): ${await res.text()}`);
  const { data } = await res.json();
  return data;
}

async function pollRun(actorId, runId) {
  const token = process.env.APIFY_API_KEY;
  const MAX_POLLS = 40;
  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise(r => setTimeout(r, 4000));
    const res = await fetch(`${APIFY_BASE}/acts/${actorId}/runs/${runId}?token=${token}`);
    const { data } = await res.json();
    if (data.status === 'SUCCEEDED') return;
    if (data.status === 'FAILED' || data.status === 'ABORTED') {
      throw new Error(`Apify run ${data.status}`);
    }
  }
  throw new Error('Apify run timed out after 160 seconds');
}

async function fetchDatasetItems(actorId, runId) {
  const token = process.env.APIFY_API_KEY;
  const res = await fetch(
    `${APIFY_BASE}/acts/${actorId}/runs/${runId}/dataset/items?token=${token}`
  );
  if (!res.ok) throw new Error(`Apify dataset fetch failed (${res.status})`);
  return res.json();
}

async function scrapeVideo(url) {
  const platform = detectPlatform(url);

  if (platform === 'tiktok') {
    const run = await startApifyRun('clockworks~free-tiktok-scraper', {
      postURLs: [url],
      maxPostsPerPage: 1,
      shouldDownloadVideos: false,
      shouldDownloadCovers: false,
    });
    await pollRun('clockworks~free-tiktok-scraper', run.id);
    const items = await fetchDatasetItems('clockworks~free-tiktok-scraper', run.id);
    if (!items.length) throw new Error('TikTok scraper returned no results');
    const v = items[0];
    return {
      platform,
      url,
      description: v.text || v.desc || '',
      plays: v.playCount ?? v.stats?.playCount ?? 0,
      likes: v.diggCount ?? v.stats?.diggCount ?? 0,
      comments: v.commentCount ?? v.stats?.commentCount ?? 0,
      shares: v.shareCount ?? v.stats?.shareCount ?? 0,
      hashtags: v.hashtags?.map(h => h.name || h) ?? [],
      author: v.authorMeta?.name ?? v.author?.uniqueId ?? '',
      duration: v.videoMeta?.duration ?? v.duration ?? 0,
      createdAt: v.createTimeISO ?? '',
    };
  } else {
    const run = await startApifyRun('apify~instagram-reel-scraper', {
      directUrls: [url],
      resultsLimit: 1,
    });
    await pollRun('apify~instagram-reel-scraper', run.id);
    const items = await fetchDatasetItems('apify~instagram-reel-scraper', run.id);
    if (!items.length) throw new Error('Instagram scraper returned no results');
    const v = items[0];
    return {
      platform,
      url,
      description: v.caption ?? v.alt ?? '',
      plays: v.videoPlayCount ?? v.playsCount ?? 0,
      likes: v.likesCount ?? v.likes ?? 0,
      comments: v.commentsCount ?? v.comments ?? 0,
      hashtags: v.hashtags ?? [],
      author: v.ownerUsername ?? v.owner?.username ?? '',
      duration: v.videoDuration ?? 0,
      createdAt: v.timestamp ?? '',
    };
  }
}

async function analyseWithClaude(videoData) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `You are a viral content strategist for Allianz Housing Limited — a UK supported/transitional accommodation provider. The target audience is Universal Credit (UC) and DSS claimants looking for housing across the UK. Filming is done in Coventry, posting to @allianzhousinguk on TikTok and Instagram.

Analyse this viral housing video and return a full content intelligence report.

VIDEO DATA:
${JSON.stringify(videoData, null, 2)}

Return your response in this exact structure:

## VIRAL ANALYSIS

**Viral Score:** [1-10]/10
**Hook Score:** [1-10]/10

**Why It Worked:**
[2-3 sentences on the core viral mechanics — what made people stop, watch, and share]

**Emotion Triggered:**
[Primary emotion, e.g. Hope / Relief / FOMO / Curiosity / Shock / Validation]

**Audience Insight:**
[Who resonated with this and why — keep it focused on UC/DSS claimants needing housing]

---

## 3 READY-TO-FILM SCRIPTS FOR ALLIANZ HOUSING

### Script 1: [Title]
**Hook (first 3 seconds):**
[Opening line — should stop the scroll instantly]

**Script:**
[30-60 seconds. Presenter on camera, Coventry property. Casual, direct — NOT corporate. Mention UC/DSS eligibility, no deposit, bills included where relevant. First person.]

**CTA:** Apply at referrals@allianzhousing.org

---

### Script 2: [Title]
**Hook (first 3 seconds):**
[Opening line]

**Script:**
[30-60 seconds. Same tone.]

**CTA:** Apply at referrals@allianzhousing.org

---

### Script 3: [Title]
**Hook (first 3 seconds):**
[Opening line]

**Script:**
[30-60 seconds. Same tone.]

**CTA:** Apply at referrals@allianzhousing.org

---

## 5 STANDALONE HOOKS

1. [Hook — works as a TikTok/Reel opening line on its own]
2. [Hook]
3. [Hook]
4. [Hook]
5. [Hook]

---

## HASHTAG STRATEGY

**High reach:**
[6-8 broad hashtags]

**Niche/targeted:**
[6-8 specific hashtags for UC/housing audience]

**Branded:**
#allianzhousing #allianzhousinguk #UCHousing`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.content[0].text;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let url;
  try {
    ({ url } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  if (!url || typeof url !== 'string') {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Missing url field' }),
    };
  }

  try {
    const videoData = await scrapeVideo(url.trim());
    const analysis = await analyseWithClaude(videoData);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ videoData, analysis }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
