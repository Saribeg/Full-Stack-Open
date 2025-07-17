import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

const TextLink = ({ children, to = '', className = '', ...rest }) => {
  return (
    <Link
      className={clsx(
        'text-cyan-400 transition-colors duration-150 hover:text-cyan-300 hover:underline hover:brightness-110',
        className
      )}
      to={to}
      {...rest}
    >
      {children}
    </Link>
  );
};

TextLink.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default TextLink;
