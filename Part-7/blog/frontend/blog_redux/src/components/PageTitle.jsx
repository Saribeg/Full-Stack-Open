import PropTypes from 'prop-types';
import clsx from 'clsx';

const PageTitle = ({ children, className = '' }) => {
  return (
    <h2 className={clsx('my-6 text-3xl font-semibold tracking-tight', className)}>{children}</h2>
  );
};

PageTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default PageTitle;
