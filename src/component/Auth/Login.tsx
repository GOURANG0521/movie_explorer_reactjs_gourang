import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { emailRegex, passwordRegex, loginUser } from '../../utils/User';
import img from '../../assets/Images/login.jpg';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';

interface Errors {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignup = (): void => {
    navigate('/signup');
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    setErrors((prev) => ({ ...prev, email: '' }));
    setLoginError('');
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    setErrors((prev) => ({ ...prev, password: '' }));
    setLoginError('');
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    let newErrors: Errors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Please enter your email address';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address (e.g. gourang@gmail.com)';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        'Password must be at least 8 characters with a letter, number, and special character (@$!%*#?&)';
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      toast.error('Please correct the errors in the form.');
      setIsLoading(false);
      return;
    }

    try {
      const jsonData = await loginUser(email, password);
      localStorage.setItem('token', jsonData.token);
      toast.success('Login successful!', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('/home');
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred during login. Please try again.';
      setLoginError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 3, lg: 4 },
        py: 12,
        backgroundImage: `url(${img}), linear-gradient(to bottom right, #1a202c, #4c51bf)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          bgcolor: 'rgba(31, 41, 55, 0.8)',
          borderRadius: 4,
          transform: 'scale(1)',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              borderBottom: '2px solid #dc2626',
              pb: 0.5,
            }}
          >
            LOGIN
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'grey.400',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            onClick={handleSignup}
          >
            SIGNUP
          </Typography>
        </Box>

        <form onSubmit={handleLogin} aria-label="login-form">
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Email Id"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              variant="outlined"
              required
              disabled={isLoading}
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'grey.700',
                  color: 'white',
                  '& fieldset': { borderColor: 'grey.500' },
                  '&:hover fieldset': { borderColor: 'grey.400' },
                  '&.Mui-focused fieldset': { borderColor: '#4c51bf' },
                },
                '& .MuiInputLabel-root': { color: 'grey.300' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#4c51bf' },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              variant="outlined"
              required
              disabled={isLoading}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      sx={{ color: 'grey.400' }}
                      aria-label="show password"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'grey.700',
                  color: 'white',
                  '& fieldset': { borderColor: 'grey.500' },
                  '&:hover fieldset': { borderColor: 'grey.400' },
                  '&.Mui-focused fieldset': { borderColor: '#4c51bf' },
                },
                '& .MuiInputLabel-root': { color: 'grey.300' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#4c51bf' },
              }}
            />
          </Box>

          {loginError && (
            <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
              {loginError}
            </Typography>
          )}

          <Box sx={{ textAlign: 'right', mb: 2 }}>
            <MuiLink
              component={Link}
              to="/forgot-password"
              sx={{
                color: '#4c51bf',
                textDecoration: 'underline',
                '&:hover': { color: '#818cf8' },
              }}
            >
              Forget Password?
            </MuiLink>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              bgcolor: '#dc2626',
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#b91c1c', transform: 'scale(1.05)', transition: 'all 0.3s' },
              '&:disabled': { bgcolor: '#dc2626', opacity: 0.5 },
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>

          <Typography
            variant="body2"
            sx={{ color: 'grey.300', textAlign: 'center', mt: 2 }}
          >
            Don't have an account?{' '}
            <MuiLink
              component={Link}
              to="/signup"
              sx={{
                color: 'white',
                textDecoration: 'underline',
                '&:hover': { color: '#e5e7eb' },
              }}
            >
              Sign Up
            </MuiLink>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;