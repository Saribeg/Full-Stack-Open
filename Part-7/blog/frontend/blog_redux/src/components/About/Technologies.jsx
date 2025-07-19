import { FaTools } from 'react-icons/fa';
import {
  SiReact,
  SiRedux,
  SiReactrouter,
  SiTailwindcss,
  SiVite,
  SiAxios,
  SiJavascript,
  SiEslint,
  SiPrettier
} from 'react-icons/si';
import Section from './Section';

const technologies = [
  { icon: SiReact, label: 'React', url: 'https://github.com/facebook/react' },
  { icon: SiRedux, label: 'Redux Toolkit', url: 'https://github.com/reduxjs/redux-toolkit' },
  { icon: SiReactrouter, label: 'React Router', url: 'https://github.com/remix-run/react-router' },
  {
    icon: SiTailwindcss,
    label: 'Tailwind CSS',
    url: 'https://github.com/tailwindlabs/tailwindcss'
  },
  { icon: SiVite, label: 'Vite', url: 'https://github.com/vitejs/vite' },
  { icon: SiAxios, label: 'Axios', url: 'https://github.com/axios/axios' },
  {
    icon: SiJavascript,
    label: 'JavaScript',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
  },
  { icon: SiEslint, label: 'ESLint', url: 'https://github.com/eslint/eslint' },
  { icon: SiPrettier, label: 'Prettier', url: 'https://github.com/prettier/prettier' }
];

const Technologies = () => {
  return (
    <Section icon={FaTools} title="Technologies Used">
      <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5">
        {technologies.map(({ icon: Icon, label, url }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center text-center transition-transform hover:scale-110"
          >
            <Icon
              size={48}
              className="text-white transition group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]"
            />
            <span className="mt-2 text-lg text-white transition group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]">
              {label}
            </span>
          </a>
        ))}
      </div>
    </Section>
  );
};

export default Technologies;
