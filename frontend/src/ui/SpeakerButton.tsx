import React from 'react';
import { IconButton as CIconButton, IconButtonProps as CIconButtonProps } from '@chakra-ui/react';

export interface SpeakerButtonProps extends Omit<CIconButtonProps, 'icon' | 'aria-label'> {
  label?: string;
}

export function SpeakerButton({ label = 'Play audio', ...props }: SpeakerButtonProps) {
  return (
    <CIconButton
      aria-label={label}
      icon={<span style={{ fontSize: '20px' }}>🔊</span>}
      size="md"
      borderRadius="full"
      bg="white"
      boxShadow="md"
      _hover={{ bg: 'gray.100' }}
      {...props}
    />
  );
}
