import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Textarea from '../ui/Form/Textarea';
import Button from '../ui/Form/Button';
import Form from '../ui/Form/Form';
import InlineNotification from '../Notification/InlineNotification';

import PropTypes from 'prop-types';
import { createComment, updateComment } from '../../store/blogDetails/thunks';
import {
  selectCreateCommentStatus,
  selectUpdateCommentStatus
} from '../../store/blogDetails/selectors';

const CommentForm = ({
  id,
  commentId,
  initialValue = '',
  mode = 'create',
  toggleForm,
  onCancel,
  formId
}) => {
  const [comment, setComment] = useState(initialValue);
  const dispatch = useDispatch();
  const { loading } = useSelector(
    mode === 'create' ? selectCreateCommentStatus : selectUpdateCommentStatus
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const action =
      mode === 'create'
        ? createComment({ id, comment })
        : updateComment({ blogId: id, commentId, comment });

    dispatch(action)
      .unwrap()
      .then(() => {
        setComment('');
        toggleForm?.();
        onCancel?.();
      });
  };

  return (
    <div className="form-container mt-4">
      <Form onSubmit={handleSubmit} id={formId}>
        <Textarea
          type="text"
          id="comment"
          name="comment"
          placeholder="Write comment..."
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          data-testid="comment"
          className={mode === 'edit' ? 'min-h-[64px]' : ''}
          compact={mode === 'edit'}
        />

        {mode === 'create' && (
          <>
            <Button
              type="submit"
              id="createBlogComment"
              data-testid="createBlogComment"
              disabled={loading}
            >
              {loading ? 'Adding Comment...' : 'Add Comment'}
            </Button>
            <InlineNotification placement="CommentForm" />
          </>
        )}
      </Form>
    </div>
  );
};

export default CommentForm;

CommentForm.propTypes = {
  id: PropTypes.string.isRequired,
  commentId: PropTypes.string,
  initialValue: PropTypes.string,
  mode: PropTypes.oneOf(['create', 'edit']),
  toggleForm: PropTypes.func,
  onCancel: PropTypes.func,
  formId: PropTypes.string
};
