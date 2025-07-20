import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-200 px-4 py-6 text-center text-sm text-[#004a55]">
      <p className="flex items-center justify-center gap-2">
        <span>© {new Date().getFullYear()} Made with</span>
        <FaHeart className="text-red-500" />
        <span>
          as part of{' '}
          <a
            href="https://fullstackopen.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition hover:text-[#007e8c]"
          >
            Full Stack Open
          </a>
        </span>
      </p>
    </footer>
  );
};

export default Footer;
