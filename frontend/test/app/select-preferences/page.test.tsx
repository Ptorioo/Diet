import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SelectPreferencesPage from '@/app/select-preferences/page';

// Mock next/navigation for router.push
jest.mock('next/navigation', () => {
  const push = jest.fn();
  return {
    useRouter: () => ({
      push,
    }),
    __esModule: true,
    push,
  };
});

// Mock react-tinder-card to just render children and call onSwipe when needed
jest.mock('react-tinder-card', () => {
  const React = require('react');
  return React.forwardRef(
    (
      { children, onSwipe }: { children: React.ReactNode; onSwipe?: (dir: string) => void },
      ref: React.Ref<any>
    ) => {
      React.useImperativeHandle(ref, () => ({
        swipe: (dir: string) => {
          onSwipe && onSwipe(dir);
        },
      }));
      return <div data-testid="tinder-card">{children}</div>;
    }
  );
});

// Mock fetch for labels
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        { id: '1', label_name: 'Italian' },
        { id: '2', label_name: 'Mexican' },
      ]),
  })
) as jest.Mock;

describe('SelectPreferencesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders timer and cards', async () => {
    render(<SelectPreferencesPage />);
    expect(screen.getByText('3')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByTestId('tinder-card').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('Italian')).toBeInTheDocument();
    expect(screen.getByText('Mexican')).toBeInTheDocument();
  });

  it('calls router.push with selected preference after right swipe', async () => {
    const { push } = require('next/navigation');
    render(<SelectPreferencesPage />);
    await waitFor(() => {
      expect(screen.getAllByTestId('tinder-card').length).toBeGreaterThan(0);
    });

    // Click the right swipe button twice to finish all cards
    const rightButton = screen.getByText('吃 都吃 😋');
    fireEvent.click(rightButton); // Swipe right on first card
    fireEvent.click(rightButton); // Swipe right on second card

    await waitFor(() => {
      expect(push).toHaveBeenCalled();
      // The query string should include both ids (URL-encoded)
      expect(push.mock.calls[0][0]).toMatch(/preference=(1%2C2|2%2C1)/);
    });
  });

  it('calls router.push with random preference if none selected', async () => {
    const { push } = require('next/navigation');
    render(<SelectPreferencesPage />);
    await waitFor(() => {
      expect(screen.getAllByTestId('tinder-card').length).toBeGreaterThan(0);
    });

    // Click the left swipe button twice to finish all cards
    const leftButton = screen.getByText('ㄜ 不要 😑');
    fireEvent.click(leftButton); // Swipe left on first card
    fireEvent.click(leftButton); // Swipe left on second card

    await waitFor(() => {
      expect(push).toHaveBeenCalled();
      // The query string should include a single id
      expect(push.mock.calls[0][0]).toMatch(/preference=(1|2)/);
    });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});