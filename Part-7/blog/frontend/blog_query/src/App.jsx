import { useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import UserData from './components/UserData';
import Users from './components/Users';
import UserDetails from './components/UserDetails';
import BlogSection from './components/BlogSection';
import Notification from './components/Notification/Notification';

import UserContext from './contexts/UserContext';
import { initializeUser } from './utils/user';

const App = () => {
  const { user, dispatchUser } = useContext(UserContext);

  useEffect(() => {
    initializeUser(dispatchUser);
  }, [dispatchUser]);

  return (
    <div>
      <h1 className="logo"><a className="logo-link" href="/">BlogsApp</a></h1>
      <Notification />
      {user
        ? (
          <>
            <UserData />
            <Routes>
              <Route path="/" element={<BlogSection />} />
              <Route path="blogs" element={<BlogSection />}/>
              <Route path="users/:id" element={<UserDetails />} />
              <Route path="users" element={<Users />}/>
            </Routes>
          </>
        )
        : (
          <LoginForm />
        )}
    </div>
  );
};

export default App;