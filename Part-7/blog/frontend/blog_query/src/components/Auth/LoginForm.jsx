import { useState, useContext } from 'react';

import PageTitle from '../PageTitle';

import UserContext from '../../contexts/UserContext';
import { useNotification } from '../../hooks';
import { loginUser } from '../../utils/user';

import {
  Box,
  TextField,
  Button,
  Paper,
  Stack
} from '@mui/material';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const notify = useNotification();
  const { dispatchUser } = useContext(UserContext);

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };
  const resetForm = () => {
    setUsername('');
    setPassword('');
  };
  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const userData = await loginUser(dispatchUser, { username, password });
      resetForm();
      notify({
        message: `Welcome, ${userData.name}! 😊`,
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
          minHeight: { xs: 'auto', md: 350 },
          borderRadius: 2
        }}
      >
        <Stack spacing={3} component="form" onSubmit={handleLoginSubmit}>
          <PageTitle variant="h5">Log in to see blogs and work with them</PageTitle>

          <TextField
            id="username"
            label="Username"
            value={username}
            onChange={handleChange(setUsername)}
            required
            slotProps={{
              htmlInput: { 'data-testid': 'username' }
            }}
            fullWidth
          />

          <TextField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={handleChange(setPassword)}
            required
            slotProps={{
              htmlInput: { 'data-testid': 'password' }
            }}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            id="login"
            data-testid="login"
          >
            Login
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginForm;