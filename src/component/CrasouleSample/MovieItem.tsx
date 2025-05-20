import { useState, useEffect } from 'react';
import { Box, Typography, Rating, Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { deleteMovie } from '../../utils/User';
import { FaCrown } from 'react-icons/fa6';
import { toast } from 'react-toastify';

interface MovieItemProps {
  id: number;
  title: string;
  desc: string;
  image: string;
  rating: number;
  year: number;
  duration: string;
  streaming_platform: string;
  premium: boolean;
  onClick: () => void;
  onDelete: (id: number) => void; 
}

const MovieItem: React.FC<MovieItemProps> = ({
  id,
  title,
  image,
  rating,
  year,
  duration,
  streaming_platform,
  premium,
  onClick,
  onDelete,
}) => {
  const [isSupervisor, setIsSupervisor] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('new user detail');
    if (storedData) {
      try {
        const userData = JSON.parse(storedData);
        setIsSupervisor(userData.role === 'supervisor');
      } catch (err) {
        console.error('Error parsing local storage data:', err);
        setIsSupervisor(false);
      }
    }
  }, []);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/admin/${id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      console.log(`Attempting to delete movie: ${title} (ID: ${id})`);
      await deleteMovie(id);
      console.log(`Successfully deleted movie: ${title}`);
      toast.success(`Movie "${title}" deleted successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        style: { backgroundColor: '#4caf50', color: 'white' },
      });
      onDelete(id); 
    } catch (error) {
      console.error(`Error deleting movie ${title}:`, error);
      toast.error('Failed to delete movie. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        style: { backgroundColor: '#d32f2f', color: 'white' },
      });
    }
    setOpenDeleteDialog(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDeleteDialog(false);
  };

  const handleDialogClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
    setOpenDeleteDialog(false);
  };

  const handleBoxClick = (e: React.MouseEvent) => {
    if (openDeleteDialog) return;
    onClick();
  };

  return (
    <Box
      sx={{
        flexShrink: 0,
        width: 200,
        cursor: 'pointer',
        '&:hover': { opacity: 0.9 },
        position: 'relative',
      }}
      onClick={handleBoxClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          borderRadius: '4px',
          padding: '2px 6px',
          fontSize: '12px',
          fontWeight: 'medium',
        }}
      >
        {streaming_platform}
      </Box>
      {premium && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            backgroundColor: '#facc15',
            color: 'black',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '12px',
            fontWeight: 'medium',
          }}
        >
          <FaCrown />
        </Box>
      )}
      {isSupervisor && (
        <>
          <EditIcon
            onClick={handleEditClick}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '50%',
              padding: '4px',
              fontSize: '20px',
              cursor: 'pointer',
              '&:hover': { color: '#facc15' },
            }}
          />
          <Fab
            size="small"
            color="error"
            aria-label="delete"
            onClick={handleDeleteClick}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: 3,
              backgroundColor: 'rgba(211, 47, 47, 0.9)',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 1)',
              },
            }}
          >
            <DeleteIcon />
          </Fab>
        </>
      )}
      <img
        src={image || 'https://via.placeholder.com/200x250?text=No+Image'}
        alt={title}
        style={{
          width: '100%',
          height: 250,
          objectFit: 'cover',
          borderRadius: 8,
        }}
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/200x250?text=No+Image';
        }}
      />
      <Typography sx={{ color: 'white', mt: 1, fontWeight: 'medium' }}>{title}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#bbb' }}>
        <Typography variant="body2">{year}</Typography>
        <Typography variant="body2">{duration}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
        <Rating
          value={rating / 2}
          max={1}
          readOnly
          size="small"
        />
        <Typography variant="body2" sx={{ color: '#bbb', ml: 1 }}>
          {rating.toFixed(1)}
        </Typography>
      </Box>

      <Dialog
        open={openDeleteDialog}
        onClose={handleDialogClose}
        aria-labelledby="delete-dialog-title"
        PaperProps={{
          sx: {
            backgroundColor: '#424242',
            color: 'white',
            zIndex: 10000,
          },
        }}
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            sx={{ color: '#facc15', textTransform: 'none' }}
          >
            No
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{
              textTransform: 'none',
              '&:hover': { backgroundColor: '#d32f2f' },
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MovieItem;