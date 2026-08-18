# 📜 AegisScrape Compliance, Legal Hygiene & Credit Economics

> **Project:** AegisScrape (`scrape-verse-project`)  
> **Hackathon:** Into the Scrape-Verse by **WeMakeDevs** & **Bright Data** (August 17–23, 2026)  
> **Standard:** Mandated by `SCRAPEVERSE_REQUIREMENTS_ANALYSIS.md` (§16, §17, §18, §22)

---

## 1. Target URL Inventory & Long-Tail Verification (§12, §16.1, §17)

All data collectors in AegisScrape operate exclusively against long-tail, unauthenticated, public web resources that are **not** covered by pre-built marketplace scrapers (e.g. Amazon, LinkedIn, Walmart):

| Collector ID | Target URL | Domain | Category | Data Fields Harvested | Public Access Verified |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `c_layoffs_v2_hackathon` | `https://layoffs.fyi/live-data` | `layoffs.fyi` | Tech Workforce | `company`, `count`, `role`, `date` | ✅ Incognito / Unauthenticated |
| `c_llm_benchmarks_live` | `https://huggingface.co/spaces/open-llm-leaderboard` | `huggingface.co` | AI Benchmarks | `modelName`, `params`, `mmluScore`, `license` | ✅ Open Source Research Space |
| `c_ai_jobs_stream` | `https://news.ycombinator.com/jobs` | `news.ycombinator.com` | AI Job Market | `item`, `company`, `location`, `salary` | ✅ Public Job Board Listing |

---

## 2. Robots.txt Compliance & Ethical Crawl Policies (§17)

AegisScrape adheres to modern web data collection ethics and crawl boundaries:

1. **Explicit `robots.txt` Permissions:**
   - **`layoffs.fyi/robots.txt`**: Allows standard indexer and user-agent access to public summary pages.
   - **`huggingface.co/robots.txt`**: Explicitly permits read access to public Spaces and Leaderboard tables.
   - **`news.ycombinator.com/robots.txt`**: Standard crawl policy respected with low request frequency.
2. **Crawl Delay & Rate Limiting:**
   - Collector heartbeat runs every 6 hours via GitHub Actions cron (`0 */6 * * *`), ensuring negligible server load.
   - Automated retries employ exponential backoff on HTTP `429 RateLimit` responses with jitter.
3. **No Authentication Bypass:**
   - AegisScrape collects only what is rendered to a first-time, logged-out visitor in an incognito session.
   - Zero bypass of paywalls, authentication cookies, CAPTCHAs, or private user profiles.

---

## 3. Zero Personally Identifiable Information (PII) Certificate (§17.2)

AegisScrape certifies that **zero PII is harvested, stored, or processed**:

```
┌────────────────────────────────────────┬────────────────────────────────────────┐
│ ❌ EXCLUDED (Zero-PII Guarantee)        │ ✅ INCLUDED (Public Macro Data Only)    │
├────────────────────────────────────────┼────────────────────────────────────────┤
│ • Employee Names                       │ • Corporate Entity Name (e.g. CloudCore)│
│ • Personal Email Addresses             │ • Aggregated Layoff Headcount Numbers │
│ • Personal Phone Numbers               │ • Division Names (e.g. Engineering)    │
│ • Home Addresses or Geographic PII     │ • Public Benchmark Scores (e.g. MMLU)  │
│ • Candidate Profiles / Resumes         │ • Open-Source License Classifications  │
│ • Individual Compensation Records      │ • Salary Range Bands ($180k-$220k)     │
└────────────────────────────────────────┴────────────────────────────────────────┘
```

---

## 4. Ephemeral Data Retention & Storage (§17.3)

1. **Local SQLite Persistence:** Extracted run records and logs are stored locally in SQLite (`DATABASE_URL=file:./data/aegis.db`).
2. **7-Day Rolling Retention Window:** Telemetry logs and raw run samples are pruned after 7 days to eliminate unnecessary data storage.
3. **No Secondary Data Re-selling:** Data is used exclusively for live observability monitoring and self-healing validation demonstration.

---

## 5. Bright Data Credit Economics & Free-Tier Sustainability (§22)

AegisScrape is architected to operate efficiently within the hackathon resource allocation:

### Official Credit Allocation
- **Bright Data Monthly Free Tier:** **5,000 credits / month** (No credit card required).
- **WeMakeDevs Hackathon Promo Code:** `wemakedevs` (Unlocks an additional **+$50 credit grant** in Bright Data billing).
- **Total Effective Team Capacity (4 members):** ~20,000+ credits / $200 effective balance.

### Scrape & Self-Healing Unit Economics

| Operation | Infrastructure Utilized | Cost per Execution | Free Tier Capacity |
| :--- | :--- | :---: | :---: |
| **Collector Heartbeat Check** | REST `POST /dca/trigger` | ~0.5 – 1.0 Credits | **5,000 – 10,000 checks** |
| **Full Page Scrape & Validation** | Bright Data Residential Proxies + Web Unlocker | ~2.0 – 5.0 Credits | **1,000 – 2,500 runs** |
| **Autonomous Self-Heal (`bdata scraper heal`)** | Bright Data AI DOM Parser & Heuristics | ~5.0 – 10.0 Credits | **500 – 1,000 healing events** |
| **Human-in-the-Loop Approve** | `@brightdata/cli bdata scraper approve` | 0 Credits (Local Config Mutation) | **Unlimited** |

---

## 6. Secret Management & 12-Factor Security (§18)

- **API Token Isolation:** `BRIGHT_DATA_API_KEY` (and alias `BRIGHTDATA_TOKEN`) is loaded strictly from environment variables.
- **Git Hygiene:** `.env` and `.env*.local` are explicitly ignored in `.gitignore`. Zero credentials have ever been committed to the Git tree.
- **Client Shielding:** Automated unit test (`tests/harsh-comprehensive.test.js`) verifies that `BRIGHT_DATA_API_KEY` is never exposed in client components.
