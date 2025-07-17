import PropTypes from 'prop-types';
import clsx from 'clsx';

const TableRow = ({ children, className = '', ...rest }) => {
  return (
    <tr
      className={clsx(
        'transition-colors duration-200 odd:bg-[#132633] even:bg-[#1b2c3a] hover:bg-[#003e71]',
        className
      )}
      {...rest}
    >
      {children}
    </tr>
  );
};

export default TableRow;

TableRow.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
