import PropTypes from 'prop-types';
import Logout from './Logout';

const UserData = ({ user, setUser }) => {
  const { username, name } = user;

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>User Information</h2>
      <div>
        <p>Username: {username}</p>
        <p>Name: {name}</p>
        <p>Status: Logged In</p>
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