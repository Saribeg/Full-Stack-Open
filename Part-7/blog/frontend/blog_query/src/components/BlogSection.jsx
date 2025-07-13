import { useRef } from 'react';
import BlogList from './BlogList';
import BlogForm from './BlogForm';
import Togglable from './Togglable/Togglable';

const BlogSection = () => {
  const blogFormRef = useRef();

  return (
    <>
      <BlogList />
      <Togglable buttonLabel="New Blog" ref={blogFormRef}>
        <BlogForm
          toggleForm={() => blogFormRef.current.toggleVisibility()}
        />
      </Togglable>
    </>
  );
};

export default BlogSection;