import PropTypes from 'prop-types';
import clsx from 'clsx';

const TableHead = ({ children, className = '', ...rest }) => {
  return (
    <thead className={clsx('bg-[#0b1120]', className)} {...rest}>
      {children}
    </thead>
  );
};

export default TableHead;

TableHead.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
