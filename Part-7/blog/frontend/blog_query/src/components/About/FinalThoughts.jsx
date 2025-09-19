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
        A clear takeaway is that for smaller apps, Redux can introduce unnecessary overhead. React Query handled server-side state with less boilerplate, fewer moving parts, and a faster development cycle.
      </Typography>

      <Typography paragraph color="text.secondary">
        This project confirmed my earlier experience: using MUI significantly reduces implementation time for common UI needs. With ready-to-use primitives and advanced components out of the box, I didn’t have to spend time reinventing buttons, dialogs, or layouts.
      </Typography>


      <Typography color="text.secondary">
        All in all, this version was quicker and simpler to implement compared to the Redux + Tailwind version. I enjoyed working on both — they serve different goals and scales. The Redux version stood out for its extensibility and architectural depth, while the React Query version proved more efficient in terms of simplicity and development speed.
      </Typography>
    </Box>
  );
};

export default FinalThoughts;