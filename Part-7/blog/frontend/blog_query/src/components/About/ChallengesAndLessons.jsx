import { Box, Typography, Stack } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Code from './Code';

const ChallengesAndLessons = () => {
  return (
    <Box component="section" sx={{ mb: 6 }}>
      <Stack direction="row" alignItems="center" gap={1} mb={2}>
        <LightbulbIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>
          Challenges & Lessons Learned
        </Typography>
      </Stack>

      <Stack spacing={4}>
        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Streamlined Notifications with <Code>useNotification</Code>
          </Typography>
          <Typography color="text.secondary">
            Instead of managing toasts manually in every component, I created a custom hook{' '}
            <Code>useNotification</Code> to encapsulate the logic and keep views clean.
            While React Query lacks middleware like Redux, this approach still improved readability and
            consistency in handling success and error feedback.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Organized Queries
          </Typography>
          <Typography color="text.secondary">
            All queries and mutations are separated into domain-specific folders (e.g.{' '}
            <Code>src/queries/blog</Code>), keeping view components minimal and focused on UI logic.
            This structure mirrors how one might organize services or API layers in a larger app.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Fixing User Initialization Bug
          </Typography>
          <Typography color="text.secondary">
            I created a dedicated <Code>UserInitializer</Code> component to handle initial user
            state loading from localStorage and session validation. Without this, the login form
            would momentarily flash on screen before the user context was ready. Centralizing this
            logic avoided race conditions and made authentication flows more predictable.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Provider Consolidation
          </Typography>
          <Typography color="text.secondary">
            The app relies on several high-level providers: <Code>QueryClientProvider</Code>,{' '}
            <Code>UserContextProvider</Code>, <Code>NotificationContextProvider</Code>, plus routing and
            user initialization. Instead of cluttering <Code>main.jsx</Code>, I moved everything into a
            single <Code>Providers.jsx</Code> wrapper. This makes the entry point cleaner and ensures all
            app-wide logic — including context setup and React Query devtools — is centralized and easy to
            maintain.
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default ChallengesAndLessons;
