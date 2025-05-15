import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Success from '../component/Pages/Success';
import axios from 'axios';
import '@testing-library/jest-dom';


jest.mock('axios');

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });


let mockHref = '';
Object.defineProperty(window, 'location', {
  value: {
    href: '',
    assign: jest.fn((url) => (mockHref = url)),
    get href() {
      return mockHref;
    },
    set href(url) {
      mockHref = url;
    },
  },
  writable: true,
});


const mockSubscriptionDetails = {
  plan_name: '7 Day Pass',
  price: '$7.99',
  duration: '7 days',
};

describe('Success Component', () => {
  beforeEach(() => {
    (axios.get as jest.Mock).mockReset();
    mockLocalStorage.getItem.mockReset();
    mockHref = ''; 
    (axios.get as jest.Mock).mockResolvedValue({ data: mockSubscriptionDetails });
    mockLocalStorage.getItem.mockReturnValue('mock-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (initialEntries = ['/success?session_id=123']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Success />
      </MemoryRouter>
    );
  };

  test('navigates to /sub on error button click', async () => {
    renderWithRouter(['/success']);
    await waitFor(
      () => {
        expect(screen.getByText('No session ID found in the URL.')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
    const tryAgainButton = screen.getByText('Try Again');
    fireEvent.click(tryAgainButton);
    expect(window.location.href).toBe('/sub');
  });

  

  test('navigates to /home on success button click', async () => {
    renderWithRouter();
    await waitFor(
      () => {
        expect(screen.getByText('Subscription Activated!')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
    const exploreButton = screen.getByText('Start Exploring Movies');
    fireEvent.click(exploreButton);
    expect(window.location.href).toBe('/home');
  });

  test('renders loading state initially', () => {
    (axios.get as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderWithRouter();
    expect(screen.getByText('Verifying your subscription...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders success state with subscription details', async () => {
    renderWithRouter();
    await waitFor(
      () => {
        expect(screen.getByText('Subscription Activated!')).toBeInTheDocument();
        expect(screen.getByText(/Enjoy your 7 Day Pass!/)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  test('renders error when API call fails', async () => {
    (axios.get as jest.Mock).mockRejectedValue({
      response: { data: { error: 'Invalid session ID' } },
    });
    renderWithRouter();
    await waitFor(
      () => {
        expect(screen.getByText('Invalid session ID')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
