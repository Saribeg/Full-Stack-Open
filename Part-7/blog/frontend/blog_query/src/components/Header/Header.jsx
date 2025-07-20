import { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import {
  AppBar,
  Toolbar,
  Stack,
  Link as MuiLink
} from '@mui/material';

import Logo from './Logo';
import AuthStatus from '../Auth/AuthStatus';

import UserContext from '../../contexts/UserContext';

const navLinkStyles = {
  position: 'relative',
  px: 1,
  py: 0.5,
  fontSize: '1.5rem',
  fontWeight: 500,
  color: 'text.primary',
  textDecoration: 'none',
  transition: 'color 0.2s ease',

  '&.active': {
    fontWeight: 700,
    color: 'primary.dark',

    '&::after': {
      width: '100%',
      height: '3px',
      backgroundColor: 'primary.dark',
    }
  },

  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '2px',
    width: 0,
    backgroundColor: 'primary.main',
    transition: 'width 0.3s ease, background-color 0.2s ease, height 0.2s ease',
  },

  '&:hover::after': {
    width: '100%',
  },

  '&:hover': {
    color: 'primary.main',
  }
};

const Header = () => {
  const { user } = useContext(UserContext);

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
        <Logo />

        {user && (
          <Stack direction="row" spacing={2}>
            <MuiLink
              component={NavLink}
              to="/about"
              underline="none"
              sx={navLinkStyles}
            >
              About
            </MuiLink>
            <MuiLink
              component={NavLink}
              to="/blogs"
              underline="none"
              sx={navLinkStyles}
            >
              Blogs
            </MuiLink>
            <MuiLink
              component={NavLink}
              to="/users"
              underline="none"
              sx={navLinkStyles}
            >
              Users
            </MuiLink>
          </Stack>
        )}

        {user && <AuthStatus user={user} />}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
