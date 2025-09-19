import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTrash, FaRegEdit, FaCheck, FaTimes } from 'react-icons/fa';

import TextLink from '../ui/TextLink';
import CommentForm from './CommentForm';

import { deleteComment } from '../../store/blogDetails/thunks';
import { selectAuth } from '../../store/auth/selectors';

const CommentItem = ({ comment, blogId }) => {
  const [isEditing, setIsEditing] = useState(false);

  const authUser = useSelector(selectAuth);
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteComment({ blogId, commentId: comment.id }));
  };

  return (
    <li className="relative rounded-2xl border border-cyan-800 bg-gradient-to-b from-[#0b1120] to-[#071625] p-4 text-lg leading-relaxed text-cyan-100/90 shadow-[0_0_6px_#0891b233]">
      <div className="mb-2 flex items-center justify-between text-sm text-cyan-400">
        <span className="flex items-center gap-2">
          {comment.user ? (
            <TextLink to={`/users/${comment.user.id}`}>
              {comment.user.name || comment.user.username}
            </TextLink>
          ) : (
            'Unknown'
          )}
          <span className="text-cyan-500/60">·</span>
          <span className="text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
          {comment.editedAt && (
            <>
              <span className="text-cyan-500/60">·</span>
              <span className="text-gray-400 italic">
                (edited {new Date(comment.editedAt).toLocaleDateString()})
              </span>
            </>
          )}
        </span>

        {authUser?.id === comment.user?.id && (
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  className="cursor-pointer text-cyan-300 hover:text-cyan-100"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(`edit-form-${comment.id}`)?.requestSubmit();
                  }}
                >
                  <FaCheck className="h-5 w-5" />
                </button>
                <button
                  className="cursor-pointer text-gray-400 hover:text-gray-200"
                  onClick={() => setIsEditing(false)}
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  className="cursor-pointer text-cyan-300 hover:text-cyan-100"
                  onClick={() => setIsEditing(true)}
                >
                  <FaRegEdit className="h-5 w-5" />
                </button>
                <button
                  className="cursor-pointer text-gray-400 hover:text-gray-200"
                  onClick={handleDelete}
                >
                  <FaTrash className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <CommentForm
          id={blogId}
          commentId={comment.id}
          initialValue={comment.text}
          mode="edit"
          onCancel={() => setIsEditing(false)}
          formId={`edit-form-${comment.id}`}
        />
      ) : (
        <div>{comment.text}</div>
      )}
    </li>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      username: PropTypes.string
    })
  }).isRequired,
  blogId: PropTypes.string.isRequired
};

export default CommentItem;
