import PropTypes from 'prop-types';
import clsx from 'clsx';

const Label = ({ htmlFor, className = '', children, ...rest }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx('mb-1 block text-sm font-medium text-gray-700', className)}
      {...rest}
    >
      {children}
    </label>
  );
};

Label.propTypes = {
  htmlFor: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Label;
