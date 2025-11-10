import type { SoundIdentificationRound, SoundMode } from '../types/exercises';

// Word database with phoneme breakdowns
interface WordData {
  word: string;
  phonemes: string[];
  frequency: number; // 1=common, 2=moderate, 3=rare
}

const WORD_POOL: WordData[] = [
  // CVC words (easy)
  { word: 'cat', phonemes: ['k', 'æ', 't'], frequency: 1 },
  { word: 'dog', phonemes: ['d', 'ɔ', 'g'], frequency: 1 },
  { word: 'sun', phonemes: ['s', 'ʌ', 'n'], frequency: 1 },
  { word: 'mat', phonemes: ['m', 'æ', 't'], frequency: 1 },
  { word: 'sit', phonemes: ['s', 'ɪ', 't'], frequency: 1 },
  { word: 'run', phonemes: ['r', 'ʌ', 'n'], frequency: 1 },
  { word: 'big', phonemes: ['b', 'ɪ', 'g'], frequency: 1 },
  { word: 'hot', phonemes: ['h', 'ɔ', 't'], frequency: 1 },
  { word: 'red', phonemes: ['r', 'ɛ', 'd'], frequency: 1 },
  { word: 'pen', phonemes: ['p', 'ɛ', 'n'], frequency: 1 },
  { word: 'fox', phonemes: ['f', 'ɔ', 'k', 's'], frequency: 1 },
  { word: 'box', phonemes: ['b', 'ɔ', 'k', 's'], frequency: 1 },
  { word: 'pig', phonemes: ['p', 'ɪ', 'g'], frequency: 1 },
  { word: 'bug', phonemes: ['b', 'ʌ', 'g'], frequency: 1 },
  { word: 'hat', phonemes: ['h', 'æ', 't'], frequency: 1 },
  { word: 'bag', phonemes: ['b', 'æ', 'g'], frequency: 1 },
  { word: 'bed', phonemes: ['b', 'ɛ', 'd'], frequency: 1 },
  { word: 'cup', phonemes: ['k', 'ʌ', 'p'], frequency: 1 },
  { word: 'bus', phonemes: ['b', 'ʌ', 's'], frequency: 1 },
  { word: 'fit', phonemes: ['f', 'ɪ', 't'], frequency: 1 },

  // CVCC words (medium)
  { word: 'jump', phonemes: ['dʒ', 'ʌ', 'm', 'p'], frequency: 2 },
  { word: 'hand', phonemes: ['h', 'æ', 'n', 'd'], frequency: 1 },
  { word: 'sand', phonemes: ['s', 'æ', 'n', 'd'], frequency: 2 },
  { word: 'lamp', phonemes: ['l', 'æ', 'm', 'p'], frequency: 2 },
  { word: 'tent', phonemes: ['t', 'ɛ', 'n', 't'], frequency: 2 },
  { word: 'milk', phonemes: ['m', 'ɪ', 'l', 'k'], frequency: 1 },
  { word: 'fish', phonemes: ['f', 'ɪ', 'ʃ'], frequency: 1 },
  { word: 'duck', phonemes: ['d', 'ʌ', 'k'], frequency: 1 },
  { word: 'ring', phonemes: ['r', 'ɪ', 'ŋ'], frequency: 2 },
  { word: 'king', phonemes: ['k', 'ɪ', 'ŋ'], frequency: 2 },

  // CCVC words (medium)
  { word: 'stop', phonemes: ['s', 't', 'ɔ', 'p'], frequency: 1 },
  { word: 'frog', phonemes: ['f', 'r', 'ɔ', 'g'], frequency: 2 },
  { word: 'slip', phonemes: ['s', 'l', 'ɪ', 'p'], frequency: 2 },
  { word: 'trip', phonemes: ['t', 'r', 'ɪ', 'p'], frequency: 2 },
  { word: 'snap', phonemes: ['s', 'n', 'æ', 'p'], frequency: 2 },
  { word: 'drum', phonemes: ['d', 'r', 'ʌ', 'm'], frequency: 2 },
  { word: 'flag', phonemes: ['f', 'l', 'æ', 'g'], frequency: 2 },
  { word: 'plan', phonemes: ['p', 'l', 'æ', 'n'], frequency: 2 },

  // Longer words (hard)
  { word: 'plant', phonemes: ['p', 'l', 'æ', 'n', 't'], frequency: 2 },
  { word: 'print', phonemes: ['p', 'r', 'ɪ', 'n', 't'], frequency: 2 },
  { word: 'stamp', phonemes: ['s', 't', 'æ', 'm', 'p'], frequency: 2 },
  { word: 'bench', phonemes: ['b', 'ɛ', 'n', 'tʃ'], frequency: 2 },
  { word: 'lunch', phonemes: ['l', 'ʌ', 'n', 'tʃ'], frequency: 2 },
  { word: 'think', phonemes: ['θ', 'ɪ', 'ŋ', 'k'], frequency: 2 },
  { word: 'shrimp', phonemes: ['ʃ', 'r', 'ɪ', 'm', 'p'], frequency: 3 },
  { word: 'spring', phonemes: ['s', 'p', 'r', 'ɪ', 'ŋ'], frequency: 2 },
];

