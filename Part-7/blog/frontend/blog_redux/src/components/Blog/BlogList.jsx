import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectVisibleBlogsState } from '../../store/blogs/selectors';
import BlogTable from './BlogTable';
import { fetchBlogs } from '../../store/blogs/thunks';

const BlogList = () => {
  const { blogs, loading } = useSelector(selectVisibleBlogsState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (blogs.length === 0) {
      dispatch(fetchBlogs());
    }
  }, [dispatch, blogs.length]);

  if (loading) return <div>Loading...</div>;

  return <BlogTable blogs={blogs} />;
};

export default BlogList;
