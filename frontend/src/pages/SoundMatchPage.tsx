import React, { useState, useEffect } from 'react';
import { VStack, Heading, Text, HStack, SimpleGrid, Box } from '@chakra-ui/react';
import { Container, BackButton, OptionCard, SpeakerButton, Button } from '../ui';
import { useSession, useAttemptLogger } from '../features/exercises/hooks';
import { useRounds } from '../features/exercises/queries';
import type { SoundIdentificationRound } from '../types/exercises';

// Mock data for demonstration
const mockOptions = [
  { emoji: '🍎', sound: '/æ/', word: 'apple' },
  { emoji: '🥚', sound: '/ɛ/', word: 'egg' },
  { emoji: '🍦', sound: '/ɪ/', word: 'ice cream' },
  { emoji: '☂️', sound: '/ʌ/', word: 'umbrella' },
];

function getTarget(round: SoundIdentificationRound) {
  if (round.mode === 'begin') return round.phonemes[0];
  if (round.mode === 'end') return round.phonemes[round.phonemes.length - 1];
  return round.phonemes[1]; // middle
}

export function SoundMatchPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);

  const session = useSession('sound-identification', 2, 10);
  const attemptLogger = useAttemptLogger(session.sessionId);
  const { data: roundsData, isLoading: roundsLoading, error: roundsError } = useRounds(session.sessionId);

  const rounds = (roundsData?.rounds || []) as SoundIdentificationRound[];
  const round = rounds[currentIndex];
  const target = round ? getTarget(round) : '';

  // Reset session if rounds query fails
  useEffect(() => {
    if (roundsError && session.sessionId) {
      console.warn('Failed to load rounds, resetting session:', roundsError);
      session.reset();
    }
  }, [roundsError, session]);

  useEffect(() => {
    if (round && !selected) {
      attemptLogger.startRound(round.id);
    }
  }, [round, selected, attemptLogger]);

  const handleOptionClick = (option: typeof mockOptions[0]) => {
    if (correct === true || !round) return;

    setSelected(option.sound);
    const isCorrect = option.sound === target;
    setCorrect(isCorrect);

    attemptLogger.submitAttempt({
      roundId: round.id,
      selectedOption: option.sound,
      correctOption: target,
      isCorrect,
      mode: round.mode,
      responseTimeMs: 0,
    });

    if (isCorrect) {
      // Auto-advance after 1.5 seconds
      setTimeout(() => {
        if (currentIndex < rounds.length - 1) {
          setCurrentIndex((i) => i + 1);
          setSelected(null);
          setCorrect(null);
          session.roundComplete();
        } else {
          session.roundComplete();
        }
      }, 1500);
    }
  };

  const handleSpeakerClick = (word: string) => {
    // TTS functionality
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const handleMainSpeakerClick = () => {
    if (round?.word) {
      handleSpeakerClick(round.word);
    }
  };

  // Loading state with reset option
  if (!session.isReady || roundsLoading || !round) {
    return (
      <Container>
        <VStack spacing={8} py={4}>
          <Text fontSize="5xl">🎵</Text>
          <Heading as="h2" size="lg">Sound Match</Heading>
          <Text>Loading exercise...</Text>
          <Text fontSize="sm" color="gray.600" mt={2}>
            If this takes too long, try{' '}
            <Button
              variant="link"
              colorScheme="blue"
              onClick={() => {
                session.reset();
                window.location.reload();
              }}
              size="sm"
            >
              resetting the session
            </Button>
          </Text>
        </VStack>
      </Container>
    );
  }

  // For demo purposes, map the round data to mock options
  // In a real implementation, you'd generate options based on the round data
  const currentLetter = round.word.charAt(0).toUpperCase();

  return (
    <Container>
      <VStack spacing={8} align="stretch" py={4}>
        {/* Back button */}
        <BackButton to="/reading-room">Back to Reading Room</BackButton>

        {/* Header */}
        <VStack spacing={2} align="center" py={4}>
          <Text fontSize="5xl">🎵</Text>
          <Heading as="h1" size="xl" textAlign="center">
            Sound Match
          </Heading>
          <HStack spacing={2}>
            <Text fontSize="lg" color="gray.600" textAlign="center">
              Tap the sound that matches the letter
            </Text>
            <SpeakerButton onClick={handleMainSpeakerClick} size="sm" />
          </HStack>
        </VStack>

        {/* Letter display card */}
        <Box
          bg="room.reading"
          borderRadius="2xl"
          p={{ base: 10, md: 12 }}
          w="full"
          maxW="800px"
          mx="auto"
          boxShadow="lg"
        >
          <VStack spacing={6}>
            <Text fontSize={{ base: '8xl', md: '9xl' }} fontWeight="bold" color="white">
              {currentLetter}
            </Text>
            <Heading size="lg" color="white">
              What sound?
            </Heading>
          </VStack>
        </Box>

        {/* Answer options in 2x2 grid */}
        <SimpleGrid columns={2} spacing={4} w="full" maxW="800px" mx="auto">
          {mockOptions.map((option) => {
            const isSelected = selected === option.sound;
            const isCorrectAnswer = correct === true && option.sound === target;
            const isWrongAnswer = isSelected && correct === false;

            return (
              <OptionCard
                key={option.sound}
                content={option.emoji}
                onClick={() => handleOptionClick(option)}
                onSpeakerClick={() => handleSpeakerClick(option.word)}
                isSelected={isSelected}
                isCorrect={isCorrectAnswer ? true : undefined}
                isWrong={isWrongAnswer ? true : undefined}
                isDisabled={correct === true}
              />
            );
          })}
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
