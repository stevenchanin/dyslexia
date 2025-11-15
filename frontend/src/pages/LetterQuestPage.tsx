import React, { useState, useEffect } from 'react';
import { VStack, Heading, Text, HStack, SimpleGrid, Box } from '@chakra-ui/react';
import { Container, BackButton, Button } from '../ui';
import { useSession, useAttemptLogger } from '../features/exercises/hooks';
import { useRounds } from '../features/exercises/queries';
import type { LetterIdentificationRound } from '../types/exercises';

// Letter Card Component
interface LetterCardProps {
  emoji: string;
  word: string;
  onClick: () => void;
  onSpeakerClick: () => void;
  isSelected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  isDisabled?: boolean;
}

function LetterCard({
  emoji,
  word,
  onClick,
  onSpeakerClick,
  isSelected,
  isCorrect,
  isWrong,
  isDisabled,
}: LetterCardProps) {
  // Determine background color based on state
  let bgColor = 'white';
  let borderColor = 'gray.200';
  let borderWidth = '2px';

  if (isCorrect) {
    bgColor = 'green.100';
    borderColor = 'green.500';
    borderWidth = '4px';
  } else if (isWrong) {
    bgColor = 'red.100';
    borderColor = 'red.500';
    borderWidth = '4px';
  } else if (isSelected) {
    bgColor = 'blue.50';
    borderColor = 'blue.400';
    borderWidth = '3px';
  }

  return (
    <Box
      bg={bgColor}
      borderRadius="2xl"
      border={borderWidth}
      borderColor={borderColor}
      p={6}
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      onClick={isDisabled ? undefined : onClick}
      opacity={isDisabled ? 0.6 : 1}
      transition="all 0.2s"
      _hover={isDisabled ? {} : { transform: 'scale(1.05)', boxShadow: 'lg' }}
      _active={isDisabled ? {} : { transform: 'scale(0.98)' }}
      position="relative"
      minH="160px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
    >
      {/* Speaker button in top right */}
      <Box
        position="absolute"
        top="8px"
        right="8px"
        fontSize="24px"
        cursor="pointer"
        onClick={(e) => {
          e.stopPropagation();
          onSpeakerClick();
        }}
        _hover={{ transform: 'scale(1.1)' }}
      >
        🔊
      </Box>

      {/* Large emoji/image */}
      <Text fontSize={{ base: '6xl', md: '8xl' }}>
        {emoji}
      </Text>

      {/* Feedback icon */}
      {isCorrect && (
        <Box position="absolute" top="8px" left="8px" fontSize="32px">
          ✅
        </Box>
      )}
      {isWrong && (
        <Box position="absolute" top="8px" left="8px" fontSize="32px">
          ❌
        </Box>
      )}
    </Box>
  );
}

export function LetterQuestPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const session = useSession('letter-identification', 2, 10);
  const attemptLogger = useAttemptLogger(session.sessionId);
  const { data: roundsData, isLoading: roundsLoading, error: roundsError } = useRounds(session.sessionId);

  const rounds = (roundsData?.rounds || []) as LetterIdentificationRound[];
  const round = rounds[currentIndex];

  // Reset session if rounds query fails
  useEffect(() => {
    if (roundsError && session.sessionId) {
      console.warn('Failed to load rounds, resetting session:', roundsError);
      session.reset();
    }
  }, [roundsError, session]);

  // Start timer when round begins
  useEffect(() => {
    if (round && !selected) {
      setStartTime(Date.now());
      attemptLogger.startRound(round.id);
    }
  }, [round, selected, attemptLogger]);

  const handleLetterClick = (letter: string) => {
    if (correct === true || !round) return;

    setSelected(letter);
    const isCorrect = letter === round.targetLetter;
    setCorrect(isCorrect);

    const responseTime = Date.now() - startTime;

    attemptLogger.submitAttempt({
      roundId: round.id,
      selectedOption: letter,
      correctOption: round.targetLetter,
      isCorrect,
      mode: 'begin', // Letter identification doesn't use modes like sound-identification
      responseTimeMs: responseTime,
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

  const handleSpeakerClick = (text: string) => {
    // TTS functionality
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8; // Slightly slower for learning
      speechSynthesis.speak(utterance);
    }
  };

  const handleMainSpeakerClick = () => {
    if (round) {
      // Say the letter name (e.g., "Find uppercase A")
      handleSpeakerClick(`Find ${round.letterName}`);
    }
  };

  // Loading state
  if (!session.isReady || roundsLoading || !round) {
    return (
      <Container>
        <VStack spacing={8} py={4}>
          <Text fontSize="5xl">🔤</Text>
          <Heading as="h2" size="lg">Letter Quest</Heading>
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

  return (
    <Container>
      <VStack spacing={8} align="stretch" py={4}>
        {/* Back button */}
        <BackButton to="/reading-room">Back to Reading Room</BackButton>

        {/* Header */}
        <VStack spacing={2} align="center" py={4}>
          <Text fontSize="5xl">🔤</Text>
          <Heading as="h1" size="xl" textAlign="center">
            Letter Quest
          </Heading>
          <HStack spacing={2}>
            <Text fontSize="lg" color="gray.600" textAlign="center">
              Find {round.letterName}
            </Text>
            <Box
              fontSize="28px"
              cursor="pointer"
              onClick={handleMainSpeakerClick}
              _hover={{ transform: 'scale(1.1)' }}
            >
              🔊
            </Box>
          </HStack>
        </VStack>

        {/* Target letter display card */}
        <Box
          bg="purple.500"
          borderRadius="2xl"
          p={{ base: 10, md: 12 }}
          w="full"
          maxW="800px"
          mx="auto"
          boxShadow="lg"
        >
          <VStack spacing={6}>
            <Text fontSize={{ base: '9xl', md: '10xl' }} fontWeight="bold" color="white">
              {round.targetLetter}
            </Text>
            <Heading size="lg" color="white">
              Find this letter!
            </Heading>
          </VStack>
        </Box>

        {/* Progress indicator */}
        <HStack justify="center" spacing={2}>
          <Text fontSize="sm" color="gray.600">
            Question {currentIndex + 1} of {rounds.length}
          </Text>
        </HStack>

        {/* Answer options in 2x2 grid */}
        <SimpleGrid columns={2} spacing={4} w="full" maxW="800px" mx="auto">
          {round.options.map((option) => {
            const isSelected = selected === option.letter;
            const isCorrectAnswer = correct === true && option.letter === round.targetLetter;
            const isWrongAnswer = isSelected && correct === false;

            return (
              <LetterCard
                key={option.letter}
                emoji={option.emoji}
                word={option.word}
                onClick={() => handleLetterClick(option.letter)}
                onSpeakerClick={() => handleSpeakerClick(option.word)}
                isSelected={isSelected}
                isCorrect={isCorrectAnswer ? true : undefined}
                isWrong={isWrongAnswer ? true : undefined}
                isDisabled={correct === true}
              />
            );
          })}
        </SimpleGrid>

        {/* Feedback message */}
        {correct === true && (
          <Box textAlign="center" py={4}>
            <Text fontSize="2xl" fontWeight="bold" color="green.600">
              Great job! 🎉
            </Text>
          </Box>
        )}
        {correct === false && (
          <Box textAlign="center" py={4}>
            <Text fontSize="xl" fontWeight="bold" color="orange.600">
              Try again! The answer is {round.targetLetter}
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
}
