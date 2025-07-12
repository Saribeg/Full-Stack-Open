import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNotification } from '../hooks';
import blogService from '../services/blogs';

const BlogForm = ({ modifyBlogs, toggleForm }) => {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogUrl, setBlogUrl] = useState('');

  const notify = useNotification();

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const resetForm = () => {
    setBlogTitle('');
    setBlogAuthor('');
    setBlogUrl('');
  };

  const handleBlogCreation = async (event) => {
    event.preventDefault();
    const newBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    };

    try {
      var createdBlog = await blogService.create(newBlog);
      modifyBlogs('add', createdBlog);
      resetForm();
      notify({
        message: `Blog ${createdBlog.title} is successfully created`,
        type: 'success'
      });
      toggleForm();
    } catch (error) {
      notify({
        message: error.message,
        type: 'error'
      });
    }
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
          <button className="btn btn-primary" type="submit" id="createBlog" data-testid="createBlog">Create</button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;

BlogForm.propTypes = {
  modifyBlogs: PropTypes.func.isRequired,
  toggleForm: PropTypes.func.isRequired
};