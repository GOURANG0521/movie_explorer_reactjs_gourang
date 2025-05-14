import React from "react";
import { Box, Button, Typography, Fade } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export interface Episode {
  id: string;
  title: string;
  desc: string;
  banner_url: string;
  poster_url: string;
}

interface SliderItemProps {
  episode: Episode;
  isActive: boolean;
  index: number;
}

class SliderItem extends React.Component<SliderItemProps> {
  render() {
    const { episode, isActive } = this.props;

    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.8s ease-in-out",
          zIndex: isActive ? 1 : -1,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={episode.banner_url}
            alt={`${episode.title} banner`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.85)", 
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2))",
              boxShadow: "inset 0 0 60px rgba(0,0,0,0.6)",
            }}
          />
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: { xs: "8%", sm: "12%", md: "100px" },
            bottom: { xs: "8%", sm: "12%", md: "25%" },
            left: { xs: 12, sm: 20, md: 60 },
            maxWidth: { xs: "95%", sm: "85%", md: "55%" },
            zIndex: 2,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, md: 3 },
            alignItems: { xs: "center", md: "flex-start" },
          }}
        >
          
          <Fade in={isActive} timeout={800} style={{ transitionDelay: isActive ? "200ms" : "0ms" }}>
            <Box
              component="img"
              src={episode.poster_url}
              alt={`${episode.title} poster`}
              sx={{
                width: { xs: "70%", sm: "200px", md: "260px" },
                height: "auto",
                borderRadius: 10,
                boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.08)",
                  boxShadow: "0 10px 28px rgba(255,215,0,0.5)",
                },
              }}
            />
          </Fade>

          
          <Box sx={{ display: "flex", flexDirection: "column", textAlign: { xs: "center", md: "left" } }}>
            <Fade in={isActive} timeout={800} style={{ transitionDelay: isActive ? "400ms" : "0ms" }}>
              <Typography
                variant="h1"
                fontWeight="700"
                color="#fff"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                  textShadow: "0 3px 12px rgba(0,0,0,0.7)",
                  pb: 2,
                  lineHeight: { xs: 1.2, md: 1.1 },
                  letterSpacing: "-0.02em",
                  backgroundImage: "linear-gradient(120deg, #FFFFFF 0%, #FFD700 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  transform: isActive ? "translateY(0)" : "translateY(20px)",
                  transition: "transform 0.6s ease, opacity 0.6s ease",
                }}
              >
                {episode.title}
              </Typography>
            </Fade>

            <Fade in={isActive} timeout={800} style={{ transitionDelay: isActive ? "600ms" : "0ms" }}>
              <Typography
                variant="body1"
                color="#fff"
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  mt: 1.5,
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                  maxWidth: { xs: "100%", md: "90%" },
                  lineHeight: 1.6,
                  textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                  fontWeight: 300,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 0.6s ease 0.3s",
                }}
              >
                {episode.desc}
              </Typography>
            </Fade>

            <Box sx={{ marginTop: { xs: "30px", md: "50px" } }}>
              <Fade in={isActive} timeout={800} style={{ transitionDelay: isActive ? "700ms" : "0ms" }}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: { xs: "center", md: "flex-start" } }}>
                  <Button
                    variant="contained"
                    startIcon={<PlayArrowIcon />}
                    sx={{
                      bgcolor: "#FFD700",
                      color: "#000",
                      "&:hover": {
                        bgcolor: "#fff",
                        transform: "scale(1.1)",
                        boxShadow: "0 6px 14px rgba(255,215,0,0.6)",
                      },
                      px: { xs: 2, md: 3 },
                      py: 1,
                      fontWeight: 600,
                      borderRadius: 6,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                      transition: "all 0.3s ease",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Watch Now
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<InfoOutlinedIcon />}
                    sx={{
                      borderColor: "rgba(255, 255, 255, 0.8)",
                      color: "#fff",
                      "&:hover": {
                        borderColor: "#FFD700",
                        bgcolor: "rgba(255, 215, 0, 0.15)",
                        transform: "scale(1.1)",
                        boxShadow: "0 6px 14px rgba(255,215,0,0.4)",
                      },
                      px: { xs: 2, md: 3 },
                      py: 1,
                      fontWeight: 500,
                      borderRadius: 6,
                      transition: "all 0.3s ease",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    More Info
                  </Button>
                </Box>
              </Fade>

              <Fade in={isActive} timeout={800} style={{ transitionDelay: isActive ? "800ms" : "0ms" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 2, justifyContent: { xs: "center", md: "flex-start" } }}>
                  <Typography variant="body2" color="#fff" sx={{ fontWeight: 500, fontFamily: "'Roboto', sans-serif" }}>
                    Subscribe for ₹99/month
                  </Typography>
                  <Typography variant="body2" color="#fff" sx={{ fontWeight: 500, fontFamily: "'Roboto', sans-serif" }}>
                    Watch with a Prime membership
                  </Typography>
                </Box>
              </Fade>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default SliderItem; 