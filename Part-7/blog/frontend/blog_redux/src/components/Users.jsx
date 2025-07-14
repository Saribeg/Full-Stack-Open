import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserItem from './UserItem';
import { fetchUsers } from '../store/users/thunks';
import { selectUsersState } from '../store/users/selectors';

const Users = () => {
  const { users, loading } = useSelector(selectUsersState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserItem key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
