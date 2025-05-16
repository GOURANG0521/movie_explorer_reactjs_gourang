import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography,
  Button, 
  Rating, 
  CircularProgress,
  useMediaQuery,
  useTheme,
  Stack,
  Container,
  Paper,
  Chip,
  Fade
} from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import PersonIcon from '@mui/icons-material/Person';
import TvIcon from '@mui/icons-material/Tv';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import { Episode, fetchMovieById } from '../../utils/User';
import Carousel from './Carosule';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const loadMovie = async () => {
      if (!id) {
        setError('No movie ID provided');
        setLoading(false);
        return;
      }

      try {
        const movieData = await fetchMovieById(parseInt(id));
        if (!movieData) {
          setError('Movie not found');
        } else {
          setMovie(movieData);
          setError(null);
          setTimeout(() => setFadeIn(true), 100);
        }
      } catch (err) {
        setError('Failed to load movie details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#030712',
          minHeight: '100vh',
          pt: 10
        }}
      >
        <CircularProgress sx={{ color: '#e50914' }} />
        <Typography sx={{ mt: 2, color: 'white', fontWeight: 'medium' }}>
          Loading movie details...
        </Typography>
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Container maxWidth="lg" sx={{ color: 'white', p: 2 }}>
        <Typography>{error || 'No movie data available'}</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      bgcolor: '#030712',
      color: '#fff',
      width: '100%', 
      minHeight: '100vh',
      overflow: 'auto',
    }}>
      
      <Box 
        sx={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(3, 7, 18, 0.7) 0%, rgba(3, 7, 18, 0.95) 80%, rgba(3, 7, 18, 1) 100%), url(${movie.banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: isMobile ? 'scroll' : 'fixed',
          pt: { xs: 6, sm: 8, md: 10 },
          pb: { xs: 8, sm: 10, md: 12 },
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Fade in={fadeIn} timeout={1000}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'center' : 'flex-start'
              }}
            >
              <Box sx={{ 
                mr: isMobile ? 0 : 5, 
                mb: isMobile ? 4 : 0,
                width: isMobile ? '100%' : 'auto',
                display: 'flex',
                justifyContent: isMobile ? 'center' : 'flex-start'
              }}>
                <Box sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.9)',
                  border: '2px solid rgba(229, 9, 20, 0.3)',
                }}>
                  <img
                    src={movie.image}
                    alt={`${movie.title} Poster`}
                    style={{
                      width: isMobile ? '85%' : 320,
                      maxWidth: '320px',
                      height: 'auto',
                      display: 'block',
                      margin: isMobile ? '0 auto' : 0
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ flex: 1, width: '100%' }}>
                <Typography 
                  variant={isMobile ? 'h4' : 'h1'} 
                  sx={{ 
                    fontWeight: '900', 
                    mb: 2,
                    textAlign: isMobile ? 'center' : 'left',
                    color: '#ffffff',
                    letterSpacing: '-1px',
                    textShadow: '0 3px 6px rgba(0,0,0,0.7)',
                    fontSize: { xs: '2rem', sm: '3rem', md: '4rem' }
                  }}
                >
                  {movie.title}
                </Typography>

                <Stack 
                  direction="row" 
                  spacing={2} 
                  sx={{ 
                    mb: 3, 
                    color: '#e5e7eb',
                    justifyContent: isMobile ? 'center' : 'flex-start',
                    fontSize: '1.1rem'
                  }}
                >
                  <Typography variant="body1">{movie.year}</Typography>
                  <Typography variant="body1">•</Typography>
                  <Typography variant="body1">{movie.duration}</Typography>
                </Stack>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 4,
                  justifyContent: isMobile ? 'center' : 'flex-start'
                }}>
                  <Box sx={{ 
                    background: 'linear-gradient(45deg, #e50914, #f43f5e)', 
                    borderRadius: '6px', 
                    px: 2, 
                    py: 1, 
                    display: 'flex', 
                    alignItems: 'center',
                    mr: 2,
                    boxShadow: '0 4px 12px rgba(229, 9, 20, 0.5)'
                  }}>
                    <StarIcon sx={{ fontSize: 20, mr: 0.5 }} />
                    <Typography fontWeight="bold">{movie.starRating}/10</Typography>
                  </Box>
                  <Rating 
                    value={movie.starRating/2} 
                    precision={0.5} 
                    readOnly 
                    size="medium" 
                    sx={{ color: '#facc15' }}
                  />
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: isMobile ? 'center' : 'flex-start',
                  mb: 4,
                  gap: 2,
                }}>
                  <Chip 
                    label={movie.genre || 'N/A'} 
                    size="medium" 
                    sx={{ 
                      bgcolor: 'rgba(229, 9, 20, 0.2)', 
                      color: '#ffffff',
                      fontWeight: 'medium',
                      border: '1px solid rgba(229, 9, 20, 0.5)',
                      '&:hover': { 
                        bgcolor: 'rgba(229, 9, 20, 0.4)',
                        boxShadow: '0 2px 8px rgba(229, 9, 20, 0.6)'
                      }
                    }} 
                  />
                  <Chip 
                    label={movie.streaming_platform || 'N/A'} 
                    size="medium" 
                    sx={{ 
                      bgcolor: 'rgba(229, 9, 20, 0.2)', 
                      color: '#ffffff',
                      fontWeight: 'medium',
                      border: '1px solid rgba(229, 9, 20, 0.5)',
                      '&:hover': { 
                        bgcolor: 'rgba(229, 9, 20, 0.4)',
                        boxShadow: '0 2px 8px rgba(229, 9, 20, 0.6)'
                      }
                    }} 
                  />
                </Box>

                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 4, 
                    color: '#e5e7eb',
                    textAlign: isMobile ? 'center' : 'left',
                    lineHeight: 1.8,
                    fontSize: '1.15rem',
                    maxWidth: '95%',
                    mx: isMobile ? 'auto' : 0
                  }}
                  data-testid="movie-description"
                >
                  {movie.desc}
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 4, color: '#e5e7eb' }}>
                  <Typography sx={{ textAlign: isMobile ? 'center' : 'left', fontSize: '1.1rem' }}>
                    <strong>Director:</strong> {movie.director || 'N/A'}
                  </Typography>
                  <Typography sx={{ textAlign: isMobile ? 'center' : 'left', fontSize: '1.1rem' }}>
                    <strong>Lead:</strong> {movie.main_lead || 'N/A'}
                  </Typography>
                </Stack>

                <Stack 
                  direction={isMobile ? 'column' : 'row'} 
                  spacing={2} 
                  sx={{ 
                    mb: 4,
                    width: '100%',
                    justifyContent: isMobile ? 'center' : 'flex-start'
                  }}
                >
                  <Button 
                    variant="contained" 
                    startIcon={<PlayArrowIcon />}
                    fullWidth={isMobile}
                    sx={{ 
                      bgcolor: '#e50914', 
                      textTransform: 'none', 
                      px: 4, 
                      py: 1.5,
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(229, 9, 20, 0.5)',
                      maxWidth: isMobile ? '100%' : '200px',
                      '&:hover': {
                        bgcolor: '#b91c1c',
                        boxShadow: '0 6px 16px rgba(229, 9, 20, 0.7)'
                      }
                    }}
                  >
                    Watch Now
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 5 }, pb: 8 }}>
        <Fade in={fadeIn} timeout={1500}>
          <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 6 }}>
              <Box sx={{ width: { xs: '100%', md: 'calc(50% - 16px)' } }}>
                <Paper elevation={0} sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  bgcolor: 'transparent',
                  height: '100%',
                  display: 'flex'
                }}>
                  <Box sx={{
                    bgcolor: '#111827',
                    p: { xs: 2, sm: 3 },
                    borderRadius: 4,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    height: 260
                  }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        mb: 3, 
                        fontWeight: 'bold', 
                        color: '#f3f4f6',
                        textAlign: isMobile ? 'center' : 'left',
                        fontSize: { xs: '1.5rem', sm: '2rem' }
                      }}
                    >
                      Cast & Production
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'row', 
                      flexWrap: 'nowrap', 
                      gap: 2, 
                      flexGrow: 1,
                      justifyContent: isMobile ? 'center' : 'space-between'
                    }}>
                      <Box sx={{ 
                        flex: 1, 
                        minWidth: 100, 
                        maxWidth: 140, 
                        display: 'flex', 
                        justifyContent: 'center' 
                      }}>
                        <Box 
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            p: 2,
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '50%',
                            height: 140,
                            width: 140,
                            border: '1px solid rgba(229, 9, 20, 0.2)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            justifyContent: 'center',
                            mx: 'auto'
                          }}
                        >
                          <Box sx={{
                            bgcolor: 'rgba(229, 9, 20, 0.2)',
                            borderRadius: '50%',
                            p: 1.5,
                            mb: 1
                          }}>
                            <VideocamIcon sx={{ fontSize: 24, color: '#e50914' }} />
                          </Box>
                          <Typography variant="body2" sx={{ mb: 0.5, color: '#9ca3af', fontWeight: 'medium', fontSize: '0.85rem' }}>Director</Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 'medium', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              width: '100%',
                              color: '#f3f4f6',
                              fontSize: '0.9rem'
                            }}
                          >
                            {movie.director || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ 
                        flex: 1, 
                        minWidth: 100, 
                        maxWidth: 140, 
                        display: 'flex', 
                        justifyContent: 'center' 
                      }}>
                        <Box 
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            p: 2,
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '50%',
                            height: 140,
                            width: 140,
                            border: '1px solid rgba(229, 9, 20, 0.2)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            justifyContent: 'center',
                            mx: 'auto'
                          }}
                        >
                          <Box sx={{
                            bgcolor: 'rgba(229, 9, 20, 0.2)',
                            borderRadius: '50%',
                            p: 1.5,
                            mb: 1
                          }}>
                            <PersonIcon sx={{ fontSize: 24, color: '#e50914' }} />
                          </Box>
                          <Typography variant="body2" sx={{ mb: 0.5, color: '#9ca3af', fontWeight: 'medium', fontSize: '0.85rem' }}>Main Lead</Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 'medium', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              width: '100%',
                              color: '#f3f4f6',
                              fontSize: '0.9rem'
                            }}
                          >
                            {movie.main_lead || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ 
                        flex: 1, 
                        minWidth: 100, 
                        maxWidth: 140, 
                        display: 'flex', 
                        justifyContent: 'center' 
                      }}>
                        <Box 
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            p: 2,
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '50%',
                            height: 140,
                            width: 140,
                            border: '1px solid rgba(229, 9, 20, 0.2)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            justifyContent: 'center',
                            mx: 'auto'
                          }}
                        >
                          <Box sx={{
                            bgcolor: 'rgba(229, 9, 20, 0.2)',
                            borderRadius: '50%',
                            p: 1.5,
                            mb: 1
                          }}>
                            <TvIcon sx={{ fontSize: 24, color: '#e50914' }} />
                          </Box>
                          <Typography variant="body2" sx={{ mb: 0.5, color: '#9ca3af', fontWeight: 'medium', fontSize: '0.85rem' }}>Available On</Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 'medium', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              width: '100%',
                              color: '#f3f4f6',
                              fontSize: '0.9rem'
                            }}
                          >
                            {movie.streaming_platform || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Box>

              <Box sx={{ width: { xs: '100%', md: 'calc(50% - 16px)' } }}>
                <Paper elevation={0} sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  bgcolor: 'transparent',
                  display: 'flex'
                }}>
                  <Box sx={{ 
                    bgcolor: '#111827',
                    p: { xs: 2, sm: 3 },
                    borderRadius: 4, 
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    height: 260
                  }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        mb: 3,
                        fontWeight: 'bold',
                        color: '#f3f4f6',
                        textAlign: isMobile ? 'center' : 'left',
                        fontSize: { xs: '1.5rem', sm: '2rem' }
                      }}
                    >
                      Movie Info
                    </Typography>
                    <Stack spacing={1}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#9ca3af', fontWeight: 'medium', fontSize: '0.9rem' }}>
                          RELEASED: {movie.year || 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#9ca3af', fontWeight: 'medium', fontSize: '0.9rem' }}>
                          DURATION: {movie.duration || 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#9ca3af', fontWeight: 'medium', fontSize: '0.9rem' }}>
                          GENRE: {movie.genre || 'N/A'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#9ca3af', fontWeight: 'medium', fontSize: '0.9rem' }}>
                          IMDB RATING: {movie.starRating || 'N/A'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Paper>
              </Box>
            </Box>

            <Paper elevation={0} sx={{
              borderRadius: 10,
              overflow: 'hidden',
              bgcolor: 'transparent',
              mb: 6
            }}>
              <Box sx={{ 
                bgcolor: '#111827', 
                p: { xs: 3, sm: 4 }, 
                borderRadius: 4
              }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    mb: 2,
                    fontWeight: 'bold',
                    color: '#f3f4f6',
                    textAlign: isMobile ? 'center' : 'left',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '1.3rem' }
                  }}
                >
                  About this Movie
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#d1d5db',
                    textAlign: isMobile ? 'center' : 'left',
                    lineHeight: 1.6,
                    fontSize: { xs: '1rem', sm: '1rem', md: '1rem' }
                  }}
                >
                  {movie.desc}
                </Typography>
              </Box>
            </Paper>

            <Paper elevation={0} sx={{
              borderRadius: 10,
              overflow: 'hidden',
              bgcolor: 'transparent',
              mb: 6
            }}>
              <Box sx={{ 
                bgcolor: '#111827', 
                p: { xs: 3, sm: 4 }, 
                borderRadius: 4
              }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    mb: 2,
                    fontWeight: 'bold',
                    color: '#f3f4f6',
                    textAlign: isMobile ? 'center' : 'left',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '1.3rem' }
                  }}
                >
                  Ratings & Reviews
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5,
                    justifyContent: isMobile ? 'center' : 'flex-start'
                  }}
                >
                  <StarIcon sx={{ fontSize: 24, color: '#facc15' }} />
                  <Typography variant="body1" sx={{ color: '#d1d5db', fontSize: { xs: '1rem', sm: '1rem', md: '1rem' } }}>
                    {movie.starRating.toFixed(1)} based on user reviews
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Container>
      <Carousel title="You May Like" genre="Action" />
    </Box>
  );
};

export default MovieDetail;