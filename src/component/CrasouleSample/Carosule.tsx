import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MovieItem from './MovieItem';
import { fetchMoviesforgener, Episode } from '../../utils/User';

interface CarouselProps {
  title: string;
  genre: 'Action' | 'Thriller' | 'Si-Fi';
}

const Carousel: React.FC<CarouselProps> = ({ title, genre }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [moviesData, setMoviesData] = useState<Episode[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const movies = await fetchMoviesforgener(genre);
        if (movies.length === 0) {
          setError(`No ${genre} movies found`);
        } else {
          setMoviesData(movies);
          setError(null);
        }
      } catch (err) {
        setError(`Failed to load ${genre} movies`);
        console.error(err);
      }
    };

    loadMovies();
  }, [genre]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleMovieClick = (id: number) => {
    navigate(`/movie/${id}`);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'black',
        marginTop: '-1.5rem',
        padding: '1rem',
        position: 'relative',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          color: '#F9FAFB',
          my: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box component="span" sx={{ color: '#FBBF24', fontSize: '1.25rem', mr: 1 }}>
          |
        </Box>
        {title}
        <Box
          sx={{
            color: 'white',
            fontSize: '1.25rem',
            marginLeft: 'auto',
            ':hover': {
              color: 'yellow',
              cursor: 'pointer',
            },
          }}
          role="button"
          tabIndex={0}
          onClick={() => navigate('/gen')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              navigate('/gen');
            }
          }}
        >
          Explore more
        </Box>
      </Typography>
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={scrollLeft}
          aria-label="scroll left"
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
            zIndex: 1,
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <Box
          ref={scrollRef}
          data-testid="carousel-scroll-container"
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 2,
            padding: 1,
            '&::-webkit-scrollbar': {
              height: '8px',
            },
          }}
        >
          {error ? (
            <Typography sx={{ color: 'white' }}>{error}</Typography>
          ) : moviesData.length > 0 ? (
            moviesData.map((item: Episode) => (
              <MovieItem
                key={item.id}
                title={item.title}
                desc={item.desc}
                id={item.id}
                image={item.image}
                rating={item.starRating}
                year={item.year}
                duration={item.duration}
                streaming_platform={item.streaming_platform}
                premium={item.premium}
                onClick={() => handleMovieClick(item.id)}
              />
            ))
          ) : (
            <Box className="flex justify-center items-center w-full h-full">
              <Box className="flex flex-col justify-center items-center">
                <CircularProgress color="primary" />
                <Typography className="mt-4 text-white text-lg font-medium">Loading...</Typography>
              </Box>
            </Box>
          )}
        </Box>

        <IconButton
          onClick={scrollRight}
          aria-label="scroll right"
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
            zIndex: 1,
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Carousel;