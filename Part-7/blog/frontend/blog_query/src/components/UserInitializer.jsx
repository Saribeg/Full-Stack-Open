import { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';

import Spinner from './Spinner';

import UserContext from '../contexts/UserContext';
import { initializeUser } from '../utils/user';

/**
 * UX note:
 * On first load (or after a reload), the app needs a brief moment to:
 * - read the auth token from localStorage,
 * - validate it and hydrate the user state via context.
 * Without gating the initial render, the login form may flash for a split second
 * before the target page appears. To avoid that flicker, we block the UI behind
 * a small "ready" gate and show a spinner until the init settles. This yields a
 * smoother, more polished transition without visual jumps.
 */
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
