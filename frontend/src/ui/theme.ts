// Minimal Chakra theme tokens (extend as needed)
import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  styles: {
    global: {
      body: { bg: 'gray.50', color: 'gray.800' },
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

