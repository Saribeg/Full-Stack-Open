import PropTypes from 'prop-types';
import { Typography, Stack } from '@mui/material';
import Logout from './Logout';

const AuthStatus = ({ user }) => {
  const { name } = user;

  return (
    <Stack direction="row" spacing={2} alignItems="center" data-testid="auth-status">
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {name}{' '}
        <Typography component="span" variant="body2" color="text.secondary">
          logged in
        </Typography>
      </Typography>

      <Logout user={user}/>
    </Stack>
  );
};

AuthStatus.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default AuthStatus;
