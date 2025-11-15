import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box } from '@chakra-ui/react';
import { UIProvider, BottomNav, InstallPrompt } from './ui';
import { HomePage } from './pages/HomePage';
import { ReadingRoomPage } from './pages/ReadingRoomPage';
import { SoundMatchPage } from './pages/SoundMatchPage';
import { LetterQuestPage } from './pages/LetterQuestPage';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider>
        <Router>
          <Box minH="100vh" pb="80px">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/reading-room" element={<ReadingRoomPage />} />
              <Route path="/sound-match" element={<SoundMatchPage />} />
              <Route path="/letter-quest" element={<LetterQuestPage />} />
              {/* Placeholder routes for future pages */}
              <Route path="/listening-room" element={<ComingSoon room="Listening Room" />} />
              <Route path="/games-room" element={<ComingSoon room="Games Room" />} />
              <Route path="/word-builder" element={<ComingSoon room="Word Builder" />} />
              <Route path="/play" element={<ComingSoon room="Play" />} />
              <Route path="/progress" element={<ComingSoon room="Progress" />} />
              <Route path="/backpack" element={<ComingSoon room="Backpack" />} />
            </Routes>
            <BottomNav />
            <InstallPrompt />
          </Box>
        </Router>
      </UIProvider>
    </QueryClientProvider>
  );
}

// Placeholder component for unimplemented pages
function ComingSoon({ room }: { room: string }) {
  return (
    <Box p={8} textAlign="center">
      <Box fontSize="6xl" mb={4}>🚧</Box>
      <Box fontSize="2xl" fontWeight="bold" mb={2}>
        {room}
      </Box>
      <Box color="gray.600">Coming soon!</Box>
    </Box>
  );
}
