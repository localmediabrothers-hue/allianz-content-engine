# Allianz Content Intelligence Engine
## Claude Code Project Brief — Read This First

---

## Who This Is For
**Faisal** (LMB Boss) — runs two businesses:
1. **Allianz Housing Limited** — UK supported/transitional accommodation, operates nationwide, filming currently done in Coventry properties. Tenants are Universal Credit / DSS claimants. RSL partner is Relliance. 155+ management agents, 93+ properties.
2. **Local Media Brothers (LMB)** — AI automation and media/marketing agency that built this tool.

---

## What This App Does
A **viral content analysis and script generation engine** for Allianz Housing's TikTok and Instagram social media pages. The goal is tenant recruitment — finding UC claimants who need housing.

**User flow:**
1. Faisal pastes a TikTok or Instagram URL of a viral housing video
2. App scrapes the video data via Apify (views, likes, comments, caption, hashtags)
3. Audio is transcribed via AssemblyAI or Whisper
4. All data is sent to Claude API for analysis
5. Claude returns: viral score, hook score, why it worked, emotion triggered, audience insight
6. Claude generates 3 ready-to-film scripts adapted for Allianz Housing
7. Claude generates 5 standalone hooks and a hashtag strategy

---

## Tech Stack
- **Frontend:** React + Vite (this project)
- **Backend:** Netlify Functions (serverless, `/netlify/functions/`)
- **Video scraping:** Apify — TikTok Scraper + Instagram Scraper actors
- **Transcription:** AssemblyAI (or Whisper API)
- **AI Analysis + Script Generation:** Anthropic Claude API (claude-sonnet-4-6)
- **Deployment:** Netlify (target URL: allianz-content-engine.netlify.app)
- **Styling:** Pure CSS-in-JS, dark theme, black/green/blue palette

---

## Project Structure
```
allianz-content-engine/
├── netlify/
│   └── functions/
│       └── analyse.js        ← Netlify serverless function (Apify + Claude)
├── src/
│   ├── App.jsx               ← Main UI component
│   └── main.jsx              ← Vite entry point
├── .env                      ← API keys (never commit this)
├── .gitignore
├── CLAUDE.md                 ← This file
├── netlify.toml              ← Netlify config
├── package.json
└── vite.config.js
```

---

## Environment Variables
These go in `.env` at the root (never commit to GitHub):
```
ANTHROPIC_API_KEY=sk-ant-...
APIFY_API_KEY=apify_api_...
ASSEMBLIAI_API_KEY=...        (when added)
```

In Netlify dashboard these must also be set under Site Settings → Environment Variables.

---

## Current Status
- [x] Vite React project created
- [x] UI component built (dark theme, viral score, scripts output)
- [x] Claude API integration in frontend (demo mode)
- [ ] Netlify Functions backend (Apify + Claude server-side) — IN PROGRESS
- [ ] Real Apify TikTok scraper connected
- [ ] Real Apify Instagram scraper connected  
- [ ] AssemblyAI transcription connected
- [ ] GitHub repo created and pushed
- [ ] Deployed to Netlify
- [ ] .env variables set in Netlify dashboard

---

## Content Strategy Context
- **Target audience:** Universal Credit claimants, DSS tenants, people struggling to find housing UK-wide
- **Filming locations:** Coventry properties (for now), nationwide operation
- **Posting platforms:** TikTok (@allianzhousinguk), Instagram (@allianzhousinguk)
- **Content goal:** Tenant recruitment — drive applications to referrals@allianzhousing.org
- **Application form:** Jotform (already live)
- **Tone:** Casual, direct, presenter on camera — NOT corporate

---

## Key Viral Hooks for Housing Content
1. "If you're on Universal Credit in [city], you might qualify for a fully furnished room — no deposit, bills included"
2. "Nobody tells you this about DSS housing..."
3. "POV: you just found out you qualify for free housing"
4. "3 things people get wrong about housing benefit"
5. "This is what £0 upfront gets you in Coventry right now"

---

## Next Steps (In Order)
1. Create `/netlify/functions/analyse.js` — server-side function
2. Create `netlify.toml` — deployment config
3. Update `src/App.jsx` — point to Netlify function instead of direct API call
4. Create `.env` with real API keys
5. Push to GitHub repo `FAZIZAZAZ/allianz-content-engine`
6. Connect repo to Netlify
7. Set environment variables in Netlify dashboard
8. Deploy and test with real TikTok URL

---

## Other Allianz Tools (For Context)
- Tracker: allianz-tracker-v2.onrender.com (GitHub: FAZIZAZAZ/allianz-tracker-v2)
- Inspection form: allianz-inspections.netlify.app
- Jotform referral form: routes to referrals@allianzhousing.org
- EmailJS: Service ID service_yn6enh8, Template ID template_nmvegzq

---

## Team
- **Faisal** — owner, decision maker (LMB Boss on Claude Code)
- **Ayan/Imran** — on-camera presenter for videos
- **LMB** — built and maintains this tool
