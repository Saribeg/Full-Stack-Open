import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoginForm from './components/LoginForm';
import UserData from './components/UserData';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification/Notification';
import Togglable from './components/Togglable/Togglable';
import { setNotification } from './store/reducers/notificationReducer';
import { initializeUser } from './store/reducers/userReducer';

const App = () => {
  const blogFormRef = useRef();
  const user = useSelector((state) => state.user);
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  const notify = ({ message, type = 'success' }) => {
    dispatch(setNotification(message, type, 5));
  };

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  return (
    <div>
      <h1 className="logo">
        <a className="logo-link" href="/">
          BlogsApp
        </a>
      </h1>
      {notification && <Notification message={notification.message} type={notification.type} />}
      {user ? (
        <>
          <UserData />
          <BlogList notify={notify} />
          <Togglable buttonLabel="New Blog" ref={blogFormRef}>
            <BlogForm notify={notify} toggleForm={() => blogFormRef.current.toggleVisibility()} />
          </Togglable>
        </>
      ) : (
        <LoginForm notify={notify} />
      )}
    </div>
  );
};

export default App;
