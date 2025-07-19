import { Link as RouterLink } from 'react-router-dom';
import { Typography } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const logoStyles = {
  textDecoration: 'none',
  fontSize: '2rem',
  fontWeight: 700,
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  color: '#0d47a1',
  letterSpacing: '1px',
  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
  mb: 1,
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  '&:hover': {
    textShadow: '1px 2px 6px rgba(0, 83, 160, 0.3)',
    color: '#0074d9',
    transform: 'scale(1.03)',
  }
};

const Logo = () => {
  return (
    <Typography
      component={RouterLink}
      to="/"
      sx={logoStyles}
    >
      <MenuBookIcon sx={{ fontSize: '2.2rem' }} />
      BlogsApp
    </Typography>
  );
};

export default Logo;
