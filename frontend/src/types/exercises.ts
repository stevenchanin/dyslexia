// Core exercise types for Sound Identification and other phonological awareness exercises

export type SoundMode = 'begin' | 'end' | 'middle';

export type ExerciseType =
  | 'sound-identification'
  | 'letter-identification'
  | 'phoneme-count'
  | 'sound-manipulation'
  | 'rhyme-recognition';

export interface SoundIdentificationRound {
  id: string;
  word: string;
  phonemes: string[];
  mode: SoundMode;
  options: string[];
  difficulty: number;
  metadata?: {
    wordFrequency?: number;
    distractorStrategy?: 'random' | 'similar' | 'confusable';
  };
}

export interface LetterIdentificationRound {
  id: string;
  targetLetter: string; // The letter to find (e.g., 'A', 'b')
  letterName: string; // Name of the letter (e.g., 'uppercase A', 'lowercase b')
  letterSound: string; // Phonetic sound (e.g., /æ/, /b/)
  options: Array<{
    letter: string;
    word: string;
    emoji: string;
  }>; // Array of letter options with words and images
  case: 'uppercase' | 'lowercase' | 'mixed';
  difficulty: number;
  metadata?: {
    distractorStrategy?: 'random' | 'similar' | 'confusable';
  };
}

export interface Session {
  id: string;
  studentId: string;
  exerciseType: ExerciseType;
  startedAt: string;
  completedAt?: string;
  targetRounds: number;
  difficulty: number;
  status: 'in-progress' | 'completed' | 'paused';
}

export interface Attempt {
  id: string;
  sessionId: string;
  roundId: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  responseTimeMs: number;
  mode: SoundMode;
  retries: number;
  timestamp: string;
}

export interface SessionSummary {
  sessionId: string;
  totalRounds: number;
  correctRounds: number;
  accuracy: number;
  averageResponseTime: number;
  modeStats: {
    mode: SoundMode;
    attempted: number;
    correct: number;
    accuracy: number;
  }[];
  pointsEarned: number;
  maxStreak: number;
}

// API Request/Response types
export interface CreateSessionRequest {
  exerciseType: ExerciseType;
  difficulty: number;
  targetRounds?: number;
}

export interface CreateSessionResponse {
  session: Session;
}

export interface FetchRoundsResponse {
  rounds: SoundIdentificationRound[] | LetterIdentificationRound[];
  sessionId: string;
}

export interface SubmitAttemptRequest {
  roundId: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  responseTimeMs: number;
  mode: SoundMode;
  retries: number;
}

export interface SubmitAttemptResponse {
  attempt: Attempt;
  sessionSummary?: SessionSummary; // Included if session complete
}
