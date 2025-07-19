import { Box, Typography, Link } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const AboutProject = () => {
  return (
    <Box component="section" sx={{ mb: 6 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <InfoIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>
          About This Project
        </Typography>
      </Box>

      <Typography variant="body1" color="text.secondary">
        This is a learning project built as part of the{' '}
        <Link
          href="https://fullstackopen.com/en/"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          color="primary"
        >
          Full Stack Open
        </Link>{' '}
        course by the University of Helsinki. It represents the Parts 1 - 7 implementation of the
        blog application using <strong>React Query</strong> for server state management and{' '}
        <strong>Material UI (MUI)</strong> for styling.
        <br />
        This version explores building a modular and declarative architecture using React Query's
        hooks and abstracted mutation logic. The UI is powered by MUI
        components with light customization, aiming for a consistent and polished visual experience.
      </Typography>
    </Box>
  );
};

export default AboutProject;
