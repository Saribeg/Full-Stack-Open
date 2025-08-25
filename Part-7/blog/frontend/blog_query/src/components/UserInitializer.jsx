import { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';

import Spinner from './Spinner';

import UserContext from '../contexts/UserContext';
import { initializeUser } from '../utils/user';

const UserInitializer = ({ children }) => {
  const { dispatchUser } = useContext(UserContext);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeUser(dispatchUser);
    Promise.resolve().then(() => setReady(true));
  }, [dispatchUser]);

  if (!ready) return <Spinner data-testid="spinner" />;
  return children;
};

UserInitializer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserInitializer;
