import React from 'react';
import { Box, Center, IconButton } from '@chakra-ui/react';

export interface OptionCardProps {
  content: React.ReactNode;
  onClick: () => void;
  onSpeakerClick?: () => void;
  isSelected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  isDisabled?: boolean;
}

export function OptionCard({
  content,
  onClick,
  onSpeakerClick,
  isSelected,
  isCorrect,
  isWrong,
  isDisabled,
}: OptionCardProps) {
  const getBgColor = () => {
    if (isCorrect) return '#6B9969'; // Green
    if (isWrong) return '#E89B9B'; // Pink/red
    return 'room.listening'; // Default teal
  };

  const getBorderColor = () => {
    if (isSelected && !isCorrect && !isWrong) return 'white';
    return 'transparent';
  };

  return (
    <Box
      bg={getBgColor()}
      borderRadius="2xl"
      p={{ base: 8, md: 10 }}
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      onClick={isDisabled ? undefined : onClick}
      position="relative"
      w="full"
      h={{ base: '140px', md: '160px' }}
      _hover={
        isDisabled
          ? undefined
          : {
              transform: 'scale(1.05)',
              boxShadow: 'lg',
            }
      }
      _active={isDisabled ? undefined : { transform: 'scale(0.95)' }}
      transition="all 0.2s"
      boxShadow="md"
      borderWidth="3px"
      borderColor={getBorderColor()}
      opacity={isDisabled ? 0.6 : 1}
    >
      {/* Speaker button in top right corner */}
      {onSpeakerClick && (
        <IconButton
          aria-label="Play audio"
          icon={<span style={{ fontSize: '18px' }}>🔊</span>}
          size="sm"
          borderRadius="full"
          bg="white"
          position="absolute"
          top={3}
          right={3}
          _hover={{ bg: 'gray.100' }}
          onClick={(e) => {
            e.stopPropagation();
            if (!isDisabled) {
              onSpeakerClick();
            }
          }}
        />
      )}

      {/* Content centered */}
      <Center h="full" fontSize={{ base: '4xl', md: '5xl' }}>
        {content}
      </Center>
    </Box>
  );
}
