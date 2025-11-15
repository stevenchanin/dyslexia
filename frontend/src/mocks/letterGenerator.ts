import type { LetterIdentificationRound } from '../types/exercises';

// Letter data with phonetic sounds and word associations
interface LetterData {
  letter: string;
  uppercase: string;
  lowercase: string;
  commonSound: string; // Most common phonetic sound
  name: string; // Letter name spoken
  word: string; // Example word starting with this letter
  emoji: string; // Visual representation of the word
}

const ALPHABET: LetterData[] = [
  { letter: 'A', uppercase: 'A', lowercase: 'a', commonSound: '/æ/', name: 'A', word: 'Apple', emoji: '🍎' },
  { letter: 'B', uppercase: 'B', lowercase: 'b', commonSound: '/b/', name: 'B', word: 'Ball', emoji: '⚽' },
  { letter: 'C', uppercase: 'C', lowercase: 'c', commonSound: '/k/', name: 'C', word: 'Cat', emoji: '🐱' },
  { letter: 'D', uppercase: 'D', lowercase: 'd', commonSound: '/d/', name: 'D', word: 'Dog', emoji: '🐕' },
  { letter: 'E', uppercase: 'E', lowercase: 'e', commonSound: '/ɛ/', name: 'E', word: 'Egg', emoji: '🥚' },
  { letter: 'F', uppercase: 'F', lowercase: 'f', commonSound: '/f/', name: 'F', word: 'Fish', emoji: '🐟' },
  { letter: 'G', uppercase: 'G', lowercase: 'g', commonSound: '/g/', name: 'G', word: 'Grapes', emoji: '🍇' },
  { letter: 'H', uppercase: 'H', lowercase: 'h', commonSound: '/h/', name: 'H', word: 'House', emoji: '🏠' },
  { letter: 'I', uppercase: 'I', lowercase: 'i', commonSound: '/ɪ/', name: 'I', word: 'Ice cream', emoji: '🍦' },
  { letter: 'J', uppercase: 'J', lowercase: 'j', commonSound: '/dʒ/', name: 'J', word: 'Juice', emoji: '🧃' },
  { letter: 'K', uppercase: 'K', lowercase: 'k', commonSound: '/k/', name: 'K', word: 'Kite', emoji: '🪁' },
  { letter: 'L', uppercase: 'L', lowercase: 'l', commonSound: '/l/', name: 'L', word: 'Lion', emoji: '🦁' },
  { letter: 'M', uppercase: 'M', lowercase: 'm', commonSound: '/m/', name: 'M', word: 'Moon', emoji: '🌙' },
  { letter: 'N', uppercase: 'N', lowercase: 'n', commonSound: '/n/', name: 'N', word: 'Nose', emoji: '👃' },
  { letter: 'O', uppercase: 'O', lowercase: 'o', commonSound: '/ɔ/', name: 'O', word: 'Orange', emoji: '🍊' },
  { letter: 'P', uppercase: 'P', lowercase: 'p', commonSound: '/p/', name: 'P', word: 'Pizza', emoji: '🍕' },
  { letter: 'Q', uppercase: 'Q', lowercase: 'q', commonSound: '/kw/', name: 'Q', word: 'Queen', emoji: '👑' },
  { letter: 'R', uppercase: 'R', lowercase: 'r', commonSound: '/r/', name: 'R', word: 'Robot', emoji: '🤖' },
  { letter: 'S', uppercase: 'S', lowercase: 's', commonSound: '/s/', name: 'S', word: 'Sun', emoji: '☀️' },
  { letter: 'T', uppercase: 'T', lowercase: 't', commonSound: '/t/', name: 'T', word: 'Tree', emoji: '🌲' },
  { letter: 'U', uppercase: 'U', lowercase: 'u', commonSound: '/ʌ/', name: 'U', word: 'Umbrella', emoji: '☂️' },
  { letter: 'V', uppercase: 'V', lowercase: 'v', commonSound: '/v/', name: 'V', word: 'Violin', emoji: '🎻' },
  { letter: 'W', uppercase: 'W', lowercase: 'w', commonSound: '/w/', name: 'W', word: 'Watermelon', emoji: '🍉' },
  { letter: 'X', uppercase: 'X', lowercase: 'x', commonSound: '/ks/', name: 'X', word: 'Xylophone', emoji: '🎹' },
  { letter: 'Y', uppercase: 'Y', lowercase: 'y', commonSound: '/j/', name: 'Y', word: 'Yarn', emoji: '🧶' },
  { letter: 'Z', uppercase: 'Z', lowercase: 'z', commonSound: '/z/', name: 'Z', word: 'Zebra', emoji: '🦓' },
];

// Visually similar letters (confusable pairs)
const CONFUSABLE_LETTERS: Record<string, string[]> = {
  // Uppercase confusables
  'B': ['D', 'P', 'R'],
  'D': ['B', 'O', 'P'],
  'E': ['F'],
  'F': ['E', 'T'],
  'M': ['N', 'W'],
  'N': ['M', 'H'],
  'O': ['Q', 'C', 'D'],
  'P': ['B', 'R', 'D'],
  'Q': ['O', 'G'],
  'U': ['V'],
  'V': ['U', 'Y'],
  'W': ['M', 'V'],
  // Lowercase confusables
  'b': ['d', 'p', 'q'],
  'd': ['b', 'p', 'q'],
  'p': ['b', 'd', 'q'],
  'q': ['b', 'd', 'p'],
  'n': ['m', 'h', 'u'],
  'm': ['n', 'w'],
  'u': ['n', 'v'],
  'v': ['u', 'w'],
  'w': ['m', 'v'],
};

