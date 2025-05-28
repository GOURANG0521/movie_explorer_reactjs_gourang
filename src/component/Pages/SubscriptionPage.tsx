import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Check,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';
import Footer from '../Common/Footer';
import { createSubscription } from '../../utils/User'; 


interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  duration: string;
  popular?: boolean;
}



export default function SubscriptionPage() {
  window.scrollTo(0, 0); 
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: '1_day',
      name: '1 Day Pass',
      price: '₹199',
      features: [
        'Full access to all movies',
        'Unlimited streaming',
        'HD quality',
        'No ads',
      ],
      duration: '24 hours of premium access',
    },
    {
      id: '1_month',
      name: '7 Day Pass',
      price: '₹799',
      features: [
        'Full access to all movies',
        'Unlimited streaming',
        'HD & 4K quality',
        'Priority customer support',
      ],
      duration: '7 days of premium access',
      popular: true,
    },
    {
      id: '3_months',
      name: '1 Month Premium',
      price: '₹1999',
      features: [
        'Full access to all movies',
        'Early access to new releases',
        'Offline downloads',
        'Priority customer support',
      ],
      duration: '30 days of premium access',
    },
  ];

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setError('Please select a plan.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const checkoutUrl = await createSubscription(selectedPlan);
      if (checkoutUrl) {
        console.log('Redirecting to:', checkoutUrl);
        window.location.href = checkoutUrl;
      } else {
        throw new Error('No checkout URL returned from server.');
      }
    } catch (err: any) {
      console.error('Error in handleSubscribe:', err);
      setError(err.message || 'Failed to initiate subscription. Please try again.');
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <Box sx={{ bgcolor: 'rgb(20, 20, 30)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 'sm',
              width: '100%',
              textAlign: 'center',
              bgcolor: 'rgba(20, 20, 20, 0.9)',
              color: '#fff',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Box sx={{ width: 64, height: 64, bgcolor: 'success.light', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
              <CheckCircle color="success" sx={{ fontSize: 36 }} />
            </Box>
            <Typography variant="h4" component="h2" gutterBottom>
              Subscription Activated!
            </Typography>
            <Typography variant="body1" color="rgba(255,255,255,0.7)" gutterBottom sx={{ mb: 3 }}>
              Thank you for subscribing to Movie Explorer. Your {plans.find((p) => p.id === selectedPlan)?.name} (${plans.find((p) => p.id === selectedPlan)?.price}) has been activated.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={() => (window.location.href = '/')}
              sx={{ bgcolor: '#E50914', '&:hover': { bgcolor: '#c7000d' } }}
            >
              Start Exploring Movies
            </Button>
          </Paper>
        </Box>
        <Footer />
      </Box>
    );
  }

  
  return (
    <Box sx={{ bgcolor: 'rgb(20, 20, 30)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom sx={{ color: '#fff' }}>
              Choose Your Movie Explorer Plan
            </Typography>
            <Typography variant="h6" color="rgba(255,255,255,0.7)">
              Unlock premium content with a subscription that fits your schedule
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mb: 6, gap: 4, '@media (max-width: 900px)': { flexDirection: 'column', alignItems: 'center' } }}>
            {plans.map((plan) => (
              <Card
                key={plan.id}
                elevation={selectedPlan === plan.id ? 8 : 3}
                sx={{
                  position: 'relative',
                  width: { xs: '100%', md: 'calc(33.33% - 32px)' },
                  maxWidth: '400px',
                  transition: 'all 0.3s',
                  transform: selectedPlan === plan.id ? 'scale(1.05)' : 'scale(1)',
                  border: selectedPlan === plan.id ? 2 : 0,
                  borderColor: 'primary.main',
                  bgcolor: '#fff',
                  color: '#000',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                {plan.popular && (
                  <Chip
                    label="MOST POPULAR"
                    color="warning"
                    size="small"
                    sx={{ position: 'absolute', top: 0, right: 0, borderRadius: '0 4px 0 4px', fontWeight: 'bold' }}
                  />
                )}
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                    {plan.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {plan.duration}
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" sx={{ my: 2 }}>
                    {plan.price}
                  </Typography>
                  <List dense sx={{ mb: 2 }}>
                    {plan.features.map((feature, index) => (
                      <ListItem key={index} disableGutters>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <Check color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant={selectedPlan === plan.id ? 'contained' : 'outlined'}
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={() => setSelectedPlan(plan.id)}
                    sx={{
                      color: selectedPlan === plan.id ? '#fff' : '#000',
                      borderColor: '#00b7bf',
                      bgcolor: selectedPlan === plan.id ? '#E50914' : 'transparent',
                      '&:hover': { bgcolor: selectedPlan === plan.id ? '#c7000d' : 'rgba(0, 183, 191, 0.1)', borderColor: '#00b7bf' },
                    }}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>

          {selectedPlan && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  width: '100%',
                  maxWidth: 'md',
                  bgcolor: 'rgba(20, 20, 20, 0.9)',
                  color: '#fff',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <Typography variant="h4" component="h2" gutterBottom>
                  Confirm Your Subscription
                </Typography>
                <Typography variant="body1" color="rgba(255,255,255,0.7)" gutterBottom sx={{ mb: 3 }}>
                  You have selected the {plans.find((p) => p.id === selectedPlan)?.name} for {plans.find((p) => p.id === selectedPlan)?.price}.
                </Typography>
                {error && (
                  <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isProcessing}
                  onClick={handleSubscribe}
                  sx={{ py: 1.5, bgcolor: '#E50914', '&:hover': { bgcolor: '#c7000d' } }}
                >
                  {isProcessing ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                      Processing...
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      Subscribe Now <ArrowForward sx={{ ml: 1 }} />
                    </Box>
                  )}
                </Button>
                <Typography variant="body2" color="rgba(255,255,255,0.7)" align="center" sx={{ mt: 2 }}>
                  You can cancel your subscription at any time from your account settings
                </Typography>
              </Paper>
            </Box>
          )}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
