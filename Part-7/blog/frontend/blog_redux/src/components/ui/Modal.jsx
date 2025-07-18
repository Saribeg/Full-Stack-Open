import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { AiOutlineClose } from 'react-icons/ai';
import clsx from 'clsx';

const modalRoot = document.getElementById('modal-root');

const Modal = ({ isOpened = false, onClose, children }) => {
  if (!isOpened) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className={clsx(
          'w-[90%] max-w-xl min-w-[320px]',
          'rounded-2xl border border-cyan-800',
          'bg-gradient-to-b from-[#0b1120] to-[#071726]',
          'p-8 text-white shadow-[0_0_12px_#0891b233]'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-xl font-semibold">Confirm blog deletion</h2>
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="cursor-pointer text-cyan-300 transition hover:text-cyan-100"
            aria-label="Close"
          >
            <AiOutlineClose className="text-2xl" />
          </button>
        </div>

        {children}
      </div>
    </div>,
    modalRoot
  );
};

Modal.propTypes = {
  isOpened: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  children: PropTypes.node
};

export default Modal;
