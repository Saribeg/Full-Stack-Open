import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const EntityNotFound = ({ children }) => {
  return (
    <Box
      sx={{
        height: '40vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 2,
      }}
    >
      <ReportProblemIcon color="warning" sx={{ fontSize: 60 }} />
      <Box sx={{ maxWidth: 400 }}>
        {children}
      </Box>
    </Box>
  );
};

EntityNotFound.propTypes = {
  children: PropTypes.node
};

export default EntityNotFound;
