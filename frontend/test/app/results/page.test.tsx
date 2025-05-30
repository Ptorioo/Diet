import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ResultsPage from '@/app/results/page';
import ResultsClient from '@/components/results/ResultsClient';

jest.mock('@/components/results/ResultsClient', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked ResultsClient</div>),
}));

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('ResultsPage', () => {
  it('renders ResultsClient with resolved searchParams', async () => {
    const searchParams = Promise.resolve({ preference: '1' });
    const element = await ResultsPage({ searchParams }); // Await the async component
    render(element);
    await waitFor(() => {
      expect(screen.getByText('Mocked ResultsClient')).toBeInTheDocument();
    });
    expect(ResultsClient).toHaveBeenCalledWith(
      { searchParams: { preference: '1' } },
      {}
    );
  });

  it('renders error message if searchParams rejects', async () => {
    const searchParams = Promise.reject(new Error('fail'));
    const element = await ResultsPage({ searchParams }); // Await the async component
    render(element);
    await waitFor(() => {
      expect(screen.getByText(/Error loading results/i)).toBeInTheDocument();
    });
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});