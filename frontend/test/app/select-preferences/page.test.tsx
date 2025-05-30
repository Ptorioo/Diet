import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SelectPreferencesPage from '@/app/select-preferences/page';

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

jest.mock('@/components/preferences/PreferenceSelector', () => (props: any) => (
  <div data-testid="preference-selector">
    <button onClick={() => props.onSubmit('1')}>Submit</button>
  </div>
));

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

  it('renders timer and PreferenceSelector', async () => {
    render(<SelectPreferencesPage />);
    expect(screen.getByText('10')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('preference-selector')).toBeInTheDocument();
    });
  });

  it('calls router.push when onSubmit is called', async () => {
    // Import the mocked push function from next/navigation
    const { push } = require('next/navigation');
    
    render(<SelectPreferencesPage />);
    await waitFor(() => {
      expect(screen.getByTestId('preference-selector')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Submit'));
    expect(push).toHaveBeenCalled();
  });
});

afterEach(() => {
    jest.clearAllMocks();
});