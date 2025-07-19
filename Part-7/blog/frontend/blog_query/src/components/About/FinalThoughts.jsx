import { Box, Typography } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

const FinalThoughts = () => {
  return (
    <Box component="section" sx={{ mb: 6 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <EmojiEmotionsIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>
          Final Thoughts
        </Typography>
      </Box>

      <Typography paragraph color="text.secondary">
        This version of the project had fewer architectural challenges than the Redux one, but it gave me a chance to explore idiomatic React Query and develop clean patterns for query organization, user bootstrapping, and layout management. The overall build was much smoother — which is a good sign.
      </Typography>

      <Typography paragraph color="text.secondary">
        One key takeaway: for smaller apps, Redux can easily become overkill. React Query handled all server-side state with less boilerplate, and I found myself writing fewer lines of code overall — faster implementation, cleaner logic.
      </Typography>

      <Typography paragraph color="text.secondary">
        I also appreciated how much time a component library like MUI can save. With ready-to-use UI primitives and advanced components out of the box, I didn’t have to spend time reinventing buttons, dialogs, or layouts.
      </Typography>

      <Typography color="text.secondary">
        All in all, this version was quicker and simpler to implement compared to the Redux + Tailwind version. I enjoyed working on both — they serve different goals and scales. The Redux version impressed me with its extensibility and architecture, while the React Query version won me over with its simplicity and speed.
      </Typography>
    </Box>
  );
};

export default FinalThoughts;