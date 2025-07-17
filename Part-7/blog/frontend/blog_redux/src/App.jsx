import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LoginForm from './components/Auth/LoginForm';
import Users from './components/User/Users';
import UserDetails from './components/User/UserDetails';
import BlogSection from './components/Blog/BlogSection';
import BlogDetails from './components/Blog/BlogDetails';
import Notification from './components/Notification';
import NotFound from './components/NotFound';
import { initialize } from './store/auth/thunks';
import { selectAuth } from './store/auth/selectors';
import { selectNotificationPlacement } from './store/notification/selectors';
import ModalHost from './components/ModalHost';

const App = () => {
  const user = useSelector(selectAuth);
  const notificationPlacement = useSelector(selectNotificationPlacement);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initialize());
  }, [dispatch]);

  return (
    <div>
      <ModalHost />
      <div className="container mx-auto my-4 px-4 sm:px-6 lg:px-8">
        {user && <Header />}
        {notificationPlacement === 'global' && <Notification />}
        {user ? (
          <Routes>
            <Route path="/" element={<BlogSection />} />
            <Route path="blogs" element={<BlogSection />} />
            <Route path="blogs/:id" element={<BlogDetails />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="users" element={<Users />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};

export default App;
