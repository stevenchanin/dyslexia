import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VStack, Heading, Text } from '@chakra-ui/react';
import { Container, BackButton, ExerciseCard } from '../ui';

export function ReadingRoomPage() {
  const navigate = useNavigate();

  const handleSpeakerClick = (exerciseName: string) => {
    // TTS functionality can be added here
    console.log(`Playing audio for ${exerciseName}`);
  };

  return (
    <Container>
      <VStack spacing={8} align="stretch" py={4}>
        {/* Back button */}
        <BackButton to="/">Back Home</BackButton>

        {/* Header with mascot */}
        <VStack spacing={2} align="center" py={4}>
          <Text fontSize="5xl">🦉</Text>
          <Heading as="h1" size="xl" textAlign="center">
            Reading Room
          </Heading>
          <Text fontSize="lg" color="gray.600" textAlign="center">
            Ollie the Owl will guide you
          </Text>
        </VStack>

        {/* Exercise cards */}
        <VStack spacing={6} w="full" maxW="800px" mx="auto">
          <ExerciseCard
            icon="🎵"
            title="Sound Match"
            subtitle="Tap the sound that matches the letter"
            onClick={() => navigate('/sound-match')}
            onSpeakerClick={() => handleSpeakerClick('Sound Match')}
          />

          <ExerciseCard
            icon="🔤"
            title="Letter Quest"
            subtitle="Find the letter we're looking for"
            onClick={() => navigate('/letter-quest')}
            onSpeakerClick={() => handleSpeakerClick('Letter Quest')}
          />

          <ExerciseCard
            icon="🧩"
            title="Word Builder"
            subtitle="Arrange letters to make a word"
            onClick={() => navigate('/word-builder')}
            onSpeakerClick={() => handleSpeakerClick('Word Builder')}
          />
        </VStack>
      </VStack>
    </Container>
  );
}
