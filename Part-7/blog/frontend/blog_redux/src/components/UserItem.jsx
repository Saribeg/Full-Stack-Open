import PropTypes from 'prop-types';

const UserItem = ({ user }) => {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.blogs.length}</td>
    </tr>
  );
};

export default UserItem;

UserItem.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    blogs: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired
};
