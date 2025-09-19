import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import {
  Stack,
  TextField,
  Button,
  Typography,
  Box
} from '@mui/material';

import { useCreateComment, useUpdateComment } from '../../queries/blog';

const CommentForm = forwardRef(
  ({ id, commentId, initialValue = '', mode = 'create', onCancel, formId }, ref) => {
    const [comment, setComment] = useState(initialValue);

    const { mutate: createComment, isPending: isCreating } = useCreateComment();
    const { mutate: updateComment } = useUpdateComment();

    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(new Event('submit', { cancelable: true, bubbles: true }))
    }));

    const handleSubmit = (event) => {
      if (event?.preventDefault) event.preventDefault();
      if (!comment.trim()) return;

      if (mode === 'edit' && comment === initialValue) {
        onCancel?.();
        return;
      }

      if (mode === 'edit') {
        updateComment(
          { blogId: id, commentId, comment },
          {
            onSuccess: () => {
              if (onCancel) onCancel();
            }
          }
        );
      } else {
        createComment(
          { id, comment },
          {
            onSuccess: () => setComment(''),
          }
        );
      }
    };

    return (
      <Box sx={{ maxWidth: 600, my: 2 }}>
        {mode === 'create' && (
          <Typography variant="h6" gutterBottom>
            Add a Comment
          </Typography>
        )}

        <Stack
          spacing={2}
          component="form"
          onSubmit={handleSubmit}
          id={formId}
        >
          <TextField
            id="comment"
            label={mode === 'edit' ? 'Edit comment' : 'Your comment'}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            multiline
            minRows={mode === 'edit' ? 2 : 4}
            data-testid="comment"
            fullWidth
          />
          {mode === 'create' && (
            <Button
              type="submit"
              variant="contained"
              size="large"
              id="createBlogComment"
              data-testid="createBlogComment"
              disabled={isCreating}
            >
              {isCreating ? 'Posting...' : 'Add Comment'}
            </Button>
          )}
        </Stack>
      </Box>
    );
  }
);

CommentForm.displayName = 'CommentForm';

CommentForm.propTypes = {
  id: PropTypes.string.isRequired,
  commentId: PropTypes.string,
  initialValue: PropTypes.string,
  mode: PropTypes.oneOf(['create', 'edit']),
  onCancel: PropTypes.func,
  formId: PropTypes.string,
};

export default CommentForm;