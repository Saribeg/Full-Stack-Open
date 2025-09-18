import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Logo from '../Logo';
import Input from '../ui/Form/Input';
import Button from '../ui/Form/Button';
import Form from '../ui/Form/Form';
import InlineNotification from '../Notification/InlineNotification';
import TextLink from '../ui/TextLink';

import { registerUser } from '../../store/users/thunks';
import { selectRegisterStatus } from '../../store/users/selectors';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const { loading } = useSelector(selectRegisterStatus);

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const resetForm = () => {
    setUsername('');
    setName('');
    setPassword('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ username, name, password }))
      .unwrap()
      .then(() => {
        resetForm();
        navigate('/');
      })
      .catch(() => {});
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-10">
        <Logo large />
        <div className="flex w-full flex-col gap-6">
          <p className="text-center text-white/70">Register to start using BlogApp</p>

          <Form onSubmit={handleSubmit} data-testid="register-form">
            <Input
              type="text"
              name="username"
              value={username}
              onChange={handleChange(setUsername)}
              placeholder="Username"
              required
              data-testid="register-username"
            />
            <Input
              type="text"
              name="name"
              value={name}
              onChange={handleChange(setName)}
              placeholder="Full Name"
              required
              data-testid="register-name"
            />
            <Input
              type="password"
              name="password"
              value={password}
              onChange={handleChange(setPassword)}
              placeholder="Password"
              required
              data-testid="register-password"
            />
            <Button
              uiType="primary"
              type="submit"
              id="register"
              data-testid="register"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
            <p className="mt-4 text-center text-white/70">
              Already have an account? <TextLink to="/login">Log in here</TextLink>
            </p>
            <InlineNotification placement="RegisterForm" />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
