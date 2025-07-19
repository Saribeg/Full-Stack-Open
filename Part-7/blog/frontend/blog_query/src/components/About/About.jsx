import { Box } from '@mui/material';
import AboutProject from './AboutProject';
import Technologies from './Technologies';
import ProjectGoals from './ProjectGoals';
import ChallengesAndLessons from './ChallengesAndLessons';
import FinalThoughts from './FinalThoughts';

const About = () => {
  return (
    <Box maxWidth="md" mx="auto" px={2} py={4}>
      <AboutProject />
      <Technologies />
      <ProjectGoals />
      <ChallengesAndLessons />
      <FinalThoughts />
    </Box>
  );
};

export default About;
