import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <Stack spacing={2} alignItems='center' textAlign='center'>
        <Typography
          variant='h1'
          component='h1'
          sx={{ fontSize: { xs: 48, sm: 72 }, fontWeight: 800, lineHeight: 1 }}
        >
          404
        </Typography>

        <Typography variant='h5'>Page not found</Typography>
        <Typography variant='body2' color='text.secondary'>
          The page you’re looking for doesn’t exist or was moved.
        </Typography>

        <Stack direction='row' spacing={1} sx={{ mt: 1 }}>
          <Button
            variant='contained'
            onClick={() => navigate('/', { replace: true })}
          >
            Go home
          </Button>
          <Button variant='outlined' onClick={() => navigate(-1)}>
            Go back
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default NotFound;