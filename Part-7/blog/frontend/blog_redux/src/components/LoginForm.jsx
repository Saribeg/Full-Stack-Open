import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/reducers/userReducer';

const LoginForm = ({ notify }) => {
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
  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const userData = await dispatch(loginUser({ username, password }));
      resetForm();
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
  notify: PropTypes.func.isRequired
};
