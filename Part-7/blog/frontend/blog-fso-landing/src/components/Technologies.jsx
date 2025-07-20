import {
  SiReact,
  SiRedux,
  SiExpress,
  SiMongodb,
  SiVite,
  SiTailwindcss,
  SiMui,
  SiJavascript,
  SiEslint,
  SiPrettier,
  SiAxios,
  SiTestinglibrary,
  SiVitest,
  SiReactrouter,
  SiNodedotjs,
  SiVercel
} from 'react-icons/si';
import { FaServer } from 'react-icons/fa';
import { FaCloud } from 'react-icons/fa6';

const technologies = [
  { icon: SiReact, label: 'React', url: 'https://github.com/facebook/react' },
  { icon: SiRedux, label: 'Redux Toolkit', url: 'https://github.com/reduxjs/redux-toolkit' },
  { icon: SiReactrouter, label: 'React Router', url: 'https://github.com/remix-run/react-router' },
  {
    icon: SiTailwindcss,
    label: 'Tailwind CSS',
    url: 'https://github.com/tailwindlabs/tailwindcss'
  },
  { icon: SiMui, label: 'Material UI', url: 'https://github.com/mui/material-ui' },
  { icon: SiVite, label: 'Vite', url: 'https://github.com/vitejs/vite' },
  { icon: SiAxios, label: 'Axios', url: 'https://github.com/axios/axios' },
  {
    icon: SiJavascript,
    label: 'JavaScript',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
  },
  { icon: SiEslint, label: 'ESLint', url: 'https://github.com/eslint/eslint' },
  { icon: SiPrettier, label: 'Prettier', url: 'https://github.com/prettier/prettier' },
  { icon: SiVitest, label: 'Vitest', url: 'https://github.com/vitest-dev/vitest' },
  {
    icon: SiTestinglibrary,
    label: 'Testing Library',
    url: 'https://github.com/testing-library/react-testing-library'
  },
  { icon: SiNodedotjs, label: 'Node.js', url: 'https://github.com/nodejs/node' },
  { icon: SiExpress, label: 'Express', url: 'https://github.com/expressjs/express' },
  { icon: SiMongodb, label: 'MongoDB', url: 'https://www.mongodb.com' },
  { icon: FaCloud, label: 'Fly.io', url: 'https://fly.io' },
  { icon: SiVercel, label: 'Vercel', url: 'https://vercel.com' }
];

const Technologies = () => {
  return (
    <section className="mt-4 w-full bg-white p-4 md:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="mb-15 flex items-center justify-center gap-2 text-2xl font-bold text-[#004a55]">
          <FaServer className="text-[#004a55]" size={24} />
          Technologies Used
        </h2>
        <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {technologies.map(({ icon: Icon, label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center text-center transition-transform hover:scale-120"
            >
              <Icon
                size={42}
                className="text-[#004a55] transition group-hover:text-[#007e8c] group-hover:drop-shadow-md"
              />
              <span className="mt-2 text-sm font-medium text-gray-700 group-hover:text-[#007e8c]">
                {label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Technologies;
