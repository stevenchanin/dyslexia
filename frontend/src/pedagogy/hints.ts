import type { ErrorType, SkillDomain } from './errorTaxonomy';

export interface Hint {
  id: string;
  domain: SkillDomain;
  errorTypes: ErrorType[];
  stageId?: string;
  priority: number; // lower is earlier in the cueing ladder
  text: string; // keep short, kid-friendly; TTS-friendly
  tts?: boolean;
  visuals?: {
    highlightGrapheme?: string;
    showMouthShape?: boolean;
    slowAudio?: boolean;
    segmentBlend?: boolean;
  };
}

// Minimal vetted library; expand over time. Hints are selected by error type and cue priority.
export const HINTS: Hint[] = [
  {
    id: 'gpc-vowel-cue-1',
    domain: 'gpc',
    errorTypes: ['vowel-confusion'],
    priority: 1,
    text: "Listen for the short /a/ like in 'cat'.",
    visuals: { slowAudio: true, highlightGrapheme: 'a' },
    tts: true
  },
  {
    id: 'gpc-vowel-cue-2',
    domain: 'gpc',
    errorTypes: ['vowel-confusion'],
    priority: 2,
    text: 'Tap the vowel. Say its sound with me: /a/.',
    visuals: { segmentBlend: true, highlightGrapheme: 'a' },
    tts: true
  },
  {
    id: 'blending-omission-1',
    domain: 'blending',
    errorTypes: ['phoneme-omission', 'blend-omission'],
    priority: 1,
    text: 'Let’s say every sound. No skipping! /c/…/a/…/t/.',
    visuals: { segmentBlend: true },
    tts: true
  },
  {
    id: 'blending-model-3',
    domain: 'blending',
    errorTypes: ['phoneme-omission', 'phoneme-order', 'blend-omission'],
    priority: 3,
    text: "My turn first: c-a-t… 'cat'. Now your turn.",
    visuals: { segmentBlend: true, slowAudio: true },
    tts: true
  },
  {
    id: 'decoding-grapheme-contrast-2',
    domain: 'decoding',
    errorTypes: ['grapheme-mismatch', 'consonant-confusion'],
    priority: 2,
    text: "This letter makes /p/. You read /b/. Let’s try again.",
    visuals: { highlightGrapheme: 'p' },
    tts: true
  },
  {
    id: 'fluency-rate-fast-1',
    domain: 'fluency',
    errorTypes: ['rate-too-fast'],
    priority: 1,
    text: 'Slow and smooth. Touch each word as you read.',
    tts: true
  }
];

export function getHintsFor(domain: SkillDomain, type: ErrorType) {
  return HINTS.filter(h => h.domain === domain && h.errorTypes.includes(type))
    .sort((a, b) => a.priority - b.priority);
}

