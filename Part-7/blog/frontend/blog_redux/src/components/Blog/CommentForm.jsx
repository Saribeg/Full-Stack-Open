import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Textarea from '../ui/Form/Textarea';
import Button from '../ui/Form/Button';
import Form from '../ui/Form/Form';
import InlineNotification from '../Notification/InlineNotification';

import PropTypes from 'prop-types';
import { createComment } from '../../store/blogDetails/thunks';
import { selectCreateCommentStatus } from '../../store/blogDetails/selectors';

const CommentForm = ({ id, toggleForm }) => {
  const [comment, setComment] = useState('');
  const { loading } = useSelector(selectCreateCommentStatus);
  const dispatch = useDispatch();

  const handleCommentCreation = (event) => {
    event.preventDefault();
    dispatch(createComment({ id, comment }))
      .unwrap()
      .then(() => {
        setComment('');
        toggleForm();
      });
  };

  return (
    <div className="form-container mt-10">
      <Form onSubmit={handleCommentCreation}>
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

        <Button
          type="submit"
          id="createBlogComment"
          data-testid="createBlogComment"
          disabled={loading}
        >
          {loading ? 'Adding Comment...' : 'Add Comment'}
        </Button>
        <InlineNotification placement="CommentForm" />
      </Form>
    </div>
  );
};

export default CommentForm;

CommentForm.propTypes = {
  id: PropTypes.string.isRequired,
  toggleForm: PropTypes.func
};
