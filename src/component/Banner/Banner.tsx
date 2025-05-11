import React from "react";
import { Box, Button, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import img1 from '../../assets/Images/avengers.jpg';

class Banner extends React.Component {
  render() {
    return (
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100vh",
          backgroundColor: "#000",
          display: "flex", 
          overflow: "hidden",
        }}
      >

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            width: { xs: "100%", md: "50%" }, 
            padding: { xs: 2, md: 4 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            height: "100%",
          }}
        >
          <Box sx={{ maxWidth: { xs: "100%", md: "80%" } }}>
            <Typography
              variant="h1"
              fontWeight="600"
              color="#fff"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                pb: 3,
                lineHeight: { xs: 1.1, md: 1 },
                letterSpacing: "-0.02em",
              }}
            >
              Avangers
            </Typography>

            <Typography
              variant="body1"
              color="#fff"
              sx={{
                mt: 3,
                fontSize: { xs: "1rem", md: "1.1rem" },
                maxWidth: { xs: "100%", md: "90%" },
                lineHeight: 1.6,
                textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                fontWeight: 300,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Avangers faces intense pressure as she navigates personal and professional challenges.
            </Typography>

            <Box sx={{ marginTop: "80px" }}>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    bgcolor: "#fff",
                    color: "#000",
                    "&:hover": {
                      bgcolor: "#FFD700",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 12px rgba(255,215,0,0.3)",
                    },
                    px: { xs: 2, md: 3 },
                    py: 1,
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease",
                  }}
                >
                  Watch now
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<InfoOutlinedIcon />}
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    color: "#fff",
                    "&:hover": {
                      borderColor: "#fff",
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      transform: "translateY(-2px)",
                    },
                    px: { xs: 2, md: 3 },
                    py: 1,
                    fontWeight: 500,
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                  }}
                >
                  More Info
                </Button>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 3 }}>
                <Typography variant="body2" color="#fff" sx={{ fontWeight: 500 }}>
                  Subscribe for ₹99/month
                </Typography>
                <Typography variant="body2" color="#fff" sx={{ fontWeight: 500 }}>
                  Watch with a Prime membership
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        
        <Box
          sx={{
            position: "relative",
            width: { xs: "0%", md: "50%" }, 
            height: "100%",
            overflow: "hidden",
            display: { xs: "none", md: "block" }, 
          }}
        >
          <Box
            component="img"
            src={img1}
            alt="Ishaani"
            sx={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
      </Box>
    );
  }
}

export default Banner;