import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoginStatus } from '../../store/auth/selectors';
import { login } from '../../store/auth/thunks';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
  };

  const dispatch = useDispatch();
  const handleLoginSubmit = (event) => {
    event.preventDefault();
    dispatch(login({ username, password }))
      .unwrap()
      .then(() => resetForm());
  };

  const { loading } = useSelector(selectLoginStatus);

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
          <button
            className="btn btn-primary"
            type="submit"
            id="login"
            data-testid="login"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
