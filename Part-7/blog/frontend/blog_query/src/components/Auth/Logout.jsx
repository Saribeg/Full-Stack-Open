import { useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import { logoutUser } from '../../utils/user';

const Logout = () => {
  const { dispatchUser } = useContext(UserContext);
  return <button className="btn btn-secondary" onClick={() => logoutUser(dispatchUser)}>Logout</button>;
};

export default Logout;