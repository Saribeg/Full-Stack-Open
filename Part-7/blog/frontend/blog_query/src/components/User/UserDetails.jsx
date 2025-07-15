import { useParams } from 'react-router-dom';
import { useUserById } from '../../queries/user';
import BlogTable from '../Blog/BlogTable';

const UserDetails = () => {
  const { id } = useParams();
  const { data: user, isLoading } = useUserById(id);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added Blogs</h3>
      <BlogTable blogs={user.blogs} />
    </div>
  );
};

export default UserDetails;
