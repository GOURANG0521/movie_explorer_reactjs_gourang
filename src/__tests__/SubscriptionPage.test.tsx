import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SubscriptionPage from '../component/Pages/SubscriptionPage';
import { createSubscription } from '../utils/User';
import '@testing-library/jest-dom';


jest.mock('../component/Common/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('../component/Common/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});


jest.mock('../utils/User', () => ({
  createSubscription: jest.fn(),
}));


const mockAssign = jest.fn();
Object.defineProperty(window, 'location', {
  value: { href: '', assign: mockAssign },
  writable: true,
});


const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});

describe('SubscriptionPage Component', () => {
  beforeEach(() => {
    (createSubscription as jest.Mock).mockReset();
    mockAssign.mockReset();
    scrollToSpy.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = () => {
    return render(
      <MemoryRouter>
        <SubscriptionPage />
      </MemoryRouter>
    );
  };

  test('renders without crashing', () => {
    renderWithRouter();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders Header component', () => {
    renderWithRouter();
    expect(screen.getByTestId('header')).toHaveTextContent('Header');
  });

  test('renders Footer component', () => {
    renderWithRouter();
    expect(screen.getByTestId('footer')).toHaveTextContent('Footer');
  });

  test('renders subscription plans', () => {
    renderWithRouter();
    expect(screen.getByText('1 Day Pass')).toBeInTheDocument();
    expect(screen.getByText('7 Day Pass')).toBeInTheDocument();
    expect(screen.getByText('1 Month Premium')).toBeInTheDocument();
    expect(screen.getByText('$1.99')).toBeInTheDocument();
    expect(screen.getByText('$7.99')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('MOST POPULAR')).toBeInTheDocument();
  });

  test('selects a plan and highlights card', () => {
    renderWithRouter();
    const selectButton = screen.getAllByText('Select Plan')[0]; 
    fireEvent.click(selectButton);
    expect(selectButton).toHaveTextContent('Selected');
    expect(selectButton).toHaveStyle({ backgroundColor: '#E50914' });
    expect(screen.getByText('1 Day Pass').closest('div')).toHaveStyle({ borderColor: 'primary.main' });
  });

  test('shows confirm subscription section when plan is selected', () => {
    renderWithRouter();
    fireEvent.click(screen.getAllByText('Select Plan')[1]); 
    expect(screen.getByText('Confirm Your Subscription')).toBeInTheDocument();
    expect(screen.getByText(/You have selected the 7 Day Pass for \$7.99/)).toBeInTheDocument();
  });

  

  test('handles subscription error simplified', async () => {
  (createSubscription as jest.Mock).mockRejectedValue(new Error('Subscription failed'));
  renderWithRouter();
  const selectButton = screen.getAllByText('Select Plan')[0];
  fireEvent.click(selectButton);
  const subscribeButton = screen.getByText('Subscribe Now');
  fireEvent.click(subscribeButton);
  await waitFor(() => {
    expect(createSubscription).toHaveBeenCalledWith('1_day');
    expect(screen.getByText('Subscription failed')).toBeInTheDocument();
  }, { timeout: 2000 });
});

  test('shows processing state during subscription', () => {
    (createSubscription as jest.Mock).mockReturnValue(new Promise(() => {})); 
    renderWithRouter();
    fireEvent.click(screen.getAllByText('Select Plan')[0]); 
    fireEvent.click(screen.getByText('Subscribe Now'));
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });



  test('scrolls to top on render', () => {
    renderWithRouter();
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });



});