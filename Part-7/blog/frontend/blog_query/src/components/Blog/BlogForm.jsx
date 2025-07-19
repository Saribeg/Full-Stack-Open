import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  TextField,
  Button,
  Paper,
  Stack
} from '@mui/material';
import PageTitle from '../PageTitle';

import { useCreateBlog } from '../../queries/blog';

const BlogForm = ({ toggleForm }) => {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogUrl, setBlogUrl] = useState('');

  const resetForm = () => {
    setBlogTitle('');
    setBlogAuthor('');
    setBlogUrl('');
  };

  const { mutate, isPending } = useCreateBlog({
    onSuccess: () => {
      resetForm();
      toggleForm();
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
      url: blogUrl,
    };

    mutate(newBlog);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: 360, sm: 480, md: 560 }, // на десктопе — шире
        mx: 'auto',
        mt: 10
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          minHeight: { xs: 'auto', md: 350 },
          borderRadius: 2,
          mb: 4
        }}
      >
        <Stack spacing={3} component="form" onSubmit={handleBlogCreation}>
          <PageTitle variant="h5">Create a new blog</PageTitle>
          <TextField
            id="blogTitle"
            label="Title"
            value={blogTitle}
            onChange={handleChange(setBlogTitle)}
            required
            slotProps={{
              htmlInput: { 'data-testid': 'blogTitle' }
            }}
            fullWidth
          />
          <TextField
            id="blogAuthor"
            label="Author"
            value={blogAuthor}
            onChange={handleChange(setBlogAuthor)}
            required
            slotProps={{
              htmlInput: { 'data-testid': 'blogAuthor' }
            }}
            fullWidth
          />
          <TextField
            id="blogUrl"
            label="Url"
            value={blogUrl}
            onChange={handleChange(setBlogUrl)}
            required
            slotProps={{
              htmlInput: { 'data-testid': 'blogUrl' }
            }}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            id="createBlog"
            data-testid="createBlog"
            disabled={isPending}
          >
            {isPending ? 'Creating...' : 'Create'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default BlogForm;

BlogForm.propTypes = {
  toggleForm: PropTypes.func.isRequired
};