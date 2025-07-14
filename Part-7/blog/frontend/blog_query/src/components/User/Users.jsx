import { useQuery } from '@tanstack/react-query';
import userService from '../../services/users';
import { useNotification } from '../../hooks';
import UserItem from './UserItem';

const Users = () => {
  const notify = useNotification();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    onError: (error) => {
      notify({
        type: 'error',
        message: `Failed to fetch users. Error: "${error.message}"`
      });
    }
  });

  if (isLoading) return <div>Loading...</div>;

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
          {users.map(user => (
            <UserItem key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;