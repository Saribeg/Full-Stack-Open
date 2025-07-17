import { FaHeart } from 'react-icons/fa';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const LikeButton = ({ count = 0, onClick, className = '', ...rest }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'group flex items-center gap-2 rounded-2xl px-6 py-3',
        'border border-cyan-700/40 bg-[#0f172a]',
        'shadow-[inset_0_0_6px_#0891b2] hover:shadow-[0_0_10px_#22d3ee33]',
        'transition-all duration-200 ease-in-out',
        'cursor-pointer text-cyan-300 hover:text-cyan-100 active:scale-95',
        className
      )}
      {...rest}
    >
      <FaHeart className="text-2xl text-cyan-300 transition-colors duration-200 group-hover:text-cyan-200" />
      <span className="text-lg font-medium">{count}</span>
    </button>
  );
};

LikeButton.propTypes = {
  count: PropTypes.number,
  onClick: PropTypes.func,
  className: PropTypes.string,
  liked: PropTypes.bool
};

export default LikeButton;
