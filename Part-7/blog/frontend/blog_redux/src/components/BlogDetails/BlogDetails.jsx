import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { likeBlog, deleteBlog } from '../../store/reducers/blogsReducer';
import { useNotification } from '../../hooks';
import { getBlogById, setSelectedBlog } from '../../store/reducers/blogsReducer';
import './BlogDetails.css';

const BlogDetails = () => {
  const user = useSelector((state) => state.user);
  const blog = useSelector((state) => state.blogs.selectedBlog);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = useNotification();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getBlogById(id));
    return () => dispatch(setSelectedBlog(null));
  }, [dispatch, id]);

  const handleBlogUpdate = async () => {
    try {
      const updatedBlog = await dispatch(likeBlog(blog));
      dispatch(setSelectedBlog(updatedBlog));
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
      navigate('/blogs');
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

  if (!blog) return <div>Loading...</div>;

  return (
    <div className="blog-card">
      <h2 className="blog-title">
        "{blog.title}" <span className="blog-author">by {blog.author}</span>
      </h2>
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
        {blog.user?.name && <div className="blog-user">Added by {blog.user.name}</div>}
        {user?.id === blog.user?.id ? (
          <button className="btn btn-danger blog-delete" onClick={handleBlogDelete}>
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default BlogDetails;
