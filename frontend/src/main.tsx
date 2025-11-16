import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { registerSW } from 'virtual:pwa-register';

async function enableMocking() {
  // Enable MSW mocking unless explicitly disabled
  // This allows preview builds to work without a real backend
  if (import.meta.env.VITE_DISABLE_MOCKS === 'true') {
    return;
  }

  const { worker } = await import('./mocks/browser');

  // Start the worker and wait for it to be ready
  await worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
    quiet: false, // Show MSW logs to confirm it's working
  });

  console.log('MSW worker started and ready');
}

// Register service worker for PWA (only when not using MSW in dev)
const shouldEnablePWA = import.meta.env.VITE_DISABLE_MOCKS === 'true' || import.meta.env.PROD;

if (shouldEnablePWA) {
  const updateSW = registerSW({
    onNeedRefresh() {
      // New content available, reload to update
      if (confirm('New content available. Reload to update?')) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
    onRegistered(registration) {
      console.log('Service Worker registered:', registration);
    },
    onRegisterError(error) {
      console.error('Service Worker registration error:', error);
    },
  });
}

enableMocking()
  .then(() => {
    const container = document.getElementById('root');
    if (container) {
      const root = createRoot(container);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    }
  })
  .catch((error) => {
    console.error('Failed to start MSW:', error);
    // Render app anyway, but API calls will fail
    const container = document.getElementById('root');
    if (container) {
      const root = createRoot(container);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    }
  });

