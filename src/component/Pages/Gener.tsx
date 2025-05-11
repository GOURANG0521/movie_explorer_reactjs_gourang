import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMoviesByGenrePage } from '../../utils/User';
import { Box, Typography, CircularProgress, Button, Pagination } from '@mui/material';
import MovieItem from '../CrasouleSample/MovieItem';
import Header from '../Common/Header';

interface Movie {
  id: number;
  title: string;
  genre: string;
  description: string;
  director: string;
  duration: number;
  main_lead: string;
  poster_url: string;
  banner_url: string;
  premium: boolean;
  rating: number;
  release_year: number;
  streaming_platform: string;
}

const Gener: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const moviesPerPage = 10; 
  const navigate = useNavigate();

  
  const genre = searchParams.get('genre') || 'Action';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const { movies, total } = await getMoviesByGenrePage(genre, currentPage, moviesPerPage);
        setMovies(movies);
        setTotalPages(total);
      } catch (error) {
        console.error(`Error fetching ${genre} movies on page ${currentPage}:`, error);
        setMovies([]);
        setTotalPages(0);
      }
      setLoading(false);
    };
    fetchMovies();
    window.scroll(0,0);
  }, [genre, currentPage]);

  const handleGenreChange = (newGenre: string) => {
    setSearchParams({ genre: newGenre, page: '1' }); 
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setSearchParams({ genre, page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  return (
    <div>
      <Header />
      <Box className="p-6 bg-black text-white min-h-screen">
        <Box className="mb-10 flex justify-start gap-4">
          <Button
            variant="contained"
            sx={{
              bgcolor: genre === 'Action' ? '#facc15' : '#424242',
              color: '#fff',
              '&:hover': { bgcolor: '#facc15' },
              textTransform: 'none',
              px: { xs: 2, sm: 3 },
              py: 1,
              fontSize: { xs: '0.8rem', sm: '1rem' },
              borderRadius: 5,
            }}
            onClick={() => handleGenreChange('Action')}
          >
            Action
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: genre === 'Thriller' ? '#facc15' : '#424242',
              color: '#fff',
              '&:hover': { bgcolor: '#facc15' },
              textTransform: 'none',
              px: { xs: 2, sm: 3 },
              py: 1,
              fontSize: { xs: '0.8rem', sm: '1rem' },
              borderRadius: 5,
            }}
            onClick={() => handleGenreChange('Thriller')}
          >
            Thriller
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: genre === 'Comedy' ? '#facc15' : '#424242',
              color: '#fff',
              '&:hover': { bgcolor: '#facc15' },
              textTransform: 'none',
              px: { xs: 2, sm: 3 },
              py: 1,
              fontSize: { xs: '0.8rem', sm: '1rem' },
              borderRadius: 5,
            }}
            onClick={() => handleGenreChange('Comedy')}
          >
            Comedy
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: genre === 'Romance' ? '#facc15' : '#424242',
              color: '#fff',
              '&:hover': { bgcolor: '#facc15' },
              textTransform: 'none',
              px: { xs: 2, sm: 3 },
              py: 1,
              fontSize: { xs: '0.8rem', sm: '1rem' },
              borderRadius: 5,
            }}
            onClick={() => handleGenreChange('Romance')}
          >
            Romance
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: genre === 'Si-Fi' ? '#facc15' : '#424242',
              color: '#fff',
              '&:hover': { bgcolor: '#facc15' },
              textTransform: 'none',
              px: { xs: 2, sm: 3 },
              py: 1,
              fontSize: { xs: '0.8rem', sm: '1rem' },
              borderRadius: 5,
            }}
            onClick={() => handleGenreChange('Si-Fi')}
          >
            Sci-Fi
          </Button>
        </Box>

        {loading ? (
          <Box className="flex flex-col justify-center items-center mt-52">
            <CircularProgress color="inherit" />
            <Typography className="mt-4 text-white">Loading...</Typography>
          </Box>
        ) : (
          <>
            <Box className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4">
              {movies.length > 0 ? (
                movies.map((movie: Movie) => (
                  <MovieItem
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    desc={movie.description}
                    image={movie.poster_url}
                    rating={movie.rating}
                    year={movie.release_year}
                    duration={`${movie.duration} min`}
                    streaming_platform={movie.streaming_platform}
                    premium={movie.premium}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  />
                ))
              ) : (
                <Typography variant="body1" className="text-center col-span-full">
                  No movies found for genre: {genre}
                </Typography>
              )}
            </Box>

            {totalPages > 0 && (
              <Box className="flex flex-col items-center mt-8">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#fff',
                      fontSize: '1.1rem',
                      '&.Mui-selected': {
                        bgcolor: '#facc15',
                        color: '#000',
                      },
                      '&:hover': {
                        bgcolor: '#facc15',
                        color: '#000',
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </div>
  );
};

export default Gener;