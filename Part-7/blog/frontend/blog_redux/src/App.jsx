import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Notification from './components/Notification/Notification';
import ModalHost from './components/ModalHost';
import Header from './components/Header';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import About from './components/About/About';
import Users from './components/User/Users';
import UserDetails from './components/User/UserDetails';
import BlogSection from './components/Blog/BlogSection';
import BlogDetails from './components/Blog/BlogDetails';
import NotFound from './components/NotFound';

import { selectAuth } from './store/auth/selectors';
import { selectNotificationPlacement } from './store/notification/selectors';

const App = () => {
  const user = useSelector(selectAuth);
  const notificationPlacement = useSelector(selectNotificationPlacement);

  return (
    <div>
      <ModalHost />
      <div className="container mx-auto my-4 px-4 sm:px-6 lg:px-8">
        {user && <Header />}
        {notificationPlacement === 'global' && <Notification />}

        <Routes>
          {!user && (
            <>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </>
          )}

          {user && (
            <>
              <Route path="/" element={<BlogSection />} />
              <Route path="/about" element={<About />} />
              <Route path="/blogs" element={<BlogSection />} />
              <Route path="/blogs/:id" element={<BlogDetails />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<UserDetails />} />
            </>
          )}

          <Route path="*" element={user ? <NotFound /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
