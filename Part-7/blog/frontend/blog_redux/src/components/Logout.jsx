import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/reducers/authReducer';

const Logout = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());
  };
  return (
    <button className="btn btn-secondary" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
