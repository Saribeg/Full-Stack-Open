import PropTypes from 'prop-types';
import Logout from '../Logout';
import './AuthStatus.css';

const AuthStatus = ({ user }) => {
  const { name } = user;

  return (
    <div className="auth-status">
      <p className="user-name">
        {name} <span>logged in</span>
      </p>
      <Logout name={name} />
    </div>
  );
};

export default AuthStatus;

AuthStatus.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};
