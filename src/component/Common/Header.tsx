import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBell } from 'react-icons/fa';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Popover,
  Box,
} from '@mui/material';
import { signOut, getSubscriptionStatus, toggleNotifications } from '../../utils/User';

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [bellAnchorEl, setBellAnchorEl] = useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
  const [role, setRole] = useState<string>('user');
  const [plan, setPlan] = useState<string>('basic');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const userRef = useRef<HTMLButtonElement>(null);
  const open = Boolean(anchorEl);
  const openBellPopover = Boolean(bellAnchorEl);
  const openUserPopover = Boolean(userAnchorEl);
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

      const timer = setTimeout(() => {
        if (isLoggedIn) {
          setBellAnchorEl(bellRef.current);
        } else {
          setUserAnchorEl(userRef.current);
        }
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setIsLoggedIn(false);
      const timer = setTimeout(() => {
        setUserAnchorEl(userRef.current);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

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

  const handleBellPopoverClose = () => {
    setBellAnchorEl(null);
  };

  const handleUserPopoverClose = () => {
    setUserAnchorEl(null);
  };

  const handleEnableNotifications = async () => {
    try {
      await toggleNotifications();
      setBellAnchorEl(null);
    } catch (error) {
      console.error('Error enabling notifications:', error);
    }
  };

  const handleLoginSignup = () => {
    navigate('/login');
    handleClose();
    handleUserPopoverClose();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#000000' }}>
      <Toolbar className="px-3 sm:px-6">
        <div className="flex-shrink-0">
          <Button onClick={handleHomeRedirect} sx={{ padding: 0 }}>
            <Typography
              variant="h6"
              className="text-lg sm:text-2xl font-bold text-yellow-400"
              sx={{ fontFamily: 'Roboto, sans-serif' }}
            >
              <span className="text-black bg-yellow-400 px-2 rounded">FILM</span> BIT
            </Typography>
          </Button>
        </div>

        <div className="flex-grow" />

        <div className="flex items-center space-x-2 sm:space-x-4">
          <IconButton
            ref={bellRef}
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
            ref={userRef}
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
                fontFamily: 'Roboto, sans-serif',
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

      <Popover
        open={openBellPopover}
        anchorEl={bellAnchorEl}
        onClose={handleBellPopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            maxWidth: '300px',
            backgroundColor: '#1f2937',
            color: 'white',
            borderRadius: '12px',
            padding: '12px',
            position: 'relative',
            overflow: 'visible',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(#1f2937, #1f2937), linear-gradient(45deg, #facc15, #f59e0b)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-8px',
              right: '8px',
              border: '8px solid transparent',
              borderBottomColor: '#facc15',
            },
            fontFamily: 'Roboto, sans-serif',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: '600', fontSize: '1.1rem', lineHeight: '1.4' }}
          >
            Receive Notifications?
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Stay updated with the latest alerts and updates by enabling notifications.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button
              onClick={handleBellPopoverClose}
              sx={{
                backgroundColor: '#facc15',
                color: '#000000',
                borderRadius: '20px',
                padding: '6px 16px',
                fontSize: '0.8rem',
                textTransform: 'none',
                transition: 'transform 0.2s',
                '&:hover': {
                  backgroundColor: '#e0b013',
                  transform: 'scale(1.05)',
                },
              }}
            >
              No
            </Button>
            <Button
              onClick={handleEnableNotifications}
              sx={{
                backgroundColor: '#facc15',
                color: '#000000',
                borderRadius: '20px',
                padding: '6px 16px',
                fontSize: '0.8rem',
                textTransform: 'none',
                transition: 'transform 0.2s',
                '&:hover': {
                  backgroundColor: '#e0b013',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Popover>

      <Popover
        open={openUserPopover}
        anchorEl={userAnchorEl}
        onClose={handleUserPopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            maxWidth: '300px',
            backgroundColor: '#1f2937',
            color: 'white',
            borderRadius: '12px',
            padding: '12px',
            position: 'relative',
            overflow: 'visible',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(#1f2937, #1f2937), linear-gradient(45deg, #facc15, #f59e0b)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-8px',
              right: '8px',
              border: '8px solid transparent',
              borderBottomColor: '#facc15',
            },
            fontFamily: 'Roboto, sans-serif',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: '600', fontSize: '1.1rem', lineHeight: '1.4' }}
          >
            Login Required
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Please login to see exclusive content.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button
              onClick={handleUserPopoverClose}
              sx={{
                backgroundColor: '#facc15',
                color: '#000000',
                borderRadius: '20px',
                padding: '6px 16px',
                fontSize: '0.8rem',
                textTransform: 'none',
                transition: 'transform 0.2s',
                '&:hover': {
                  backgroundColor: '#e0b013',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLoginSignup}
              sx={{
                backgroundColor: '#facc15',
                color: '#000000',
                borderRadius: '20px',
                padding: '6px 16px',
                fontSize: '0.8rem',
                textTransform: 'none',
                transition: 'transform 0.2s',
                '&:hover': {
                  backgroundColor: '#e0b013',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Popover>
    </AppBar>
  );
};

export default Header;