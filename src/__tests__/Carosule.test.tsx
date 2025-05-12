import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Carousel from '../component/CrasouleSample/Carosule';
import { fetchMoviesforgener } from '../utils/User';
import '@testing-library/jest-dom';


jest.mock('../utils/User', () => ({
  fetchMoviesforgener: jest.fn(),
  Episode: jest.fn(),
}));


jest.mock('../component/CrasouleSample/MovieItem', () => {
  return function MockMovieItem({ title, id, onClick }: { title: string; id: number; onClick: () => void }) {
    return (
      <div data-testid={`movie-item-${id}`} onClick={onClick}>
        {title}
      </div>
    );
  };
});


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Carousel Component', () => {
  const mockMovies = [
    {
      id: 1,
      title: 'Movie 1',
      desc: 'Description 1',
      image: 'image1.jpg',
      starRating: 4.5,
      year: 2023,
      duration: 120,
      streaming_platform: 'Platform 1',
      premium: false,
    },
    {
      id: 2,
      title: 'Movie 2',
      desc: 'Description 2',
      image: 'image2.jpg',
      starRating: 4.0,
      year: 2022,
      duration: 110,
      streaming_platform: 'Platform 2',
      premium: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchMoviesforgener as jest.Mock).mockReset();
  });

  const renderCarousel = (props = { title: 'Action Movies', genre: 'Action' as const }) => {
    return render(<Carousel {...props} />, { wrapper: MemoryRouter });
  };

 
  test('renders title, explore more link, and loading state', () => {
    (fetchMoviesforgener as jest.Mock).mockReturnValue(new Promise(() => {})); 
    renderCarousel();

    expect(screen.getByRole('heading', { name: /Action Movies/i })).toBeInTheDocument();
    expect(screen.getByText('Explore more')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });


  test('displays movies when fetchMoviesforgener succeeds', async () => {
    (fetchMoviesforgener as jest.Mock).mockResolvedValue(mockMovies);
    renderCarousel();

    await waitFor(() => {
      expect(screen.getByTestId('movie-item-1')).toHaveTextContent('Movie 1');
      expect(screen.getByTestId('movie-item-2')).toHaveTextContent('Movie 2');
    });

    expect(fetchMoviesforgener).toHaveBeenCalledWith('Action');
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText(/No Action movies found/i)).not.toBeInTheDocument();
  });

 
  test('displays error message when fetchMoviesforgener fails', async () => {
    (fetchMoviesforgener as jest.Mock).mockRejectedValue(new Error('API error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    renderCarousel();

    await waitFor(() => {
      expect(screen.getByText('Failed to load Action movies')).toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });

  
  test('displays no movies message when movie list is empty', async () => {
    (fetchMoviesforgener as jest.Mock).mockResolvedValue([]);
    renderCarousel();

    await waitFor(() => {
      expect(screen.getByText('No Action movies found')).toBeInTheDocument();
    });

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByTestId('movie-item-1')).not.toBeInTheDocument();
  });

  
  test('scroll buttons trigger scrolling', async () => {
    (fetchMoviesforgener as jest.Mock).mockResolvedValue(mockMovies);
    renderCarousel();

    await waitFor(() => {
      expect(screen.getByTestId('movie-item-1')).toBeInTheDocument();
    });

    const scrollByMock = jest.fn();
    const scrollContainer = screen.getByTestId('carousel-scroll-container');
    scrollContainer.scrollBy = scrollByMock;

    const leftButton = screen.getByRole('button', { name: /scroll left/i });
    const rightButton = screen.getByRole('button', { name: /scroll right/i });

    fireEvent.click(leftButton);
    expect(scrollByMock).toHaveBeenCalledWith({ left: -300, behavior: 'smooth' });

    fireEvent.click(rightButton);
    expect(scrollByMock).toHaveBeenCalledWith({ left: 300, behavior: 'smooth' });
  });

  
  test('navigates to genre page when clicking Explore more', () => {
    (fetchMoviesforgener as jest.Mock).mockResolvedValue([]);
    renderCarousel();

    const exploreMoreLink = screen.getByText('Explore more');
    fireEvent.click(exploreMoreLink);

    expect(mockNavigate).toHaveBeenCalledWith('/gen');
  });

  
  test('navigates to movie details when clicking a movie', async () => {
    (fetchMoviesforgener as jest.Mock).mockResolvedValue(mockMovies);
    renderCarousel();

    await waitFor(() => {
      const movieItem = screen.getByTestId('movie-item-1');
      fireEvent.click(movieItem);
      expect(mockNavigate).toHaveBeenCalledWith('/movie/1');
    });
  });

  
  test('has proper semantic structure for accessibility', () => {
    (fetchMoviesforgener as jest.Mock).mockResolvedValue([]);
    renderCarousel();

    expect(screen.getByRole('heading', { name: /Action Movies/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /scroll left/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /scroll right/i })).toBeInTheDocument();
    expect(screen.getByText('Explore more').closest('div')).toHaveAttribute('role', 'button');
  });

  
  test('updates movies when genre prop changes', async () => {
    (fetchMoviesforgener as jest.Mock).mockResolvedValue(mockMovies);
    const { rerender } = renderCarousel({ title: 'Action Movies', genre: 'Action' });

    await waitFor(() => {
      expect(fetchMoviesforgener).toHaveBeenCalledWith('Action');
    });

    rerender(<Carousel title="Thriller Movies" genre="Thriller" />);

    await waitFor(() => {
      expect(fetchMoviesforgener).toHaveBeenCalledWith('Thriller');
    });
  });
});

