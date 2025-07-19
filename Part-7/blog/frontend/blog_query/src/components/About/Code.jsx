import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const Code = ({ children }) => {
  return (
    <Box
      component="code"
      sx={{
        bgcolor: 'grey.100',
        color: 'primary.main',
        px: 0.6,
        py: 0.3,
        borderRadius: 1,
        fontFamily: 'Monospace',
        fontSize: '0.875rem',
      }}
    >
      {children}
    </Box>
  );
};

Code.propTypes = {
  children: PropTypes.node.isRequired
};

export default Code;
