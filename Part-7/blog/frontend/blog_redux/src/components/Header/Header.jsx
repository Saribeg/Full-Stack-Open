import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../store/auth/selectors';
import AuthStatus from '../AuthStatus/AuthStatus';
import './Header.css';

const Header = () => {
  const user = useSelector(selectAuth);

  return (
    <div className="header">
      <h1 className="logo">
        <Link to="/" className="logo-link">
          BlogsApp
        </Link>
      </h1>
      {user && (
        <>
          <div className="navigation">
            <NavLink
              to="/blogs"
              className={({ isActive }) => (isActive ? 'active nav-link' : 'nav-link')}
            >
              Blogs
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) => (isActive ? 'active nav-link' : 'nav-link')}
            >
              Users
            </NavLink>
          </div>
          <AuthStatus user={user} />
        </>
      )}
    </div>
  );
};

export default Header;
