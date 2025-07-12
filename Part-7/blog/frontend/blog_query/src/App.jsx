import { useState, useEffect, useRef } from 'react';
import { safeParseJSON } from './utils/commonHelpers';
import { setToken } from './services/api';
import LoginForm from './components/LoginForm';
import UserData from './components/UserData';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification/Notification';
import Togglable from './components/Togglable/Togglable';

const App = () => {
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    const userJSON = window.localStorage.getItem('user');
    const user = safeParseJSON(userJSON);

    if (user && user.token) {
      setUser(user);
      setToken(user.token);
    }
  }, []);

  return (
    <div>
      <h1 className="logo"><a className="logo-link" href="/">BlogsApp</a></h1>
      <Notification />
      {user
        ? (
          <>
            <UserData user={user} setUser={setUser}/>
            <BlogList
              user={user}
            />
            <Togglable buttonLabel="New Blog" ref={blogFormRef}>
              <BlogForm
                toggleForm={() => blogFormRef.current.toggleVisibility()}
              />
            </Togglable>
          </>
        )
        : (
          <LoginForm
            setUser={setUser}
          />
        )}
    </div>
  );
};

export default App;