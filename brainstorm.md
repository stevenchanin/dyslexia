# Brainstorm: Low-Effort, High-Impact Extensions

Goal: Identify extensions that materially increase user value without significantly increasing build complexity. Each idea includes rationale, rough effort, dependencies, and a viability note based on the repository’s research and practical constraints.

## Priority Candidates (Promising)

1) Offline Content Packs (Download Lessons)
- What: Add a "Download for offline" control per module/week with size estimates; pre-cache audio/text via Workbox.
- Why: Many low-income families have unstable connectivity; predictable offline usage increases completion rates.
- Effort: S-M (UI + Workbox routes; content bundling).
- Dependencies: Existing PWA + Workbox; IndexedDB for manifests.
- Viability: Promising. Strongly aligned with MOBILE_FIRST_STRATEGY; technically straightforward using cache-first strategies.

2) Low-Bandwidth Mode Toggle
- What: Global toggle that reduces media (no images/animations), prefers TTS over pre-recorded audio, and compresses/defers downloads.
- Why: Data conservation for mobile users; faster loads on slow networks.
- Effort: S (feature flag + CSS class + conditional asset loading).
- Dependencies: Existing TTS fallback; conditional rendering.
- Viability: Promising. Minimal code paths, clear benefit per MOBILE_FIRST_STRATEGY data goals.

3) 1-Minute Placement Probe
- What: Quick initial assessment (phoneme segmentation + CVC decoding + sight words) to seed starting difficulty.
- Why: Faster time-to-value; reduces early frustration; improves personalization before adaptive logic gathers data.
- Effort: S (3 short probes + rules mapping to initial difficulty). 
- Dependencies: Existing exercise engine.
- Viability: Promising. Fits evidence-based practice; cheap to implement.

4) Manual WCPM Mode (No Cloud STT Needed)
- What: Provide a manual fluency assessor: timer + easy error tap UI while listening, auto-calc WCPM/accuracy.
- Why: Avoids STT costs/latency; works fully offline; still captures the key metric.
- Effort: S (timer, counter UI, arithmetic); optional STT remains.
- Dependencies: None beyond UI.
- Viability: Promising. Directly supports key metric from RESEARCH.md with very low complexity.

5) Printable Progress & IEP Packet
- What: Generate parent/teacher-friendly PDF/print view with WCPM trend, skill mastery, attendance/streak, and next-step recommendations.
- Why: Improves motivation; useful for IEP/504 meetings; increases perceived value.
- Effort: S (client print CSS) → M (server PDF later).
- Dependencies: Existing progress data.
- Viability: Promising. High value, light frontend work initially.

6) Localization Framework + Community Translations
- What: Wire i18n (e.g., i18next) for UI strings; add translation contribution process. Start with Spanish.
- Why: Expands reach internationally and for US bilingual families.
- Effort: M (plumbing + string extraction; incremental rollout).
- Dependencies: None blocking; content copy later.
- Viability: Promising. Medium lift with outsized reach; pairs well with TTS multi-language.

7) Parent SMS/WhatsApp Nudges (Opt-in)
- What: Weekly progress summary + practice reminders via SMS/WhatsApp with deep links.
- Why: Improves adherence; helpful for busy caregivers.
- Effort: S-M (Twilio/WhatsApp integration + templates + consent).
- Dependencies: Consent + unsub; minimal backend endpoint.
- Viability: Promising. Narrow scope messaging first; strong engagement upside.

8) Household Profiles (Siblings) with Quick Switch (PIN)
- What: Parent account hosts multiple child profiles; quick PIN switcher on mobile.
- Why: Common real-world need; reduces sign-in friction.
- Effort: M (data model + UI switcher); low risk.
- Dependencies: Auth + simple role/relationship model.
- Viability: Promising. Fits TECHNICAL_PLAN roles; contained scope.

