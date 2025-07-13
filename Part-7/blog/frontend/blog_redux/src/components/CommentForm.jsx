import { useDispatch } from 'react-redux';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { createComment } from '../store/reducers/blogsReducer';
import { useNotification } from '../hooks';

const CommentForm = ({ id }) => {
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const notify = useNotification();

  const handleCommentCreation = async (event) => {
    event.preventDefault();

    try {
      dispatch(createComment({ id, comment }));
      setComment('');
      notify({
        message: 'Comment is successfully added',
        type: 'success'
      });
    } catch (error) {
      notify({
        message: error.message,
        type: 'error'
      });
    }
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
            className="btn btn-primary"
            type="submit"
            id="createBlogComment"
            data-testid="createBlogComment"
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
