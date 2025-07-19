import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Stack, Typography, Button } from '@mui/material';

import EntityNotFound from '../EntityNotFound';

const UserNotFound = ({ id }) => {
  const navigate = useNavigate();

  return (
    <EntityNotFound>
      <Stack spacing={2}>
        <Typography variant="h5">Oops!</Typography>
        <Typography variant="body1" color="text.secondary">
          This user with id <strong>{id}</strong> has been removed or never existed.
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/users')}>
          Back to users
        </Button>
      </Stack>
    </EntityNotFound>
  );
};

UserNotFound.propTypes = {
  id: PropTypes.string
};

export default UserNotFound;