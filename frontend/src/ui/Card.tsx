import React from 'react';
import { Box, BoxProps, Heading as CHeading, Text as CText } from '@chakra-ui/react';

export function Card(props: BoxProps) {
  return (
    <Box bg="white" borderRadius="md" shadow="sm" borderWidth="1px" p={4} {...props} />
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return (
    <CHeading as="h3" size="md" mb={2}>
      {children}
    </CHeading>
  );
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <CText>{children}</CText>;
}

