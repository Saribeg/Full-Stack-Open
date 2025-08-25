import PropTypes from 'prop-types';
import Logout from './Logout';

const AuthStatus = ({ user }) => {
  const { name } = user;

  return (
    <div className="flex items-center gap-4">
      <p className="whitespace-nowrap" data-testid="auth-status">
        <span className="font-semibold">{name}</span> <span>logged in</span>
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
