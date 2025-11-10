import { describe, it, expect } from 'vitest';
import { generateRounds, getRoundsForSession } from './roundGenerator';

describe('roundGenerator', () => {
  describe('generateRounds', () => {
    it('should generate the requested number of rounds', () => {
      const rounds = generateRounds(2, 5);
      expect(rounds).toHaveLength(5);
    });

    it('should generate rounds with required properties', () => {
      const rounds = generateRounds(2, 3);

      rounds.forEach(round => {
        expect(round).toHaveProperty('id');
        expect(round).toHaveProperty('word');
        expect(round).toHaveProperty('phonemes');
        expect(round).toHaveProperty('mode');
        expect(round).toHaveProperty('options');
        expect(round).toHaveProperty('difficulty');
        expect(round).toHaveProperty('metadata');
      });
    });

    it('should include valid modes', () => {
      const rounds = generateRounds(2, 10);
      const validModes = ['begin', 'end', 'middle'];

      rounds.forEach(round => {
        expect(validModes).toContain(round.mode);
      });
    });

    it('should include the correct answer in options', () => {
      const rounds = generateRounds(2, 10);

      rounds.forEach(round => {
        const target = round.mode === 'begin'
          ? round.phonemes[0]
          : round.mode === 'end'
          ? round.phonemes[round.phonemes.length - 1]
          : round.phonemes[1];

        expect(round.options).toContain(target);
      });
    });

    it('should generate unique options (no duplicates)', () => {
      const rounds = generateRounds(5, 10);

      rounds.forEach(round => {
        const uniqueOptions = new Set(round.options);
        expect(uniqueOptions.size).toBe(round.options.length);
      });
    });

    it('should set correct difficulty on rounds', () => {
      const difficulty = 7;
      const rounds = generateRounds(difficulty, 5);

      rounds.forEach(round => {
        expect(round.difficulty).toBe(difficulty);
      });
    });

    it('should generate appropriate option counts based on difficulty', () => {
      // Low difficulty: 4 options (3 distractors + 1 target)
      const easyRounds = generateRounds(2, 5);
      easyRounds.forEach(round => {
        expect(round.options.length).toBe(4);
      });

      // Medium difficulty: 5 options
      const mediumRounds = generateRounds(5, 5);
      mediumRounds.forEach(round => {
        expect(round.options.length).toBe(5);
      });

      // High difficulty: 6 options
      const hardRounds = generateRounds(8, 5);
      hardRounds.forEach(round => {
        expect(round.options.length).toBe(6);
      });
    });

    it('should generate different rounds on subsequent calls', () => {
      const rounds1 = generateRounds(2, 5);
      const rounds2 = generateRounds(2, 5);

      // At least some words should be different
      const words1 = rounds1.map(r => r.word);
      const words2 = rounds2.map(r => r.word);
      const hasDifference = words1.some((word, i) => word !== words2[i]);

      expect(hasDifference).toBe(true);
    });

    it('should respect maximum phoneme count for difficulty level', () => {
      // Low difficulty: max 3 phonemes
      const easyRounds = generateRounds(2, 10);
      easyRounds.forEach(round => {
        expect(round.phonemes.length).toBeLessThanOrEqual(3);
      });

      // Medium difficulty: max 4 phonemes
      const mediumRounds = generateRounds(5, 10);
      mediumRounds.forEach(round => {
        expect(round.phonemes.length).toBeLessThanOrEqual(4);
      });

      // High difficulty: max 6 phonemes
      const hardRounds = generateRounds(8, 10);
      hardRounds.forEach(round => {
        expect(round.phonemes.length).toBeLessThanOrEqual(6);
      });
    });

    it('should set distractor strategy in metadata', () => {
      const easyRounds = generateRounds(3, 5);
      easyRounds.forEach(round => {
        expect(round.metadata?.distractorStrategy).toBe('random');
      });

      const hardRounds = generateRounds(6, 5);
      hardRounds.forEach(round => {
        expect(round.metadata?.distractorStrategy).toBe('confusable');
      });
    });

    it('should focus on "begin" mode for easy difficulty', () => {
      const rounds = generateRounds(2, 10);
      const beginCount = rounds.filter(r => r.mode === 'begin').length;

      // Should have more "begin" rounds for easy difficulty
      expect(beginCount).toBeGreaterThan(rounds.length / 3);
    });

    it('should mix modes for medium difficulty', () => {
      const rounds = generateRounds(5, 12);
      const modes = rounds.map(r => r.mode);

      // Should have all three modes represented
      expect(modes).toContain('begin');
      expect(modes).toContain('end');
      expect(modes).toContain('middle');
    });
  });

  describe('getRoundsForSession', () => {
    it('should generate consistent rounds for same session ID', () => {
      const sessionId = 'test-session-123';
      const rounds1 = getRoundsForSession(sessionId, 3, 5);
      const rounds2 = getRoundsForSession(sessionId, 3, 5);

      expect(rounds1.length).toBe(rounds2.length);

      rounds1.forEach((round, i) => {
        expect(round.word).toBe(rounds2[i].word);
        expect(round.mode).toBe(rounds2[i].mode);
        expect(round.phonemes).toEqual(rounds2[i].phonemes);
        expect(round.options).toEqual(rounds2[i].options);
      });
    });

    it('should generate different rounds for different session IDs', () => {
      const rounds1 = getRoundsForSession('session-1', 3, 5);
      const rounds2 = getRoundsForSession('session-2', 3, 5);

      const words1 = rounds1.map(r => r.word);
      const words2 = rounds2.map(r => r.word);

      // At least some words should be different
      const hasDifference = words1.some((word, i) => word !== words2[i]);
      expect(hasDifference).toBe(true);
    });

    it('should respect difficulty parameter', () => {
      const sessionId = 'test-session';
      const difficulty = 5;
      const rounds = getRoundsForSession(sessionId, difficulty, 5);

      rounds.forEach(round => {
        expect(round.difficulty).toBe(difficulty);
      });
    });

    it('should respect count parameter', () => {
      const sessionId = 'test-session';
      const count = 8;
      const rounds = getRoundsForSession(sessionId, 3, count);

      expect(rounds).toHaveLength(count);
    });

    it('should generate valid rounds structure', () => {
      const rounds = getRoundsForSession('test-session', 3, 5);

      rounds.forEach(round => {
        expect(typeof round.id).toBe('string');
        expect(typeof round.word).toBe('string');
        expect(Array.isArray(round.phonemes)).toBe(true);
        expect(Array.isArray(round.options)).toBe(true);
        expect(round.phonemes.length).toBeGreaterThan(0);
        expect(round.options.length).toBeGreaterThan(0);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle requesting more rounds than available words', () => {
      // Should still generate up to the limit of available words
      const rounds = generateRounds(2, 100);

      expect(rounds.length).toBeGreaterThan(0);
      expect(rounds.length).toBeLessThanOrEqual(100);
    });

    it('should handle minimum difficulty level', () => {
      const rounds = generateRounds(1, 5);

      expect(rounds).toHaveLength(5);
      rounds.forEach(round => {
        expect(round.difficulty).toBe(1);
      });
    });

    it('should handle maximum difficulty level', () => {
      const rounds = generateRounds(10, 5);

      expect(rounds).toHaveLength(5);
      rounds.forEach(round => {
        expect(round.difficulty).toBe(10);
      });
    });

    it('should handle single round request', () => {
      const rounds = generateRounds(3, 1);

      expect(rounds).toHaveLength(1);
      expect(rounds[0]).toHaveProperty('word');
      expect(rounds[0]).toHaveProperty('options');
    });
  });
});
