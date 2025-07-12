import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { safeParseJSON, modifyArray } from './utils/commonHelpers';
import { setToken } from './services/api';
import LoginForm from './components/LoginForm';
import blogService from './services/blogs';
import UserData from './components/UserData';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification/Notification';
import Togglable from './components/Togglable/Togglable';
import { setNotification } from './store/reducers/notificationReducer';

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const blogFormRef = useRef();

  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  const notify = ({ message, type = 'success' }) => {
    dispatch(setNotification(message, type, 5));
  };

  const modifyBlogs = (operationType, blogData) =>
    setBlogs((prevBlogs) => modifyArray(prevBlogs, operationType, blogData));

  useEffect(() => {
    blogService.getAll().then((blogs) => {
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
      <h1 className="logo">
        <a className="logo-link" href="/">
          BlogsApp
        </a>
      </h1>
      {notification && <Notification message={notification.message} type={notification.type} />}
      {user ? (
        <>
          <UserData user={user} setUser={setUser} />
          <BlogList blogs={blogs} user={user} modifyBlogs={modifyBlogs} notify={notify} />
          <Togglable buttonLabel="New Blog" ref={blogFormRef}>
            <BlogForm
              modifyBlogs={modifyBlogs}
              notify={notify}
              toggleForm={() => blogFormRef.current.toggleVisibility()}
            />
          </Togglable>
        </>
      ) : (
        <LoginForm setUser={setUser} notify={notify} />
      )}
    </div>
  );
};

export default App;
