import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../store/auth/thunks';
import Button from '../ui/Form/Button';

const Logout = ({ name }) => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout({ name }));
  };
  return (
    <Button uiType="ghostPrimary" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;

Logout.propTypes = {
  name: PropTypes.string.isRequired
};
