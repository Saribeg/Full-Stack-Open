import PropTypes from 'prop-types';
import { useState, useRef, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import {
  Paper,
  Typography,
  IconButton,
  Stack,
  Box,
  Link
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon
} from '@mui/icons-material';

import { useDeleteComment } from '../../queries/blog';
import UserContext from '../../contexts/UserContext';
import CommentForm from './CommentForm';

const CommentItem = ({ comment, blogId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editFormRef = useRef(null);

  const { user: authUser } = useContext(UserContext);
  const { mutate: deleteComment } = useDeleteComment();

  const handleDelete = () => {
    deleteComment({ blogId, commentId: comment.id });
  };

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, mb: 1 }}
      data-testid="blog-comment"
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {comment.user ? (
            <Link
              component={RouterLink}
              to={`/users/${comment.user.id}`}
              underline="hover"
              color="primary"
              sx={{ fontWeight: 500 }}
            >
              {comment.user.name || comment.user.username}
            </Link>
          ) : (
            <Typography variant="subtitle2" color="text.secondary">
              Unknown
            </Typography>
          )}

          <Typography variant="caption" color="text.disabled">
            {new Date(comment.createdAt).toLocaleDateString()}
          </Typography>
          {comment.editedAt && (
            <Typography
              variant="caption"
              color="text.disabled"
              fontStyle="italic"
            >
              (edited {new Date(comment.editedAt).toLocaleDateString()})
            </Typography>
          )}
        </Stack>

        {authUser?.id === comment.user?.id && (
          <Stack direction="row" spacing={1}>
            {isEditing ? (
              <>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    editFormRef.current?.submit();
                  }}
                  title="Save"
                >
                  <SaveIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={() => setIsEditing(false)}
                  title="Cancel"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                  title="Edit"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={handleDelete}
                  title="Delete"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Stack>
        )}
      </Box>

      {isEditing ? (
        <CommentForm
          ref={editFormRef}
          id={blogId}
          commentId={comment.id}
          initialValue={comment.text}
          mode="edit"
          onCancel={() => setIsEditing(false)}
          formId={`edit-form-${comment.id}`}
        />
      ) : (
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {comment.text}
        </Typography>
      )}
    </Paper>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    editedAt: PropTypes.string,
    user: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      username: PropTypes.string,
    }),
  }).isRequired,
  blogId: PropTypes.string.isRequired,
};

export default CommentItem;