9) QR-Based Offline Backup/Transfer
- What: Export an encrypted progress JSON as QR chunks; import via camera scan to restore/merge on another device.
- Why: Privacy-preserving backups for families without reliable cloud sync.
- Effort: M (encode/decode + simple crypto; chunking for long payloads).
- Dependencies: None; optional.
- Viability: Promising. Useful for offline-first; moderate but manageable.

10) Decodable Text Generator (Phonics-Constrained)
- What: Simple rule-based generator for short decodable sentences tied to current grapheme sets (no LLM needed initially).
- Why: Infinite practice without large content authoring burden.
- Effort: M (grapheme inventories + syllable patterns + templating).
- Dependencies: Content definitions per level.
- Viability: Promising. Start deterministic; consider LLM later.

11) Phoneme-by-Phoneme TTS Scaffolding (Tap-to-Hear)
- What: Allow tapping letters/graphemes to hear phoneme; progressively blend sounds.
- Why: Reinforces GPC mapping; aligns with Structured Literacy.
- Effort: S (Web Speech API hooks + UI affordance).
- Dependencies: Existing audio pattern.
- Viability: Promising. Low effort; strong learning value per RESEARCH.md.

12) Micro Parent Coaching Tips
- What: 1-sentence, research-backed tips interleaved post-session; link to longer guidance.
- Why: Replaces expensive oversight with actionable, digestible guidance.
- Effort: S (content list + rotation logic); later LLM personalization.
- Dependencies: None.
- Viability: Promising. High perceived value, trivial to ship.

13) Teacher CSV Import/Export (Lightweight)
- What: Allow educators to upload a simple roster CSV and export progress CSV.
- Why: Immediate school usability without complex SIS integrations.
- Effort: S-M (CSV parse + mapping screen + export).
- Dependencies: Educator role gate.
- Viability: Promising. Small step toward school adoption.

14) Streak Forgiveness/Insurance
- What: Automatically forgive 1 missed day per week or earn “streak insurance” tokens.
- Why: Reduces demotivation from unavoidable misses; sustains habit.
- Effort: S (streak logic tweak + UX copy).
- Dependencies: Points/badges system.
- Viability: Promising. Near-zero lift, meaningful engagement impact.

15) Haptics + Reduced Motion Options
- What: Light haptic taps for correct answers; "reduced motion" preference respected globally.
- Why: Multi-sensory reinforcement + accessibility.
- Effort: S (navigator.vibrate + prefers-reduced-motion CSS).
- Dependencies: None.
- Viability: Promising. Tiny change, nice UX.

16) Shareable Achievement Cards (Privacy-Safe)
- What: Generate a shareable image (name-optional) for milestones; default private, explicit opt-in.
- Why: Boosts motivation and organic reach.
- Effort: S-M (client canvas render + download/share intent).
- Dependencies: Achievement events.
- Viability: Promising. Keep privacy-first; no social graph needed.

## Ideas That Don’t Pan Out (For Now)

17) Eye-Tracking via Phone Camera for Reading Metrics
- Why considered: Could measure fixation/saccades automatically.
- Verdict: Not now. High complexity, unreliable on commodity phones, privacy concerns, and not necessary for core outcomes (WCPM and accuracy already effective per RESEARCH.md).

18) AR Letter Tiles / Physical Manipulatives Recognition
- Why considered: Blend tactile learning with app guidance.
- Verdict: Not now. Significant CV work, fragile UX, and adds hardware assumptions; better ROI with on-screen multi-sensory features first.

19) Dyslexia-Specific Fonts Support as a Feature
- Why considered: Common request in public discourse.
- Verdict: Drop. RESEARCH.md and multiple studies show no measurable benefit over Arial; adds complexity and may mislead users about efficacy.

## Suggested Next Steps
- Ship S-sized items first: 1-minute placement, manual WCPM, low-bandwidth mode, phoneme tap-to-hear, streak forgiveness, haptics/reduced motion, micro coaching tips, printable progress (print CSS).
- In parallel prototype one M-sized lever: localization (Spanish) or decodable text generator.
- Validate impact via LOW_COST_TESTING_PLAN metrics (engagement lift, faster time-to-first-success, session adherence).

