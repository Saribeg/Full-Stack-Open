import AboutProject from './AboutProject';
import Technologies from './Technologies';
import ProjectGoals from './ProjectGoals';
import ChallengesAndLessons from './ChallengesAndLessons';
import FinalThoughts from './FinalThoughts';

const About = () => {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-8">
      <AboutProject />
      <Technologies />
      <ProjectGoals />
      <ChallengesAndLessons />
      <FinalThoughts />
    </div>
  );
};

export default About;
