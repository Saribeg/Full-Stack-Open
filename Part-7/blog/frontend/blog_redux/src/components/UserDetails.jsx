import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserById } from '../store/reducers/usersReducer';
import BlogTable from './BlogTable';

const UserDetails = () => {
  const user = useSelector((state) => state.users.selectedUser);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getUserById(id));
  }, [dispatch, id]);

  if (!user) return null;

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added Blogs</h3>
      <BlogTable blogs={user.blogs} />
    </div>
  );
};

export default UserDetails;
