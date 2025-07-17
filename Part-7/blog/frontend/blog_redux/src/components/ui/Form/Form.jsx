import PropTypes from 'prop-types';
import clsx from 'clsx';

const Form = ({ children, className = '', ...rest }) => {
  return (
    <form className={clsx('flex flex-col gap-4', className)} {...rest}>
      {children}
    </form>
  );
};

Form.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Form;
