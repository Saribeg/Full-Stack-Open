import { useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import LoginForm from './components/Auth/LoginForm';
import Users from './components/User/Users';
import UserDetails from './components/User/UserDetails';
import BlogSection from './components/Blog/BlogSection';
import BlogDetails from './components/Blog/BlogDetails/BlogDetails';
import Notification from './components/Notification/Notification';
import NotFound from './components/NotFound';

import UserContext from './contexts/UserContext';
import { initializeUser } from './utils/user';

const App = () => {
  const { user, dispatchUser } = useContext(UserContext);

  useEffect(() => {
    initializeUser(dispatchUser);
  }, [dispatchUser]);

  return (
    <div>
      <Header />
      <Notification />
      {user
        ? (
          <Routes>
            <Route path="/" element={<BlogSection />} />
            <Route path="blogs" element={<BlogSection />}/>
            <Route path="blogs/:id" element={<BlogDetails />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="users" element={<Users />}/>
            <Route path="*" element={<NotFound />} />
          </Routes>
        )
        : (
          <LoginForm />
        )}
    </div>
  );
};

export default App;