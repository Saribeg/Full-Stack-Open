import PropTypes from 'prop-types';
import clsx from 'clsx';

const TableCell = ({ children, className = '', ...rest }) => {
  return (
    <td className={clsx('px-4 py-3 text-left text-sm', className)} {...rest}>
      {children}
    </td>
  );
};

export default TableCell;

TableCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
