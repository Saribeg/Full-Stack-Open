import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BlogTable from './BlogTable';
import { initializeBlogs } from '../store/reducers/blogsReducer';

const BlogList = () => {
  const blogs = useSelector((state) => [...state.blogs.blogList].sort((a, b) => b.likes - a.likes));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);
  return (
    <div>
      <h2>Blogs</h2>
      <BlogTable blogs={blogs} />
    </div>
  );
};

export default BlogList;
