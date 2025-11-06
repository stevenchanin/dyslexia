import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardBody, Button, Stack, Heading, Text, Badge, Alert } from '../../../ui';
import { useExerciseUI } from '../store';

type Mode = 'begin' | 'end' | 'middle';

type Round = {
  word: string;
  phonemes: string[]; // e.g., ['k','æ','t']
  mode: Mode;
  options: string[]; // e.g., ['k','r','s','t']
};

const SAMPLE_ROUNDS: Round[] = [
  { word: 'cat', phonemes: ['k', 'æ', 't'], mode: 'begin', options: ['k', 'r', 's', 't'] },
  { word: 'mat', phonemes: ['m', 'æ', 't'], mode: 'end', options: ['p', 't', 's', 'm'] },
  { word: 'sit', phonemes: ['s', 'ɪ', 't'], mode: 'middle', options: ['æ', 'ɪ', 'i', 'u'] },
];

function getTarget(round: Round) {
  if (round.mode === 'begin') return round.phonemes[0];
  if (round.mode === 'end') return round.phonemes[round.phonemes.length - 1];
  // middle (simplified to 3 phoneme words for mock)
  return round.phonemes[1];
}

function targetLabel(mode: Mode) {
  if (mode === 'begin') return 'Find the beginning sound';
  if (mode === 'end') return 'Find the ending sound';
  return 'Find the middle sound';
}

export function SoundIdentificationMock() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(3);
  const [points, setPoints] = useState(120);
  const ttsRate = useExerciseUI((s) => s.ttsRate);
  const lowBandwidth = useExerciseUI((s) => s.lowBandwidth);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const round = SAMPLE_ROUNDS[index % SAMPLE_ROUNDS.length];
  const target = useMemo(() => getTarget(round), [round]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setTtsSupported(true);
    }
  }, []);

  const speakWord = () => {
    if (!ttsSupported || lowBandwidth) return;
    try {
      const synth = window.speechSynthesis;
      // Stop any ongoing speech
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
    if (selected || isSpeaking) return;
    setSelected(opt);
    const isCorrect = opt === target;
    setCorrect(isCorrect);
    if (isCorrect) {
      setStreak((s) => s + 1);
      setPoints((p) => p + 5);
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    setIndex((i) => i + 1);
    setSelected(null);
    setCorrect(null);
  };

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
            <Badge colorScheme="blue" width="fit-content">{targetLabel(round.mode)}</Badge>

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
                      isDisabled={isSpeaking}
                    >
                      /{opt}/
                    </Button>
                  );
                })}
              </Stack>
            </Stack>

            {correct === false && (
              <Alert status="warning" description="Almost! Listen again and find the first sound."></Alert>
            )}

            {correct && (
              <Alert status="success" description="Nice! That’s the right sound."></Alert>
            )}

            <Stack direction="row" justify="flex-end">
              <Button onClick={next} isDisabled={!correct} colorScheme="blue">Next</Button>
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
}
