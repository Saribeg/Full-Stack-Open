import { useApolloClient } from '@apollo/client';

const Logout = ({ setToken }) => {
  const client = useApolloClient()
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('library-user-token');
    client.resetStore()
  };

  return <button onClick={handleLogout}>logout</button>;
};

export default Logout;