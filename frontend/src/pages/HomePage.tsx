import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VStack, Heading, Text } from '@chakra-ui/react';
import { Container, RoomCard } from '../ui';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <Container>
      <VStack spacing={8} align="center" py={4}>
        {/* Welcome header */}
        <VStack spacing={2}>
          <Text fontSize="5xl">👋</Text>
          <Heading as="h1" size="xl" textAlign="center">
            Welcome to Learning Station!
          </Heading>
          <Text fontSize="lg" color="gray.600" textAlign="center">
            Choose a room to explore
          </Text>
        </VStack>

        {/* Room cards */}
        <VStack spacing={6} w="full" maxW="800px">
          <RoomCard
            color="reading"
            icon="📚"
            title="Reading Room"
            subtitle="Learn to read and discover new words"
            emoji="🦉"
            leftIcon="🚀"
            onClick={() => navigate('/reading-room')}
          />

          <RoomCard
            color="listening"
            icon="🎧"
            title="Listening Room"
            subtitle="Listen to stories and sounds"
            emoji="🐰"
            leftIcon="🚀"
            onClick={() => navigate('/listening-room')}
          />

          <RoomCard
            color="games"
            icon="🎮"
            title="Games Room"
            subtitle="Play fun learning games"
            emoji="🐱"
            leftIcon="🚀"
            onClick={() => navigate('/games-room')}
          />
        </VStack>
      </VStack>
    </Container>
  );
}
