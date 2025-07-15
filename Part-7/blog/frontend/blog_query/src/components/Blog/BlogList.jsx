
import BlogTable from './BlogTable';
import { useBlogs } from '../../queries/blog';

const BlogList = () => {
  const { data: blogs, isLoading } = useBlogs();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Blogs</h2>
      <BlogTable blogs={blogs}/>
    </div>
  );
};

export default BlogList;