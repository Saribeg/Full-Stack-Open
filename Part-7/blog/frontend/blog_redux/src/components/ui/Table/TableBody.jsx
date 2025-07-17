import PropTypes from 'prop-types';
import clsx from 'clsx';

const TableBody = ({ children, className = '', ...rest }) => {
  return (
    <tbody className={clsx('px-4 py-2 text-left', className)} {...rest}>
      {children}
    </tbody>
  );
};

export default TableBody;

TableBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
