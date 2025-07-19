import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Paper, Stack, Typography, Divider, IconButton, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

import CommentForm from './CommentForm';
import PageTitle from '../PageTitle';
import BlogDeleteDialog from './BlogDeleteDialog';
import Spinner from '../Spinner';

import UserContext from '../../contexts/UserContext';
import { useBlogById, useLikeBlog, useDeleteBlog } from '../../queries/blog';

import EntityNotFound from '../EntityNotFound';

const BlogDetails = () => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { id } = useParams();
  const { user } = useContext(UserContext);

  const { data: blog, isLoading } = useBlogById(id);


  const { mutate: likeBlog, isPending: isLiking } = useLikeBlog();
  const { mutate: deleteBlog, isPending: isDeleting } = useDeleteBlog({
    onSuccess: () => {
      setDeleteDialogOpen(false);
    },
  });

  const handleBlogUpdate = () => {
    likeBlog({ ...blog, likes: blog.likes + 1 });
  };

  const handleBlogDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmBlogDelete = () => {
    deleteBlog({ id: blog.id, title: blog.title });
  };

  if (isLoading) return <Spinner />;
  if (!blog) return (
    <EntityNotFound>
      <Typography variant="h6" color="text.secondary">
        Hi, <strong>{user.name}</strong>. Blog with id <strong>{id}</strong> is not found. Use Header to navigate to necessary page.
      </Typography>
    </EntityNotFound>
  );

  return (
    <Box>
      <Paper elevation={3} square={false} sx={{ maxWidth: 600, ml: 0, p: 4 }}>
        <PageTitle sx={{ mb: 4 }} variant="h4">{blog.title} <span className="blog-author">by {blog.author}</span></PageTitle>
        <Divider sx={{ mb: 4 }}/>
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Typography>Author: {blog.author || 'unknown'}</Typography>
          <Typography>URL: <a href={blog.url}>{blog.url}</a></Typography>
          {blog.user?.name && <Typography className='blog-user'>User: {blog.user.name}</Typography>}
        </Stack>
        <Divider sx={{ mb: 4 }}/>
        <Stack direction="row" gap={5} alignItems="center">
          <Stack direction="row" gap={0.5} alignItems="center">
            <IconButton
              onClick={handleBlogUpdate}
              disabled={isLiking}
              color="error"
            >
              <FavoriteIcon fontSize="large" />
            </IconButton>
            <Typography variant="body1" sx={{ alignSelf: 'center', fontSize: '1.2rem', fontWeight: 500 }}>
              {blog.likes || 0}
            </Typography>
          </Stack>
          {
            user?.id === blog.user?.id && (
              <>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleBlogDelete}
                  disabled={isDeleting}
                  sx={{ px: 4, py: 1 }}
                >
                  Delete
                </Button>
                <BlogDeleteDialog
                  open={isDeleteDialogOpen}
                  onClose={() => setDeleteDialogOpen(false)}
                  onConfirm={confirmBlogDelete}
                  blog={blog}
                />
              </>
            )
          }
        </Stack>
      </Paper>

      {blog.comments?.length > 10 && <CommentForm id={blog.id} />}

      {blog.comments?.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Comments
          </Typography>
          <Stack
            component="ul"
            spacing={1}
            sx={{
              listStyle: 'none',
              pl: 0,
            }}
          >
            {blog.comments.map((comment) => (
              <Paper
                key={comment.id}
                variant="outlined"
                sx={{ p: 1.5 }}
              >
                <Typography>{comment.text}</Typography>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}

      <CommentForm id={blog.id} />
    </Box>
  );
};

export default BlogDetails;