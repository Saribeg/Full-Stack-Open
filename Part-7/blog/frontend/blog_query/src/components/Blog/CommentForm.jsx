
import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { useNotification } from '../../hooks';
import blogService from '../../services/blogs';

const CommentForm = ({ id }) => {
  const [comment, setComment] = useState('');
  const notify = useNotification();

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: blogService.createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['selectedBlog', id] });
      setComment('');
      notify({
        type: 'info',
        message: 'Comment is successfully added'
      });
    },
    onError: (err) => {
      notify({
        type: 'error',
        message: err.response?.data?.error || err.message
      });
    }
  });

  const handleCommentCreation = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    mutate({ id, comment });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleCommentCreation}>
        <div className="form-group">
          <input
            className="form-input"
            type="text"
            id="comment"
            name="comment"
            placeholder="Write comment..."
            required
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            data-testid="comment"
          />
        </div>

        <div className="form-actions">
          <button
            className={`btn btn-primary${isPending ? ' btn-blocked' : ''}`}
            type="submit"
            id="createBlogComment"
            data-testid="createBlogComment"
            disabled={isPending}
          >
            Add Comment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;

CommentForm.propTypes = {
  id: PropTypes.string.isRequired
};
