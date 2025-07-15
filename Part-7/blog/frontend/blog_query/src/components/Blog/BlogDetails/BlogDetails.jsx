import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from '../../../contexts/UserContext';
import CommentForm from '../CommentForm';
import { useBlogById, useLikeBlog, useDeleteBlog } from '../../../queries/blog';
import './BlogDetails.css';

const BlogDetails = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);

  const { data: blog, isLoading } = useBlogById(id);
  const { mutate: likeBlog, isPending: isLiking } = useLikeBlog();
  const { mutate: deleteBlog, isPending: isDeleting } = useDeleteBlog();

  const handleBlogUpdate = () => {
    likeBlog({ ...blog, likes: blog.likes + 1 });
  };

  const handleBlogDelete = () => {
    const isToBeDeleted = window.confirm(`Are you sure you want to delete the blog ${blog.title}?`);
    if (isToBeDeleted) {
      deleteBlog({ id: blog.id, title: blog.title });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!blog) return <div>Blog not found.</div>;

  return (
    <div className="blog-card">
      <h2 className="blog-title">
        {blog.title} <span className="blog-author">by {blog.author}</span>
      </h2>
      <div className="blog-details">
        <div>Author: {blog.author || 'unknown'}</div>
        <div>URL: <a href={blog.url}>{blog.url}</a></div>
        <div className='blog-likes'>
          <span>Likes: {blog.likes}</span>
          <button
            className={`blog-like${isLiking ? ' btn-blocked' : ''}`}
            onClick={handleBlogUpdate}
            disabled={isLiking}
          >
            ❤️ Like
          </button>
        </div>
        {blog.user?.name && <div className='blog-user'>User: {blog.user.name}</div>}
        {
          user?.id === blog.user?.id &&
          <button
            className={`btn btn-danger blog-delete${isDeleting ? ' btn-blocked' : ''}`}
            onClick={handleBlogDelete}
            disabled={isDeleting}
          >
            Delete
          </button>
        }
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