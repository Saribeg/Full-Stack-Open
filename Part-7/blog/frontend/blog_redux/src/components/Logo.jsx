import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Logo = ({ large = false }) => {
  const size = large ? 'h-[250px] w-[250px]' : 'h-[64px] w-[64px] sm:h-[80px] sm:w-[80px]';

  return (
    <Link to="/" className="group inline-flex w-max flex-col items-center gap-2 select-none">
      <img
        src={logo}
        alt="Logo"
        className={clsx('pointer-events-none rounded-xl shadow-md', size)}
      />
      {large && (
        <h1 className="font-logo mt-4 transform-gpu text-4xl leading-none font-bold tracking-wide text-white transition-transform duration-200 ease-in-out will-change-transform group-hover:scale-[1.5]">
          BlogsApp
        </h1>
      )}
    </Link>
  );
};

Logo.propTypes = {
  large: PropTypes.bool
};

export default Logo;
