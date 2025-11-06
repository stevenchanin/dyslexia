// Minimal component showing combined usage (example only)
import React from 'react';
import { useExercises, useSubmitAttempt } from '../queries';
import { useExerciseUI } from '../store';
import { Card, CardHeader, CardBody, Button, Stack, Heading, Text } from '../../../ui';

export function ExercisePlayer({ module }: { module: string }) {
  const difficulty = useExerciseUI((s) => s.currentDifficulty);
  const { data: items, isLoading } = useExercises(module, difficulty);
  const { mutate: submit } = useSubmitAttempt('session-123');

  if (isLoading) return <Text>Loading…</Text>;
  return (
    <Stack spacing={4}>
      <Heading as="h2" size="lg">
        Exercises (difficulty {difficulty})
      </Heading>
      {(items ?? []).map((ex) => (
        <Card key={ex.id}>
          <CardHeader>{ex.title ?? ex.id}</CardHeader>
          <CardBody>
            <Button onClick={() => submit({ exId: ex.id, correct: true })}>Try</Button>
          </CardBody>
        </Card>
      ))}
    </Stack>
  );
}
