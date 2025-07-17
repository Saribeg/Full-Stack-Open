import PropTypes from 'prop-types';
import { clsx } from 'clsx';
import Button from './Form/Button';

const ToggleButton = ({ visible, label, className, ...rest }) => {
  return (
    <Button
      {...rest}
      className={clsx(
        'mt-4 font-medium transition-colors duration-200',
        visible ? 'bg-[#f2f2f2] text-[#333]' : 'bg-[#d6eaff] text-[#0053a0]',
        className
      )}
    >
      {visible ? '▲ Cancel' : `➕ ${label}`}
    </Button>
  );
};

ToggleButton.propTypes = {
  visible: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default ToggleButton;
