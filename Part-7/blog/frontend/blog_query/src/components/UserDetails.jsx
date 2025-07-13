import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import userService from '../services/users';
import { useNotification } from '../hooks';

const UserDetails = () => {
  const { id } = useParams();
  const notify = useNotification();

  const { data: user, isLoading } = useQuery({
    queryKey: ['selectedUser', id],
    queryFn: () => userService.getById(id),
    onError: (error) => {
      notify({
        type: 'error',
        message: `Failed to fetch user. Error: "${error.message}"`
      });
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added Blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserDetails;
