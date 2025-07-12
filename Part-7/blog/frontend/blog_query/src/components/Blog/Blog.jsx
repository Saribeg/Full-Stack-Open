import PropTypes from 'prop-types';
import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNotification } from '../../hooks';
import blogService from '../../services/blogs';
import './Blog.css';

const Blog = ({ blog, user }) => {
  const [expanded, setExpanded] = useState(false);

  const notify = useNotification();
  const queryClient = useQueryClient();
  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });

      notify({
        message: `Blog ${data.title} is successfully updated`,
        type: 'success'
      });
    },
    onError: (err) => {
      notify({
        type: 'error',
        message: err.response?.data?.error || err.message
      });
    }
  });

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });

      notify({
        message: `Blog ${blog.title} is successfully deleted`,
        type: 'success'
      });
    },
    onError: (err) => {
      notify({
        type: 'error',
        message: err.response?.data?.error || err.message
      });
    }
  });

  const handleBlogUpdate = async () => {
    updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 });
  };

  const handleBlogDelete = async () => {
    const isToBeDeleted = window.confirm(`Are you sure you want to delete the blog ${blog.title}?`);

    if (!isToBeDeleted) {
      return;
    }

    deleteBlogMutation.mutate(blog.id);
  };

  return (
    <div
      className={`blog-card ${expanded ? 'expanded' : ''}`}
    >
      <div className="blog-title" onClick={() => setExpanded(!expanded)}>
        {blog.title} <span className="blog-author">by {blog.author}</span>
      </div>

      {expanded && (
        <div className="blog-details">
          <div>Author: {blog.author || 'unknown'}</div>
          <div>URL: <a href={blog.url}>{blog.url}</a></div>
          <div className='blog-likes'>
            <span>Likes: {blog.likes}</span>
            <button
              className={`blog-like${updateBlogMutation.isPending ? ' btn-blocked' : ''}`}
              onClick={handleBlogUpdate}
              disabled={updateBlogMutation.isPending}
            >
              ❤️ Like
            </button>
          </div>
          {blog.user?.name && <div className='blog-user'>User: {blog.user.name}</div>}
          {
            user?.id === blog.user?.id
              ? <button
                className={`btn btn-danger blog-delete${deleteBlogMutation.isPending ? ' btn-blocked' : ''}`}
                onClick={handleBlogDelete}
                disabled={deleteBlogMutation.isPending}
              >
                Delete
              </button>
              : null
          }
        </div>
      )}
    </div>
  );
};

export default Blog;

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};