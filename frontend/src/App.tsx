import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UIProvider, Stack, Heading, Card, CardBody } from './ui';
import { SoundIdentificationMock } from './features/exercises/components/SoundIdentificationMock';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider>
        <Stack spacing={6} p={4}>
          <Heading as="h1" size="xl">Dyslexia Intervention (Demo Shell)</Heading>
          <Card>
            <CardBody>
              <Heading as="h2" size="md" mb={3}>Mockup: 1.1 Sound Identification</Heading>
              <SoundIdentificationMock />
            </CardBody>
          </Card>
        </Stack>
      </UIProvider>
    </QueryClientProvider>
  );
}
