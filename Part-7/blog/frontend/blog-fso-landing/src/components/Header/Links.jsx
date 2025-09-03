import clsx from 'clsx';

const REDUX_URL = import.meta.env.VITE_REDUX_URL;
const QUERY_URL = import.meta.env.VITE_QUERY_URL;

const Links = () => {
  const linkStyles = clsx(
    'relative inline-block text-[#004a55] no-underline font-semibold',
    'transition-all duration-300 ease-in-out',
    'after:content-[""] after:absolute after:left-0 after:-bottom-1',
    'after:h-[3px] after:w-full after:bg-[#004a55]',
    'after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform',
    'hover:text-[#004a55]',
    'cursor-pointer'
  );

  return (
    <div>
      <ul className="flex flex-wrap items-center justify-center gap-3 text-base md:gap-6 md:text-xl">
        <li>
          <a href={REDUX_URL} target="_blank" rel="noopener noreferrer" className={linkStyles}>
            Blog (Redux ver.)
          </a>
        </li>
        <li>
          <a href={QUERY_URL} target="_blank" rel="noopener noreferrer" className={linkStyles}>
            Blog (Query ver.)
          </a>
        </li>
        <li>
          <a
            href="https://github.com/Saribeg/Full-Stack-Open/tree/main/Part-7/blog"
            target="_blank"
            rel="noopener noreferrer"
            className={linkStyles}
          >
            GitHub
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Links;