// Common phonemes for distractor generation
const CONSONANTS = ['b', 'd', 'f', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'z'];
const VOWELS = ['æ', 'ɛ', 'ɪ', 'ɔ', 'ʌ', 'i', 'u', 'ə'];
const CONFUSABLE_PAIRS: Record<string, string[]> = {
  'k': ['g', 't', 'p'],
  'g': ['k', 'd', 'b'],
  't': ['d', 'k', 'p'],
  'd': ['t', 'g', 'b'],
  'p': ['b', 't', 'k'],
  'b': ['p', 'd', 'g'],
  's': ['z', 'ʃ', 'θ'],
  'z': ['s', 'ʒ'],
  'f': ['v', 'θ'],
  'v': ['f', 'ð'],
  'm': ['n', 'ŋ'],
  'n': ['m', 'ŋ'],
  'æ': ['ɛ', 'ʌ'],
  'ɛ': ['æ', 'ɪ'],
  'ɪ': ['i', 'ɛ'],
  'ɔ': ['ɑ', 'ʌ'],
  'ʌ': ['ʊ', 'ɔ', 'æ'],
};

function getTargetPhoneme(word: WordData, mode: SoundMode): string {
  if (mode === 'begin') return word.phonemes[0];
  if (mode === 'end') return word.phonemes[word.phonemes.length - 1];
  // middle - for simplicity, get vowel (usually position 1 or 2)
  const vowelIndex = word.phonemes.findIndex(p => VOWELS.includes(p));
  return word.phonemes[vowelIndex !== -1 ? vowelIndex : 1];
}

function generateDistractors(
  target: string,
  difficulty: number,
  count: number
): string[] {
  const distractors: string[] = [];

  // Determine strategy based on difficulty
  const useConfusable = difficulty >= 5;
  const pool = VOWELS.includes(target) ? VOWELS : CONSONANTS;

  // Add confusable phonemes for higher difficulty
  if (useConfusable && CONFUSABLE_PAIRS[target]) {
    const confusables = CONFUSABLE_PAIRS[target].filter(p => p !== target);
    distractors.push(...confusables.slice(0, Math.min(2, count)));
  }

  // Fill remaining with random from pool
  const remaining = pool.filter(p => p !== target && !distractors.includes(p));
  const shuffled = remaining.sort(() => Math.random() - 0.5);
  distractors.push(...shuffled.slice(0, count - distractors.length));

  return distractors.slice(0, count);
}

function selectWords(difficulty: number, count: number, usedWords: Set<string>): WordData[] {
  // Filter by difficulty
  const maxPhonemes = difficulty <= 3 ? 3 : difficulty <= 6 ? 4 : 6;
  const minFrequency = difficulty <= 3 ? 1 : difficulty <= 6 ? 1 : 2;

  const available = WORD_POOL.filter(
    w => w.phonemes.length <= maxPhonemes &&
         w.frequency >= minFrequency &&
         !usedWords.has(w.word)
  );

  // Shuffle and take
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function determineModes(difficulty: number): SoundMode[] {
  // Early levels: focus on beginning sounds
  if (difficulty <= 3) return ['begin', 'begin', 'end'];
  // Medium: mix
  if (difficulty <= 6) return ['begin', 'end', 'middle'];
  // Hard: all modes
  return ['begin', 'end', 'middle', 'middle'];
}

export function generateRounds(
  difficulty: number,
  count: number,
  seed?: number
): SoundIdentificationRound[] {
  // Save original Math.random
  const originalRandom = Math.random;

  // Use seed for deterministic generation (useful for testing)
  if (seed !== undefined) {
    let s = seed;
    Math.random = () => {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  }

  const rounds: SoundIdentificationRound[] = [];
  const usedWords = new Set<string>();
  const modes = determineModes(difficulty);

  const words = selectWords(difficulty, count, usedWords);

  // Use seed for deterministic IDs, or timestamp for random IDs
  const idBase = seed !== undefined ? seed : Date.now();

  for (let i = 0; i < words.length && i < count; i++) {
    const word = words[i];
    const mode = modes[i % modes.length];
    const target = getTargetPhoneme(word, mode);

    // Determine number of options based on difficulty
    const optionCount = difficulty <= 3 ? 3 : difficulty <= 6 ? 4 : 5;
    const distractors = generateDistractors(target, difficulty, optionCount);

    // Combine target and distractors, shuffle
    const options = [target, ...distractors].sort(() => Math.random() - 0.5);

    rounds.push({
      id: `round-${idBase}-${i}`,
      word: word.word,
      phonemes: word.phonemes,
      mode,
      options,
      difficulty,
      metadata: {
        wordFrequency: word.frequency,
        distractorStrategy: difficulty >= 5 ? 'confusable' : 'random',
      },
    });

    usedWords.add(word.word);
  }

  // Restore original Math.random
  Math.random = originalRandom;

  return rounds;
}

// Helper to get a specific round set by session (for consistency)
export function getRoundsForSession(
  sessionId: string,
  difficulty: number,
  count: number
): SoundIdentificationRound[] {
  // Use session ID as seed for consistent rounds
  const seed = sessionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return generateRounds(difficulty, count, seed);
}
