import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Stack,
  TextField,
  Button,
  Typography,
  Box
} from '@mui/material';

import { useCreateComment } from '../../queries/blog';

const CommentForm = ({ id }) => {
  const [comment, setComment] = useState('');
  const { mutate, isPending } = useCreateComment();

  const handleCommentCreation = (event) => {
    event.preventDefault();
    if (!comment.trim()) return;

    mutate(
      { id, comment },
      {
        onSuccess: () => setComment(''),
      }
    );
  };

  return (
    <Box sx={{ maxWidth: 600, my: 4 }}>
      <Typography variant="h6" gutterBottom>
        Add a Comment
      </Typography>

      <Stack
        spacing={2}
        component="form"
        onSubmit={handleCommentCreation}
      >
        <TextField
          id="comment"
          label="Your comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          multiline
          minRows={4}
          data-testid="comment"
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          id="createBlogComment"
          data-testid="createBlogComment"
          disabled={isPending}
        >
          {isPending ? 'Posting...' : 'Add Comment'}
        </Button>
      </Stack>
    </Box>
  );
};

export default CommentForm;

CommentForm.propTypes = {
  id: PropTypes.string.isRequired,
};
