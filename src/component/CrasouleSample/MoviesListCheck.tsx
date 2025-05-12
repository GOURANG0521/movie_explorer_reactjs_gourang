import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import { Box, CircularProgress, Typography } from '@mui/material';
import MovieItem from './MovieItem'; 
import { fetchMovies, Episode } from '../../utils/User'; 
import { FaSearch } from 'react-icons/fa';

const MoviesListCheck: React.FC = () => {
  const [movies, setMovies] = useState<Episode[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Episode[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMovies();
        setMovies(data);
        setFilteredMovies(data); 
        setError(null);
      } catch (err: any) {
        setError(err.message || 'No movies found');
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  useEffect(() => {
    const filtered = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMovies(filtered);
  }, [searchQuery, movies]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (loading) {
    return (
      <Box className="flex flex-col justify-center items-center mt-52">
        <CircularProgress color="inherit" />
        <Typography className="mt-4 text-black">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center">
        <p className="text-red-400 text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-black p-4">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Movies List</h1>
        <Box className="mb-6 flex justify-end">
          <div className="mr-2 sm:mr-4 max-w-[150px] sm:max-w-xs">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search movies"
                className="bg-gray-700 text-white placeholder-gray-400 rounded-full py-1 sm:py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full text-xs sm:text-sm"
              />
              <FaSearch
                size={14}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </Box>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-2">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <MovieItem
                key={movie.id}
                id={movie.id}
                title={movie.title}
                desc={movie.desc}
                image={movie.image}
                rating={movie.starRating}
                year={movie.year}
                duration={movie.duration}
                streaming_platform={movie.streaming_platform || 'N/A'}
                premium={movie.premium}
                onClick={() => navigate(`/movie/${movie.id}`)}
              />
            ))
          ) : (
            <Typography variant="body1" className="text-white text-center col-span-full">
              {searchQuery ? `No movies found matching "${searchQuery}"` : 'No movies available'}
            </Typography>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MoviesListCheck;
