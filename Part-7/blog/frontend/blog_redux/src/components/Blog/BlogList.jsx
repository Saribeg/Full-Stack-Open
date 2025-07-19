import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Togglable from '../Togglable';
import BlogForm from './BlogForm';
import BlogTable from './BlogTable';
import InlineNotification from '../Notification/InlineNotification';
import Spinner from '../ui/Spinner';

import { selectVisibleBlogsState } from '../../store/blogs/selectors';
import { fetchBlogs } from '../../store/blogs/thunks';

const BlogList = () => {
  const { blogs, loading } = useSelector(selectVisibleBlogsState);
  const dispatch = useDispatch();
  const blogFormRef = useRef();

  useEffect(() => {
    if (blogs.length === 0) {
      dispatch(fetchBlogs());
    }
  }, [dispatch, blogs.length]);

  if (loading) return <Spinner />;

  if (!blogs || !blogs.length) {
    return <InlineNotification placement="BlogList" />;
  }

  return (
    <>
      {blogs.length > 7 && (
        <Togglable buttonLabel="New Blog" ref={blogFormRef}>
          <BlogForm toggleForm={() => blogFormRef.current.toggleVisibility()} />
        </Togglable>
      )}
      <BlogTable blogs={blogs} />
    </>
  );
};

export default BlogList;
