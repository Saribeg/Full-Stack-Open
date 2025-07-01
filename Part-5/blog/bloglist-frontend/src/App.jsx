import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import blogService from './services/blogs';
import UserData from './components/UserData';
import BlogList from './components/BlogList';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    );
  }, []);

  return (
    <div>
      {user
        ? (
          <>
            <UserData user={user} />
            <BlogList blogs={blogs} />
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