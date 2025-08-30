import { FaInfoCircle } from 'react-icons/fa';
import Section from './Section';
import NativeLink from '../ui/NativeLink';

const AboutProject = () => (
  <Section icon={FaInfoCircle} title="About This Project">
    <p>
      This is a learning project built as part of the{' '}
      <NativeLink href="https://fullstackopen.com/en/" target="_blank" rel="noopener noreferrer">
        Full Stack Open
      </NativeLink>{' '}
      course by the University of Helsinki. It represents the Parts 1 - 7 implementation of the blog
      application using <strong>Redux Toolkit</strong> for state management and{' '}
      <strong>Tailwind CSS</strong> for styling. This version focuses on building a centralized,
      scalable architecture with Redux slices, thunks for asynchronous logic, and a modular
      component structure. It also includes custom error handling and notification logic designed to
      reduce boilerplate and improve developer experience.
    </p>
  </Section>
);

export default AboutProject;
