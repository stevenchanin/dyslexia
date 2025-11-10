export type SkillDomain =
  | 'phoneme-awareness'
  | 'gpc' // grapheme-phoneme correspondence
  | 'blending'
  | 'decoding'
  | 'fluency';

export type ErrorType =
  | 'sound-position-wrong' // selected wrong initial/medial/final phoneme
  | 'phoneme-omission' // skipped a sound in blending/segmenting
  | 'phoneme-order' // swapped order during blending
  | 'vowel-confusion' // short/long or specific vowel confusion
  | 'consonant-confusion' // similar consonants (b/d, p/b, etc.)
  | 'blend-omission' // omitted part of a blend or digraph
  | 'grapheme-mismatch' // selected letter(s) not matching target phoneme
  | 'irregular-word-memorization' // guessed irregular word during decodable stage
  | 'rate-too-fast' // sacrificing accuracy for speed
  | 'rate-too-slow';

export interface ErrorObservation {
  domain: SkillDomain;
  type: ErrorType;
  stageId?: string; // tie to phonics stage when relevant
  target?: string; // target phoneme/grapheme/word
  attemptText?: string;
  metadata?: Record<string, any>;
}

export const ErrorDomainToTypes: Record<SkillDomain, ErrorType[]> = {
  'phoneme-awareness': [
    'sound-position-wrong',
    'phoneme-omission',
    'phoneme-order'
  ],
  gpc: ['grapheme-mismatch', 'vowel-confusion', 'consonant-confusion'],
  blending: ['phoneme-omission', 'phoneme-order', 'blend-omission'],
  decoding: [
    'grapheme-mismatch',
    'vowel-confusion',
    'consonant-confusion',
    'blend-omission',
    'irregular-word-memorization'
  ],
  fluency: ['rate-too-fast', 'rate-too-slow']
};

