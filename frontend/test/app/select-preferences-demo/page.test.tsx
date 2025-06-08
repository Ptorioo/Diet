import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SelectPreferencesDemoPage from '@/app/select-preferences-demo/page';

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

describe('SelectPreferencesDemoPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders demo page', async () => {
    render(<SelectPreferencesDemoPage />);
    expect(screen.getByText('🍽️ 怎麼選餐廳？')).toBeInTheDocument();
    expect(screen.getByText('🚩 滑動下方卡片，開始選餐廳！')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByTestId('tinder-card').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('範例餐廳種類')).toBeInTheDocument();
  });

  it('calls router.push after right swipe', async () => {
    const { push } = require('next/navigation');
    render(<SelectPreferencesDemoPage />);
    await waitFor(() => {
      expect(screen.getAllByTestId('tinder-card').length).toBeGreaterThan(0);
    });

    const rightButton = screen.getByText('吃 都吃 😋');
    fireEvent.click(rightButton);

    await waitFor(() => {
      expect(push).toHaveBeenCalled();
      expect(push.mock.calls[0][0]).toMatch(/select-preferences/);
    });
  });

  it('calls router.push after left swipe', async () => {
    const { push } = require('next/navigation');
    render(<SelectPreferencesDemoPage />);
    await waitFor(() => {
      expect(screen.getAllByTestId('tinder-card').length).toBeGreaterThan(0);
    });

    const leftButton = screen.getByText('ㄜ 不要 😑');
    fireEvent.click(leftButton);

    await waitFor(() => {
      expect(push).toHaveBeenCalled();
      expect(push.mock.calls[0][0]).toMatch(/select-preferences/);
    });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});