import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import ToggleButton from './ui/ToggleButton';

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);
  const { isContentAtTheBottom = false, buttonLabel, children } = props;

  // I decided to use smooth scroll animation when button is location at the bottom of the page.
  // For this additional effect I used AI to learn more. )
  const toggleVisibility = () => {
    const willBeVisible = !visible;
    setVisible(willBeVisible);

    if (willBeVisible && isContentAtTheBottom) {
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
    }
  };

  useImperativeHandle(refs, () => ({ toggleVisibility }));

  return (
    <div className="togglable-container">
      <ToggleButton
        className="mx-auto w-fit px-6 py-2"
        visible={visible}
        label={buttonLabel}
        onClick={toggleVisibility}
      />
      <div
        className={`overflow-hidden transition-all duration-700 ease-in-out ${
          visible
            ? `${isContentAtTheBottom ? 'mt-6' : ''} max-h-[1000px] opacity-100`
            : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
});

export default Togglable;

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node,
  isContentAtTheBottom: PropTypes.bool
};
