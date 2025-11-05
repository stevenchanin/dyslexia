# Low-Cost Release Readiness Strategy

A pragmatic validation plan that relies on automation, free-tier SaaS, and targeted volunteer time so we can prove efficacy without large budgets.

## 1. Ground Rules
- **Automate first:** Anything we repeat twice becomes a script or GitHub Action workflow.
- **Free before paid:** Prefer OSS tools (Jest, Playwright, axe-core) or free-tier services (GitHub Actions, PostHog, BrowserStack open-source).
- **Volunteer-friendly:** Design reviews and data collection so a rotating group of trained volunteers can help asynchronously.
- **Evidence or no launch:** Every gate in the release checklist must be green before expanding access.

## 2. Automated Quality Coverage
| Scope | Tooling | Cadence | Owner |
| --- | --- | --- | --- |
| Unit & component tests | Jest + React Testing Library | On every PR via GitHub Actions free minutes | Lead engineer |
| API contract tests | Supertest hitting mocked DB | Nightly cron workflow (GitHub Actions) | Volunteer engineer |
| End-to-end smoke flows | Playwright headless runs against staging | Weekly scheduled workflow | Lead engineer |
| Accessibility regression | `jest-axe`, Lighthouse CI | PR + nightly | Accessibility champion (volunteer) |
| Offline/mobile resilience | Workbox testing library + Android emulator snapshot | Weekly | Lead engineer |

### Implementation Steps
1. Add npm scripts (`test`, `test:ci`, `test:e2e`, `test:accessibility`).
2. Configure `.github/workflows/ci.yml` using matrix builds (Node LTS) with caching to stay under free minutes.
3. Record core Playwright flows (login → exercise → sync) and stub network calls for determinism.
4. Add Lighthouse CI configuration targeting `/`, lesson player, and progress dashboard.
5. Store failing artifacts in GitHub Actions logs + upload HTML reports for async review.

## 3. Content & Instruction Fidelity (Volunteer Driven)
1. **Recruitment** – Post in university literacy programs and nonprofit partner channels for 3–5 reviewers; provide onboarding micro-video.
2. **Review Workflow** – Use a shared Google Sheet with tabs per module; volunteers log rubric ratings (clarity, scaffolding, alignment) and attach Loom critiques.
3. **Triage** – Program manager reviews sheet weekly, opens GitHub issues labeled `content-blocker` for anything rated "needs revision".
4. **Sanity Check** – Monthly 30-minute sync with a certified Structured Literacy specialist (pro bono) to approve rubric changes.

## 4. AI Safety & Honesty
1. **Prompt Regression Suite** – Maintain `ai_prompt_tests.json` with canonical inputs/expected intents; run via simple Node script weekly using OpenAI free credits/Azure grant.
2. **Moderation Layer** – Route all AI responses through OpenAI Moderation (still covered under free tier) before rendering in app.
3. **Oversight Rotation** – Two volunteers alternate bi-weekly to review flagged transcripts in Notion; issues escalated via GitHub Discussions.
4. **Tone Guardrails** – Include automated check ensuring AI recommendations cite timeframe ranges (e.g., "over the next few weeks") to avoid overpromising.

## 5. Micro-Pilot Monitoring
1. **Opt-in Cohorts** – Offer slots to 5–10 families via partner newsletters; collect consent with Google Forms.
2. **Analytics Stack** – Track key events (session start, exercise completed, sync success) with PostHog free tier; set alerts for drop-offs >30% week-over-week via Slack webhook.
3. **Progress Evidence** – Caregivers administer open-source DIBELS-style probes pre/post using printable PDFs; log scores in shared Google Sheet that auto-graphs growth.
4. **Feedback Pulse** – Automate weekly check-ins via Google Forms; nudge responses with free Zapier tier emailing reminders.

## 6. Release Gate Checklist
- [ ] CI badge green (unit, integration, accessibility, Playwright).
- [ ] No open `content-blocker` issues from volunteer reviews.
- [ ] AI prompt regression script passes with 0 critical deviations.
- [ ] Moderation log processed within 7 days, no unresolved red flags.
- [ ] Pilot cohort maintains ≥70% weekly active learners and ≥10 WCPM improvement over baseline after 6 weeks.
- [ ] Family satisfaction survey average ≥4/5 for two consecutive weeks.

## 7. Lightweight Reporting
- Auto-generate a Notion status page summarizing CI runs, volunteer review counts, AI incidents, and pilot metrics using free Notion API + scheduled GitHub Action.
- Share a monthly "evidence packet" PDF (Google Docs + exported charts) with stakeholders to maintain transparency without custom tooling.

## 8. Minimal Staffing Plan
| Role | Time Commitment | Responsibilities |
| --- | --- | --- |
| Lead engineer | 2 hrs/week | Maintain CI workflows, triage failing tests |
| Volunteer engineer | 1 hr/week | Update Playwright scripts, review nightly API runs |
| Program manager (volunteer) | 1 hr/week | Coordinate content reviews, synthesize feedback |
| AI oversight pair | 30 min/week each | Review flagged transcripts, adjust prompts |
| Pilot liaison (founder) | 30 min/week | Communicate with families, monitor survey responses |

By leaning on automation, free tooling, and well-scoped volunteer contributions, we can guard against false hope and only expand access once real-world evidence confirms impact—without straining finances or staff.
