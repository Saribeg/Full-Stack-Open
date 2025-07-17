import PropTypes from 'prop-types';
import clsx from 'clsx';

const Button = ({ uiType = 'primary', className = '', children, ...rest }) => {
  const base =
    'inline-flex items-center justify-center px-6 py-3 rounded-2xl font-semibold text-base cursor-pointer transition-all duration-200 ease-in-out';

  const variants = {
    primary: clsx(
      'bg-gradient-to-br from-blue-500 to-blue-700 text-white',
      'shadow-[0_0_8px_#3b82f633]',
      'hover:brightness-110 active:scale-95'
    ),
    danger: clsx(
      'bg-[#2b1212] text-red-300 border border-red-500',
      'shadow-[0_0_6px_#f8717177]',
      'hover:bg-red-800/30 hover:text-red-100 active:scale-95'
    ),
    ghostPrimary: clsx(
      'bg-transparent text-blue-400 border border-blue-500',
      'hover:bg-blue-500 hover:text-white',
      'focus:ring-2 focus:ring-blue-400 focus:outline-none',
      'transition-colors duration-200 ease-in-out'
    ),
    ghostDanger: clsx(
      'bg-transparent text-red-400 border border-[#cc4b4b]',
      'hover:bg-[#2b1212] hover:text-white',
      'focus:ring-2 focus:ring-[#2b1212] focus:outline-none',
      'transition-colors duration-200 ease-in-out'
    )
  };

  return (
    <button className={clsx(base, variants[uiType], className)} {...rest}>
      {children}
    </button>
  );
};

Button.propTypes = {
  uiType: PropTypes.oneOf(['primary', 'danger', 'ghostPrimary', 'ghostDanger']),
  className: PropTypes.string,
  children: PropTypes.node
};

export default Button;
