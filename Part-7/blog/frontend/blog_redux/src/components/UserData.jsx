import { useSelector } from 'react-redux';
import Logout from './Logout';

const UserData = () => {
  const user = useSelector((state) => state.user);
  const { username, name } = user;

  if (!user) {
    return null;
  }

  return (
    <div className="user">
      <h2 className="user-title">User Information</h2>
      <div>
        <p className="user-username">Username: {username}</p>
        <p className="user-name">Name: {name}</p>
        <p className="user-status">Status: Logged In</p>
        <Logout />
      </div>
    </div>
  );
};

export default UserData;
