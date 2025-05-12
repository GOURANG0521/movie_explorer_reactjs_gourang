import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../component/Pages/Dashboard';
import '@testing-library/jest-dom';

jest.mock('../component/Common/Header', () => () => <div data-testid="header">Mock Header</div>);
jest.mock('../component/Common/Footer', () => () => <div data-testid="footer">Mock Footer</div>);
jest.mock('../component/Banner/Slider', () => () => <div data-testid="slider">Mock Slider</div>);
jest.mock('../component/CrasouleSample/Carosule', () => ({ title, genre }) => (
  <div data-testid={`carousel-${genre}`} data-title={title}>
    Mock Carousel: {title} ({genre})
  </div>
));

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderDashboard = () => {
    return render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
  };

  test('renders Header, Slider, three Carousels, and Footer', () => {
    renderDashboard();

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('slider')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-Si-Fi')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-Thriller')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-Action')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('passes correct title and genre props to Carousel components', () => {
    renderDashboard();

    const sciFiCarousel = screen.getByTestId('carousel-Si-Fi');
    expect(sciFiCarousel).toHaveAttribute('data-title', 'Sci-Fi');
    expect(sciFiCarousel).toHaveTextContent('Mock Carousel: Sci-Fi (Si-Fi)');

    const thrillerCarousel = screen.getByTestId('carousel-Thriller');
    expect(thrillerCarousel).toHaveAttribute('data-title', 'Thriller');
    expect(thrillerCarousel).toHaveTextContent('Mock Carousel: Thriller (Thriller)');

    const actionCarousel = screen.getByTestId('carousel-Action');
    expect(actionCarousel).toHaveAttribute('data-title', 'Action');
    expect(actionCarousel).toHaveTextContent('Mock Carousel: Action (Action)');
  });

  test('renders components in correct order', () => {
    renderDashboard();

    const container = screen.getByTestId('header').parentElement;
    const children = container?.children;

    expect(children?.length).toBe(6); 
    expect(children?.[0]).toHaveAttribute('data-testid', 'header');
    expect(children?.[1]).toHaveAttribute('data-testid', 'slider');
    expect(children?.[2]).toHaveAttribute('data-testid', 'carousel-Si-Fi');
    expect(children?.[3]).toHaveAttribute('data-testid', 'carousel-Thriller');
    expect(children?.[4]).toHaveAttribute('data-testid', 'carousel-Action');
    expect(children?.[5]).toHaveAttribute('data-testid', 'footer');
  });

  test('has accessible components', () => {
    renderDashboard();

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('slider')).toBeInTheDocument();
    expect(screen.getAllByTestId(/carousel-/)).toHaveLength(3);
    expect(screen.getByTestId('carousel-Si-Fi')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-Thriller')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-Action')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});