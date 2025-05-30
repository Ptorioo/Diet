import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LandingPage from '@/app/page';

jest.mock('@/components/landing/HeroSection', () => {
  const React = require('react');
  return () => <div data-testid="hero-section" />;
});
jest.mock('@/components/landing/FeatureCard', () => {
  const React = require('react');
  return ({ icon, title, description }: any) => (
    <div data-testid="feature-card">
      <span>{title}</span>
      <span>{description}</span>
    </div>
  );
});

describe('LandingPage', () => {
  it('renders the HeroSection', () => {
    render(<LandingPage />);
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
  });

  it('renders the main heading', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Why Choose/i)).toBeInTheDocument();
    expect(screen.getByText(/Diet/i)).toBeInTheDocument();
  });

  it('renders all FeatureCards with correct titles', () => {
    render(<LandingPage />);
    expect(screen.getAllByTestId('feature-card')).toHaveLength(3);
    expect(screen.getByText('Smart Preferences')).toBeInTheDocument();
    expect(screen.getByText('Weather-Wise Picks')).toBeInTheDocument();
    expect(screen.getByText('Top-Notch Suggestions')).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});