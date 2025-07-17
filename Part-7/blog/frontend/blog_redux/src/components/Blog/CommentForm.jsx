import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { createComment } from '../../store/blogDetails/thunks';
import { selectCreateCommentStatus } from '../../store/blogDetails/selectors';
import Textarea from '../ui/Form/Textarea';
import Button from '../ui/Form/Button';
import Form from '../ui/Form/Form';

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
      <Form onSubmit={handleCommentCreation}>
        <div className="form-group">
          <Textarea
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
          <Button
            type="submit"
            id="createBlogComment"
            data-testid="createBlogComment"
            disabled={loading}
          >
            {loading ? 'Adding Comment...' : 'Add Comment'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CommentForm;

CommentForm.propTypes = {
  id: PropTypes.string.isRequired
};
