import { useContext } from 'react';
import UserContext from '../contexts/UserContext';
import Logout from './Logout';

const UserData = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return null;
  }

  const { username, name } = user;

  return (
    <div className='user'>
      <h2 className='user-title'>User Information</h2>
      <div>
        <p className='user-username'>Username: {username}</p>
        <p className='user-name'>Name: {name}</p>
        <p className='user-status'>Status: Logged In</p>
        <Logout />
      </div>
    </div>
  );
};

export default UserData;