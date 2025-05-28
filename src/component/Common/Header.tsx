import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSearch, FaBell } from 'react-icons/fa';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import { signOut, getSubscriptionStatus,toggleNotifications } from '../../utils/User';

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [role, setRole] = useState<string>('user');
  const [plan, setPlan] = useState<string>('basic');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('new user detail');
    const token = localStorage.getItem('token');
    const planType = localStorage.getItem('plan type');

    if (token) {
      setIsLoggedIn(true);
      if (storedData) {
        try {
          if (planType === 'premium') {
            setPlan('premium');
          }
          const userData = JSON.parse(storedData);
          if (userData.role === 'supervisor') {
            setRole('supervisor');
          } else {
            setRole('user');
          }
        } catch (err) {
          console.error('Error parsing local storage data:', err);
          setRole('user');
        }
      }
      getSubscriptionStatus(token);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    handleClose();
  };

  const handleHomeRedirect = (): void => {
    navigate('/');
  };

  const handleSubscription = (): void => {
    navigate('/sub');
  };

  const handleGener = (): void => {
    navigate('/allmovies');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNotifications = async () => {
    try{
      await toggleNotifications();
    }
    catch(error){
      console.error('toggle notification error:',error);
    }
  };

  const handleLoginSignup = () => {
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#000000' }}>
      <Toolbar className="px-3 sm:px-6">
        <div className="flex-shrink-0">
          <Button onClick={handleHomeRedirect} sx={{ padding: 0 }}>
            <Typography
              variant="h6"
              className="text-lg sm:text-2xl font-bold text-yellow-400"
            >
              <span className="text-black bg-yellow-400 px-2 rounded">FILM</span> BIT
            </Typography>
          </Button>
        </div>

        <div className="flex-grow" />

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* <TextField
            placeholder="Search..."
            size="small"
            className="max-w-[150px] sm:max-w-xs"
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: '#374151',
                color: 'white',
                borderRadius: '9999px',
                padding: '2px 8px',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#9ca3af',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <FaSearch size={14} className="text-gray-400" />
                </InputAdornment>
              ),
            }}
            inputProps={{ 'aria-label': 'Search movies' }}
          /> */}

          <IconButton
            sx={{
              color: 'white',
              '&:hover': { color: '#facc15' },
              padding: { xs: '4px', sm: '8px' },
            }}
            aria-label="Notifications"
          >
            <FaBell size={20} />
          </IconButton>

          <IconButton
            onClick={handleClick}
            sx={{
              color: 'white',
              '&:hover': { color: '#facc15' },
              padding: { xs: '4px', sm: '8px' },
            }}
            aria-label="User menu"
          >
            <FaUser size={20} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                backgroundColor: '#1f2937',
                color: 'white',
              },
            }}
          >
            {isLoggedIn
              ? [
                  role === 'supervisor' && (
                    <MenuItem key="create-movie" onClick={handleDashboard}>
                      Dashboard
                    </MenuItem>
                  ),
                  <MenuItem key="role" onClick={handleClose}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </MenuItem>,
                  <MenuItem key="all-movies" onClick={handleGener}>
                    All movies
                  </MenuItem>,
                  plan === 'basic' && (
                    <MenuItem key="subscription" onClick={handleSubscription}>
                      Buy Subscription
                    </MenuItem>
                  ),
                  // <MenuItem key="notification" onClick={handleNotifications}>
                  //   Allow  <FaBell size={20} />
                  // </MenuItem>,
                  <MenuItem key="logout" onClick={handleLogout}>
                    Logout
                  </MenuItem>,
                ].filter(Boolean)
              : [
                  <MenuItem key="login-signup" onClick={handleLoginSignup}>
                    Please Login/Signup
                  </MenuItem>,
                ]}
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;



