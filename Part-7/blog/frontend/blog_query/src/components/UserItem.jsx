import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const UserItem = ({ user }) => {
  return (
    <tr>
      <td>
        <Link to={`/users/${user.id}`}>{user.name}</Link>
      </td>
      <td>{user.blogs.length}</td>
    </tr>
  );
};

export default UserItem;

UserItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    blogs: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        id: PropTypes.string
      })
    ).isRequired
  }).isRequired
};
