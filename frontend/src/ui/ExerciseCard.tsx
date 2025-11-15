import React from 'react';
import { Box, HStack, VStack, Heading, Text, IconButton } from '@chakra-ui/react';

export interface ExerciseCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  onSpeakerClick?: () => void;
}

export function ExerciseCard({ icon, title, subtitle, onClick, onSpeakerClick }: ExerciseCardProps) {
  return (
    <Box
      bg="room.reading"
      borderRadius="2xl"
      p={{ base: 6, md: 8 }}
      cursor="pointer"
      onClick={onClick}
      position="relative"
      w="full"
      _hover={{ transform: 'scale(1.02)' }}
      _active={{ transform: 'scale(0.98)' }}
      transition="transform 0.2s"
      boxShadow="md"
    >
      <HStack justify="space-between" align="center">
        <HStack spacing={4} align="center" flex={1}>
          <Box fontSize={{ base: '3xl', md: '4xl' }}>{icon}</Box>
          <VStack align="start" spacing={0} flex={1}>
            <Heading size={{ base: 'md', md: 'lg' }} color="white">
              {title}
            </Heading>
            <Text color="white" opacity={0.9} fontSize={{ base: 'sm', md: 'md' }}>
              {subtitle}
            </Text>
          </VStack>
        </HStack>

        {/* Right side with arrow and speaker */}
        <HStack spacing={2}>
          {onSpeakerClick && (
            <IconButton
              aria-label="Play audio"
              icon={<span style={{ fontSize: '20px' }}>🔊</span>}
              size="sm"
              borderRadius="full"
              bg="white"
              _hover={{ bg: 'gray.100' }}
              onClick={(e) => {
                e.stopPropagation();
                onSpeakerClick();
              }}
            />
          )}
          <Text color="white" fontSize="2xl">→</Text>
        </HStack>
      </HStack>
    </Box>
  );
}
