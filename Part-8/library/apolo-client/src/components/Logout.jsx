import { useApolloClient } from '@apollo/client';

const Logout = ({ setToken, setUser }) => {
  const client = useApolloClient()
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('library-user-token');
    client.resetStore()
  };

  return <button onClick={handleLogout}>logout</button>;
};

export default Logout;