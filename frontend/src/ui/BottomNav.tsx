import React from 'react';
import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  icon: string;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: '🏠', label: 'Home', path: '/' },
  { icon: '🎮', label: 'Play', path: '/play' },
  { icon: '📊', label: 'Progress', path: '/progress' },
  { icon: '🎒', label: 'Backpack', path: '/backpack' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="white"
      borderTop="2px solid"
      borderColor="green.500"
      boxShadow="0 -2px 10px rgba(0, 0, 0, 0.1)"
      zIndex={1000}
    >
      <HStack spacing={0} justify="space-around" maxW="1200px" mx="auto" py={2}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <VStack
              key={item.path}
              spacing={0}
              cursor="pointer"
              onClick={() => navigate(item.path)}
              flex={1}
              py={2}
              _hover={{ bg: 'gray.50' }}
              transition="background 0.2s"
              borderRadius="md"
            >
              <Text fontSize="2xl" opacity={isActive ? 1 : 0.5}>
                {item.icon}
              </Text>
              <Text
                fontSize="xs"
                fontWeight={isActive ? 'bold' : 'normal'}
                color={isActive ? 'green.600' : 'gray.600'}
              >
                {item.label}
              </Text>
            </VStack>
          );
        })}
      </HStack>
    </Box>
  );
}
