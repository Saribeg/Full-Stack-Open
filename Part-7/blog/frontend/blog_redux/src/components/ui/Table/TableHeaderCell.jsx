import PropTypes from 'prop-types';
import clsx from 'clsx';

const TableHeaderCell = ({ children, className = '', ...rest }) => {
  return (
    <th className={clsx('px-4 py-2 text-left', className)} {...rest}>
      {children}
    </th>
  );
};

export default TableHeaderCell;

TableHeaderCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
