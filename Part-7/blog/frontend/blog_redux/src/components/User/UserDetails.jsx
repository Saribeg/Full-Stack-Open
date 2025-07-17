import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUserById } from '../../store/users/thunks';
import { selectUserDetailsState } from '../../store/users/selectors';
import BlogTable from '../Blog/BlogTable';
import PageTitle from '../PageTitle';

const UserDetails = () => {
  const { user, loading } = useSelector(selectUserDetailsState);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchUserById(id));
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>User not found</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-8">
      <PageTitle>{user.name}</PageTitle>
      <h3>Added Blogs</h3>
      <BlogTable blogs={user.blogs} />
    </div>
  );
};

export default UserDetails;