function selectLetters(
  difficulty: number,
  count: number,
  usedLetters: Set<string>
): LetterData[] {
  // Early levels: focus on frequently used, distinct letters
  const easyLetters = ['A', 'B', 'C', 'D', 'M', 'S', 'T'];
  const mediumLetters = ['E', 'F', 'G', 'H', 'I', 'L', 'N', 'O', 'P', 'R'];
  const hardLetters = ['J', 'K', 'Q', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  let pool: string[];
  if (difficulty <= 3) {
    pool = easyLetters;
  } else if (difficulty <= 6) {
    pool = [...easyLetters, ...mediumLetters];
  } else {
    pool = ALPHABET.map(l => l.letter);
  }

  const available = ALPHABET.filter(
    l => pool.includes(l.letter) && !usedLetters.has(l.letter)
  );

  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateDistractors(
  targetLetter: LetterData,
  letterCase: 'uppercase' | 'lowercase' | 'mixed',
  difficulty: number,
  count: number
): LetterData[] {
  const distractorLetters: string[] = [];
  const useConfusable = difficulty >= 5;
  const target = letterCase === 'uppercase' ? targetLetter.uppercase : targetLetter.lowercase;

  // Add confusable letters for higher difficulty
  if (useConfusable && CONFUSABLE_LETTERS[target]) {
    const confusables = CONFUSABLE_LETTERS[target]
      .filter(l => l !== target)
      .slice(0, Math.min(2, count));
    distractorLetters.push(...confusables);
  }

  // Fill remaining with random letters
  const allLetters = letterCase === 'uppercase'
    ? ALPHABET.map(l => l.uppercase)
    : ALPHABET.map(l => l.lowercase);

  const remaining = allLetters.filter(l => l !== target && !distractorLetters.includes(l));
  const shuffled = remaining.sort(() => Math.random() - 0.5);
  distractorLetters.push(...shuffled.slice(0, count - distractorLetters.length));

  // Convert letter strings back to LetterData objects
  return distractorLetters.slice(0, count).map(letter => {
    const baseLetterUpper = letter.toUpperCase();
    return ALPHABET.find(l => l.letter === baseLetterUpper)!;
  });
}

function determineCase(difficulty: number): ('uppercase' | 'lowercase' | 'mixed')[] {
  // Early levels: uppercase only (easier to recognize)
  if (difficulty <= 2) return ['uppercase', 'uppercase', 'uppercase'];
  // Medium: mix of uppercase and lowercase
  if (difficulty <= 5) return ['uppercase', 'lowercase', 'uppercase'];
  // Hard: all cases including mixed
  return ['uppercase', 'lowercase', 'mixed'];
}

export function generateLetterRounds(
  difficulty: number,
  count: number,
  seed?: number
): LetterIdentificationRound[] {
  // Save original Math.random
  const originalRandom = Math.random;

  // Use seed for deterministic generation
  if (seed !== undefined) {
    let s = seed;
    Math.random = () => {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  }

  const rounds: LetterIdentificationRound[] = [];
  const usedLetters = new Set<string>();
  const cases = determineCase(difficulty);

  const letters = selectLetters(difficulty, count, usedLetters);
  const idBase = seed !== undefined ? seed : Date.now();

  for (let i = 0; i < letters.length && i < count; i++) {
    const letterData = letters[i];
    const letterCase = cases[i % cases.length];

    const targetLetter = letterCase === 'uppercase'
      ? letterData.uppercase
      : letterData.lowercase;

    // Determine number of options based on difficulty
    const optionCount = difficulty <= 3 ? 3 : difficulty <= 6 ? 4 : 5;
    const distractorData = generateDistractors(letterData, letterCase, difficulty, optionCount);

    // Combine target and distractors with full data (letter, word, emoji)
    const allOptions = [letterData, ...distractorData];

    // Create options array with word and emoji data
    const options = allOptions.map(ld => ({
      letter: letterCase === 'uppercase' ? ld.uppercase : ld.lowercase,
      word: ld.word,
      emoji: ld.emoji,
    })).sort(() => Math.random() - 0.5);

    const letterName = letterCase === 'uppercase'
      ? `uppercase ${letterData.name}`
      : `lowercase ${letterData.name}`;

    rounds.push({
      id: `round-${idBase}-${i}`,
      targetLetter,
      letterName,
      letterSound: letterData.commonSound,
      options,
      case: letterCase,
      difficulty,
      metadata: {
        distractorStrategy: difficulty >= 5 ? 'confusable' : 'random',
      },
    });

    usedLetters.add(letterData.letter);
  }

  // Restore original Math.random
  Math.random = originalRandom;

  return rounds;
}

// Helper to get a specific round set by session (for consistency)
export function getLetterRoundsForSession(
  sessionId: string,
  difficulty: number,
  count: number
): LetterIdentificationRound[] {
  // Use session ID as seed for consistent rounds
  const seed = sessionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return generateLetterRounds(difficulty, count, seed);
}
