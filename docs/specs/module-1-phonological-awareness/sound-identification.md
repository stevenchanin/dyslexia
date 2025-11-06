# UX Spec: Module 1.1 – Sound Identification ("Sound Detective")

Goal
- Build phonemic awareness by identifying a target sound within a spoken word.
- Modes: beginning → ending → middle (medial vowel) sounds.
- Keep flow fast, encouraging, and mobile‑first.

Success Criteria
- Kid can complete 8–12 rounds in ~2–3 minutes.
- Accuracy and response time recorded per round.
- Clear, immediate feedback; minimal reading required.

Primary Flow
1) Prompt
- Screen shows: “Listen to the word.” Target chip: “Find the beginning sound.”
- Play button (large, thumb‑reachable). Optional replay.

2) Response
- Options grid (4–6 large tiles) with phoneme labels (e.g., /k/, /r/, /s/, /t/). Tiles are high‑contrast and large (≥44px hit area).
- Tap selects. While audio plays, tiles are disabled.

3) Feedback
- Correct: Tile turns green with a check; brief confetti pulse; points + streak tick up. “Next” button appears.
- Incorrect: Shake animation + red outline; gentle hint: “Listen again” + optional visual position strip ([■][□][□]) for the first sound; replay auto‑enabled.

4) Progression
- After X corrects at a mode, advance difficulty (e.g., add similar distractors; shift to ending or medial sounds). Keep per‑round target explicit.

Micro‑Interactions
- Large, bottom‑aligned Play/Replay. Disable options during playback.
- Streak and points in the header; subtle sounds/haptics on correct (respect reduced‑motion).
- “Low‑bandwidth” toggle hides animations and uses text‑to‑speech instead of audio files.

Accessibility
- Single‑purpose screen, minimal text. Optional “Show text” for caregiver view.
- High contrast, large tap targets, reduced motion support, screen reader labels on all controls.

Metrics
- accuracy (0/1), responseTimeMs, targetPosition (begin/end/middle), distractorChosen, retries.

Edge Cases
- No audio permission/blocked auto‑play: require tap to play; show helper text.
- Offline: use cached TTS or preloaded audio; allow retry queueing of results.

Difficulty Model (starter)
- Begin: 4 options, distinct consonants; progress to confusable phonemes (k/g, t/d, s/z).
- End: similar structure; watch final clusters.
- Middle: short vowels first (a/e/i/o/u), then contrast vowel teams later (handled in phonics module).

Copy Deck (examples)
- Title: “Sound Detective”
- Prompt: “Listen to the word.”
- Target chip: “Find the beginning sound” / “Find the ending sound” / “Find the middle sound”
- Correct: “Nice! That’s the first sound.”
- Incorrect: “Almost! Try again.” / “Listen again to the first sound.”

ASCII Wireframe (mobile)

┌──────────────────────────────────┐
│  ←  Sound Detective        ⭐ 12  │  Header: back, title, points
│  🔥 Streak 5        🕒 2:14      │  Subheader: streak/time (optional)
├──────────────────────────────────┤
│  [ Find the beginning sound ]    │  Target chip
│                                  │
│     ▶︎  Listen to the word       │  Play/Replay button (large)
│                                  │
│  Options:                        │
│   ┌───────┐ ┌───────┐ ┌───────┐  │  4–6 big tiles
│   │  /k/  │ │  /r/  │ │  /s/  │  │
│   └───────┘ └───────┘ └───────┘  │
│   ┌───────┐ ┌───────┐            │
│   │  /t/  │ │  /m/  │            │
│   └───────┘ └───────┘            │
│                                  │
│  Hint (on error): [■][□][□]       │  Position strip (beginning)
│                                  │
│            [ Next ]              │  Appears after correct
└──────────────────────────────────┘

Notes
- Keep per‑round target explicit; don’t rely on memory from prior round.
- Use color + icon + text for feedback (support CVD).
- Keep session short; return to hub with encouragement.

