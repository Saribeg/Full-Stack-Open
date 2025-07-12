import PropTypes from 'prop-types';
import Blog from './Blog/Blog';

const BlogList = ({ blogs, user, modifyBlogs, notify }) => {
  return (
    <div>
      <h2>Blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} modifyBlogs={modifyBlogs} notify={notify} />
      ))}
    </div>
  );
};

export default BlogList;

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  modifyBlogs: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired
};
