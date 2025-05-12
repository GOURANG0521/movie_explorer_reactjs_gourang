import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MovieItem from '../component/CrasouleSample/MovieItem';
import { deleteMovie } from '../utils/User';
import '@testing-library/jest-dom';


jest.mock('../utils/User', () => ({
  deleteMovie: jest.fn(),
}));


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));


jest.mock('react-icons/fa6', () => ({
  FaCrown: () => <span data-testid="crown-icon">Crown</span>,
}));


const localStorageMock = {
  getItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});


const mockConfirm = jest.fn();
const mockAlert = jest.fn();
Object.defineProperty(window, 'confirm', { value: mockConfirm });
Object.defineProperty(window, 'alert', { value: mockAlert });

describe('MovieItem Component', () => {
  const defaultProps = {
    id: 1,
    title: 'Test Movie',
    desc: 'A test movie description',
    image: 'poster.jpg',
    rating: 8.5,
    year: 2023,
    duration: '2h 10m',
    streaming_platform: 'Test Platform',
    premium: false,
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReset();
    mockNavigate.mockReset();
    mockConfirm.mockReset();
    mockAlert.mockReset();
    (deleteMovie as jest.Mock).mockReset();
  });

  
  test('renders movie details correctly', () => {
    render(
      <MemoryRouter>
        <MovieItem {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByAltText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('2h 10m')).toBeInTheDocument();
    expect(screen.getByText('Test Platform')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
  });

  
  test('renders premium badge when premium is true', () => {
    render(
      <MemoryRouter>
        <MovieItem {...defaultProps} premium={true} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('crown-icon')).toBeInTheDocument();
  });


  test('does not render edit and delete controls for non-supervisor', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ role: 'user' }));
    render(
      <MemoryRouter>
        <MovieItem {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.queryByLabelText('edit')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('delete')).not.toBeInTheDocument();
  });

  

  
  test('shows delete button on hover and hides when not hovered', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ role: 'supervisor' }));
    render(
      <MemoryRouter>
        <MovieItem {...defaultProps} />
      </MemoryRouter>
    );

    const deleteButton = screen.getByLabelText('delete');
    expect(deleteButton).toHaveStyle({ opacity: 0 });

    fireEvent.mouseEnter(screen.getByAltText('Test Movie').closest('div')!);
    expect(deleteButton).toHaveStyle({ opacity: 1 });

    fireEvent.mouseLeave(screen.getByAltText('Test Movie').closest('div')!);
    expect(deleteButton).toHaveStyle({ opacity: 0 });
  });

  

  test('calls deleteMovie on delete button click with confirmation', async () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ role: 'supervisor' }));
    (deleteMovie as jest.Mock).mockResolvedValue(undefined);
    mockConfirm.mockReturnValue(true);
    const mockOnClick = jest.fn();
    render(
      <MemoryRouter>
        <MovieItem {...defaultProps} onClick={mockOnClick} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText('delete'));
    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete "Test Movie"?');
      expect(deleteMovie).toHaveBeenCalledWith(1);
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });


  test('shows alert on delete failure', async () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ role: 'supervisor' }));
    (deleteMovie as jest.Mock).mockRejectedValue(new Error('Delete failed'));
    mockConfirm.mockReturnValue(true);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <MemoryRouter>
        <MovieItem {...defaultProps} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText('delete'));
    await waitFor(() => {
      expect(deleteMovie).toHaveBeenCalledWith(1);
      expect(mockAlert).toHaveBeenCalledWith('Failed to delete movie. Please try again.');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error occurred while deleting movie:', expect.any(Error));
    });
    consoleErrorSpy.mockRestore();
  });

 
  test('calls onClick when card is clicked', () => {
    const mockOnClick = jest.fn();
    render(
      <MemoryRouter>
        <MovieItem {...defaultProps} onClick={mockOnClick} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByAltText('Test Movie').closest('div')!);
    expect(mockOnClick).toHaveBeenCalled();
  });

 
  test('sets isSupervisor to false on local storage parsing error', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <MemoryRouter>
        <MovieItem {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.queryByLabelText('edit')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('delete')).not.toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error parsing local storage data:', expect.any(Error));
    consoleErrorSpy.mockRestore();
  });
});