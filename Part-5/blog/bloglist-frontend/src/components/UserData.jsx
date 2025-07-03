import PropTypes from 'prop-types';
import Logout from './Logout';

const UserData = ({ user, setUser }) => {
  const { username, name } = user;

  if (!user) {
    return null;
  }

  return (
    <div className='user'>
      <h2 className='user-title'>User Information</h2>
      <div>
        <p className='user-username'>Username: {username}</p>
        <p className='user-name'>Name: {name}</p>
        <p className='user-status'>Status: Logged In</p>
        <Logout setUser={setUser}/>
      </div>
    </div>
  );
};

export default UserData;

UserData.propTypes = {
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired
};