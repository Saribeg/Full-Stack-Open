import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { selectAuth } from './../store/auth/selectors';
import AuthStatus from './Auth/AuthStatus';
import Logo from './Logo';

const Header = () => {
  const user = useSelector(selectAuth);

  const navLinkStyles = ({ isActive }) =>
    clsx(
      'text-xl px-4 py-2 leading-tight transition-colors duration-200',
      'border-b-4',
      isActive ? 'border-cyan-800' : 'border-transparent hover:border-[#132e45]'
    );

  return (
    <header className="h-[88px] rounded-xl border-b border-white/10 bg-[#0b1120] shadow-inner shadow-black/30">
      <div className="mx-auto flex h-full max-w-screen-xl items-center justify-between px-4 sm:px-6 xl:px-8">
        <Logo />
        {user && (
          <nav className="mx-auto flex gap-6">
            <NavLink to="/blogs" className={navLinkStyles}>
              Blogs
            </NavLink>
            <NavLink to="/users" className={navLinkStyles}>
              Users
            </NavLink>
          </nav>
        )}
        {user && <AuthStatus user={user} />}
      </div>
    </header>
  );
};

export default Header;
