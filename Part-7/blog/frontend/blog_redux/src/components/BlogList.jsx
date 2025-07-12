import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Blog from './Blog/Blog';
import { initializeBlogs } from '../store/reducers/blogsReducer';

const BlogList = ({ notify }) => {
  const blogs = useSelector((state) => [...state.blogs].sort((a, b) => b.likes - a.likes));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);
  return (
    <div>
      <h2>Blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} notify={notify} />
      ))}
    </div>
  );
};

export default BlogList;

BlogList.propTypes = {
  notify: PropTypes.func.isRequired
};
