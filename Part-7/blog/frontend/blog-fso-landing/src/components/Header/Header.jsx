import { FaHeart } from 'react-icons/fa';
import Logo from './Logo';
import Links from './Links';

const Header = () => {
  return (
    <header className="w-full bg-gray-200">
      <div className="mx-auto flex w-[90%] items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3 text-xl font-medium text-[#004a55]">
          <span>Made with</span>
          <FaHeart className="text-2xl text-red-500" />
        </div>
        <Links />
      </div>
    </header>
  );
};

export default Header;
