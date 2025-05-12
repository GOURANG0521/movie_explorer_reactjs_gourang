import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signup from '../component/Auth/Signup';
import { signUpUser } from '../utils/User';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';


jest.mock('../utils/User', () => ({
  signUpUser: jest.fn(),
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  passwordRegex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  phoneRegex: /^\d{10}$/,
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

describe('Signup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockReset();
    (signUpUser as jest.Mock).mockReset();
    (toast.success as jest.Mock).mockReset();
    (toast.error as jest.Mock).mockReset();
    localStorageMock.setItem.mockReset();
  });

  
  test('renders signup form elements', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    expect(screen.getByText(/LOGIN/i)).toBeInTheDocument();
    expect(screen.getByText(/SIGNUP/i)).toBeInTheDocument();
  });

  
  test('updates name input and clears errors', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput).toHaveValue('John Doe');
    expect(screen.queryByText(/Please enter your name/i)).not.toBeInTheDocument();
  });

  
  test('updates email input and clears errors', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email Id/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput).toHaveValue('test@example.com');
    expect(screen.queryByText(/Please enter a valid email address/i)).not.toBeInTheDocument();
  });

  
  test('updates phone input and clears errors', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const phoneInput = screen.getByLabelText(/Phone Number/i);
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    expect(phoneInput).toHaveValue('1234567890');
    expect(screen.queryByText(/Please enter a valid 10-digit phone number/i)).not.toBeInTheDocument();
  });

  
  test('updates password input and clears errors', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    expect(passwordInput).toHaveValue('Password123!');
    expect(screen.queryByText(/Password must be at least 8 characters/i)).not.toBeInTheDocument();
  });

  
  test('shows errors for empty inputs on submit', async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.submit(screen.getByRole('form', { name: /signup-form/i }));
    await waitFor(() => {
      expect(screen.getByText(/Please enter your name/i)).toBeInTheDocument();
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Please enter a valid 10-digit phone number/i)).toBeInTheDocument();
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith('Please correct the errors in the form.', {
        position: 'top-right',
        autoClose: 5000,
      });
      expect(signUpUser).not.toHaveBeenCalled();
    });
  });

  
  test('shows errors for invalid email, phone, and password formats', async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email Id/i);
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(phoneInput, { target: { value: '12345' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });

    fireEvent.submit(screen.getByRole('form', { name: /signup-form/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Please enter a valid 10-digit phone number/i)).toBeInTheDocument();
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith('Please correct the errors in the form.', {
        position: 'top-right',
        autoClose: 5000,
      });
      expect(signUpUser).not.toHaveBeenCalled();
    });
  });

  
  test('handles successful signup', async () => {
    (signUpUser as jest.Mock).mockResolvedValue({
      token: 'mock-token',
      name: 'John Doe',
      email: 'test@example.com',
      mobile_number: '1234567890',
      role: 'user',
      message: 'Signup successful',
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email Id/i);
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    fireEvent.submit(screen.getByRole('form', { name: /signup-form/i }));

    await waitFor(() => {
      expect(signUpUser).toHaveBeenCalledWith({
        user: {
          name: 'John Doe',
          email: 'test@example.com',
          password: 'Password123!',
          mobile_number: '1234567890',
        },
      });
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'new user detail',
        JSON.stringify({
          name: 'John Doe',
          email: 'test@example.com',
          mobile_number: '1234567890',
          role: 'user',
        })
      );
      expect(toast.success).toHaveBeenCalledWith('Sign-up successful!', {
        position: 'top-right',
        autoClose: 3000,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  
  test('handles failed signup', async () => {
    (signUpUser as jest.Mock).mockRejectedValue(new Error('Email already exists'));

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email Id/i);
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    fireEvent.submit(screen.getByRole('form', { name: /signup-form/i }));

    await waitFor(() => {
      expect(signUpUser).toHaveBeenCalledWith({
        user: {
          name: 'John Doe',
          email: 'test@example.com',
          password: 'Password123!',
          mobile_number: '1234567890',
        },
      });
      expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith('Email already exists', {
        position: 'top-right',
        autoClose: 5000,
      });
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  
  test('navigates to login page', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/LOGIN/i));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  
  test('has accessible form elements', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email Id/i);
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });

    expect(nameInput).toHaveAttribute('type', 'text');
    expect(nameInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
    expect(phoneInput).toHaveAttribute('type', 'tel');
    expect(phoneInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('required');
    expect(submitButton).toHaveAttribute('type', 'submit');
    expect(screen.getByRole('form', { name: /signup-form/i })).toBeInTheDocument();
  });
});