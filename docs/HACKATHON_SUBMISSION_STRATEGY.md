# Hackathon Submission Strategy

## Maximizing Score Across Tracks
1. **Web-Slinger Grand Prize (Best Overall Use)**: Highlight the deep integration with both the Web Scraper IDE and the `@brightdata/cli`. Emphasize the "Autonomous" nature of the integration.
2. **Suit-Up Best UI**: Focus on a clean, dark-mode "Control Center" aesthetic for the dashboard. Ensure real-time feedback (e.g., spinning indicators during healing) and clear data visualizations (charts for success rates, schema drift).
3. **Spider-Sense Clean Code**: Implement strict TypeScript typing, modular architecture (separation of concerns between runner, healer, and UI), and extensive inline documentation. Provide a comprehensive setup guide in the main README.
4. **Daily Bugle (Best Article/Video)**: Craft a compelling narrative focusing on the pain of broken scrapers and the magic of self-healing. The video should be punchy and problem/solution oriented.

## Demonstration Checklist for Judges
- [ ] **Proof of Collector ID**: Clearly show the Bright Data interface and the connected Collector ID in the project configuration.
- [ ] **Live Broken DOM Test Scenario**: A controlled demo where we intentionally change a target dummy site's structure to break the scraper.
- [ ] **Live Heal Demonstration**: Show the CLI/Dashboard automatically detecting the failure, initiating the heal process, and successfully re-extracting the data.
- [ ] **Log Visibility**: Display clear, readable logs in the UI proving the self-healing steps (diffing, heuristic fallback, success).
- [ ] **Video Script Outline**:
    - Hook: The frustration of broken scrapers (0:00-0:15)
    - Introduction: Meet AegisScrape (0:15-0:30)
    - The Problem Demo: Breaking the DOM (0:30-1:00)
    - The Magic: Self-Healing in action (1:00-2:00)
    - The UI: Observability Dashboard (2:00-2:30)
    - Conclusion & Tech Stack summary (2:30-3:00)

## 5-Day Implementation Roadmap (Aug 18 - Aug 23, 2026)

| Day | Focus Area | Tasks |
| :--- | :--- | :--- |
| **Day 1 (Aug 18)** | **Architecture & Setup** | Initialize repo, setup Bright Data CLI, configure PostgreSQL/SQLite, scaffold Next.js dashboard. |
| **Day 2 (Aug 19)** | **Core Engine Integration** | Build base scraper runner, implement schema validation, set up basic error detection. |
| **Day 3 (Aug 20)** | **The Self-Healing Brain** | Implement DOM diffing logic, heuristic fallbacks, and the AI re-prompting integration. |
| **Day 4 (Aug 21)** | **Observability UI & CI/CD** | Connect backend APIs to the Next.js dashboard, create GitHub Actions workflows for cron and auto-PRs. |
| **Day 5 (Aug 22)** | **Testing & Polish** | End-to-end testing of the "break and heal" flow, refine UI aesthetics, ensure clean code standards. |
| **Day 6 (Aug 23)** | **Submission Prep** | Record demo video, write DEV.to article (Daily Bugle track), finalize README and documentation. |
