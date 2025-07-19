import { useParams } from 'react-router-dom';

import BlogTable from '../Blog/BlogTable';
import Spinner from '../Spinner';
import UserNotFound from './UserNotFound';

import { useUserById } from '../../queries/user';

const UserDetails = () => {
  const { id } = useParams();
  const { data: user, isLoading } = useUserById(id);

  if (isLoading) return <Spinner />;
  if (!user) return <UserNotFound id={id}/>;

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added Blogs</h3>
      <BlogTable blogs={user.blogs} />
    </div>
  );
};

export default UserDetails;
