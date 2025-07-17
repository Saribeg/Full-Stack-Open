import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { createBlog } from '../../store/blogs/thunks';
import { selectCreateBlogStatus } from '../../store/blogs/selectors';
import Input from '../ui/Form/Input';
import Button from '../ui/Form/Button';
import Form from '../ui/Form/Form';

const BlogForm = ({ toggleForm }) => {
  const { loading } = useSelector(selectCreateBlogStatus);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogUrl, setBlogUrl] = useState('');

  const dispatch = useDispatch();

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const resetForm = () => {
    setBlogTitle('');
    setBlogAuthor('');
    setBlogUrl('');
  };

  const handleBlogCreation = (event) => {
    event.preventDefault();
    const newBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    };

    dispatch(createBlog(newBlog))
      .unwrap()
      .then(() => {
        resetForm();
        toggleForm();
      });
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-xl px-4 sm:px-6">
      <p className="my-4 text-xl">Create a new blog</p>
      <Form onSubmit={handleBlogCreation}>
        <Input
          type="text"
          id="blogTitle"
          name="blogTitle"
          required
          value={blogTitle}
          placeholder="Enter blog title"
          onChange={handleChange(setBlogTitle)}
          data-testid="blogTitle"
        />
        <Input
          type="text"
          id="blogAuthor"
          name="blogAuthor"
          required
          value={blogAuthor}
          placeholder="Enter blog author"
          onChange={handleChange(setBlogAuthor)}
          data-testid="blogAuthor"
        />
        <Input
          type="text"
          id="blogUrl"
          name="blogUrl"
          required
          value={blogUrl}
          placeholder="Enter blog url"
          onChange={handleChange(setBlogUrl)}
          data-testid="blogUrl"
        />
        <Button type="submit" id="createBlog" data-testid="createBlog" disabled={loading}>
          {loading ? 'Creating Blog...' : 'Create Blog'}
        </Button>
      </Form>
    </div>
  );
};

export default BlogForm;

BlogForm.propTypes = {
  toggleForm: PropTypes.func.isRequired
};
