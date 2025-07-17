import { useRef } from 'react';
import BlogList from './BlogList';
import BlogForm from './BlogForm';
import Togglable from '../Togglable';
import PageTitle from '../PageTitle';

const BlogSection = () => {
  const blogFormRef = useRef();

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-8">
      <PageTitle>Blogs</PageTitle>
      <BlogList />
      <Togglable buttonLabel="New Blog" ref={blogFormRef}>
        <BlogForm toggleForm={() => blogFormRef.current.toggleVisibility()} />
      </Togglable>
    </div>
  );
};

export default BlogSection;
