import PropTypes from 'prop-types';
import { useState } from 'react';
import { setToken } from '../services/api';
import loginService from '../services/login';

const LoginForm = ({ setUser, notify }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUserNameChange = ({ target }) => setUsername(target.value);
  const handlePasswordChange = ({ target }) => setPassword(target.value);
  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const userData = await loginService.login({ username, password });
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setToken(userData.token);
      setUsername('');
      setPassword('');
      notify({
        message: `User ${userData.name} is successfully logged in`,
        type: 'success'
      });
    } catch (error) {
      notify({
        message: error.message,
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
            onChange={handleUserNameChange}
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
            onChange={handlePasswordChange}
            data-testid="password"
          />
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" id="login" data-testid="login">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

LoginForm.propTypes = {
  setUser: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired
};
