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
    travel_time_walk: 300,
    travel_time_bicycle: 200,
    travel_time_transit: 400,
    travel_time_drive: 100,
  },
];

const mockWeather = {
  temp: 28,
  feelslike: 32,
  humidity: 70,
  conditions: 'Clear',
  icon: 'clear-day',
};

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
      return mockResponse({
        restaurants: mockRestaurants,
        weather: mockWeather,
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
  it('renders and displays restaurant and weather info', async () => {
    render(<ResultsClient searchParams={{ preference: '1' }} />);
    await waitFor(() => {
      expect(screen.getByText(/考量交通時間與天氣，為您推薦以下餐廳/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Restaurant/i)).toBeInTheDocument();
      expect(screen.getByText(/提供內用/i)).toBeInTheDocument();
    });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});