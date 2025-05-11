import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SliderItem, { Episode } from "./SliderItem";

interface BigSliderProps {
  items?: Episode[];
}

interface BigSliderState {
  currentIndex: number;
  items: Episode[];
  loading: boolean;
  error: string | null;
}


class Slider extends React.Component<BigSliderProps, BigSliderState> {
  private timer: NodeJS.Timeout | null = null;

  constructor(props: BigSliderProps) {
    super(props);
    this.state = {
      currentIndex: 0,
      items: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    fetch("https://movie-explorer-ror-abhinav.onrender.com/api/v1/movies/?genre=Si-Fi")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        return response.json();
      })
      .then((data) => {
        const moviesData = data.movies || [];
        if (!Array.isArray(moviesData) || moviesData.length === 0) {
          throw new Error("No movies found");
        }
        const movies: Episode[] = moviesData
          .filter((movie: any) => movie.id && movie.title && movie.description && movie.banner_url && movie.poster_url)
          .map((movie: any) => ({
            id: movie.id.toString(),
            title: movie.title,
            desc: movie.description,
            banner_url: movie.banner_url,
            poster_url: movie.poster_url,
          }));
        if (movies.length === 0) {
          throw new Error("No valid movies found");
        }
        this.setState({ items: movies, loading: false }, () => {
          this.timer = setInterval(() => {
            this.setState((prevState) => ({
              currentIndex: (prevState.currentIndex + 1) % prevState.items.length,
            }));
          }, 5000);
        });
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false });
      });
  }
  


  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  goToNextSlide = () => {
    this.setState((prevState) => ({
      currentIndex: (prevState.currentIndex + 1) % prevState.items.length,
    }));
  };

  goToPrevSlide = () => {
    this.setState((prevState) => ({
      currentIndex: (prevState.currentIndex - 1 + prevState.items.length) % prevState.items.length,
    }));
  };

  render() {
    const { loading, error, items, currentIndex } = this.state;

    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh", bgcolor: "#121212" }}>
          <Typography variant="h6" color="#fff" sx={{ fontFamily: "'Poppins', sans-serif" }}>
            Loading...
          </Typography>
        </Box>
      );
    }

    if (error || items.length === 0) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh", bgcolor: "#121212" }}>
          <Typography variant="h6" color="#fff" sx={{ fontFamily: "'Poppins', sans-serif" }}>
            {error || "No movies available"}
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          height: { xs: "80vh", md: "90vh" },
          maxHeight: "850px",
          background: "linear-gradient(to bottom, #1a1a1a, #121212)",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "100%",
            position: "relative",
            background: "black",
          }}
        >
          {items.map((item, index) => (
            <SliderItem
              key={item.id}
              episode={item}
              isActive={index === currentIndex}
              index={index}
            />
          ))}
        </Box>

        <IconButton
          onClick={this.goToPrevSlide}
          sx={{
            position: "absolute",
            left: { xs: 10, md: 30 },
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "rgba(0, 0, 0, 0.6)",
            color: "#FFD700",
            zIndex: 2,
            "&:hover": {
              bgcolor: "rgba(255, 215, 0, 0.3)",
              transform: "translateY(-50%) scale(1.15)",
              boxShadow: "0 4px 10px rgba(255,215,0,0.5)",
            },
            width: { xs: 38, md: 50 },
            height: { xs: 38, md: 50 },
            borderRadius: "50%",
            transition: "all 0.3s ease",
          }}
          aria-label="Previous slide"
        >
          <ArrowBackIosNewIcon sx={{ fontSize: { xs: "1.1rem", md: "1.4rem" } }} />
        </IconButton>

        <IconButton
          onClick={this.goToNextSlide}
          sx={{
            position: "absolute",
            right: { xs: 10, md: 30 },
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "rgba(0, 0, 0, 0.6)",
            color: "#FFD700",
            zIndex: 2,
            "&:hover": {
              bgcolor: "rgba(255, 215, 0, 0.3)",
              transform: "translateY(-50%) scale(1.15)",
              boxShadow: "0 4px 10px rgba(255,215,0,0.5)",
            },
            width: { xs: 38, md: 50 },
            height: { xs: 38, md: 50 },
            borderRadius: "50%",
            transition: "all 0.3s ease",
          }}
          aria-label="Next slide"
        >
          <ArrowForwardIosIcon sx={{ fontSize: { xs: "1.1rem", md: "1.4rem" } }} />
        </IconButton>
      </Box>
    );
  }
}

export default Slider;