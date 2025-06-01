import LandingPage from '@/app/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

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
    expect(screen.getByText(/為啥要用/i)).toBeInTheDocument();
    expect(screen.getByText(/Dietogether/i)).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<LandingPage />);
    expect(screen.getByText(/吃飯也要聰明！即時取得你的位置與天氣狀況，帶你找最合拍的餐廳。/)).toBeInTheDocument();
  });

  it('renders all FeatureCards with correct titles and descriptions', () => {
    render(<LandingPage />);
    expect(screen.getAllByTestId('feature-card')).toHaveLength(3);
    expect(screen.getByText('限時餐廳選擇')).toBeInTheDocument();
    expect(screen.getByText('基於天氣推薦')).toBeInTheDocument();
    expect(screen.getByText('超頂推薦結果')).toBeInTheDocument();

    expect(screen.getByText('左滑右滑，隨你的直覺，快速找到您餐廳偏好！')).toBeInTheDocument();
    expect(screen.getByText('下大雨？熱到爆？我們都幫您考慮進去了！')).toBeInTheDocument();
    expect(screen.getByText('為您計算餐廳分數並得到最頂的餐廳排序！')).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});