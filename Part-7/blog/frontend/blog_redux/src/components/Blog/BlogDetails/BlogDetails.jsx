import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { selectAuth } from '../../../store/auth/selectors';
import { selectBlogDetailsState } from '../../../store/blogDetails/selectors';
import { fetchBlogById, likeBlog, deleteBlog } from '../../../store/blogDetails/thunks';
import CommentForm from '../CommentForm';
import './BlogDetails.css';

const BlogDetails = () => {
  const authUser = useSelector(selectAuth);
  const { blog, loading } = useSelector(selectBlogDetailsState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchBlogById(id));
  }, [dispatch, id]);

  const handleBlogUpdate = () => {
    dispatch(likeBlog(blog));
  };

  const handleBlogDelete = () => {
    const isToBeDeleted = window.confirm(`Are you sure you want to delete the blog ${blog.title}?`);

    if (!isToBeDeleted) {
      return;
    }

    dispatch(deleteBlog(blog.id))
      .unwrap()
      .then(() => navigate('/blogs'));
  };

  if (loading) return <div>Loading...</div>;

  if (!blog) return <div>Blog not found</div>;

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
        {authUser?.id === blog.user?.id ? (
          <button className="btn btn-danger blog-delete" onClick={handleBlogDelete}>
            Delete
          </button>
        ) : null}
        {blog.comments && (
          <>
            <h3>Comments</h3>
            <ul>
              {blog.comments.map((comment) => (
                <li key={comment.id}>{comment.text}</li>
              ))}
            </ul>
          </>
        )}
        <CommentForm id={blog.id} />
      </div>
    </div>
  );
};

export default BlogDetails;
