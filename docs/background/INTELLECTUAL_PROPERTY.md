# Intellectual Property Guide – Research‑Based Exercises

This project implements exercises and features informed by published research. This guide summarizes what’s typically safe to use, what to avoid, and practical guardrails so we can ship confidently.

## Short Answer
You can build exercises based on research. Facts, methods, ideas, and metrics are not protected by copyright. The risk comes from copying specific expression or using proprietary assets, not from implementing evidence‑based approaches.

## What’s Generally OK
- Ideas and findings: Research conclusions, methods (e.g., phoneme segmentation, blending), sequences, best practices.
- Functional behavior: Implementing exercise mechanics (sound ID, blending, decodables, timed oral reading) when we author our own content and UI.
- Metrics and formulas: WCPM and similar computations.
- Method naming: Describing alignment with “Structured Literacy”/“Orton‑Gillingham” is fine; avoid implying certification/endorsement unless we have it.

## What to Avoid or Check First
- Copying expression: Don’t lift text, passages, question banks, images, audio, diagrams, or code from papers, curricula, or commercial apps.
- Proprietary lists/content: Some word lists are open; others are compiled and copyrighted. Verify licensing before bundling.
- Trademarks: Don’t use others’ marks in names/branding. Comparative references in docs are OK.
- Patents: While teaching methods aren’t copyrightable, some software/method patents exist (e.g., specific STT scoring workflows or adaptive algorithms). Risk is low for generic patterns, but do a narrow patent screen before shipping “automatic WCPM via STT” or novel adaptation strategies.
- Research PDFs/figures: Don’t redistribute publisher PDFs or figures unless the license allows it. Link instead or use open‑licensed versions.

## Practical Guardrails
- Original content: Write our own decodable texts, sentences, prompts; create or license graphics and audio (or use licensed TTS).
- OSS compliance: Use permissively licensed OSS; include NOTICES where required.
- Attribution: When summarizing research, cite and link rather than reproducing long excerpts.
- Trademarks and claims: Use phrasing like “informed by Structured Literacy/Orton‑Gillingham methods.” Don’t imply certification unless true.
- Privacy/licensing for audio: Ensure we have consent for any recordings; set clear retention/deletion policies.

## Recommendation
Proceed. Implement research‑backed exercises and features while ensuring all wording, passages, audio, and visuals are original or properly licensed.

## Optional Pre‑Release IP Checklist
- Content provenance documented (texts, images, audio are original or licensed);
- OSS licenses reviewed; any required NOTICES included;
- Trademark usage reviewed (no misuse in product names or marketing);
- Targeted patent screen for: “speech recognition reading assessment WCPM”, “adaptive phonological awareness training system”, “computer‑implemented reading fluency assessment”;
- Research references linked (not redistributed) unless open‑licensed.
