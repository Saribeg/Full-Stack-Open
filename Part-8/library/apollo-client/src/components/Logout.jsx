import { useApolloClient } from '@apollo/client';

const Logout = ({ setToken, setUser, setPage }) => {
  const client = useApolloClient();
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('library-user-token');
    client.resetStore();
    setPage('login');
  };

  return <button onClick={handleLogout}>logout</button>;
};

export default Logout;