import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import * as fuzzball from 'fuzzball';
import debounce from 'lodash.debounce';
import MovieItem from '../CrasouleSample/MovieItem';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const moviesPerPage = 10;
  const navigate = useNavigate();
  const textFieldRef = useRef<HTMLInputElement>(null);

  const genre = searchParams.get('genre') || 'Action';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const { movies } = await searchMoviesByTitle(query);

        const titles = movies.map((movie: Movie) => movie.title);

        const results = fuzzball.extract(query, titles, {
          scorer: fuzzball.partial_ratio,
          limit: 5,
          cutoff: 30, 
          processor: (title: string) => title.toLowerCase(),
        });

        const suggestionTitles = results.map(([title]) => title);

        setSuggestions(suggestionTitles);
        setShowSuggestions(suggestionTitles.length > 0);
      } catch (error) {
        console.error(`Error fetching suggestions for query "${query}":`, error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300), 
    []
  );

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

  useEffect(() => {
    fetchSuggestions(searchQuery);
  }, [searchQuery, fetchSuggestions]);

  const handleDeleteMovie = (id: number) => {
    const updatedAllMovies = allMovies.filter((movie) => movie.id !== id);
    setAllMovies(updatedAllMovies);
    const updatedMovies = movies.filter((movie) => movie.id !== id);
    setMovies(updatedMovies);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setSearchParams({ genre, page: '1' });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSearchParams({ genre, page: '1' });
    setShowSuggestions(false);
  };

  const handleGenreChange = (newGenre: string) => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchParams({ genre: newGenre, page: '1' });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setSearchParams({ genre, page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTextFieldBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div>
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

            <Box sx={{ position: 'relative', width: { xs: '100%', sm: '300px' } }}>
              <TextField
                placeholder="Search movies..."
                value={searchQuery}
                onChange={handleSearchChange}
                onBlur={handleTextFieldBlur}
                inputRef={textFieldRef}
                sx={{
                  width: '100%',
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
              {showSuggestions && suggestions.length > 0 && (
                <Paper
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    bgcolor: '#1e1e1e',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    borderRadius: '5px',
                    mt: 1,
                  }}
                >
                  <List>
                    {suggestions.map((suggestion) => (
                      <ListItem
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { bgcolor: '#facc15', color: '#000' },
                          color: '#fff',
                        }}
                      >
                        <ListItemText primary={suggestion} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>
          </Box>
        </Box>

        {loading ? (
          <Box className="flex flex-col justify-center items-center mt-52">
            <CircularProgress color="inherit" />
            <Typography className="mt-4 text-white">Loading...</Typography>
          </Box>
        ) : (
          <>
            <Box className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-5 md:gap-4 justify-items-center">
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
                    onDelete={handleDeleteMovie}
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