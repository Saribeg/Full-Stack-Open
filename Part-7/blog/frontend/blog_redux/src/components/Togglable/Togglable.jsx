import PropTypes from 'prop-types';
import { useState, forwardRef, useImperativeHandle } from 'react';
import './Togglable.css';

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  // I decided to use smooth scroll animation.
  // For this additional effect I used AI to learn more. )
  const toggleVisibility = () => {
    const willBeVisible = !visible;

    if (willBeVisible) {
      setVisible(true);

      const duration = 1000; // Total duration of the scroll animation (in milliseconds)
      const startTime = performance.now(); // Timestamp when the animation starts
      const startScroll = window.scrollY; // Current vertical scroll position
      const targetScroll = startScroll + 500; // Target scroll position (scroll 500px down from current position)

      /**
       * Callback function used by requestAnimationFrame.
       * Called before each browser repaint (~60 times/second).
       * It calculates how far we are into the animation based on time,
       * computes the current scroll position, and scrolls the page smoothly step by step.
       *
       * @param {DOMHighResTimeStamp} now - High precision timestamp provided by browser.
       */
      const animateScroll = (now) => {
        const elapsed = now - startTime; // Time elapsed since animation started
        const progress = Math.min(elapsed / duration, 1); // Calculate progress as a value between 0 (start) and 1 (complete)
        const scrollY = startScroll + (targetScroll - startScroll) * progress; // Calculate the current scroll position based on easing (linear here)

        window.scrollTo(0, scrollY); // Scroll to the calculated position at this stage

        // If animation is not yet complete, schedule the next frame
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      // Start the animation loop
      requestAnimationFrame(animateScroll);
    } else {
      setVisible(false);
    }
  };

  useImperativeHandle(refs, () => ({ toggleVisibility }));

  return (
    <div className="togglable-container">
      <button
        className={`btn toggler ${visible ? 'toggler-open' : 'toggler-closed'}`}
        onClick={toggleVisibility}
      >
        {visible ? '▲ Cancel' : `➕ ${props.buttonLabel}`}
      </button>

      <div className={`togglable-content ${visible ? 'open' : ''}`}>{props.children}</div>
    </div>
  );
});

export default Togglable;

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node
};
