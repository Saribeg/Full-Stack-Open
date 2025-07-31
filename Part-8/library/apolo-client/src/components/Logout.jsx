const Logout = ({ setToken }) => {
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('phonenumbers-user-token');
  };

  return <button onClick={handleLogout}>logout</button>;
};

export default Logout;