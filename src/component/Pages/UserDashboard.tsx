import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
} from '@mui/material';
import {
  Person,
  Logout,
  Email,
  Phone,
  Shield,
  ChevronRight,
  Error,
  Movie,
  CardMembership,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import img from '../../assets/Images/userImage.jpg';
import { fetchCurrentUser, User, toggleNotifications, signOut } from '../../utils/User';

const UserDashboard = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [planType, setPlanType] = useState<string>('Unknown');
  const [imageError, setImageError] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await fetchCurrentUser();
        setUserData(data);
        setLoading(false);
      } catch (err: unknown) {
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    const loadPlanType = () => {
      const storedPlanType = localStorage.getItem('plan type');
      if (storedPlanType) {
        setPlanType(storedPlanType);
      } else {
        setPlanType('Unknown');
      }
    };

    loadUserData();
    loadPlanType();
  }, []);

  const handleToggleNotifications = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked;
    try {
      await toggleNotifications();
      setNotificationsEnabled(enabled);
    } catch (err: unknown) {
      setError('Failed to toggle notifications');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('error while logout', err);
    }
  };

  const handleAddMovieClick = () => {
    navigate('/admin');
  };

  const handleUpdateMovieClick = () => {
    navigate('/allmovies');
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: '#000000' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#FFD700' }} />
          <Typography sx={{ mt: 2, color: '#FFFFFF' }}>Loading user data...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: '#000000' }}>
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#000000' }}>
          <Error sx={{ fontSize: 48, color: '#FF4444', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1, color: '#FFFFFF' }}>Error Loading Data</Typography>
          <Typography sx={{ mb: 2, color: '#B0B0B0' }}>{error}</Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: '#FFD700', color: '#FFFFFF', '&:hover': { bgcolor: '#D4AF37' } }}
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: '#000000' }}>
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#000000' }}>
          <Typography variant="h6" sx={{ mb: 1, color: '#FFFFFF' }}>No User Data Available</Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: '#FFD700', color: '#FFFFFF', '&:hover': { bgcolor: '#D4AF37' } }}
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#000000' }}>
      <Paper sx={{ bgcolor: '#000000', boxShadow: 1 }}>
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            px: { xs: 2, sm: 3, lg: 4 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 64,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FFD700' }}>
            Admin Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton sx={{ bgcolor: '#1E1E1E', color: '#FFD700' }} onClick={handleSignOut}>
              <Logout fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>
        <Box sx={{ display: { md: 'flex' }, gap: 3 }}>
          {/* Sidebar */}
          <Paper sx={{ flex: { md: '0 0 33%' }, p: 3, mb: { xs: 3, md: 0 }, bgcolor: '#000000' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar
                src={img}
                sx={{
                  width: 128,
                  height: 128,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: '#1E1E1E',
                  border: '2px solid',
                  borderColor: '#FFD700',
                  objectFit: 'cover',
                }}
                onError={handleImageError}
              >
                {imageError && <Person sx={{ fontSize: 64, color: '#FFD700' }} />}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>
                {userData.name}
              </Typography>
              <Typography sx={{ color: '#FFD700', textTransform: 'capitalize' }}>
                {userData.role}
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Email sx={{ color: '#FFD700' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={userData.email}
                  primaryTypographyProps={{ color: '#FFFFFF' }}
                  secondaryTypographyProps={{ color: '#FFFFFF' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone sx={{ color: '#FFD700' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Phone"
                  secondary={userData.mobile_number}
                  primaryTypographyProps={{ color: '#FFFFFF' }}
                  secondaryTypographyProps={{ color: '#FFFFFF' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Shield sx={{ color: '#FFD700' }} />
                </ListItemIcon>
                <ListItemText
                  primary="User ID"
                  secondary={`${userData.id}`}
                  primaryTypographyProps={{ color: '#FFFFFF' }}
                  secondaryTypographyProps={{ color: '#FFFFFF' }}
                />
              </ListItem>
            </List>
            <Divider sx={{ my: 2, bgcolor: '#B0B0B0' }} />
          </Paper>

          <Box sx={{ flex: { md: '0 0 67%' } }}>
            <Paper sx={{ bgcolor: '#000000', mb: 3 }}>
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  bgcolor: '#1E1E1E',
                  borderBottom: '1px solid',
                  borderColor: '#B0B0B0',
                }}
              >
                <Typography variant="h6" sx={{ color: '#FFFFFF' }}>Quick Actions</Typography>
              </Box>
              <List>
                {userData.role === 'supervisor' && (
                  <Box>
                    <Box
                      component="button"
                      onClick={handleAddMovieClick}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        px: 2,
                        py: 1.5,
                        bgcolor: '#000000',
                        border: 'none',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#1E1E1E' },
                      }}
                    >
                      <Box sx={{ bgcolor: '#1E1E1E', p: 1, borderRadius: 1, mr: 2, color: '#FFD700' }}>
                        <Movie sx={{ color: '#FFD700' }} />
                      </Box>
                      <Typography sx={{ flexGrow: 1, color: '#FFFFFF', textAlign: 'left' }}>
                        Add New Movie
                      </Typography>
                      <ChevronRight sx={{ color: '#FFD700' }} />
                    </Box>

                    <Box
                      component="button"
                      onClick={handleUpdateMovieClick}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        px: 2,
                        py: 1.5,
                        bgcolor: '#000000',
                        border: 'none',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#1E1E1E' },
                      }}
                    >
                      <Box sx={{ bgcolor: '#1E1E1E', p: 1, borderRadius: 1, mr: 2, color: '#FFD700' }}>
                        <Movie sx={{ color: '#FFD700' }} />
                      </Box>
                      <Typography sx={{ flexGrow: 1, color: '#FFFFFF', textAlign: 'left' }}>
                        Update Movie
                      </Typography>
                      <ChevronRight sx={{ color: '#FFD700' }} />
                    </Box>
                  </Box>
                )}
                <ListItem sx={{ '&:hover': { bgcolor: '#1E1E1E' } }}>
                  <ListItemIcon sx={{ bgcolor: '#1E1E1E', p: 1, borderRadius: 1, mr: 2, color: '#FFD700' }}>
                    <Email sx={{ color: '#FFD700' }} />
                  </ListItemIcon>
                  <ListItemText primary="Notification Preferences" primaryTypographyProps={{ color: '#FFFFFF' }} />
                  <Switch
                    checked={notificationsEnabled}
                    onChange={handleToggleNotifications}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#FFD700',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#FFD700',
                      },
                      '& .MuiSwitch-switchBase': {
                        color: '#B0B0B0',
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: '#B0B0B0',
                      },
                    }}
                  />
                </ListItem>
                <ListItem sx={{ '&:hover': { bgcolor: '#1E1E1E' } }}>
                  <ListItemIcon sx={{ bgcolor: '#1E1E1E', p: 1, borderRadius: 1, mr: 2, color: '#FFD700' }}>
                    <CardMembership sx={{ color: '#FFD700' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Plan Type: ${planType}`}
                    primaryTypographyProps={{ color: '#FFFFFF' }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserDashboard;
