import { useState } from 'react';
import PropTypes from 'prop-types';
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
  id: PropTypes.string.isRequired,
};