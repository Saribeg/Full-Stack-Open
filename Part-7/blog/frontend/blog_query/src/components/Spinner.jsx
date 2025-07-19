import { Box, CircularProgress } from '@mui/material';

const Spinner = () => {
  return <Box
    sx={{
      height: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress size={48} color="primary" />
  </Box>;
};

export default Spinner;