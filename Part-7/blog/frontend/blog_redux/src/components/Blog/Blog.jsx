import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { likeBlog, deleteBlog } from '../../store/reducers/blogsReducer';
import { useNotification } from '../../hooks';
import './Blog.css';

const Blog = ({ blog }) => {
  const [expanded, setExpanded] = useState(false);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const notify = useNotification();

  const handleBlogUpdate = async () => {
    try {
      const updatedBlog = await dispatch(likeBlog(blog));
      notify({
        message: `Blog ${updatedBlog.title} is successfully updated`,
        type: 'success'
      });
    } catch (error) {
      notify({
        message: error.message,
        type: 'error'
      });
    }
  };

  const handleBlogDelete = async () => {
    const isToBeDeleted = window.confirm(`Are you sure you want to delete the blog ${blog.title}?`);

    if (!isToBeDeleted) {
      return;
    }

    try {
      await dispatch(deleteBlog(blog.id));
      notify({
        message: `Blog ${blog.title} is successfully deleted`,
        type: 'success'
      });
    } catch (error) {
      notify({
        message: error.message,
        type: 'error'
      });
    }
  };

  return (
    <div className={`blog-card ${expanded ? 'expanded' : ''}`}>
      <div className="blog-title" onClick={() => setExpanded(!expanded)}>
        {blog.title} <span className="blog-author">by {blog.author}</span>
      </div>

      {expanded && (
        <div className="blog-details">
          <div>Author: {blog.author || 'unknown'}</div>
          <div>
            URL: <a href={blog.url}>{blog.url}</a>
          </div>
          <div className="blog-likes">
            <span>Likes: {blog.likes}</span>
            <button className="blog-like" onClick={handleBlogUpdate}>
              ❤️ Like
            </button>
          </div>
          {blog.user?.name && <div className="blog-user">User: {blog.user.name}</div>}
          {user?.id === blog.user?.id ? (
            <button className="btn btn-danger blog-delete" onClick={handleBlogDelete}>
              Delete
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Blog;

Blog.propTypes = {
  blog: PropTypes.object.isRequired
};
