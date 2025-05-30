import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ResultsClient from '@/components/results/ResultsClient';

jest.mock('@/lib/useUserLocation', () => ({
  useUserLocation: () => ({
    location: { lat: 25.0182544, lon: 121.5354438 },
    error: null,
  }),
}));

const mockRestaurants = [
  {
    id: '1',
    name: 'Test Restaurant',
    type: '1',
    eat_in: true,
    latitude: '25.0182544',
    longitude: '121.5354438',
    travel_time_seconds: 300,
  },
];

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    const mockResponse = (body: any) =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(body),
        text: () => Promise.resolve(JSON.stringify(body)),
        headers: { get: () => null },
        clone: function () { return this; },
      } as unknown as Response);

    if (typeof url === 'string' && url.includes('/api/restaurants/')) {
      return mockResponse(mockRestaurants);
    }
    if (typeof url === 'string' && url.includes('VisualCrossingWebServices')) {
      return mockResponse({
        currentConditions: { conditions: 'Clear' },
        days: [{ conditions: 'Clear' }]
      });
    }
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve('{}'),
      headers: { get: () => null },
      clone: function () { return this; },
    } as unknown as Response);
  });
});

describe('ResultsClient', () => {
    it('renders without crashing', async () => {
        render(<ResultsClient searchParams={{ preference: '1' }} />);
        await waitFor(() => {
        expect(screen.getByText(/Your Top Restaurant Picks!/i)).toBeInTheDocument();
        });
    });
});

afterEach(() => {
    jest.clearAllMocks();
});