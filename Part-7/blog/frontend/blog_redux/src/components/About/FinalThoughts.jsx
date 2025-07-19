import { FaRegSmileBeam } from 'react-icons/fa';
import Section from './Section';

const FinalThoughts = () => {
  return (
    <Section icon={FaRegSmileBeam} title="Final Thoughts">
      <div className="space-y-4 text-cyan-100/80">
        <p>
          I genuinely enjoy architectural challenges and abstract problem solving. This project gave
          me the opportunity to think deeply about maintainability, reusability, and developer
          experience — not just “getting things to work,” but making them feel right.
        </p>
        <p>
          Special thanks to the{' '}
          <a
            href="https://fullstackopen.com/en/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Full Stack Open
          </a>{' '}
          team for creating a thoughtful curriculum with practical and real-world tasks.
        </p>
      </div>
    </Section>
  );
};

export default FinalThoughts;
