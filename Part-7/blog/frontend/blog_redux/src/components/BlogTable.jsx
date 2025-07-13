import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const BlogTable = ({ blogs }) => (
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Author</th>
      </tr>
    </thead>
    <tbody>
      {blogs.map((blog) => (
        <tr key={blog.id}>
          <td>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </td>
          <td>{blog.author}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default BlogTable;

BlogTable.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired
    })
  ).isRequired
};
