import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import blogsService from '../services/blogs';
import Blog from './Blog/Blog';
import { useNotification } from '../hooks';

const BlogList = ({ user }) => {
  const notify = useNotification();

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogsService.getAll,
    select: (data) => [...data].sort((a, b) => b.likes - a.likes),
    onError: (error) => {
      notify({
        type: 'error',
        message: `Failed to fetch blogs. Error: "${error.message}"`
      });
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
        />
      )}
    </div>
  );
};

export default BlogList;

BlogList.propTypes = {
  user: PropTypes.object.isRequired
};