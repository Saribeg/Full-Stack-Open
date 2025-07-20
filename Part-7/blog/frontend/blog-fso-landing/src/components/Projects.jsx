import { FaProjectDiagram } from 'react-icons/fa';
import reduxPreview from '../assets/redux-preview.png';
import queryPreview from '../assets/query-preview.png';

const projects = [
  {
    label: 'Explore Blog App based on Redux and Tailwind CSS',
    img: reduxPreview,
    url: 'https://blogs-redux-fso.vercel.app/'
  },
  {
    label: 'Explore Blog App based on React Query and Material UI',
    img: queryPreview,
    url: 'https://blogs-query-fso.vercel.app/'
  }
];

const Projects = () => {
  return (
    <section className="w-full bg-white px-4 py-12 md:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="mb-12 flex items-center justify-center gap-2 text-2xl font-bold text-[#004a55]">
          <FaProjectDiagram size={24} className="text-[#004a55]" />
          Projects
        </h2>

        <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
          {projects.map(({ label, img, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-lg border border-gray-300 transition-transform hover:scale-[1.015] hover:shadow-lg"
            >
              <div className="border-b border-gray-300">
                <div className="aspect-[4/3] w-full">
                  <img
                    src={img}
                    alt={label}
                    className="h-full w-full object-cover transition group-hover:brightness-105"
                  />
                </div>
              </div>
              <div className="px-4 py-3 text-center text-base font-medium text-[#004a55] transition group-hover:text-[#007e8c] md:text-lg">
                {label}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
