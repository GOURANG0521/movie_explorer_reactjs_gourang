import { render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MovieDetail from '../component/CrasouleSample/MovieDetail';
import { fetchMovieById } from '../utils/User';
import '@testing-library/jest-dom';


jest.mock('../utils/User', () => ({
  fetchMovieById: jest.fn(),
  Episode: jest.fn(),
}));


jest.mock('../component/CrasouleSample/Carosule', () => {
  return function MockCarousel({ title, genre }: { title: string; genre: string }) {
    return <div data-testid="carousel">Carousel: {title} - {genre}</div>;
  };
});


const mockUseMediaQuery = jest.fn();
jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: () => mockUseMediaQuery(),
}));


const scrollToSpy = jest.fn();
global.scrollTo = scrollToSpy;


describe('MovieDetail Component', () => {
  const mockMovie = {
    id: 1,
    title: 'Test Movie',
    desc: 'A thrilling test movie',
    banner: 'banner.jpg',
    image: 'poster.jpg',
    starRating: 8.5,
    year: 2023,
    duration: '2h 10m',
    genre: 'Action',
    streaming_platform: 'Test Platform',
    director: 'Test Director',
    main_lead: 'Test Actor',
    premium: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchMovieById as jest.Mock).mockReset();
    scrollToSpy.mockReset();
    mockUseMediaQuery.mockReturnValue(false); 
  });

  const renderMovieDetail = (id?: string) => {
    return render(
      <MemoryRouter initialEntries={id ? [`/movie/${id}`] : ['/movie/undefined']}>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/movie/undefined" element={<MovieDetail />} />
        </Routes>
      </MemoryRouter>
    );
  };

  
  test('renders loading state while fetching movie', () => {
    (fetchMovieById as jest.Mock).mockReturnValue(new Promise(() => {})); 
    renderMovieDetail('1');

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Loading movie details...')).toBeInTheDocument();
  });

  
  test('displays error when no movie ID is provided', async () => {
    renderMovieDetail();

    await waitFor(() => {
      expect(screen.getByText('No movie ID provided')).toBeInTheDocument();
    });
    expect(fetchMovieById).not.toHaveBeenCalled();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  
  test('displays error when fetchMovieById fails', async () => {
    (fetchMovieById as jest.Mock).mockRejectedValue(new Error('API error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    renderMovieDetail('1');

    await waitFor(() => {
      expect(screen.getByText('Failed to load movie details')).toBeInTheDocument();
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });

  
  test('displays error when movie is not found', async () => {
    (fetchMovieById as jest.Mock).mockResolvedValue(null);
    renderMovieDetail('1');

    await waitFor(() => {
      expect(screen.getByText('Movie not found')).toBeInTheDocument();
    });
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  
  

  
  test('renders mobile layout when screen is small', async () => {
    mockUseMediaQuery.mockReturnValue(true); 
    (fetchMovieById as jest.Mock).mockResolvedValue(mockMovie);
    renderMovieDetail('1');

    await waitFor(() => {
      const title = screen.getByRole('heading', { name: /Test Movie/i });
      expect(title).toHaveStyle({ textAlign: 'center' });
      const posterContainer = screen.getByAltText('Test Movie Poster').closest('div')?.parentElement;
      expect(posterContainer).toHaveStyle({ justifyContent: 'center' });
      expect(screen.getByTestId('movie-description')).toHaveStyle({ textAlign: 'center' });
    });
  });

  
  test('has proper semantic structure for accessibility', async () => {
    (fetchMovieById as jest.Mock).mockResolvedValue(mockMovie);
    renderMovieDetail('1');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Test Movie/i })).toBeInTheDocument();
      expect(screen.getByAltText('Test Movie Poster')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Watch Now/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Cast & Production/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Movie Info/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /About this Movie/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Ratings & Reviews/i })).toBeInTheDocument();
    });
  });

  


  
  test('renders Carousel component with correct props', async () => {
    (fetchMovieById as jest.Mock).mockResolvedValue(mockMovie);
    renderMovieDetail('1');

    await waitFor(() => {
      const carousel = screen.getByTestId('carousel');
      expect(carousel).toHaveTextContent('Carousel: You May Like - Action');
    });
  });

  
  test('scrolls to top on component mount', () => {
    (fetchMovieById as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderMovieDetail('1');

    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });
});
