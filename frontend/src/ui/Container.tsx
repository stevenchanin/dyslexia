import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

export interface ContainerProps extends BoxProps {
  children: React.ReactNode;
}

export function Container({ children, ...props }: ContainerProps) {
  return (
    <Box
      maxW="1200px"
      mx="auto"
      px={{ base: 4, md: 6 }}
      py={{ base: 6, md: 8 }}
      {...props}
    >
      {children}
    </Box>
  );
}
