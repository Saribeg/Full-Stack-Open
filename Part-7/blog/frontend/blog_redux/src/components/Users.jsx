import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserItem from './UserItem';
import { getUsers } from '../store/reducers/usersReducer';

const Users = () => {
  const users = useSelector((state) => state.users.userList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

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
