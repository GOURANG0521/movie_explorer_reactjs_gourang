import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MovieDetailPage from '../component/Pages/MovieDetailPage';
import '@testing-library/jest-dom';


jest.mock('../component/Common/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('../component/CrasouleSample/MovieDetail', () => {
  return function MockMovieDetail() {
    return <div data-testid="movie-detail">Movie Detail</div>;
  };
});

jest.mock('../component/Common/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

describe('MovieDetailPage Component', () => {
  const renderWithRouter = (initialEntries = ['/movie/1']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders without crashing', () => {
    renderWithRouter();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  test('renders Header component', () => {
    renderWithRouter();
    expect(screen.getByTestId('header')).toHaveTextContent('Header');
  });

  test('renders MovieDetail component', () => {
    renderWithRouter();
    expect(screen.getByTestId('movie-detail')).toHaveTextContent('Movie Detail');
  });

  test('renders Footer component', () => {
    renderWithRouter();
    expect(screen.getByTestId('footer')).toHaveTextContent('Footer');
  });

  test('renders components in correct order', () => {
    renderWithRouter();
    const elements = screen.getAllByTestId(/header|movie-detail|footer/);
    
    const expectedOrder = ['header', 'movie-detail', 'footer'];

    elements.forEach((element, index) => {
      expect(element).toHaveAttribute('data-testid', expectedOrder[index]);
    });
  });

  test('renders correct number of components', () => {
    renderWithRouter();
    const elements = screen.getAllByTestId(/header|movie-detail|footer/);
    expect(elements).toHaveLength(3); 
  });

  test('works with different movie ID in route', () => {
    renderWithRouter(['/movie/123']);
    expect(screen.getByTestId('movie-detail')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('is accessible with no major a11y violations', async () => {
    const { container } = renderWithRouter();
    expect(container).toBeTruthy();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('movie-detail')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});