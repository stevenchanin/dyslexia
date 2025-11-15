import React from 'react';
import { Box, HStack, VStack, Heading, Text } from '@chakra-ui/react';

export interface RoomCardProps {
  color: 'reading' | 'listening' | 'games';
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  emoji: string;
  onClick: () => void;
  leftIcon?: React.ReactNode;
}

export function RoomCard({ color, icon, title, subtitle, emoji, onClick, leftIcon }: RoomCardProps) {
  return (
    <HStack spacing={0} position="relative" w="full">
      {/* Left rocket icon */}
      {leftIcon && (
        <Box fontSize="2xl" mr={4} opacity={0.6}>
          {leftIcon}
        </Box>
      )}

      {/* Main card */}
      <Box
        bg={`room.${color}`}
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
          <HStack spacing={4} align="center">
            <Box fontSize={{ base: '3xl', md: '4xl' }}>{icon}</Box>
            <VStack align="start" spacing={0}>
              <Heading size={{ base: 'md', md: 'lg' }} color="white">
                {title}
              </Heading>
              <Text color="white" opacity={0.9} fontSize={{ base: 'sm', md: 'md' }}>
                {subtitle}
              </Text>
            </VStack>
          </HStack>
          <Text fontSize={{ base: '3xl', md: '4xl' }}>{emoji}</Text>
        </HStack>
      </Box>
    </HStack>
  );
}
