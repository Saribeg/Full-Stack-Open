import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoginStatus } from '../../store/auth/selectors';
import { selectNotificationPlacement } from '../../store/notification/selectors';
import { login } from '../../store/auth/thunks';
import Logo from '../Logo';
import Input from '../ui/Form/Input';
import Button from '../ui/Form/Button';
import Form from '../ui/Form/Form';
import Notification from '../Notification';

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
  const notificationPlacement = useSelector(selectNotificationPlacement);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-10">
        <Logo large />
        <div className="flex w-full flex-col gap-6">
          <p className="text-center text-white/70">Log In to see blogs and work with them</p>

          <Form onSubmit={handleLoginSubmit}>
            <Input
              type="text"
              name="username"
              value={username}
              onChange={handleChange(setUsername)}
              placeholder="Username"
              required
            />
            <Input
              type="password"
              name="password"
              value={password}
              onChange={handleChange(setPassword)}
              placeholder="Password"
              required
            />
            <Button
              uiType="primary"
              type="submit"
              id="login"
              data-testid="login"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <div className="min-h-[92px]">
              {notificationPlacement === 'loginForm' && <Notification />}
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
