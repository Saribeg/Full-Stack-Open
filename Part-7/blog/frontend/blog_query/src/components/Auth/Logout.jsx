import { useContext } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@mui/material';

import { useNotification } from '../../hooks';

import UserContext from '../../contexts/UserContext';
import { logoutUser } from '../../utils/user';

const Logout = ({ user }) => {
  const { dispatchUser } = useContext(UserContext);
  const notify = useNotification();

  const handleLogout = () => {
    logoutUser(dispatchUser);
    notify({
      message: `Bye-Bye, ${user.name}. See you soon. 👋`,
      type: 'success'
    });
  };

  return (
    <Button
      variant="outlined"
      color="info"
      size="small"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

Logout.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default Logout;
