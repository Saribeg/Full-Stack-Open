import logo from '../../assets/logo.png';

const Logo = () => (
  <div className="flex cursor-default items-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:opacity-90">
    <img src={logo} alt="Site Logo" className="h-[100px] w-[100px]" />
    <span className="text-xl font-semibold tracking-tight text-[#003138]">FSO Blog Project</span>
  </div>
);

export default Logo;
