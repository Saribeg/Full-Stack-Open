import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import PageTitle from '../PageTitle';

import UserContext from '../../contexts/UserContext';
import { useNotification } from '../../hooks';
import { registerUser } from '../../utils/user';

import {
  Box,
  TextField,
  Button,
  Paper,
  Stack,
  Typography
} from '@mui/material';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const notify = useNotification();
  const { dispatchUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const resetForm = () => {
    setUsername('');
    setName('');
    setPassword('');
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    try {
      const userData = await registerUser(dispatchUser, { username, name, password });
      resetForm();
      navigate('/');
      notify({
        message: `Welcome, ${userData.name}! 🎉`,
        type: 'success'
      });
    } catch (error) {
      notify({
        message: error.response?.data?.error || error.message,
        type: 'error',
        duration: 10000
      });
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: 360, sm: 480, md: 560 },
        mx: 'auto',
        mt: 10
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          minHeight: { xs: 'auto', md: 400 },
          borderRadius: 2
        }}
      >
        <Stack spacing={3} component="form" onSubmit={handleRegisterSubmit}>
          <PageTitle variant="h5">Register to start using BlogApp</PageTitle>

          <TextField
            id="username"
            label="Username"
            value={username}
            onChange={handleChange(setUsername)}
            required
            fullWidth
          />

          <TextField
            id="name"
            label="Full Name"
            value={name}
            onChange={handleChange(setName)}
            required
            fullWidth
          />

          <TextField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={handleChange(setPassword)}
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            id="register"
          >
            Register
          </Button>

          <Typography align="center" variant="body2">
            Already have an account? <Link to="/login">Log in here</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default RegisterForm;