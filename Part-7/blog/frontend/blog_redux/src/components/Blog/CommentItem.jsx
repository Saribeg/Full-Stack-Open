import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaTrash, FaRegEdit } from 'react-icons/fa';
import TextLink from '../ui/TextLink';
import { deleteComment } from '../../store/blogDetails/thunks';
import CommentForm from './CommentForm';

const CommentItem = ({ comment, authUser, blogId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteComment({ blogId, commentId: comment.id }));
  };

  return (
    <li className="relative rounded-2xl border border-cyan-800 bg-gradient-to-b from-[#0b1120] to-[#071625] p-4 text-lg leading-relaxed text-cyan-100/90 shadow-[0_0_6px_#0891b233]">
      <div className="mb-2 flex items-center justify-between text-sm text-cyan-400">
        {/* user + date */}
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
        </span>

        {authUser?.id === comment.user?.id && !isEditing && (
          <div className="flex gap-3">
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
  authUser: PropTypes.shape({
    id: PropTypes.string
  })
};

export default CommentItem;
