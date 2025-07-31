import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { jwtDecode } from "jwt-decode";
import { LOGIN } from '../graphql'

const LoginForm = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0]?.message || 'Login failed');
    },
    onCompleted: (data) => {
      const token = data.login.value;
      props.setToken(token);
      localStorage.setItem('library-user-token', token);
      const decoded = jwtDecode(token);
      props.setUser(decoded)
      setUsername('');
      setPassword('');
      props.setPage('authors');
    },
  });

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
