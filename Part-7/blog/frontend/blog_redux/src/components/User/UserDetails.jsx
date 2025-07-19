import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import BlogTable from '../Blog/BlogTable';
import PageTitle from '../PageTitle';
import UserNotFound from './UserNotFound';
import Spinner from '../ui/Spinner';

import { fetchUserById } from '../../store/users/thunks';
import { selectUserDetailsState } from '../../store/users/selectors';

const UserDetails = () => {
  const { user, loading } = useSelector(selectUserDetailsState);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchUserById(id));
  }, [dispatch, id]);

  if (loading) return <Spinner />;

  if (!user) return <UserNotFound id={id} />;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-8">
      <PageTitle>{user.name}</PageTitle>
      <h3>Added Blogs</h3>
      <BlogTable blogs={user.blogs} />
    </div>
  );
};

export default UserDetails;
