import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardBody, Button, Stack, Heading, Text, Badge, Alert } from '../../../ui';
import { useExerciseUI } from '../store';
import { useRounds } from '../queries';
import { useSession, useAttemptLogger } from '../hooks';
import { SessionSummary } from './SessionSummary';
import type { SoundIdentificationRound, SoundMode } from '../../../types/exercises';

function targetLabel(mode: SoundMode) {
  if (mode === 'begin') return 'Find the beginning sound';
  if (mode === 'end') return 'Find the ending sound';
  return 'Find the middle sound';
}

function getTarget(round: SoundIdentificationRound) {
  if (round.mode === 'begin') return round.phonemes[0];
  if (round.mode === 'end') return round.phonemes[round.phonemes.length - 1];
  // middle
  return round.phonemes[1];
}

export function SoundIdentificationMock() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);

  // Use new hooks for session management
  const session = useSession('sound-identification', 2, 10);
  const attemptLogger = useAttemptLogger(session.sessionId);

  const ttsRate = useExerciseUI((s) => s.ttsRate);
  const lowBandwidth = useExerciseUI((s) => s.lowBandwidth);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Fetch rounds query
  const { data: roundsData, isLoading: roundsLoading } = useRounds(session.sessionId);

  // Check TTS support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setTtsSupported(true);
    }
  }, []);

  // Current round
  const rounds = roundsData?.rounds || [];
  const round = rounds[currentIndex];
  const target = useMemo(() => round ? getTarget(round) : '', [round]);

  // Start timing when new round loads
  useEffect(() => {
    if (round && !selected) {
      attemptLogger.startRound(round.id);
    }
  }, [round, selected, attemptLogger]);

  const speakWord = () => {
    if (!ttsSupported || lowBandwidth || !round) return;
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(round.word);
      u.lang = 'en-US';
      u.rate = Math.max(0.5, Math.min(2, ttsRate || 1));
      const voices = synth.getVoices();
      const en = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
      if (en) u.voice = en;
      u.onstart = () => setIsSpeaking(true);
      u.onend = () => setIsSpeaking(false);
      u.onerror = () => setIsSpeaking(false);
      synth.speak(u);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  const onChoose = (opt: string) => {
    if (selected || isSpeaking || !round) return;

    setSelected(opt);
    const isCorrect = opt === target;
    setCorrect(isCorrect);

    if (isCorrect) {
      setStreak((s) => s + 1);
      setPoints((p) => p + 5);
    } else {
      setStreak(0);
      attemptLogger.trackRetry();
    }

    // Submit attempt to API using attemptLogger
    attemptLogger.submitAttempt({
      roundId: round.id,
      selectedOption: opt,
      correctOption: target,
      isCorrect,
      mode: round.mode,
      responseTimeMs: 0, // Will be calculated by attemptLogger
    });
  };

  const next = () => {
    if (currentIndex < rounds.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setCorrect(null);
      session.roundComplete();
    } else {
      // Last round - complete the session
      session.roundComplete();
    }
  };

  const handleRestart = () => {
    session.reset();
    setCurrentIndex(0);
    setSelected(null);
    setCorrect(null);
    setStreak(0);
    setPoints(0);
  };

  // Loading state
  if (!session.isReady || roundsLoading || !round) {
    return (
      <Stack spacing={4}>
        <Heading as="h2" size="lg">Sound Detective</Heading>
        <Text>Loading exercise...</Text>
      </Stack>
    );
  }

  // Show summary when session is complete
  if (session.isComplete) {
    return (
      <SessionSummary
        summary={{
          sessionId: session.sessionId || '',
          totalRounds: session.roundsCompleted,
          correctRounds: Math.floor(session.roundsCompleted * (points / (session.roundsCompleted * 5))),
          accuracy: (points / (session.roundsCompleted * 5)) * 100,
          averageResponseTime: 2000, // Placeholder
          maxStreak: streak,
          pointsEarned: points,
          modeStats: [],
        }}
        elapsedTimeMs={session.getElapsedTime()}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <Stack spacing={4}>
      <Stack direction="row" justify="space-between" align="center">
        <Heading as="h2" size="lg">Sound Detective</Heading>
        <Stack direction="row" spacing={3} align="center">
          <Badge colorScheme="orange">Streak {streak}</Badge>
          <Badge colorScheme="purple">⭐ {points}</Badge>
        </Stack>
      </Stack>

      <Card>
        <CardBody>
          <Stack spacing={4}>
            <Stack direction="row" justify="space-between" align="center">
              <Badge colorScheme="blue" width="fit-content">{targetLabel(round.mode)}</Badge>
              <Text fontSize="sm" color="gray.600">Round {currentIndex + 1} of {rounds.length}</Text>
            </Stack>

            <Stack direction="row" align="center" spacing={3}>
              <Button
                leftIcon={<span>▶︎</span>}
                variant="outline"
                onClick={speakWord}
                isDisabled={!ttsSupported || lowBandwidth || isSpeaking}
              >
                Listen to the word
              </Button>
              <Text fontSize="sm" color="gray.600">(word: {round.word})</Text>
            </Stack>

            <Stack spacing={3}>
              <Text fontWeight="semibold">Choose the sound:</Text>
              <Stack direction="row" wrap="wrap" spacing={3}>
                {round.options.map((opt) => {
                  const isSelected = selected === opt;
                  const isCorrect = correct && opt === target;
                  const isWrong = isSelected && correct === false;
                  const color = isCorrect ? 'green' : isWrong ? 'red' : 'gray';
                  return (
                    <Button
                      key={opt}
                      onClick={() => onChoose(opt)}
                      variant={isSelected ? 'solid' : 'outline'}
                      colorScheme={color}
                      minW="72px"
                      minH="56px"
                      isDisabled={isSpeaking || !!selected}
                    >
                      /{opt}/
                    </Button>
                  );
                })}
              </Stack>
            </Stack>

            {correct === false && (
              <Alert status="warning" description="Almost! Listen again and find the right sound."></Alert>
            )}

            {correct && (
              <Alert status="success" description="Nice! That's the right sound."></Alert>
            )}

            <Stack direction="row" justify="flex-end">
              <Button onClick={next} isDisabled={!correct} colorScheme="blue">
                Next
              </Button>
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
}
