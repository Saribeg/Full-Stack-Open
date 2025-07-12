import PropTypes from 'prop-types';
import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNotification } from '../hooks';
import blogService from '../services/blogs';

const BlogForm = ({ toggleForm }) => {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogUrl, setBlogUrl] = useState('');

  const resetForm = () => {
    setBlogTitle('');
    setBlogAuthor('');
    setBlogUrl('');
  };

  const notify = useNotification();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: blogService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });

      notify({
        type: 'info',
        message: `Blog "${data.title}" is successfully created`
      });
      resetForm();
      toggleForm();
    },
    onError: (err, { title }) => {
      notify({
        type: 'error',
        message: `${err.response?.data?.error || err.message}. Your input is "${title}"`
      });
    }
  });

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleBlogCreation = (event) => {
    event.preventDefault();
    const newBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    };

    mutate(newBlog);
  };

  return (
    <div className="form-container">
      <h2>Create a new blog</h2>
      <form onSubmit={handleBlogCreation}>
        <div className="form-group">
          <label htmlFor="blogTitle">Title:</label>
          <input
            className="form-input"
            type="text"
            id="blogTitle"
            name="blogTitle"
            required
            value={blogTitle}
            onChange={handleChange(setBlogTitle)}
            data-testid="blogTitle"
          />
        </div>

        <div className="form-group">
          <label htmlFor="blogAuthor">Author:</label>
          <input
            className="form-input"
            type="text"
            id="blogAuthor"
            name="blogAuthor"
            required
            value={blogAuthor}
            onChange={handleChange(setBlogAuthor)}
            data-testid="blogAuthor"
          />
        </div>

        <div className="form-group">
          <label htmlFor="blogUrl">Url:</label>
          <input
            className="form-input"
            type="text"
            id="blogUrl"
            name="blogUrl"
            required
            value={blogUrl}
            onChange={handleChange(setBlogUrl)}
            data-testid="blogUrl"
          />
        </div>

        <div className="form-actions">
          <button
            className={`btn btn-primary${isPending ? ' btn-blocked' : ''}`}
            type="submit"
            id="createBlog"
            data-testid="createBlog"
            disabled={isPending}
          >
            {isPending ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;

BlogForm.propTypes = {
  toggleForm: PropTypes.func.isRequired
};