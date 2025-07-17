import PropTypes from 'prop-types';
import clsx from 'clsx';

const Table = ({ children, className = '', ...rest }) => {
  return (
    <table
      className={clsx(
        'w-full overflow-hidden rounded-xl border border-blue-500/30 text-left',
        className
      )}
      {...rest}
    >
      {children}
    </table>
  );
};

export default Table;

Table.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
