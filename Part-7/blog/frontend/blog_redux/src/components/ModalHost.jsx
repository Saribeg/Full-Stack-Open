import { useSelector, useDispatch } from 'react-redux';

import Modal from './ui/Modal';
import DeleteBlogModal from './Blog/DeleteBlogModal';

import { selectModal } from '../store/modal/selectors';
import { hideModal } from '../store/modal/slice';

const ModalHost = () => {
  const dispatch = useDispatch();
  const { isOpened, type, params } = useSelector(selectModal);

  const onClose = () => dispatch(hideModal());

  return (
    <Modal isOpened={isOpened} onClose={onClose}>
      {type === 'confirmBlogDelete' && <DeleteBlogModal params={params} />}
    </Modal>
  );
};

export default ModalHost;
