import { useState, useContext } from 'react';
import { useNotification } from '../hooks';
import UserContext from '../contexts/UserContext';
import { loginUser } from '../utils/user';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const notify = useNotification();
  const { dispatchUser } = useContext(UserContext);

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };
  const resetForm = () => {
    setUsername('');
    setPassword('');
  };
  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const userData = await loginUser(dispatchUser, { username, password });
      resetForm();
      notify({
        message: `User ${userData.name} is successfully logged in`,
        type: 'success'
      });
    } catch (error) {
      notify({
        message: error.response?.data?.error || error.message,
        type: 'error'
      });
    }
  };

  return (
    <div className="form-container">
      <h2>Log In to see blogs and work with them</h2>
      <form onSubmit={handleLoginSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            className="form-input"
            type="text"
            id="username"
            name="username"
            required
            value={username}
            onChange={handleChange(setUsername)}
            data-testid="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            className="form-input"
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={handleChange(setPassword)}
            data-testid="password"
          />
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" id="login" data-testid="login">Login</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;