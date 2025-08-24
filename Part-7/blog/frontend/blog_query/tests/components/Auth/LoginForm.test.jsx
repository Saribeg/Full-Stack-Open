import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../../../src/components/Auth/LoginForm';
import { renderWithContextUser } from '../../utils/hocs';
import { useNotification } from '../../../src/hooks';
import { loginUser } from '../../../src/utils/user';

vi.mock('../../../src/hooks', () => ({
  useNotification: vi.fn(),
}));

vi.mock('../../../src/utils/user', () => ({
  loginUser: vi.fn(),
}));

describe('LoginForm component', () => {
  let dispatchUser;
  let notify;

  beforeEach(() => {
    dispatchUser = vi.fn();
    notify = vi.fn();
    (useNotification).mockReturnValue(notify);
  });

  it('renders username, password fields and login button', () => {
    renderWithContextUser(<LoginForm />, { dispatchUser });

    expect(screen.getByTestId('username')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByTestId('login')).toBeInTheDocument();
  });

  it('submits form and shows success notification', async () => {
    loginUser.mockResolvedValueOnce({ name: 'Test User' });

    renderWithContextUser(<LoginForm />, { dispatchUser });

    await userEvent.type(screen.getByTestId('username'), 'testuser');
    await userEvent.type(screen.getByTestId('password'), 'password123');
    fireEvent.click(screen.getByTestId('login'));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith(dispatchUser, {
        username: 'testuser',
        password: 'password123',
      });
      expect(notify).toHaveBeenCalledWith({
        message: 'Welcome, Test User! 😊',
        type: 'success',
      });
    });

    expect(screen.getByTestId('username')).toHaveValue('');
    expect(screen.getByTestId('password')).toHaveValue('');
  });

  it('shows error notification if login fails', async () => {
    loginUser.mockRejectedValueOnce({
      response: { data: { error: 'Invalid credentials' } },
    });

    renderWithContextUser(<LoginForm />, { dispatchUser });

    await userEvent.type(screen.getByTestId('username'), 'wrong');
    await userEvent.type(screen.getByTestId('password'), 'wrongpass');
    fireEvent.click(screen.getByTestId('login'));

    await waitFor(() => {
      expect(notify).toHaveBeenCalledWith({
        message: 'Invalid credentials',
        type: 'error',
        duration: 10000,
      });
    });
  });
});
