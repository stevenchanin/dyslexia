# Naming Research and Domain Check

Date: 2025-11-06

## Parent Language (from IDA, Decoding Dyslexia, Understood.org, Reddit)
- Core needs: help my child read; evidence-based intervention; works at home/on phone; affordable/free; measurable progress.
- Emotions: hope, relief, empowerment; reduce stigma; kid‑friendly tone.
- Keywords/themes: reading progress, steps/path/bridge, confidence, family/together, practice at home, structured literacy/phonics/fluency.

Sources fetched via `scripts/fetch_parent_language_sources.sh`; raw HTML/JSON saved under `research_scrapes/`.

## Naming Themes
- Progress/Steps: ReadLadder, ReadRise, ReadForward, ReadStep, WordSteps, SkillSteps
- Path/Bridge: ReadPath, FluentPath, WordBridge, PhonoPath, SoundPath, ReadTrail
- Spark/Light: ReadSpark, ReadBeam, BrightRead, ReadGlow
- Growth/Nurture: ReadNest, ReadRoots, ReadBloom, ReadSprout
- Lift/Support: LetterLift, SoundLift, ReadLift, ReadGuide
- Together/Family: ReadTogether, FamilyRead, ReadWithMe, HomeRead, PocketRead
- Clarity/Confidence: ClearRead, ReadyRead, TrueRead

## Shortlist + Rationale
- ReadLadder — clear “climb/progress” metaphor; aligns with stepwise literacy.
- LetterLift — playful alliteration; maps to phonics/letter‑sound support.
- SoundSteps — directly tied to phonological awareness.
- FluentPath — credible trajectory toward fluency.
- ReadSpark — motivational “ignite reading” energy.
- ReadNest — warm, home‑practice resonance.
- ReadBeam — clarity/light metaphor.
- WordBridge — “bridge to words/meaning” for decoding.

## Domain Availability (Single Matrix)

Checked via rdap.org aggregator using `scripts/check_domains.sh` with throttling (DELAY) on expanded TLDs.

TLDs: .org, .com, .app, .net, .io, .education, .academy, .kids, .care, .health

| Name        | .org     | .com     | .app     | .net     | .io      | .education | .academy | .kids    | .care    | .health  |
|-------------|----------|----------|----------|----------|----------|------------|----------|----------|----------|----------|
| ReadLadder  | AVAILABLE| AVAILABLE| AVAILABLE| AVAILABLE| AVAILABLE| AVAILABLE   | AVAILABLE| AVAILABLE| AVAILABLE| AVAILABLE|
| LetterLift  | AVAILABLE| TAKEN    | AVAILABLE| TAKEN    | AVAILABLE| AVAILABLE   | AVAILABLE| AVAILABLE| AVAILABLE| AVAILABLE|
| SoundSteps  | AVAILABLE| TAKEN    | TAKEN    | TAKEN    | AVAILABLE| AVAILABLE   | AVAILABLE| AVAILABLE| AVAILABLE| AVAILABLE|
| FluentPath  | AVAILABLE| TAKEN    | TAKEN    | TAKEN    | AVAILABLE| AVAILABLE   | AVAILABLE| AVAILABLE| AVAILABLE| AVAILABLE|
| ReadSpark   | TAKEN    | TAKEN    | AVAILABLE| TAKEN    | AVAILABLE| AVAILABLE   | AVAILABLE| AVAILABLE| AVAILABLE| AVAILABLE|
| ReadNest    | TAKEN    | TAKEN    | AVAILABLE| TAKEN    | AVAILABLE| AVAILABLE   | AVAILABLE| AVAILABLE| AVAILABLE| AVAILABLE|
| ReadBeam    | AVAILABLE| TAKEN    | AVAILABLE| AVAILABLE| AVAILABLE| AVAILABLE   | AVAILABLE| AVAILABLE| AVAILABLE| AVAILABLE|
| WordBridge  | TAKEN    | TAKEN    | TAKEN    | TAKEN    | AVAILABLE| AVAILABLE   | TAKEN    | AVAILABLE| AVAILABLE| AVAILABLE|

Notes
- Snapshot date: 2025-11-06. Availability can change at any time.
- Method: rdap.org HTTP checks (rate‑limited friendly); see scripts below.

## Recommendations
- Top pick: ReadLadder — clean, mission‑aligned, .org/.com/.app all available (brandable + flexible TLD choice).
- Strong alternatives: LetterLift (.org/.app), FluentPath (.org), SoundSteps (.org), ReadBeam (many TLDs available incl. .org/.app/.io).
- If prioritizing nonprofit identity: prefer `.org` for credibility; consider `.app` for installability cues on mobile; reserve `.com` when available to avoid confusion.

## Scripts
- Fetch sources: `scripts/fetch_parent_language_sources.sh`
- RDAP check (aggregator, supports throttling via DELAY): `scripts/check_domains.sh`
