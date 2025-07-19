import { FaBullseye } from 'react-icons/fa';
import NativeLink from '../ui/NativeLink';
import Section from './Section';

const ProjectGoals = () => {
  return (
    <Section icon={FaBullseye} title="Project Goals">
      <div className="text-cyan-100/80">
        <p className="mb-4">
          The goal of this project was to implement a blog application based on the official
          requirements from Parts 1 - 7 of the{' '}
          <NativeLink
            href="https://fullstackopen.com/en/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Full Stack Open
          </NativeLink>{' '}
          course. While the functional scope was predefined, I focused on applying scalable
          architectural patterns, keeping the codebase maintainable and modular.
        </p>

        <ul className="mb-4 list-inside list-disc space-y-1">
          <li>DRY principles and reusability</li>
          <li>Centralized error handling and state logic</li>
          <li>Clean component structure</li>
          <li>Thoughtful feature planning without unnecessary complexity</li>
        </ul>

        <p className="mb-4">
          I intentionally avoided adding extra features beyond the course requirements in order to
          stay focused and finish within a reasonable timeframe — but I aimed to implement every
          required feature with care and quality.
        </p>

        <p className="mb-4">
          For styling, I chose <strong>Tailwind CSS</strong>, a utility-first CSS framework that has
          become one of the most popular choices in modern frontend development. According to GitHub
          and developer surveys like{' '}
          <NativeLink
            href="https://2023.stateofcss.com/en-US/technologies/css-frameworks/"
            target="_blank"
            rel="noopener noreferrer"
          >
            State of CSS
          </NativeLink>
          , Tailwind is consistently among the top frameworks in terms of usage and satisfaction. It
          integrates well with Vite and React, and encourages consistent styling without writing
          custom CSS.
        </p>

        <p>
          If the final result feels solid, consistent, and maintainable — then I consider my goals
          achieved.{' '}
          <span role="img" aria-label="smile">
            😊
          </span>
        </p>
      </div>
    </Section>
  );
};

export default ProjectGoals;
