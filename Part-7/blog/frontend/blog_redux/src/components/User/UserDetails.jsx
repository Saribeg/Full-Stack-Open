import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import BlogTable from '../Blog/BlogTable';
import PageTitle from '../PageTitle';
import InlineNotification from '../Notification/InlineNotification';

import { fetchUserById } from '../../store/users/thunks';
import { selectUserDetailsState } from '../../store/users/selectors';

const UserDetails = () => {
  const { user, loading } = useSelector(selectUserDetailsState);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchUserById(id));
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;

  if (!user)
    return (
      <div>
        <div>User not found</div>
        <InlineNotification placement="UserDetails" />
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-8">
      <PageTitle>{user.name}</PageTitle>
      <h3>Added Blogs</h3>
      <BlogTable blogs={user.blogs} />
    </div>
  );
};

export default UserDetails;
