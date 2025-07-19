import { Box, Typography, Link as MuiLink } from '@mui/material';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

const ProjectGoals = () => {
  return (
    <Box component="section" sx={{ mb: 6 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <TrackChangesIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>
          Project Goals
        </Typography>
      </Box>

      <Box>
        <Typography variant="body1" color="text.secondary" component="p" sx={{ mb: 2 }}>
          The goal of this project was to implement a blog application based on the official
          requirements from Parts 1–7 of the{' '}
          <MuiLink
            href="https://fullstackopen.com/en/"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            color="primary"
          >
            Full Stack Open
          </MuiLink>{' '}
          course. While the functional scope was predefined, I focused on applying scalable and
          maintainable patterns using modern tools and best practices.
        </Typography>

        <Box component="ul" sx={{ pl: 3, mb: 3 }}>
          <li>
            <Typography variant="body1" color="text.secondary">
              DRY principles and reusability
            </Typography>
          </li>
          <li>
            <Typography variant="body1" color="text.secondary">
              Declarative data fetching and mutation logic with React Query
            </Typography>
          </li>
          <li>
            <Typography variant="body1" color="text.secondary">
              Clean and modular component structure
            </Typography>
          </li>
          <li>
            <Typography variant="body1" color="text.secondary">
              Thoughtful feature planning without unnecessary complexity
            </Typography>
          </li>
        </Box>

        <Typography variant="body1" color="text.secondary" component="p" sx={{ mb: 2 }}>
          Unlike my previous Redux-based version, this project uses{' '}
          <strong>React Query</strong> to manage server state. I wanted to compare these different
          approaches and gain hands-on experience with React Query as I did not have it in the past unlike redux.
        </Typography>

        <Typography variant="body1" color="text.secondary" component="p" sx={{ mb: 2 }}>
          For the UI, I chose <strong>Material UI (MUI)</strong> — a widely adopted component
          library with a different philosophy compared to Tailwind CSS. The goal was to build a
          polished interface using prebuilt components.
        </Typography>

        <Typography variant="body1" color="text.secondary">
          If the final result feels modular, consistent, and maintainable — then I consider my goals
          achieved.{' '}
          <span role="img" aria-label="smile">
            😊
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default ProjectGoals;
