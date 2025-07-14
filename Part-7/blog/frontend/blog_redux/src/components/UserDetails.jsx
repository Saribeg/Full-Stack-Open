import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserById } from '../store/users/thunks';
import { selectUserDetailsState } from '../store/users/selectors';
import { clearUser } from '../store/users/slice';
import BlogTable from './BlogTable';

const UserDetails = () => {
  const { user, loading } = useSelector(selectUserDetailsState);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchUserById(id));
    return () => dispatch(clearUser());
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added Blogs</h3>
      <BlogTable blogs={user.blogs} />
    </div>
  );
};

export default UserDetails;
