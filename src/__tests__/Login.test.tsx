import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../component/Auth/Login';
import { loginUser } from '../utils/User';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';


jest.mock('../utils/User', () => ({
  loginUser: jest.fn(),
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  passwordRegex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
}));


jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));


const localStorageMock = {
  setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});


jest.mock('../assets/Images/login.jpg', () => 'mocked-image.jpg');

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockReset();
    (loginUser as jest.Mock).mockReset();
    (toast.success as jest.Mock).mockReset();
    (toast.error as jest.Mock).mockReset();
    localStorageMock.setItem.mockReset();
  });


  test('renders login form elements', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Email Id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByText(/Forget Password\?/i)).toBeInTheDocument();
    expect(screen.getByText(/SIGNUP/i)).toBeInTheDocument();
  });

  
  test('updates email input and clears errors', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email Id/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput).toHaveValue('test@example.com');
    expect(screen.queryByText(/Please enter your email address/i)).not.toBeInTheDocument();
  });


  test('updates password input, clears errors, and toggles visibility', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText(/Password/i, { selector: 'input' });
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    expect(passwordInput).toHaveValue('Password123!');
    expect(screen.queryByText(/Please enter your password/i)).not.toBeInTheDocument();

    
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  
  test('shows errors for empty inputs on submit', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.submit(screen.getByRole('form', { name: /login-form/i }));
    await waitFor(() => {
      expect(screen.getByText(/Please enter your email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Please enter your password/i)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith('Please correct the errors in the form.');
      expect(loginUser).not.toHaveBeenCalled();
    });
  });

  
  test('shows error for invalid email format', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email Id/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.submit(screen.getByRole('form', { name: /login-form/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith('Please correct the errors in the form.');
      expect(loginUser).not.toHaveBeenCalled();
    });
  });

  
  test('shows error for invalid password format', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email Id/i);
    const passwordInput = screen.getByLabelText(/Password/i, { selector: 'input' });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.submit(screen.getByRole('form', { name: /login-form/i }));

    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith('Please correct the errors in the form.');
      expect(loginUser).not.toHaveBeenCalled();
    });
  });

  
  test('handles successful login', async () => {
    (loginUser as jest.Mock).mockResolvedValue({ token: 'mock-token' });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email Id/i);
    const passwordInput = screen.getByLabelText(/Password/i, { selector: 'input' });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.submit(screen.getByRole('form', { name: /login-form/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith('test@example.com', 'Password123!');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-token');
      expect(toast.success).toHaveBeenCalledWith('Login successful!', {
        position: 'top-right',
        autoClose: 3000,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/home');
      expect(screen.getByRole('button', { name: /Login/i })).not.toBeDisabled();
    });
  });

  
  test('handles failed login', async () => {
    (loginUser as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email Id/i);
    const passwordInput = screen.getByLabelText(/Password/i, { selector: 'input' });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.submit(screen.getByRole('form', { name: /login-form/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith('test@example.com', 'Password123!');
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials', {
        position: 'top-right',
        autoClose: 5000,
      });
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(screen.getByRole('button', { name: /Login/i })).not.toBeDisabled();
    });
  });

  
  test('navigates to signup and forgot password pages', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    
    mockNavigate.mockClear();
    
    fireEvent.click(screen.getByText(/SIGNUP/i));
    expect(mockNavigate).toHaveBeenCalledWith('/signup');

    
    mockNavigate.mockClear();
    fireEvent.click(screen.getByText(/Forget Password\?/i));

    
    mockNavigate.mockClear();
    const signUpLink = screen.getByText(/Sign Up/i);
    fireEvent.click(signUpLink);
  });

  
  test('has accessible form elements', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email Id/i);
    const passwordInput = screen.getByLabelText(/Password/i, { selector: 'input' });
    const submitButton = screen.getByRole('button', { name: /Login/i });
    const toggleButton = screen.getByRole('button', { name: /show password/i });

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('required');
    expect(submitButton).toHaveAttribute('type', 'submit');
    expect(toggleButton).toHaveAttribute('aria-label', 'show password');
    expect(screen.getByText(/Forget Password\?/i)).toHaveAttribute('href', '/forgot-password');
    expect(screen.getByText(/Sign Up/i)).toHaveAttribute('href', '/signup');
  });
});