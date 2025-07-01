import { useState, useEffect } from 'react';
import { safeParseJSON } from './utils/commonHelpers';
import { setToken } from './services/api';
import LoginForm from './components/LoginForm';
import blogService from './services/blogs';
import UserData from './components/UserData';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogUrl, setBlogUrl] = useState('');

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
          />
        )}
    </div>
  );
};

export default App;