import React from 'react';
import { Card, CardBody, Stack, Heading, Text, Badge, Button } from '../../../ui';
import type { SessionSummary as SessionSummaryType } from '../../../types/exercises';

interface SessionSummaryProps {
  summary: SessionSummaryType;
  elapsedTimeMs: number;
  onRestart?: () => void;
  onExit?: () => void;
}

export function SessionSummary({ summary, elapsedTimeMs, onRestart, onExit }: SessionSummaryProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'green';
    if (accuracy >= 60) return 'yellow';
    return 'orange';
  };

  return (
    <Card>
      <CardBody>
        <Stack spacing={6}>
          {/* Header */}
          <Stack spacing={2} align="center">
            <Heading as="h2" size="xl">
              🎉 Session Complete!
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Great work practicing your reading skills!
            </Text>
          </Stack>

          {/* Overall Stats */}
          <Stack spacing={4}>
            <Stack direction="row" justify="space-around" wrap="wrap" spacing={4}>
              <Stack align="center" spacing={1}>
                <Text fontSize="3xl" fontWeight="bold" color={getAccuracyColor(summary.accuracy)}>
                  {summary.accuracy.toFixed(0)}%
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Accuracy
                </Text>
              </Stack>

              <Stack align="center" spacing={1}>
                <Text fontSize="3xl" fontWeight="bold" color="purple.500">
                  {summary.pointsEarned}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Points Earned
                </Text>
              </Stack>

              <Stack align="center" spacing={1}>
                <Text fontSize="3xl" fontWeight="bold" color="orange.500">
                  {summary.maxStreak}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Best Streak
                </Text>
              </Stack>
            </Stack>
          </Stack>

          {/* Detailed Stats */}
          <Stack spacing={3}>
            <Heading as="h3" size="md">
              Session Details
            </Heading>

            <Stack spacing={2}>
              <Stack direction="row" justify="space-between">
                <Text>Total Rounds:</Text>
                <Text fontWeight="semibold">{summary.totalRounds}</Text>
              </Stack>

              <Stack direction="row" justify="space-between">
                <Text>Correct Answers:</Text>
                <Text fontWeight="semibold" color="green.500">
                  {summary.correctRounds} / {summary.totalRounds}
                </Text>
              </Stack>

              <Stack direction="row" justify="space-between">
                <Text>Average Response Time:</Text>
                <Text fontWeight="semibold">
                  {(summary.averageResponseTime / 1000).toFixed(1)}s
                </Text>
              </Stack>

              <Stack direction="row" justify="space-between">
                <Text>Total Time:</Text>
                <Text fontWeight="semibold">{formatTime(elapsedTimeMs)}</Text>
              </Stack>
            </Stack>
          </Stack>

          {/* Mode-Specific Stats */}
          {summary.modeStats.length > 0 && (
            <Stack spacing={3}>
              <Heading as="h3" size="md">
                Performance by Mode
              </Heading>

              <Stack spacing={2}>
                {summary.modeStats.map((stat) => (
                  <Stack
                    key={stat.mode}
                    direction="row"
                    justify="space-between"
                    align="center"
                  >
                    <Text textTransform="capitalize">{stat.mode} Sound:</Text>
                    <Stack direction="row" spacing={2} align="center">
                      <Text fontSize="sm" color="gray.600">
                        {stat.correct}/{stat.attempted}
                      </Text>
                      <Badge colorScheme={getAccuracyColor(stat.accuracy)}>
                        {stat.accuracy.toFixed(0)}%
                      </Badge>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          )}

          {/* Action Buttons */}
          <Stack direction="row" spacing={3} justify="center" wrap="wrap">
            {onRestart && (
              <Button onClick={onRestart} colorScheme="blue" size="lg">
                Practice Again
              </Button>
            )}
            {onExit && (
              <Button onClick={onExit} variant="outline" size="lg">
                Exit
              </Button>
            )}
          </Stack>

          {/* Encouragement Message */}
          <Stack spacing={2} align="center" p={4} bg="blue.50" borderRadius="md">
            <Text fontSize="md" fontWeight="semibold" color="blue.700">
              {summary.accuracy >= 80
                ? "🌟 Excellent work! You're making great progress!"
                : summary.accuracy >= 60
                ? "👍 Good job! Keep practicing and you'll improve even more!"
                : "💪 Nice effort! Practice makes perfect - try again!"}
            </Text>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
}
