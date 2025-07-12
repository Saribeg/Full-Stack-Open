import { useEffect, useRef, useContext } from 'react';
import LoginForm from './components/LoginForm';
import UserData from './components/UserData';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification/Notification';
import Togglable from './components/Togglable/Togglable';
import UserContext from './contexts/UserContext';
import { initializeUser } from './utils/user';

const App = () => {
  const { user, dispatchUser } = useContext(UserContext);
  const blogFormRef = useRef();

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
            <BlogList />
            <Togglable buttonLabel="New Blog" ref={blogFormRef}>
              <BlogForm
                toggleForm={() => blogFormRef.current.toggleVisibility()}
              />
            </Togglable>
          </>
        )
        : (
          <LoginForm />
        )}
    </div>
  );
};

export default App;