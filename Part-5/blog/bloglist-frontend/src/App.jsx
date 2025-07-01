import { useState, useEffect } from 'react';
import { safeParseJSON } from './utils/commonHelpers';
import { setToken } from './services/api';
import LoginForm from './components/LoginForm';
import blogService from './services/blogs';
import UserData from './components/UserData';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';

import './index.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogUrl, setBlogUrl] = useState('');
  const [notification, setNotification] = useState({ message: null, type: null });

  const notify = ({ message, type = 'success' }) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: null, type: null }), 3000);
  };

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    );
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
            <BlogList blogs={blogs} />
            <BlogForm
              blogTitle={blogTitle}
              setBlogTitle={setBlogTitle}
              blogAuthor={blogAuthor}
              setBlogAuthor={setBlogAuthor}
              blogUrl={blogUrl}
              setBlogUrl={setBlogUrl}
              setBlogs={setBlogs}
              notify={notify}
            />
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