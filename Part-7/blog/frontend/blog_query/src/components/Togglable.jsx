import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import { Box, Button, Collapse } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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
    <Box mt={3}>
      <Button
        variant={visible ? 'outlined' : 'contained'}
        color={visible ? 'info' : 'primary'}
        startIcon={visible ? <KeyboardArrowUpIcon /> : <AddIcon />}
        onClick={toggleVisibility}
        sx={{
          fontWeight: 500,
          mb: 2,
        }}
        data-testid="blog-create-toggle"
      >
        {visible ? 'Cancel' : buttonLabel}
      </Button>

      <Collapse in={visible} timeout={1000}>
        <Box
          sx={{
            mt: 1,
            px: 2,
            py: 2,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            boxShadow: 2,
          }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
});

export default Togglable;

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node,
  isContentAtTheBottom: PropTypes.bool,
};