# ScrapeVerse Hackathon — Comprehensive Requirements Analysis

**WeMakeDevs × Bright Data · Aug 17–23, 2026 · Self-Healing Scrapers**
**Analysis Date:** 2026-08-18 · **Source:** `https://www.wemakedevs.org/blogs/scrape-verse-kick-off` + raw markdown `https://raw.githubusercontent.com/WeMakeDevs/blogs/main/posts/scrape-verse-kick-off.md`
**Mode:** Before-build requirements reconstruction — NO assumptions from your repo. Fan-out: 5 parallel analysts, synthesized.
**Reports Generated:** `/tmp/scrapeverse-requirements-report.html` (49 KB) + `/tmp/scrapeverse-blueprint.html` (80 KB) — this MD is the exhaustive canonical record in repo root.
**Author of Brief:** Sachin Sharma, CMO WeMakeDevs · Date Published: 2026-08-17 · Tags: `hackathon`, `technical`

> **Where this project lives:** `/Users/jay/Documents/Projects/scrape-verse-project` (peeked 2026-08-18: `app/`, `components/`, `docs/`, `src/`, `tests/`, `node_modules/`, etc. — NOT audited yet per your instruction).

---

## Table of Contents

1. [Executive Summary — What Must Be Built](#1-executive-summary--what-must-be-built)
2. [Hackathon at a Glance — Facts, Dates, Partners, Prizes](#2-hackathon-at-a-glance--facts-dates-partners-prizes)
3. [The Theme — Why Self-Healing](#3-the-theme--why-self-healing)
4. [Mandatory Platform Stack — The 6-Step CLI Judges Will Tick](#4-mandatory-platform-stack--the-6-step-cli-judges-will-tick)
5. [Collector ID Lifecycle & API — POST /dca/trigger](#5-collector-id-lifecycle--api--post-dcatrigger)
6. [Bright Data Handles vs You Handle — Infrastructure Split](#6-bright-data-handles-vs-you-handle--infrastructure-split)
7. [Terminal-First Requirement — Coding Agent as UI](#7-terminal-first-requirement--coding-agent-as-ui)
8. [Scraper Types Deep Dive — PDP / Discovery / Sitemap / Search](#8-scraper-types-deep-dive--pdp--discovery--sitemap--search)
9. [Judging Scorecards — Every Track, Every Weight](#9-judging-scorecards--every-track-every-weight)
10. [Cross-Track Strategy — Architect Once, Qualify for Three](#10-cross-track-strategy--architect-once-qualify-for-three)
11. [Project Ideas — All 9 Ranked with Scraper Type Map](#11-project-ideas--all-9-ranked-with-scraper-type-map)
12. [Differentiation — The "Why Not Prebuilt?" Test (800+ Prebuilts)](#12-differentiation--the-why-not-prebuilt-test-800-prebuilts)
13. [Scope — MVP in 48h vs Stretch in 6 Days (Per Idea)](#13-scope--mvp-in-48h-vs-stretch-in-6-days-per-idea)
14. [Hybrids That Win — A/B/C/D](#14-hybrids-that-win--abcd)
15. [Anti-Patterns — Why Good Pitches Fail](#15-anti-patterns--why-good-pitches-fail)
16. [Best Practices — The 5 Official + What Judges Check](#16-best-practices--the-5-official--what-judges-check)
17. [Public Data Only — Safe vs Risky, Legal Boundaries](#17-public-data-only--safe-vs-risky-legal-boundaries)
18. [Secret Management — .env, Tokens, Collector IDs](#18-secret-management--env-tokens-collector-ids)
19. [Clean Code (Spider-Sense) — Concrete Checklist (20 Items)](#19-clean-code-spider-sense--concrete-checklist-20-items)
20. [Collector-as-API — 5 Integration Patterns](#20-collector-as-api--5-integration-patterns)
21. [Self-Healing Architecture — State Machine, Failure Modes, Detection, Automation, Demo](#21-self-healing-architecture--state-machine-failure-modes-detection-automation-demo)
22. [Credit Economics — Free Tier, Promo, Per-Participant, Pool](#22-credit-economics--free-tier-promo-per-participant-pool)
23. [Engineering & Demo Hard Requirements — Implicit Technical Needs](#23-engineering--demo-hard-requirements--implicit-technical-needs)
24. [Pre-Submission Checklists — 10 Minutes Before Push](#24-pre-submission-checklists--10-minutes-before-push)
25. [Repo & Pitch — What Judges Open First, 3-Minute Order](#25-repo--pitch--what-judges-open-first-3-minute-order)
26. [LinkedIn (Daily Bugle) — Winning Post Framework & Tactics](#26-linkedin-daily-bugle--winning-post-framework--tactics)
27. [Risk Register — 7 Risks with Mitigations & Guardrails](#27-risk-register--7-risks-with-mitigations--guardrails)
28. [Small Details That Matter — Every Detail, No Matter How Small](#28-small-details-that-matter--every-detail-no-matter-how-small)
29. [Source & Provenance — How This Analysis Was Built](#29-source--provenance--how-this-analysis-was-built)
30. [Next Step — What the Upcoming Repo Audit Will Check](#30-next-step--what-the-upcoming-repo-audit-will-check)

---

## 1. Executive Summary — What Must Be Built

**This hackathon is testing one thing:** Can you turn an unreliable long-tail website into a reliable, typed API that a coding agent drives from the terminal — and that heals itself when the site changes.

- **If you swap Bright Data for `requests + proxy` and your demo doesn't change, you lose.** Judges score platform advocacy, not scraping.
- **Four pillars for the Grand Prize (Web-Slinger):** Build in Studio → Drive from agent → Heal on change → Build WITH output (as a product).
- **One winning thesis to memorize and repeat in pitch:**
  > *"We turned an unreliable, undocumented long-tail website into a reliable, typed, self-healing API that our coding agent can reason over — built in Scraper Studio, driven from the terminal, and powering [your product]."*
- **Non-negotiables:**
  - Custom Collector `c_*` via CLI from a natural-language prompt (not dashboard clicks).
  - Long-tail public site with no prebuilt — prove with Catalog “0 results” screenshot.
  - `POST /dca/trigger` wired programmatically and observed running (cron or agent).
  - Deliberate breakage → `bdata scraper heal "<what broke>"` → `approve` → re-run with **same** `c_*`, downstream untouched — recorded.
  - Terminal as primary UI: `CLAUDE.md` + co-authored git + terminal recording + GH Actions.
  - Public data only, zero PII, no paywall/login.
  - Deployed URL with freshness badge, not localhost screenshot.
  - lint/type/tests green on fresh clone.

---

## 2. Hackathon at a Glance — Facts, Dates, Partners, Prizes

| Field | Value |
|-------|-------|
| **Name** | ScrapeVerse Hackathon |
| **Partners** | WeMakeDevs × Bright Data |
| **Blog URL** | `https://www.wemakedevs.org/blogs/scrape-verse-kick-off` |
| **Raw Markdown URL** | `https://raw.githubusercontent.com/WeMakeDevs/blogs/main/posts/scrape-verse-kick-off.md` (resolved via GitHub API: repo `WeMakeDevs/blogs`, folder `posts/`, file `scrape-verse-kick-off.md`; cover image: `images/scrape-verse-kick-off/cover.png`) |
| **Brief Date Published** | 2026-08-17 |
| **Author** | Sachin Sharma, CMO WeMakeDevs (@WeMakeDevs) |
| **Tags** | `hackathon`, `technical` |
| **Window** | Went live **2026-08-17** → runs **until August 23rd** (7 days) — analysis generated on **2026-08-18 11:45–11:59 UTC** |
| **Theme Open-Ended** | Build anything that uses Scraper Studio to turn websites into structured data |
| **Contact** | `contact@wemakedevs.org` · `https://www.wemakedevs.org` |
| **Prizes Total** | **$15,000** including NVIDIA DGX Spark, iPads, Keychron keyboards, Galaxy Watch, Bright Data credits, swag |

**Prize Tracks (6):**

| # | Track | Prize | Awarded For | Judged By |
|---|-------|-------|-------------|-----------|
| 1 | 🏆 **Grand Prize — Web-Slinger Track** | **NVIDIA DGX Spark · $5,000 value** | **Best Use of Bright Data** — how effectively you use the platform from Studio build → agent driving → website-change handling → what you build with output | Technical judges |
| 2 | 🦸 **Suit-Up Track** | **Apple iPad — every member of winning team** | **Best UI** — data is only useful when people understand/interact; looks/feels like finished product | Design/product judges |
| 3 | 🕷️ **Spider-Sense Track** | **Keychron Keyboard — every member** | **Best Clean Code** — readable, structured, reliable, edge-case handling, contributor-easy | Engineering judges |
| 4 | 🎟️ **The Raffle** | **Iron Man MK5 Helmet — Black Edition, voice control** | **Luck** — just register, no track, no submission, no code needed | Random |
| 5 | 🗞️ **Daily Bugle Track** | **Samsung Galaxy Watch** | **Best LinkedIn Post** — post about build/story, tag WeMakeDevs; LinkedIn only, nowhere else counts | Community/marketing |
| 6 | 💳 **Bright Data Credits** | **$2,500 pool across teams** + **$50 per participant** | Grants — free tier 5,000 credits/month no card required; promo `wemakedevs` in Billing for extra $50 | Organizers + platform |

---

## 3. The Theme — Why Self-Healing

**Exact wording from brief:**

- *“The web is constantly changing, and that makes building reliable web scrapers much harder to extract data from a page. A scraper can work perfectly when you first build it, but a website redesign, a renamed CSS class, or a small change in the page structure can leave your pipeline returning incomplete or empty results.”*
- *“WeMakeDevs and Bright Data are inviting developers, builders, and AI engineers to enter the Scrape-Verse and build web scrapers that don’t just collect data, but can also adapt, recover, and keep working when the web changes.”*
- *“Instead of treating scraper maintenance as a future problem, build reliability into the scraper from day one.”*
- *“Whether you’re tracking prices, monitoring competitors, building a RAG knowledge base, or researching developer trends, the real challenge isn’t just collecting data, but keeping the collection pipeline running reliably.”*

**Judging implication:** The 2026-08-17 brief uses “self-healing” as the title concept (slide: “Why self-healing scrapers?”). A submission with no healing demo is generic scraping and loses Grand Prize even if the product is polished.

---

## 4. Mandatory Platform Stack — The 6-Step CLI Judges Will Tick

**Brief Sections:** “Bright Data Scraper Studio”, “Steps to build a custom scraper”, “Let’s get started” (Steps 1–6).

| Step | Command (verbatim from brief) | Purpose | What Judges Will Verify | Failure Mode |
|------|-------------------------------|---------|-------------------------|--------------|
| **1. CLI Bootstrap** | `npx -p @brightdata/cli` | Run CLI without global install, no dashboard hopping | Participant uses `@brightdata/cli` via `npx`; `package.json`/demo shows `npx` invocation; Node ≥18 present | Global install or `npm i -g @brightdata/cli` misses the `npx -p` intent |
| **2. Login** | `bdata login` | Connect terminal to Bright Data account (browser OAuth) | Login succeeded; subsequent commands work; CI uses env-injected token not interactive flow | No login → all downstream blocked |
| **3. Create** | `bdata scraper create <URL> "<data you need>"` | AI generates scraper from URL + NL description | **Critical artifact.** Collector ID `c_*` exists and is documented. Prompt verbatim must be specific. Vague `"get data"` = weak. | Creating with vague prompt; creating via dashboard clicks only |
| **4. Run** | `bdata scraper run <COLLECTOR_ID> <URL>` | Trigger collection → structured JSON | JSON evidence from terminal (`--output data.json`/poll). Same `c_*` from step 3. | Running with different `c_*` than created |
| **5. Heal** | `bdata scraper heal <COLLECTOR_ID> "<what broke>"` | Generate fix when site changes | **Theme compliance mandatory.** Real breakage described in NL, not `"fix it"`. Same `c_*`. | Skipping heal; using `c_new` instead of healing; generic description |
| **6. Approve/Reject** | `bdata scraper approve <COLLECTOR_ID>` · `bdata scraper approve c_mpohus372o5tmid1jk --reject` (example ID from brief) | Human-in-the-loop gate on proposed diff | Shows review (approve or reject path). On reject, retry with sharper prompt. | Auto-merge without showing diff/review |

**Exact example from brief for reject:**

```bash
bdata scraper approve c_mpohus372o5tmid1jk --reject
```

**Judges’ 6-item checklist (from synthesized technical analysis):**

1. `c_*` referenced consistently across all steps (grep your repo).
2. All six shown from terminal/coding agent — screenshot/video/log required; dashboard-only creation penalized or disqualified for Grand Prize.
3. `heal` + `approve` on a real scenario (class rename, redesign, field reorder). Fabricated `"<what broke>"` with zero site change is weak.
4. `create` prompt quality: `"Extract product title, price, rating, stock for all SKUs on category with pagination"` ≫ `"get data"`.
5. Long-tail `create <URL>` must NOT be one of 800+ prebuilt Bright Data datasets/sites — custom URL required.
6. No multiple collectors for heal (mutate same ID).

**Sibling CLI docs:** The brief ships with images `scrape-verse-kick-off-1.webp` (graph), `-2.svg` (animated), `-3.webp` (login), `-4.webp` (create), `-5.webp` (run), `-6.webp` (heal), `-7.webp` (bulb), `-8.webp` (prizes).

---

## 5. Collector ID Lifecycle & API — POST /dca/trigger

**Format:** `c_*` — opaque string per Collector provisioned at `create`. Example in brief: `c_mpohus372o5tmid1jk`.

**Lifecycle state machine (text diagram):**

```
bdata scraper create ──► c_xxxxxxxx  (provisioned, AI compiled, proxies/browser/retries allocated)
        │
        ├──► bdata scraper run c_xxx <URL>                (manual trigger → job/snapshot)
        ├──► POST /dca/trigger  { collector_id:"c_xxx" }  (programmatic trigger)
        ├──► Scheduled trigger  (platform cron or GH Actions/Vercel)
        ├──► bdata scraper heal c_xxx "..."               (pending diff generated)
        └──► bdata scraper approve/reject c_xxx           (active — same c_xxx mutated)

continuity: downstream table/API/webhook NEVER repoints across heal
```

**Key properties:**

- **Mutability of ID is the contract.** Healing **must** retain the same `c_*`. `heal` rebinds selectors/logic, not the address. Creating `c_new` to “fix” = migration, not self-healing — judges deduct.
- **API endpoint:** `POST /dca/trigger` — documented as trigger interface. REST auth with token from `bdata login`/dashboard. Payload includes `collector_id` + optional `input: { url, custom_param }`.
- **Wire example (canonical):**

```bash
curl -X POST "https://api.brightdata.com/dca/trigger?collector=c_xxxxxxxx" \
  -H "Authorization: Bearer $BRIGHTDATA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"input":{"url":"https://target.com/page2"}}'
# → {"collection_id":"col_yyy","status":"triggered"}  then poll webhook / GET /dca/get_progress
```

- **Scheduling:** Bright Data handles native scheduling; **or** you manage your own cron (`node-cron`, GitHub Actions `schedule:`, Vercel Cron) that hits `/dca/trigger`. One must be documented and observed running (green checks/wall).
- **Storage:** Polling or webhook; never hardcode `c_*`. Env var `COLLECTOR_ID`/`BRIGHTDATA_COLLECTOR_ID`, fail-fast if missing.

**Judges will check:** `c_*` never hardcoded in repo, never logged, trigger is programmatic (`fetch`/`curl`/`axios`) not a manual dashboard button, response handling exists (`collection_id`, status poll, 429/pending/empty handling).

---

## 6. Bright Data Handles vs You Handle — Infrastructure Split

| Bright Data Handles (do NOT rebuild) | You Must Handle |
|--------------------------------------|-----------------|
| Proxy infrastructure (residential/mobile/ISP rotation, geo-targeting) | Natural-language data requirement (prompt engineering for `create`/`heal`) |
| Browser rendering (headless Chromium, JS execution, SPA hydration) | Collector ID storage, env management, API wiring (`/dca/trigger`) |
| CAPTCHA solving & bot unblocking (fingerprinting, TLS, header spoofing) | Downstream data handling: JSON parsing, validation (zod/jsonschema), storage (DB/file/S3), dedupe, idempotent upsert by `sku`/`url` |
| Retries, backoff, rate limiting, concurrency | Application layer: UI, API, analytics, alerts, viz built *on top* of structured output |
| Scheduling & triggering infra | Error handling for delivery: job polling, empty results, schema drift that *triggers* heal |
| Data delivery pipeline (JSON normalization, webhook/S3/snowflake delivery) | Demonstration harness: terminal-driven workflow, video/logs proving CLI usage |
| Self-healing AI (selector adaptation — the `heal` engine) | Compliance: public data only (no auth-walled/private — DQ if violated); never expose tokens/`.env` |

**Anti-pattern:** Importing `requests`/`selenium`/`playwright` for the core scrape, manual proxy rotation, or CAPTCHA solvers — delegate to platform and focus innovation on healing + product value.

---

## 7. Terminal-First Requirement — Coding Agent as UI

**Brief verbatim:** *“Keep the terminal as your UI”* — “Build from your coding agent, Claude Code, Cursor, or Codex. Use the dashboard only to check your Collector ID or configure a schedule.”

**Compliant — judges reward:**

- All `bdata` commands inside a coding agent terminal (Claude Code, Cursor Terminal, Codex, or `zsh`/`bash` recorded in demo).
- Git history shows agent co-authorship, `.cursor/rules`, `CLAUDE.md`, `AGENTS.md`, terminal logs.
- Prompts to the agent that generate `bdata` commands are visible.
- Video shows typing/pasting in terminal, not Bright Data dashboard clicks.
- Dashboard used only to (1) verify `c_abc123` delivered N records and (2) set schedule.

**Non-compliant — penalized:**

- Creating/running/healing exclusively via Bright Data web dashboard (Scraper Studio UI clicks).
- Dashboard screenshots as sole workflow proof.
- `bdata` run once then all iteration in dashboard.
- Single-commit `initial commit` zip — suggests export upload, not agent-native.

**Practical compliant pattern (verbatim from analysis):**

```bash
# In Claude Code terminal:
npx -p @brightdata/cli bdata login
bdata scraper create https://longtail-site.com/products "extract name, price, availability for all SKUs with pagination"
# capture c_abc123
bdata scraper run c_abc123 https://longtail-site.com/products --output data.json
# in app code:
# POST https://api.brightdata.com/dca/trigger -d '{"collector":"c_abc123","url":"..."}'
```

**Evidence stack — provide ≥3:**

| Artifact | Proves | Lives At |
|---------|--------|----------|
| Agent config & prompt history | Agent-native | `CLAUDE.md`, `.cursor/rules`, `.codex/config`, `AGENTS.md` |
| Git co-authorship | Iterative agent workflow | `git log --oneline` `Co-Authored-By: Claude` |
| Terminal recording | Actual terminal (not dashboard) | `/docs/terminal.cast`, Loom asciinema 60–90s |
| GH Actions / CI from agent | Automation as code | `.github/workflows/*.yml` with `POST /dca/trigger` |
| Dashboard minimalism statement | Dashboard only for checks | README: “Dashboard used 2×: verify 142 records + set cron `0 */6 * * *`” |

---

## 8. Scraper Types Deep Dive — PDP / Discovery / Sitemap / Search

**Heuristic to memorize:**

- **1 URL + 1 item** = PDP
- **1 URL + N items behind pagination** = Discovery
- **Exhaustive site-wide (200–2k+)** = Sitemap (preferred over Discovery when `sitemap.xml` exists)
- **No URL known, intent only** = Search

| Type | Input Required | When to Use | How It Works | Verbatim Example from Logic |
|------|---------------|-------------|--------------|-----------------------------|
| **PDP (Product Detail Page / Single Page)** | Single URL | One item page, consistent schema | AI extracts defined fields from that DOM | `create https://example.com/product/123 "title, price, description, images, variants, reviews"` · e-commerce product, listing, job post, profile |
| **Discovery (Listing → Detail)** | List/category URL | Crawl listing, discover N PDP links, then scrape each (pagination/infinite scroll auto) | Two-stage: discover → per-item PDP | `create https://example.com/category/laptops "discover all product links, then for each get title, price, specs"` |
| **Sitemap** | Domain or `sitemap.xml` URL | Site exposes `sitemap.xml` and you want exhaustive coverage | Parses `sitemap.xml` → scrape each enumerated URL | `create https://blog.example.com/sitemap.xml "all articles with title, author, date, content"` — blogs, news, docs with sitemaps |
| **Search (Keyword-powered)** | Keywords only (`keyword` + optional `country`, no URL) | Data defined by intent, not a known site | Platform SERP/search → scrape results → PDP | `"laptops under $1000 with 16GB RAM" "search and extract top 50 with title, price, retailer"` — price comparison, lead gen |

**Judges expect:** Correct type for your target with justification of why the other three were wrong (README). Misusing PDP for a listing (manual loop) demonstrates platform misunderstanding.

---

## 9. Judging Scorecards — Every Track, Every Weight

### 9.1 Grand Prize — Web-Slinger — Best Use of Bright Data — NVIDIA DGX Spark $5k

> Judge quote to memorize: *“how effectively you use the platform—from the scraper you build in Scraper Studio, to how you drive it from your coding agent, how it handles website changes, and what you ultimately build with the structured output”*

| Rank | Criterion | Weight | Explicit vs Implicit | 90–100 Signal | Disqualifies / Bottom 20% |
|------|-----------|--------|----------------------|---------------|---------------------------|
| **1** | **Self-Healing & Resilience** | **30%** | Explicit “how it handles website changes” · **Implicit #1 differentiator** | Live site change → heal log `selector .price-v1 not found → healed to [data-testid="price"]` → data flows → agent notified; schema drift retried with fallback chain | No mention; brittle XPath; code crashes on first null; “trust us it would heal” |
| **2** | **Drive From Coding Agent** | **25%** | Explicit “how you drive it from your coding agent” | Terminal NL → agent tool → Collector → streamed JSON → reasoning; agentic observe→plan→execute loop | Manual dashboard trigger; no agent; hardcoded fetch agent never touches |
| **3** | **Build in Studio** | **25%** | Explicit “the scraper you build in Scraper Studio” | Custom Collector on long-tail (e.g., niche B2B marketplace, regional RE, gov tenders), typed schema, pagination/JS, dedup; Studio screenshot + schema JSON in repo + `c_*` | One of 800+ prebuilts with no changes; hardcoded CSS selectors outside Studio; no schema validation |
| **4** | **Build WITH Output** | **20%** | Explicit “what you ultimately build with the structured output” | Collector consumed as API (`fetch` POST /dca/trigger) with persistence, diffing, alerting, viz; real use-case not just CSV | `data.csv` dump; mock data not live Collector |

Bonus tie-breakers: public-data ethics, Collector as live API, CAPTCHA/rate/schema handling.

### 9.2 Suit-Up — Best UI — iPad per member

> *“Data is only useful when people can actually understand and interact with it. This track is for the project that looks and feels like a finished product.”*

| Rank | Criterion | Weight | Wins vs Loses |
|------|-----------|--------|---------------|
| 1 | Finished product feel | 35% | Polished, **deployed URL**, loading/empty/error states, responsive vs localhost screenshot / Streamlit defaults, broken pagination |
| 2 | Data intelligibility | 25% | Filters, search, viz, comparisons, summaries vs raw JSON table dump |
| 3 | Interaction design | 20% | Agent chat → data → viz loop; NL queries over scraped data vs static dashboard |
| 4 | Data freshness signal | 10% | Live `last scraped` timestamp, auto-refresh, `healed at 14:03` badge — proves live Bright Data, not mock |
| 5 | Aesthetic consistency | 10% | Design system, typography, spacing — judges equate polish with discipline |

Disqualifies on sight if data is mocked/hardcoded. Must prove live pipeline.

### 9.3 Spider-Sense — Best Clean Code — Keychron per member

> *“Readable, structured, reliable code that handles edge cases and makes it easy for someone else to understand and contribute to the project.”*

| Rank | Criterion | Weight | What Judges Inspect |
|------|-----------|--------|---------------------|
| 1 | Reliability / Edge-case handling | 30% | `try/catch` around collector calls, retries, Zod/Pydantic validation, null handling, pagination failures, grace on structure change — not happy-path-only |
| 2 | Structure & modularity | 25% | `collectors/`, `agents/tools/`, `api/`, `lib/brightdata.ts` separation; Collector-as-API abstraction; env config; no secrets hardcoded |
| 3 | Readability | 20% | Intent names, typed schemas, `why` comments, README with diagram + <5 min setup |
| 4 | Contributability | 15% | Lint+format (ESLint/Prettier/Ruff), conventional commits, PR template, `.env.example`, `CONTRIBUTING.md`, labeled issues — looks like real OSS |
| 5 | Documentation | 10% | README explains long-tail choice, healing mechanics, agent run steps, API docs; Loom <2 min |

Signal: judges run `npm run lint`, check Git log Insights. 800-line `index.js` fails even if it works.

### 9.4 Daily Bugle — Best LinkedIn Post — Samsung Galaxy Watch

| Rank | Criterion | Weight | Note |
|------|-----------|--------|------|
| 1 | Story angle (not feature list) | 35% | Implicit. Pain → long-tail → heal demo → quantified insight |
| 2 | Mandatory tag & hashtags | 20% | Explicit: **Must @WeMakeDevs** (LinkedIn Company Page — typed `@WeMakeDevs` then select). Without it, not discovered = not judged. Also @Bright Data, `#ScrapeVerse #WeMakeDevs #BrightData` |
| 3 | Visual proof | 20% | 30-sec native video > 4 screenshots: terminal → Collector logs → chart updating |
| 4 | Demonstrable value | 15% | Quantify: “1,200 niche products hourly, $X price delta found” |
| 5 | Engagement velocity | 10% | Post Aug 18–22 early (9–11am IST), not 23 night; pod: teammates comment in 30 min |

Judged by community/marketing, not engineers — clarity + shareability > depth. LinkedIn only — X/medium not counted (though cross-post to X for discoverability is smart).

### 9.5 The Raffle — Iron Man MK5 Helmet Black Edition (Voice Control)

100% lottery. No judging. Requirement: **register**. Every team member register individually to maximize EV. Zero build time — do day 1.

---

## 10. Cross-Track Strategy — Architect Once, Qualify for Three

**Principle:** Grand Prize + Suit-Up + Spider-Sense are *complementary* if designed for it. Daily Bugle is parallel.

**The stack that qualifies for all three simultaneously:**

```
[Long-tail Public Site]
        |
[Scraper Studio — Custom Collector, Typed Schema]  ← Grand Pillar 1
        |  (Collector as API — c_*)
[Agent Tool: bright_data_collector(query) ]        ← Grand Pillar 2 + Spider-Sense modularity
        |  (self-healing, retry, validation)
[API Layer: /api/collect, /api/diff, /api/insights ] ← Spider-Sense structure + Suit-Up data contract
        |
[Next.js / Agent Chat UI — Terminal-inspired + Polished Cards/Charts] ← Suit-Up
        |
[GitHub: linted, typed, README, tests, ENV.example ] ← Spider-Sense
        |
[LinkedIn Carousel + 30s Terminal Demo]            ← Daily Bugle (reuses same assets)
```

**Suggested 7-day allocation (team of 4, Aug 17–23):**

| Day | Focus | Tracks Advanced |
|-----|-------|-----------------|
| Aug 17 | Pick long-tail site (vote, verify `robots.txt`/public), scaffold Studio Collector v1, repo init lint/type | Grand + Spider-Sense |
| Aug 18 | Agent tool wiring (terminal), Collector-as-API endpoint, first heal test | Grand (Drive/Heal) |
| Aug 19 | Core app logic on structured output (diff/alert/synthesis) — the “build with output” | Grand |
| Aug 20 | UI polish: loading/empty/error, charts, deploy Vercel/Render, live data badge | Suit-Up |
| Aug 21 | Code hygiene: tests, README, Zod validation, modular refactor, PR history cleanup | Spider-Sense |
| Aug 22 | Self-healing live demo recording, LinkedIn post (tag WeMakeDevs), rehearse 3-min pitch | Daily Bugle + Grand Heal |
| Aug 23 | Buffer, final heal re-test, submission video | All |

**Triple-qualification submission checklist:**

- [ ] Studio screenshot + Collector ID + schema JSON in `/collectors/`
- [ ] Terminal recording of agent driving Collector (GIF in README)
- [ ] Self-healing log or before/after selector proof (same `c_*`)
- [ ] Live deployed URL (not localhost) with last-updated timestamp + healed badge
- [ ] `/api/collect` returns validated structured JSON (Zod/Pydantic)
- [ ] README has architecture diagram + 5-min setup (<4 commands)
- [ ] ESLint/Prettier + typed + `.env.example` + conventional commits
- [ ] LinkedIn post live, @WeMakeDevs tags, links to repo + deployed URL

**What NOT to do:** Two separate projects for two tracks; heavy design system week 1 (data first, polish Aug 20); second mediocre prebuilt “for breadth”; LinkedIn post Aug 23 night.

---

## 11. Project Ideas — All 9 Ranked with Scraper Type Map

### 11.1 Scoring Matrix — Ranked 1→9

Scored 1–10: `G` Grand Prize, `Suit` Suit-Up, `Spider` Spider-Sense, `N` Novelty, `C` Complexity (10 hardest). `Verdict` = judging risk.

| Rank | # | Idea (brief verbatim) | G | Suit | Spider | N | C | Verdict | Why This Rank |
|------|---|-----------------------|---|------|--------|---|---|---------|---------------|
| **1** | **3** | **Set-a-goal-and-walk-away automation** · Give agent goal like “scrape this site every day at 3am and save results” and let it plan/build/schedule/verify whole thing | 10 | 9 | 8 | 10 | 9 | **HERO — Moonshot** | Feels like magic. Prompt → autonomy. 70% executed wins demo; failure crashes. |
| **2** | **4** | **Self-healing scraper (the hero project)** · Build, break (or catch real change), `bdata scraper heal "<what broke>"` → approve → re-run. Same Collector downstream untouched. Bonus: automate heal loop. | 9 | 10 | 9 | 9 | 5 | **HERO — Judges’ darling** | Only idea proving why Bright Data > prebuilts + DIY. Narrative arc Build→Break→Heal→Untouched. Lowest complexity, insane love. |
| **3** | **5** | **Scrapers in CI, no humans** · `bdata scraper run` in GitHub Actions cron, `claude -p` + `bdata scraper heal` automatically & re-run job; wall of green checks. | 7 | 10 | 7 | 7 | 6 | **HERO/SAFE — ENG clap** | Most provably automated; green wall = trust. Engineers will stand up. |
| **4** | **8** | **Keyword-powered agent (no URLs needed)** · Search scraper type: `keyword` + optional `country`, no URL; agent researches on demand from plain English. | 8 | 7 | 9 | 9 | 7 | **Strong — Dark Horse** | “We never touched a URL” is killer. Least-used type → differentiation. |
| **5** | **2** | **Prompt-to-production pipeline** · Agent builds scraper AND pipeline: `POST /dca/trigger` → save JSON to S3/DB → schedule. One prompt, fresh data nightly. | 7 | 8 | 6 | 6 | 4 | **Safe — Foundation** | Workhorse every hybrid builds on. Alone = “just cron”. |
| **6** | **7** | **Competitive intel pipeline** · Sitemap on 3–5 changelogs/release-notes weekly, diff vs last week, deliver via inbox/Slack/Discord Monday. | 7 | 7 | 10 | 7 | 5 | **Safe — Spider-Sense winner** | Most business-viable; weekly “Monday Brief” genuinely useful; scores 10/10 on sensing. |
| **7** | **6** | **Docs site → RAG pipeline** · Sitemap on docs site → every page JSON → chunk/embed → “chat with these docs” with citations. | 6 | 6 | 7 | 5 | 5 | **Safe but crowded** | RAG fatigue unless citations + multi-site + healing. |
| **8** | **9** | **Parallel subagents battle** · 3 subagents in 3 worktrees different sites, 4th judges & ships winner. Multi-agent orchestration flex. | 6 | 8 | 6 | 8 | 9 | **Risk — gimmick trap** | “Why did 3 sites make data better?” unless judging criteria genius. |
| **9** | **1** | **One-prompt scraper** · Paste one prompt into agent, point at site → clean JSON via `create` + `run`; then small CLI/Discord/dashboard. PDP/Discovery. | 4 | 4 | 3 | 3 | 2 | **Risk/Trivial — Anti-pattern** | 50 teams will do this. Tutorial completion, not hackathon. Use only as Day-1 MVP. |

```
HIGH JUDGING IMPACT
  ^
  |  3 GOAL-AGENT ●         4 HEAL ●
  |         8 KEYWORD ● 
  |  5 CI ●     7 INTEL ●    2 PIPELINE ●
  |                              6 RAG ●
  |                         9 BATTLE ●
  |  1 ONE-PROMPT ●
  +------------------------------------> COMPLEXITY
  LOW                                   HIGH
```

### 11.2 Scraper Type Map — Why Each Idea Needs What It Needs

| # | Idea | Required Type(s) | Why This Type (not others) | Long-Tail Real Site Example (NO Prebuilt) |
|---|------|------------------|----------------------------|-------------------------------------------|
| **1** | One-Prompt | **PDP or Discovery** | PDP for single product URL, Discovery for category URL — definition of getting started | **PDP:** `bringatrailer.com/listing/1967-ford-mustang-*` (classic auctions), `discogs.com/release/*` (vinyl), `apps.apple.com/us/app/*` (long-tail app intel) <br>**Discovery:** `catawiki.com/en/c/123-jewellery`, `faire.com/category/ceramics` |
| **2** | Prompt-to-Prod | **Discovery + PDP** | Need Discovery to go from one seed URL to fresh nightly dataset; PDP alone requires manual URL list — breaks “one prompt → nightly fresh” | `99acres.com/search/property-lease-in-pune` (20 pages → 500 PDPs/night), `reverb.com/marketplace?query=vintage-synth` |
| **3** | Goal-and-Walk-Away | **Discovery + PDP (agent chooses)** | Agent must infer type from goal text: “scrape every day 3am” → Discovery + schedule; “this single product” → PDP | Goal: *“Track all new drop ceramics from haas-ceramics.com every morning”* → `haas-ceramics.com/shop/*` Discovery. No prebuilt. |
| **4** | Self-Healing | **ANY (Discovery best for demo)** | Healing is Studio feature, type-agnostic; Discovery shows max value (listing layout break → heal → same `c_*` downstream via trigger). PDP break too subtle. | `brickvault.net` or `culturehustle.com` (niche DTC) — `.price → .amount` then `bdata scraper heal --description "price is now in span.amount"` → approve → re-run |
| **5** | CI No Humans | **ANY (Discovery)** | CI cron (`0 3 * * *`) calls `bdata scraper run`; on failure `claude -p "heal collector $ID"` commits fix; Discovery proves at scale; PDP looks like toy | `wiggle.co.uk` (UK bike store, long-tail, frequent markup changes) |
| **6** | Docs → RAG | **Sitemap** | 200–2000 pages across `/docs/*` `/blog/*` `/api/*`; PDP/Discovery can’t crawl broadly; Sitemap via `sitemap.xml` does; critical for RAG completeness | **Long-tail docs:** `docs.n8n.io/sitemap.xml`, `tauri.app/sitemap.xml`, `docs.perplexity.ai/sitemap.xml` — avoid `stripe.com/docs` (too obvious) |
| **7** | Competitive Intel | **Sitemap** | 3–5 domains × all `/changelog/*` `/releases/*` `/whats-new/*`; PDP/Discovery would miss posts; then diff vs last week snapshot | `linear.app/changelog`, `supabase.com/changelog`, `framer.com/changelog`, `perplexity.ai/changelog`, `n8n.io/changelog` |
| **8** | Keyword (no URLs) | **Search** | Only type starting from plain English without URL: `keyword + country/engine` → discovers URLs → PDP | `wanted.co.kr` (“AI PM Seoul”), `etsy.com/search?q=japanese+ceramics` via Search API, `google.com/search?tbm=shop&q=sustainable+sneakers` — regional engines = gold |
| **9** | Battle Subagents | **ANY (mix types = best)** | To prove judging, diversity: A Discovery on `catawiki.com`, B Sitemap on `tauri.app`, C Search on `wanted.co.kr` — judge scores coverage/quality/speed; mixing prevents “3× same job” | As above — diversity is the point |

---

## 12. Differentiation — The "Why Not Prebuilt?" Test (800+ Prebuilts)

**Brief verbatim:** Bright Data already has `800+` pre-built scrapers for popular sites. If the obvious question is “Why not use a pre-built scraper?”, choose a different target.

| # | Idea | PASSES if you… | FAILS if you… | Winning Detail to Quote |
|---|------|----------------|---------------|-------------------------|
| 1 | One-Prompt | Pick site with 0 prebuilt, custom schema, Discovery pagination, polished CLI/Discord UX | Scraped Amazon, LinkedIn, Instagram, Zillow, Walmart | “We scraped 500 SKUs from Faire.com wholesale with `moq, wholesale_price, lead_time` — no prebuilt knows this schema.” |
| 2 | Pipeline | Emphasize freshness+schedule+custom destination (`s3://scrapeverse-nightly/2026-08-18.json` versioned + queryable Postgres). Prebuilts are pull dumps; yours is push-to-DB nightly. | Just triggered once, show JSON in console, no persistence/schedule | `s3://scrapeverse-nightly/*.json` + DuckDB |
| 3 | Goal Agent | Agent *plans* type+schedule+healing from vague goal. Prebuilts can't plan. | Agent wraps single Discovery prompt, no planning/scheduling/verification | “Goal: ‘alert when competitor changes pricing’ → agent built Discovery+cron+diff+Slack. Prebuilt can't compose.” |
| 4 | Self-Healing | **Auto-pass.** No prebuilt heals. “We broke DOM intentionally, prebuilt would stay broken, ours healed in 90s and downstream `c_*` unchanged.” | Show heal manually once with no automation | Bonus: detect empty → auto `heal` → auto-approve if confidence >0.9 — prebuilts never heal |
| 5 | CI | **Auto-pass.** Prebuilts don't live in your GH Actions with signed healing commits. Show `.github/workflows/scrape.yml` + green checks. | Claim CI but run locally | “Every 3am UTC, Actions triggers, validates row count, opens PR with diff; healing commits signed by bot.” |
| 6 | RAG | 2–3 *long-tail* docs, citations + diff handling via Sitemap. Generic RAG on generic docs fails. | Single site, no citations, no incremental | “Sitemap re-crawls n8n nightly, only re-embeds changed pages (hash diff), answers with `source: docs.n8n.io/...#anchor`.” |
| 7 | Intel | Cross 3–5 domains + semantic diff (not string diff) + delivery. Prebuilt is per-site; intel is cross-site synthesis. | Summarize one changelog | “We diff last week's embeddings, cluster by pricing/packaging/perf, deliver Mon 9am Slack ‘Linear shipped X, Framer countered with Y’.” |
| 8 | No URLs | **Auto-pass.** Prebuilts require URLs/dataset IDs; you start from `keyword+country`. | Hardcode site URLs under the hood | “Request: ‘trending mechanical keyboards < $150 in Germany’ → agent discovered geizhals.de via Search.” |
| 9 | Battle | Mixed types + judged metric (coverage, latency, schema adherence, `valid_rows/cost`) + promoted winner | 3 agents do same Amazon scrape, pick fastest | “3 explorers race; judge picks winner by `valid_rows / cost` and promotes its collector to prod.” |

---

## 13. Scope — MVP in 48h vs Stretch in 6 Days (Per Idea)

| # | Idea | MVP (48h — Must Demo) | Stretch (6 Days — Wins) | Time Trap to Avoid |
|---|------|----------------------|------------------------|---------------------|
| 1 | One-Prompt | Prompt in Studio → `run` → print table; ship `npx scrapeverse "prompt"` | Add Discord `/scrape <prompt>` → paginated embed, Next.js dashboard, validation, CSV/JSON export | Don't build auth. Validate long-tail site Day 0. |
| 2 | Pipeline | Discovery → `POST /dca/trigger` via script → `result.json` → local SQLite → `node-cron` nightly | Remote S3/Supabase, GH Actions cron, Zod validation, diff vs yesterday, Slack “N new rows”, retry on empty | Don't build Airflow. `trigger → poll → download snapshot → upsert DB` suffices. |
| 3 | Goal Agent | CLI `goal "scrape X every day 3am"` → Claude parses → picks Discovery + schedule string → Studio prompt → trigger. Human approves. | Full loop: agent *creates* collector via API, *schedules* GH Action file, *verifies* non-empty, *explains* plan; re-plan if verify fails; `claude -p` as core | Don't build multi-agent planning. Single planner+executor suffices. |
| 4 | Self-Healing | Manual: build Discovery, mutate selector locally (or pick site that already changed), `heal --description "..."` → approve in Studio → re-run → downstream untouched | Automate: monitor detects `row_count==0` or `field==null` → auto `heal` → auto-approve if preview rows>0 → re-trigger → diff to PR; side-by-side DOM video | Don't fake break by editing local HTML and claiming site changed — judges know; use real site or honest before snapshot. |
| 5 | CI | `scrape.yml` with `on:schedule: - cron:'0 3 * * *'` + `workflow_dispatch` → `bdata scraper run` → commit `data/latest.json` → badge pass | Add: validation (`jq '.|length>50'`), auto-heal job on failure (`claude -p`), artifact upload, PR auto-create with data diff, status wall for demo | Don't let heal loop infinite. Cap retries 2, third requires human approve. |
| 6 | RAG | Sitemap on ONE long-tail docs (n8n) → naive chunk 500 tokens → embed (OpenAI) → CLI query with citations | Multi-sitemap (n8n+Tauri+Perplexity), re-chunk changed URLs (hash), hybrid search, citation anchors, eval set 10 Qs with expected sources, frontend chat | Don't build vector DB infra from scratch. Supabase pgvector / Pinecone free tier. |
| 7 | Intel | Sitemap on 3 changelogs → weekly manual trigger → LLM summarize each diff → print markdown | Scheduled Mon 9am, snapshots in DB, semantic diff (embed+LLM “what's new vs last week”), clustered report, deliver via Slack webhook+email, web inbox archive | Don't summarize without diffing. |
| 8 | Keyword Agent | `keyword+country` → Search scraper → JSON → table; CLI `agent "find AI designer jobs in Seoul"` | Multi-engine fanout (shopping+SERP), price normalization, dedupe by URL, ranking, conversational refinement ("cheaper?" → re-query), map | Search scrapers rate-limited/schema-varying — test 2 engines Day 1, don't promise 5. |
| 9 | Battle | 3 local scripts (not agents) parallel `Promise.all` → 4th script scores by row count → print winner; fake worktrees | Real: `git worktree add ../agent-a` etc., each `claude -p` independently, 4th `claude -p --judge` evaluating `schema_completeness, coverage, latency`, auto-merges winner to `main` | Don't over-engineer judge LLM. Deterministic metrics + LLM tie-breaker suffices. |

---

## 14. Hybrids That Win — A/B/C/D

> Solo ideas place. **Hybrids win.** Ranked by Grand Prize expected value.

**HYBRID A — The Unbreakable Pipeline — RECOMMENDED for most teams (highest hit-rate)**

`#2 Pipeline + #4 Self-Healing + #5 CI`
- Arch: `Discovery ──► GH Actions Cron (3am) ──► POST /dca/trigger ──► validate rows ──► if fail: claude -p heal ──► re-trigger ──► upsert S3/Supabase ──► Slack "42 new rows"`
- Why it wins: Only submission that can honestly say “we haven't touched it in 4 days and it still delivers fresh data.” Demo = GitHub Actions wall with 6 green checks + one yellow “healed” run.
- Tagline: *“One Prompt, One PR, Fresh Data Nightly — Even When the Site Breaks.”*

**HYBRID B — The Autonomous Scout — Grand Prize Moonshot (highest EV if executed to 80%)**

`#3 Goal Agent + #8 Keyword Search + #4 Healing`
- Arch: `User goal (plain English) ──► Planner (Claude) ──► picks Search scraper + country ──► builds Discovery/Sitemap ──► schedules ──► verifies ──► heals`
- Hook: live-type “Find sustainable ceramics suppliers in EU under €30” and watch it discover a site you never named.
- Tagline: *“Describe the data you want. We find the site, build the scraper, and keep it alive.”*
- Risk: hardest to build. If you nail it, no one beats you.

**HYBRID C — The Living Knowledge — Spider-Sense + RAG**

`#6 RAG + #7 Intel + #4 Healing`
- Arch: `Sitemap (docs + changelogs) ──► chunk/embed ──► nightly Sitemap re-crawl (diff by hash) ──► re-embed changed pages only ──► RAG with citations + weekly intel diff. Healing ensures re-crawl survives redesigns.`
- Tagline: *“Your docs never go stale — we sense changes and re-index before your users notice.”*
- Needs: strong eval set (10 test questions + expected sources) to beat RAG fatigue.

**HYBRID D — The Battle-Tested Pipeline — Flex Pick**

`#9 Battle + #2 Pipeline` (use battle *as selection method* for pipeline)
- Arch: `3 subagents propose 3 Discovery prompts/strategies in worktrees ──► judge picks winner on valid_rows/cost ──► winner promoted to CI pipeline (#2)`
- Why smart: Justifies #9 complexity — battle isn't gimmick, it's *model selection*. Story: “We let agents compete to build the best pipeline.”
- Use when: 3+ member team wants multi-agent chops without sacrificing credibility.

**What NOT to hybridize:** `1+6` (too many beginners), `1+9` (trivial × gimmick = 2× weak), all 9 at once (signals lack of focus).

---

## 15. Anti-Patterns — Why Good Pitches Fail

| # | Anti-Pattern | Why It Feels Good | Why Judges Fail It | Salvage If Forced |
|---|--------------|-------------------|--------------------|-------------------|
| 1 | “One-Prompt Scraper with Beautiful Dashboard” | Fast, looks polished, think UI wins | Seen 40×. Two killer questions: (1) “Why not use prebuilt?” (2) “What happens tomorrow when the site changes?” No answer = 6/10. Blog lists #1 as *first scraper friendly*, not winner. | Pick absurdly long-tail (`brickset.com`, `catawiki.com`), use Discovery not PDP, add heal + CI — then it’s not one-prompt anymore → Hybrid A. |
| 2 | “Docs RAG Without Citations or Incremental Update” | Easy with LangChain | 2023. Judges want Sitemap diffing, re-embedding, citation fidelity. No `source: url#line` → you built a chatbot, not a scraping pipeline. | Require 3 sitemaps + hash diff + `source: …#anchor`. |
| 3 | “We Scraped 10 Sites in Parallel — Look How Fast!” | Feels like scale | `Promise.all` theater without judging. Needs credible judge (`valid_rows/cost` + shipped winner). | Implement Hybrid D with deterministic metrics + LLM tie-breaker. |
| 4 | “AI Agent That Writes Python Scrapers” | Feels like code gen | Scoring *Scraper Studio* usage. Writing `playwright`/`cheerio` competes *against* Bright Data, not with it. Agent must output Studio prompt/collector, not Python. | Change tool to produce Studio prompt: `bdata scraper heal`, not `write me xpath`. |
| 5 | “Competitive Intel That Summarizes Without Diffing” | Summarization is easy | Without `last_week_snapshot` diff, you’re a newsletter. Spider-Sense requires *sensing change*. | Store snapshots in Supabase/S3, embed-diff, show `+3 new, -1 deprecated` table. |

---

## 16. Best Practices — The 5 Official + What Judges Check

**Judging heuristic:** 1, 3, 5 = differentiation (how you win). 2, 4 = qualification (how you avoid DQ). Brilliant heal that scrapes Instagram behind login still loses.

| # | Best Practice (brief verbatim) | What Judges Check | How to Demonstrate (Evidence) | What Fails / Red Flag |
|---|--------------------------------|-------------------|-------------------------------|-----------------------|
| **1** | **Build for the long tail** — Bright Data has 800+ prebuilts; pick regional e-commerce, B2B catalogs, niche sites, docs, competitor changelogs. If “Why not use a prebuilt?” → pick different target. | Did you avoid 800+? Is target defensibly niche? Can you answer “Why not prebuilt?” | README 30 sec: name target + category (e.g., “TradeIndia spare parts”), Bright Data Catalog search screenshot “0 results”, one-sentence justification: “Prebuilts cover Amazon/LinkedIn/Walmart — none exists for [X] because [regional/language/structure]”. Ideal: Myntra regional sellers, JioMart B2B, Thomasnet sub-verticals, gov tender portals, open academic repos. | Amazon product pages, LinkedIn, Instagram, Zillow, Walmart, generic “news scraper” without niche angle — judges will search Marketplace live. |
| **2** | **Keep terminal as your UI** — Build from coding agent, Claude Code, Cursor, Codex; dashboard only to check Collector or configure schedule. | Built *from* agent, not just *with* autocomplete? Dashboard only for validation? | `CLAUDE.md`/`.cursor/rules` + agent co-authored git + terminal recording (asciinema/script log in `/docs/demo.mov`) + GH Actions workflow from prompt. In demo show `claude -p "heal the scraper"` then dashboard only for status/logs/schedule. State: “Dashboard: 2× — verified `c_abc123` 142 records + set cron `0 */6 * * *`. All else in terminal.” | Manual VS Code commits only, no agent config, dashboard screenshots as primary evidence, or no-code IDE-only build. |
| **3** | **Show self-healing in action** — owning scraper code while AI repairs when site changes; `bdata scraper heal` in demo without breaking workflow. | Does healing trigger on real failure and recover without workflow break? Is it owned code patched by AI, not black box? | **Live Demo Protocol:** (1) `npm run scrape` → valid JSON N records. (2) Simulate break: `heal` or fixture with old HTML; run now returns 0/incomplete. (3) Trigger heal: show diff/log `".product-price" → "[data-testid='price']"` / LLM schema re-infer. (4) Re-run → restored. (5) Workflow uninterrupted: cron/queue continued, no manual push. Persist heal log `/logs/heal-2026-08-18.json`. | `try/catch` retrying same selector; heal requiring manual edit+push; “it just works, trust us”; heal hallucinates or returns stale cache; no before/after evidence. |
| **4** | **Scrape public data only** — Stick to publicly available pages. No login, paywall, personal data. Never expose tokens/.env in repo/demo. | No login, paywall, PII. No authenticated-content ToS violation. | README compliance: “Target: [URL] — Public, no auth, no paywall, `robots.txt` allows [path]. Fields: [list] — all non-PII factual catalog data.” Include `robots.txt` excerpt + Terms citation; show unauthenticated `curl` fetching page. | See next section — even public LinkedIn profiles at scale = risky (personal data + ToS). |
| **5** | **Use Collector ID as an API** — Every scraper gets `c_*` triggerable via `POST /dca/trigger`. Connect to cron, DB, agent, dashboard. | Is `c_*` a programmable primitive orchestrated in a larger workflow, not a dashboard button? | Show `POST /dca/trigger` live: `curl -X POST https://api.brightdata.com/dca/trigger?collector=c_abc123 -H "Authorization: Bearer $BRIGHTDATA_TOKEN"` from one of cron/DB/agent/dashboard; `c_*` as env var; log response + webhook handling; Bonus: Collector → DB → agent → dashboard loop diagram. | Only ever clicked in dashboard; `c_*` hardcoded in frontend; no programmatic trigger; `c_*` in README but never invoked; treating Collector as product not component. |

---

## 17. Public Data Only — Safe vs Risky, Legal Boundaries

**Core rule (DQ-calibrated):** If an unauthenticated user in incognito cannot see it without paying, logging in, or disclosing personal data, do not scrape it. Self-healing does not excuse scope creep into non-public.

**Legal frame (India + global; GDPR-like even from India):**

- **Contract (ToS):** Bypassing login/paywall = breach of contract. If data is visible only post-login, using credentials restricts access. Judges check: does target require `Authorization` header / session cookie?
- **CFAA-equivalent & IT Act 2000 (India):** Credential bypass / paywall circumvention = “unauthorized access”. Public URLs authorized; authenticated endpoints are not.
- **Copyright:** Factual data (prices, specs, dates, changelog text) generally safe. Long-form copyrighted prose (full paywalled articles, book content) is not — transform/aggregate, don’t republish verbatim.
- **Privacy (GDPR / DPDP Act 2023 India):** PII triggers heightened scrutiny. Even if public, harvesting PII at scale for profiling = non-compliant. Hackathon standard = **zero PII**.
- **Judges’ check:** “Show me this page in incognito without logging in.” If you can’t, you fail.

**Decision matrix:**

| Category | ✅ SAFE (recommended) | ❌ RISKY / DISQUALIFYING | Why |
|----------|----------------------|-------------------------|-----|
| **E-commerce & Catalogs** | Public catalog prices, SKUs, specs (no login to view price) | User reviews with names/photos, cart/wishlist behind login, “login to see wholesale price” | Reviews = personal data; login-gated price = non-public |
| **Docs & Changelogs** | Public docs, open API docs, public competitor changelogs/status pages, gov tender portals | Private Notion/Confluence, docs behind SSO, partner portal changelogs | Auth wall = non-public |
| **Niche / Long Tail** | Public agri mandi prices, factual open RE listings (no owner contact), public tender notices | Matrimonial sites, job portals with candidate PII (phone/email), RE owner phone numbers | PII harvesting; judges flag as unethical even if public |
| **Meta** | `robots.txt Allow: /products/` + ToS permits crawling | `robots.txt Disallow: /` ignored at scale with aggressive rate, or ToS explicitly prohibits automation and you bypass it | Judges check `https://target.com/robots.txt` live; respect or document throttling |

**GDPR-like checklist per field:**

1. Does field identify a person (name, email, phone, photo, handle, location+name)? If yes, **drop**.
2. Sensitive (health, financial, political)? If yes, **drop**.
3. Could dataset profile individuals? If yes, aggregate/anonymize or pick different target.
4. Have you minimized to only use-case-necessary fields? Juries reward `select: title, price, sku` over `select: *`.

**Required compliance artifact** — `COMPLIANCE.md` or README section:

```markdown
Target: https://example-regional-catalog.com/products
Public: Yes (verified incognito, no auth)
robots.txt: Allow /products, Crawl-delay 2s respected
ToS: Section 4 allows crawling for non-commercial research (link)
Fields scraped: product_name, price, specs, availability (no PII)
Rate limit: 1 req/2s, Bright Data unblocker with throttling
Data retention: Ephemeral for demo, not stored beyond 7 days
```

---

## 18. Secret Management — .env, Tokens, Collector IDs

**What NOT to do (instant DQ patterns — grep your repo before push):**

- Committing `.env` to git: `git add .env` with `BRIGHTDATA_TOKEN=…` visible in GitHub history (deleting later retains in history).
- Hardcoding Collector ID or token in source: `const collectorId = "c_abc123..."` or `headers: { Authorization: "Bearer brd_xxx" }`.
- Logging secrets: `console.log(process.env)` in demo or Collector logs on screen.
- Exposing in frontend: shipping token in client-side JS/React bundle/public repo.
- Screensharing `.env` in demo video, or pasting token in Discord/issue tracker.
- Using `.env.example` with real values.

**Correct — 12-factor + hackathon-safe:**

1. **Local:** `.env` (gitignored) + `.env.example` (committed, placeholders only)
   ```
   # .env (NEVER COMMITTED)
   BRIGHTDATA_TOKEN=brd_xxxxx
   BRIGHTDATA_COLLECTOR_ID=c_xxxxxxxx
   DATABASE_URL=...

   # .env.example (COMMITTED)
   BRIGHTDATA_TOKEN=your_bright_data_api_token_here
   BRIGHTDATA_COLLECTOR_ID=your_collector_id_here
   ```
2. **`.gitignore` must contain:**
   ```
   .env
   .env.local
   *.pem
   ```
3. **Code — load via env, fail fast, never log:**
   ```js
   if (!process.env.BRIGHTDATA_TOKEN) throw new Error("Missing BRIGHTDATA_TOKEN");
   export const collectorId = process.env.BRIGHTDATA_COLLECTOR_ID;
   await fetch(`https://api.brightdata.com/dca/trigger?collector=${collectorId}`, {
     method: "POST",
     headers: { Authorization: `Bearer ${process.env.BRIGHTDATA_TOKEN}` }
   });
   ```
4. **CI / GitHub — use Secrets, never plaintext in `workflow.yml`:**
   ```yaml
   env:
     BRIGHTDATA_TOKEN: ${{ secrets.BRIGHTDATA_TOKEN }}
     BRIGHTDATA_COLLECTOR_ID: ${{ secrets.BRIGHTDATA_COLLECTOR_ID }}
   ```
5. **Demo hygiene:** Before screenshare, mask: `export BRIGHTDATA_TOKEN="***"` or masked env display. If ever exposed, **rotate immediately** in dashboard and note: “Token rotated post-demo, old token revoked.”
6. **Collector ID sensitivity:** `c_*` not as sensitive as token but still env-var’d — proves you treat it as injectable/swappable config (Collector-as-API thinking).

**Pre-submission secret audit (run before final push):**

```bash
git log --all -p | grep -E "brd_|c_[a-z0-9]{6,}|Bearer"  # should be empty
git check-ignore .env                                    # should print .env
cat .gitignore | grep -q "^\.env$" && echo "OK" || echo "FIX .gitignore"
# optional: trufflehog or gitleaks
trufflehog git file://. --only-verified
gitleaks detect --source .
```

---

## 19. Clean Code (Spider-Sense) — Concrete Checklist (20 Items)

> *“Would another contributor trust and extend this in 10 minutes under web instability?”* Not cleverness — maintainability.

**Self-score 0/1/2 per item (0 missing, 1 partial, 2 exemplary):**

**A. Readability & Structure (8):**

- [ ] `README.md` has: problem, target justification (why not prebuilt), architecture diagram, `cp .env.example .env` setup, run, heal demo, compliance note. No README = −20%.
- [ ] Single responsibility: `scraper/` (extraction), `healer/` (detection+repair), `orchestrator/` (Collector API + workflow), `schemas/` (validation). Not one 600-line `index.js`.
- [ ] Intent names: `detectEmptyResult()`, `inferSelectorFromDOM()`, `validateSchemaCompleteness()` not `doStuff()`, `fix()`.
- [ ] No scattered magic selectors: centralized `selectors.config.js`/`selectors.yaml` with fallback chains: `// primary: [data-testid='price'] → fallback: .price → heuristic: text ~ /₹/`.
- [ ] Explicit error taxonomy: distinguishes `EMPTY_RESULT`, `PARTIAL_SCHEMA`, `HTTP_ERROR`, `SELECTOR_MISS` with typed errors vs generic `catch(e)`.
- [ ] Structured logging (JSON) with levels: `logger.info({ collectorId, runId, recordCount })` not `console.log("here")`.
- [ ] Lint+format enforced: `eslint` + `prettier` + pre-commit, CI fails on lint.
- [ ] No dead code / commented selectors / `TODO heal later`.

**B. Edge Cases & Resilience (6):**

- [ ] Input validation: URL normalization, pagination bounds, empty page handling, retry with exponential backoff + jitter.
- [ ] Schema validation: `zod`/`jsonschema` every record; heal triggers on `completeness < 90%` or `recordCount == 0` not just exception.
- [ ] Selector brittleness mitigated: fallback chain CSS → XPath → text heuristic → LLM inference, not single brittle `.css-1a2b3c`.
- [ ] Rate limiting & politeness: respectful delay, Bright Data unblocker config, concurrent cap, `robots.txt` crawl-delay honored.
- [ ] Idempotency: re-running scrape does not duplicate DB rows; upsert by `sku`/`url` key.
- [ ] Timeouts & circuit breaker: request timeout 15s, healing capped (max 3 tries then alert, not infinite loop).

**C. Contributor Ease (6):**

- [ ] `CONTRIBUTING.md` or README “How to add a new target”: add selector entry + fixture HTML + test.
- [ ] Fixtures: `/fixtures/before.html` and `/fixtures/after-redesign.html` for offline healing tests.
- [ ] Tests: unit tests for `healer` + integration test with mocked HTML. `npm test` passes in CI. Healing logic coverage >70%.
- [ ] One-command setup: `npm ci && npm run dev` or `docker compose up` with zero manual steps.
- [ ] Environment parity: works locally and in CI/Docker with same env vars.
- [ ] PR hygiene: small commits like `feat(scraper): add fallback for price selector` not `fix stuff`, agent co-authorship noted.

**Scoring insight:** Judges clone and run. If `npm install && npm test` fails or healing cannot be reproduced offline via fixtures, engineering score collapses regardless of demo polish.

---

## 20. Collector-as-API — 5 Integration Patterns

**Endpoint (canonical):**

```
POST https://api.brightdata.com/dca/trigger?collector=c_xxxxxxxx
Headers: Authorization: Bearer $BRIGHTDATA_TOKEN
         Content-Type: application/json
Body (optional): { "input": { "url": "https://target.com/page2", "custom_param": "..." } }
Response: { "collection_id": "col_yyy", "status": "triggered" }
# Delivery: webhook / dataset API / polling GET /dca/get_progress
```

| # | Pattern | Architecture | Pros | Cons | Judge Appeal |
|---|---------|-------------|------|------|--------------|
| **1** | **Cron / Scheduler** | `cron` / GH Actions `schedule` / Vercel Cron → `POST /dca/trigger` → Collector → webhook to your API | Simplest; proves autonomy; self-healing keeps schedule unbroken | No reactive heal trigger; blind to failures until next run | **High** — “fits larger workflow” with zero manual intervention. Baseline. |
| **2** | **Database-driven (Polling / CDC)** | DB trigger (`needs_scrape=true`) → worker → `POST /dca/trigger` with URL param → results `INSERT` back → healing persists new selectors to DB | Dynamic URLs; scalable to 10k+ pages; healing knowledge persists | Needs DB+queue; polling latency | **Very High** — prod-ready, healing persistence. |
| **3** | **AI Agent / LLM Orchestrator** | User prompt → Agent (LangChain / Claude Agent SDK / `claude -p`) → decides `triggerCollector` tool → validate completeness → if incomplete, calls `healCollector` → summarizes | Most thematic; *agent is healer*; NL control | LLM cost/latency; false positives need guardrails | **Highest** — embodies “AI repairs” and most demoable for WeMakeDevs. |
| **4** | **Dashboard / Internal Tool** | Internal Next.js/Retool → Button “Rescrape competitor X” → backend `POST /dca/trigger` → poll status → table updates → “Heal” button triggers `heal` flow | Human-in-loop stakeholder demo; visual proof Collector-as-API behind UI | Requires frontend; not confused with Bright Data dashboard | **High** — proves API enables productization. |
| **5** | **Event-driven / Webhook Chain (Bonus)** | Sitemap RSS / `HEAD` ETag change → webhook → `POST /dca/trigger` → results; if `recordCount==0` → auto-heal → Slack alert “Healed selector X, no action needed” | Fully reactive; closes loop without human; impressive | Most complex; needs change detection | **Exceptional** — solves “recovering without breaking workflow” end-to-end. |

**Recommendation:** Implement **#1 + #3 minimum**. Cron proves reliability, Agent proves intelligence.

```
[User/Agent] --POST /dca/trigger c_*--> [Bright Data Collector]
                                            |
                                            v
                                   [Validator: completeness check]
                                            |
                                 +----------+-----------+
                                 |                      |
                            [DB/Webhook]          [Healer: LLM re-infer]
                                 |                      |
                                 +---------> [Alert / Persist]
```

**What judges verify:** `c_*` stored as env var, trigger programmatic (code + live `curl`), response handling (`collection_id`, polling, 429/pending/empty), one integration actually *running* (green GH Actions check or agent log).

---

## 21. Self-Healing Architecture — State Machine, Failure Modes, Detection, Automation, Demo

### 21.1 Why This Is the Whole Game

> *“The web is not a stable API. Scrapers break because the DOM moves. Self-healing is not a post-incident patch — it's the contract: same Collector_ID, downstream untouched, platform handles proxies/rendering/CAPTCHA/retries, you handle describing what changed.”*

Judges score **reliability from day one**, not “did heal work once”.

### 21.2 Failure Modes — 6 Ways Scrapers Break

| # | Failure | Concrete Symptom | Healability | Why / Platform Action |
|---|---------|------------------|-------------|-----------------------|
| 1 | **DOM class/selector rename** — `.product-card__title` → `.x_9f3a` (Tailwind hash, BEM refactor) | `0 rows`, HTML otherwise identical, `200 OK` | **High — heal’s sweet spot** | Re-anchors via `data-testid`, semantic text proximity, scope. |
| 2 | **Structure shift** — `<ul><li>` → virtualized grid, wrapper divs, field reorder | Partial rows, field coverage 80%→30% | **High** | New XPath/scope; data still there, path broken. |
| 3 | **Pagination / infinite-scroll change** — `?page=2` → `?after=eyJ...` (cursor) or `IntersectionObserver` “Load more” | Row count caps at 20/48/100 regardless of category size | **Partial** | Heal if still DOM-driven. Fails if cursor signed/API-only. |
| 4 | **JS hydration change** — SSR removed, content after `__NEXT_DATA__` lazy fetch | Raw HTML returns skeleton `<div id="root"></div>` | **High** | Platform flips to browser rendering + wait strategy (headless Chromium, SPA). |
| 5 | **Anti-bot escalation** — new WAF, TLS fingerprint, Turnstile | `403`, CAPTCHA loop, retry budget exhausted | **Platform mitigates / Partial** | Proxies + browser + CAPTCHA solving handle 80%. Novel fingerprint → needs policy change → human. |
| 6 | **Auth / paywall / schema break** — login gate, “contact for price”, field meaning change | `401`, schema fail, `price: null` 100% | **Needs human** | Product/legal/semantic decision; credentials or field semantics required. |

**Rule:**

```
Heal handles  ──────────────────────►  Needs human
[class rename] [structure] [JS render]  [cursor-signed pagination] [anti-bot novel] [auth/paywall/schema]
```

If data *exists* but address moved → heal. If data *meaning* changed or gate appeared → human.

### 21.3 State Machine — Same `c_*`

```
[C_9K2A CREATE] ──► [RUN ✓ 1,240 rows] ──schedule loop──┐
   bdata scraper        schema valid, green checks       │
   create               downstream ships                  │
                         │ site changes                  │
                         ▼                               │
                    [RUN ✕ 0 rows]                      │
                     detected by                        │
                     validation ◄────────────────────────┘
                         │
                         ▼  bdata scraper heal C_9K2A "price is now span[data-testid=price]; pagination ?after cursor"
                    [HEAL · PROPOSED]
                     diff ready, nothing live yet
                         │
                ┌────────┴────────┐
                ▼                 ▼
          approve            --reject
                │                 │
                ▼                 ▼
        [RUN ✓ 1,198 rows]   [REJECTED]
         same ID, healed      stays broken
         downstream green     → re-heal with
         continuity proven     better description

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 DOWNSTREAM CONTINUITY — PIPELINE · DB · DASHBOARD · API NEVER RE-POINT
 Collector ID is the contract. Heal rebinds logic, not the address.
```

**States:**

- **CREATE** → `bdata scraper create` → stable `C_*` with proxies/browser/retries.
- **RUN SUCCESS** → rows ≈ median, schema valid → self-loop on schedule.
- **RUN FAILURE** → detector fires (next section). Run *completes* but yields 0/corrupt rows — failure is silent unless you detect.
- **HEAL PROPOSED** → `bdata scraper heal <ID> "<what broke>"` → diff generated, **not live**. Downstream still on old ID.
- **APPROVE / REJECT** → `bdata scraper approve <ID>` gates deployment. `--reject` discards diff, allows retry with sharper description.
- **RUN RECOVERED** → next run uses new selectors, row count restored, **Collector ID identical on screen**.

**Commands at edges:**

```bash
bdata scraper create --url https://example.com/list --name deals
bdata scraper run C_9K2A --output data.json
bdata scraper heal C_9K2A "pagination now cursor-based, price moved to span[data-testid=price]"
bdata scraper approve C_9K2A          # or --reject
bdata scraper run C_9K2A --output data.json
```

### 21.4 Detection — Diagnose Before You Heal

> Heal without detection is theater. Four detectors run on every execution (verb per analyst):

**01 Empty / zero-row guard — simplest, strongest:** `rows == 0` or `< p10 of last 14 runs` vs rolling median (not single last run).

**02 Schema & field-count validation — catches silent corruption:** `zod`/`jsonschema`: required fields, types, regex (`price: /^\$?[\d,]+\.?\d*/`), `null` rate per field. `Expected 6 fields, got 3 → break`.

**03 Count & distribution drop — pagination caps:** Rows plateau at 20/48/100 or `>35%` drop from 7-day median. `Expected 120 products, got 18 → break`.

**04 Render & screenshot diff — when HTML is empty but rendered page full:** DOM vs rendered text ratio collapses, screenshot hash vs last-known-good, selector hit-rate `12 selectors → 0 matched`.

**Pipeline:**

```
01 RUN (cron) → 02 VALIDATE (rows + schema) → 03 COMPARE (median/p10/cap) → 04 DECIDE (healthy→ship / broken→heal) → 05 HEAL (propose→approve→re-run)
```

**Canonical validation snippet:**

```js
// scripts/validate.mjs — exit 1 triggers heal job
if (rows.length === 0 || nullRate > 0.4 || rows.length < median * 0.65) {
  console.error(`BREAKAGE_DETECTED rows=${rows.length} null=${nullRate}`);
  process.exit(1); // → heal
}
console.log(`HEALTHY rows=${rows.length} — shipping`);
```

Also recommended:

- `zod` per-record: required `title`, `price`, `sku`, types, `price` regex.
- Field-level null-rate alert: `price null-rate > 30%`.
- Golden canary: known product `sku=KNOWN123` must always be present.
- Rolling median history (last 14 runs) stored in DB/S3.

### 21.5 Automation Ladder — 3 Tiers

| Tier | Name | Flow | Latency | When to Show |
|------|------|------|---------|--------------|
| **1** | **Manual** | Human spots empty dashboard → `heal "class rename"` → inspect diff → `approve` | Hours | Learning loop, first demo |
| **2** | **Semi-automated — RECOMMENDED FOR DEMO** | GH Actions cron `run` → `validate.mjs` → on `failure()` → `claude -p "heal C_9K2A with context"` → `heal` → posts diff to PR/Slack → human `approve`/`--reject` | Minutes | What judges love: observability + safety gate |
| **3** | **Fully automated (bonus)** | `run \|\| (heal && approve && run)` + guardrails: max 1 auto-heal/24h, rollback if re-run still fails, Slack notify, page human on 2nd failure | Seconds | Flex: "nobody has to be awake" — needs strong detection |

**Winning GH Actions (Tier 2/3) — canonical:**

```yaml
name: scrape-heal
on:
  schedule: [{cron: "0 */6 * * *"}]
  workflow_dispatch:
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - run: bdata scraper run $COLLECTOR_ID --output data.json
      - run: node scripts/validate.mjs
  heal:
    needs: run
    if: failure()
    steps:
      - run: claude -p "Heal collector $COLLECTOR_ID. Last run 0 rows. Field price missing. Use rendered DOM, anchor on data-testid, handle cursor pagination."
      - run: bdata scraper heal $COLLECTOR_ID "pagination now cursor-based, price moved to span[data-testid=price]"
      - run: bdata scraper approve $COLLECTOR_ID
      - run: bdata scraper run $COLLECTOR_ID --output data.json
      - run: node scripts/validate.mjs # must pass
```

**Guardrails for Tier 3:** rate-limit heal, idempotence check, `heal-log.jsonl` audit trail, `approve --reject` rollback, `HEALING_ENABLED=false` kill switch.

### 21.6 Downstream Resilience — Why Same ID Matters

Collectors are **addresses**, not scripts. Cloning `C_9K2A → C_8B1Q` = migration. Healing `C_9K2A → C_9K2A` = patch.

```
C_9K2A BEFORE (selectors: .product-card__price)
        ── heal rebinds logic ──►  C_9K2A AFTER (selectors: [data-testid="price"])
                Same ID, same webhook, same table, same query

fetch("https://api.brightdata.com/collector/C_9K2A/data") // never changes
```

| Consumer | If you heal (same ID) | If you clone (new ID) |
|----------|----------------------|----------------------|
| **Pipeline / DAG** | No edit, history contiguous | Rewrite schedule, fragment history |
| **DB / Warehouse** | Same table, no `ALTER TABLE` if schema preserved | New table, backfill, migration |
| **Dashboard** | Charts resume, no gap | Query breaks, gap in timeseries |
| **API consumers** | Invisible | Every client updates env var |

**Continuity proof to show on screen (paste verbatim):**

```
BEFORE 1,240 rows · C_9K2A  →  BREAK 0 rows · C_9K2A  →  PROPOSED diff ready · C_9K2A  →  RECOVERED 1,198 rows · C_9K2A ✓
FOUR STATES · ONE ID · ZERO DOWNSTREAM CHANGES
```

**Anti-pattern judges deduct for:** creating a new collector to “fix”.

### 21.7 Demo Narrative — 5-Act Story Arc (Under 6 Minutes)

**Thesis line to say at 0:10:** *“We built a scraper that survived a site redesign without the site or our downstream changing anything. Same Collector ID before and after.”*

| Act | Time | Beat | Shot | Line |
|-----|------|------|------|------|
| **I Build** | 0:00–1:30 | Real site, real `C_9K2A`, `1,240 rows` green | Terminal `create` → dashboard + DB rows, zoom on ID, copy it | *“Collector C_9K2A — this ID is our contract.”* |
| **II Break** | 1:30–3:00 | Make it break — **real change > intentional**. Show `0 rows`, red validation, linger 3s | Re-run → 0 rows → `validate.mjs FAIL` → screenshot diff | If intentional, show exact selector diff you broke |
| **III Heal** | 3:00–4:30 | One precise sentence, not “fix it” | `heal "price is now span[data-testid=price]; pagination uses ?after cursor"` → diff side-by-side | *“We're not rewriting. We're describing what changed.”* |
| **IV Approve & Recover** | 4:30–5:30 | `approve` → re-run → `1,198 rows` → **same ID zoom** → downstream still green | Approve → run → count restored → API/DB query unchanged, zero diff | ***“Same Collector ID. Zero downstream changes. That's what self-healing means.”*** (hold 3s) |
| **V Automate (bonus)** | 5:30–6:00 | Overnight healing | Actions tab → cron at 03:14 healed before standup → Slack “healed at 03:14” | *“Manual for story, semi-auto for safety, fully auto for sleep.”* |

**Shot list to copy verbatim:**

`create + first run → split dashboard + DB → 0 rows red hold → heal typed live → diff ≥2s → approve → restored count → ID before/after zoom → downstream unchanged → Actions log (if automated).`

README mirrors video: GIF `✓→✕→heal→✓`, Collector ID badge, failure table, validation snippet, continuity diagram, 60s reproduce block.

**Judges want vs generic demo:**

| Signal | Generic (forget) | Winning (remember) |
|--------|-----------------|-------------------|
| Authenticity | Deletes class in local HTML | Real site mutation — Wayback diff or git log, or faithful intentional rename with before/after selectors |
| Observability | “It broke” (says) | **Shows** logs, green checks, row counts, `validate.mjs` output, screenshot hashes |
| Heal precision | `heal "fix"` | `heal "price is now [data-testid=price]; pagination uses ?after cursor"` — narrated |
| Continuity | New collector ID | **Same ID zoomed before/after**, API call unchanged on screen |
| Automation | Manual only | GH Actions cron + `claude -p` with workflow link + badge |
| Craft | README dump | 5-act story with shot list, <6 min video |

---

## 22. Credit Economics — Free Tier, Promo, Per-Participant, Pool

| Layer | Amount | How to Get | Constraints |
|-------|--------|------------|-------------|
| **Free Tier** | **5,000 credits/month** | Sign up at `brightdata.com`, **no credit card** | Renews monthly, per account. Enough for prototyping Collector + ~50–100 test runs on small long-tail site. |
| **Promo Code** | **`wemakedevs`** | Apply during ScrapeVerse signup (Billing → promo field) | Unlocks trial boost — apply **at registration, not after**; before free tier exhaust. Per brief: “Use promo code `wemakedevs` in Billing to get an extra $50 in credits.” |
| **Per-Participant Grant** | **$50 per participant** | Organizers distribute post-registration (confirm in Discord) | For hackathon only. **Team of 4 = $200.** Covers most long-tail scraping at hackathon scale. |
| **Prize Credit Pool** | **$2,500 across teams** | Allocated by organizers (likely top teams / office-hours requests) | Not guaranteed — budget as if you won't get it; request via Discord if hitting limits with a good demo, before Aug 21. |

**Budget model for team of 4 (Aug 17–23):**

- **Total reliable budget:** 4 × 5,000 free credits + 4 × $50 (~ $200 value) ≈ **~20,000+ credits effective** without spending a dollar or entering a card.
- **Long-tail site cost:** Small niche site (1k–5k pages, light JS) ≈ **0.5–2 credits/page** via Collector. Full scrape ≈ **500–2,000 credits**. So **10–20 full scrapes** on free tier alone.
- **What burns credits fast:** Heavy JS rendering on huge sites (Amazon-scale), huge pagination, high frequency (every 5 mins), screenshots/captchas — all unnecessary for demo.

**Seven tactical budgeting rules (from analyst):**

1. Register **4 separate free accounts Day 1** — don't share one account; each gets 5k, use one primary + backups.
2. Apply `wemakedevs` at signup, not later — promo often only works on new accounts.
3. Scope long-tail site narrowly — don't scrape 100k products; 800–2,000 well-structured records with detail pages suffices. Judges prefer depth+healing over volume.
4. **Cache aggressively** during UI dev — save `sample.json` (5 pages), build UI against that. Only hit live Collector for integration tests/demo. Every UI refresh ≠ scrape.
5. One Collector, well-built, not three mediocre. Each's test runs cost credits; iterate one schema.
6. Request pool credits early if needed — before Aug 21 if compelling long-tail+heal demo hitting limits.
7. Document credit usage in README (“Built on ~1,800 credits, ~$X efficient”) — signals production-awareness judges love and proves free-tier stay-in.

---

## 23. Engineering & Demo Hard Requirements — Implicit Technical Needs

| Requirement | Detail | Why It Matters |
|-------------|--------|----------------|
| **Node.js + npx** | `npx -p @brightdata/cli` requires **Node ≥18**, `npx` available; no Python alternative | Environment must have Node; CI/demo must have Node |
| **Auth token persistence** | `bdata login` stores credentials locally (`~/.brightdata` or similar); CI/CD needs token injection via env | Extract API key from dashboard → `BRIGHTDATA_API_KEY` / `.env` for `/dca/trigger` |
| **JSON handling** | All scraped output is JSON; must parse, validate (zod/jsonschema), handle pagination chunking | Judges expect typed parsing + storage beyond raw dump |
| **Storage** | Bright Data delivers via download/webhook/S3; you need persistent store (JSON file, SQLite, Postgres, S3) for app consumption | Demo must not rely on ephemeral CLI output; persist to file/DB and serve via app |
| **Cron / Scheduling** | Either Bright Data native schedule or builder-managed cron (`node-cron`, GH Actions `schedule:`, Vercel Cron) | If claiming “scheduled scraper,” must show scheduling config |
| **Public data only** | Brief: *“Scrape public data only”* — authenticated, paywalled, personal data violates ToS and disqualifies | Vet `robots.txt`/ToS; avoid LinkedIn private profiles, logged-in dashboards |
| **Long-tail site selection** | “Build long tail (avoid 800+ prebuilt sites)” | Choosing Amazon, LinkedIn prebuilt templates = low-effort signal; pick niche e-commerce, gov, RE, job boards, regional sites |
| **Credits** | $2,500 + $50/participant, promo `wemakedevs` | Ensure runs don't exhaust credits before demo |
| **API error handling** | `/dca/trigger` is async; polling/webhook required to confirm delivery | Handle `429`, job pending, empty snapshot, circuit breaker, max 3 heal tries |
| **Terminal evidence** | Screen recording, terminal logs, or agent transcript required to prove terminal-first workflow | No evidence = assumed dashboard usage |

---

## 24. Pre-Submission Checklists — 10 Minutes Before Push

**Compliance & Secrets:**

- [ ] Target verified **public in incognito, no login/paywall**, `robots.txt` documented (excerpt + crawl-delay honored), ToS citation.
- [ ] **Zero PII** fields scraped; compliance statement in README/COMPLIANCE.md (see template §17).
- [ ] `.env` in `.gitignore`, **no secrets in `git log`**, `.env.example` has placeholders only — audit: `git log --all -p | grep -E "brd_|c_[a-z0-9]{6,}|Bearer"` empty.
- [ ] `BRIGHTDATA_TOKEN` and `c_*` loaded from **env**, never hardcoded or logged, rotated if ever exposed.
- [ ] **“Why not prebuilt?”** answered in README with Marketplace search screenshot showing **0 results for your domain**.
- [ ] `POST /dca/trigger` shown programmatically from ≥1 workflow (cron / agent / DB / dashboard) — code + live `curl`.

**Best Practices Proof:**

- [ ] **Self-healing demo rehearsed:** baseline → break → heal → recover with logs, no manual code edit, same `c_*` before/after zoom.
- [ ] `POST /dca/trigger` wired with env var, response handling exists (poll status, handle failure).
- [ ] Terminal-first evidence: `CLAUDE.md` + git co-authorship + terminal recording + `schedule` workflow.

**Engineering Excellence (Spider-Sense):**

- [ ] `npm ci && npm test` passes cleanly on fresh clone; fixtures for `before/after.html`.
- [ ] Selectors centralized with fallbacks, Zod schema validation, structured JSON logging, lint passes.
- [ ] Risk register + healing guardrails documented (no heal on `5xx`/`429`; see §27).

**Demo Readiness:**

- [ ] One-command run documented; Collector health visible in Bright Data dashboard (for checking only).
- [ ] Healing log persisted and shown; workflow continues without break.
- [ ] Deployed URL (not localhost) with last-updated timestamp + healed badge.

**One more — LinkedIn:**

- [ ] LinkedIn post **live**, **@WeMakeDevs** page tagged (typed & selected), native 30s video, links in body + pinned comment.

---

## 25. Repo & Pitch — What Judges Open First, 3-Minute Order

**Files judges will open first (include):**

```
collectors/<site>.json           # exported Collector schema
lib/brightdata.ts                # Collector-as-API wrapper with validation
agents/tools/brightDataTool.ts   # agent tool definition (trigger + heal)
app/api/collect/route.ts         # API endpoint serving validated structured JSON
app/api/scrapers/[id]/run        # existing in your project — wire to POST /dca/trigger
app/api/scrapers/[id]/heal       # existing — wire to bdata scraper heal
app/api/scrapers/[id]/break      # existing — for demo break simulation
app/api/budget                   # existing — credit usage display
.env.example                     # BRIGHT_DATA_API_KEY=, COLLECTOR_ID=
README.md                        # architecture diagram + 5-min setup (<4 commands) + GIF
COMPLIANCE.md                    # public-data proof + robots.txt + ToS
docs/REQUIREMENTS_REPORT_*.html  # this analysis (evidence you followed brief)
fixtures/before.html, after.html # offline healing tests
logs/heal-2026-08-18.json        # persisted heal log (audit trail)
```

**3-minute pitch order (do NOT reorder — per analyst panel):**

1. **(20s) The long-tail gap:** “800 prebuilts exist, but [your niche] has no API — that's the opportunity.”
2. **(40s) Studio:** Show Collector build + schema (field mapping) + live run returning typed JSON.
3. **(60s) Terminal:** Agent prompt → tool call → Collector → structured output → agent insight. Say: *“Collector as API, driven by agent, not human.”*
4. **(60s) Heal:** Break site → show heal → data still flows. **Crescendo.** Say: *“Same Collector ID. Zero downstream changes. That's what self-healing means.”*
5. **(20s) Product:** What structured output *enables* — live product with timestamp, not CSV.

**One-sentence positioning for judges (copy verbatim to README/opening slide):**

> *“We turned an unreliable, undocumented long-tail website into a reliable, typed, self-healing API that our coding agent can reason over — built in Scraper Studio, driven from the terminal, and powering [your product].”*

---

## 26. LinkedIn (Daily Bugle) — Winning Post Framework & Tactics

**Prize:** Samsung Galaxy Watch · **Judged by:** Community/marketing · **Requirement:** Tag **WeMakeDevs** (company page)

**Mandatory:** Type `@WeMakeDevs` and select the page — not `#WeMakeDevs`. Public post (not connections-only) from personal profile (algorithmic reach). Tag teammates, repost; reply to every comment (engagement velocity is ranked).

**Copy-paste framework (fill brackets):**

```
Hook (1 line, pain): "Everyone scrapes Amazon. No one scrapes [your niche long-tail site] — because it breaks every Tuesday."

Build (2-3 lines): "For #ScrapeVerse, we built a custom collector in Bright Data's Scraper Studio for [niche site] — 1,200+ [items] with no prebuilt. Then we let our coding agent drive it from the terminal."

Heal (hero moment): "Then we broke the site on purpose. Class names changed. Our collector healed itself in 42s and kept streaming structured JSON. No 2am XPath fix."

Payoff (quantified): "That JSON now powers [your app] — alerts on 12% price drops across 300 sellers, live."

CTA + Tags: "Live demo: [vercel link] | Code: [github] | Built with Bright Data Collector-as-API + self-healing.

@WeMakeDevs @Bright Data #ScrapeVerse #WeMakeDevs #BrightData #WebScraping #BuildInPublic #AI"
```

**Winning post checklist:**

- [ ] **Video > Image:** 30–45s native screen recording: terminal prompt → collector logs → UI chart updating. Upload natively, don't link YouTube.
- [ ] **Carousel (if no video):** Slide 1 hook, 2 problem (generic scraping pain), 3 Studio screenshot, 4 terminal driving, 5 self-heal log, 6 final product + links.
- [ ] **Timing:** Post **Aug 20–22, 9–11am IST** (WeMakeDevs audience peak). Not Aug 23 night when judges overwhelmed. Early posts compound engagement.
- [ ] **Engagement pod:** All teammates like + substance comment within 30 min, then share with own angle; reply to every comment.
- [ ] **Hashtags:** 4–6 max. Must include `#ScrapeVerse` + `#WeMakeDevs` (+ `#BrightData`). 15 hashtags = spam signal.
- [ ] **Link placement:** GitHub + Live URL in first comment **and** post body (LinkedIn deprioritizes externals, judges still need them; pin comment).
- [ ] **Cross-post:** Repost to X tagging @WeMakeDevs + @BrightData for cross-traffic.
- [ ] **Scope:** LinkedIn `scope` default “mine” for artifact list; for LinkedIn promo, use “Connections” public visibility.

**Common failures:** Code screenshot with no story; tagging `#WeMakeDevs` hashtag not `@` page tag; posting as PDF/document (kills reach); private/Connections-only visibility → invisible to judges.

---

## 27. Risk Register — 7 Risks with Mitigations & Guardrails

> Include this table in `RISK.md` or README — judges love that you name risks (mature). Self-healing introduces new risks; name them, mitigate.

| # | Risk | Likelihood | Impact | Symptoms | Mitigation (Prevent + Heal) | Healing False-Positive Guard |
|---|------|------------|--------|----------|----------------------------|------------------------------|
| **R1** | **Site Instability / Downtime** | High | High — false heal trigger | `HTTP 5xx`, timeouts, empty HTML shell | Retry with backoff (3×, jitter), circuit breaker; distinguish `NETWORK_ERROR` vs `SELECTOR_MISS` — only heal on latter. Log `http_status` separately. | Do not heal on `5xx`; alert only. Require 2 consecutive `200 + empty` before healing. |
| **R2** | **Selector Brittleness (Class Rename)** | Very High | High — 0 or partial records | `recordCount==0` or `completeness < 80%` despite `200 OK` | Fallback chain: `data-testid` > stable attribute > text regex > structural XPath > LLM inference. Centralize selectors. Test with fixtures. | Validate healed selector against `after.html` fixture; require `completeness > 95%` before persisting. |
| **R3** | **Structure Change / Redesign** | Medium | Very High — schema shift | Fields present but wrong type, pagination broken, new layout | Zod schema (required+types), visual DOM diff, LLM re-infers schema from rendered DOM; versioned schemas. | Require human approval or shadow mode: new schema runs parallel 1 cycle, compare, then promote. |
| **R4** | **Rate Limits / IP Bans / CAPTCHA** | High | Medium — throttled / blocked | `429`, `403`, CAPTCHA HTML, Bright Data unblocker retries | Bright Data proxy+unblocker, respectful rate 1–2s, concurrent cap, `Retry-After` respect, rotate sessions. | Never heal on `429/403/CAPTCHA` — heal only on `200 + bad data`. Log `blocked: true` metric. |
| **R5** | **Healing False Positives (Over-Healing)** | Medium | High — corrupts good selectors | Healer patches working selector due to transient empty page (no products on sale) | Completeness threshold + history: compare last 3 runs; require `recordCount` drop >50% *and* `selectorMissConfidence > 0.8`. LLM must cite evidence: “`.price` 0 nodes, new `[data-price]` 142”. | Dry-run + validation gate: healed selectors must pass `npm run heal:validate` against both old+new fixtures before commit. Add `HEALING_ENABLED=false` kill switch. |
| **R6** | **Data Drift / Silent Partial Results** | Medium | Very High — undetected bad data | Returns 142 records but 30% `price: null` | Field-level completeness metrics, `price` null-rate alert, golden-record canary (known product must always be present), `minItems` check. | Heal triggers on partial, not just empty. Keep `completeness` dashboard (judges love this metric). |
| **R7** | **LLM Hallucination in Healing** | Medium | High — invented selectors/fields | Healer invents `discount` that doesn’t exist, or selector matches wrong node | Constrain LLM to DOM evidence: prompt includes `outerHTML` snippet, require citation `selector → matched nodes count`, validate against rendered page, no new fields without schema approval. | Post-heal validation: `healedSelector` must match `≥ expectedCount` nodes and `sampleValues` must pass type checks. |

**Operational playbook to include with it:**

- **Detection:** `completeness = validRecords / expectedMinRecords`, `nullRate` per field, `recordCount` vs rolling average.
- **Healing budget:** Max 3 heal attempts per run, then `alert: "manual review needed"` to Slack/email — prevents infinite loops.
- **Observability:** Structured logs with `runId`, `healAttempt`, `oldSelector`, `newSelector`, `completenessBefore/After` persisted to `/logs/` and optional dashboard tile.
- **Rollback:** Previous selector config versioned in git/DB; `npm run heal:rollback` restores last known good.

---

## 28. Small Details That Matter — Every Detail, No Matter How Small

This section records micro-details that are easy to overlook but judges notice.

- **5 thinking skills auto-discovery mandate** — `MEMORY.md` says scan `/Users/jay/.gemini/skills/` at task start and Read 1–3 matching `SKILL.md` files inline. This analysis scanned and found no `artifact-design` in `.gemini/skills` (found only via `.claude/plugins/marketplaces` fallback).
- **Multi-tool user context** — runs Antigravity (Windows) + Claude Code (mac); cross-tool prompts are behavior-only, not identity/environment.
- **Project search mandate** — start in `/Users/jay/Documents/Projects`; don't scan Desktop/Downloads unless that fails — this analysis honored that (found `scrape-verse-project` in that exact folder without scanning Desktop).
- **Quality over speed** — plan with skills, delegate to subagents, activate skills automatically, report skill on completion, prompt for requirements on new projects — this analysis delegated 5 parallel subagents.
- **Clear explanations** — always summarize what was added/changed in short descriptions after completing work — honored.
- **Exact CLI strings:** `npx -p @brightdata/cli` (ephemeral) — not `npm install -g` — is the *documented* bootstrap. `bdata login` (no args) is browser OAuth. `bdata scraper create` keyword is **create**, not `build` or `new`.
- **Example Collector ID in brief** for `--reject`: `c_mpohus372o5tmid1jk` — useful as pattern for testing grep.
- **Prizes micro-detail:** Daily Bugle track description says *“WeMakeDevs. LinkedIn only: posts anywhere else don't count.”* — verbatim.
- **Bright Data Scraper Studio handling micro-list:** proxies, browser rendering, CAPTCHA solving, retries, unblocking, scheduling, data delivery — all **7** explicitly listed in brief under “platform handles”.
- **Coding agent list verbatim:** “Claude Code, Cursor, Codex, or VS Code” — note `VS Code` qualifies as agent host per brief.
- **Image assets referenced by brief:** `-1.webp` graph, `-2.svg` animated, `-3.webp` login, `-4.webp` create, `-5.webp` run, `-6.webp` heal, `-7.webp` bulb, `-8.webp` prizes — if you clone, these are your visual proof checklist.
- **Scraper type capitalizations:** PDP, Discovery, Sitemap, Search — as titled in brief’s “Scraper type” lines for each of 9 ideas.
- **Approvals micro-semantics:** `bdata scraper approve` without `--reject` = **approve**; `--reject` = **discard** proposed fix and retry with sharper prompt — brief explicitly distinguishes.
- **Collector trigger micro-path:** Brief writes `POST /dca/trigger` (not `/api/trigger` or `/v1/collect`). Use exactly that path with `?collector=c_xxx` query form supported by examples.
- **Free tier micro-condition:** “5,000 credits/month, no card required” — per Prizes section. Promo `wemakedevs` claimed in **Billing → extra credits** (brief says “Billing extra credits”). Use before free tier exhaust.
- **Long-tail micro-categories listed in brief’s Best Practices:** “regional e-commerce, catalogs, niche sites, documentation, competitor changelogs” — quote these verbatim in your README justification.
- **Terminal UI micro-quote:** “Use the dashboard only to check your Collector or configure a schedule.” — keep only those two dashboard moments.
- **Blog image alt text note:** `bright data login` → `brightdata.com` is partner sponsor; mention them correctly in LinkedIn.
- **Project folder peek (2026-08-18 11:54 UTC) — exact file list before audit:**
  ```
  /Users/jay/Documents/Projects/scrape-verse-project/
  ├── app/
  │   ├── api/
  │   │   ├── budget/route.ts
  │   │   ├── logs/route.ts
  │   │   ├── metrics/route.ts
  │   │   └── scrapers/
  │   │       ├── route.ts
  │   │       └── [id]/
  │   │           ├── break/route.ts
  │   │           ├── heal/route.ts
  │   │           └── run/route.ts
  │   ├── globals.css, layout.tsx, page.tsx
  ├── components/
  │   ├── BreakSimulator.tsx, DataExplorer.tsx, DiffViewer.tsx,
  │   │   Header.tsx, LiveTerminal.tsx, MetricCards.tsx, ScraperMatrix.tsx
  ├── docs/
  │   ├── COMPREHENSIVE_ANALYSIS_AND_REMEDIATION_PLAN.md
  │   ├── HACKATHON_SUBMISSION_STRATEGY.md
  │   ├── PRD.md, PROJECT_CHARTER.md, SYSTEM_ARCHITECTURE.md
  ├── src/ (exists)
  ├── tests/ (exists)
  ├── next-env.d.ts, next.config.mjs, postcss.config.js, tailwind.config.js, tsconfig.json, package.json
  ├── node_modules/ (15610 files counted 2026-08-18)
  └── MEMORY.md + reports: /tmp/scrapeverse-requirements-report.html, /tmp/scrapeverse-blueprint.html
  ```
  *File count:* 15,610 via `find … -type f | wc -l` (includes `node_modules`; un-audited).
- **Tool loading micro-detail:** This session authenticates with `ANTHROPIC_AUTH_TOKEN` which takes precedence over `claude.ai` login — hence `Artifact` publish fails with “Unset ANTHROPIC_AUTH_TOKEN, then run /login”. HTML files remain viewable via `! open`.
- **Security mandate bypass:** `scrape public data only` + `Never expose tokens/.env files in your repo/demo. Collector Every scraper gets a Collector…` — truncated but intent clear; plus green → amber → red badge semantics in report.
- **Promo code sensitivity:** `wemakedevs` is lowercase all one word — case matters; test with exact.
- **Schedule micro-detail for CI:** Brief says “scheduling” is handled — you may use platform schedule OR self-managed; both need conf evidence.
- **Approach called “hero project”** is #4 `Self-healing scraper (the hero project)` in brief with heading `(the hero project)` in parentheses — quote that nickname in pitch to signal you read the brief.
- **Blog author handle nuance:** “Sachin Sharma CMO, WeMakeDevs” — include his title correctly if citing.
- **Blog tag nuance:** `tags: ["hackathon","technical"]` — no additional tags — brief is technical hackathon, not general blog.
- **Data type note:** Collected data is “structured data” turned from websites — phrase exactly *“turn websites into structured data”*; use that line in Suit-Up copy.
- **Subagent provenance:** 5 agents `ac383...` (CLI), `a88c17...` (judging), `a47215...` (ideas), `af1d1d...` (compliance), `a56649...` (self-healing arch, `374s` runtime) — each dumped JSONL to `/Users/jay/.claude/projects/-Users-jay/.../subagents/`.

---

## 29. Source & Provenance — How This Analysis Was Built

| Step | What Happened | Command / Evidence |
|------|---------------|---------------------|
| 1 | Fetched blog HTML via `curl -sL https://www.wemakedevs.org/blogs/scrape-verse-kick-off` → 155 KB saved to `…/tool-results/b1azxy6q5.txt` (2 KB preview confirmed `Scrape-Verse` heading, `$15,000` prizes, `self-healing scraper` copy) | `Bash: curl | head -n 200` |
| 2 | Extracted readable text: `sed 's/<[^>]*>/ /g' | tr -s ' ' '\n' | grep -v "^$"` → initial garbled snippet (confirmed `bdata scraper create/heal/approve` strings) | `Bash: sed | tr | grep` |
| 3 | Resolved raw markdown via GitHub repo enumeration: `GET /repos/WeMakeDevs/blogs/contents` → `['.github','.gitignore','AGENTS.md','CLAUDE.md','README.md','authors.json','images','posts']`; `GET /repos/WeMakeDevs/blogs/contents/posts` → `['back-to-metadata.md','fix-your-ai-data-pipeline.md','hack-all-february.md','may-edition.md','scrape-verse-kick-off.md']`; `GET raw …/posts/scrape-verse-kick-off.md` → **full markdown (first 500 lines)` title:"Getting Started Guide For The Bright Data Hackathon" datePublished 2026-08-17` | `Bash: curl api.github.com` + `curl raw.githubusercontent` |
| 4 | Listed project root per mandate `/Users/jay/Documents/Projects` → found 13 entries including `scrape-verse-project`, `NEXUS`, `Python`, etc. + home `ls -1 /Users/jay` (Agents mode) | `Bash: ls -1` |
| 5 | Fan-out 5 `Agent` subagents (parallel): “Analyze CLI and platform reqs”, “Analyze judging and tracks”, “Analyze project ideas”, “Analyze best practices”, “Analyze self-healing arch” — each fed full markdown as prompt context | `Agent tool ×5` |
| 6 | Collected 4 agent completions (ac383 `44s`, a88c `78s`, af1d `83s`, a472 `103s`, a566 `374s`) — synthesized their outputs | `TaskNotification ×5` |
| 7 | Peeked project structure (not deep audit): `ls -R scrape-verse-project | head -n 100` → 10 top-level dirs, 15,610 files | `Bash: ls -R | find -type f | wc -l` |
| 8 | Loaded `artifact-design` skill search: `find /Users/jay/.gemini/skills` → none; fallback to `.claude/plugins/marketplaces/claude-plugins-official` | `Bash: find` |
| 9 | Generated HTML report (49 KB, blueprint 80 KB) → saved to `/tmp/scrapeverse-requirements-report.html` + `/tmp/scrapeverse-blueprint.html`; attempted `Artifact` publish → failed due to `ANTHROPIC_AUTH_TOKEN` precedence; copied HTML to `docs/REQUIREMENTS_REPORT_2026-08-18.html` | `Write + Bash cp` |
| 10 | Wrote this exhaustive MD to repo root per your 2026-08-18 instruction | `Write` |

---

## 30. Next Step — What the Upcoming Repo Audit Will Check

When you say **“audit my project now”**, I will run a file-by-file verification against every section of this document — no truncation. Checklist the audit will pin down to line numbers:

1. Is there a real `c_*` wired to `POST /dca/trigger` in `app/api/scrapers/[id]/run` and `lib/brightdata.ts`? Or is it a stub/mocked?
2. Is `src/` / `tests/` + `components/{BreakSimulator,DataExplorer,DiffViewer,LiveTerminal,MetricCards,ScraperMatrix}` consistent with a self-healing story or generic scaffold?
3. Do `docs/{PRD,PROJECT_CHARTER,SYSTEM_ARCHITECTURE,HACKATHON_SUBMISSION_STRATEGY,COMPREHENSIVE_ANALYSIS_AND_REMEDIATION_PLAN}` contradict or support the brief’s 5 best practices? (Overlap will be flagged.)
4. Is terminal-first real: `CLAUDE.md`/`AGENTS.md` + git log `Co-Authored-By: Claude` + GH Actions `schedule` workflow?
5. Is compliance real: public target listed, `robots.txt` honored, zero PII, `.env` gitignored, `grep` of `git log` clean?
6. Does the app consume JSON as API with Zod validation + storage + diff/“healed” badge, or just dump to `data.json`?
7. Is there a recorded heal demo path (even simulated via `app/api/scrapers/[id]/break` → `/heal` with persisted `logs/` + same `c_*`)? Or is `heal` unimplemented?
8. Are credits (`package.json` dependencies, `next.config.mjs`, budget route) consistent with `wemakedevs` promo and 5,000 free-tier reality?

**This MD is done. Say “audit” and I switch from requirements reconstruction to repo forensics — with line-colon clickable references.**

---

*Generated 2026-08-18 by 5-analyst fan-out, before-build. No repo assumptions. Exhaustively recorded per instruction — every detail, no matter how small, included above.*
