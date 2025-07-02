import { useState, useEffect, useRef } from 'react';
import { safeParseJSON } from './utils/commonHelpers';
import { setToken } from './services/api';
import LoginForm from './components/LoginForm';
import blogService from './services/blogs';
import UserData from './components/UserData';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

import './index.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const [notification, setNotification] = useState({ message: null, type: null });
  const blogFormRef = useRef();

  const notify = ({ message, type = 'success' }) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: null, type: null }), 3000);
  };

  const updateBlog = (updatedBlog) => {
    setBlogs(prevBlogs =>
      prevBlogs
        .map(b => b.id === updatedBlog.id ? updatedBlog : b)
        .sort((a, b) => b.likes - a.likes)
    );
  };

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sorted = [...blogs].sort((a, b) => b.likes - a.likes);
      setBlogs(sorted);
    });
  }, []);

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
      <Notification
        message={notification.message}
        type={notification.type}
      />
      {user
        ? (
          <>
            <UserData user={user} setUser={setUser}/>
            <BlogList blogs={blogs} updateBlog={updateBlog} notify={notify}/>
            <Togglable buttonLabel="New Blog" ref={blogFormRef}>
              <BlogForm
                setBlogs={setBlogs}
                notify={notify}
                toggleForm={() => blogFormRef.current.toggleVisibility()}
              />
            </Togglable>
          </>
        )
        : (
          <LoginForm
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            setUser={setUser}
            notify={notify}
          />
        )}
    </div>
  );
};

export default App;