import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMoviesByGenrePage, searchMoviesByTitle } from '../../utils/User';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Pagination,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search } from '@mui/icons-material';
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
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const moviesPerPage = 10;
  const navigate = useNavigate();

  const genre = searchParams.get('genre') || 'Action';
  const searchQuery = searchParams.get('query') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        if (searchQuery) {
          const { movies } = await searchMoviesByTitle(searchQuery);
          setAllMovies(movies);
          const start = (currentPage - 1) * moviesPerPage;
          const paginatedMovies = movies.slice(start, start + moviesPerPage);
          setMovies(paginatedMovies);
          setTotalPages(Math.ceil(movies.length / moviesPerPage));
        } else {
          const { movies, total } = await getMoviesByGenrePage(
            genre === 'all' ? '' : genre,
            currentPage,
            moviesPerPage
          );
          setAllMovies(movies);
          setMovies(movies);
          setTotalPages(total);
        }
      } catch (error) {
        console.error(`Error fetching movies for genre "${genre}" with query "${searchQuery}" on page ${currentPage}:`, error);
        setAllMovies([]);
        setMovies([]);
        setTotalPages(0);
      }
      setLoading(false);
    };
    fetchMovies();
    window.scrollTo(0, 0);
  }, [genre, searchQuery, currentPage]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchParams({ genre, query, page: '1' });
  };

  const handleGenreChange = (newGenre: string) => {
    setSearchParams({ genre: newGenre, query: searchQuery, page: '1' });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setSearchParams({ genre, query: searchQuery, page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <Header />
      <Box className="p-6 bg-black text-white min-h-screen">
        <Box className="mb-6">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: { xs: 'flex-start', sm: 'space-between' },
              gap: { xs: 2, sm: 0 },
              mb: 4,
            }}
          >
            {/* Genre Buttons */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant="contained"
                sx={{
                  bgcolor: genre === 'all' ? '#facc15' : '#424242',
                  color: '#fff',
                  '&:hover': { bgcolor: '#facc15' },
                  textTransform: 'none',
                  px: { xs: 0.2, sm: 0.3 },
                  py: 1,
                  fontSize: { xs: '0.8rem', sm: '1rem' },
                  borderRadius: 5,
                }}
                onClick={() => handleGenreChange('all')}
              >
                All Movies
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: genre === 'Action' ? '#facc15' : '#424242',
                  color: '#fff',
                  '&:hover': { bgcolor: '#facc15' },
                  textTransform: 'none',
                  px: { xs: 0.2, sm: 0.3 },
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
                  px: { xs: 0.2, sm: 0.3 },
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
                  px: { xs: 0.2, sm: 0.3 },
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
                  bgcolor: genre === 'Si-Fi' ? '#facc15' : '#424242',
                  color: '#fff',
                  '&:hover': { bgcolor: '#facc15' },
                  textTransform: 'none',
                  px: { xs: 0.2, sm: 0.3 },
                  py: 1,
                  fontSize: { xs: '0.8rem', sm: '1rem' },
                  borderRadius: 5,
                }}
                onClick={() => handleGenreChange('Si-Fi')}
              >
                Sci-Fi
              </Button>
            </Box>

            {/* Search Bar */}
            <TextField
              placeholder="Search movies..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                width: { xs: '100%', sm: '300px' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#facc15' },
                  '&:hover fieldset': { borderColor: '#facc15' },
                  '&.Mui-focused fieldset': { borderColor: '#facc15' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#facc15', fontSize: '20px' }} />
                  </InputAdornment>
                ),
                sx: {
                  color: '#fff',
                  bgcolor: '#1e1e1e',
                  borderRadius: '5px',
                  fontSize: '0.9rem',
                  height: '40px',
                  '& .MuiInputBase-input::placeholder': {
                    color: '#b0b0b0',
                    fontSize: '0.9rem',
                  },
                },
              }}
            />
          </Box>
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
                  {searchQuery
                    ? `No movies found for "${searchQuery}"`
                    : `No movies found for ${genre === 'all' ? 'All Movies' : `genre: ${genre}`}`}
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