import { Link } from 'react-router-dom';
import page404 from '../assets/404-full.png';
import GoHomeBtn from '../assets/GoHomeBtn.png';

const NotFound = () => {
  return (
    <div
      className="relative flex h-screen items-center justify-center bg-[#0b1120] text-cyan-300"
      style={{
        backgroundImage: `url(${page404})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      <Link
        to="/"
        className="absolute bottom-[10%] left-[40%] w-[200px] -translate-x-1/2 sm:w-[250px] md:w-[300px] lg:w-[400px]"
      >
        <img src={GoHomeBtn} alt="Go home" className="h-auto w-full" />
      </Link>
    </div>
  );
};

export default NotFound;
