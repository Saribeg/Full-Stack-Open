import PropTypes from 'prop-types';
import Blog from './Blog/Blog';

const BlogList = ({ blogs, user, modifyBlogs }) => {
  return (
    <div>
      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          modifyBlogs={modifyBlogs}
        />
      )}
    </div>
  );
};

export default BlogList;

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  modifyBlogs: PropTypes.func.isRequired
};