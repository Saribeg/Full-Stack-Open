import PropTypes from 'prop-types';
import { clearToken } from '../services/api';

const Logout = ({ setUser }) => {
  const handleLogout = () => {
    window.localStorage.removeItem('user');
    clearToken();
    setUser(null);
  };
  return <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>;
};

export default Logout;

Logout.propTypes = {
  setUser: PropTypes.func.isRequired
};