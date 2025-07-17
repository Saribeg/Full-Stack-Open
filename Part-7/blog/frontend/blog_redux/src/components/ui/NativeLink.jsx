import PropTypes from 'prop-types';
import clsx from 'clsx';

const NativeLink = ({ children, href = '', className = '', ...rest }) => {
  return (
    <a
      className={clsx(
        'text-cyan-400 transition-colors duration-150 hover:text-cyan-300 hover:underline hover:brightness-110',
        className
      )}
      href={href}
      {...rest}
    >
      {children}
    </a>
  );
};

NativeLink.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default NativeLink;
