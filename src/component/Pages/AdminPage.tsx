import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  InputLabel,
  FormControl,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createMovie, updateMovie } from "../../utils/User";
import axios from "axios";

interface MovieFormData {
  title: string;
  genre: string;
  releaseYear: string;
  director: string;
  duration: string;
  description: string;
  mainLead: string;
  streamingPlatform: string;
  rating: string;
  poster: File | null;
  banner: File | null;
  isPremium: boolean;
}

interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year: string;
  director: string;
  duration: string;
  description: string;
  main_lead: string;
  streaming_platform: string;
  rating: string;
  premium: boolean;
  poster?: string;
  banner?: string;
}

const getMovieById = async (id: number): Promise<Movie | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    const response = await axios.get(`https://movie-explorer-ror-abhinav.onrender.com/api/v1/movies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      timeout: 10000,
    });

    console.log("API response:", response.data);

    const movieData = response.data.movie || response.data.data || response.data;
    if (!movieData || typeof movieData !== "object") {
      throw new Error("Movie data not found in response");
    }

    return movieData as Movie;
  } catch (error: any) {
    console.error("Error fetching movie:", error.message);
    return null;
  }
};

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<MovieFormData>({
    title: "",
    genre: "",
    releaseYear: "",
    director: "",
    duration: "",
    description: "",
    mainLead: "",
    streamingPlatform: "",
    rating: "",
    poster: null,
    banner: null,
    isPremium: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Please sign in to add or edit a movie.");
      navigate("/");
      return;
    }

    if (isEditMode) {
      const fetchMovie = async () => {
        const movie = await getMovieById(Number(id));
        if (movie) {
          setFormData({
            title: movie.title || "",
            genre: movie.genre || "",
            releaseYear: movie.release_year || "",
            director: movie.director || "",
            duration: movie.duration || "",
            description: movie.description || "",
            mainLead: movie.main_lead || "",
            streamingPlatform: movie.streaming_platform || "",
            rating: movie.rating || "",
            poster: null,
            banner: null,
            isPremium: movie.premium || false,
          });
        } else {
          console.error("Failed to fetch movie data for ID:", id);
          navigate("/allmovies");
        }
      };
      fetchMovie();
    }
  }, [navigate, id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isPremium: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let movie;
      if (isEditMode) {
        movie = await updateMovie(Number(id), formData);
        if (movie) {
          toast.success("Movie updated successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
          });
        }
      } else {
        movie = await createMovie(formData);
        if (movie) {
          toast.success("Movie created successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
          });
        }
      }
      if (movie) {
        navigate("/gen");
      }
    } catch (error) {
      console.error("Error saving movie:", error);
      toast.error("Failed to save movie. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  const handleCancel = () => {
    navigate("/home");
  };

  return (
    <Box
      sx={{
        bgcolor: "#181818",
        color: "#fff",
        p: 3,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ maxWidth: 800, width: "100%" }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
        >
          {isEditMode ? "Edit Movie" : "New Movie"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00b7bf" },
                "&:hover fieldset": { borderColor: "#E50914" },
                "&.Mui-focused fieldset": { borderColor: "#facc15" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            required
          />
          <TextField
            fullWidth
            label="Genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00b7bf" },
                "&:hover fieldset": { borderColor: "#E50914" },
                "&.Mui-focused fieldset": { borderColor: "#facc15" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            required
          />
          <TextField
            fullWidth
            label="Release Year"
            name="releaseYear"
            value={formData.releaseYear}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            type="number"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00b7bf" },
                "&:hover fieldset": { borderColor: "#E50914" },
                "&.Mui-focused fieldset": { borderColor: "#facc15" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            required
          />
          <TextField
            fullWidth
            label="Director"
            name="director"
            value={formData.director}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00b7bf" },
                "&:hover fieldset": { borderColor: "#E50914" },
                "&.Mui-focused fieldset": { borderColor: "#facc15" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            required
          />
          <TextField
            fullWidth
            label="Duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            placeholder="e.g., 120"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00b7bf" },
                "&:hover fieldset": { borderColor: "#E50914" },
                "&.Mui-focused fieldset": { borderColor: "#facc15" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00b7bf" },
                "&:hover fieldset": { borderColor: "#E50914" },
                "&.Mui-focused fieldset": { borderColor: "#facc15" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            required
          />
          <TextField
            fullWidth
            label="Main Lead"
            name="mainLead"
            value={formData.mainLead}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00b7bf" },
                "&:hover fieldset": { borderColor: "#E50914" },
                "&.Mui-focused fieldset": { borderColor: "#facc15" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            required
          />
          <TextField
            fullWidth
            label="Streaming Platform"
            name="streamingPlatform"
            value={formData.streamingPlatform}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00b7bf" },
                "&:hover fieldset": { borderColor: "#E50914" },
                "&.Mui-focused fieldset": { borderColor: "#facc15" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            required
          />
          <TextField
            fullWidth
            label="Rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            variant="outlined"
            margin="normal"
            placeholder="e.g., 8.5"
            type="number"
            inputProps={{ step: "0.1", min: "0", max: "10" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00b7bf" },
                "&:hover fieldset": { borderColor: "#E50914" },
                "&.Mui-focused fieldset": { borderColor: "#facc15" },
              },
              "& .MuiInputLabel-root": { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isPremium}
                onChange={handleCheckboxChange}
                sx={{
                  color: "#00b7bf",
                  "&.Mui-checked": { color: "#facc15" },
                }}
              />
            }
            label="Premium"
            sx={{ color: "#fff", my: 1 }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel
              sx={{
                color: "#fff",
                "&.Mui-focused": { color: "#facc15" },
              }}
              shrink
            >
              Poster
            </InputLabel>
            <Button
              variant="outlined"
              component="label"
              sx={{
                color: "#fff",
                borderColor: "#00b7bf",
                "&:hover": { borderColor: "#E50914" },
                mt: 2,
                textTransform: "none",
              }}
            >
              {formData.poster ? formData.poster.name : "Choose File"}
              <input
                type="file"
                name="poster"
                hidden
                onChange={handleFileChange}
                accept="image/*"
              />
            </Button>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel
              sx={{
                color: "#fff",
                "&.Mui-focused": { color: "#facc15" },
              }}
              shrink
            >
              Banner
            </InputLabel>
            <Button
              variant="outlined"
              component="label"
              sx={{
                color: "#fff",
                borderColor: "#00b7bf",
                "&:hover": { borderColor: "#E50914" },
                mt: 2,
                textTransform: "none",
              }}
            >
              {formData.banner ? formData.banner.name : "Choose File"}
              <input
                type="file"
                name="banner"
                hidden
                onChange={handleFileChange}
                accept="image/*"
              />
            </Button>
          </FormControl>
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#E50914",
                color: "#181818",
                fontWeight: "bold",
                textTransform: "none",
                px: 3,
                py: 1,
                "&:hover": { bgcolor: "#e6c200" },
              }}
            >
              {isEditMode ? "Update" : "Create"}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{
                color: "#fff",
                borderColor: "#00b7bf",
                fontWeight: "bold",
                textTransform: "none",
                px: 3,
                py: 1,
                "&:hover": { borderColor: "#E50914" },
              }}
            >
              Cancel
            </Button>
          </Box>
        </form>
        <ToastContainer />
      </Box>
    </Box>
  );
};

export default AdminPage;
