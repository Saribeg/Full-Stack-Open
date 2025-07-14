import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { createComment } from '../store/blogDetails/thunks';
import { selectCreateCommentStatus } from '../store/blogDetails/selectors';

const CommentForm = ({ id }) => {
  const [comment, setComment] = useState('');
  const { loading } = useSelector(selectCreateCommentStatus);
  const dispatch = useDispatch();

  const handleCommentCreation = (event) => {
    event.preventDefault();
    dispatch(createComment({ id, comment }))
      .unwrap()
      .then(() => setComment(''));
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
            disabled={loading}
          >
            {loading ? 'Adding Comment...' : 'Add Comment'}
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
