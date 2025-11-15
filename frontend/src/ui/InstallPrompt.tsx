import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CloseButton,
  HStack,
  Text,
  VStack,
  useToast,
  Icon
} from '@chakra-ui/react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default install prompt
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Check if user has previously dismissed the prompt
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed) : 0;
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

      // Show prompt if never dismissed or dismissed more than 7 days ago
      if (!dismissed || daysSinceDismissed > 7) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsVisible(false);
      toast({
        title: 'App installed!',
        description: 'Learning Station is now on your home screen',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed or not visible
  if (isInstalled || !isVisible || !deferredPrompt) {
    return null;
  }

  return (
    <Box
      position="fixed"
      bottom={{ base: "88px", md: "20px" }} // Above bottom nav on mobile
      left={{ base: "16px", md: "20px" }}
      right={{ base: "16px", md: "auto" }}
      bg="white"
      borderRadius="xl"
      boxShadow="xl"
      p={4}
      zIndex={1000}
      maxW={{ base: "full", md: "400px" }}
      border="2px solid"
      borderColor="purple.500"
    >
      <HStack align="start" spacing={3}>
        <Box
          bg="purple.100"
          borderRadius="lg"
          p={3}
          fontSize="2xl"
        >
          📱
        </Box>

        <VStack align="start" flex={1} spacing={2}>
          <Text fontWeight="bold" fontSize="md">
            Install Learning Station
          </Text>
          <Text fontSize="sm" color="gray.600">
            Add to your home screen for quick access and offline use!
          </Text>

          <HStack spacing={2} w="full">
            <Button
              colorScheme="purple"
              size="sm"
              onClick={handleInstallClick}
              flex={1}
            >
              Install
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
            >
              Not now
            </Button>
          </HStack>
        </VStack>

        <CloseButton
          size="sm"
          onClick={handleDismiss}
        />
      </HStack>
    </Box>
  );
}

// Compact version for navbar or header
export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  // Don't show if already installed or prompt not available
  if (isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <Button
      leftIcon={<span>📱</span>}
      colorScheme="purple"
      variant="outline"
      size="sm"
      onClick={handleInstallClick}
    >
      Install App
    </Button>
  );
}
