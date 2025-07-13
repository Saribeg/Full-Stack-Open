import { useContext } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '../../hooks';
import blogService from '../../services/blogs';
import UserContext from '../../contexts/UserContext';
import './BlogDetails.css';

const BlogDetails = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const notify = useNotification();
  const navigate = useNavigate();

  const { data: blog, isLoading } = useQuery({
    queryKey: ['selectedBlog', id],
    queryFn: () => blogService.getById(id),
    onError: (error) => {
      notify({
        type: 'error',
        message: `Failed to fetch blog. Error: "${error.message}"`
      });
    }
  });

  const queryClient = useQueryClient();
  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.setQueryData(['selectedBlog', updatedBlog.id], updatedBlog);

      notify({
        message: `Blog ${updatedBlog.title} is successfully updated`,
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
      navigate('/blogs');
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
    </div>
  );
};

export default BlogDetails;