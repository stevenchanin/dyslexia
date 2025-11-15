// Minimal Chakra theme tokens (extend as needed)
import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  colors: {
    room: {
      reading: '#6B9969',      // Green
      listening: '#5FA99B',    // Teal
      games: '#E89B9B',        // Pink/coral
    },
    background: {
      cream: '#F5F1E8',
    },
  },
  styles: {
    global: {
      body: { bg: 'background.cream', color: 'gray.800' },
    },
  },
  fonts: {
    body: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    heading: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
  },
  components: {
    Button: {
      defaultProps: { colorScheme: 'blue', size: 'md', variant: 'solid' },
    },
  },
});

