import { Component } from 'react';
import { Button, Typography, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home'; 
// import backgroundImage from '../../assets/Images/avengers.jpg'; 

class LandingPage extends Component {
  render() {

    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundImage: `url(${backgroundImage})`, 
        backgroundColor:'black',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          color: 'white',
          textAlign: 'center',
          padding: 2,
        }}
      >
        
        <Typography
          variant="h4"
          sx={{
            color: '#00FF00', 
            fontWeight: 'bold',
            position: 'absolute',
            top: 20,
            left: 20,
          }}
        >
          FILMBIT
        </Typography>

        
        <Typography
          variant="h1"
          sx={{
            color: '#00FFFF', 
            fontWeight: 'bold',
            fontSize: { xs: '3rem', sm: '3rem', md: '4rem' }, 
            marginTop:15,
          }}
        >
          Top 50+ OTT Apps and Sites
        </Typography>

        
        <Typography
          variant="h6"
          sx={{
            color: '#00FFFF', 
            marginBottom: 4,
            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
          }}
        >
          Watch thousands of tv series and movies with original audio and HD video quality.
        </Typography>

        
        <Button
  variant="contained"
  startIcon={
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <HomeIcon sx={{ fontSize: '1.9rem !important' }} /> 
    </Box>
  }
  sx={{
    backgroundColor: '#00FF00', 
    color: 'white', 
    fontWeight: 'bold',
    height: '100px',
    width: '250px',
    padding: '12px 30px 20px 40px', 
    borderRadius: '10px', 
    marginBottom: 4,
    marginTop: 15,
    textTransform: 'uppercase', 
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', 
    fontSize: '1.3rem', 
    '&:hover': {
      backgroundColor: '#00CC00', 
      boxShadow: '0 0 15px rgba(0, 0, 0, 0.7)', 
    },
  }}
>
Go to Home 
</Button>

      </Box>
    );
  }
}

export default LandingPage;