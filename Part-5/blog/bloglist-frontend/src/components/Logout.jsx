import { clearToken } from '../services/api';

const Logout = ({ setUser }) => {
  const handleLogout = () => {
    window.localStorage.removeItem('user');
    clearToken();
    setUser(null);
  };
  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;