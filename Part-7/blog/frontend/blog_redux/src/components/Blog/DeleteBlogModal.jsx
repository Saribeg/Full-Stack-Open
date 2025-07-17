import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Form/Button';
import { deleteBlog } from '../../store/blogDetails/thunks';
import { hideModal } from '../../store/modal/slice';

const DeleteBlogModal = ({ params }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blog } = params;

  const handleConfirmDelete = () => {
    dispatch(deleteBlog(blog.id))
      .unwrap()
      .then(() => {
        dispatch(hideModal());
        navigate('/blogs');
      });
  };

  return (
    <div className="space-y-6 text-cyan-100">
      <h2 className="text-xl font-semibold">
        Are you sure you want to delete the blog{' '}
        <span className="text-red-400">"{blog.title}"</span> by{' '}
        <span className="text-red-400">"{blog.author}"</span>?
      </h2>

      <Button uiType="ghostDanger" onClick={handleConfirmDelete}>
        Delete
      </Button>
    </div>
  );
};

DeleteBlogModal.propTypes = {
  params: PropTypes.shape({
    blog: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default DeleteBlogModal;
