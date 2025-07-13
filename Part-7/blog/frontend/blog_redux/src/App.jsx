import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import LoginForm from './components/LoginForm';
import Users from './components/Users';
import UserDetails from './components/UserDetails';
import BlogSection from './components/BlogSection';
import BlogDetails from './components/BlogDetails/BlogDetails';
import Notification from './components/Notification/Notification';
import { initializeUser } from './store/reducers/authReducer';

const App = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  return (
    <div>
      <Header />
      <Notification />
      {user ? (
        <Routes>
          <Route path="/" element={<BlogSection />} />
          <Route path="blogs" element={<BlogSection />} />
          <Route path="blogs/:id" element={<BlogDetails />} />
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="users" element={<Users />} />
        </Routes>
      ) : (
        <LoginForm />
      )}
    </div>
  );
};

export default App;
