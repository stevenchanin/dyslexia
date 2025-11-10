import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardBody, Button, Stack, Heading, Text, Badge, Alert } from '../../../ui';
import { useExerciseUI } from '../store';
import { useCreateSession, useRounds, useSubmitAttempt } from '../queries';
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [retries, setRetries] = useState(0);

  const ttsRate = useExerciseUI((s) => s.ttsRate);
  const lowBandwidth = useExerciseUI((s) => s.lowBandwidth);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Create session mutation
  const createSessionMutation = useCreateSession();

  // Fetch rounds query
  const { data: roundsData, isLoading: roundsLoading } = useRounds(sessionId);

  // Submit attempt mutation
  const submitMutation = useSubmitAttempt(sessionId || '');

  // Initialize session on mount
  useEffect(() => {
    if (!sessionId && !createSessionMutation.isPending) {
      createSessionMutation.mutate({
        exerciseType: 'sound-identification',
        difficulty: 2,
        targetRounds: 10,
      }, {
        onSuccess: (data) => {
          setSessionId(data.session.id);
        },
      });
    }
  }, [sessionId, createSessionMutation]);

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

  // Start timer when new round loads
  useEffect(() => {
    if (round && !selected) {
      setStartTime(Date.now());
    }
  }, [round, selected]);

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
      setRetries((r) => r + 1);
    }

    // Calculate response time
    const responseTimeMs = Date.now() - startTime;

    // Submit attempt to API
    submitMutation.mutate({
      roundId: round.id,
      selectedOption: opt,
      correctOption: target,
      isCorrect,
      responseTimeMs,
      mode: round.mode,
      retries,
    });
  };

  const next = () => {
    if (currentIndex < rounds.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setCorrect(null);
      setRetries(0);
    } else {
      // Session complete - could show summary here
      console.log('Session complete!');
    }
  };

  // Loading state
  if (!sessionId || roundsLoading || !round) {
    return (
      <Stack spacing={4}>
        <Heading as="h2" size="lg">Sound Detective</Heading>
        <Text>Loading exercise...</Text>
      </Stack>
    );
  }

  // Check if session is complete
  const isSessionComplete = currentIndex >= rounds.length - 1 && correct === true;

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
                aria-label="Play word audio"
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

            {correct && !isSessionComplete && (
              <Alert status="success" description="Nice! That's the right sound."></Alert>
            )}

            {isSessionComplete && (
              <Alert status="success" description="🎉 Great job! You completed the session!"></Alert>
            )}

            <Stack direction="row" justify="flex-end">
              <Button onClick={next} isDisabled={!correct} colorScheme="blue">
                {isSessionComplete ? 'Finish' : 'Next'}
              </Button>
            </Stack>
          </Stack>
        </CardBody>
      </Card>

      {submitMutation.data?.sessionSummary && (
        <Card>
          <CardBody>
            <Stack spacing={3}>
              <Heading as="h3" size="md">Session Summary</Heading>
              <Text>Accuracy: {submitMutation.data.sessionSummary.accuracy.toFixed(1)}%</Text>
              <Text>Max Streak: {submitMutation.data.sessionSummary.maxStreak}</Text>
              <Text>Points Earned: {submitMutation.data.sessionSummary.pointsEarned}</Text>
            </Stack>
          </CardBody>
        </Card>
      )}
    </Stack>
  );
}
