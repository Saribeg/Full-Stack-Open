import { FaTools } from 'react-icons/fa';

const AboutProject = () => {
  return (
    <section className="mt-4 w-full bg-white p-4 md:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 flex items-center justify-center gap-2 text-2xl font-bold text-[#004a55]">
          <FaTools className="inline-block text-[#004a55]" size={24} />
          About the Project
        </h2>
        <p className="text-base leading-relaxed text-gray-700 md:text-lg">
          This full-stack blog application was built as part of the{' '}
          <a
            href="https://fullstackopen.com/en/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#004a55] underline underline-offset-2 hover:text-[#00788d]"
          >
            Full Stack Open
          </a>{' '}
          course, covering parts 1 through 7. It includes both frontend and backend implementations.
        </p>

        <p className="mt-6 text-base leading-relaxed text-gray-700 md:text-lg">
          The backend is built with <strong>Node.js</strong>, <strong>Express</strong>, and{' '}
          <strong>MongoDB</strong>. The frontend is developed in two separate versions — one using{' '}
          <strong>Redux</strong> with <strong>Tailwind CSS</strong>, and the other using{' '}
          <strong>TanStack Query</strong> with <strong>Material UI</strong>. Each version includes
          its own <em>About</em> page where I share insights and implementation notes.
        </p>

        <p className="mt-6 text-base leading-relaxed text-gray-700 md:text-lg">
          This landing page was added to showcase the project and provide convenient access to the
          deployed sites and repository.
        </p>

        <div className="mt-6 text-left text-base leading-relaxed text-gray-700 md:text-lg">
          <p className="mb-2">The deployment setup is as follows:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>Backend</strong>: Hosted on <code>Fly.io</code>
            </li>
            <li>
              <strong>Frontends</strong>: All three (Redux, Query, and this landing) are deployed
              separately on <code>Vercel</code>
            </li>
          </ul>
        </div>

        <p className="mt-6 text-base leading-relaxed text-gray-700 md:text-lg">
          Each frontend version uses an environment-based url to Fly.io setting that is used in
          Axios to connect to the backend.
        </p>

        <p className="mt-6 text-base leading-relaxed text-gray-700 md:text-lg">
          Hopefully this project can be useful for learning purposes — especially if you’re also
          going through the Full Stack Open course.
        </p>
      </div>
    </section>
  );
};

export default AboutProject;
