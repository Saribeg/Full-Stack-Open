import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoginForm from './components/LoginForm';
import UserData from './components/UserData';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification/Notification';
import Togglable from './components/Togglable/Togglable';
import { initializeUser } from './store/reducers/userReducer';

const App = () => {
  const blogFormRef = useRef();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

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
      <Notification />
      {user ? (
        <>
          <UserData />
          <BlogList />
          <Togglable buttonLabel="New Blog" ref={blogFormRef}>
            <BlogForm toggleForm={() => blogFormRef.current.toggleVisibility()} />
          </Togglable>
        </>
      ) : (
        <LoginForm />
      )}
    </div>
  );
};

export default App;
