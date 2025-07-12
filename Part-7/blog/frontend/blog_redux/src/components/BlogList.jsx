import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Blog from './Blog/Blog';
import { initializeBlogs } from '../store/reducers/blogsReducer';

const BlogList = ({ user, notify }) => {
  const blogs = useSelector((state) => [...state.blogs].sort((a, b) => b.likes - a.likes));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);
  return (
    <div>
      <h2>Blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} notify={notify} />
      ))}
    </div>
  );
};

export default BlogList;

BlogList.propTypes = {
  user: PropTypes.object.isRequired,
  notify: PropTypes.func.isRequired
};
