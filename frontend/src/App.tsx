import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UIProvider, Stack, Heading, Card, CardBody } from './ui';
import { ExercisePlayer } from './features/exercises/components/ExercisePlayer';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider>
        <Stack spacing={6} p={4}>
          <Heading as="h1" size="xl">Dyslexia Intervention (Demo Shell)</Heading>
          <Card>
            <CardBody>
              <ExercisePlayer module="phonological_awareness" />
            </CardBody>
          </Card>
        </Stack>
      </UIProvider>
    </QueryClientProvider>
  );
}

