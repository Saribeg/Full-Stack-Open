import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../store/auth/thunks';

const Logout = ({ name }) => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout({ name }));
  };
  return (
    <button className="btn btn-secondary" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;

Logout.propTypes = {
  name: PropTypes.string.isRequired
};
