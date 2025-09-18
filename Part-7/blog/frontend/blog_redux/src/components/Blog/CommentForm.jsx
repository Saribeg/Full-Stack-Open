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
  onCancel
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
      <Form onSubmit={handleSubmit}>
        <Textarea
          id="comment"
          name="comment"
          placeholder="Write comment..."
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading
              ? mode === 'create'
                ? 'Adding...'
                : 'Saving...'
              : mode === 'create'
                ? 'Add'
                : 'Save'}
          </Button>
          {mode === 'edit' && (
            <Button uiType="ghost" type="button" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
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
