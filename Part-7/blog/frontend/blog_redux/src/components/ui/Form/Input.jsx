import PropTypes from 'prop-types';
import clsx from 'clsx';

const Input = ({ className = '', ...rest }) => {
  return (
    <input
      className={clsx(
        'w-full rounded-xl border-none outline-none',
        'bg-gradient-to-b from-[#0e1a2f] to-[#071726]',
        'text-white placeholder:text-cyan-200',
        'px-4 py-3 text-base font-medium',
        'focus:ring-2 focus:ring-cyan-500',
        'transition duration-200',
        className
      )}
      {...rest}
    />
  );
};

export default Input;

Input.propTypes = {
  className: PropTypes.string
};
