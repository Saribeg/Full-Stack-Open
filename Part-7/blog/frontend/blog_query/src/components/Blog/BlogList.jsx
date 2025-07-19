
import { useRef } from 'react';

import Togglable from '../Togglable';
import BlogForm from './BlogForm';
import BlogTable from './BlogTable';
import Spinner from '../Spinner';

import { useBlogs } from '../../queries/blog';

const BlogList = () => {
  const { data: blogs, isLoading } = useBlogs();
  const blogFormRef = useRef();

  if (isLoading) return <Spinner />;

  return (
    <>
      {
        blogs.length > 10 && (
          <Togglable buttonLabel="New Blog" ref={blogFormRef}>
            <BlogForm
              toggleForm={() => blogFormRef.current.toggleVisibility()}
            />
          </Togglable>
        )
      }

      <div>
        <h2>Blogs</h2>
        <BlogTable blogs={blogs}/>
      </div>
    </>

  );
};

export default BlogList;