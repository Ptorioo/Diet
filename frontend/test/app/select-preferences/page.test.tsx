import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SelectPreferencesClient from '@/components/preferences/SelectPreferencesClient';

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

// Mock react-tinder-card to just render children and simulate swipe
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

describe('SelectPreferencesClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders timer and cards', async () => {
    render(<SelectPreferencesClient searchParams={{ preference: undefined }} />);
    
    // Timer initial value should show up
    expect(screen.getByText('3')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByTestId('tinder-card').length).toBeGreaterThan(0);
    });

    // Labels should render on cards
    expect(screen.getByText('Italian')).toBeInTheDocument();
    expect(screen.getByText('Mexican')).toBeInTheDocument();
  });

  it('calls router.push with selected preference after right swipe', async () => {
    const { push } = require('next/navigation').useRouter();

    render(<SelectPreferencesClient searchParams={{ preference: undefined }} />);

    await waitFor(() => {
      expect(screen.getAllByTestId('tinder-card').length).toBeGreaterThan(0);
    });

    const rightButton = screen.getByText('吃 都吃 😋');

    // Swipe right twice to select both cards
    fireEvent.click(rightButton);
    fireEvent.click(rightButton);

    await waitFor(() => {
      expect(push).toHaveBeenCalled();
      // Preference query includes both ids (order can vary)
      expect(push.mock.calls[0][0]).toMatch(/preference=(1%2C2|2%2C1)/);
    });
  });

  it('calls router.push with random preference if none selected', async () => {
    const { push } = require('next/navigation').useRouter();

    render(<SelectPreferencesClient searchParams={{ preference: undefined }} />);

    await waitFor(() => {
      expect(screen.getAllByTestId('tinder-card').length).toBeGreaterThan(0);
    });

    const leftButton = screen.getByText('ㄜ 不要 😑');

    // Swipe left twice to reject all cards
    fireEvent.click(leftButton);
    fireEvent.click(leftButton);

    await waitFor(() => {
      expect(push).toHaveBeenCalled();
      // Preference query includes one id only
      expect(push.mock.calls[0][0]).toMatch(/preference=(1|2)/);
    });
  });
});
