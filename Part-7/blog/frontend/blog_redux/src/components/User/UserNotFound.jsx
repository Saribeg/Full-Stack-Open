import PropTypes from 'prop-types';
import EntityNotFound from '../EntityNotFound';

const UserNotFound = ({ id }) => (
  <EntityNotFound
    message={
      <>
        The user with ID <span className="font-semibold text-white">{id}</span> was not found or may
        have been removed.
      </>
    }
    redirectTo="/users"
    buttonText="Back to users"
    notificationPlacement="UserDetails"
  />
);

UserNotFound.propTypes = {
  id: PropTypes.string
};

export default UserNotFound;
