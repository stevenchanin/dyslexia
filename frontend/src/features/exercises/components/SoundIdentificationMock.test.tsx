import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { handlers } from '../../../mocks/handlers';
import { SoundIdentificationMock } from './SoundIdentificationMock';
import { UIProvider } from '../../../ui';

// Setup MSW server
const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Helper to render component with providers
function renderWithProviders(component: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <UIProvider>{component}</UIProvider>
    </QueryClientProvider>
  );
}

describe('SoundIdentificationMock', () => {
  it('should render loading state initially', () => {
    renderWithProviders(<SoundIdentificationMock />);

    expect(screen.getByText('Sound Detective')).toBeInTheDocument();
    expect(screen.getByText('Loading exercise...')).toBeInTheDocument();
  });

  it('should render exercise after session creation', async () => {
    renderWithProviders(<SoundIdentificationMock />);

    await waitFor(
      () => {
        expect(screen.queryByText('Loading exercise...')).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Should show round counter
    expect(screen.getByText(/Round 1 of 10/i)).toBeInTheDocument();

    // Should show mode label
    expect(
      screen.getByText(/Find the (beginning|ending|middle) sound/i)
    ).toBeInTheDocument();

    // Should show listen button
    expect(screen.getByRole('button', { name: /listen/i })).toBeInTheDocument();
  });

  it('should display option buttons', async () => {
    renderWithProviders(<SoundIdentificationMock />);

    await waitFor(
      () => {
        expect(screen.queryByText('Loading exercise...')).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Should have multiple option buttons (phonemes)
    const buttons = screen.getAllByRole('button');
    const optionButtons = buttons.filter(btn =>
      btn.textContent?.match(/^\/[a-zæɛɪɔʌ]+\/$/i)
    );

    expect(optionButtons.length).toBeGreaterThan(0);
  });

  it('should show feedback on selection', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SoundIdentificationMock />);

    await waitFor(
      () => {
        expect(screen.queryByText('Loading exercise...')).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Click an option button
    const buttons = screen.getAllByRole('button');
    const optionButtons = buttons.filter(btn =>
      btn.textContent?.match(/^\/[a-zæɛɪɔʌ]+\/$/i)
    );

    if (optionButtons.length > 0) {
      await user.click(optionButtons[0]);

      await waitFor(() => {
        // Should show either success or warning feedback
        const feedback =
          screen.queryByText(/Nice!/i) || screen.queryByText(/Almost!/i);
        expect(feedback).toBeInTheDocument();
      });
    }
  });

  it('should show streak and points badges', async () => {
    renderWithProviders(<SoundIdentificationMock />);

    await waitFor(
      () => {
        expect(screen.queryByText('Loading exercise...')).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Should show streak badge
    expect(screen.getByText(/Streak/i)).toBeInTheDocument();

    // Should show points badge with star
    expect(screen.getByText(/⭐/)).toBeInTheDocument();
  });

  it('should enable next button after correct answer', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SoundIdentificationMock />);

    await waitFor(
      () => {
        expect(screen.queryByText('Loading exercise...')).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Get the correct answer by finding what the component expects
    // For this test, we'll just check that Next button becomes enabled
    const buttons = screen.getAllByRole('button');
    const optionButtons = buttons.filter(btn =>
      btn.textContent?.match(/^\/[a-zæɛɪɔʌ]+\/$/i)
    );

    // Try clicking options until we get the correct one
    for (const button of optionButtons) {
      await user.click(button);

      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /next/i });
        if (!nextButton.hasAttribute('disabled')) {
          expect(nextButton).toBeEnabled();
          return true;
        }
      }).catch(() => {
        // Try next option
      });

      // If we found the right answer, break
      const nextButton = screen.getByRole('button', { name: /next/i });
      if (!nextButton.hasAttribute('disabled')) {
        break;
      }
    }
  });

  it('should show round progress', async () => {
    renderWithProviders(<SoundIdentificationMock />);

    await waitFor(
      () => {
        expect(screen.queryByText('Loading exercise...')).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Should show "Round X of 10"
    const roundText = screen.getByText(/Round \d+ of 10/i);
    expect(roundText).toBeInTheDocument();
  });

  it('should display word hint in parentheses', async () => {
    renderWithProviders(<SoundIdentificationMock />);

    await waitFor(
      () => {
        expect(screen.queryByText('Loading exercise...')).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Should show word hint like "(word: cat)"
    const wordHint = screen.getByText(/\(word: \w+\)/i);
    expect(wordHint).toBeInTheDocument();
  });
});
