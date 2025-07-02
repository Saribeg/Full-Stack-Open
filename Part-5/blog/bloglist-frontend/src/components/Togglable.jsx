import PropTypes from 'prop-types';
import { useState, forwardRef, useImperativeHandle } from 'react';

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible(!visible);

  useImperativeHandle(refs, () => ({ toggleVisibility }));

  return (
    <div>
      {!visible && (
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      )}
      {visible && (
        <div>
          {props.children}
          <button onClick={toggleVisibility}>Cancel</button>
        </div>
      )}
    </div>
  );
});

export default Togglable;

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node
};