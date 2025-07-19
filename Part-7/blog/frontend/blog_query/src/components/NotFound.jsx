import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 3,
      }}
    >
      <SentimentDissatisfiedIcon color="disabled" sx={{ fontSize: 80 }} />
      <Typography variant="h3" component="h1">
        404
      </Typography>
      <Typography variant="h6" color="text.secondary">
        The page you're looking for doesn't exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
      >
        Go Home
      </Button>
    </Box>
  );
};

export default NotFound;
