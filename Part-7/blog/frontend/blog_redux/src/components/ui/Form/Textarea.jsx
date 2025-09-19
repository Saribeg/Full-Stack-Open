import PropTypes from 'prop-types';
import clsx from 'clsx';

const Textarea = ({ className = '', compact = false, ...rest }) => {
  return (
    <textarea
      className={clsx(
        'w-full rounded-xl transition duration-200 outline-none',
        'text-white placeholder:text-cyan-200',
        compact
          ? [
              'min-h-[40px]',
              'bg-[#1a2c44]',
              'px-3 py-2 text-base',
              'border border-cyan-600/60',
              'shadow-[0_0_8px_rgba(8,145,178,0.35)]',
              'focus:ring-1 focus:ring-cyan-400'
            ]
          : [
              'min-h-[96px]',
              'bg-gradient-to-b from-[#0e1a2f] to-[#071726]',
              'px-4 py-3 text-base font-medium',
              'border-0',
              'focus:ring-2 focus:ring-cyan-500'
            ],
        className
      )}
      {...rest}
    />
  );
};

Textarea.propTypes = {
  className: PropTypes.string,
  compact: PropTypes.bool
};

export default Textarea;
